import { assert } from "../../src/core/logic/assert.ts";
import { path, readLines } from "../../testDeps.ts";

type OpeningEntry = {
  eco?: string;
  name?: string;
  fen?: string; // TODO: FEN _could_ be non-nullable, if we actually evaluated these steps...
};

type OpeningTable = { $?: OpeningEntry } & {
  [rest: string]: OpeningTable;
};

const [dataPath, outPath] = Deno.args;
assert(dataPath, "Need data path");
assert(outPath, "Need output path");

const root: OpeningTable = {};

for await (const entry of Deno.readDir(dataPath)) {
  if (!entry.isFile || !entry.name.endsWith(".tsv")) {
    continue;
  }

  const fPath = path.join(dataPath, entry.name);
  // console.log("Loading entries from: %s...", fPath);

  let num = 0;
  for await (const line of readLines(await Deno.open(fPath))) {
    const parsed = line.split("\t");
    if (!parsed.length) continue;
    if (parsed.length !== 4) {
      console.error(" -> Skipping line:", line);
      continue;
    }
    const [eco, name, fen, moves] = parsed;
    if (eco === "eco") {
      // Skip header
      continue;
    }

    integrateEntry(eco, name, fen, moves);
    num++;
  }

  // console.log(" -> Loaded %d rows", num);
}

await Deno.writeTextFile(outPath, JSON.stringify(root, null, 2));

function integrateEntry(
  eco: string,
  name: string,
  _fen: string,
  moveString: string,
) {
  const moves = moveString.trim().split(" ");

  let node = root;
  for (const move of moves) {
    assert(/^([a-h][1-8]){2}$/i.test(move), "Invalid move: " + move);
    if (!node[move]) {
      node[move] = {};
    }
    node = node[move];
  }
  // At the Board location:
  assert(
    !node.$,
    `Conflict: '${name}' and '${node.$?.name}' have the same moves`,
  );

  // Note: we drop the FEN, as it bloats the file a lot, and it could be reconstructed by the opening engine
  node.$ = { eco, name /*fen*/ };
}
