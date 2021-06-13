import { Board } from "../datatypes/Board.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "../datatypes/Color.ts";
import { Coord } from "../datatypes/Coord.ts";
import {
  PieceType,
  PIECETYPE_BISHOP,
  PIECETYPE_KING,
  PIECETYPE_KNIGHT,
  PIECETYPE_PAWN,
  PIECETYPE_QUEEN,
  PIECETYPE_ROOK,
} from "../datatypes/PieceType.ts";
import { SPACE_EMPTY } from "../datatypes/Space.ts";

// Color is packed into the upper bit of the 0x88 coord's rank. Slide vs steps is packed into the upper bit of the 0x88
// coord's file. This is to simplify the bit math for generating lookup indexes, while still allowing for 0x88 out-of-
// bounds validation.
const ATTACK_STEPS = 0b0000;
const ATTACK_SLIDE = 0b1000;

// Directions are defined like:
// N E S W, NE SE SW NW
// This is so we don't have to have different tables for rooks and bishops etc, just different ranges.
const DIRS = [16, 1, -16, -1, 17, -15, -17, 15];
const KNIGHT = [31, 33, 14, 18, -18, -14, -33, -31];
const PAWN: { [color in Color]: number[] } = {
  [COLOR_WHITE]: [15, 17], 
  [COLOR_BLACK]: [-15, -17]
};

export function attackMapIsAttacked(b: Board, idx: Coord, byColor: Color) {
  const attacks = b.current.attacks;
  const bColor = byColor << 4;
  return Boolean(
    attacks[idx | bColor | ATTACK_SLIDE] ||
      attacks[idx | bColor | ATTACK_STEPS],
  );
}

export function attackMapRemovePiece(
  b: Board,
  idx: Coord,
  color: Color,
  type: PieceType,
) {
  const bufAttack = b.current.attacks;
  const bufBoard = b.current.board;

  // Remove our contribution to the board:
  switch (type) {
    case PIECETYPE_PAWN:
      for (const offset of PAWN[color]) {
        tryUpdateStep(bufAttack, idx + offset, color, -1);
      }
      break;

    case PIECETYPE_KNIGHT:
      for (const offset of KNIGHT) {
        tryUpdateStep(bufAttack, idx + offset, color, -1);
      }
      break;

    case PIECETYPE_KING:
      for (const offset of DIRS) {
        tryUpdateStep(bufAttack, idx + offset, color, -1);
      }
      break;

    case PIECETYPE_BISHOP:
      for (let dir = 4; dir < 8; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 0);
      }
      break;

    case PIECETYPE_ROOK:
      for (let dir = 0; dir < 4; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 0);
      }
      break;

    case PIECETYPE_QUEEN:
      for (let dir = 0; dir < 8; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 0);
      }
      break;
  }

  // For every ray stored under this now-empty square, continue them:
  recastUnderlyingRays(b, idx, 1);
}

export function attackMapAddPiece(
  b: Board,
  idx: Coord,
  color: Color,
  type: PieceType,
) {
  const bufAttack = b.current.attacks;
  const bufBoard = b.current.board;

  // This space is now an obstacle, so recast rays to remove their contribution:
  recastUnderlyingRays(b, idx, 0);

  // Add our contribution to the board:
  switch (type) {
    case PIECETYPE_PAWN:
      for (const offset of PAWN[color]) {
        tryUpdateStep(bufAttack, idx + offset, color, 1);
      }
      break;

    case PIECETYPE_KNIGHT:
      for (const offset of KNIGHT) {
        tryUpdateStep(bufAttack, idx + offset, color, 1);
      }
      break;

    case PIECETYPE_KING:
      for (const offset of DIRS) {
        tryUpdateStep(bufAttack, idx + offset, color, 1);
      }
      break;

    case PIECETYPE_BISHOP:
      for (let dir = 4; dir < 8; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 1);
      }
      break;

    case PIECETYPE_ROOK:
      for (let dir = 0; dir < 4; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 1);
      }
      break;

    case PIECETYPE_QUEEN:
      for (let dir = 0; dir < 8; dir++) {
        castRay(bufAttack, bufBoard, idx, color, dir, 1);
      }
      break;
  }
}

// Returns a slightly digested attack map, for easier debugging + test cases:
export function attackMapDebug(b: Board): string {
  const attacks = b.current.attacks;
  let out = "";

  for (let rank = 0x70; rank >= 0; rank -= 0x10) {
    for (let file = 0; file < 8; file++) {
      const idx = rank | file;

      let white = attacks[idx | (COLOR_WHITE << 4) | ATTACK_STEPS];
      let black = attacks[idx | (COLOR_BLACK << 4) | ATTACK_STEPS];

      const wSlide = attacks[idx | (COLOR_WHITE << 4) | ATTACK_SLIDE];
      for (let dir = 0; dir < 8; dir++) {
        if (wSlide & (1 << dir)) {
          white++;
        }
      }

      const bSlide = attacks[idx | (COLOR_BLACK << 4) | ATTACK_SLIDE];
      for (let dir = 0; dir < 8; dir++) {
        if (bSlide & (1 << dir)) {
          black++;
        }
      }

      if (file) {
        out += " ";
      }

      if (b.get(idx) === SPACE_EMPTY) {
        out += ` ${white},${black} `;
      } else {
        out += `[${white},${black}]`;
      }
    }
    if (rank) {
      out += "\n";
    }
  }
  return out;
}

// Will recast rays stored under a given piece. Used to handle blocking pieces being added / removed:
function recastUnderlyingRays(b: Board, idx: Coord, bit: 0 | 1) {
  const bufAttack = b.current.attacks;
  const bufBoard = b.current.board;

  for (let color = 0; color <= 8; color+=8) {
    const bColor = color << 4;
    const here = bufAttack[idx | bColor | ATTACK_SLIDE];
    for (let dir = 0; dir < 8; dir++) {
      if (here & (1 << dir)) {
        castRay(bufAttack, bufBoard, idx, color, dir, bit);
      }
    }
  }
}

// Will cast a ray in a direction until another piece or the board's edge. Will **NOT** include start.
function castRay(
  bufAttack: Uint8Array,
  bufBoard: Uint8Array,
  idx: Coord,
  color: Color,
  dir: number,
  bit: 0 | 1,
) {
  const step = DIRS[dir];

  while (((idx += step) & 0x88) === 0) {
    // Note: While we don't want to set bits out-of-bounds, we *DO* want to clear the bits on the first obstacle:
    setSlide(bufAttack, idx, color, dir, bit);

    // If there's a piece here, stop.
    // HACK: This directly references the board's buffer. This is mainly for perf, both so we can avoid doing a get
    // call, and also to avoid the board -> current -> board prop lookups.
    if (bufBoard[idx] !== SPACE_EMPTY) {
      break;
    }
  }
}

// Utils to set values in the bitmaps:

function tryUpdateStep(
  bufAttack: Uint8Array,
  idx: Coord,
  color: Color,
  delta: number,
) {
  if (idx & 0x88) return;
  const bColor = color << 4;
  bufAttack[idx | bColor | ATTACK_STEPS] += delta;
}

function setSlide(
  bufAttack: Uint8Array,
  idx: Coord,
  color: Color,
  dir: number,
  bit: 0 | 1,
) {
  const bColor = color << 4;
  if (bit) {
    bufAttack[idx | bColor | ATTACK_SLIDE] |= 1 << dir;
  } else {
    bufAttack[idx | bColor | ATTACK_SLIDE] &= ~(1 << dir);
  }
}
