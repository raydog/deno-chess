import { coordFromAN } from "../../src/core/datatypes/Coord.ts";
import { assert } from "../../src/core/logic/assert.ts";
import { path, readLines } from "../../testDeps.ts";

// The AI opening book is just a basic trie. We're only interested in moves that more than 5 turns in them (10 ply) and
// we'll fill in an array. We don't need to know the names of things. We also don't need to know frequency of play
// (although we might at some point...) For now, just knowing that there is SOME ECO that follows along this path is
// probably good enough...

type Entry = [ move: string, next: Entry[] ];

const [dataPath, outPath] = Deno.args;
assert(dataPath, "Need data path");
assert(outPath, "Need output path");

const root: Entry[] = [];

for await (const entry of Deno.readDir(dataPath)) {
  if (!entry.isFile || !entry.name.endsWith(".tsv")) {
    continue;
  }

  const fPath = path.join(dataPath, entry.name);
  console.log("Loading entries from: %s...", fPath);

  let num = 0;
  for await (const line of readLines(await Deno.open(fPath))) {
    const parsed = line.split("\t");
    if (!parsed.length) continue;
    if (parsed.length !== 4) {
      console.error(" -> Skipping line:", line);
      continue;
    }
    const [eco, , , moves] = parsed;
    if (eco === "eco") {
      // Skip header
      continue;
    }

    integrateEntry(moves);
    num++;
  }

  console.log(" -> Loaded %d rows", num);
}

root.forEach(pruneTerminals);

await Deno.writeTextFile(outPath, `
// This file auto-generated by 'scripts/etl/loadOpeningBook.ts' using the data/eco tables

type Entry = [move: string] | [move: string, next: Entry[]];

export default (
  ${ JSON.stringify(root).replace(/.{100}.*?[\[\],]/g, "$&\n  ") }
) as Entry[];

`);

function integrateEntry(rawMoves: string) {

  const moves = rawMoves.trim().split(" ").slice(0, 10);

  // Not interested in lines under 5 full moves:
  if (moves.length < 10) { return; }

  let node = root;
  for (const move of moves) {
    assert(/^([a-h][1-8]){2}$/.test(move), "Invalid move: " + move);
    
    // const move = _encodeMove(moveStr);
    const idx = node.findIndex(([cur]) => cur === move);

    if (idx >= 0) {
      node = node[idx][1];
    } else {
      const len = node.push([move, []]);
      node = node[len-1][1];
    }
  }
}

// Mutatively remove empty next arrays:
function pruneTerminals(node: Entry) {
  if (node[1].length === 0) {
    node.pop();
    return;
  }
  for (const next of node[1]) {
    pruneTerminals(next);
  }
}

// To reduce ""s, moves are encoded as numbers:
function _encodeMove(move: string) {
  const from = coordFromAN(move.slice(0,2)), dest = coordFromAN(move.slice(2));
  return (from << 8) | dest;
}
