# Drakken Lineage Operational State
<!-- operational-state:metadata
{"schema_version":1,"project_id":"drakken-lineage","project_name":"Drakken Lineage","project_root":"repository root","artifact_path":"index.html","state_revision":5,"last_updated":"2026-09-21T21:55:00Z","current_baseline":{"identity":"Three.js orbital lineage main a28fe52c5c215197cbcb6ee63da4c1e9786b7e3e","state":"partially-verified","last_verified":"2026-09-21T21:54:23Z"},"scope_boundaries":["Drakken lineage web laboratory and repository-native canon data only"],"linked_parent_state":null}
-->

## 1. Project Identity and Scope
Interactive Starsilk Drakken lineage laboratory. The repository models body ancestry, Macro ancestry, homology, evidence state, developmental unknowns, Compendium source state, and non-canon descendant compilation.

## 2. Current Baseline
The browser-facing baseline is commit `a28fe52c5c215197cbcb6ee63da4c1e9786b7e3e`. The main lineage visualization is now a Three.js orbital field rather than the earlier SVG/family-drilldown chart. GitHub Pages deployment run `35659766877` completed successfully for this baseline.

## 3. Artifact Contract
Tablet-friendly interactive web application; all 58 documented strains must remain resident in the same lineage visualization; family focus may move the camera but must not remove strains; canon and inference remain visibly separated; direct source entries remain preserved when authorities disagree; generated descendant output never silently becomes canon.

## 4. Active Invariants
- **INV-001 — History in the body:** Every accepted descendant must preserve traceable ancestry through retained, transformed, lost, or repurposed structures.
- **INV-002 — Canon firewall:** Unknown and provisional material must remain visibly distinct from locked canon.
- **INV-003 — Dual ancestry:** Body descent and Macro inheritance remain separate edge types.
- **INV-004 — Politics is not phylogeny:** Civic faction membership must not imply biological lineage.
- **INV-005 — Function before face:** Morphology must derive from ancestral job, selection pressure, and structure before aesthetics.
- **INV-006 — Pages publication boundary:** Deployment publishes only browser-facing build output; project state and repository internals are excluded.
- **INV-007 — Source presence is not canon status:** A direct Compendium entry remains represented even when its placement conflicts with later meta-canon.
- **INV-008 — Private-source boundary:** Public repository content must not expose private Drive URLs, Drive IDs, account addresses, local user paths, or connector-local identifiers.
- **INV-009 — All-strain residency:** The 3D lineage scene must instantiate one node and one label for every entry in the 58-strain roster before reporting ready.
- **INV-010 — Focus without filtering:** Family and strain focus controls may reframe the camera but must never hide non-focused strains.
- **INV-011 — Reduced-motion respect:** Automatic system motion and camera auto-orbit start disabled when `prefers-reduced-motion` is active.

## 5. Verified Working Behavior
- **VER-001 — Repository build/validator:** GitHub Actions installs dependencies, builds the static artifact, and passes the deterministic validator on branch and `main`.
- **VER-002 — Full integrated roster:** 58 named direct strain records across eight family labels remain in the dataset, plus Egg and Mother.
- **VER-003 — Core/expansion classification:** Tests enforce 35 `core-35` strains and 23 additional integrated entries; Ringthroat and Gorevault remain locked expansion canon entries.
- **VER-004 — Three.js dependency contract:** Three.js is pinned to `0.186.0` (r186), installed at build time, and copied into the deployed artifact with OrbitControls, CSS2DRenderer, and the Three.js license; no runtime CDN hotlink is required.
- **VER-005 — 58/58 scene construction contract:** Source validation requires the Three.js construction loop, runtime residency assertion, strain labels, camera orbit controls, raycasting, and visible `58/58` residency copy. Build validation passes.
- **VER-006 — GitHub Pages deployment:** Pages run `35659766877` completed successfully, including dependency installation, static build, validator, Pages configuration, artifact upload, and deployment.
- **VER-007 — Public-boundary scan:** Generated public data continues to exclude checked private-source identifiers.

## 6. Known Not Working
None established in the production browser path.

## 7. Implemented but Unverified
- **UNV-001 — Live WebGL render:** This runtime cannot directly render and inspect the deployed GitHub Pages site. GitHub's headless Chrome smoke cannot establish the Three.js ready marker reliably and is explicitly non-blocking.
- **UNV-002 — Orbital interaction feel:** OrbitControls, system motion, camera auto-orbit, click/tap raycasting, camera focus tweening, zoom, and reset controls are implemented but have not been manually observed in a representative live browser from this runtime.
- **UNV-003 — All 58 labels visually legible simultaneously:** All 58 label objects are instantiated by construction, but overlap/readability in the final 3D camera view requires live visual review.
- **UNV-004 — Target tablet behavior:** Responsive controls, DPR cap, touch OrbitControls, and mobile layout are implemented but not yet verified on the target tablet.
- **UNV-005 — Morphogenesis Compiler browser export:** Source and structural validation pass; downloaded JSON has not been manually exercised in a live browser from this runtime.

## 8. Unknown or Evidence-Stale State
- **UNK-001 — Catalog-count authority conflict:** The integrated 2026-05-20 Compendium contains 60 direct full entries: Egg, Mother, and 58 named strains across eight family labels. Later 2026-07-30 meta-canon sources still state 37 total entries: Egg, 35 strains across five archetypes, and Mother.
- **UNK-002 — Universal Mother developmental kernel:** Source evidence remains insufficient beyond origin/Egg/strain-emergence anchors.
- **UNK-003 — Canonical post-Wall clades:** No post-Wall descendant names or morphologies were invented by the visualization migration.

## 9. Pending Work
- Perform live desktop/tablet visual QA of the Three.js lineage field, especially label overlap, camera distances, touch behavior, and perceived motion.
- Resolve or intentionally preserve the 60-entry integrated-roster versus 37-entry later-meta-canon conflict.
- Ratify post-Wall descendant clades before promoting any generated record.
- Add visual lineage plates only after canonical descendant anatomy exists.

## 10. Active Decisions, Defaults, and Prohibitions
- The lineage visualization is vanilla Three.js using `WebGLRenderer`.
- Three.js is pinned to `0.186.0` and deployed locally through the build artifact.
- Ordinary interface controls, registry, evidence, and inspector remain semantic DOM rather than world-space UI.
- All 58 strain nodes remain resident simultaneously; selectors change focus only.
- System motion and camera auto-orbit are independently controllable.
- Device pixel ratio is capped at 1.75 for mobile-sensitive rendering.
- The project provides a non-3D fallback message while preserving the complete DOM registry if WebGL creation fails.
- Direct Compendium presence and canon authority remain separate dimensions.
- Do not use generic humanoid-dragon anatomy as a default.
- Do not infer post-Wall biology from political faction.
- Private Drive locations and identifiers must never be copied into the public repository.
- GitHub headless-WebGL smoke is best-effort evidence only and must not be promoted to proof of live rendering.

## 11. Validation and Evidence Matrix
| ID | Claim | State | Method | Recheck trigger |
|---|---|---|---|---|
| VER-001 | Three.js dependency installs and static artifact builds | verified | GitHub Actions | package/build changes |
| VER-002 | Dataset remains 58 strains / 8 families | verified | deterministic tests | Compendium changes |
| VER-003 | Code constructs one 3D node and label per strain and asserts 58/58 residency | verified at source/build level | deterministic source/build checks | 3D scene changes |
| VER-004 | Pages deploys the Three.js artifact successfully | verified | Pages run `35659766877` | deployment/site changes |
| UNV-001 | Production browser actually initializes WebGL and renders the scene | implemented-unverified | live browser observation required | renderer/dependency/browser changes |
| UNV-002 | Drag/touch orbit, zoom, click selection, auto-orbit, and focus controls feel correct | implemented-unverified | manual browser interaction | interaction/camera changes |
| UNV-003 | All 58 labels are visually usable without unacceptable overlap | implemented-unverified | visual QA | layout/label/camera changes |
| UNV-004 | Target tablet performance and touch UX are acceptable | implemented-unverified | target-device QA | rendering/layout changes |
| UNK-001 | 60-entry integrated roster versus 37-entry later meta-canon authority | unresolved | source comparison | explicit canon reconciliation |

## 12. Current Change Scope and Impact Radius
The completed change replaces only the lineage visualization architecture and build/deployment path needed to support it. It preserves the full Compendium dataset, registry, evidence model, Mother Kernel, homology ledger, Morphogenesis Compiler, canon-status distinctions, and Pages destination. New runtime surfaces are Three.js, OrbitControls, CSS2DRenderer, local build vendoring, camera/touch interaction, orbital animation, and 3D labels.

## 13. Compact Revision Log
- **r1 — 2026-09-21:** Initial repository control plane established alongside the first working lineage laboratory.
- **r2 — 2026-09-21:** Remote repository publication and GitHub Actions validator verified.
- **r3 — 2026-09-21:** Added GitHub Pages deployment pipeline.
- **r4 — 2026-09-21:** Imported all 60 direct integrated Compendium entries, representing all 58 strains across eight families.
- **r5 — 2026-09-21:** Replaced the SVG lineage chart with a pinned Three.js orbital field where all 58 strains remain resident simultaneously; added camera orbit/zoom/focus, animated family and strain orbits, tap/click inspection, responsive controls, local Three.js build vendoring, and successful Pages deployment. Live visual/browser feel remains explicitly unverified.
