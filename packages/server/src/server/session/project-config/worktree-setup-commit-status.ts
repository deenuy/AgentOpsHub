import {
  PaseoConfigRawSchema,
  normalizeLifecycleCommands,
  type PaseoConfigRaw,
} from "@agentopshub/protocol/paseo-config-schema";
import { READ_ONLY_GIT_ENV } from "../../checkout-git-utils.js";
import { runGitCommand } from "../../../utils/run-git-command.js";

export async function hasUncommittedWorktreeSetupChanges(input: {
  repoRoot: string;
  currentConfig: PaseoConfigRaw | null;
}): Promise<boolean> {
  // Try new config name first, fall back to legacy; COMPAT(paseo): added in v0.13
  for (const name of ["agentopshub.json", "paseo.json"]) {
    const gitPath = await resolveConfigGitPath(input.repoRoot, name);
    const committedConfig = await readCommittedConfig(input.repoRoot, gitPath);
    if (committedConfig !== null) {
      const currentSetup = normalizeLifecycleCommands(input.currentConfig?.worktree?.setup);
      const committedSetup = normalizeLifecycleCommands(committedConfig.worktree?.setup);
      return !stringArraysEqual(currentSetup, committedSetup);
    }
  }
  const currentSetup = normalizeLifecycleCommands(input.currentConfig?.worktree?.setup);
  return currentSetup.length > 0;
}

async function resolveConfigGitPath(repoRoot: string, fileName: string): Promise<string> {
  const { stdout } = await runGitCommand(["rev-parse", "--show-prefix"], {
    cwd: repoRoot,
    envOverlay: READ_ONLY_GIT_ENV,
  });
  return `${stdout.trim()}${fileName}`;
}

async function readCommittedConfig(
  repoRoot: string,
  gitPath: string,
): Promise<PaseoConfigRaw | null> {
  await runGitCommand(["rev-parse", "--verify", "HEAD"], {
    cwd: repoRoot,
    envOverlay: READ_ONLY_GIT_ENV,
  });
  const { stdout: trackedPath } = await runGitCommand(
    ["ls-tree", "--name-only", "HEAD", "--", gitPath],
    {
      cwd: repoRoot,
      envOverlay: READ_ONLY_GIT_ENV,
    },
  );
  if (trackedPath.trim().length === 0) return null;

  const { stdout } = await runGitCommand(["show", `HEAD:${gitPath}`], {
    cwd: repoRoot,
    envOverlay: READ_ONLY_GIT_ENV,
  });
  return PaseoConfigRawSchema.parse(JSON.parse(stdout));
}

function stringArraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
