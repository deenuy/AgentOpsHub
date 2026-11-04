import type { DaemonClient } from "@agentopshub/client/internal/daemon-client";

export interface StartPushNotificationsInput {
  client: DaemonClient;
  serverId: string;
}

export interface RevokePushNotificationsInput {
  client: DaemonClient | null;
  serverId: string;
}
