# These 2 lines are updated by the release script:
BundleVersion = 0.2.1
BundleYear = 2021

BundleHeader = /*! Deno-Chess $(BundleVersion), (c) $(BundleYear), license: MIT */
BuildOpts = --bundle --minify --color=false --target=es2015 --banner:js="$(BundleHeader)" --out-extension:.js=.min.js


.PHONY: fmt test build build-core build-ai devserver

fmt:
	deno fmt --ignore='data/eco,data/processed,scripts/build,dist'

test:
	deno test test

build: build-core build-ai

build-core:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ./entrypoints/denochess.ts --global-name=DenoChess --outfile=../../dist/denochess.min.js

build-ai:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ./entrypoints/denochess.ai.ts --global-name=DenoChessAI --outfile=../../dist/denochess.ai.min.js

# TODO: Emit .d.ts file as well, once Typescript's issue #38149 gets fixed...

devserver:
	cd scripts/build && \
		yarn && \
		node_modules/.bin/esbuild $(BuildOpts) ./entrypoints/devserver.ts --global-name=Lib --servedir=www --outdir=www/js
