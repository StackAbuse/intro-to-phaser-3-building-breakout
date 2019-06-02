// Variable to determine if we started playing
let started = false;

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
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE, // Ensure the canvas is resized to fit the parent div's dimensions
    autoCenter: Phaser.Scale.CENTER_BOTH // Center the game canvas both horizontally and vertically within the parent
  },
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
function preload() {
  this.load.image('ball', 'assets/images/ball_32_32.png');
  this.load.image('paddle', 'assets/images/paddle_64_32.png');
  this.load.image('brick1', 'assets/images/brick1_64_32.png');
  this.load.image('brick2', 'assets/images/brick2_64_32.png');
  this.load.image('brick3', 'assets/images/brick3_64_32.png');
}

/**
 * We create our game world in this function. The initial state of our game is
 * defined here. We also set up our physics rules here
 */
function create() {
  /**
   * Coordinates start at 0,0 from the top left
   * As we move rightward, the x value increases
   * As we move downward, the y value increases.
   */
  player = this.physics.add.sprite(
    400, // x position
    600, // y position
    'paddle' // key of image for the sprite
  );
  // Variable to track key presses
  cursors = this.input.keyboard.createCursorKeys();
  // Ensure that the player can't leave the screen
  player.setCollideWorldBounds(true);

  // Let's add the ball
  ball = this.physics.add.sprite(
    400, // x position
    570, // y position
    'ball' // key of image for the sprite
  );
  ball.setBounce(1, 1);
  // Also collides with world bounds
  ball.setCollideWorldBounds(true);

  // Add blue bricks
  violetBricks = this.physics.add.group({
    key: 'brick1',
    repeat: 9,
    setXY: {
      x: 90,
      y: 120,
      stepX: 70
    }
  });

  // Add yellow bricks
  yellowBricks = this.physics.add.group({
    key: 'brick2',
    repeat: 9,
    setXY: {
      x: 90,
      y: 80,
      stepX: 70
    }
  });

  // Add red bricks
  redBricks = this.physics.add.group({
    key: 'brick3',
    repeat: 9,
    setXY: {
      x: 90,
      y: 40,
      stepX: 70
    }
  });
}

/**
 *
 */
function update() {
  // Put this in so that the player doesn't move if no key is being pressed
  player.body.setVelocityX(0);
  /**
   * Check the cursor and move the velocity accordingly. With Arcade Physics we
   * adjust velocity for movement as opposed to manipulating xy values directly
   */
  if (cursors.left.isDown) {
    player.body.setVelocityX(-250);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(250);
  }

  // The game only begins when the user presses Spacebar to release the paddle
  if (!started) {
    // The ball should follow the paddle while the user selects where to start
    ball.body.x = player.body.x + (player.body.width / 4);

    if (cursors.space.isDown) {
      started = true;
      ball.setVelocityY(-200);
    }
  }
}

