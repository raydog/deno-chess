import { Board } from "../datatypes/Board.ts";
import { castleMapGetFile } from "../datatypes/CastleMap.ts";
import { COLOR_BLACK, COLOR_WHITE } from "../datatypes/Color.ts";
import { SPACE_EMPTY } from "../datatypes/Space.ts";

const PIECE_STRINGS = " PBNRQK  pbnrqk";

/**
 * Return a string representing a single board. Is basically a variation on FEN, and is not based on zobrist hashing,
 * unlike most other Chess engines. Mostly because this is Javascript, and we don't have any of those fancy-dancy
 * 64-bit integers, and I don't want to use BigInts.
 */
export function hashBoard(b: Board): string {
  let out = "";
  let spaces = 0;

  for (let rank = 0; rank < 0x80; rank += 0x10) {
    for (let file = 0; file < 0x8; file++) {
      const idx = rank | file;

      const sp = b.get(idx);
      if (sp === SPACE_EMPTY) {
        spaces++;
        continue;
      }
      if (spaces) {
        out += spaces;
        spaces = 0;
      }

      // Magic. Possible because type and color are stored near each other in the bitmap:
      const typeAndColor = sp & 0xf;
      out += PIECE_STRINGS[typeAndColor];
    }
  }

  if (spaces) {
    out += spaces;
  }

  // Castle eligibility:
  out += ";";
  const castles = b.current.castles;
  out += fileStr(castleMapGetFile(castles, COLOR_WHITE, true));
  out += fileStr(castleMapGetFile(castles, COLOR_WHITE, false));
  out += fileStr(castleMapGetFile(castles, COLOR_BLACK, true));
  out += fileStr(castleMapGetFile(castles, COLOR_BLACK, false));

  // EP file, if that's a thing:
  // Note: EP is 0 when null:
  out += ";" + fileStr((b.current.ep || 0x88) & 0xf);

  return out;
}

// Represent the file. Unlike FEN (well, Shrededer-FEN) we use numeric files, and - when ineligible.
function fileStr(file: number): string {
  return (file & 0x8) ? "-" : String(file);
}
