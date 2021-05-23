import { Coord } from "./Coord.ts";
import { PieceType } from "./PieceType.ts";
import { Space } from "./Space.ts";

export type Move = {
  // These exist for all move types:
  what: Space;
  from: Coord;
  dest: Coord;

  // These exist for captures. (Capture coord may differ from dest with en passant)
  capture: Space;
  captureCoord: Coord;

  // These exist for castles.
  castleRook: Space;
  castleRookFrom: Coord;
  castleRookDest: Coord;

  // This exists when a pawn promotes to something:
  promote: PieceType | 0;

  // Mark this pawn as being available for En Passants:
  canEnPassant: boolean;

  // Extended props, that are only provided IF asked for:

  // Note: We don't populate these params by default for a variety of reasons:

  // 1. They're not needed for our external API, so it's wasted CPU on that front.
  // 2. Only the AI and the move recording logic needs them.
  // 3. Generating these params requires us to enumerate the enemy moves, SO, if we didn't allow the extended prop
  //    stuff to be optional, we could end up with some costly recursion.

  // enemyHasMove being false indicates end-of-game. The check prop determines if that's checkmate or stalemate.
  check?: boolean;
  enemyHasMove?: boolean;
};

export function createSimpleMove(what: Space, from: Coord, dest: Coord): Move {
  return {
    what,
    from,
    dest,
    capture: 0,
    captureCoord: 0,
    castleRook: 0,
    castleRookFrom: 0,
    castleRookDest: 0,
    promote: 0,
    canEnPassant: false,
  };
}

export function createSimpleCapture(
  what: Space,
  from: Coord,
  dest: Coord,
  capture: Space,
  captureCoord: Coord,
): Move {
  return {
    what,
    from,
    dest,
    capture,
    captureCoord,
    castleRook: 0,
    castleRookFrom: 0,
    castleRookDest: 0,
    promote: 0,
    canEnPassant: false,
  };
}

export function createCastle(
  what: Space,
  from: Coord,
  dest: Coord,
  castleRook: Space,
  castleRookFrom: Coord,
  castleRookDest: Coord,
): Move {
  return {
    what,
    from,
    dest,
    capture: 0,
    captureCoord: 0,
    castleRook,
    castleRookFrom,
    castleRookDest,
    promote: 0,
    canEnPassant: false,
  };
}

export function createFullMove(
  what: Space,
  from: Coord,
  dest: Coord,
  capture: Space,
  captureCoord: Coord,
  castleRook: Space,
  castleRookFrom: Coord,
  castleRookDest: Coord,
  promote: PieceType,
  canEnPassant: boolean,
) {
  return {
    what,
    from,
    dest,
    capture,
    captureCoord,
    castleRook,
    castleRookFrom,
    castleRookDest,
    promote,
    canEnPassant,
  };
}
