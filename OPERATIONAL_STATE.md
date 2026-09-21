# Drakken Lineage Operational State
<!-- operational-state:metadata
{"schema_version":1,"project_id":"drakken-lineage","project_name":"Drakken Lineage","project_root":"repository root","artifact_path":"index.html","state_revision":4,"last_updated":"2026-09-21T21:32:00Z","current_baseline":{"identity":"site/data commit 4a44526f1a075df1fc323e2dccd1e7dcd84e93aa","state":"partially-verified","last_verified":"2026-09-21T21:31:04Z"},"scope_boundaries":["Drakken lineage web laboratory and repository-native canon data only"],"linked_parent_state":null}
-->

## 1. Project Identity and Scope
Interactive Starsilk Drakken lineage laboratory. The repository models body ancestry, Macro ancestry, homology, evidence state, developmental unknowns, Compendium source state, and non-canon descendant compilation.

## 2. Current Baseline
The full integrated Compendium roster is published on GitHub `main` and deployed through GitHub Pages. The browser-facing baseline is commit `4a44526f1a075df1fc323e2dccd1e7dcd84e93aa`.

## 3. Artifact Contract
Browser-openable zero-dependency web application; tablet-friendly; canon and inference visibly separated; direct source entries preserved even when source authorities disagree; generated descendant output never silently promoted to canon; GitHub Pages deployment publishes only browser-facing files.

## 4. Active Invariants
- **INV-001 — History in the body:** Every accepted descendant must preserve traceable ancestry through retained, transformed, lost, or repurposed structures.
- **INV-002 — Canon firewall:** Unknown and provisional material must remain visibly distinct from locked canon.
- **INV-003 — Dual ancestry:** Body descent and Macro inheritance are separate edge types.
- **INV-004 — Politics is not phylogeny:** Civic faction membership must not imply biological lineage.
- **INV-005 — Function before face:** Morphology must derive from ancestral job, selection pressure, and structure before aesthetics.
- **INV-006 — Pages publication boundary:** Deployment stages only `index.html`, `styles.css`, `app.js`, and required `data/` browser assets; project state and repository internals are not part of the public site artifact.
- **INV-007 — Source presence is not canon status:** A direct Compendium entry must remain represented even when its placement conflicts with later meta-canon; source-backed expansion records may remain provisional.
- **INV-008 — Private-source boundary:** Public repository content must not expose private Drive URLs, Drive IDs, account addresses, local user paths, or connector-local identifiers.

## 5. Verified Working Behavior
- **VER-001 — Repository validator:** `npm test` passes on the full-roster validation branch and on `main`.
- **VER-002 — Full integrated roster import:** The repository contains 58 named direct strain records across eight family labels, plus Egg and Mother, matching the 60 direct entries parsed from the integrated Compendium.
- **VER-003 — Core/expansion classification:** Tests enforce exactly 35 `core-35` strains and 23 additional integrated entries. Ringthroat and Gorevault remain locked expansion canon entries.
- **VER-004 — Public-boundary scan:** Generated public files pass checks excluding Drive URLs, account email addresses, local `/Users/` paths, and connector-style file IDs.
- **VER-005 — GitHub Pages deployment:** GitHub Pages workflow run `35657573739` completed successfully for browser-facing commit `4a44526f1a075df1fc323e2dccd1e7dcd84e93aa`, including validation, Pages configuration, artifact upload, and deployment.
- **VER-006 — Remote file tree:** GitHub `main` contains the expanded application, source-grounded data, tests, workflows, README, and operational state.

## 6. Known Not Working
None established.

## 7. Implemented but Unverified
- **UNV-001 — Interactive lineage graph user journey:** Source and structural tests pass, including full-family data routing; rendered browser interaction has not been manually observed in this runtime.
- **UNV-002 — Compendium Registry user journey:** Search, family filters, canon-state filters, and 58-strain rendering are implemented and structurally validated but not manually browser-observed here.
- **UNV-003 — Morphogenesis Compiler user journey:** Source and structural tests pass; form interaction and downloaded JSON have not been manually browser-observed here.
- **UNV-004 — Responsive tablet layout:** Responsive CSS is implemented but has not been visually verified on the target tablet in this runtime.
- **UNV-005 — Live HTTP render:** GitHub reports the Pages deployment successful, but this runtime has not independently rendered the deployed URL and inspected CSS/module/data loading.

## 8. Unknown or Evidence-Stale State
- **UNK-001 — Catalog-count authority conflict:** The integrated 2026-05-20 Compendium contains 60 direct full entries: Egg, Mother, and 58 named strains across eight family labels. Later 2026-07-30 meta-canon sources still state 37 total entries: Egg, 35 strains across five archetypes, and Mother. This conflict remains unresolved rather than silently flattened.
- **UNK-002 — Universal Mother developmental kernel:** Source evidence remains insufficient beyond origin/Egg/strain-emergence anchors.
- **UNK-003 — Canonical post-Wall clades:** No post-Wall descendant names or morphologies were invented by the roster import.

## 9. Pending Work
- Resolve or intentionally preserve the 60-entry integrated-roster versus 37-entry later-meta-canon conflict.
- Ratify post-Wall descendant clades before promoting any generated record.
- Add visual lineage plates only after canonical descendant anatomy exists.
- Perform direct browser/tablet QA when a suitable runtime is available.

## 10. Active Decisions, Defaults, and Prohibitions
- Zero external runtime dependencies for the initial app.
- Direct Compendium presence and canon authority are separate dimensions.
- The first 35 strains matching the later five-family × seven structure are tagged `core-35`.
- Ringthroat and Gorevault are tagged `locked-expansion` and remain canon because current active canon separately locks their Blood Ring roles.
- The other integrated entries beyond the core count remain visible as `integrated-expansion` and provisional until the count conflict is explicitly resolved.
- Do not use generic humanoid-dragon anatomy as a default.
- Do not infer post-Wall biology from political faction.
- GitHub Pages deploys through Actions, not by publishing the whole repository root.
- Private Drive locations and identifiers must never be copied into the public repository.

## 11. Validation and Evidence Matrix
| ID | Claim | State | Method | Recheck trigger |
|---|---|---|---|---|
| VER-001 | Full-roster validator passes | verified | GitHub Actions on branch and `main` | data/tests changes |
| VER-002 | 58 strains / 8 families are represented | verified | deterministic roster assertions | Compendium import changes |
| VER-003 | 35 core-count + 23 expansion classification is preserved | verified | deterministic test assertions | canon/count decision changes |
| VER-004 | Public generated files contain no checked private-source identifiers | verified | boundary scan + repository test | source/import/publication changes |
| VER-005 | Pages deployment for full-roster commit succeeds | verified | GitHub Actions run `35657573739` | Pages/site changes |
| UNV-001 | Lineage network renders and filters all family views correctly | implemented-unverified | browser interaction | graph/data/UI changes |
| UNV-002 | Registry search/filter experience works visually with all 58 strains | implemented-unverified | browser interaction | registry/data/UI changes |
| UNV-003 | Compiler produces downloadable non-canon JSON correctly in browser | implemented-unverified | browser form/export | compiler changes |
| UNV-004 | Tablet/mobile layout remains usable | implemented-unverified | responsive device review | CSS/layout changes |
| UNV-005 | Production URL serves the complete app without runtime asset errors | implemented-unverified | live browser render | deployment/site changes |
| UNK-001 | 60-entry integrated roster versus 37-entry later meta-canon authority | unresolved | source comparison | explicit canon reconciliation |

## 12. Current Change Scope and Impact Radius
The completed change imported the full integrated Compendium roster into `data/lineage.js`, expanded graph/registry/compiler/evidence UI support, strengthened tests and privacy boundaries, updated README coverage, and redeployed Pages. No external Starsilk repository or Drive source was modified.

## 13. Compact Revision Log
- **r1 — 2026-09-21:** Initial repository control plane established alongside the first working lineage laboratory.
- **r2 — 2026-09-21:** Remote repository publication and GitHub Actions validator verified; browser interaction remains explicitly unverified.
- **r3 — 2026-09-21:** Added GitHub Pages deployment pipeline and recorded its then-active repository enablement blocker.
- **r4 — 2026-09-21:** Imported all 60 direct integrated Compendium entries, represented all 58 strains across eight families, preserved the 35-versus-58 authority conflict, passed public-boundary checks, and verified successful GitHub Pages deployment.
