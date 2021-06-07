# Deno-Chess

Deno-Chess is a fairly quick pure-Typescript chess engine. It is packaged for
Deno, as well as for the browser. Features include:

- Move generation / validation, piece logic, check / checkmate detection, draw
  detection, etc. All the standard Chess-engine stuff.
- Can both read and write
  [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) strings.
- Fast! the game core is built on top of typed arrays, and a whole bunch of
  bit-math. In the end, it's roughly 10x faster than Chess.js.

## Example

TODO: Docs

## Contributing

I'd love to see contributions! Make sure that any PRs pass tests, and don't
regress performance. The dev environment requires both node.js and Deno be
available.

**Running tests:**

```bash
make test                         # << To run the full suite
deno test test/<filename>.test.ts # << To run a specific file
```

**Running the Dev Server:** (To test the bundled package in a browser)

```bash
make devserver
```

**Running the code formatter:**

```bash
make fmt
```

**Rebuild the dist package:**

```bash
make build
```

## License

MIT
