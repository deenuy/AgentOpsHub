<h1 align="center">AgentOpsHub</h1>

<p align="center">
  Self-hosted agent operations platform for delegating, governing, and observing AI coding agents.
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a>
</p>

<p align="center">
  <a href="https://github.com/deenuy/AgentOpsHub/stargazers">
    <img src="https://img.shields.io/github/stars/deenuy/AgentOpsHub?style=flat&logo=github" alt="GitHub stars">
  </a>
  <a href="https://github.com/deenuy/AgentOpsHub/releases">
    <img src="https://img.shields.io/github/v/release/deenuy/AgentOpsHub?style=flat&logo=github" alt="GitHub release">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="Apache 2.0">
  </a>
</p>

<p align="center">One interface for Claude Code, Codex, Copilot, OpenCode, Pi, Antigravity, and Muse Code agents — with governance, approval policies, and full audit trails.</p>

> **Attribution:** AgentOpsHub is based on the Apache-2.0 [Paseo](https://github.com/getpaseo/paseo) project.
> See [NOTICE.md](NOTICE.md) and [ATTRIBUTION.md](ATTRIBUTION.md) for full upstream attribution.

AgentOpsHub is an open source agentic development environment for desktop, mobile, web, and CLI. Open the desktop app and work: agents, editor, terminals, diffs, pull requests, and a browser in one window. Run many agents at once, each in its own worktree, on one machine or several. The mobile app is the full app, native on iOS and Android.

- **Parallel agents:** Run many agents at once, each in its own worktree.
- **Built-in orchestration:** Agents in AgentOpsHub can create worktrees, launch other agents, and talk to them, across providers.
- **Complete development workflow:** Edit files, review diffs, open pull requests, and run terminals, in split panes you arrange how you want.
- **Self-hosted:** Agents run on your machine with your full dev environment. Use your tools, your configs, and your skills.
- **Multi-provider:** Claude Code, Codex, Copilot, OpenCode, Pi, Antigravity, and Muse Code through the same interface. Pick the right model for each job.
- **Governance-first:** Approval policies for risky operations, full audit event logs, policy profiles per agent or task.
- **Cross-device:** iOS, Android, desktop, web, and CLI. Start work at your desk, check in from your phone, script it from the terminal.
- **Privacy-first:** AgentOpsHub has no telemetry, tracking, or forced log-ins.

## Getting Started

AgentOpsHub runs a local server called the daemon that manages your coding agents. Clients like the desktop app, mobile app, web app, and CLI connect to it.

### Prerequisites

You need at least one agent CLI installed and configured with your credentials:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Codex](https://github.com/openai/codex)
- [GitHub Copilot](https://github.com/features/copilot/cli/)
- [OpenCode](https://github.com/anomalyco/opencode)

### Server

Install the CLI and start the daemon:

```bash
npm install -g @agentopshub/cli
agentopshub
```

AgentOpsHub starts, then asks whether to enable the end-to-end encrypted relay for device pairing. If you decline, connect directly over TCP, Tailscale, or another VPN. The desktop, mobile, and web apps connect to this daemon like any other host.

### Docker

Run the AgentOpsHub daemon and self-hosted web UI in Docker:

```bash
docker run -d --name agentopshub \
  -p 6767:6767 \
  -e AGENTOPSHUB_PASSWORD=change-me \
  -v "$PWD/agentopshub-home:/home/agentopshub" \
  -v "$PWD:/workspace" \
  ghcr.io/deenuy/agentopshub:latest
```

Open `http://localhost:6767` after it starts. See [docs/docker.md](docs/docker.md) for full setup.

## CLI

```bash
agentopshub run --provider claude/opus-4.6 "implement user authentication"
agentopshub run --provider codex/gpt-5.5 --worktree feature-x "implement feature X"

agentopshub ls                           # list running agents
agentopshub attach abc123                # stream live output
agentopshub send abc123 "also add tests" # follow-up task

# run on a remote daemon; --cwd is a path on that host
agentopshub run --host workstation.local:6767 --cwd /workspace "run the full test suite"
```

## TypeScript SDK

Build integrations, dashboards, and orchestration services with `@agentopshub/client`:

```ts
import { createAgentOpsHubClient } from "@agentopshub/client";

const client = createAgentOpsHubClient({ url: "ws://127.0.0.1:6767/ws" });
await client.connect();

const agent = await client.agents.create({
  config: { provider: "codex/gpt-5.5" },
  cwd: "/Users/me/dev/storefront",
  prompt: "Review the current diff and name the riskiest change.",
});

const result = await agent.waitForFinish();
console.log(result.lastMessage);

await client.close();
```

## Plugins

Plugins run on the daemon and show up in every client you connect. Install from Git or a local directory.

## Development

Quick monorepo package map:

- `packages/server`: AgentOpsHub daemon (agent process orchestration, WebSocket API, MCP server)
- `packages/app`: Expo client (iOS, Android, web)
- `packages/cli`: `agentopshub` CLI for daemon and agent workflows
- `packages/desktop`: Electron desktop app
- `packages/relay`: Relay transport and encryption used by the daemon and clients
- `packages/website`: Marketing site and documentation

Common commands:

```bash
npm run dev
npm run dev:server
npm run dev:app
npm run dev:desktop
npm run typecheck
npm run lint
```

## Governance

See [docs/GOVERNANCE.md](docs/GOVERNANCE.md) for the agent governance model, including:

- Approval policies for risky operations
- Audit event log format
- Policy profiles
- Worktree isolation

## License

Apache-2.0 — see [LICENSE](LICENSE).

AgentOpsHub is derived from [Paseo](https://github.com/getpaseo/paseo) (Apache-2.0).
See [NOTICE.md](NOTICE.md) and [ATTRIBUTION.md](ATTRIBUTION.md).
