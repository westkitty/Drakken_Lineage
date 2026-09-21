# Drakken Lineage Operational State
<!-- operational-state:metadata
{"schema_version":1,"project_id":"drakken-lineage","project_name":"Drakken Lineage","project_root":"repository root","artifact_path":"index.html","state_revision":3,"last_updated":"2026-09-21T21:08:00Z","current_baseline":{"identity":"GitHub main with Pages-ready source and deployment workflow","state":"partially-verified","last_verified":"2026-09-21T21:05:02Z"},"scope_boundaries":["Drakken lineage web laboratory and repository-native canon data only"],"linked_parent_state":null}
-->

## 1. Project Identity and Scope
Interactive Starsilk Drakken lineage laboratory. The repository models body ancestry, Macro ancestry, homology, evidence state, developmental unknowns, and non-canon descendant compilation.

## 2. Current Baseline
Initial implementation is published to GitHub `main`. GitHub Pages deployment infrastructure is installed and validated through the repository Actions runner up to GitHub's repository-level Pages enablement gate.

## 3. Artifact Contract
Browser-openable zero-dependency web application; tablet-friendly; canon and inference visibly separated; generated descendant output never silently promoted to canon; GitHub Pages deployment must publish only browser-facing files.

## 4. Active Invariants
- **INV-001 — History in the body:** Every accepted descendant must preserve traceable ancestry through retained, transformed, lost, or repurposed structures.
- **INV-002 — Canon firewall:** Unknown and provisional material must remain visibly distinct from source-backed canon.
- **INV-003 — Dual ancestry:** Body descent and Macro inheritance are separate edge types.
- **INV-004 — Politics is not phylogeny:** Civic faction membership must not imply biological lineage.
- **INV-005 — Function before face:** Morphology must derive from ancestral job, selection pressure, and structure before aesthetics.
- **INV-006 — Pages publication boundary:** Deployment must stage only `index.html`, `styles.css`, `app.js`, and required `data/` browser assets; project state and repository internals are not part of the public site artifact.

## 5. Verified Working Behavior
- **VER-001 — Repository validator:** `npm test` passes locally and in GitHub Actions.
- **VER-002 — Remote file tree:** GitHub `main` contains the application shell, data/schema, validator, workflows, README, and operational state.
- **VER-003 — Pages workflow pre-deploy path:** The Pages workflow checks out the repository, configures Node, and passes `npm test` on GitHub's runner before reaching the repository-level Pages configuration step.

## 6. Known Not Working
- **BRK-001 — First Pages deployment is blocked by repository setting:** GitHub's `actions/configure-pages@v5` returns `Get Pages site failed ... Not Found` because Pages is not yet enabled and configured to use GitHub Actions for this repository. Required repair is the one-time GitHub repository setting **Settings → Pages → Build and deployment → Source → GitHub Actions**, followed by rerunning `Deploy GitHub Pages`.

## 7. Implemented but Unverified
- **UNV-001 — Interactive lineage graph:** Source and structural tests pass; browser interaction not yet visually verified.
- **UNV-002 — Morphogenesis compiler:** Source and structural tests pass; form/export user path not yet browser-verified.
- **UNV-003 — Responsive tablet layout:** CSS implemented; device/browser path not yet visually verified.
- **UNV-004 — Live GitHub Pages site:** Deployment workflow is implemented but cannot complete until BRK-001 is cleared.

## 8. Unknown or Evidence-Stale State
- **UNK-001 — Full Compendium import:** Only a bounded source-backed seed set is included in v0.1; remaining strains require structured extraction.
- **UNK-002 — Universal Mother developmental kernel:** Source evidence currently insufficient beyond origin/Egg/strain-emergence anchors.
- **UNK-003 — Canonical post-Wall clades:** No descendant names or morphologies are invented by this build.

## 9. Pending Work
- Clear BRK-001 with the one-time GitHub Pages source setting and rerun `Deploy GitHub Pages`.
- After deployment, verify `https://westkitty.github.io/Drakken_Lineage/` loads its CSS, JavaScript modules, data imports, hash navigation, and compiler path correctly.
- Import all source-backed Compendium strains into the registry.
- Ratify post-Wall descendant clades before promoting any generated record.
- Add visual lineage plates only after canonical descendant anatomy exists.

## 10. Active Decisions, Defaults, and Prohibitions
- Zero external runtime dependencies for the initial app.
- Source-backed data is marked `canon`; missing evidence is `unknown`; compiler output is `provisional`.
- Do not use generic humanoid-dragon anatomy as a default.
- Do not infer post-Wall biology from political faction.
- GitHub Pages deploys through Actions, not by publishing the whole repository root.
- The Pages workflow runs automatically only when browser-facing code/data changes; documentation/state-only commits do not trigger a deployment.

## 11. Validation and Evidence Matrix
| ID | Claim | State | Method | Recheck trigger |
|---|---|---|---|---|
| VER-001 | Repository validator passes | verified | local `npm test` + GitHub Actions | validator/data changes |
| VER-002 | Required repository file tree exists on `main` | verified | GitHub contents readback | repository publication changes |
| VER-003 | Pages job validates successfully before repository enablement | verified | GitHub Actions run 35655033576 | Pages workflow/site changes |
| BRK-001 | Pages repository source is not enabled for GitHub Actions | known-broken | `configure-pages@v5` 404 in run 35655033576 | repository Pages setting changes |
| UNV-001 | Lineage network renders and filters body/Macro edges | implemented-unverified | browser interaction | graph/data changes |
| UNV-002 | Compiler produces explicit non-canon JSON with derivation warnings | implemented-unverified | form submission/export | compiler changes |
| UNV-003 | Tablet/mobile layout remains usable | implemented-unverified | responsive browser review | CSS/layout changes |
| UNV-004 | GitHub Pages production URL serves the app | implemented-unverified | live URL and asset-path verification | Pages deployment/settings changes |

## 12. Current Change Scope and Impact Radius
GitHub Pages publication only. Core lineage data, canon rules, application interactions, and visual design were preserved. New/changed surfaces are `.github/workflows/pages.yml`, README deployment instructions, and this operational-state record.

## 13. Compact Revision Log
- **r1 — 2026-09-21:** Initial repository control plane established alongside the first working lineage laboratory.
- **r2 — 2026-09-21:** Remote repository publication and GitHub Actions validator verified; browser interaction remains explicitly unverified.
- **r3 — 2026-09-21:** Added GitHub Pages deployment pipeline, verified the pre-deploy path, and recorded the one-time repository Pages enablement blocker.
