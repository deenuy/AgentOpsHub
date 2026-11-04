import { defaultWebSocketFactory } from "@agentopshub/client/internal/daemon-client-websocket-transport";
import type { WebSocketFactory } from "@agentopshub/client/internal/daemon-client-transport-types";

export function createAppWebSocketFactory(): WebSocketFactory {
  return defaultWebSocketFactory;
}
