#!/bin/bash

PWD="$(dirname "$0")"
VERSION="$1"

if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]] ; then
    >&2 echo "Error: Not a semver: $VERSION"
    exit 1
fi

echo "Releasing as: $VERSION"

DENO_LIB_URL="https://deno.land/x/chess@$VERSION/mod.ts"

# Edit the current README.md library version:
sed -Ei 's|https://deno.land/x/chess@(.*?)/mod.ts|'$DENO_LIB_URL'|' "$PWD/../../README.md"

# Make a release commit:
git commit --allow-empty -am "Release: $VERSION"

# Tag and push:
git tag -a "$VERSION" -m "Release $VERSION"
git push && git push --tags
