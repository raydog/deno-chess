.PHONY: fmt test

fmt:
	deno fmt --ignore='data/eco,scripts/build'

test: 
	deno test .
