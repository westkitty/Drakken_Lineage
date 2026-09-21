# Drakken Lineage

A canon-disciplined evolutionary lineage laboratory for Starsilk's Drakken.

The project models Drakken history as two simultaneous inheritance systems:

- **Body ancestry** — ordinary descent between engineered organisms.
- **Macro ancestry** — inherited executable biological architecture that may cross lineage boundaries.

It also separates **authorial truth** from **in-universe Drakken paleontology**, tracks structural homologies, records confidence and evidence state, and provides a Morphogenesis Compiler for testing whether a proposed descendant can be biologically derived rather than merely styled as "Drakken."

## GitHub Pages

Production URL:

`https://westkitty.github.io/Drakken_Lineage/`

Deployment is handled by `.github/workflows/pages.yml`. The workflow validates the project, stages only the browser-facing files, and deploys them with GitHub Pages Actions.

GitHub requires one repository-level setting before the first deployment:

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open **Actions → Deploy GitHub Pages** and run the workflow, or make any site-file commit to `main`.

After that one-time switch, future changes to the site files deploy automatically.

## Run locally

Open `index.html` directly in a modern browser. No build step or server is required.

For a local HTTP server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Validate

```bash
npm test
```

## Canon policy

The seeded dataset contains only source-backed war-era records and explicit unknown/provisional slots. Generated compiler output is **not canon** unless separately ratified by the human canon owner.

## Core files

- `index.html` — application shell
- `styles.css` — visual system
- `app.js` — interactions, rendering, local state, compiler
- `data/lineage.js` — canonical/provisional lineage dataset
- `data/schema.json` — portable record schema
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `OPERATIONAL_STATE.md` — current project control plane
