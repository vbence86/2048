import Phaser from 'phaser';

/**
 * @type {object}
 */
const Type = {
  Empty: 'empty',
  Brick: 'brick',
  Number: 'number',
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
   * @param {object} model
   */
  mergeFrom(model) {
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
