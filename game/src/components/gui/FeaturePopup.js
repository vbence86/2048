import Phaser from 'phaser';

class FeaturePopup extends Phaser.GameObjects.Container {
  /**
   * Creates the custom container class
   *
   * @param {object} config
   */
  constructor(config) {
    const { scene } = config;
    const x = scene.sys.canvas.width / 2;
    const y = scene.sys.canvas.height / 2;
    super(scene, x, y);
    this.scene.add.existing(this);

    this.createBackground();
    this.visible = false;
    this.scaleX = 0;
    this.scaleY = 0;
  }

  /**
   * Instantiate the background sprite component
   *
   * @param {object} config - configuration object to specify the button
   */
  createBackground() {
    this.background = this.scene.add.sprite(0, 0, 'gui');
    this.background.setFrame('Windows_02.png');
    this.background.setOrigin(0.5);
    this.background.depth = 0;
    this.add(this.background);
  }

  /**
   * Creates the unlocked feature element
   *
   * @param {object} config - configuration object to specify the button
   */
  createItem(config) {
    const { sprite } = config;
    if (this.sprite) {
      this.sprite.destroy();
    }

    this.sprite = sprite;
    this.sprite.setOrigin(0.5);
    const scale = this.background.width / this.sprite.width * 0.5;
    this.sprite.scaleX = scale;
    this.sprite.scaleY = scale;
    this.add(sprite);
  }

  /**
   * Shows the popup
   */
  show(config) {
    this.visible = true;
    this.createItem(config);
    return new Promise(resolve =>
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        ease: 'Bounce',
        duration: 500,
        repeat: 0,
        yoyo: false,
        onComplete: resolve,
      })
    );
  }

  /**
   * Hides the popup
   */
  hide() {
    return new Promise(resolve =>
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 250,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          this.visible = false;
          resolve();
        },
      })
    );
  }
}

export default FeaturePopup;
