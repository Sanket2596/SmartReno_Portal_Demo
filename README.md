## SmartReno Assessment

Monorepo containing the SmartReno dashboard frontend (Next.js 16, App Router) and backend prototype assets.

### Repo Structure

- `frontend/` – SmartReno portal (Next.js, Tailwind CSS)
- `backend/` – API prototype (not deployed to Vercel)
- `docker-compose.yml` – Local container setup (optional)

### Prerequisites

- Node.js **18.18+** (matches Vercel default runtime)
- npm **9+**

### Local Development

```bash
# install dependencies (frontend installs via postinstall)
npm install

# start the Next.js dev server
npm run dev
```

The app runs at `http://localhost:3000` (or 3001 if 3000 is busy).

### Production Build Check

```bash
npm run build
npm run start
```

### Preparing GitHub for Vercel

1. **Initialize git & commit**  
   ```bash
   git init
   git add .
   git commit -m "chore: prepare SmartReno portal for Vercel"
   ```

2. **Create remote repository**  
   - On GitHub, create a new repo (e.g. `smart-reno-portal`).
   - Add it as an origin and push:
     ```bash
     git remote add origin git@github.com:<org-or-user>/smart-reno-portal.git
     git branch -M main
     git push -u origin main
     ```

3. **Vercel project setup**  
   - Sign in to Vercel and click **Add New Project → Import Git Repository**.
   - Select the GitHub repo you just pushed.
   - **Framework Preset**: Next.js (auto-detected).
   - **Root Directory**: `.` (repo root).
   - **Build Command**: `npm run build` (default).
   - **Install Command**: `npm install` (default).
   - Leave **Output Directory** empty (Next.js handles it).
   - Configure environment variables if/when they are added to `.env.local`.

4. **Trigger deployment**  
   - Click **Deploy**. Vercel runs `npm install`, `npm run build`, and serves the production output.

5. **Subsequent updates**  
   - Push commits to `main` or open PRs; Vercel creates preview deployments automatically.

### Optional: `outputFileTracingRoot`

If you keep additional lockfiles or run tooling outside the repo root, set `outputFileTracingRoot` in `frontend/next.config.ts` to silence Next.js’ warning about multiple lockfiles.

### Contributing

- Run `npm run lint` before opening pull requests.
- Keep secrets out of source control—use Vercel environment variables instead.


