# Cloudflare Pages Deployment

`alvinalanding` deploys to Cloudflare Pages from GitHub Actions and can manage DNS either in Cloudflare or in Namecheap.

## What the workflow does

1. Runs `npm ci`, `npm test`, and `npm run build`.
2. Ensures the Pages project exists and matches the expected build settings.
3. Uploads `dist/` to Cloudflare Pages.
4. On `main`, attaches custom domains in Pages.
5. Optionally updates DNS records in Cloudflare or Namecheap, depending on repository variables.

## GitHub Secrets

Add these in `Settings -> Secrets and variables -> Actions`:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The Cloudflare token should have at least:

- `Pages Write`
- `Zone DNS Edit` if Cloudflare DNS should also be managed automatically

If the domain stays on Namecheap DNS, also add these GitHub secrets:

- `NAMECHEAP_API_USER`
- `NAMECHEAP_USERNAME`
- `NAMECHEAP_API_KEY`
- `NAMECHEAP_CLIENT_IP`

## GitHub Variables

Repository variables used by `.github/workflows/cloudflare-pages.yml`:

- `CLOUDFLARE_PAGES_PROJECT`
  Default: `alvinalanding`
- `CLOUDFLARE_PAGES_DOMAINS`
  Comma-separated custom domains, for example `alvina.mmix.dev,www.alvina.mmix.dev`
- `DNS_PROVIDER`
  `cloudflare` or `namecheap`. Default: `cloudflare`
- `CLOUDFLARE_ZONE_ID`
  Needed only when `DNS_PROVIDER=cloudflare`
- `CLOUDFLARE_DNS_TARGET`
  Optional override for the DNS target. Default is `<project>.pages.dev`
- `CLOUDFLARE_DNS_PROXIED`
  Optional, default `true`
- `NAMECHEAP_DOMAIN`
  Root zone hosted on Namecheap DNS, for example `mmix.dev`
- `NAMECHEAP_DNS_TARGET`
  Optional override for the Namecheap ALIAS/CNAME target. Default is `<project>.pages.dev`
- `NAMECHEAP_DNS_TTL`
  Optional TTL in seconds for managed Namecheap records. Default: `300`
- `NAMECHEAP_DNS_SYNC_ENABLED`
  Optional, default `false`. Keep it disabled on GitHub-hosted runners because Namecheap API checks an allowlisted client IP.
- `VITE_SITE_URL`
  Public site URL used for sitemap/robots generation during build

## Branch behavior

- `main` creates a production deployment and syncs domains
- `claude/**` and `preview/**` create preview deployments only

## Local commands

Project setup and domain sync can also be run locally:

```bash
npm run cf:pages:ensure
npm run cf:pages:domains
npm run namecheap:dns:sync
```

Required environment variables for local use:

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_PAGES_PROJECT=alvinalanding
export CLOUDFLARE_PAGES_DOMAINS=alvina.mmix.dev,www.alvina.mmix.dev
export CLOUDFLARE_ZONE_ID=...
export DNS_PROVIDER=namecheap
export NAMECHEAP_DOMAIN=mmix.dev
export NAMECHEAP_API_USER=...
export NAMECHEAP_USERNAME=...
export NAMECHEAP_API_KEY=...
export NAMECHEAP_CLIENT_IP=...
```

For local Namecheap usage you can also source the existing machine-local credentials file:

```bash
set -a
source /home/llm/.config/namecheap/api.env
set +a
export NAMECHEAP_DOMAIN=mmix.dev
export CLOUDFLARE_PAGES_DOMAINS=alvina.mmix.dev,www.alvina.mmix.dev
export NAMECHEAP_DRY_RUN=true
npm run namecheap:dns:sync
```

## DNS provider modes

Use `DNS_PROVIDER=cloudflare` when the domain is on Cloudflare DNS and you want the workflow to create/update records there.

Use `DNS_PROVIDER=namecheap` when the registrar stays on Namecheap BasicDNS/FreeDNS/PremiumDNS:

- the script works against the root zone from `NAMECHEAP_DOMAIN`, for example `mmix.dev`
- apex records inside the requested host set are managed as `ALIAS -> <project>.pages.dev`
- subdomains like `alvina` or `www.alvina` are managed as `CNAME -> <project>.pages.dev`
- existing mail and verification records (`MX`, `TXT`, `CAA`, `SRV`, `NS`) are preserved
- the workflow does **not** switch nameservers, because that is intentionally out of scope
- on GitHub-hosted runners, keep `NAMECHEAP_DNS_SYNC_ENABLED=false`; run `npm run namecheap:dns:sync` from the allowlisted local machine instead

## Reusing For New Landings

To enable the same flow for the next landing:

1. Copy the workflow and both deploy scripts into the new repo.
2. Set `CLOUDFLARE_PAGES_PROJECT`, `CLOUDFLARE_PAGES_DOMAINS`, `VITE_SITE_URL`, and `DNS_PROVIDER`.
3. If DNS stays on Namecheap, also set `NAMECHEAP_DOMAIN` and the four Namecheap secrets.
4. Push to `main` and the repo will provision/update the Pages project, deploy the site, attach domains, and sync DNS.
