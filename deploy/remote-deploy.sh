#!/bin/sh
# Runs ON THE SERVER (piped over SSH by .gitlab-ci.yml).
# First deploy: creates DEPLOY_PATH and fetches the code. Later deploys: updates it.
# Then rebuilds the `bryan-portfolio` service from the shared compose file.
#
# The code is fetched with the short-lived CI job token, so the server needs no
# deploy key, and the token is never stored in the checkout's git config.
set -eu

: "${DEPLOY_PATH:?}" "${COMPOSE_FILE:?}" "${REPO_URL:?}" "${BRANCH:?}" "${COMMIT_SHA:?}"
SERVICE=bryan-portfolio

log() { printf '\n==> %s\n' "$*"; }

# ── 1. Code: create the folder on first deploy, then sync to the pushed commit ──
if [ ! -d "$DEPLOY_PATH/.git" ]; then
  log "First deploy: creating $DEPLOY_PATH"
  mkdir -p "$DEPLOY_PATH"
  git -C "$DEPLOY_PATH" init -q
  git -C "$DEPLOY_PATH" config advice.detachedHead false
fi

log "Fetching $BRANCH"
git -C "$DEPLOY_PATH" fetch -q --depth 1 "$REPO_URL" "$BRANCH"
git -C "$DEPLOY_PATH" reset -q --hard FETCH_HEAD
git -C "$DEPLOY_PATH" clean -qfd
DEPLOYED_SHA=$(git -C "$DEPLOY_PATH" rev-parse HEAD)
echo "Checked out $DEPLOYED_SHA"
if [ "$DEPLOYED_SHA" != "$COMMIT_SHA" ]; then
  echo "Note: $BRANCH moved on since this pipeline started (expected $COMMIT_SHA). A newer pipeline will deploy it."
fi

# ── 2. Build and (re)start from the shared compose file ──
if ! docker compose -f "$COMPOSE_FILE" config --services 2>/dev/null | grep -qx "$SERVICE"; then
  echo "ERROR: service '$SERVICE' is not defined in $COMPOSE_FILE."
  echo "Add the block from deploy/compose-service.yml (see deploy/README.md), then re-run the pipeline."
  exit 1
fi
log "Building and starting $SERVICE"
docker compose -f "$COMPOSE_FILE" up -d --build "$SERVICE"

# ── 3. Verify it answers before declaring success ──
log "Waiting for the site to respond"
i=0
until docker exec "$SERVICE" wget -q -O /dev/null http://127.0.0.1/robots.txt 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "Site did not become ready in time. Recent logs:"
    docker logs --tail 80 "$SERVICE" || true
    exit 1
  fi
  sleep 2
done
echo "$SERVICE is up ($DEPLOYED_SHA)"

docker image prune -f >/dev/null 2>&1 || true
