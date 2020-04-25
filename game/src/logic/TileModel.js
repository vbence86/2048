import Phaser from 'phaser';

/**
 * @type {object}
 */
const Type = {
  Empty: 'empty',
  Brick: 'brick',
  Number: 'number',
  Bomb: 'bomb',
};

/**
 * @type {object}
 */
const DataSource = {
  [Type.Empty]: {
    id: Type.Empty,
    value: 0,
  },
  [Type.Brick]: {
    id: Type.Brick,
    value: 0,
    static: true,
  },
  [Type.Number]: {
    id: Type.Number,
    value: 2,
  },
  [Type.Bomb]: {
    id: Type.Bomb,
    value: 0,
  }
}

/**
 * Returns true if the given models are typeA and typeB
 * regardless of the order
 *
 * @returns {boolean}
 */
const combinationOf = (modelA, modelB, typeA, typeB) => {
  if (modelA.getId() === typeA && modelB.getId() === typeB) return true;
  if (modelA.getId() === typeB && modelB.getId() === typeA) return true;
  return false;
}

/**
 * Returns a new model object by the given id
 *
 * @param {string} id
 * @returns {object}
 */
const create = id => new TileModel(id);

/**
 * Returns a new model object that represents an empty tile
 *
 * @returns {object}
 */
const createEmpty = () => create(Type.Empty);

class TileModel {
  /**
   * Creates the model represenation of a tile
   *
   * @param {object} config
   */
  constructor(id) {
    this.data = { ...DataSource[id] };
  }

  /**
   * Merges the model from the given model
   *
   * @param {number} id
   */
  mergeFrom(id) {
    if (this.getId() === Type.Bomb && id === Type.Brick) {
      this.data = { ...DataSource[Type.Empty] };
      return;
    }

    this.data.value *= 2;
  }

  /**
   * Returns the id of the tile
   *
   * @returns {string}
   */
  getId() {
    return this.data.id;
  }

  /**
   * Returns the value of the tile
   *
   * @returns {number}
   */
  getValue() {
    return this.data.value;
  }

  /**
   * Returns true if the tile can be merged with the given target tile
   *
   * @returns {boolean}
   */
  canMergeWith(tileModel) {
    // Bomb can merge with Brick
    if (combinationOf(this, tileModel, Type.Brick, Type.Bomb)) return true;

    // Bombs cannot merge with one another
    if (combinationOf(this, tileModel, Type.Bomb, Type.Bomb)) return false;

    // only the same kind can merge
    if (tileModel.getId() !== this.getId()) return false;
    if (tileModel.getValue() !== this.getValue()) return false;
    return true;
  }

  /**
   * Returns true if the tile cannot be moved
   *
   * @returns {boolean}
   */
   isStatic() {
    return !!this.data.static;
   }

  /**
   * Returns true if the tile represents an empty element
   *
   * @returns {boolean}
   */
   isEmpty() {
    return this.data.id === Type.Empty;
   }   
}

TileModel.Type = Type;
TileModel.create = create;
TileModel.createEmpty = createEmpty;

export default TileModel;
