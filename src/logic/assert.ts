import { ChessError } from "../datatypes/ChessError.ts";

/**
 * I want asserts, but not enough to bring in an external dependency.
 * 
 * @param x 
 * @param msg 
 */
export function assert(expr: unknown, msg: string): void {
  if (!expr) {
    throw new ChessError(msg);
  }
}
