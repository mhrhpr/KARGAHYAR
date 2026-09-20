import * as SQLite from "expo-sqlite";
import { supabase } from "./supabase";

export type WorkerReportOperation = {
  kind: "worker_entry";
  projectId: string;
  reportDate: string;
  workerId: string;
  attendanceFactor: 0 | 0.5 | 1;
  overtimeHours: number;
  overtimeAmount: number;
  advance: number;
  payable: number;
};

export type ContractorReportOperation = {
  kind: "contractor_entry";
  projectId: string;
  reportDate: string;
  contractorId: string;
  quantity: number;
  unitRate: number;
  amount: number;
};

export type ExpenseOperation = {
  kind: "expense";
  projectId: string;
  expenseDate: string;
  category: string;
  description: string;
  amount: number;
};

export type PaymentOperation = {
  kind: "payment";
  projectId: string;
  partyType: "worker" | "contractor" | "supplier" | "other";
  partyId: string | null;
  amount: number;
  paymentDate: string;
  method: "cash" | "card" | "transfer" | "other";
  description: string;
};

export type MaterialOperation = {
  kind: "material";
  projectId: string;
  materialId: string;
  transactionType: "in" | "out" | "adjustment";
  quantity: number;
  unitCost: number;
  note: string;
  transactionDate: string;
};

export type PendingOperation =
  | WorkerReportOperation
  | ContractorReportOperation
  | ExpenseOperation
  | MaterialOperation
  | PaymentOperation;

type PendingRow = {
  id: string;
  kind: PendingOperation["kind"];
  project_id: string;
  payload: string;
  created_at: string;
  attempts: number;
  synced: number;
  last_error: string | null;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function db() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("kargahyar.db");
  const database = await dbPromise;
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pending_operations (
      id TEXT PRIMARY KEY NOT NULL,
      kind TEXT NOT NULL,
      project_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      synced INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );
  `);
  return database;
}

function operationId() {
  return "op-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

export async function queueOperation(operation: PendingOperation) {
  const database = await db();
  const id = operationId();
  await database.runAsync(
    `INSERT INTO pending_operations(id,kind,project_id,payload,created_at,attempts,synced,last_error)
     VALUES(?,?,?,?,?,0,0,NULL)`,
    id,
    operation.kind,
    operation.projectId,
    JSON.stringify(operation),
    new Date().toISOString(),
  );
  return id;
}

export async function getPendingOperations() {
  const database = await db();
  return database.getAllAsync<PendingRow>(
    "SELECT id,kind,project_id,payload,created_at,attempts,synced,last_error FROM pending_operations WHERE synced=0 ORDER BY created_at ASC",
  );
}

async function markSynced(id: string) {
  const database = await db();
  await database.runAsync("UPDATE pending_operations SET synced=1,last_error=NULL WHERE id=?", id);
}

async function markAttempt(id: string, error: string) {
  const database = await db();
  await database.runAsync(
    "UPDATE pending_operations SET attempts=attempts+1,last_error=? WHERE id=?",
    error.slice(0, 500),
    id,
  );
}

export async function hasPendingOperation(id: string) {
  const database = await db();
  const row = await database.getFirstAsync<{ synced: number }>(
    "SELECT synced FROM pending_operations WHERE id=?",
    id,
  );
  return !row || row.synced === 0;
}

async function syncOperation(row: PendingRow) {
  const operation = JSON.parse(row.payload) as PendingOperation;
  const clientOperationId = row.id;

  if (operation.kind === "worker_entry") {
    return supabase.rpc("record_worker_daily_entry", {
      p_project_id: operation.projectId,
      p_report_date: operation.reportDate,
      p_worker_id: operation.workerId,
      p_attendance_factor: operation.attendanceFactor,
      p_overtime_hours: operation.overtimeHours,
      p_overtime_amount: operation.overtimeAmount,
      p_advance: operation.advance,
      p_payable: operation.payable,
      p_operation_id: clientOperationId,
    });
  }

  if (operation.kind === "contractor_entry") {
    return supabase.rpc("record_contractor_daily_entry", {
      p_project_id: operation.projectId,
      p_report_date: operation.reportDate,
      p_contractor_id: operation.contractorId,
      p_quantity: operation.quantity,
      p_unit_rate: operation.unitRate,
      p_amount: operation.amount,
      p_operation_id: clientOperationId,
    });
  }

  if (operation.kind === "expense") {
    return supabase.rpc("record_expense", {
      p_project_id: operation.projectId,
      p_expense_date: operation.expenseDate,
      p_category: operation.category,
      p_description: operation.description,
      p_amount: operation.amount,
      p_operation_id: clientOperationId,
    });
  }

  if (operation.kind === "payment") {
    return supabase.rpc("record_payment", {
      p_project_id: operation.projectId,
      p_party_type: operation.partyType,
      p_party_id: operation.partyId,
      p_amount: operation.amount,
      p_payment_date: operation.paymentDate,
      p_method: operation.method,
      p_description: operation.description,
      p_operation_id: clientOperationId,
    });
  }

  return supabase.rpc("record_material_transaction", {
    p_project_id: operation.projectId,
    p_material_id: operation.materialId,
    p_transaction_type: operation.transactionType,
    p_quantity: operation.quantity,
    p_unit_cost: operation.unitCost,
    p_note: operation.note,
    p_transaction_date: operation.transactionDate,
    p_operation_id: clientOperationId,
  });
}

export async function syncPendingOperations() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return { synced: 0, pending: 0 };

  const pending = await getPendingOperations();
  let synced = 0;

  for (const row of pending) {
    try {
      const { error } = await syncOperation(row);
      if (error) {
        await markAttempt(row.id, error.message || "SYNC_FAILED");
        continue;
      }
      await markSynced(row.id);
      synced += 1;
    } catch (error) {
      await markAttempt(row.id, error instanceof Error ? error.message : "SYNC_FAILED");
    }
  }

  const left = await getPendingOperations();
  return { synced, pending: left.length };
}

export async function queueAndSync(operation: PendingOperation) {
  const id = await queueOperation(operation);
  await syncPendingOperations();
  return { id, queued: await hasPendingOperation(id) };
}

// Backward-compatible aliases for the earlier implementation.
export const savePendingReport = (input: { projectId: string | null; note: string }) => {
  if (!input.projectId) throw new Error("PROJECT_REQUIRED");
  return queueOperation({
    kind: "expense",
    projectId: input.projectId,
    expenseDate: new Date().toISOString().slice(0, 10),
    category: "گزارش",
    description: input.note,
    amount: 0,
  });
};
export const markReportSynced = markSynced;
export const getPendingReports = getPendingOperations;
export const syncPendingReports = async () => (await syncPendingOperations()).synced;
