# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## GitHub Pages deployment

The site is built with Vite and deployed by the workflow in `.github/workflows/deploy.yml`.
It runs on every push to `main` and publishes the `dist/` folder via GitHub's official
Pages actions. The live URL is <https://swavikpatra.github.io/portfolio/>.

Setup steps (one time):

1. Push the repo to GitHub (the workflow targets the `main` branch).
2. In the repository settings, go to **Pages → Build and deployment** and set
   **Source** to **GitHub Actions**.
3. The next push to `main` (or a manual run of the **Deploy to GitHub Pages**
   workflow) publishes the site.

The Vite `base` path defaults to `/portfolio/`, matching the repository name. If
you rename the repo or use a custom domain, set the `VITE_BASE_PATH` variable
(for a custom domain use `/`) in the workflow or in your local `.env` file.

Run locally after the base-path change at <http://localhost:5173/portfolio/>:

```sh
npm ci
npm run dev
```

Verify the production build before pushing with `npm run build` (typecheck +
bundle) and `npm run lint`.
