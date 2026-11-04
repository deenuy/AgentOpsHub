# AgentOpsHub Security Model

This document defines approval policies for operations that agents may request.
It supplements the relay and authentication security model in [../SECURITY.md](../SECURITY.md).

## Approval Policy Framework

Every agent runs under a **policy profile** (see [GOVERNANCE.md](GOVERNANCE.md)).
The profile determines which operations require human approval before the agent
may proceed.

### Default Approval Gates

The following operations require approval in the `standard` profile:

| Operation | Risk | Default action |
|---|---|---|
| Shell execution (`run_command`, `execute_bash`) | High — arbitrary code | **Approve required** |
| File writes outside worktree | High — affects shared state | **Approve required** |
| Dependency installation (`npm install`, `pip install`, `brew install`) | High — supply-chain risk | **Approve required** |
| `git push` to any remote | High — permanent public change | **Approve required** |
| Deployment (`fly deploy`, `vercel deploy`, `kubectl apply`) | Critical — production impact | **Approve required** |
| External network access from agent-spawned code | Medium — data exfiltration risk | **Approve required** |
| File reads within worktree | Low | Auto-approved |
| File writes within worktree | Low | Auto-approved |
| `git commit`, `git add` within worktree | Low | Auto-approved |
| MCP tool calls on allow-list | Low | Auto-approved |

### Strict Profile

In `strict` mode, every tool call requires approval:
- No auto-approved operations
- Agent is paused at every tool boundary
- Useful for audits or sensitive repositories

### Permissive Profile

In `permissive` mode, only destructive or irreversible operations require approval:
- Shell execution: auto-approved
- File writes: auto-approved
- `git push`: **Approve required**
- Deployment: **Approve required**

### Readonly Profile

No writes, no shell commands, no network. The agent may only read files and
produce a plan or summary. Approval is not needed because no mutations occur.

## Worktree Isolation

Every task that modifies code should run in an isolated Git worktree:
- The worktree is a temporary branch forked from the base branch at task start
- The agent's working directory is scoped to the worktree path
- File write approvals outside this path are always required
- The worktree is archived (not deleted) on task completion for audit purposes

## Authentication

Clients authenticate to the daemon with a shared password (`AGENTOPSHUB_PASSWORD`)
or through the relay's mutual-auth handshake. See [../SECURITY.md](../SECURITY.md)
for the full relay threat model and E2E encryption design.

## Audit Log

All approval events are written to `$AGENTOPSHUB_HOME/audit.log` in append-only
JSON-lines format. The log is not rotated by default; configure
`AGENTOPSHUB_LOG_FILE_ROTATE_SIZE` to enable rotation.

Each entry:
```json
{
  "ts": "2026-11-04T00:00:00.000Z",
  "event": "approval.requested",
  "task_id": "t_abc123",
  "agent_id": "a_xyz789",
  "tool": "run_command",
  "args": { "command": "npm test" },
  "policy": "standard",
  "owner": "deenuy"
}
```

## Known Limitations (Phase 1)

- Approval gates are defined in policy profiles but not yet enforced by the daemon
  (the protocol infrastructure exists; the gate hook is a planned extension point).
- Audit log forwarding and webhook notifications are not yet implemented.
- RBAC (role-based access control) is not implemented; all authenticated clients
  have equal authority.

These limitations are documented intentionally. Do not add RBAC or enforcement
code without a design review — the extension points above are where that work belongs.
