import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";

export type ReminderFrequency = "off" | "hourly" | "daily" | "weekly";
const KEY = "kargahyar.reminder.frequency";
export const REPORT_CATEGORY = "kargahyar.daily_report";

export async function configureNotificationCategory() {
  await Notifications.setNotificationCategoryAsync(REPORT_CATEGORY, [
    { identifier: "report_yes", buttonTitle: "بله، گزارش دارم", options: { opensAppToForeground: true } },
    { identifier: "report_no", buttonTitle: "امروز ندارم", options: { opensAppToForeground: false } },
  ]);
}

export async function getReminderFrequency(): Promise<ReminderFrequency> {
  return ((await SecureStore.getItemAsync(KEY)) as ReminderFrequency | null) || "daily";
}

export async function configureReminder(frequency: ReminderFrequency) {
  await SecureStore.setItemAsync(KEY, frequency);
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (frequency === "off") return;

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) return;
  }

  const content = {
    title: "کارگاهیار",
    body: frequency === "weekly" ? "وقت ثبت گزارش هفتگی کارگاه است." : "آیا امروز گزارش کارگاه را ثبت کرده‌ای؟",
    categoryIdentifier: REPORT_CATEGORY,
    data: { route: "/daily-report" },
  };

  if (frequency === "hourly") {
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * 60, repeats: true },
    });
  } else if (frequency === "daily") {
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
    });
  } else {
    // Iran work week: Saturday–Thursday; weekly summary reminder defaults to Thursday 20:00.
    await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: 5, hour: 20, minute: 0 },
    });
  }
}

export async function initializeNotifications() {
  await configureNotificationCategory();
  const frequency = await getReminderFrequency();
  await configureReminder(frequency);
}
