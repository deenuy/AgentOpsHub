# AgentOpsHub Governance Model

AgentOpsHub adds a governance layer on top of the agent execution infrastructure
inherited from Paseo. This document defines the core concepts.

## Core Concepts

### Agent

An **Agent** is a configured AI coding-agent process (Claude Code, Codex, Copilot,
OpenCode, or other supported provider) managed by the AgentOpsHub daemon.

Each agent has:

- A unique ID
- A provider (e.g. `claude/opus-4.6`)
- A working directory or worktree path
- A policy profile governing its permissions
- An owner (the user or system that created it)
- A lifecycle state (see [AGENT-LIFECYCLE.md](AGENT-LIFECYCLE.md))

### Task

A **Task** is a delegated unit of work. It carries:

- **Prompt**: the natural-language instruction
- **Repository/Worktree**: the isolated Git worktree where the task executes
- **Policy**: the named policy profile governing tool use, network, and approvals
- **Owner**: the principal that created the task
- **Status**: pending → delegated → running → awaiting_approval → completed | failed
- **Result**: the agent's final output, diff, and artifact references

### Host

A **Host** is a Mac mini, workstation, server, or container runtime registered
with AgentOpsHub. The daemon runs on the host. Multiple clients (desktop, mobile,
web, CLI) connect to a host's daemon. A host has a name, address, and trust level.

### Policy Profile

A **Policy Profile** is a named set of constraints applied to an agent or task:

- **Allowed tools**: which MCP tools and shell commands may execute without approval
- **Network rules**: outbound network access restrictions
- **Model/provider constraints**: allowed providers and models
- **Approval gates**: operations that require human approval before proceeding
- **Worktree isolation**: whether the task runs in an isolated Git worktree

Built-in profiles:

- `permissive`: allow most operations, approve only destructive ones
- `standard`: approve shell execution, file writes outside workspace, git push
- `strict`: approve all tool calls
- `readonly`: no writes, no shell, no network

### Approval Gate

An **Approval Gate** is a checkpoint where an agent must pause and wait for a
human operator to approve or deny an operation before continuing.

Default approval gates (in `standard` profile):

- Shell command execution
- File writes outside the task worktree
- Dependency installation (`npm install`, `pip install`, etc.)
- `git push` to any remote
- Deployment commands
- External network access from agent code

When an agent hits an approval gate, its state transitions to `awaiting_approval`.
The operator sees the pending request in the UI and can approve, deny, or modify it.

### Audit Event

An **Audit Event** is an append-only record written to the daemon's audit log
whenever a significant action occurs. Events are tamper-evident and time-stamped.

Event types:

- `task.created` — task was created with prompt, policy, and owner
- `agent.spawned` — agent process was started for a task
- `tool.requested` — agent requested a tool call
- `approval.requested` — tool call requires human approval
- `approval.granted` — operator approved the tool call
- `approval.denied` — operator denied the tool call
- `agent.completed` — agent finished successfully with result
- `agent.failed` — agent terminated with error
- `artifact.produced` — agent produced a diff, file, or other artifact
- `task.archived` — task moved to archive

## Extension Points

The governance layer is designed to be extended without modifying core daemon code:

1. **Custom policy profiles**: add entries to `~/.agentopshub/policies/`.
2. **Approval webhooks**: configure a webhook URL to receive approval requests
   and respond programmatically.
3. **Audit log forwarding**: pipe the audit log to a SIEM or logging service.

See [TASK-DELEGATION.md](TASK-DELEGATION.md) for how to delegate a task with a
specific policy profile.
