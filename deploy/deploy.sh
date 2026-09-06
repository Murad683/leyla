#!/bin/bash
# Run by GitHub Actions over SSH as user `leyla` on Hetzner server 1.
# Pulls main, rebuilds the stack, syncs the DB schema, health-checks.
set -euo pipefail

cd /opt/leyla

echo "== git =="
git fetch --prune origin
git reset --hard origin/main

Cj="docker compose -f deploy/compose.yml"

echo "== build & up =="
$Cj up -d --build

echo "== wait for api =="
for i in $(seq 1 30); do
  if curl -sf -m 5 http://127.0.0.1:4100/api/health >/dev/null; then break; fi
  sleep 2
done

echo "== db schema sync (prisma db push) =="
$Cj exec -T leyla-api sh -c 'npx prisma db push --schema=/app/prisma/schema.prisma --url "$DATABASE_URL"'

echo "== health =="
curl -sf -m 10 http://127.0.0.1:4100/api/health && echo " <- OK"

echo "== prune old images =="
docker image prune -f >/dev/null || true

echo "== deploy done =="
