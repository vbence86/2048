import Phaser from 'phaser';
import Game from './scenes/Game';
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
} from './utils/Const';

class App {
  /**
   * Creates the App based on the given configuration object
   *
   * @param {object} config
   */
  constructor(config = {}) {
    this.initPhaserGame(config);
    this.initScenes();
  }

  /**
   * Inits the Phaser.Game instance
   */
  initPhaserGame(params) {
    const { width, height, parent } = params;
    this.game = new Phaser.Game({
      scale: {
        parent,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: width || DEVICE_WIDTH,
        height: height || DEVICE_HEIGHT,
      },
      renderer: Phaser.AUTO,
      disableContextMenu: true,
      clearBeforeRender: false,
    });
  }

  /**
   * Registers the scenes
   */
  initScenes() {
    this.game.scene.add('game', Game);
  }

  /**
   * Starts the Boot Scene
   */
  start() {
    this.game.scene.start('game');
  }  
}

export default App;
