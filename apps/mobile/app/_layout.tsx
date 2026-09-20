import { useEffect } from "react";
import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import { BRAND } from "../lib/brand";
import { initializeNotifications } from "../lib/reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  useEffect(() => {
    initializeNotifications().catch(() => undefined);

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const action = response.actionIdentifier;
      const route = response.notification.request.content.data?.route;
      if (action === "report_yes" || action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        router.push(typeof route === "string" ? route : "/daily-report");
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
