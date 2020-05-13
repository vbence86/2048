import Phaser from 'phaser';
import Scene from './Scene';
import TileView from '../components/TileView';
import TileModel from '../logic/TileModel';
import FeaturePopup from '../components/gui/FeaturePopup';

// resources
import tileImg from '../assets/tile.png';
import bricksImg from '../assets/bricks.jpg';
import bombImg from '../assets/bomb.png';
import chestImg from '../assets/chest.png';
import keyImg from '../assets/key.png';
import guiImg from '../assets/gui.png';
import guiAtlas from '../assets/gui.json';
import explosionImg from '../assets/explosion.png';
import animJson from '../assets/animations.json';
import catImg from '../assets/cat.png';
import catAtlas from '../assets/cat.json';

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

/**
 * Returns an array populated with valid field objects
 *
 * @returns {array}
 */
const getFieldArray = () => {
  const arr = [];
  for (let i = 0; i < 16; i += 1) {
    arr.push(TileModel.createEmpty());
  }
  return arr;
};

class Game extends Scene {
  /**
   * Preload state
   */
  preload() {
    this.load.animation('animData', animJson);
    this.load.image('tile', tileImg);
    this.load.image('bricks', bricksImg);
    this.load.image('bomb', bombImg);
    this.load.image('key', keyImg);
    this.load.image('chest', chestImg);
    this.load.spritesheet('explosion', explosionImg, { frameWidth: 192, frameHeight: 192 });
    this.load.atlas('gui', guiImg, guiAtlas);
    this.load.atlas('cat', catImg, catAtlas);
  }

  /**
   * Creates the scene
   */
  create() {
    this.initTileContainer();
    this.initFeaturePopup();
    this.initInputListeners();
    this.initGameEventListeners();
    this.startGame();
  }

  /**
   * Sets up the 2048 tiles and related helper variables
   */
  initTileContainer() {
    const tilesPadding = 50;
    this.tileViews = this.add.container();
    this.tileViews.x = tilesPadding / 2;
    this.tileSize = Math.min((this.sys.canvas.width - tilesPadding) / 4, (this.sys.canvas.height - tilesPadding) / 4 / 2);
    this.fieldArray = getFieldArray();
  }

  /**
   * Sets up the 2048 tiles and related helper variables
   */
  initFeaturePopup() {
    this.featurePopup = new FeaturePopup({ scene: this });
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
  async startGame() {
    this.canMove = false;

    await this.addNewTile(TileModel.create(TileModel.Type.Number)),
    await this.addNewTile(TileModel.create(TileModel.Type.Number)),
    await this.addNewTile(TileModel.create(TileModel.Type.Brick)),
    await this.addNewTile(TileModel.create(TileModel.Type.Brick)),
    await this.addNewTile(TileModel.create(TileModel.Type.Brick)),
    await this.addNewTile(TileModel.create(TileModel.Type.Key)),
    await this.addNewTile(TileModel.create(TileModel.Type.Chest)),
    await this.addNewTile(TileModel.create(TileModel.Type.Cat, { value: 5 })),

    this.canMove = true;
  }

  /**
   * Adds a new tile component to the tile matrix
   *
   * @param {object} model 
   */
  addNewTile(model) {
    return new Promise(resolve => {
      let position;
      // choosing an empty tile in the field
      do {
        position = Math.floor(Math.random() * 16);
      } while (!this.fieldArray[position].isEmpty());

      this.fieldArray[position] = model;

      // containter object
      const x = toCol(position) * this.tileSize; 
      const y = toRow(position) * this.tileSize;
      const tile = new TileView({
        scene: this, 
        tileSize: this.tileSize,
        x,
        y,
        position,
        model,
      });
      
      // adding container to the group
      this.tileViews.add(tile);
      
      // creation of a new tween for the tile sprite
      const fadeIn = this.tweens.add({
        targets: [tile],
        duration: 250,
        alpha: {
          getStart: () => 0,
          getEnd: () => 1,
        },
        onComplete: () => {
          this.updateTiles();
          resolve();
        },
      });

    });
  }

  /** 
   * Completes the moves placement and create another "2" on the matrix
   * @param {boolean} hasMoved
   */
  async endMove(hasMoved) {
    // purge the matrix from placeholders
    this.fieldArray.forEach((model, idx) => {
      if (model.willBeRemoved()) {
        this.fieldArray[idx] = TileModel.createEmpty();
      }
    });

    this.updateTiles();

    if (hasMoved) {
      await this.addNewTile(TileModel.create(TileModel.Type.Number));
    }

    this.canMove = true;
  }

  /**
   * Loops through all the tiles and updates them
   */
  updateTiles() {
    const toDelete = [];
    this.tileViews.getAll().forEach((item) => {
      const model = this.fieldArray[item.pos];
      if (model.isEmpty()) {
        toDelete.push(item);
      } else {
        item.bind(model);
      }
    });
    toDelete.forEach(item => this.tileViews.remove(item));
  }  

  /**
   * Moves a specific tile
   * @param {object} tile
   * @param {number} from
   * @param {number} to
   * @param {boolean} remove
   */
  async moveTile(tile, from, to, remove) {
    const swapResult = this.swapTiles({ tile, from, to });
    await this.moveTileAnimation({ tile, to });

    if (remove) {
      // @TODO Make a Class definition for SwapResult
      this.mergeTiles(swapResult);
      this.triggerRemoveEvents(swapResult);
      this.triggerMergeEvents(swapResult);
      await this.showMergeResultPopup(swapResult);
    }
  }

  /**
   * Swaps the models in the tiles matrix
   *
   * @params {object} - { to: number, from: number, tile: TileView }
   * @returns {object} result of the swap
   */
  swapTiles({ to, from, tile }) {
    const fromModel = Object.assign( Object.create( Object.getPrototypeOf(this.fieldArray[from])), this.fieldArray[from]);
    const toModel = Object.assign( Object.create( Object.getPrototypeOf(this.fieldArray[to])), this.fieldArray[to]);
    this.fieldArray[to] = this.fieldArray[from];
    this.fieldArray[from] = TileModel.createEmpty();
    tile.pos = to;

    return {
      newModel: this.fieldArray[to],
      fromModel,
      toModel,
      tile,
    };
  }

  /**
   * Triggers the tile movement animation and returns a Promise
   * that is resolved if the tween is ready
   *
   * @param {object} - {tile: TileView, to: number }
   */
  moveTileAnimation({ tile, to }) {
    return new Promise(resolve =>
      this.tweens.add({
        targets: [tile],
        duration: 100,
        x: this.tileSize * toCol(to),
        y: this.tileSize * toRow(to),
        onComplete: resolve,
      })
    );
  }

  /**
   * Invoked when two tiles are merged together. It must return
   * the id of the result from the merge
   *
   * @param {object} - { fromModel: TileModel, newModel: TileModel }
   */
  mergeTiles({ toModel, newModel, tile }) {
    newModel.mergeFrom(toModel);
    tile.destroy();
  }  

  /**
   * Execute the move to the left
   */
  async moveLeft() {
    // Is the player allowed to move?
    if (!this.canMove) return;
    const moves = [];
    // the player can move, let's set "canMove" to false to prevent moving again until the move process is done
    this.canMove = false;
    // keeping track if the player moved, i.e. if it's a legal move

    this.tileViews.sort('x');
    // looping through each element in the group
    this.tileViews.getAll().forEach((item) => {
      // getting row and column starting from a one-dimensional array
      const row = toRow(item.pos);
      const col = toCol(item.pos);
      const model = item.getModel();
      let i;

      // checking if the tile is movable
      if (model.isStatic()) return;

      // checking if we aren't already on the leftmost column (the tile can't move)
      if ( col <= 0) return;
      // setting a "remove" flag to false. Sometimes you have to remove tiles, when two merge into one 
      let remove = false;
      // looping from column position back to the leftmost column
      for (i = col - 1; i >= 0; i -= 1) {
        const pos = row * 4 + i;
        const targetPos = row * 4 + col;
        const actual = this.fieldArray[pos];
        const target = this.fieldArray[targetPos];
        // if we find a tile which is not empty, our search is about to end...
        if (!actual.isEmpty()) {
          // ...we just have to see if the tile we are landing on has the same value of the tile we are moving
          if (actual.canMergeWith(target)) {
            // in this case the current tile will be removed
            remove = true;
            i -= 1;                                             
          }
          break;
        }
      }

      // if we can actually move...
      if (col !== i + 1) {
       // moving the tile "item" from row*4+col to row*4+i+1 and (if allowed) remove it
       moves.push(this.moveTile(item, row * 4 + col, row * 4 + i + 1, remove));
      }
    });
    
    await Promise.all(moves);
    this.endMove(moves.length);
  }

  /**
   * Moves the tile up
   */
  async moveUp() {
    if (!this.canMove) return;
    const moves = [];
    this.canMove = false;

    this.tileViews.sort('y');
    this.tileViews.getAll().forEach((item) => {
      const row = toRow(item.pos);
      const col = toCol(item.pos);
      const model = item.getModel();
      let i;

      // checking if the tile is movable
      if (model.isStatic()) return;

      if (row <= 0) return;
      let remove = false;
      for (i = row - 1; i >= 0; i-= 1) {
        const pos = i * 4 + col;
        const targetPos = row * 4 + col;
        const actual = this.fieldArray[pos];
        const target = this.fieldArray[targetPos];
        // if we find a tile which is not empty, our search is about to end...
        if (!actual.isEmpty()) {
          // ...we just have to see if the tile we are landing on has the same value of the tile we are moving
          if (actual.canMergeWith(target)) {
            // in this case the current tile will be removed
            remove = true;
            i -= 1;                                             
          }
          break;
        }
      }

      if (row !== i + 1) {
       moves.push(this.moveTile(item, row * 4 + col, (i+1) * 4 + col, remove));
      }
    });

    await Promise.all(moves);
    this.endMove(moves.length);
  }

  /**
   * Executes the move right
   */
  async moveRight() {
    if (!this.canMove) return;
    const moves = [];
    this.canMove = false;

    this.tileViews.sort('x');
    this.tileViews.getAll().reverse().forEach((item) => {
      const row = toRow(item.pos);
      const col = toCol(item.pos);
      const model = item.getModel();
      let i;

      // checking if the tile is movable
      if (model.isStatic()) return;

      if (col >= 3) return;
      let remove = false;

      for (i = col + 1; i <= 3; i+=1) {
        const pos = row * 4 + i;
        const targetPos = row * 4 + col;
        const actual = this.fieldArray[pos];
        const target = this.fieldArray[targetPos];
        // if we find a tile which is not empty, our search is about to end...
        if (!actual.isEmpty()) {
          // ...we just have to see if the tile we are landing on has the same value of the tile we are moving
          if (actual.canMergeWith(target)) {
            // in this case the current tile will be removed
            remove = true;
            i += 1;                                             
          }
          break;
        }
      }
      if (col !== i - 1 ) {
        moves.push(this.moveTile(item, row * 4 + col, row * 4 + i - 1, remove));
      }
    });

    await Promise.all(moves);
    this.endMove(moves.length);
  }

  /**
   * Executes the move down
   */
  async moveDown() {
    if (!this.canMove) return;
    const moves = [];

    this.canMove = false;
    this.tileViews.sort('y');
    this.tileViews.getAll().reverse().forEach((item) => {
      const row = toRow(item.pos);
      const col = toCol(item.pos);
      const model = item.getModel();
      let i;

      // checking if the tile is movable
      if (model.isStatic()) return;

      if (row >= 3) return;

      let remove = false;

      for (i = row + 1; i <=3; i+= 1) {
        const pos = i * 4 + col;
        const targetPos = row * 4 + col;
        const actual = this.fieldArray[pos];
        const target = this.fieldArray[targetPos];
        // if we find a tile which is not empty, our search is about to end...
        if (!actual.isEmpty()) {
          // ...we just have to see if the tile we are landing on has the same value of the tile we are moving
          if (actual.canMergeWith(target)) {
            // in this case the current tile will be removed
            remove = true;
            i += 1;                                             
          }
          break;
        }
      }
      if (row !== i - 1) {
        moves.push(this.moveTile(item, row * 4 + col, (i - 1) * 4 + col, remove));
      }
    });

    await Promise.all(moves);
    this.endMove(moves.length);
  }

  /**
   * Callback to trigger further events 
   *
   * @param {object} - { toModel: object, newModel: object, tile: object }
   */
  triggerMergeEvents({ fromModel, tile }) {
    const events = fromModel.getEvents();
    if (events && events.merge) {
      this.addEffect({
        x: tile.x,
        y: tile.y,
        id: events.merge.sprite,
        animationId: events.merge.animationId,
      });
    }
  }

  /**
   * Callback to trigger further events 
   *
   * @param {object} - { toModel: object, newModel: object, tile: object }
   */
  triggerRemoveEvents({ newModel }) {
    const events = newModel.getEvents();

    if (!newModel.willBeRemoved()) return;
    if (!events || !events.remove) return;

    const { x, y } = newModel.getView();
    this.addEffect({
      id: events.remove.sprite,
      animationId: events.remove.animationId,
      x,
      y,
    });
  }

  /**
   * Callback to trigger the feature popup
   *
   * @param {object} - { toModel: object, newModel: object, tile: object }
   */
  async showMergeResultPopup({ toModel, newModel }) {
    if (!toModel.doesShowMergeResultInPopup()) return;
    const spriteKey = newModel.getSpriteKey();
    const sprite = this.add.sprite(0, 0, spriteKey);

    this.canMove = false;
    await this.featurePopup.show({ sprite });
    await this.wait(1500);
    await this.featurePopup.hide();
    this.canMove = true;
  }

  /**
   * Creates a new animating sprite based on the given configuartion param
   *
   * @param {object} config
   */
  addEffect(config) {
    const { x, y, id, animationId } = config;
    const sprite = this.add.sprite(x, y, id);
    sprite.setOrigin(0);
    const animComplete = () => sprite.destroy();
    sprite.on('animationcomplete', animComplete);
    sprite.play(animationId || id);
  }  
}

export default Game;
