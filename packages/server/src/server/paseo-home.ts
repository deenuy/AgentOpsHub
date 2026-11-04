import os from "node:os";
import path from "node:path";

function expandHomeDir(input: string): string {
  if (input.startsWith("~/")) {
    return path.join(os.homedir(), input.slice(2));
  }
  if (input === "~") {
    return os.homedir();
  }
  return input;
}

export function resolvePaseoHome(env: NodeJS.ProcessEnv = process.env): string {
  if (env.PASEO_HOME && !env.AGENTOPSHUB_HOME) {
    console.warn("[AgentOpsHub] PASEO_HOME is deprecated; use AGENTOPSHUB_HOME instead.");
  }
  const raw = env.AGENTOPSHUB_HOME ?? env.PASEO_HOME ?? "~/.agentopshub";
  const resolved = path.resolve(expandHomeDir(raw));
  return resolved;
}
