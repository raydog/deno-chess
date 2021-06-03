import { Board } from "../datatypes/Board.ts";
import { Color, COLOR_WHITE } from "../datatypes/Color.ts";
import { buildCoord, Coord } from "../datatypes/Coord.ts";
import {
  Space,
  spaceGetColor,
  spaceGetFENString,
  spaceIsEmpty,
} from "../datatypes/Space.ts";

const BAR = "   +------------------------+  \n";
const FILES = "     a  b  c  d  e  f  g  h    ";

type StyleObj = {
  dim(val: string): string;
  black(val: string): string;
  darkBg(val: string): string;
  lightBg(val: string): string;
};

const STYLE_COLOR: StyleObj = {
  dim: (val: string) => `\x1b[2m${val}\x1b[22m`,
  black: (val: string) => `\x1b[30;2m${val}\x1b[39;22m`,
  darkBg: (val: string) => `\x1b[44m${val}\x1b[49m`,
  lightBg: (val: string) => `\x1b[46m${val}\x1b[49m`,
};

const STYLE_NO_COLOR: StyleObj = {
  dim: (val: string) => val,
  black: (val: string) => val,
  darkBg: (val: string) => val,
  lightBg: (val: string) => val,
};

/**
 * Render as ASCII. Will include ANSI colors, if asked.
 *
 * Inspired by (but slightly different from) the ASCII view from Chess.js.
 *
 * @param b
 */
export function boardRenderASCII(b: Board, color: boolean): string {
  const style = color ? STYLE_COLOR : STYLE_NO_COLOR;
  let out = style.dim(FILES) + "\n" + BAR;

  for (let rank = 7; rank >= 0; rank--) {
    let row = ` ${style.dim(String(rank + 1))} |`;
    for (let file = 0; file < 8; file++) {
      const idx = buildCoord(file, rank);
      const sp = b.get(idx);
      row += _formatSpace(style, idx, sp);
    }
    out += row + `| ${style.dim(String(rank + 1))}\n`;
  }
  return out + BAR + style.dim(FILES);
}

function _formatSpace(style: StyleObj, idx: Coord, sp: Space): string {
  let str: string;

  if (spaceIsEmpty(sp)) {
    str = style.dim("   ");
  } else {
    const fen = " " + spaceGetFENString(sp) + " ";
    str = (spaceGetColor(sp) === COLOR_WHITE) ? fen : style.black(fen);
  }

  // MaGiC!
  return ((((idx >>> 4) ^ idx) & 1) === 0)
    ? style.darkBg(str)
    : style.lightBg(str);
}
