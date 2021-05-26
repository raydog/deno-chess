import { Board } from "../datatypes/Board.ts";
import { Move, moveGetCastle, moveGetDest, moveGetEPCapture, moveGetFrom, moveGetMarkEnPassant, moveGetPromotion } from "../datatypes/Move.ts";
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
  for (let i = 0; i < 64; i++) {
    const sp = b.get(i);
    if (spaceEnPassant(sp)) {
      b.set(i, spaceSetEnPassant(sp, false));
    }
  }

  // This piece just moved:
  const from = moveGetFrom(move);
  const dest = moveGetDest(move);
  let space = spaceMarkMoved(b.get(from));

  // Mark as being vulnerable to En Passant if requested:
  if (moveGetMarkEnPassant(move)) {
    space = spaceSetEnPassant(space, true);
  }

  // If this pawn promoted, update the type before copying into the board:
  const promote = moveGetPromotion(move);
  if (promote) {
    space = spacePromote(space, promote);
  }

  // Basic move:
  b.set(dest, space);
  b.set(from, SPACE_EMPTY);

  

  // If capture differs from the move, blank it too:
  if (moveGetEPCapture(move)) {
    // TODO: Clear the EP spot...
    // b.set(move.captureCoord, SPACE_EMPTY);
  }

  // If castle, we also have a rook to move:
  const castle = moveGetCastle(move);
  if (castle) {
    // 1 king, 2 queen
    // b.set(move.castleRookDest, spaceMarkMoved(move.castleRook));
    // b.set(move.castleRookFrom, SPACE_EMPTY);
  }
}
