import { Board } from "../datatypes/Board.ts";
import { Color } from "../datatypes/Color.ts";
import { Space, spaceGetColor, spaceHasMoved, spaceIsEmpty, spaceIsColor, spaceGetType } from "../datatypes/Space.ts";
import { assert } from "./assert.ts";
import { PieceType } from "../datatypes/PieceType.ts";
import { buildCoord, parseCoord } from "../datatypes/Coord.ts";

type Step = [ x: number, y: number ];

// Pre-compiled lists of moves, since most moves are similar:
const BISHOP_DIRS: Step[] = [ [1, 1], [1, -1], [-1, 1], [-1, -1] ];
const ROOK_DIRS: Step[] = [ [1, 0], [-1, 0], [0, 1], [0, -1] ];
const QUEEN_DIRS: Step[] = [ ...ROOK_DIRS, ...BISHOP_DIRS ];
const KING_DIRS: Step[] = [ ...QUEEN_DIRS ];
const KNIGHT_DIRS: Step[] = [ [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2] ];


/**
 * Will enumerate all moves for the piece on the given space on the given board. Space **must** contain a piece.
 * 
 * Will check the board to see if castles or en passant are possible. Will also respect checks, so pieces can be pinned,
 * or moves will be restricted if king is currently in check.
 */
export function listValidMoves(b: Board, idx: number): number[] {
  const sp = b.get(idx);
  assert(!spaceIsEmpty(sp), "Listing moves of empty space");

  switch (spaceGetType(sp)) {
    // Slidey pieces:
    case PieceType.Bishop: return _findMoves(b, sp, idx, BISHOP_DIRS, 8);
    case PieceType.Rook: return _findMoves(b, sp, idx, ROOK_DIRS, 8);
    case PieceType.Queen: return _findMoves(b, sp, idx, QUEEN_DIRS, 8);

    // Steppy pieces:
    case PieceType.Knight: return _findMoves(b, sp, idx, KNIGHT_DIRS, 1);
    case PieceType.King: return _findMoves(b, sp, idx, KING_DIRS, 1);

    // Other:
    case PieceType.Pawn: return _pawnMoves(b, sp, idx);
  }
}

// Util to extract find legit moves:
function _findMoves(b: Board, sp: Space, idx: number, dirs: Step[], maxDist: number): number[] {
  const out: number[] = [];

  const [file, rank] = parseCoord(idx);
  const color = spaceGetColor(sp);

  for (const [dx, dy] of dirs) {
    for (let dist=1; dist<=maxDist; dist++) {
      // Offset the correct amount, and reject early if out of bounds:
      const x = file + dx * dist, y = rank + dy * dist;
      if (x < 0 || x >= 8 || y < 0 || y >= 8) { break; }
      
      // Reconvert to index, both for both board access and for possible output:
      const newIdx = buildCoord(x, y);
      const newSp = b.get(newIdx);

      // Same color piece as the one we're moving. Halt here:
      if (spaceIsColor(newSp, color)) { break; }

      // Either empty OR an enemy piece. Either way, ok:
      out.push(newIdx);

      // ... but if actually an enemy, stop:
      if (spaceIsColor(newSp, 1-color)) { break; }
    }
  }

  return out;
}

// Pawns are odd, so handle them separately:
function _pawnMoves(b: Board, sp: Space, idx: number): number[] {
  const ourColor = spaceGetColor(sp);
  const otherColor = 1 - ourColor;

  const dir = ourColor === Color.White ? 1 : -1;
  const out: number[] = [];

  const [file, rank] = parseCoord(idx);

  // Note: While reaching our boundary would mean promotion, and so pawns don't normally need bound-checking on the
  // ranks, we do so anyways because enh.
  if (rank >= 7 || rank <= 0) { return out; }
  
  const oneUp = idx + dir * 8;
  const twoUp = idx + dir * 16;

  // Try to move one up:
  if (oneUp >= 0 && oneUp < 64) {
    if (spaceIsEmpty(b.get(oneUp))) { out.push(oneUp); }
  }

  // If we haven't moved before, we can attempt 2 up:
  if (twoUp >= 0 && twoUp < 64) {
    if (!spaceHasMoved(sp) && spaceIsEmpty(b.get(oneUp)) && spaceIsEmpty(b.get(twoUp))) { out.push(twoUp); }
  }

  // Captures to the left and right:
  if (file > 0) {
    const coord = buildCoord(file-1, rank + dir);
    if (spaceIsColor(b.get(coord), otherColor)) { out.push(coord); }
  }

  if (file < 7) {
    const coord = buildCoord(file+1, rank + dir);
    if (spaceIsColor(b.get(coord), otherColor)) { out.push(coord); }
  }

  // TODO: Check for en passant:

  return out;
}
