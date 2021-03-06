import Phaser from 'phaser';
import TileModel from '../logic/TileModel';

/**
 * Rainbow table of color codes for tinting the tiles
 *
 * @type {object}
 */
const TINT_COLORS = {
  2: 0xFFFFFF,
  4: 0xFFEEEE,
  8: 0xFFDDDD,
  16: 0xFFCCCC,
  32: 0xFFBBBB,
  64: 0xFFAAAA,
  128: 0xFF9999,
  256: 0xFF8888,
  512: 0xFF7777,
  1024: 0xFF6666,
  2048: 0xFF5555,
  4096: 0xFF4444,
  8192: 0xFF3333,
  16384: 0xFF2222,
  32768: 0xFF1111,
  65536: 0xFF0000, 
};

class TileView extends Phaser.GameObjects.Container {
  /**
   * Creates the custom container class
   *
   * @param {object} config
   */
  constructor(config) {
    const { scene, x, y, model } = config;
    super(scene, x, y);
    this.scene.add.existing(this);

    this.initHelpers(config);
    this.bind(model);
  }

  /**
   * Initializes the local helper variables
   *
   * @param {object} config - { position: number, tileSize: number }
   */
  initHelpers({ position, tileSize }) {
    this.pos = position;
    this.tileSize = tileSize;
  }

  /**
   * Sets the id and creates the corresponding sprite element
   *
   * @param {object} model - TileModel instance
   */
  bind(model) {
    const id = model.getId();
    const value = model.getValue();
    const sprite = model.getSpriteKey();

    this.updateSprite(sprite);
    this.updateText(value);
    this.updateEffects(id, value);

    this._id = id;
    this._value = value;
    this._model = model;
    this._model.setView(this);
  }

  /**
   * Creates the sprite based on the given id
   *
   * @param {string} sprite
   */
  updateSprite(sprite) {
    if (this.shouldUpdateSprite(sprite)) {
      if (this.sprite) {
        this.sprite.destroy();
      }
      this.sprite = this.scene.add.sprite(0, 0, sprite);
      this.sprite.setScale(this.tileSize / this.sprite.width, this.tileSize / this.sprite.height);
      this.sprite.setOrigin(0);
      this.sprite.depth = 0;
      this.add(this.sprite);
      this._sprite = sprite;

      this.animate('idle');
    }
  }

  /**
   * Creates the text element
   */
  updateText(label) {
    if (!label) return;
    if (!this.text) {
      // creation of a text which will represent the value of the tile
      this.text = this.scene.add.text(this.tileSize / 2, this.tileSize / 2, label, { font: 'bold 40px Arial', color: '#000', align: 'center' });
      this.text.setOrigin(0.5);
      this.add(this.text);
    } else {
      this.text.text = label;
    }
    this.text.depth = 10;
  }

  /**
   * Updates the effects applied against the tile
   *
   * @param {string} id
   * @param {number} value
   */
  updateEffects(id, value) {
    if (!value) return;
    this.sprite.tint = TINT_COLORS[value];
  }

  /**
   * Triggers the given animation against the sprite object
   *
   * @params {string} key
   */
  animate(key) {
    const id = `${this._sprite}-${key}`;
    if (!this.scene.anims.get(id)) return;
    if (key !== 'idle') {
      const animComplete = () => this.animate('idle');
      this.sprite.once('animationcomplete', animComplete);      
    }
    this.sprite.play(id);
  }

  /**
   * Returns true if the previous sprite must be replaced with a new one
   *
   * @returns {boolean}
   */
  shouldUpdateSprite(sprite) {
    return sprite !== this._sprite;
  }

  /**
   * Returns the bind model
   *
   * @returns {object}
   */
  getModel() {
    return this._model;
  }
}

export default TileView;
