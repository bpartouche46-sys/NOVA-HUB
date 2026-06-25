#!/usr/bin/env bash
# Regénère sites/_shared/tailwind.css à partir des classes réellement utilisées.
# À relancer si on ajoute des classes Tailwind dans navlys/ ou brunopartouche/.
set -e
cd "$(dirname "$0")/.."
npx --yes tailwindcss@3.4.17 -c build/tailwind.config.js -i build/input.css -o sites/_shared/tailwind.css --minify
echo "OK -> sites/_shared/tailwind.css"
