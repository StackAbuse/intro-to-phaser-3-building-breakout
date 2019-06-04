// Game objects are global variables so that many functions can access them
let player, ball, violetBricks, yellowBricks, redBricks, cursors;
// Variable to determine if we started playing
let gameStarted = false;
// Add global text objects
let openingText, gameOverText, playerWonText;

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
    // Ensure the canvas is resized to fit the parent div's dimensions
    mode: Phaser.Scale.RESIZE,
    // Center the game canvas both horizontally and vertically within the parent
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  /**
   * A scene is "self-contained" game world - all the logic and state of a game
   * component. For e.g. it's common to a game menu to be one scene, whereas the
   * first level is another scene. Phaser has a Scene object, but we can provide
   * a regular JS object with these function names:
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
    },
  }
};

// Create the game instance
const game = new Phaser.Game(config);

/**
 * The function loads assets as Phaser begins to run the scene. The images are
 * loaded as key value pairs, we reference the assets by their keys of course
 */
function preload() {
  this.load.image('ball', 'assets/images/ball_32_32.png');
  this.load.image('paddle', 'assets/images/paddle_128_32.png');
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
    'paddle', // key of image for the sprite
  );

  // Let's add the ball
  ball = this.physics.add.sprite(
    400, // x position
    565, // y position
    'ball' // key of image for the sprite
  );

  // Add violet bricks
  violetBricks = this.physics.add.group({
    key: 'brick1',
    repeat: 9,
    immovable: true,
    setXY: {
      x: 80,
      y: 140,
      stepX: 70
    }
  });

  // Add yellow bricks
  yellowBricks = this.physics.add.group({
    key: 'brick2',
    repeat: 9,
    immovable: true,
    setXY: {
      x: 80,
      y: 90,
      stepX: 70
    }
  });

  // Add red bricks
  redBricks = this.physics.add.group({
    key: 'brick3',
    repeat: 9,
    immovable: true,
    setXY: {
      x: 80,
      y: 40,
      stepX: 70
    }
  });

  // Manage key presses
  cursors = this.input.keyboard.createCursorKeys();

  // Ensure that the player and ball can't leave the screen
  player.setCollideWorldBounds(true);
  ball.setCollideWorldBounds(true);
  /**
   * The bounce ensures that the ball retains its velocity after colliding with
   * an object.
   */
  ball.setBounce(1, 1);

  /**
   * Disable collision with the bottom of the game world. This needs to be added
   * so the ball falls to the bottom, which means that the game is over
   */
  this.physics.world.checkCollision.down = false;

  // Add collision for the bricks
  this.physics.add.collider(ball, violetBricks, hitBrick, null, this);
  this.physics.add.collider(ball, yellowBricks, hitBrick, null, this);
  this.physics.add.collider(ball, redBricks, hitBrick, null, this);

  // Make the player immovable
  player.setImmovable(true);
  // Add collision for the player
  this.physics.add.collider(ball, player, hitPlayer, null, this);

  // Create opening text
  openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Press SPACE to Start',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  /**
   * The origin of the text object is at the top left, change the origin to the
   * center so it can be properly aligned
   */
  openingText.setOrigin(0.5);

  // Create game over text
  gameOverText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Game Over',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  gameOverText.setOrigin(0.5);

  // Make it invisible until the player loses
  gameOverText.setVisible(false);

  // Create the game won text
  playerWonText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'You won!',
    {
      fontFamily: 'Monaco, Courier, monospace',
      fontSize: '50px',
      fill: '#fff'
    },
  );

  playerWonText.setOrigin(0.5);

  // Make it invisible until the player wins
  playerWonText.setVisible(false);
}

/**
 * Our game state is updated in this function. This corresponds exactly to the
 * update process of the game loop
 */
function update() {
  // Check if the ball left the scene i.e. game over
  if (isGameOver(this.physics.world)) {
    gameOverText.setVisible(true);
    ball.disableBody(true, true);
  } else if (isWon()) {
    playerWonText.setVisible(true);
    ball.disableBody(true, true);
  } else {
    // Put this in so that the player doesn't move if no key is being pressed
    player.body.setVelocityX(0);

    /**
     * Check the cursor and move the velocity accordingly. With Arcade Physics we
     * adjust velocity for movement as opposed to manipulating xy values directly
     */
    if (cursors.left.isDown) {
      player.body.setVelocityX(-350);
    } else if (cursors.right.isDown) {
      player.body.setVelocityX(350);
    }

    // The game only begins when the user presses Spacebar to release the paddle
    if (!gameStarted) {
      // The ball should follow the paddle while the user selects where to start
      ball.setX(player.x);

      if (cursors.space.isDown) {
        gameStarted = true;
        ball.setVelocityY(-200);
        openingText.setVisible(false);
      }
    }
  }
}

/**
 * Checks if the user lost the game
 * @param world - the physics world
 * @return {boolean}
 */
function isGameOver(world) {
  return ball.body.y > world.bounds.height;
}

/**
 * Checks if the user won the game
 * @return {boolean}
 */
function isWon() {
  return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() == 0;
}

/**
 * This function handles the collision between a ball and a brick sprite
 * In the create function, ball is a sprite and violetBricks, yellowBricks and
 * redBricks are sprite groups. Phaser is smart enough to handle the collisions
 * for each individual sprite.
 * @param ball - the ball sprite
 * @param brick - the brick sprite
 */
function hitBrick(ball, brick) {
  brick.disableBody(true, true);

  if (ball.body.velocity.x == 0) {
    randNum = Math.random();
    if (randNum >= 0.5) {
      ball.body.setVelocityX(150);
    } else {
      ball.body.setVelocityX(-150);
    }
  }
}

/**
 * The function handles the collision between the ball and the player. We want
 * to ensure that the ball's direction after bouncing off the player is based
 * on which side of the player was hit. Also, to make things more difficult, we
 * want to increase the ball's velocity when it's hit.
 * @param ball - the ball sprite
 * @param player - the player/paddle sprite
 */
function hitPlayer(ball, player) {
  // Increase the velocity of the ball after it bounces
  ball.setVelocityY(ball.body.velocity.y - 5);

  let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
  // If the ball is to the left of the player, ensure the x velocity is negative
  if (ball.x < player.x) {
    ball.setVelocityX(-newXVelocity);
  } else {
    ball.setVelocityX(newXVelocity);
  }
}
