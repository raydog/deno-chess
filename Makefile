.PHONY: fmt test

fmt:
	deno fmt --ignore='data/eco,scripts/build'

test: 
	deno test .

devserver:
	cd scripts/build && \
		yarn && \
		node_modules/.bin/esbuild ../../mod.ts --bundle --minify --target=es2015 --global-name=DenoChess --servedir=www --outdir=www/js
