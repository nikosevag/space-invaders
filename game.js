// Game Constants
const GAME_WIDTH = 800; // Width of the game canvas
const GAME_HEIGHT = 600; // Height of the game canvas

// Player Constants
const PLAYER_SPEED = 5; // Speed of player movement
const PLAYER_BULLET_SPEED = 7; // Speed of player bullets
const PLAYER_INVULNERABLE_DURATION = 2000; // 2 seconds of invulnerability after hit

// Enemy Constants
const ENEMY_BULLET_SPEED = 3; // Speed of enemy bullets
const ENEMY_SPEED = 5; // Speed of enemy movement
const ENEMY_ROWS = 5; // Number of rows in the enemy grid
const ENEMY_COLS = 11; // Number of columns in the enemy grid
const ENEMY_DROP_DISTANCE = 20; // Distance enemies drop after each row
const ENEMY_MOVE_INTERVAL = 400; // Time between enemy movements in ms
const ENEMY_SHOT_INTERVAL = 800; // Base time between enemy shots in ms
const MIN_ENEMY_SHOT_INTERVAL = 300; // Minimum time between enemy shots in ms

// Game State
const createGameState = () => ({
  score: 0,
  lives: 3,
  gameOver: false,
  enemies: [],
  bullets: [],
  player: null,
  lastEnemyMove: 0,
  enemyDirection: 1,
  enemyMoveInterval: ENEMY_MOVE_INTERVAL,
  enemyBullets: [],
  lastEnemyShot: 0,
  enemyShotInterval: ENEMY_SHOT_INTERVAL,
  shields: [],
});

// Entity Factory
const createEntity = (x, y, width, height, color) => ({
  x,
  y,
  width,
  height,
  color,
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
});

// Player Class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 20;
    this.color = '#4CAF50';
    this.speed = PLAYER_SPEED;
    this.isInvulnerable = false;
    this.invulnerableTimer = 0;
    this.invulnerableDuration = PLAYER_INVULNERABLE_DURATION;
  }

  draw(ctx) {
    if (this.isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      return; // Blink effect when invulnerable
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    this.x += direction * this.speed;
    this.x = Math.max(0, Math.min(GAME_WIDTH - this.width, this.x));
  }

  shoot() {
    return createEntity(this.x + this.width / 2 - 2, this.y, 4, 10, '#FFD700');
  }

  updateInvulnerability(timestamp) {
    if (
      this.isInvulnerable &&
      timestamp - this.invulnerableTimer > this.invulnerableDuration
    ) {
      this.isInvulnerable = false;
    }
  }
}

// Enemy Class
class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 20;
    this.type = type;
    this.color = this.getColorByType();
    this.points = this.getPointsByType();
  }

  getColorByType() {
    switch (this.type) {
      case 0:
        return '#660000'; // Top row (darkest red)
      case 1:
        return '#990000'; // Second row
      case 2:
        return '#CC0000'; // Third row
      case 3:
        return '#FF0000'; // Fourth row
      case 4:
        return '#FF3333'; // Fifth row (brightest red - closest to player)
      default:
        return '#FF0000';
    }
  }

  getPointsByType() {
    switch (this.type) {
      case 0:
        return 40;
      case 1:
        return 30;
      case 2:
        return 20;
      case 3:
        return 10;
      case 4:
        return 5;
      default:
        return 5;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction) {
    this.x += direction * ENEMY_SPEED;
  }

  moveDown() {
    this.y += ENEMY_DROP_DISTANCE;
  }

  shoot() {
    return createEntity(
      this.x + this.width / 2 - 2,
      this.y + this.height,
      4,
      10,
      '#FF0000'
    );
  }
}

// Shield Class
class Shield {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 40;
    this.health = 3;
    this.maxHealth = 3;
  }

  draw(ctx) {
    if (this.health <= 0) return;

    // Draw shield
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw health bar background
    const healthBarWidth = 40;
    const healthBarHeight = 5;
    const healthBarX = this.x + (this.width - healthBarWidth) / 2;
    const healthBarY = this.y - 10;

    ctx.fillStyle = '#333';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Draw health bar
    const healthWidth = (this.health / this.maxHealth) * healthBarWidth;
    ctx.fillStyle = this.getHealthColor();
    ctx.fillRect(healthBarX, healthBarY, healthWidth, healthBarHeight);
  }

  getHealthColor() {
    switch (this.health) {
      case 3:
        return '#4CAF50'; // Green
      case 2:
        return '#FFC107'; // Yellow
      case 1:
        return '#F44336'; // Red
      default:
        return '#333';
    }
  }

  isHit(bullet) {
    if (this.health <= 0) return false;

    if (checkCollision(bullet, this)) {
      this.health--;
      return true;
    }
    return false;
  }
}

// Collision Detection
const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Game Initialization
const initGame = () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  let gameState = createGameState();
  gameState.player = new Player(GAME_WIDTH / 2 - 25, GAME_HEIGHT - 40);

  // Initialize enemies
  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      gameState.enemies.push(new Enemy(col * 40 + 100, row * 30 + 50, row));
    }
  }

  // Initialize shields
  const shieldPositions = [150, 350, 550];
  shieldPositions.forEach((x) => {
    gameState.shields.push(new Shield(x, GAME_HEIGHT - 100));
  });

  // Event Listeners
  document.addEventListener('keydown', (e) => {
    if (gameState.gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        gameState.player.move(-1);
        break;
      case 'ArrowRight':
        gameState.player.move(1);
        break;
      case ' ':
        gameState.bullets.push(gameState.player.shoot());
        break;
    }
  });

  document.getElementById('restartButton').addEventListener('click', () => {
    gameState = createGameState();
    gameState.player = new Player(GAME_WIDTH / 2 - 25, GAME_HEIGHT - 40);

    // Reinitialize enemies
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        gameState.enemies.push(new Enemy(col * 40 + 100, row * 30 + 50, row));
      }
    }

    // Reinitialize shields
    shieldPositions.forEach((x) => {
      gameState.shields.push(new Shield(x, GAME_HEIGHT - 100));
    });

    document.getElementById('gameOver').classList.add('hidden');

    // Restart game loop
    requestAnimationFrame(gameLoop);
  });

  // Game Loop
  const gameLoop = (timestamp) => {
    if (gameState.gameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Update player invulnerability
    gameState.player.updateInvulnerability(timestamp);

    // Move enemies
    if (timestamp - gameState.lastEnemyMove > gameState.enemyMoveInterval) {
      gameState.lastEnemyMove = timestamp;

      // Check if enemies hit the edge
      const edgeHit = gameState.enemies.some(
        (enemy) =>
          (enemy.x <= 0 && gameState.enemyDirection < 0) ||
          (enemy.x + enemy.width >= GAME_WIDTH && gameState.enemyDirection > 0)
      );

      if (edgeHit) {
        gameState.enemyDirection *= -1;
        gameState.enemies.forEach((enemy) => enemy.moveDown());
        // Speed up enemies after each drop
        gameState.enemyMoveInterval = Math.max(
          200,
          gameState.enemyMoveInterval - 50
        );
      } else {
        gameState.enemies.forEach((enemy) =>
          enemy.move(gameState.enemyDirection)
        );
      }
    }

    // Enemy shooting
    if (
      timestamp - gameState.lastEnemyShot > gameState.enemyShotInterval &&
      gameState.enemies.length > 0
    ) {
      gameState.lastEnemyShot = timestamp;

      // Increase shot frequency as enemies decrease
      const remainingEnemies = gameState.enemies.length;
      const totalEnemies = ENEMY_ROWS * ENEMY_COLS;
      const difficultyFactor = 1 - remainingEnemies / totalEnemies;
      gameState.enemyShotInterval = Math.max(
        MIN_ENEMY_SHOT_INTERVAL,
        ENEMY_SHOT_INTERVAL * (1 - difficultyFactor * 0.7)
      );

      // Random enemy shoots
      const randomEnemy =
        gameState.enemies[Math.floor(Math.random() * gameState.enemies.length)];
      gameState.enemyBullets.push(randomEnemy.shoot());
    }

    // Move player bullets
    gameState.bullets = gameState.bullets.filter((bullet) => {
      bullet.y -= PLAYER_BULLET_SPEED;
      return bullet.y > 0;
    });

    // Move enemy bullets
    gameState.enemyBullets = gameState.enemyBullets.filter((bullet) => {
      bullet.y += ENEMY_BULLET_SPEED;
      return bullet.y < GAME_HEIGHT;
    });

    // Check bullet-enemy collisions
    gameState.bullets.forEach((bullet, bulletIndex) => {
      gameState.enemies.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          gameState.bullets.splice(bulletIndex, 1);
          gameState.enemies.splice(enemyIndex, 1);
          gameState.score += enemy.points;
          document.getElementById('score').textContent = gameState.score;
        }
      });
    });

    // Check bullet-shield collisions
    gameState.bullets.forEach((bullet, bulletIndex) => {
      gameState.shields.forEach((shield) => {
        if (shield.isHit(bullet)) {
          gameState.bullets.splice(bulletIndex, 1);
        }
      });
    });

    gameState.enemyBullets.forEach((bullet, bulletIndex) => {
      gameState.shields.forEach((shield) => {
        if (shield.isHit(bullet)) {
          gameState.enemyBullets.splice(bulletIndex, 1);
        }
      });
    });

    // Check enemy bullet-player collisions
    gameState.enemyBullets.forEach((bullet, bulletIndex) => {
      if (
        !gameState.player.isInvulnerable &&
        checkCollision(bullet, gameState.player)
      ) {
        gameState.enemyBullets.splice(bulletIndex, 1);
        gameState.lives--;
        document.getElementById('lives').textContent = gameState.lives;

        if (gameState.lives <= 0) {
          gameState.gameOver = true;
          document.getElementById('gameOver').classList.remove('hidden');
          document.getElementById('finalScore').textContent = gameState.score;
        } else {
          gameState.player.isInvulnerable = true;
          gameState.player.invulnerableTimer = timestamp;
        }
      }
    });

    // Check if enemies reached bottom
    if (
      gameState.enemies.some(
        (enemy) => enemy.y + enemy.height >= GAME_HEIGHT - 40
      )
    ) {
      gameState.gameOver = true;
      document.getElementById('gameOver').classList.remove('hidden');
      document.getElementById('finalScore').textContent = gameState.score;
    }

    // Check if all enemies are destroyed
    if (gameState.enemies.length === 0) {
      gameState.gameOver = true;
      document.getElementById('gameOver').classList.remove('hidden');
      document.getElementById('finalScore').textContent = gameState.score;
    }

    // Draw everything
    gameState.player.draw(ctx);
    gameState.enemies.forEach((enemy) => enemy.draw(ctx));
    gameState.bullets.forEach((bullet) => bullet.draw(ctx));
    gameState.enemyBullets.forEach((bullet) => bullet.draw(ctx));
    gameState.shields.forEach((shield) => shield.draw(ctx));

    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
};

// Start the game when the page loads
window.addEventListener('load', initGame);
