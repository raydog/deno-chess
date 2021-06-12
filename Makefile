# These 2 lines are updated by the release script:
BundleVersion = 0.2.1
BundleYear = 2021

BundleHeader = /*! Deno-Chess $(BundleVersion), (c) $(BundleYear), license: MIT */
BuildOpts = --bundle --minify --color=false --target=es2015 --global-name=DenoChess --banner:js="$(BundleHeader)"


.PHONY: fmt test build devserver

fmt:
	deno fmt --ignore='data/eco,scripts/build,dist'

test:
	deno test test

build:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --outfile=../../dist/denochess.min.js

# TODO: Emit .d.ts file as well, once Typescript's issue #38149 gets fixed...

devserver:
	cd scripts/build && \
		yarn && \
		node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --servedir=www --outdir=www/js
