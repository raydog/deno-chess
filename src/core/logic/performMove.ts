import { Board } from "../datatypes/Board.ts";
import {
  castleMapKingMoved,
  castleMapRookMoved,
} from "../datatypes/CastleMap.ts";
import { Move } from "../datatypes/Move.ts";
import {
  PIECETYPE_KING,
  PIECETYPE_PAWN,
  PIECETYPE_ROOK,
} from "../datatypes/PieceType.ts";
import {
  SPACE_EMPTY,
  spaceGetColor,
  spaceGetType,
  spaceHasMoved,
  spaceMarkMoved,
  spacePromote,
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
  b.current.ep = 0x88;

  // This piece just moved:
  let space = spaceMarkMoved(move.what);
  const color = spaceGetColor(space);
  const type = spaceGetType(space);

  // If this is a king, remove all castle eligibility, either because it's castling NOW, or because it's otherwise
  // moving.
  if (type === PIECETYPE_KING) {
    b.current.castles = castleMapKingMoved(b.current.castles, color);
  }

  // If this is a rook that hasn't moved before, mark it as ineligible for castles:
  if (type === PIECETYPE_ROOK && !spaceHasMoved(move.what)) {
    b.current.castles = castleMapRookMoved(b.current.castles, move.from);
  }

  // Mark as being vulnerable to En Passant if requested:
  if (move.markEnPassant) {
    b.current.ep = move.markEnPassant;
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
    b.current.moveNum++;
  }

  // If a capture or pawn move, reset the clock. Else increment.
  if (move.capture || spaceGetType(space) === PIECETYPE_PAWN) {
    b.current.clock = 0;
  } else {
    b.current.clock++;
  }

  // If a capture of a rook that hasn't moved, make sure that side can no longer castle:
  if (
    move.capture && spaceGetType(move.capture) === PIECETYPE_ROOK &&
    !spaceHasMoved(move.capture)
  ) {
    b.current.castles = castleMapRookMoved(
      b.current.castles,
      move.captureCoord,
    );
  }

  // Toggle the active player:
  b.current.turn = 1 - b.current.turn;
}
