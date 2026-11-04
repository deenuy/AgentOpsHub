# AgentOpsHub Brand Guidelines

## Mission

AgentOpsHub is a self-hosted agent operations platform for delegating, governing, and observing AI coding agents.
It enables teams to run many agents in parallel with human-in-the-loop approval policies, full audit trails, and
worktree isolation.

## Name

- Product: **AgentOpsHub**
- CLI: `agentopshub`
- Daemon: **AgentOpsHub Daemon**
- Short form: **AOH** (internal/technical only)

## Positioning

AgentOpsHub is governance-first. Where Paseo focuses on the developer experience of running agents,
AgentOpsHub adds:

- **Approval policies** — human gates for risky operations.
- **Audit events** — append-only record of every agent action.
- **Policy profiles** — named permission sets per agent or task.
- **Worktree isolation** — every delegated task runs in its own Git worktree.

## Attribution

All user-facing attribution must include:

> AgentOpsHub is based on the Apache-2.0 [Paseo](https://github.com/getpaseo/paseo) project.

This line belongs in the footer of the web UI, the about screen of the app, and the README.

## Tone

Professional, precise, infrastructure-oriented. Governance is a feature, not a constraint.
Avoid "voice control" or "hands-free" messaging — that is Paseo's positioning. Focus on
delegation, governance, observability, and control.

## Colors and Assets

AgentOpsHub-specific logo and icon assets should replace the Paseo SVG/PNG assets in:

- `packages/website/public/logo.svg`
- `packages/app/assets/`
- `packages/desktop/assets/`

Until custom assets are created, use a text-based placeholder. Do not ship Paseo logo assets
under the AgentOpsHub name.
