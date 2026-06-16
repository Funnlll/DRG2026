#!/bin/bash
set -e

cd "$(dirname "$0")"

export NODE_ENV=production
export PORT="${PORT:-8080}"

if [ ! -d node_modules ]; then
  npm ci
fi

if [ ! -d dist ] || [ ! -d dist-server ]; then
  npm run build
fi

npm start
