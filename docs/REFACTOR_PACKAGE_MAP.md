# Package Rename Map

Maps upstream `@getpaseo/*` packages to AgentOpsHub `@agentopshub/*` packages.

| Current package | Proposed package | Risk | Notes |
|---|---|---|---|
| `@getpaseo/server` | `@agentopshub/server` | High | Internal imports, build scripts, release scripts |
| `@getpaseo/cli` | `@agentopshub/cli` | High | Binary name, npm publishing, install docs — **done in Phase 2** |
| `@getpaseo/client` | `@agentopshub/client` | High | SDK imports and external consumers |
| `@getpaseo/protocol` | `@agentopshub/protocol` | High | Wire compatibility and versioning |
| `@getpaseo/relay` | `@agentopshub/relay` | High | Encryption and transport |
| `@getpaseo/app` | `@agentopshub/app` | Medium | Expo config and mobile builds |
| `@getpaseo/desktop` | `@agentopshub/desktop` | Medium | Electron packaging |
| `@getpaseo/website` | `@agentopshub/website` | Low | Docs/marketing site |
| `@getpaseo/plugin` | `@agentopshub/plugin` | Medium | Plugin SDK — external consumers |
| `@getpaseo/highlight` | `@agentopshub/highlight` | Low | Syntax highlighting utility |
| `@getpaseo/expo-two-way-audio` | `@agentopshub/expo-two-way-audio` | Low | Expo audio native module |

## Exceptions / Intentionally Preserved

| Identifier | Reason |
|---|---|
| WebSocket RPC message field values containing "paseo" | Wire compatibility — changing breaks existing clients |
| Database/storage internal keys | Migration risk; require a migration script before changing |
| `paseo` bin alias in CLI | Backward-compatibility for existing scripts |
| `PASEO_*` env var fallbacks | Backward-compatibility for existing deployments |
