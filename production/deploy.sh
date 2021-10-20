#!/bin/sh

node scripts/init-db.mjs
node ace mongodb:migration:run
concurrently -n server,sync,import "node server.js" "node ace file:sync" "node ace file:sync"
