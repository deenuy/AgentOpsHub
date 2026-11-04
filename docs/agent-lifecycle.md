# Agent Lifecycle

This document describes the lifecycle of a task-delegated agent in AgentOpsHub.

## Task States

```
pending
  │
  ▼
delegated ──────────────────────────────────────────────────────────────────┐
  │                                                                          │
  ▼                                                                          │
running                                                                      │
  │                                                                          │
  ├──── tool call requires approval ──► awaiting_approval                   │
  │                                        │          │                      │
  │                            approved ◄──┘          └──► denied ──► failed│
  │                                │                                         │
  │◄───────────────────────────────┘                                         │
  │                                                                          │
  ├──── agent exits successfully ──► completed                               │
  │                                                                          │
  └──── agent exits with error ────► failed ◄──────────────────────────────-┘
```

### State Descriptions

| State | Description |
|---|---|
| `pending` | Task created, waiting for a free agent slot |
| `delegated` | Agent process spawned, initializing |
| `running` | Agent is actively processing, executing tool calls |
| `awaiting_approval` | Agent paused at an approval gate; waiting for operator |
| `completed` | Agent finished successfully; result and diff available |
| `failed` | Agent terminated with an error or denial |

## Worktree Isolation

Each task that modifies code runs in an isolated Git worktree:

1. At task creation, a new branch is forked from the specified base branch.
2. The daemon creates the worktree at a path under `$AGENTOPSHUB_HOME/worktrees/<task_id>/`.
3. The agent's working directory is set to the worktree path.
4. All file writes and git commits occur inside this worktree.
5. On task completion, the worktree is archived (retained, not deleted).
6. The operator can inspect the diff, approve, or discard the worktree branch.

Worktree isolation prevents:
- Agents from accidentally modifying each other's work in parallel runs
- Agents from touching files outside their designated scope
- Loss of work before operator review

## Parent / Child Agents

An agent can spawn child agents via the MCP `launch_agent` tool. Each child:
- Inherits the parent's policy profile unless overridden
- Runs in its own worktree (derived from the parent's worktree branch)
- Is tracked as a sub-task of the parent task
- Counts against the host's parallel-agent limit

Orphaned child agents (parent fails) are terminated and their worktrees archived.

## Archive Semantics

Archived tasks:
- Are read-only (no further agent activity)
- Retain their full timeline, audit log, and worktree diff
- Are searchable and can be referenced by new tasks
- Are not deleted by default; configure `AGENTOPSHUB_ARCHIVE_RETENTION_DAYS` to prune

## Tabs vs Archive

The UI distinguishes:
- **Active tab**: running or awaiting_approval agents
- **Recent tab**: completed or failed agents in the last session
- **Archive**: all historical tasks; searchable, never shown in active tab
