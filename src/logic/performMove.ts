import { Board } from "../datatypes/Board.ts";
import { Move } from "../datatypes/Move.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import {
  SPACE_EMPTY,
  spaceEnPassant,
  spaceGetColor,
  spaceGetType,
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
  b.setEnPassant(0);

  // This piece just moved:
  let space = spaceMarkMoved(move.what);

  // Mark as being vulnerable to En Passant if requested:
  if (move.markEnPassant) {
    b.setEnPassant(move.markEnPassant);
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

  // If this move is black's, then the turn number just increased:
  if (spaceGetColor(space)) {
    b.incrMoveNum();
  }

  // If a capture or pawn move, reset the clock. Else increment.
  if (spaceGetType(space) === PieceType.Pawn || move.capture) {
    b.resetClock();
  } else {
    b.incrClock();
  }
}
