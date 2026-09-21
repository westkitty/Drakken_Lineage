# Drakken Lineage

A canon-disciplined evolutionary lineage laboratory for Starsilk's Drakken.

The current registry is source-grounded against the integrated Drakken Terraforming Compendium in Google Drive and cross-checked against later Starsilk meta-canon files.

## Current Compendium coverage

- **58 named strain entries** represented from the integrated Compendium.
- **8 family labels** represented.
- **35 strains** are tagged as the core-count roster described by the later 37-entry meta-canon.
- **23 additional integrated entries** are retained rather than discarded.
- **Ringthroat** and **Gorevault** are retained as locked expansion entries.
- The remaining expansion entries are visible as **provisional** until the source-count conflict is explicitly reconciled.

The count conflict is intentional and visible in the application: the integrated Compendium contains 60 full entries (Egg + 58 strains + Mother), while later meta-canon documents still describe 37 total entries (Egg + 35 strains + Mother). The repository does not silently choose one history and erase the other.

The project models Drakken history as two simultaneous inheritance systems:

- **Body ancestry** — ordinary descent between engineered organisms.
- **Macro ancestry** — inherited executable biological architecture that may cross lineage boundaries.

It also separates **authorial truth** from **in-universe Drakken paleontology**, tracks structural homologies, records confidence and evidence state, and provides a Morphogenesis Compiler for testing whether a proposed descendant can be biologically derived rather than merely styled as "Drakken."

## GitHub Pages

Production URL:

`https://westkitty.github.io/Drakken_Lineage/`

Deployment is handled by `.github/workflows/pages.yml`. Site-code and data changes on `main` validate and deploy automatically.

## Run locally

Open `index.html` directly in a modern browser, or use:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Validate

```bash
npm test
```

## Canon policy

Direct Compendium entries are always preserved as source-backed records. A record's **canon state** is separate from its **source presence**. Unknowns and contradictions are represented rather than silently filled or discarded.

Generated Morphogenesis Compiler output is **not canon** unless separately ratified by the human canon owner.

## Core files

- `index.html` — application shell
- `styles.css` — visual system
- `app.js` — interactions, filtering, rendering, compiler
- `data/lineage.js` — source-backed Compendium roster and lineage dataset
- `data/schema.json` — portable descendant-record schema
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `OPERATIONAL_STATE.md` — current project control plane
