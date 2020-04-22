import Phaser from 'phaser';
import logoImg from "../assets/logo.png";
import Scene from './Scene';

class Game extends Scene {
  /**
   * Preload state
   */
  preload() {
    this.load.image("logo", logoImg);
  }

  /**
   * Creates the scene
   */
  create() {
    const { config } = this.game;
    const x = config.width / 2;
    const y = config.height / 2;
    const logo = this.add.image(x, y, "logo");
    logo.setOrigin(0.5);
  } 
}

export default Game;
