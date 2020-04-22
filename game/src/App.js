import Phaser from 'phaser';
import Game from './scenes/Game';

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

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
        width: width || DEFAULT_CANVAS_WIDTH,
        height: height || DEFAULT_CANVAS_HEIGHT,
      },      
      renderer: Phaser.AUTO,
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
