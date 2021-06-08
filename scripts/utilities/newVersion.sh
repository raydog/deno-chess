#!/bin/bash

VERSION="$1"
TODAY="$(date '+%Y-%m-%d')"
YEAR="$(date '+%Y')"
DENO_LIB_URL="https://deno.land/x/chess@$VERSION/mod.ts"
VERSION_RE="$(echo "$VERSION" | sed 's/[.]/\\./g')"

PWD="$(dirname "$0")"
MAKEFILE_PATH="$PWD/../../Makefile"
HISTORY_PATH="$PWD/../../HISTORY.md"
README_PATH="$PWD/../../README.md"

# Must be semver-ish:
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]] ; then
    >&2 echo "Error: Not a semver: $VERSION"
    exit 1
fi

# History doc MUST have an entry for this specific version:
if ! grep -Eq "^## $VERSION_RE( .*)?\$" "$HISTORY_PATH" ; then
    >&2 echo "Error: HISTORY.md must have an entry for this version"
    exit 1
fi

echo "Releasing as: $VERSION"

# Edit the current README.md library version:
sed -Ei 's|https://deno.land/x/chess@(.*?)/mod.ts|'$DENO_LIB_URL'|' "$README_PATH"

# Edit the HISTORY.md file to include the current date for this version:
sed -Ei "s|^## $VERSION_RE( .*)?|## $VERSION ($TODAY)|" "$HISTORY_PATH"

# Update the two variables in the Makefile
sed -Ei "s|^BundleVersion .*|BundleVersion = $VERSION|" "$MAKEFILE_PATH"
sed -Ei "s|^BundleYear .*|BundleYear = $YEAR|" "$MAKEFILE_PATH"

# Make a release commit:
git commit --allow-empty -am "Release: $VERSION"

# Tag and push:
git tag -a "$VERSION" -m "Release $VERSION"
git push && git push --tags
