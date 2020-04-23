import Phaser from 'phaser';
import Scene from './Scene';
import Tile, { TILE_SIZE } from '../components/Tile';

// resources
import tileImg from "../assets/tile.png";

/**
 * Return the index of the row by the given index
 *
 * @param {number} n
 * @returns {number}
 */
const toRow = n => Math.floor(n / 4);

/**
 * Return the index of the column by the given index
 *
 * @param {number} n
 * @returns {number}
 */
const toCol = n => n % 4;

class Game extends Scene {
  /**
   * Preload state
   */
  preload() {
    this.load.image('tile', tileImg);
  }

  /**
   * Creates the scene
   */
  create() {
    this.fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.tileSprites = this.add.group();
    this.canMove = false;

    // listeners for WASD keys
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    upKey.on('down', this.moveUp.bind(this));
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    downKey.on('down', this.moveDown.bind(this));
    const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    leftKey.on('down', this.moveLeft.bind(this));
    const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    rightKey.on('down', this.moveRight.bind(this));
    
    // at the beginning of the game we add two "2"
    this.addTwo();
    this.addTwo();
  }

  // A NEW "2" IS ADDED TO THE GAME
  addTwo() {
    const id = 2;
    let position;
    // choosing an empty tile in the field
    do {
      position = Math.floor(Math.random() * 16);
    } while (this.fieldArray[position] != 0);

    // such empty tile now takes "2" value
    this.fieldArray[position] = id;

    // containter object
    const x = toCol(position) * TILE_SIZE; 
    const y = toRow(position) * TILE_SIZE;
    const tile = new Tile({
      scene: this, 
      x,
      y,
      id,
      position,
    });
    
    // adding container to the group
    this.tileSprites.add(tile);
    
    // creation of a new tween for the tile sprite
    const fadeIn = this.tweens.add({
      targets: [tile],
      duration: 250,
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      },
      onComplete: () => {
        // updating tile numbers. This is not necessary the 1st time, anyway
        this.updateNumbers();
        // now I can move
        this.canMove = true;
      },
    });
  }

  /**
   * Loops through all the tiles and updates them
   */
  updateNumbers() {
    // look how I loop through all tiles
    this.tileSprites.getChildren().forEach((item) => {
      // retrieving the proper value to show
      const value = this.fieldArray[item.pos];
      // showing the value
      item.setId(value);
    }); 
  }

  /**
   * Execute the move to the left
   */
  moveLeft() {
    // Is the player allowed to move?
    if (!this.canMove) return;
    // the player can move, let's set "canMove" to false to prevent moving again until the move process is done
    this.canMove = false;
    // keeping track if the player moved, i.e. if it's a legal move
    let moved = false;

    // looping through each element in the group
    this.tileSprites.getChildren().forEach((item) => {
      // getting row and column starting from a one-dimensional array
      const row = toRow(item.pos);
      const col = toCol(item.pos);
      let i;

      // checking if we aren't already on the leftmost column (the tile can't move)
      if ( col <= 0) return;
      // setting a "remove" flag to false. Sometimes you have to remove tiles, when two merge into one 
      let remove = false;
      // looping from column position back to the leftmost column
      for (i = col - 1; i >= 0; i -= 1) {
        // if we find a tile which is not empty, our search is about to end...
        if (this.fieldArray[row * 4 + i] !== 0) {
          // ...we just have to see if the tile we are landing on has the same value of the tile we are moving
          if (this.fieldArray[row * 4 + i] === this.fieldArray[row * 4 + col]) {
            // in this case the current tile will be removed
            remove = true;
            i -= 1;                                             
          }
          break;
        }
      }

      // if we can actually move...
      if (col !== i + 1) {
        // set moved to true
       moved=true;
       // moving the tile "item" from row*4+col to row*4+i+1 and (if allowed) remove it
       this.moveTile(item, row * 4 + col, row * 4 + i + 1, remove);
      }
    });
    // completing the move
    this.endMove(moved);
  }

  /** 
   * Completes the moves placement and create another "2" on the matrix
   * @param {boolean} hasMoved
   */
  endMove(hasMoved) {
    // if we move the tile...
    if (hasMoved) {
      // add another "2"
      this.addTwo();
    } else {
      // otherwise just let the player be able to move again
      this.canMove = true;
    }
  }

  /**
   * Moves a specific tile
   * @param {object} tile
   * @param {number} from
   * @param {number} to
   * @param {boolean} remove
   */
  moveTile(tile, from, to, remove) {
    // first, we update the array with new values
    this.fieldArray[to] = this.fieldArray[from];
    this.fieldArray[from] = 0;
    tile.pos = to;

    // then we create a tween
    const movement = this.tweens.add({
      targets: [tile],
      duration: 150,
      x: TILE_SIZE * (toCol(to)),
      y: TILE_SIZE * (toRow(to)),
      onComplete: () => {
        if (remove) tile.destroy();
      },
    });

    if (remove) {
      // if the tile has to be removed, it means the destination tile must be multiplied by 2
      this.fieldArray[to] *= 2;
    }
  }

    /**
     * Moves the tile up
     */
    moveUp(){
      if (!this.canMove) return;
      this.canMove = false;
      let moved = false;
      this.tileSprites.getChildren().forEach((item) => {
        const row = toRow(item.pos);
        const col = toCol(item.pos);
        let i;

        if (row <= 0) return;
        let remove = false;
        for (i = row - 1; i >= 0; i-= 1) {
          if (this.fieldArray[i * 4 + col] !== 0) {
            if (this.fieldArray[i*4+col] === this.fieldArray[row * 4 + col]) {
              remove = true;
              i--;                                             
            }
            break
          }
        }

        if (row !== i + 1) {
         moved = true;
         this.moveTile(item, row * 4 + col, (i+1) * 4 + col, remove);
        }
      });
      // completes the move
      this.endMove(moved);
    }

    /**
     * Executes the move right
     */
    moveRight() {
      if (!this.canMove) return;
      this.canMove = false;
      let moved = false;
      this.tileSprites.getChildren().forEach((item) => {
        const row = toRow(item.pos);
        const col = toCol(item.pos);
        let i;
        if (col >= 3) return;
        let remove = false;

        for (i = col + 1; i <= 3; i+=1) {
          if (this.fieldArray[row * 4 + i] !== 0) {
            if (this.fieldArray[row * 4 + i] === this.fieldArray[row * 4 + col]){
              remove = true;
              i += 1;
            }
            break
          }
        }
        if (col !== i - 1 ) {
          moved = true;
          this.moveTile(item, row * 4 + col, row * 4 + i - 1, remove);
        }
      });

      this.endMove(moved);
    }

    /**
     * Executes the move down
     */
    moveDown() {
      if (!this.canMove) return;
      this.canMove = false;
      let moved = false;
      this.tileSprites.getChildren().forEach((item) => {
        const row = toRow(item.pos);
        const col = toCol(item.pos);
        let i;
        if (row >= 3) return;
        let remove = false;
        for (i = row + 1; i <=3; i+= 1) {
          if (this.fieldArray[i * 4 + col] !== 0) {
            if (this.fieldArray[i * 4 + col] === this.fieldArray[row * 4 + col]) {
              remove = true;
              i++;                                             
            }
            break
          }
        }
        if (row !== i - 1) {
          moved = true;
          this.moveTile(item, row * 4 + col, (i - 1) * 4 + col, remove);
        }
      });
      this.endMove(moved);
    }
}

export default Game;
