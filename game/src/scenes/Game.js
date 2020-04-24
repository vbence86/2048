import Phaser from 'phaser';
import Scene from './Scene';
import Tile from '../components/Tile';

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
    this.initTileContainer();
    this.initInputListeners();
    this.initGameEventListeners();
    this.startGame();
  }

  /**
   * Sets up the 2048 tiles and related helper variables
   */
  initTileContainer() {
    const tilesPadding = 50;
    this.tiles = this.add.container();
    this.tiles.x = tilesPadding / 2;
    this.tileSize = Math.min((this.sys.canvas.width - tilesPadding) / 4, (this.sys.canvas.height - tilesPadding) / 4 / 2);
    this.fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.canMove = false;
  }

  /**
   * Sets up the listeners against game events
   */
  initGameEventListeners() {
    this.emitter = new Phaser.Events.EventEmitter();    
  }

  /**
   * Sets up the listeners against user interactions
   */
  initInputListeners() {
    // listeners for arrow keys
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    upKey.on('down', this.moveUp.bind(this));
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    downKey.on('down', this.moveDown.bind(this));
    const leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    leftKey.on('down', this.moveLeft.bind(this));
    const rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    rightKey.on('down', this.moveRight.bind(this));

    // swipe logic
    this.input.on('pointerup', this.onSwipe, this);
  }

  /**
   * Invoked on Pointer up and executes the logic to
   * imitate swipe interaction
   *
   * @param {object} e
   */
  onSwipe(e) {
    const swipeTime = e.upTime - e.downTime;
    const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    const swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    const swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
    if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
      if(swipeNormal.x > 0.8) {
          this.moveRight();
      } else if (swipeNormal.x < -0.8) {
          this.moveLeft();
      } else if (swipeNormal.y > 0.8) {
          this.moveDown();
      } else if (swipeNormal.y < -0.8) {
          this.moveUp();
      }
    }
  }

  /**
   * Kicks off the gameplay
   */
  startGame() {
    // at the beginning of the game we add two "2"
    this.addNewTile(2);
    this.addNewTile(2);
  }

  /**
   * Adds a new tile component to the tile matrix
   *
   * @param {number} id 
   */
  addNewTile(id) {
    let position;
    // choosing an empty tile in the field
    do {
      position = Math.floor(Math.random() * 16);
    } while (this.fieldArray[position] != 0);

    // such empty tile now takes "2" value
    this.fieldArray[position] = id;

    // containter object
    const x = toCol(position) * this.tileSize; 
    const y = toRow(position) * this.tileSize;
    const tile = new Tile({
      scene: this, 
      tileSize: this.tileSize,
      x,
      y,
      id,
      position,
    });
    
    // adding container to the group
    this.tiles.add(tile);
    
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
    this.tiles.getAll().forEach((item) => {
      // retrieving the proper value to show
      const value = this.fieldArray[item.pos];
      // showing the value
      item.setId(value);
    }); 
  }

  /** 
   * Completes the moves placement and create another "2" on the matrix
   * @param {boolean} hasMoved
   */
  endMove(hasMoved) {
    // if we move the tile...
    if (hasMoved) {
      this.addNewTile(2);
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
      duration: 100,
      x: this.tileSize * (toCol(to)),
      y: this.tileSize * (toRow(to)),
      onComplete: () => {
        if (remove) tile.destroy();
      },
    });

    if (remove) {
      // if the tile has to be removed, it means the destination tile must be multiplied by 2
      this.onMerge(from, to, tile);
      this.emitter.emit('tile/merge', from, to, tile);
    }
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

    this.tiles.sort('x');
    // looping through each element in the group
    this.tiles.getAll().forEach((item) => {
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
   * Moves the tile up
   */
  moveUp(){
    if (!this.canMove) return;
    this.canMove = false;
    let moved = false;

    this.tiles.sort('y');
    this.tiles.getAll().forEach((item) => {
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
    this.tiles.sort('x');
    this.tiles.getAll().reverse().forEach((item) => {
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
    this.tiles.sort('y');
    this.tiles.getAll().reverse().forEach((item) => {
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

  /**
   * Invoked when two tiles are merged together. It must return
   * the id of the result from the merge
   *
   * @param {number} from
   * @param {number} to
   * @param {object} tile
   * @returns {}
   */
  onMerge(from, to, tile) {
    this.fieldArray[to] *= 2;
  }
}

export default Game;
