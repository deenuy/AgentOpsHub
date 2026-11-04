import { z } from "zod";

export const PluginIdSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);
// Semver validation belongs at the manifest/runtime boundary, not on the wire.
export const PluginRequirementsSchema = z.object({
  agentopshub: z.string().optional(),
  // COMPAT(paseo): legacy key; added in v0.13, remove after 2027-01
  paseo: z.string().optional(),
});
export type PluginRequirements = z.infer<typeof PluginRequirementsSchema>;

export const DirectoryPluginSourceSchema = z
  .object({
    source: z.literal("directory"),
    path: z.string().min(1),
    enabled: z.boolean().optional(),
  })
  .strict();

export const PluginSourceSchema = z.discriminatedUnion("source", [DirectoryPluginSourceSchema]);

export type PluginSource = z.infer<typeof PluginSourceSchema>;
