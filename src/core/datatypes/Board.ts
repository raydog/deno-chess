import { Space, SPACE_EMPTY, spaceGetColor, spaceGetType } from "./Space.ts";
import { assert } from "../logic/assert.ts";
import { Coord } from "./Coord.ts";
import { GameStatus, GAMESTATUS_ACTIVE } from "./GameStatus.ts";
import { CastleMap } from "./CastleMap.ts";
import { Color, COLOR_BLACK, COLOR_WHITE } from "./Color.ts";
import { attackMapAddPiece, attackMapRemovePiece } from "../logic/attackMap.ts";
import { Move } from "./Move.ts";

// Uses the 0x88 strategy:
const BOARD_SIZE = 8 * 8 * 2;

type Layer = {
  board: Uint8Array;
  attacks: Uint8Array;
  clock: number;
  moveNum: number;
  ep: Coord;
  status: GameStatus;
  turn: Color;
  seen: { [hash: string]: number };
  castles: CastleMap;
  moveCache: { [colors in Color]: Move[] | null };
};

/**
 * Internal representation of a Board. Basically a bunch of integers, with a few extra bells-n-whistles.
 * This will be translated into a more public-friendly representation in the future.
 */
export class Board {
  #layerIdx = 0;
  #layers: Layer[] = [newLayer()];

  // Current kept public, since everything else will be mutating these values.
  // Yeah, it's ugly. But it *IS* somewhat quicker...
  current: Layer = this.#layers[0];

  // Throw all local data away. Useful when re-using Boards
  reset() {
    this.#layerIdx = 0;
    const current = this.current = this.#layers[0];
    current.board.fill(SPACE_EMPTY);
    current.attacks.fill(0);
    current.clock = 0;
    current.moveNum = 0;
    current.ep = 0x88;
    current.status = GAMESTATUS_ACTIVE;
    current.turn = COLOR_WHITE;
    current.seen = {};
    current.castles = 0;
    current.moveCache[COLOR_WHITE] = null;
    current.moveCache[COLOR_BLACK] = null;
  }

  /**
   * Set a single space in the board. Updates the attack map as well.
   *
   * @param idx
   * @param space
   */
  set(idx: Coord, space: Space) {
    assert((idx & 0x88) === 0, "Invalid set() coord");

    const prior = this.current.board[idx];
    if (prior !== SPACE_EMPTY) {
      const color = spaceGetColor(prior);
      const type = spaceGetType(prior);
      attackMapRemovePiece(this, idx, color, type);
    }

    this.current.board[idx] = space;

    if (space !== SPACE_EMPTY) {
      const color = spaceGetColor(space);
      const type = spaceGetType(space);
      attackMapAddPiece(this, idx, color, type);
    }
  }

  /**
   * Get the value of a single space in the board.
   *
   * @param idx
   * @returns
   */
  get(idx: Coord): Space {
    assert((idx & 0x88) === 0, "Invalid get() coord");
    return this.current.board[idx];
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
    for (let idx = this.#layerIdx; idx >= 0; idx--) {
      if (hash in this.#layers[idx].seen) {
        // Oh! this one! Add 1, copy forward, and return.
        const num = 1 + this.#layers[idx].seen[hash];
        this.current.seen[hash] = num;
        return num;
      }
    }

    // Else, not found:
    this.current.seen[hash] = 1;
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
    this.current = this.#layers[idx];
    copyLayer(this.#layers[idx - 1], this.current);
  }

  /**
   * Remove the top-most overlay. This has the effect of reverting all changes since that overlay was pushed.
   */
  restore() {
    if (this.#layerIdx > 0) {
      const idx = --this.#layerIdx;
      this.current = this.#layers[idx];
    }
  }
}

function newLayer(): Layer {
  return {
    board: new Uint8Array(BOARD_SIZE).fill(SPACE_EMPTY),
    attacks: new Uint8Array(BOARD_SIZE * 2).fill(0),
    clock: 0,
    moveNum: 1,
    ep: 0x88,
    status: GAMESTATUS_ACTIVE,
    turn: COLOR_WHITE,
    seen: {},
    castles: 0,
    moveCache: {
      [COLOR_WHITE]: null,
      [COLOR_BLACK]: null,
    },
  };
}

function copyLayer(src: Layer, dest: Layer) {
  dest.board.set(src.board);
  dest.attacks.set(src.attacks);
  dest.clock = src.clock;
  dest.moveNum = src.moveNum;
  dest.ep = src.ep;
  dest.status = src.status;
  dest.turn = src.turn;
  dest.seen = {}; // Just create new object instead of copying massive objects.
  dest.castles = src.castles;
  dest.moveCache[COLOR_WHITE] = src.moveCache[COLOR_WHITE];
  dest.moveCache[COLOR_BLACK] = src.moveCache[COLOR_BLACK];
}
