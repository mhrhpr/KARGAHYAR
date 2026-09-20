import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { BRAND } from "../lib/brand";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BRAND.bg },
      }}
    />
  );
}
