import { Board } from "../../datatypes/Board.ts";
import { buildCastleMap, CastleMap, } from "../../datatypes/CastleMap.ts";
import { ChessParseError } from "../../datatypes/ChessError.ts";
import { Color } from "../../datatypes/Color.ts";
import { coordFromAN, } from "../../datatypes/Coord.ts";
import { PieceType } from "../../datatypes/PieceType.ts";
import {
encodePieceSpace,
Space,
} from "../../datatypes/Space.ts";
import { boardRenderASCII } from "../boardRenderASCII.ts";

const DIGIT_RE = /[1-8]/;
const WHITE_PIECE_RE = /[PBNRQK]/;
const BLACK_PIECE_RE = /[pbnrqk]/;

/**
 * Builds a new Board from a FEN string.
 *
 * @param board
 */
export function boardFromFEN(fen: string): Board {
  const out = new Board();

  fen = fen.trim();

  const fields = fen.split(/\s+/g);
  if (fields.length !== 6) {
    throw new ChessParseError("Bad FEN string: Wrong number of sections");
  }

  // Field 1: Board layout
  const ranks = fields[0].split("/");
  if (ranks.length !== 8) {
    throw new ChessParseError("Bad FEN string: Board data should have 8 ranks");
  }

  for (let rank = 7; rank >= 0; rank--) {
    let dataIdx = 0;
    const data = ranks[7-rank];
    for (let file=0; file<8; file++) {
      const idx = (rank << 4) | file;
      if (dataIdx >= data.length) {
        throw new ChessParseError(`Bad FEN string: Rank ${rank+1} had less than 8 files`);
      }
      const ch = data[dataIdx++];
      if (DIGIT_RE.test(ch)) {
        file += parseInt(ch, 10) - 1;

      } else if (WHITE_PIECE_RE.test(ch)) {
        const type = _getPieceType(ch);
        out.set(idx, _spaceBuilder(Color.White, type, rank));

      } else if (BLACK_PIECE_RE.test(ch)) {
        const type = _getPieceType(ch);
        out.set(idx, _spaceBuilder(Color.Black, type, rank));
      }
    }
    if (dataIdx < data.length) {
      throw new ChessParseError(`Bad FEN string: Rank ${rank+1} had more than 8 files`);
    }
  }

  // Field 2: Turn
  out.setTurn(_parseTurn(fields[1]));

  // Field 3: Castle availability
  out.setCastles(_parseCastles(fields[2]));

  // Field 4: En Passant target
  if (fields[3] !== "-") {
    out.setEnPassant(coordFromAN(fields[3]));
  }

  // Field 5: Half-move clock
  out.setClock(_parseIntField(fields[4]));

  // Field 6: Full-move number
  out.setMoveNum(_parseIntField(fields[5]));

  // console.log();
  // console.log(boardRenderASCII(out, true));

  return out;
}

function _getPieceType(fen: string): PieceType {
  switch (fen.toLowerCase()) {
    case "p": return PieceType.Pawn;
    case "b": return PieceType.Bishop;
    case "n": return PieceType.Knight;
    case "r": return PieceType.Rook;
    case "q": return PieceType.Queen;
    case "k": return PieceType.King;
  }
  throw new ChessParseError("Bad FEN string: Unknown piece: " + fen);
}

function _parseTurn(fen: string): Color {
  switch (fen) {
    case "w": return Color.White;
    case "b": return Color.Black;
  }
  throw new ChessParseError("Bad FEN string: Invalid turn: " + fen);
}

// Assumes that rooks are on the standard starting files, but that's just how it is with FEN:
function _parseCastles(fen: string): CastleMap {
  if (fen.length > 4) {
    throw new ChessParseError("Bad FEN string: Castle eligibility list is too long");
  }
  let wQueen = 0x88, wKing = 0x88, bQueen = 0x88, bKing = 0x88;
  if (fen !== "-") {
    for (let i=0; i<fen.length; i++) {
      switch (fen[i]) {
        case "K": wKing = 0x07; break;
        case "Q": wQueen = 0x00; break;
        case "k": bKing = 0x77; break;
        case "q": bQueen = 0x70; break;
        default:
          throw new ChessParseError("Bad FEN string: Unknown character in castle eligibility list: " + fen[i]);
      }
    }
  }
  return buildCastleMap(wQueen, wKing, bQueen, bKing);
}

function _spaceBuilder(color: Color, type: PieceType, rank: number): Space {
  // HasMoved needs to be accurate for pawns, since it governs their ability to double-open:
  if (type === PieceType.Pawn) {
    const onStart = (rank === 1 && color === Color.White) || (rank === 6 && color === Color.Black);
    return encodePieceSpace(type, color, !onStart);
  }
  // Else, we don't REALLY care, so they haven't moved. Why not?
  return encodePieceSpace(type, color, false);
}

function _parseIntField(fen: string): number {
  const out = parseInt(fen, 10);
  if (isNaN(out)) {
    throw new ChessParseError("Bad FEN string: Bad number: " + fen);
  }
  return out;
}
