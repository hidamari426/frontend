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

## VercelとGoogleログインの設定

Googleログイン後に `localhost` へ移動する場合は、SupabaseがVercelのURLを許可しておらず、AuthのSite URLへフォールバックしている可能性があります。

Supabase Dashboardの **Authentication > URL Configuration** で次を設定してください。

- **Site URL**: 本番のVercel URL（例: `https://your-app.vercel.app`）
- **Redirect URLs**: `http://localhost:5173/**`
- **Redirect URLs**: `https://your-app.vercel.app/**`
- Preview Deploymentでもログインする場合: `https://*-your-team.vercel.app/**`

VercelのEnvironment Variablesには `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定し、変更後に再デプロイしてください。

Google Cloud Consoleに登録するOAuthコールバックURLはVercel URLではなく、Supabase Dashboardの **Authentication > Providers > Google** に表示されるCallback URLです。

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

`vercel.json` はReact RouterのURLを直接開いた場合にも `index.html` を返すための設定です。
