.PHONY: fmt test

BuildOpts = --bundle --minify --target=es2015 --global-name=DenoChess

fmt:
	deno fmt --ignore='data/eco,scripts/build,dist'

test: 
	deno test test

build:
	cd scripts/build && \
	yarn && \
	node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --outfile=../../dist/denochess.min.js

devserver:
	cd scripts/build && \
		yarn && \
		node_modules/.bin/esbuild $(BuildOpts) ../../mod.ts --servedir=www --outdir=www/js
