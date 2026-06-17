# Wezero

Marketing website for Wezero — a web agency for companies that care about the details.

## Tech Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Smooth scroll**: Lenis
- **Package manager**: Bun
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions — deploys on push to `main`, preview URLs on PRs

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, services, why Wezero, featured work, CTA |
| `/work` | Work index — project grid and process overview |
| `/work/[slug]` | Project detail page |
| `/about` | About — story, values, team |
| `/contact` | Contact form |

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with Turbopack |
| `bun run build` | Production static build → `out/` |
| `bun run lint` | Run ESLint |
| `bun run type-check` | TypeScript type checking |

## Deployment

Push to `main` — the CI pipeline handles the rest.

**Required GitHub secrets:**

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages write permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `GH_ADMIN_TOKEN` | *(Optional)* GitHub PAT with `administration:write` — auto-sets the repo homepage URL to the live deployment URL |

The Cloudflare Pages project name is derived from the GitHub repository name automatically. On first push, the workflow creates the project and deploys. PRs get isolated preview deployments with a URL comment.

## Project Structure

```
src/
  app/
    page.tsx              # Home
    layout.tsx            # Root layout (fonts, metadata)
    globals.css           # Global styles + Tailwind
    work/
      page.tsx            # Work index
      [slug]/
        page.tsx          # Project detail route
        ProjectDetail.tsx # Project detail component
    about/
      page.tsx
    contact/
      page.tsx
public/
  _headers              # Cloudflare Pages response headers
.github/
  workflows/
    ci.yml              # Lint → type-check → build → deploy
```
