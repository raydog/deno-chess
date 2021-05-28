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
import { buildCoord, Coord, parseCoord } from "../datatypes/Coord.ts";
import {
  createCastle,
  createFullMove,
  createSimpleCapture,
  createSimpleMove,
  Move,
} from "../datatypes/Move.ts";
import { performMove } from "./performMove.ts";
import { kingInDanger } from "./kingInDanger.ts";

type Step = [x: number, y: number];

// Pre-compiled lists of moves, since most moves are similar:
const BISHOP_DIRS: Step[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_DIRS: Step[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const QUEEN_DIRS: Step[] = [...ROOK_DIRS, ...BISHOP_DIRS];
const KING_DIRS: Step[] = [...QUEEN_DIRS];
const KNIGHT_DIRS: Step[] = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2],
];
const PAWN_CAPS = [-1, 1];

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
): Move[] {
  const out: Move[] = [];
  for (let idx = 0; idx < 64; idx++) {
    const sp = b.get(idx);
    if (spaceHasData(sp) && !spaceIsEmpty(sp) && spaceGetColor(sp) === color) {
      out.push(...listValidMoves(b, idx));
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
): Move[] {
  const sp = b.get(idx);

  assert(spaceHasData(sp), "Listing moves of null space");
  assert(!spaceIsEmpty(sp), "Listing moves of empty space");

  switch (spaceGetType(sp)) {
    // Slidey pieces:

    case PieceType.Bishop:
      return _findMoves(b, sp, idx, BISHOP_DIRS, 8);
    case PieceType.Rook:
      return _findMoves(b, sp, idx, ROOK_DIRS, 8);
    case PieceType.Queen:
      return _findMoves(b, sp, idx, QUEEN_DIRS, 8);

    // Steppy pieces:

    case PieceType.Knight:
      return _findMoves(b, sp, idx, KNIGHT_DIRS, 1);
    case PieceType.King:
      return _findMoves(b, sp, idx, KING_DIRS, 1);

    // Other:

    case PieceType.Pawn:
      return _pawnMoves(b, sp, idx);
  }
}

// Util to extract find legit moves:
function _findMoves(
  b: Board,
  sp: Space,
  idx: number,
  dirs: Step[],
  maxDist: number,
): Move[] {
  const out: Move[] = [];

  const [file, rank] = parseCoord(idx);
  const color = spaceGetColor(sp);

  for (const [dx, dy] of dirs) {
    for (let dist = 1; dist <= maxDist; dist++) {
      // Offset the correct amount, and reject early if out of bounds:
      const x = file + dx * dist, y = rank + dy * dist;
      if (x < 0 || x >= 8 || y < 0 || y >= 8) break;

      // Reconvert to index, both for both board access and for possible output:
      const newIdx = buildCoord(x, y);
      const newSp = b.get(newIdx);

      const spotEmpty = spaceIsEmpty(newSp);
      const spotColor = spaceGetColor(newSp);

      // If empty, we could either stop here or continue:
      if (spotEmpty) {
        _tryPushMove(b, out, createSimpleMove(sp, idx, newIdx));
        continue;
      }

      // If an enemy, then we can capture. But no matter what, we can't keep going in this direction:
      if (spotColor === 1 - color) {
        _tryPushMove(
          b,
          out,
          createSimpleCapture(sp, idx, newIdx, newSp, newIdx),
        );
      }

      break;
    }
  }

  // Special-case, if King, and king hasn't moved yet, check the same rank for Rooks that haven't moved, and then maybe
  // try castling:
  if (spaceGetType(sp) === PieceType.King && !spaceHasMoved(sp)) {
    // Possible castle situation! Find the rooks:
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
): Move[] {
  const color = spaceGetColor(sp);
  const enemy = 1 - color;

  const dir = color === Color.White ? 1 : -1;
  const out: Move[] = [];

  const [file, rank] = parseCoord(idx);

  // Note: While reaching our boundary would mean promotion, and so pawns don't normally need bound-checking on the
  // ranks, we do so anyways because enh.
  if (rank >= 7 || rank <= 0) return out;

  const oneUp = idx + dir * 8;
  const twoUp = idx + dir * 16;

  // Try to move one up:
  if (oneUp >= 0 && oneUp < 64) {
    if (spaceIsEmpty(b.get(oneUp))) {
      _tryPushMove(b, out, createSimpleMove(sp, idx, oneUp));

      // If we haven't moved before, we can attempt 2 up:
      if (
        !spaceHasMoved(sp) && twoUp >= 0 && twoUp < 64 &&
        spaceIsEmpty(b.get(twoUp))
      ) {
        _tryPushMove(
          b,
          out,
          createFullMove(sp, idx, twoUp, 0, 0, 0, 0, 0, 0, oneUp),
        );
      }
    }
  }

  // Captures to the left and right. This includes en passants:
  const ep = b.getEnPassant();

  for (const fileStep of PAWN_CAPS) {
    const newFile = file + fileStep;
    if (newFile < 0 || newFile >= 8)continue;

    const coord = buildCoord(newFile, rank + dir);
    const spot = b.get(coord);
    if (coord === ep) {
      const epCoord = buildCoord(newFile, rank);
      const epSpot = b.get(epCoord);
      _tryPushMove(
        b,
        out,
        createSimpleCapture(sp, idx, coord, epSpot, epCoord),
      );
    } else if (!spaceIsEmpty(spot) && spaceGetColor(spot) === enemy) {
      _tryPushMove(
        b,
        out,
        createSimpleCapture(sp, idx, coord, spot, coord),
      );
    }
  }

  return out;
}

// Will push the candidate move to the output array IF it doesn't expose your king to check. Also will populate
// a few extra details if asked. (Since we've already done the move...)
function _tryPushMove(b: Board, out: Move[], move: Move) {
  const color = spaceGetColor(move.what);

  b.save();

  performMove(b, move);
  if (!kingInDanger(b, color)) {
    out.push(move);
  }

  b.restore();
}

// Will attempt a castle maneuver. Will do the normal checks: Nothing in the way, and nothing checking king en route:
function _tryCastle(b: Board, out: Move[], move: Move) {
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

  _tryPushMove(b, out, move);
}
