# Migration Guide: Paseo → AgentOpsHub

This document covers how to migrate from upstream Paseo configuration to AgentOpsHub.

## Environment Variables

All `PASEO_*` environment variables have `AGENTOPSHUB_*` equivalents. The daemon reads
`AGENTOPSHUB_*` first and falls back to `PASEO_*` with a deprecation warning.

| Old (deprecated)                      | New (primary)                               | Notes                              |
| ------------------------------------- | ------------------------------------------- | ---------------------------------- |
| `PASEO_LISTEN`                        | `AGENTOPSHUB_LISTEN`                        | Daemon listen address              |
| `PASEO_PASSWORD`                      | `AGENTOPSHUB_PASSWORD`                      | Daemon auth password               |
| `PASEO_HOME`                          | `AGENTOPSHUB_HOME`                          | Home directory for state           |
| `PASEO_RELAY_ENABLED`                 | `AGENTOPSHUB_RELAY_ENABLED`                 | Enable relay                       |
| `PASEO_RELAY_ENDPOINT`                | `AGENTOPSHUB_RELAY_ENDPOINT`                | Relay endpoint                     |
| `PASEO_PLUGIN_REGISTRY`               | `AGENTOPSHUB_PLUGIN_REGISTRY`               | Plugin registry URL                |
| `PASEO_WEB_UI_ENABLED`                | `AGENTOPSHUB_WEB_UI_ENABLED`                | Enable web UI                      |
| `PASEO_WEB_UI_DIST_DIR`               | `AGENTOPSHUB_WEB_UI_DIST_DIR`               | Web UI dist path                   |
| `PASEO_APP_BASE_URL`                  | `AGENTOPSHUB_APP_BASE_URL`                  | App base URL                       |
| `PASEO_CORS_ORIGINS`                  | `AGENTOPSHUB_CORS_ORIGINS`                  | CORS origins                       |
| `PASEO_ALLOWED_HOSTS`                 | `AGENTOPSHUB_ALLOWED_HOSTS`                 | Allowed hosts                      |
| `PASEO_DICTATION_ENABLED`             | `AGENTOPSHUB_DICTATION_ENABLED`             | Enable dictation feature           |
| `PASEO_DICTATION_STT_PROVIDER`        | `AGENTOPSHUB_DICTATION_STT_PROVIDER`        | Dictation STT provider (`local`)   |
| `PASEO_DICTATION_LOCAL_STT_MODEL`     | `AGENTOPSHUB_DICTATION_LOCAL_STT_MODEL`     | Dictation STT model (Parakeet TDT) |
| `PASEO_DICTATION_LANGUAGE`            | `AGENTOPSHUB_DICTATION_LANGUAGE`            | Dictation language                 |
| `PASEO_VOICE_MODE_ENABLED`            | `AGENTOPSHUB_VOICE_MODE_ENABLED`            | Enable voice mode                  |
| `PASEO_VOICE_STT_PROVIDER`            | `AGENTOPSHUB_VOICE_STT_PROVIDER`            | Voice STT provider (`local`)       |
| `PASEO_VOICE_LOCAL_STT_MODEL`         | `AGENTOPSHUB_VOICE_LOCAL_STT_MODEL`         | Voice STT model                    |
| `PASEO_VOICE_TTS_PROVIDER`            | `AGENTOPSHUB_VOICE_TTS_PROVIDER`            | Voice TTS provider (`local`)       |
| `PASEO_VOICE_LOCAL_TTS_MODEL`         | `AGENTOPSHUB_VOICE_LOCAL_TTS_MODEL`         | Voice TTS model (Kokoro)           |
| `PASEO_VOICE_LOCAL_TTS_SPEAKER_ID`    | `AGENTOPSHUB_VOICE_LOCAL_TTS_SPEAKER_ID`    | Voice TTS speaker ID               |
| `PASEO_VOICE_LOCAL_TTS_SPEED`         | `AGENTOPSHUB_VOICE_LOCAL_TTS_SPEED`         | Voice TTS speed                    |
| `PASEO_VOICE_TURN_DETECTION_PROVIDER` | `AGENTOPSHUB_VOICE_TURN_DETECTION_PROVIDER` | Voice turn detection provider      |
| `PASEO_VOICE_LANGUAGE`                | `AGENTOPSHUB_VOICE_LANGUAGE`                | Voice language                     |
| `PASEO_VOICE_LLM_PROVIDER`            | `AGENTOPSHUB_VOICE_LLM_PROVIDER`            | Voice LLM provider                 |
| `PASEO_LOCAL_MODELS_DIR`              | `AGENTOPSHUB_LOCAL_MODELS_DIR`              | Local models directory             |

## OpenAI Cloud Speech Removed

AgentOpsHub removes OpenAI cloud speech providers entirely. Only local Sherpa-ONNX models are
supported:

- **STT**: Parakeet TDT (via Sherpa-ONNX)
- **TTS**: Kokoro (via Sherpa-ONNX)
- **VAD**: Silero (via Sherpa-ONNX)

The following environment variables are no longer read and can be removed from your config:

- `OPENAI_STT_API_KEY`
- `OPENAI_STT_BASE_URL`
- `OPENAI_TTS_API_KEY`
- `OPENAI_TTS_BASE_URL`
- `STT_CONFIDENCE_THRESHOLD` (was OpenAI-specific)
- `STT_MODEL` (was OpenAI-specific)
- `TTS_MODEL` (was OpenAI-specific)
- `TTS_VOICE` (was OpenAI-specific)

The only valid value for `AGENTOPSHUB_DICTATION_STT_PROVIDER` and all voice provider vars is
`local`. Cloud provider values are rejected at startup.

### Deprecation warnings

When you use a `PASEO_*` variable and the equivalent `AGENTOPSHUB_*` is not set, the daemon
prints a warning to stderr:

```
[AgentOpsHub] PASEO_LISTEN is deprecated; use AGENTOPSHUB_LISTEN instead.
```

## Home Directory

The default home directory changed from `~/.paseo` to `~/.agentopshub`.

If you have existing state in `~/.paseo`, copy it:

```bash
cp -r ~/.paseo ~/.agentopshub
```

The daemon reads `AGENTOPSHUB_HOME` first, then `PASEO_HOME`, then defaults to `~/.agentopshub`.

## CLI Command

The primary CLI command changed from `paseo` to `agentopshub`. The `paseo` alias is retained
as a deprecated compatibility shim.

```bash
# Old
paseo run --provider claude/opus-4.6 "task"
paseo ls

# New
agentopshub run --provider claude/opus-4.6 "task"
agentopshub ls
```

## npm Package

The npm package scope changed from `@getpaseo/*` to `@agentopshub/*`.

```bash
# Old
npm install -g @getpaseo/cli

# New
npm install -g @agentopshub/cli
```

## Docker

Update your Docker commands:

```bash
# Old
docker run -e PASEO_PASSWORD=... ghcr.io/getpaseo/paseo:latest

# New
docker run -e AGENTOPSHUB_PASSWORD=... ghcr.io/deenuy/agentopshub:latest
```

## Internal Identifiers Left Unchanged

The following identifiers intentionally retain Paseo names during the initial transition:

| Identifier                  | Reason                                     |
| --------------------------- | ------------------------------------------ |
| WebSocket RPC message types | Wire compatibility with existing clients   |
| Database table names        | Migration risk; backward-compatible reads  |
| `~/.paseo` fallback path    | Existing installations                     |
| `PASEO_*` env var fallback  | Backward compatibility with scripts and CI |
