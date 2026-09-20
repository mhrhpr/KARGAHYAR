import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";
import { queueAndSync } from "../lib/offline";
import { BRAND } from "../lib/brand";

type Project = { id: string; name: string; project_type: string };
type Worker = { id: string; name: string; specialty: string | null; daily_wage: number | null; hourly_wage: number | null; overtime_rate: number | null };
type Contractor = { id: string; name: string; specialty: string | null; unit: string | null; unit_rate: number | null };

const toNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;
const todayISO = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export default function DailyReport() {
  const params = useLocalSearchParams<{ projectId?: string }>();
  const [step, setStep] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(params.projectId || "");
  const [kind, setKind] = useState<"worker" | "contractor" | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [workerId, setWorkerId] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [attendance, setAttendance] = useState<0 | 0.5 | 1>(1);
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [advance, setAdvance] = useState("0");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<"synced" | "queued" | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("projects").select("id,name,project_type").eq("status", "active").order("created_at", { ascending: false });
      const list = data || [];
      setProjects(list);
      if (!params.projectId && list.length === 1) setProjectId(list[0].id);
    })();
  }, [params.projectId]);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      const [w, c] = await Promise.all([
        supabase.from("workers").select("id,name,specialty,daily_wage,hourly_wage,overtime_rate").eq("project_id", projectId).eq("active", true).order("name"),
        supabase.from("contractors").select("id,name,specialty,unit,unit_rate").eq("project_id", projectId).order("name"),
      ]);
      setWorkers(w.data || []);
      setContractors(c.data || []);
    })();
  }, [projectId]);

  const worker = workers.find((item) => item.id === workerId);
  const contractor = contractors.find((item) => item.id === contractorId);

  const workerCalculation = useMemo(() => {
    if (!worker) return 0;
    const base = Number(worker.daily_wage || 0) * attendance;
    const overtimeRate = Number(worker.overtime_rate || worker.hourly_wage || Number(worker.daily_wage || 0) / 8);
    return Math.max(0, Math.round(base + overtimeRate * toNumber(overtimeHours) - toNumber(advance)));
  }, [worker, attendance, overtimeHours, advance]);

  const contractorCalculation = useMemo(
    () => Math.max(0, Math.round(toNumber(quantity) * (toNumber(rate) || Number(contractor?.unit_rate || 0)))),
    [quantity, rate, contractor],
  );

  const resetForNext = () => {
    setKind(null); setWorkerId(""); setContractorId(""); setAttendance(1); setOvertimeHours("0"); setAdvance("0");
    setQuantity(""); setRate(""); setSuccess(null); setStep(2);
  };

  const save = async () => {
    if (!projectId || !kind) return;
    setBusy(true);
    try {
      if (kind === "worker" && !workerId) throw new Error("یک نیرو را انتخاب کن");
      if (kind === "contractor" && (!contractorId || !quantity)) throw new Error("پیمانکار و مقدار را کامل کن");

      const operation = kind === "worker"
        ? {
            kind: "worker_entry" as const,
            projectId, reportDate: todayISO(), workerId,
            attendanceFactor: attendance, overtimeHours: toNumber(overtimeHours),
            overtimeAmount: Math.max(0, workerCalculation + toNumber(advance) - Number(worker?.daily_wage || 0) * attendance),
            advance: toNumber(advance), payable: workerCalculation,
          }
        : {
            kind: "contractor_entry" as const,
            projectId, reportDate: todayISO(), contractorId,
            quantity: toNumber(quantity),
            unitRate: toNumber(rate) || Number(contractor?.unit_rate || 0),
            amount: contractorCalculation,
          };

      const result = await queueAndSync(operation);
      setSuccess(result.queued ? "queued" : "synced");
    } catch (error) {
      Alert.alert("ثبت انجام نشد", error instanceof Error ? error.message : "اطلاعات را بررسی کن.");
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BRAND.bg, padding: 20 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ backgroundColor: BRAND.surface, borderWidth: 1, borderColor: success === "synced" ? "#1f6f4a" : BRAND.border, borderRadius: 22, padding: 24 }}>
            <Text style={{ color: success === "synced" ? "#7DD3A7" : BRAND.accent, fontSize: 16, fontWeight: "800" }}>
              {success === "synced" ? "✓ ثبت و همگام شد" : "⟳ روی گوشی ذخیره شد"}
            </Text>
            <Text style={{ color: BRAND.text, fontSize: 27, fontWeight: "900", marginTop: 10 }}>
              {success === "synced" ? "گزارش با موفقیت ثبت شد." : "گزارش در صف همگام‌سازی است."}
            </Text>
            <Text style={{ color: BRAND.muted, marginTop: 8 }}>
              {kind === "worker"
                ? `مبلغ قابل پرداخت: ${workerCalculation.toLocaleString("fa-IR")} تومان`
                : `مبلغ گزارش: ${contractorCalculation.toLocaleString("fa-IR")} تومان`}
            </Text>
            <View style={{ gap: 10, marginTop: 22 }}>
              <Pressable onPress={resetForNext} style={{ backgroundColor: BRAND.accent, padding: 16, borderRadius: 14 }}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "900" }}>ثبت گزارش بعدی</Text>
              </Pressable>
              <Pressable onPress={() => router.replace("/dashboard")} style={{ borderWidth: 1, borderColor: BRAND.border, padding: 16, borderRadius: 14 }}>
                <Text style={{ color: BRAND.text, textAlign: "center", fontWeight: "800" }}>پایان گزارش</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BRAND.bg, padding: 20 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={{ color: BRAND.muted }}>گزارش روزانه · مرحله {step} از 4</Text>
        <Text style={{ color: BRAND.text, fontSize: 29, fontWeight: "900", marginTop: 4 }}>
          {step === 1 ? "برای کدام پروژه؟" : step === 2 ? "نوع گزارش را انتخاب کن" : kind === "worker" ? "گزارش نیروی روزمزد" : "گزارش پیمانکار"}
        </Text>

        {step === 1 && (
          <View style={{ gap: 10, marginTop: 24 }}>
            {projects.map((project) => (
              <Pressable key={project.id} onPress={() => { setProjectId(project.id); setStep(2); }} style={{ backgroundColor: BRAND.surface, borderColor: projectId === project.id ? BRAND.accent : BRAND.border, borderWidth: 1, borderRadius: 16, padding: 17 }}>
                <Text style={{ color: BRAND.text, fontWeight: "800", fontSize: 17 }}>{project.name}</Text>
                <Text style={{ color: BRAND.muted, marginTop: 3 }}>{project.project_type}</Text>
              </Pressable>
            ))}
            {!projects.length && <Text style={{ color: BRAND.muted, marginTop: 20 }}>ابتدا یک پروژه فعال بساز.</Text>}
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 12, marginTop: 24 }}>
            <Pressable onPress={() => { setKind("worker"); setStep(3); }} style={{ backgroundColor: BRAND.surface, borderWidth: 1, borderColor: BRAND.border, borderRadius: 18, padding: 22 }}>
              <Text style={{ color: BRAND.text, fontSize: 19, fontWeight: "900" }}>👷 نیروی روزمزد</Text>
              <Text style={{ color: BRAND.muted, marginTop: 4 }}>کارکرد، اضافه‌کاری و مساعده</Text>
            </Pressable>
            <Pressable onPress={() => { setKind("contractor"); setStep(3); }} style={{ backgroundColor: BRAND.surface, borderWidth: 1, borderColor: BRAND.border, borderRadius: 18, padding: 22 }}>
              <Text style={{ color: BRAND.text, fontSize: 19, fontWeight: "900" }}>🧑‍🔧 پیمانکار</Text>
              <Text style={{ color: BRAND.muted, marginTop: 4 }}>مقدار × نرخ واحد</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && kind === "worker" && (
          <View style={{ gap: 10, marginTop: 24 }}>
            {workers.map((item) => (
              <Pressable key={item.id} onPress={() => setWorkerId(item.id)} style={{ backgroundColor: BRAND.surface, borderWidth: 1, borderColor: workerId === item.id ? BRAND.accent : BRAND.border, borderRadius: 16, padding: 16 }}>
                <Text style={{ color: BRAND.text, fontSize: 17, fontWeight: "800" }}>{item.name}</Text>
                <Text style={{ color: BRAND.muted, marginTop: 3 }}>{item.specialty || "بدون تخصص"} · {Number(item.daily_wage || 0).toLocaleString("fa-IR")} تومان</Text>
              </Pressable>
            ))}
            <Text style={{ color: BRAND.text, marginTop: 8, fontWeight: "800" }}>کارکرد امروز</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[["غیبت", 0], ["نیم‌روز", 0.5], ["کامل", 1]].map(([label, value]) => (
                <Pressable key={String(value)} onPress={() => setAttendance(value as 0 | 0.5 | 1)} style={{ flex: 1, padding: 14, borderRadius: 13, backgroundColor: attendance === value ? BRAND.accent : BRAND.surface, borderWidth: 1, borderColor: attendance === value ? BRAND.accent : BRAND.border }}>
                  <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput value={overtimeHours} onChangeText={setOvertimeHours} keyboardType="numeric" placeholder="ساعت اضافه‌کاری (مثلاً 2)" placeholderTextColor="#707986" style={{ backgroundColor: BRAND.surface, color: BRAND.text, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: BRAND.border }} />
            <TextInput value={advance} onChangeText={setAdvance} keyboardType="numeric" placeholder="مساعده امروز" placeholderTextColor="#707986" style={{ backgroundColor: BRAND.surface, color: BRAND.text, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: BRAND.border }} />
            <Pressable disabled={!workerId} onPress={() => setStep(4)} style={{ backgroundColor: BRAND.text, padding: 16, borderRadius: 14, opacity: workerId ? 1 : 0.4 }}>
              <Text style={{ textAlign: "center", fontWeight: "900", color: BRAND.bg }}>پیش‌نمایش محاسبه</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && kind === "contractor" && (
          <View style={{ gap: 10, marginTop: 24 }}>
            {contractors.map((item) => (
              <Pressable key={item.id} onPress={() => setContractorId(item.id)} style={{ backgroundColor: BRAND.surface, borderWidth: 1, borderColor: contractorId === item.id ? BRAND.accent : BRAND.border, borderRadius: 16, padding: 16 }}>
                <Text style={{ color: BRAND.text, fontSize: 17, fontWeight: "800" }}>{item.name}</Text>
                <Text style={{ color: BRAND.muted, marginTop: 3 }}>{item.specialty || "بدون تخصص"} · {item.unit || "واحد"} · {Number(item.unit_rate || 0).toLocaleString("fa-IR")} تومان</Text>
              </Pressable>
            ))}
            <TextInput value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="مقدار انجام‌شده" placeholderTextColor="#707986" style={{ backgroundColor: BRAND.surface, color: BRAND.text, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: BRAND.border }} />
            <TextInput value={rate} onChangeText={setRate} keyboardType="numeric" placeholder={contractor?.unit_rate ? `نرخ واحد: ${Number(contractor.unit_rate).toLocaleString("fa-IR")}` : "نرخ واحد"} placeholderTextColor="#707986" style={{ backgroundColor: BRAND.surface, color: BRAND.text, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: BRAND.border }} />
            <Pressable disabled={!contractorId || !quantity} onPress={() => setStep(4)} style={{ backgroundColor: BRAND.text, padding: 16, borderRadius: 14, opacity: contractorId && quantity ? 1 : 0.4 }}>
              <Text style={{ textAlign: "center", fontWeight: "900", color: BRAND.bg }}>پیش‌نمایش محاسبه</Text>
            </Pressable>
          </View>
        )}

        {step === 4 && (
          <View style={{ marginTop: 24, backgroundColor: BRAND.surface, borderWidth: 1, borderColor: BRAND.border, borderRadius: 20, padding: 22 }}>
            <Text style={{ color: BRAND.muted }}>تأیید نهایی</Text>
            <Text style={{ color: BRAND.text, fontSize: 20, fontWeight: "900", marginTop: 8 }}>{kind === "worker" ? worker?.name : contractor?.name}</Text>
            {kind === "worker" ? (
              <>
                <Text style={{ color: BRAND.muted, marginTop: 5 }}>کارکرد: {attendance === 1 ? "کامل" : attendance === 0.5 ? "نیم‌روز" : "غیبت"}</Text>
                <Text style={{ color: BRAND.muted }}>اضافه‌کاری: {toNumber(overtimeHours)} ساعت</Text>
                <Text style={{ color: BRAND.muted }}>مساعده: {toNumber(advance).toLocaleString("fa-IR")} تومان</Text>
                <Text style={{ color: BRAND.text, fontSize: 27, fontWeight: "900", marginTop: 16 }}>{workerCalculation.toLocaleString("fa-IR")} تومان</Text>
              </>
            ) : (
              <>
                <Text style={{ color: BRAND.muted, marginTop: 5 }}>{toNumber(quantity).toLocaleString("fa-IR")} {contractor?.unit || "واحد"}</Text>
                <Text style={{ color: BRAND.muted }}>نرخ: {(toNumber(rate) || Number(contractor?.unit_rate || 0)).toLocaleString("fa-IR")} تومان</Text>
                <Text style={{ color: BRAND.text, fontSize: 27, fontWeight: "900", marginTop: 16 }}>{contractorCalculation.toLocaleString("fa-IR")} تومان</Text>
              </>
            )}
            <View style={{ gap: 10, marginTop: 20 }}>
              <Pressable disabled={busy} onPress={save} style={{ backgroundColor: BRAND.accent, padding: 16, borderRadius: 14, opacity: busy ? 0.6 : 1 }}>
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "900" }}>{busy ? "در حال ثبت..." : "تأیید و ثبت"}</Text>
              </Pressable>
              <Pressable onPress={() => setStep(3)} style={{ borderWidth: 1, borderColor: BRAND.border, padding: 16, borderRadius: 14 }}>
                <Text style={{ color: BRAND.text, textAlign: "center", fontWeight: "800" }}>ویرایش</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
