import { Space, SPACE_EMPTY } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";
import { GameStatus } from "./GameStatus.ts";
import { CastleMap } from "./CastleMap.ts";
import { Color } from "./Color.ts";

// Uses the 0x88 strategy:
const BOARD_SIZE = 8 * 8 * 2;

type Layer = {
  board: Uint8Array;
  clock: number;
  moveNum: number;
  ep: Coord;
  status: GameStatus;
  turn: Color;
  seen: { [hash: string]: number };
  castles: CastleMap;
};

/**
 * Internal representation of a Board. Basically a bunch of integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {
  #layerIdx = 0;
  #layers: Layer[] = [newLayer()];
  #current: Layer = this.#layers[0];

  /**
   * Set a single space in the board.
   *
   * @param idx
   * @param space
   */
  set(idx: Coord, space: Space) {
    assert((idx & 0x88) === 0, "Invalid set() coord");
    this.#current.board[idx] = space;
  }

  /**
   * Get the value of a single space in the board.
   *
   * @param idx
   * @returns
   */
  get(idx: Coord): Space {
    assert((idx & 0x88) === 0, "Invalid get() coord");
    return this.#current.board[idx];
  }

  /**
   * Increments the half-move clock.
   */
  incrClock() {
    this.#current.clock++;
  }

  /**
   * Reset the half-move clock.
   */
  resetClock() {
    this.#current.clock = 0;
  }

  /**
   * Increment the current move number.
   */
  incrMoveNum() {
    this.#current.moveNum++;
  }

  /**
   * Return the half-move clock.
   *
   * @returns
   */
  getClock(): number {
    return this.#current.clock;
  }

  /**
   * Return the current move number.
   *
   * @returns
   */
  getMoveNum(): number {
    return this.#current.moveNum;
  }

  /**
   * Get the current En Passant square. -1 if none.
   * @returns
   */
  getEnPassant(): Coord {
    return this.#current.ep;
  }

  /**
   * Set the current En Passant square.
   * @param idx
   */
  setEnPassant(idx: Coord) {
    return this.#current.ep = idx;
  }

  /**
   * Get the game status.
   * @returns
   */
   getStatus(): GameStatus {
    return this.#current.status;
  }

  /**
   * Update the game status.
   */
  setStatus(s: GameStatus) {
    this.#current.status = s;
  }

  /**
   * Get the turn.
   * @returns
   */
   getTurn(): Color {
    return this.#current.turn;
  }

  /**
   * Update the turn.
   */
  setTurn(t: Color) {
    this.#current.turn = t;
  }

   /**
    * Get the castle status.
    * @returns
    */
  getCastles(): CastleMap {
    return this.#current.castles;
  }

  /**
   * Update the castle status.
   */
  setCastles(s: CastleMap) {
    this.#current.castles = s;
  }

  /**
   * Will push a board hash into our history objects. Returns the number of times we've seen this exact configuration
   * before.
   * 
   * @param hash 
   */
  putBoardHash(hash: string): number {
    // When getting the prior number, run backwards through history until we find this hash. We don't duplicate the hash
    // histories the same way as other Layer data, because duplicating those objects is slow, and we need to change
    // layers frequently. (Far more frequently than they're used...)
    for (let idx=this.#layerIdx; idx >= 0; idx--) {
      if (hash in this.#layers[idx].seen) {
        // Oh! this one! Add 1, copy forward, and return.
        const num = 1 + this.#layers[idx].seen[hash];
        this.#current.seen[hash] = num;
        return num;
      }
    }

    // Else, not found:
    this.#current.seen[hash] = 1;
    return 1;
  }

  /**
   * Add a new overlay. This overlay will absorb set()'s, and get()'s take them into account. This allows us to easily
   * undo actions.
   */
  save() {
    const idx = ++this.#layerIdx;
    if (idx === this.#layers.length) {
      this.#layers.push(newLayer());
    }
    this.#current = this.#layers[idx];
    copyLayer(this.#layers[idx - 1], this.#current);
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  restore() {
    if (this.#layerIdx > 0) {
      const idx = --this.#layerIdx;
      this.#current = this.#layers[idx];
    }
  }
}

function newLayer(): Layer {
  return {
    board: new Uint8Array(BOARD_SIZE).fill(SPACE_EMPTY),
    clock: 0,
    moveNum: 1,
    ep: -1,
    status: GameStatus.Active,
    turn: Color.White,
    seen: {},
    castles: 0,
  };
}

function copyLayer(src: Layer, dest: Layer) {
  dest.board.set(src.board);
  dest.clock = src.clock;
  dest.moveNum = src.moveNum;
  dest.ep = src.ep;
  dest.status = src.status;
  dest.turn = src.turn;
  dest.seen = {}; // Just create new object instead of copying massive objects.
  dest.castles = src.castles;
}
