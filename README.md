# Drakken Lineage

A canon-disciplined, Three.js-driven evolutionary lineage laboratory for Starsilk's Drakken.

## Orbital Lineage Field

The main lineage chart is now a real Three.js scene rather than an SVG family drill-down.

- **All 58 documented strains are resident simultaneously.**
- Eight family hubs orbit the Mother/Egg origin.
- Every strain orbits its family hub while remaining visible and labeled.
- Drag/touch rotates the camera.
- Wheel/pinch zooms.
- Tap/click a strain, family, Mother, Egg, or unresolved post-Wall node to inspect it.
- Family and strain selectors focus the camera without hiding any other strains.
- System motion and camera auto-orbit can be paused independently.
- `prefers-reduced-motion` starts both automatic motions disabled.
- The 3D runtime is **Three.js 0.186.0 (r186)**, pinned in `package.json` and copied into the deployed artifact at build time. No CDN runtime hotlink is required.

The semantic DOM registry, homology ledger, Mother Kernel, Morphogenesis Compiler, evidence model, and canon/source-state distinctions remain intact.

## Current Compendium coverage

- **58 named strain entries** represented from the integrated Compendium.
- **8 family labels** represented.
- **35 strains** tagged as the later core-count roster.
- **23 additional integrated entries** retained rather than discarded.
- **Ringthroat** and **Gorevault** retained as locked expansion entries.
- The remaining expansion entries remain visible as **provisional** until the source-count conflict is explicitly reconciled.

## Build

```bash
npm install
npm run build
npm test
```

Serve `dist/` with any static HTTP server.

## GitHub Pages

Production URL:

`https://westkitty.github.io/Drakken_Lineage/`

GitHub Actions installs the exact pinned Three.js package, builds `dist/`, validates the output, and deploys the resulting static artifact.

## Canon policy

Direct Compendium entries are preserved as source-backed records. Source presence and canon authority are separate dimensions. Unknowns and contradictions remain explicit rather than being silently filled or discarded.

Generated Morphogenesis Compiler output is **not canon** unless separately ratified by the human canon owner.

## Core files

- `index.html` — application shell and local import map
- `styles.css` — visual system and 3D-label styling
- `app.js` — Three.js scene, orbital interaction, registry, compiler, and evidence UI
- `data/lineage.js` — source-backed Compendium roster and lineage dataset
- `scripts/build.mjs` — deterministic static build and local Three.js vendoring
- `tests/validate.mjs` — data, Three.js integration, build, privacy, and residency checks
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `OPERATIONAL_STATE.md` — current project control plane
