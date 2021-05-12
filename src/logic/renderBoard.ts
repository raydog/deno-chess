import { Board } from "../datatypes/Board.ts";
import { ChessError } from "../datatypes/ChessError.ts";
import { Color } from "../datatypes/Color.ts";
import { Piece } from "../datatypes/Pieces.ts";

const SGR = "\x1b["

export function renderBoardForConsole(board: Board): string {
  let out = "";

  out += SGR + "0m";
  // out += "+-" + "-".repeat(16) + "-+\n";

  for (let rank=7; rank >= 0; rank--) {
    // let row = "| ";
    let row = SGR + "2m" + rank + " ";
    
    let tileIsWhite = rank % 2 == 0;

    for (let file=0; file<8; file++) {
      const piece = board.get([file, rank]);
      const center = (piece == null)
        ? " "
        : "" + _renderPieceUnicode(piece);
      const color = SGR + (tileIsWhite ? "44" : "47") + ";2;30m";
      row += color + " " + center + SGR + "0m";

      tileIsWhite = !tileIsWhite;
    }
    // out += row + " |\n";
    out += row + "\n";
  }

  out += SGR + "2m" + "   a b c d e f g h\n";
  
  // out += "+-" + "-".repeat(16) + "-+";

  // Reset SGR:
  out += SGR + "0m";
  return out;
}

function _renderPieceUnicode(piece: Piece): string {
  return (piece.color === Color.White)
  ? _whitePieceUnicode(piece)
  : _blackPieceUnicode(piece);
}

function _whitePieceUnicode(piece: Piece): string {
  switch (piece.symbol) {
    case "P": return "♙";
    case "R": return "♖";
    case "N": return "♘";
    case "B": return "♗";
    case "Q": return "♕";
    case "K": return "♔";
    default: throw new ChessError("Invalid piece: " + piece.symbol);
  }
}

function _blackPieceUnicode(piece: Piece): string {
  switch (piece.symbol) {
    case "P": return "♟";
    case "R": return "♜";
    case "N": return "♞";
    case "B": return "♝";
    case "Q": return "♛";
    case "K": return "♚";
    default: throw new ChessError("Invalid piece: " + piece.symbol);
  }
}
