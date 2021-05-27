import { Space, SPACE_EMPTY, } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord, validCoord } from "./Coord.ts";
import { Color } from "./Color.ts";
import { Turn } from "./Turn.ts";


const BOARD_SIZE = 10 * 8;


/**
 * Internal representation of a Board. Maintains the board in layers, so the board's current state can be snapshotted,
 * and later reverted to, easing some of the move validation work.
 * 
 * The underlying format is a cell-centric 10 x 8 Uint8Array. The left 8 x 8 cells are the real data-bearing cells, and
 * the right 2 x 8 are leftover cells made to make out-of-bounds detection easier.
 * 
 * Valid coordinates are always base-10 integers, with the tens place being the rank (0-indexed), and the ones place
 * being the file (also 0-indexed.) If any coord is < 0, >= 80, or the ones place is an 8 or 9, the coord is out of
 * bounds.
 */
export class Board {

  #layerIdx = 0;
  #layers: Uint8Array[] = [new Uint8Array(BOARD_SIZE).fill(SPACE_EMPTY)];

  /**
   * Set a coordinate
   * @param idx 
   * @param space 
   */
  set(idx: Coord, space: Space) {
    assert(validCoord(idx), "Invalid set() coord");
    this.#layers[this.#layerIdx][idx] = space;
  }

  get(idx: Coord): Space {
    assert(validCoord(idx), "Invalid get() coord");
    return this.#layers[this.#layerIdx][idx];
  }

  /**
   * Add a new overlay. This overlay will absorb set()'s, and get()'s take them into account. This allows us to easily
   * undo actions.
   */
  save() {
    this.#layerIdx++;
    if (this.#layerIdx === this.#layers.length) {
      this.#layers.push(new Uint8Array(BOARD_SIZE));
    }
    this.#layers[this.#layerIdx].set(this.#layers[this.#layerIdx - 1]);
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  restore() {
    if (this.#layerIdx > 0) {
      this.#layerIdx--;
    }
  }
}
