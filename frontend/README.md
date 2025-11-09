## Smart Reno Portal Frontend

This folder contains the Next.js 16 portal that powers the Smart Reno dashboard.

## Local Development

From the repo root:

```bash
npm install
npm run dev
```

- The install step bootstraps `frontend/node_modules` via a root `postinstall`.
- The dev server runs on [http://localhost:3000](http://localhost:3000).

### Useful scripts

```bash
npm run lint     # Lint via ESLint
npm run build    # Production build
npm run start    # Start production server locally (after build)
```

## Vercel Deployment

1. Push the repository to GitHub (or another Git provider).
2. Create a **New Project** in Vercel and import the repo.
3. When prompted:
   - **Framework Preset**: Next.js (detected automatically).
   - **Root Directory**: `.` (repo root – Vercel will use the new root `package.json`).
   - **Build Command**: leave as `npm run build`.
   - **Install Command**: leave as `npm install`.
   - **Output Directory**: leave blank (Next.js manages this).
4. If you add environment variables locally, replicate them under **Settings → Environment Variables** in Vercel.
5. Trigger the deployment – Vercel will install dependencies, run the build from the `frontend` app, and serve the output globally.

## Troubleshooting

- Ensure the project is using **Node 18.18+** (Vercel defaults to an appropriate version; locally use `nvm`/`fnm` if needed).
- Clear Vercel build cache if you upgrade dependencies and encounter unexpected build failures.
