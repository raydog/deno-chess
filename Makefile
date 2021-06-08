# These 2 lines are updated by the release script:
BundleVersion = 0.1.0
BundleYear = 2021

BundleHeader = /*! Deno-Chess $(BundleVersion), (c) $(BundleYear), license: MIT */
BuildOpts = --bundle --color=false --target=es2015 --global-name=DenoChess --banner:js="$(BundleHeader)"


.PHONY: fmt test build devserver

fmt:
	deno fmt --ignore='data/eco,scripts/build,dist'

test: 
	deno test test

build: build-mini build-full

build-full:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --outfile=../../dist/denochess.js

build-mini:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --minify --outfile=../../dist/denochess.min.js

devserver:
	cd scripts/build && \
		yarn && \
		node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --servedir=www --outdir=www/js
