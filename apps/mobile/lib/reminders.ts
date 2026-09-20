import * as Notifications from "expo-notifications";

export type ReminderFrequency = "off" | "hourly" | "daily" | "weekly";

export async function configureReminder(frequency: ReminderFrequency) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (frequency === "off") return;

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    const requested = await Notifications.requestPermissionsAsync();
    if (!requested.granted) return;
  }

  if (frequency === "hourly") {
    await Notifications.scheduleNotificationAsync({
      content: { title: "کارگاهیار", body: "گزارش امروز کارگاه را ثبت کرده‌ای؟" },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * 60, repeats: true },
    });
    return;
  }

  if (frequency === "daily") {
    await Notifications.scheduleNotificationAsync({
      content: { title: "کارگاهیار", body: "گزارش امروز کارگاه را ثبت کرده‌ای؟" },
      trigger: { hour: 20, minute: 0, repeats: true },
    });
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: { title: "کارگاهیار", body: "وقت ثبت گزارش هفتگی کارگاه است." },
    trigger: { weekday: 1, hour: 20, minute: 0, repeats: true },
  });
}
