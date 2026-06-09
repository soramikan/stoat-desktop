import { ipcMain, pushNotifications } from "electron";

import { setBadgeCount } from "./badges";
import { mainWindow } from "./window";

const isDarwin = process.platform === "darwin";

function getBadge(userInfo: Record<string, unknown>) {
  const aps = userInfo.aps;
  if (!aps || typeof aps !== "object") return undefined;

  const badge = (aps as { badge?: unknown }).badge;
  return typeof badge === "number" ? badge : undefined;
}

/**
 * Register IPC handlers for macOS APNs.
 */
export function initPushNotifications() {
  ipcMain.handle("registerForAPNSNotifications", async () => {
    if (!isDarwin) {
      throw new Error("APNs notifications are only available on macOS.");
    }

    return pushNotifications.registerForAPNSNotifications();
  });

  ipcMain.handle("unregisterForAPNSNotifications", () => {
    if (!isDarwin) return;

    pushNotifications.unregisterForAPNSNotifications();
  });

  if (!isDarwin) return;

  pushNotifications.on("received-apns-notification", (_event, userInfo) => {
    const badge = getBadge(userInfo);
    if (badge !== undefined) {
      setBadgeCount(badge);
    }

    mainWindow?.webContents.send("apnsNotification", userInfo);
  });
}
