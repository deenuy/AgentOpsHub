# AgentOpsHub — development Makefile
# Daemon listens on AGENTOPSHUB_LISTEN (falls back to PASEO_LISTEN for compat)

LISTEN        ?= 127.0.0.1:6768
EXPO_PORT     ?= 8081
NODE          := node
NPM           := npm

export AGENTOPSHUB_LISTEN  := $(LISTEN)
export PASEO_LISTEN        := $(LISTEN)   # compat shim until scripts migrate
export EXPO_PORT

.PHONY: help install build build-deps \
        dev dev-server dev-website dev-desktop dev-app \
        start \
        test typecheck lint format \
        clean clean-all \
        status logs

# ── Default ───────────────────────────────────────────────────────────────────

help: ## Show this help
	@awk 'BEGIN{FS=":.*##"} /^[a-zA-Z_-]+:.*##/{printf "  \033[36m%-20s\033[0m %s\n",$$1,$$2}' $(MAKEFILE_LIST)

# ── Install ───────────────────────────────────────────────────────────────────

install: ## Install all workspace dependencies
	$(NPM) install

# ── Build ─────────────────────────────────────────────────────────────────────

build-protocol: ## Build @agentopshub/protocol
	$(NPM) run build --workspace=@agentopshub/protocol

build-relay: ## Build @agentopshub/relay
	$(NPM) run build --workspace=@agentopshub/relay

build-highlight: ## Build @agentopshub/highlight
	$(NPM) run build --workspace=@agentopshub/highlight

build-plugin: ## Build @agentopshub/plugin
	$(NPM) run build --workspace=@agentopshub/plugin

build-client: build-protocol build-relay ## Build @agentopshub/client (requires protocol + relay)
	$(NPM) run build --workspace=@agentopshub/client

build-deps: build-client build-highlight build-plugin build-relay ## Build all server dependencies
	$(NPM) run build --workspace=@agentopshub/relay

build-server: build-deps ## Build server + CLI
	$(NPM) run build --workspace=@agentopshub/server
	$(NPM) run build --workspace=@agentopshub/cli

build: ## Build all packages (full monorepo)
	$(NPM) run build --workspaces --if-present

# ── Dev servers ───────────────────────────────────────────────────────────────

dev: dev-server ## Alias for dev-server (daemon)

dev-server: ## Start daemon in dev/watch mode (default port $(LISTEN))
	$(NPM) run dev:server

dev-watch: ## Start daemon with protocol+client watchers (slower start, live reload)
	$(NPM) run dev:server:watch

dev-website: ## Start website (Vite dev server)
	$(NPM) run dev:website

dev-desktop: ## Start Electron desktop app
	$(NPM) run dev:desktop

dev-app: ## Start Expo mobile app (port $(EXPO_PORT))
	$(NPM) run dev:app

# ── Production start ──────────────────────────────────────────────────────────

start: ## Start the production daemon (requires build first)
	$(NPM) run start

# ── Quality ───────────────────────────────────────────────────────────────────

test: ## Run all workspace tests
	$(NPM) run test --workspaces --if-present

test-server: ## Run server unit + integration tests
	$(NPM) run test --workspace=@agentopshub/server

typecheck: ## TypeScript typecheck across all packages
	$(NPM) run typecheck --workspaces --if-present

lint: ## Lint with oxlint
	$(NPM) run lint

lint-fix: ## Lint and auto-fix
	$(NPM) run lint:fix

format: ## Format all files with oxfmt
	$(NPM) run format

format-check: ## Check formatting without writing
	$(NPM) run format:check

# ── Clean ─────────────────────────────────────────────────────────────────────

clean: ## Remove all dist/ build output
	find packages -name dist -type d -exec rm -rf {} + 2>/dev/null; true
	find packages -name '*.tsbuildinfo' -delete 2>/dev/null; true
	@echo "Build artifacts cleaned."

clean-all: clean ## Remove dist/ and node_modules (full reset)
	rm -rf node_modules
	find packages -name node_modules -type d -exec rm -rf {} + 2>/dev/null; true
	@echo "Full clean done. Run 'make install' to reinstall."

# ── Introspect ────────────────────────────────────────────────────────────────

status: ## Show current branch, last commit, and daemon listen address
	@echo "Branch  : $$(git branch --show-current)"
	@echo "Commit  : $$(git log --oneline -1)"
	@echo "Listen  : $(LISTEN)"
	@echo "Node    : $$(node --version)"
	@echo "npm     : $$(npm --version)"
