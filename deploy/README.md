# Deploying bryan.umbatech.com

The portfolio is live in two places, built from the same `main` branch:

| Address | Host | Pipeline |
|---|---|---|
| https://bryan.umbatech.com (canonical) | cognix server, `bryan-portfolio` container | GitLab `cognix2/myportfolio` → `.gitlab-ci.yml` |
| https://bryannahabwe.github.io | GitHub Pages, `gh-pages` branch | GitHub `bryannahabwe/bryannahabwe.github.io` → `.github/workflows/deploy.yml` |

Both builds put `https://bryan.umbatech.com` in canonical tags, the sitemap and structured
data, so search engines treat the github.io copy as a duplicate of the umbatech one.
Push `main` to both remotes to keep them in sync.

| File | Where it goes | Purpose |
|---|---|---|
| `compose-service.yml` | Paste the `bryan-portfolio:` block into `/opt/cognix/docker-compose.yml` | Builds and runs the site (nginx serving the static build) |
| `nginx/bryan.umbatech.com.conf` | Shared `nginx` container's `nginx.conf`, inside `http { … }` | HTTPS for bryan.umbatech.com, http → https |
| `container-nginx.conf` | Nothing to place: baked into the image | Serves `dist/` inside the container, with caching rules |
| `remote-deploy.sh` | Nothing to place: CI pipes it over SSH | Creates or updates `/opt/cognix/myportfolio`, rebuilds the service, health-checks it |

No `.env` lines are needed.

## One-time setup

1. **DNS (Cloudflare, umbatech.com zone):** `A  bryan → 164.68.120.35`, DNS only (grey cloud).
2. **Certificate:** nothing to do. The existing `umbatech.com` certificate includes `*.umbatech.com`.
3. **Compose:** add the service block to `/opt/cognix/docker-compose.yml`.
4. **nginx:** add the server blocks to the shared `nginx.conf`. Don't reload yet: nginx
   resolves the upstream per request, so it's safe, but the site 502s until the first deploy.
5. **GitLab:** `SERVER_IP` and `SERVER_SSH_KEY` must be available to `cognix2/myportfolio`
   (group-level variables already cover it if that's where they're set).
6. **Deploy:** push `main` to GitLab. The first pipeline clones into `/opt/cognix/myportfolio`,
   builds the image and starts the container.
7. **Reload nginx:** `docker exec nginx nginx -t && docker exec nginx nginx -s reload`
8. **Check:** `curl -I https://bryan.umbatech.com` → `200`; `http://` → `301`.
