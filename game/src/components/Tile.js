import Phaser from 'phaser';

/**
 * Size of a single tile in pixels
 *
 * @type {number}
 */
export const TILE_SIZE = 100;

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

class Tile extends Phaser.GameObjects.Container {
  /**
   * Creates the custom container class
   *
   * @param {object} config
   */
  constructor(config) {
    const { scene, x, y, id } = config;
    super(scene, x, y);
    this.scene.add.existing(this);

    this.createSprite();
    this.createText();
    this.initHelpers(config);
  }

  /**
   * Initializes the local helper variables
   */
  initHelpers({ id, position }) {
    this.setId(id);
    this.pos = position;
  }

  createSprite() {
    // creation of a new sprite with "tile" instance, that is "tile.png" we loaded before
    this.sprite = this.scene.add.sprite(0, 0, 'tile');
    this.sprite.setOrigin(0);
    this.add(this.sprite);
  }

  createText() {
    // creation of a text which will represent the value of the tile
    this.text = this.scene.add.text(TILE_SIZE / 2, TILE_SIZE / 2, '2', { font: 'bold 16px Arial', color: '#000', align: 'center' });
    this.text.setOrigin(0.5);
    this.add(this.text);
  }

  setId(id) {
    this.id = id;
    this.sprite.tint = TINT_COLORS[id];
    this.text.text = id;
  }

  getText() {
    return this.text;
  }
}

export default Tile;
