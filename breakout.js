// This object contains all the Phaser configurations to load our game
const config = {
  /**
   * The type can be Phaser.CANVAS, Phaser.WEBGL or Phaser.AUTO. AUTO means that
   * Phaser will try to render with WebGL, and fall back to Canvas if it fails
   */
  type: Phaser.AUTO,
  // Parent element to inject the Canvas/WebGL element with the game
  parent: 'game',
  width: 800,
  heigth: 600,
  /**
   * A scene is "self-contained" game world - all the logic and state of a game
   * component. For e.g. it's common to a game menu to be one scene, whereas the
   * first level is another scene. Phaser has a Scene object, but we can provide
   * a regular JS object with the these function names
   */
  scene: {
    preload,
    create,
    update,
  },
  /**
   * The physics engine determines how objects interact with the world. Phaser
   * supports three physics engines out of the box: arcade, impact and matter.
   * Arcade is understood to be the simplest one to implement
   */
  physics: {
    default: 'arcade',
    arcade: {
      gravity: false
    }
  }
};

// Create the game object
const game = new Phaser.Game(config);

/**
 * The function loads assets as Phaser begins to run the scene. The images are
 * loaded as key value pairs, we reference the assets by their keys of course
 */
function preload() { }

/**
 * We create our game world in this function. The initial state of our game is
 * defined here. We also set up our physics rules here
 */
function create() { }

/**
 *
 */
function update() { }

