import Phaser from 'phaser';

const BUTTONS = {
  small: {
    text: { font: 'bold 40px Arial', color: '#000', align: 'center' },
    sprite: 'gui',
    over: {
      fill: '#ff0',
      frameName: 'Button_09.png',
    },
    out: {
      fill: '#0f0',
      frameName: 'Button_10.png',
    },
    down: {
      fill: '#0ff',
      frameName: 'Button_11.png',
    },
  },
}

class Button extends Phaser.GameObjects.Container {
  /**
   * Creates the custom container class
   *
   * @param {object} config
   */
  constructor(config) {
    const { scene, x, y, onClick, id } = config;
    super(scene, x, y);
    this.scene.add.existing(this);

    this.initHelpers(config);
    this.createBackground();
    this.createText(config);
    this.initEventListeners(onClick);
  }

  /**
   * Initializes the local helper variables
   *
   * @param {object} config
   */
  initHelpers({ id }) {
    this.id = id;
    this.config = BUTTONS[id];
  }

  /**
   * Instantiate the background sprite component
   *
   * @param {object} config - configuration object to specify the button
   */
  createBackground() {
    this.sprite = this.scene.add.sprite(0, 0, this.config.sprite);
    this.sprite.frameName = this.config.out.frameName;
    this.sprite.setOrigin(0.5);
    this.sprite.depth = 0;
    this.add(this.sprite);
  }

  /**
   * Creates the text element
   *
   * @param {object} config - configuration object to specify the button
   */
  createText(config) {
    const { label } = config;
    if (!label) return;
    this.text = this.scene.add.text(this.sprite.width / 2, this.sprite.height / 2, label, this.config.text);
    this.text.setOrigin(0.5);
    this.text.depth = 10;
    this.add(this.text);
  }

  /**
   * Creates the event listeners against various user interactions
   *
   * @param {function} onClick
   */
  initEventListeners(onClick) {
    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.over() )
      .on('pointerout', () => this.out() )
      .on('pointerdown', () => this.down() )
      .on('pointerup', () => {
        this.over();
        onClick();
      });
  }

  /**
   * Invoked when the pointer hovers the button
   */
  over() {
    const { fill, frameName } = this.config.over;
    this.sprite.frameName = frameName
    this.text.setStyle({ fill });
  }

  /**
   * Invoked when the pointer is removed from above the button
   */
  out() {
    const { fill, frameName } = this.config.out;
    this.sprite.frameName = frameName
    this.text.setStyle({ fill });
  }

  /**
   * Invoked when the pointer is used to activate the button
   */
  down() {
    const { fill, frameName } = this.config.down;
    this.sprite.frameName = frameName
    this.text.setStyle({ fill });
  }
}

export default Button;
