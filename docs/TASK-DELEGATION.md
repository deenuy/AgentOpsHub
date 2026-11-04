# Task Delegation

This document explains how to delegate a task to an AI coding agent via AgentOpsHub.

## What is a Task?

A task is a unit of delegated work with:

- A **prompt** (what to do)
- A **repository/worktree** (where to do it)
- A **policy profile** (what the agent is allowed to do)
- An **owner** (who delegated it)
- A **result** (the output: diff, files, messages)

## Delegating a Task

### Via CLI

```bash
# Basic task
agentopshub run --provider claude/opus-4.6 "implement user authentication"

# With worktree isolation (recommended for code changes)
agentopshub run \
  --provider claude/opus-4.6 \
  --worktree feat/auth \
  --policy standard \
  "implement JWT-based authentication for the API"

# With a specific base branch
agentopshub run \
  --provider codex/gpt-5.5 \
  --worktree feat/tests \
  --base main \
  --policy permissive \
  "add unit tests for the payment module"

# On a remote host
agentopshub run \
  --host workstation.local:6767 \
  --cwd /workspace/myapp \
  "run the full test suite and report failures"
```

### Via TypeScript SDK

```ts
import { createAgentOpsHubClient } from "@agentopshub/client";

const client = createAgentOpsHubClient({ url: "ws://127.0.0.1:6767/ws" });
await client.connect();

const agent = await client.agents.create({
  config: {
    provider: "claude/opus-4.6",
    policy: "standard",
    worktree: { base: "main", branch: "feat/auth" },
  },
  cwd: "/Users/me/dev/myapp",
  prompt: "Implement JWT-based authentication. Write tests. Open a PR.",
});

// Stream output
for await (const event of agent.events()) {
  if (event.type === "approval.requested") {
    console.log("Approval needed:", event.tool, event.args);
    await agent.approve(event.id); // or agent.deny(event.id)
  }
}

const result = await agent.waitForFinish();
console.log("Diff:", result.diff);
await client.close();
```

## Approval Flow

When an agent hits an approval gate:

1. The agent's state transitions to `awaiting_approval`.
2. The UI shows a notification: "Agent is waiting for your approval."
3. The operator sees the pending tool call: command, arguments, risk level.
4. The operator chooses:
   - **Approve**: the agent continues with the tool call.
   - **Deny**: the agent receives an error and may retry or fail.
   - **Modify**: (future) the operator edits the arguments before approving.

Approvals are time-limited. If no response arrives within the configured timeout
(`AGENTOPSHUB_APPROVAL_TIMEOUT_SECONDS`, default 3600), the tool call is denied
and the agent fails with a timeout error.

## Reviewing Results

After a task completes:

```bash
agentopshub ls                        # list all agents (running and recent)
agentopshub attach <agent-id>         # re-stream the output
agentopshub diff <agent-id>           # show the worktree diff
agentopshub log <agent-id>            # show the audit log for this task
```

In the UI, completed tasks appear in the **Recent** tab. Click to open the diff,
the full timeline, and any artifact links.

## Policy Profiles

| Profile      | Shell   | File writes                | git push | Deployment | Use case                 |
| ------------ | ------- | -------------------------- | -------- | ---------- | ------------------------ |
| `readonly`   | ✗       | ✗                          | ✗        | ✗          | Analysis, review         |
| `strict`     | Approve | Approve                    | Approve  | Approve    | Sensitive repos          |
| `standard`   | Approve | Approve (outside worktree) | Approve  | Approve    | Most tasks               |
| `permissive` | Auto    | Auto                       | Approve  | Approve    | Trusted, fast iterations |

## Task Metadata

Every task records:

- `task_id`: stable identifier
- `created_at`: ISO timestamp
- `owner`: user who created it
- `policy`: the applied policy profile name
- `worktree_path`: path to the isolated worktree (if used)
- `base_branch`: the branch the worktree was forked from
- `result_branch`: the branch name after the task completes
- `diff_summary`: lines added/removed
- `audit_events`: count and reference to the full audit log
