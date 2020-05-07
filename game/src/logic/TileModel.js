import Phaser from 'phaser';

/**
 * @type {object}
 */
const Type = {
  Empty: 'empty',
  Placeholder: 'placeholder',
  Brick: 'brick',
  Number: 'number',
  Bomb: 'bomb',
  Key: 'key',
  Chest: 'chest',
  Bunny: 'bunny',
};

/**
 * @type {object}
 */
const DataSource = {
  [Type.Empty]: {
    id: Type.Empty,
    value: 0,
  },
  [Type.Placeholder]: {
    id: Type.Placeholder,
    value: 0,
  },
  [Type.Brick]: {
    id: Type.Brick,
    value: 0,
    static: true,
    sprite: 'bricks',
  },
  [Type.Number]: {
    id: Type.Number,
    value: 2,
    sprite: 'tile',
  },
  [Type.Bomb]: {
    id: Type.Bomb,
    value: 0,
    events: {
      merge: {
        sprite: 'explosion',
        animationId: 'explosion',
      }
    },
    sprite: 'bomb',
  },
  [Type.Key]: {
    id: Type.Key,
    value: 0,
    events: {
      merge: {
        sprite: 'explosion',
        animationId: 'explosion',
      }
    },
    sprite: 'key',
  },
  [Type.Chest]: {
    id: Type.Chest,
    value: 0,
    static: true,
    sprite: 'chest',
    showMergeResultInPopup: true,
  },
  [Type.Cat]: {
    id: Type.Cat,
    value: 0,
    static: true,
    sprite: 'cat',
    animations: [
      'idle',
      'merge',
    ],
    events: {
      remove: {
        sprite: 'explosion',
        animationId: 'explosion',
      }
    },
  },
}

/**
 * Returns the source of the model
 *
 * @param {string} id
 * @returns {object}
 */
const getSourceById = id => DataSource[id];

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
const create = (id, config) => new TileModel(id, config);

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
   * @param {string} id
   * @param {object} config
   */
  constructor(id, config) {
    this.data = {
      ...DataSource[id],
      ...config,
    };
  }

  /**
   * Merges the model from the given model
   *
   * @param {object} model
   */
  mergeFrom(model) {
    const id = model.getId();
    const willBeRemoved = model.willBeRemoved();

    if (willBeRemoved) return;

    if (this.getId() === Type.Bomb && id === Type.Brick) {
      this.removed = true;
      return;
    }

    if (this.getId() === Type.Key && id === Type.Chest) {
      this.data = { ...DataSource[Type.Bomb] };
      return;
    }

    if (this.getId() === Type.Number && id === Type.Cat) {
      const prevValue = model.getValue();
      const value = prevValue - 1;
      this.data = { ...DataSource[Type.Cat], value };
      this.removed = value === 0;
      return;
    }

    this.data.value *= 2;
  }

  /**
   * Links the TileView to this model
   *
   * @param {object} view - TileView
   */
  setView(view) {
    this.view = view;
  }

  /**
   * Returns true if the merge result should be highlighted in popup
   *
   * @returns {boolean}
   */
  doesShowMergeResultInPopup() {
    return !!this.data.showMergeResultInPopup;
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
   * Returns the linked View
   *
   * @returns {object} TileView
   */
  getView() {
    return this.view;
  }

  /**
   * Returns the events attached to this model
   *
   * @returns {object}
   */
  getEvents() {
    return this.data.events;
  }

  /**
   * Returns the sprite key for this model
   *
   * @returns {string}
   */
  getSpriteKey() {
    return this.data.sprite;
  }

  /**
   * Returns the collection of the animations
   *
   * @returns {array}
   */
  getAnimations() {
    return this.data.animations;
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

    // Key can merge with Chest
    if (combinationOf(this, tileModel, Type.Key, Type.Chest)) return true;

    // Cat can merge with Number
    if (combinationOf(this, tileModel, Type.Cat, Type.Number)) return true;

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

  /**
   * Returns true if the tile represents a placeholder element
   *
   * @returns {boolean}
   */
   isPlaceholder() {
    return this.data.id === Type.Placeholder;
   }

   /**
    * Returns true if the tile should be removed
    *
    * @returns {boolean}
    */
   willBeRemoved() {
    return this.removed;
   }
}

TileModel.Type = Type;
TileModel.create = create;
TileModel.createEmpty = createEmpty;
TileModel.getSourceById = getSourceById;

export default TileModel;
