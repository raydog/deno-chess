import { Board } from "../../core/datatypes/Board.ts";
import { buildStandardBoard } from "../../core/logic/boardLayouts/buildStandardBoard.ts";
import { listAllValidMoves } from "../../core/logic/listValidMoves.ts";
import { coordFromAN } from "../../core/datatypes/Coord.ts";
import { performMove } from "../../core/logic/performMove.ts";
import { hashBoard } from "../../core/logic/hashBoard.ts";
import RawPlaybook from "../../../data/processed/aiOpenings.ts";

export type OpeningBook = {
  [hash: string]: string[];
};

export function compileOpeningBook(): OpeningBook {
  const book: OpeningBook = {};
  const board: Board = buildStandardBoard();

  const start = performance.now();

  book[hashBoard(board)] = RawPlaybook.map((entry) => entry[0]);

  for (const step of RawPlaybook) {
    board.save();
    _handleNode(book, board, step);
    board.restore();
  }

  console.log("Compiled in", performance.now() - start, "ms");

  return book;
}

function _handleNode(
  book: OpeningBook,
  board: Board,
  [move, next]: typeof RawPlaybook[0],
) {
  // We don't need to create an entry for this node, since it has no "next" list:
  if (!next || !next.length) return;

  // Else, do the move. Board was already saved externally:
  const moves = listAllValidMoves(board, board.current.turn);
  const from = coordFromAN(move.slice(0, 2)), dest = coordFromAN(move.slice(2));
  const moveObj = moves.find((m) => m.from === from && m.dest === dest);
  if (!moveObj) throw new Error("Entry book had invalid move!");
  performMove(board, moveObj);

  const hash = hashBoard(board);
  const nextMoves = next.map(([m]) => m);
  if (book[hash]) {
    // Merge the next steps in with the existing next steps. This *can* result in duplicate move entries, but it'll
    // double up moves that are more common, effectively giving weight to more common openings, so bug: meet feature.
    book[hash].push(...nextMoves);
  } else {
    book[hash] = nextMoves;
  }

  for (const step of next) {
    board.save();
    _handleNode(book, board, step);
    board.restore();
  }
}
