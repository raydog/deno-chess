import { Space } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";

type StringFormat =
  | "FEN";

/**
 * Internal representation of a Board. Basically 64 integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {

  #spaces: Space[] = Array(8 * 8).fill(0);

  set(idx: Coord, space: Space) {
    assert(idx >= 0 && idx < 64, "Invalid set() coord");
    this.#spaces[idx] = space;
  }

  get(idx: Coord): Space {
    assert(idx >= 0 && idx < 64, "Invalid get() coord");
    return this.#spaces[idx];
  }

  // toString(): string {

  // }
}
