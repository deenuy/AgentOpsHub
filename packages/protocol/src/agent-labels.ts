// New canonical label key; old key kept for backward compat — read both, write new only.
export const PARENT_AGENT_ID_LABEL = "agentopshub.parent-agent-id";
const PARENT_AGENT_ID_LABEL_LEGACY = "paseo.parent-agent-id"; // COMPAT(paseo): added in v0.13, remove after 2027-01

const OPEN_AGENT_TAB_LABEL_PREFIX = "agentopshub.open-agent-tab.";
const OPEN_AGENT_TAB_LABEL_PREFIX_LEGACY = "paseo.open-agent-tab."; // COMPAT(paseo): added in v0.13, remove after 2027-01

export function getOpenAgentTabLabel(clientId: string): string {
  return `${OPEN_AGENT_TAB_LABEL_PREFIX}${clientId}`;
}

export function isOpenAgentTabLabel(label: string): boolean {
  return (
    label.startsWith(OPEN_AGENT_TAB_LABEL_PREFIX) ||
    label.startsWith(OPEN_AGENT_TAB_LABEL_PREFIX_LEGACY)
  );
}

export interface AgentLabelSource {
  labels?: Record<string, unknown> | null;
}

export function getParentAgentIdFromLabels(labels: Record<string, unknown> | null | undefined) {
  const parentAgentId = labels?.[PARENT_AGENT_ID_LABEL] ?? labels?.[PARENT_AGENT_ID_LABEL_LEGACY];
  return typeof parentAgentId === "string" && parentAgentId.trim().length > 0
    ? parentAgentId.trim()
    : null;
}

export function isDelegatedAgent(agent: AgentLabelSource): boolean {
  return getParentAgentIdFromLabels(agent.labels) !== null;
}

export function hasOpenAgentTab(labels: Record<string, unknown> | null | undefined): boolean {
  return Object.entries(labels ?? {}).some(
    ([label, value]) => isOpenAgentTabLabel(label) && value === "true",
  );
}
