import { useEffect } from "react";
import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import { BRAND } from "../lib/brand";
import { initializeNotifications, isReminderSuppressedToday, suppressReminderForToday, clearReminderSuppression } from "../lib/reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const suppressed = await isReminderSuppressedToday().catch(() => false);
    return {
      shouldShowBanner: !suppressed,
      shouldShowList: !suppressed,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

export default function Layout() {
  useEffect(() => {
    initializeNotifications().catch(() => undefined);

    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const action = response.actionIdentifier;
      const route = response.notification.request.content.data?.route;
      if (action === "report_no") {
        await suppressReminderForToday();
        return;
      }
      if (action === "report_yes" || action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        await clearReminderSuppression();
        router.push(typeof route === "string" ? route : "/daily-report?start=1");
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BRAND.bg },
      }}
    />
  );
}
