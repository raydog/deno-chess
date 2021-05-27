import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import {
  Space,
  SPACE_EMPTY,
  spaceEnPassant,
  spaceGetColor,
  spaceGetType,
  spaceHasData,
  spaceHasMoved,
  spaceIsEmpty,
} from "../datatypes/Space.ts";
import { assert } from "./assert.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import { buildCoord, Coord, parseCoord, validCoord } from "../datatypes/Coord.ts";
import {
  createCastle,
  createFullMove,
  createSimpleCapture,
  createSimpleMove,
  Move,
} from "../datatypes/Move.ts";
import { performMove } from "./performMove.ts";
import { kingInDanger } from "./kingInDanger.ts";


// Pre-compiled lists of moves, since most moves are similar:
const DIRS = {
  [PieceType.Bishop]: [11, 9, -11, -9],
  [PieceType.Rook]: [10, -10, 1, -1],
  [PieceType.Queen]: [9, 10, 11, -1, 1, -9, -10, -11],
  [PieceType.King]: [9, 10, 11, -1, 1, -9, -10, -11],
  [PieceType.Knight]: [21, 19, -21, -19, 12, -12, 8, -8],
}

const PAWN_CAPTURES = [11, 9];


/**
 * Will extract all valid moves for the given player.
 *
 * @param b The current board state.
 * @param color The color of the current player.
 * @param fullMoves True if we want to scan for check etc as a result of this move.
 */
export function listAllValidMoves(
  b: Board,
  color: Color,
  fullMoves = false,
): Move[] {
  const out: Move[] = [];
  for (let rank=0; rank<80; rank+=10) {
    for (let file=0; file<8; file++) {
      const idx = rank + file;
      const sp = b.get(idx);
      if (spaceHasData(sp) && !spaceIsEmpty(sp) && spaceGetColor(sp) === color) {
        out.push(...listValidMoves(b, idx, fullMoves));
      }
    }
  }
  return out;
}

/**
 * Will enumerate all moves for the piece on the given space on the given board. Space **must** contain a piece.
 *
 * Will check the board to see if castles or en passant are possible. Will also respect checks, so pieces can be pinned,
 * or moves will be restricted if king is currently in check.
 */
export function listValidMoves(
  b: Board,
  idx: Coord,
  fullMoves = false,
): Move[] {
  const sp = b.get(idx);

  assert(spaceHasData(sp), "Listing moves of null space");
  assert(!spaceIsEmpty(sp), "Listing moves of empty space");

  const type = spaceGetType(sp);
  switch (type) {
    // Slidey pieces:

    case PieceType.Bishop:
    case PieceType.Rook:
    case PieceType.Queen:
      return _findMoves(b, sp, idx, DIRS[type], 8, fullMoves);

    // Steppy pieces:

    case PieceType.Knight:
    case PieceType.King:
      return _findMoves(b, sp, idx, DIRS[type], 1, fullMoves);

    // Other:

    case PieceType.Pawn:
      return _pawnMoves(b, sp, idx, fullMoves);
  }
}

// Util to extract find legit moves:
function _findMoves(
  b: Board,
  sp: Space,
  idx: number,
  dirs: number[],
  maxDist: number,
  fullMoves: boolean,
): Move[] {
  
  const out: Move[] = [];
  const color = spaceGetColor(sp);

  for (const offset of dirs) {
    for (let dist = 1; dist <= maxDist; dist++) {
      // Offset the correct amount, and reject early if out of bounds:
      const newIdx = idx + offset * dist;
      if (!validCoord(newIdx)) { break; }

      const newSp = b.get(newIdx);

      const spotEmpty = spaceIsEmpty(newSp);
      const spotColor = spaceGetColor(newSp);

      // If empty, we could either stop here or continue:
      if (spotEmpty) {
        _tryPushMove(b, out, createSimpleMove(sp, idx, newIdx), fullMoves);
        continue;
      }

      // If an enemy, then we can capture. But no matter what, we can't keep going in this direction:
      if (spotColor === 1 - color) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, newIdx, newSp, newIdx),
          fullMoves,
        );
      }

      break;
    }
  }

  // Special-case, if King, and king hasn't moved yet, check the same rank for Rooks that haven't moved, and then maybe
  // try castling:
  if (spaceGetType(sp) === PieceType.King && !spaceHasMoved(sp)) {
    // Possible castle situation! Find the rooks:
    
    const [, rank] = parseCoord(idx);

    for (let newFile = 0; newFile < 8; newFile++) {
      const newIdx = buildCoord(newFile, rank);
      const newSpot = b.get(newIdx);
      if (
        spaceGetType(newSpot) === PieceType.Rook &&
        spaceGetColor(newSpot) === color && !spaceHasMoved(newSpot)
      ) {
        // Candidate castle! Build the final positions for validation:
        const queenSide = newIdx < idx;
        const kingDest = queenSide ? buildCoord(2, rank) : buildCoord(6, rank);
        const rookDest = queenSide ? buildCoord(3, rank) : buildCoord(5, rank);
        _tryCastle(
          b,
          out,
          createCastle(sp, idx, kingDest, newSpot, newIdx, rookDest),
          fullMoves,
        );
      }
    }
  }

  return out;
}

// Pawns are odd, so handle them separately:
function _pawnMoves(
  b: Board,
  sp: Space,
  idx: number,
  fullMoves: boolean,
): Move[] {
  const ourColor = spaceGetColor(sp);
  const otherColor = 1 - ourColor;

  const dir = ourColor === Color.White ? 1 : -1;
  const out: Move[] = [];

  const oneUp = idx + dir * 10;
  const twoUp = idx + dir * 20;

  // Try to move one up:
  if (validCoord(oneUp)) {
    if (spaceIsEmpty(b.get(oneUp))) {
      _tryPushMove(b, out, createSimpleMove(sp, idx, oneUp), fullMoves);
    }

    // If we haven't moved before, we also try 2 up:
    if (!spaceHasMoved(sp) && spaceIsEmpty(b.get(twoUp)) && validCoord(twoUp)) {
      _tryPushMove(
        b,
        out,
        createFullMove(sp, idx, twoUp, 0, 0, 0, 0, 0, 0, true),
        fullMoves,
      );
    }
  }

  // Captures to the left and right. This includes en passants:
  for (let offset = 9; offset <= 11; offset += 2) {
    const coord = idx + dir * offset;
    if (!validCoord(coord)) {
      continue;
    }

    const spot = b.get(coord);
    if (spaceIsEmpty(spot)) {
      const adjCoord = coord - 10 * dir;
      const adjSpot = b.get(adjCoord);
      if (
        !spaceIsEmpty(adjSpot) && spaceEnPassant(adjSpot) &&
        spaceGetColor(adjSpot) === otherColor
      ) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, adjSpot, adjCoord),
          fullMoves,
        );
      }
    } else {
      if (spaceGetColor(spot) === otherColor) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, coord, spot, coord),
          fullMoves,
        );
      }
    }
  }

  return out;
}

// Will push the candidate move to the output array IF it doesn't expose your king to check. Also will populate
// a few extra details if asked. (Since we've already done the move...)
function _tryPushMove(b: Board, out: Move[], move: Move, fullMoves: boolean) {
  const color = spaceGetColor(move.what);

  b.save();

  performMove(b, move);
  if (!kingInDanger(b, color)) {
    // This is a valid move, so spend the time to see if this move delivers check:
    if (fullMoves) {
      const enemy: Color = 1 - color;
      move.check = kingInDanger(b, enemy);
      // TODO: Fork this into a version that DOESN'T allocate an array of objects, and instead short-circuits a bool:
      move.enemyHasMove = listAllValidMoves(b, enemy, false).length > 0;
    }
    out.push(move);
  }

  b.restore();
}

// Will attempt a castle maneuver. Will do the normal checks: Nothing in the way, and nothing checking king en route:
function _tryCastle(b: Board, out: Move[], move: Move, fullMoves: boolean) {
  const color = spaceGetColor(move.what);

  // Every spot in the rook's travel must be empty, apart from the King (which can happen in Chess960)
  const rookMin = Math.min(move.castleRookFrom, move.castleRookDest);
  const rookMax = Math.max(move.castleRookFrom, move.castleRookDest);
  for (let idx = rookMin; idx <= rookMax; idx++) {
    if (idx === move.from || idx === move.castleRookFrom) {
      continue;
    }
    const sp = b.get(idx);
    if (!spaceIsEmpty(sp)) {
      return;
    }
  }

  // No spot in the King's travel can be under attack.
  b.save();

  // Blank both the rook and king:
  b.set(move.from, SPACE_EMPTY);
  b.set(move.castleRookFrom, SPACE_EMPTY);

  // Note: kingInDanger actually supports duplicate kings, so create Kings wherever we want to check:
  const kingLow = Math.min(move.from, move.dest);
  const kingHigh = Math.max(move.from, move.dest);
  for (let idx = kingLow; idx <= kingHigh; idx++) {
    b.set(idx, move.what);
  }

  const hasDanger = kingInDanger(b, color);
  b.restore();

  if (hasDanger) return;

  _tryPushMove(b, out, move, fullMoves);
}
