import { Board } from "../datatypes/Board.ts";
import { Move } from "../datatypes/Move.ts";
import {
  SPACE_EMPTY,
  spaceEnPassant,
  spaceMarkMoved,
  spacePromote,
  spaceSetEnPassant,
} from "../datatypes/Space.ts";

/**
 * Will apply a Move object to a board. Assumes that the Move is valid.
 *
 * @param b
 */
export function performMove(
  b: Board,
  move: Move,
) {
  // Clear all En Passant-marked pawns from this board:
  for (let rank=0; rank<80; rank+=10) {
    for (let file=0; file<8; file++) {
      const idx = rank + file;
      const sp = b.get(idx);
      if (spaceEnPassant(sp)) {
        b.set(idx, spaceSetEnPassant(sp, false));
      }
    }
  }

  // This piece just moved:
  let space = spaceMarkMoved(move.what);

  // Mark as being vulnerable to En Passant if requested:
  if (move.canEnPassant) {
    space = spaceSetEnPassant(space, true);
  }

  // If this pawn promoted, update the type before copying into the board:
  if (move.promote) {
    space = spacePromote(space, move.promote);
  }

  // Basic move:
  b.set(move.dest, space);
  b.set(move.from, SPACE_EMPTY);

  // If capture differs from the move, blank it too:
  if (move.capture && move.captureCoord !== move.dest) {
    b.set(move.captureCoord, SPACE_EMPTY);
  }

  // If castle, we also have a rook to move:
  if (move.castleRook) {
    b.set(move.castleRookDest, spaceMarkMoved(move.castleRook));
    b.set(move.castleRookFrom, SPACE_EMPTY);
  }
}
