import { ChessBadInput } from "../../datatypes/ChessError.ts";

const TAG_KEY_RE = /^[A-Z][a-zA-Z0-9_]*$/;
const TAG_VAL_RE = /^[\u0020-\u007e]*$/;

export function validatePGNKeyValue(key: string, val: string) {
  if (!TAG_KEY_RE.test(key)) {
    throw new ChessBadInput("Invalid PGN tag name: " + key);
  }
  if (!TAG_VAL_RE.test(val)) {
    throw new ChessBadInput("Invalid characters in PGN tag value");
  }
}
