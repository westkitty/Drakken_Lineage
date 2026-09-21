# Drakken Lineage Operational State
<!-- operational-state:metadata
{"schema_version":1,"project_id":"drakken-lineage","project_name":"Drakken Lineage","project_root":"repository root","artifact_path":"index.html","state_revision":2,"last_updated":"2026-09-21T21:02:00Z","current_baseline":{"identity":"GitHub main c7c5c869da44d7a917a2e698eb1304a616fb4d55","state":"partially-verified","last_verified":"2026-09-21T20:59:44Z"},"scope_boundaries":["Drakken lineage web laboratory and repository-native canon data only"],"linked_parent_state":null}
-->

## 1. Project Identity and Scope
Interactive Starsilk Drakken lineage laboratory. The repository models body ancestry, Macro ancestry, homology, evidence state, developmental unknowns, and non-canon descendant compilation.

## 2. Current Baseline
Initial implementation published to GitHub `main`.

## 3. Artifact Contract
Browser-openable zero-dependency web application; tablet-friendly; canon and inference visibly separated; generated descendant output never silently promoted to canon.

## 4. Active Invariants
- **INV-001 — History in the body:** Every accepted descendant must preserve traceable ancestry through retained, transformed, lost, or repurposed structures.
- **INV-002 — Canon firewall:** Unknown and provisional material must remain visibly distinct from source-backed canon.
- **INV-003 — Dual ancestry:** Body descent and Macro inheritance are separate edge types.
- **INV-004 — Politics is not phylogeny:** Civic faction membership must not imply biological lineage.
- **INV-005 — Function before face:** Morphology must derive from ancestral job, selection pressure, and structure before aesthetics.

## 5. Verified Working Behavior
- **VER-001 — Repository validator:** `npm test` passes locally and GitHub Actions completed successfully on `main` commit `c7c5c869da44d7a917a2e698eb1304a616fb4d55`.
- **VER-002 — Remote file tree:** GitHub `main` contains the application shell, data/schema, validator, workflow, README, and operational state.

## 6. Known Not Working
None established.

## 7. Implemented but Unverified
- **UNV-001 — Interactive lineage graph:** Source and structural tests pass; browser interaction not yet visually verified.
- **UNV-002 — Morphogenesis compiler:** Source and structural tests pass; form/export user path not yet browser-verified.
- **UNV-003 — Responsive tablet layout:** CSS implemented; device/browser path not yet visually verified.

## 8. Unknown or Evidence-Stale State
- **UNK-001 — Full Compendium import:** Only a bounded source-backed seed set is included in v0.1; remaining strains require structured extraction.
- **UNK-002 — Universal Mother developmental kernel:** Source evidence currently insufficient beyond origin/Egg/strain-emergence anchors.
- **UNK-003 — Canonical post-Wall clades:** No descendant names or morphologies are invented by this build.

## 9. Pending Work
- Import all source-backed Compendium strains into the registry.
- Ratify post-Wall descendant clades before promoting any generated record.
- Add visual lineage plates only after canonical descendant anatomy exists.

## 10. Active Decisions, Defaults, and Prohibitions
- Zero external runtime dependencies for the initial app.
- Source-backed data is marked `canon`; missing evidence is `unknown`; compiler output is `provisional`.
- Do not use generic humanoid-dragon anatomy as a default.
- Do not infer post-Wall biology from political faction.

## 11. Validation and Evidence Matrix
| ID | Claim | State | Method | Recheck trigger |
|---|---|---|---|---|
| VER-001 | Repository validator passes | verified | local `npm test` + GitHub Actions | validator/data changes |
| VER-002 | Required repository file tree exists on `main` | verified | GitHub contents readback | repository publication changes |
| UNV-001 | Lineage network renders and filters body/Macro edges | implemented-unverified | browser interaction | graph/data changes |
| UNV-002 | Compiler produces explicit non-canon JSON with derivation warnings | implemented-unverified | form submission/export | compiler changes |
| UNV-003 | Tablet/mobile layout remains usable | implemented-unverified | responsive browser review | CSS/layout changes |

## 12. Current Change Scope and Impact Radius
Initial repository creation. All project files are within scope. No external Starsilk repositories are modified.

## 13. Compact Revision Log
- **r1 — 2026-09-21:** Initial repository control plane established alongside the first working lineage laboratory.
- **r2 — 2026-09-21:** Remote repository publication and GitHub Actions validator verified; browser interaction remains explicitly unverified.
