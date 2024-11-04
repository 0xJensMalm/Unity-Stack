// src/scenes/GameScene.js
import Grid from "../objects/Grid.js";
import Tetromino from "../objects/Tetromino.js";
import gameConfig from "../config/gameConfig.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    // Get values from config
    this.cellSize = gameConfig.playfield.cellSize;
    this.gridWidth = gameConfig.playfield.width;
    this.gridHeight = gameConfig.playfield.height;
    this.moveSpeed = gameConfig.mechanics.initialMoveSpeed;

    // Track last movement times
    this.lastMove = {
      player1: 0,
      player2: 0,
    };

    // Initialize scores
    this.scores = {
      player1: 0,
      player2: 0,
    };

    // Track next pieces
    this.nextPieces = {
      player1: null,
      player2: null,
    };

    // Game state
    this.isGameOver = false;
    this.isPaused = false;
  }

  create() {
    // Calculate grid position using config helpers
    this.gridOffsetX = gameConfig.getGridOffsetX();
    this.gridOffsetY = gameConfig.getGridOffsetY();

    // Initialize grid and graphics
    this.grid = new Grid(this.gridWidth, this.gridHeight);
    this.gridGraphics = this.add.graphics();

    // Create initial pieces and prepare next pieces for both players
    this.currentPieces = {};
    this.prepareNextPieces();
    this.spawnNewPieces();

    // Setup controls
    this.setupControls();

    // Launch UI scene
    this.scene.launch("UIScene");
    this.uiScene = this.scene.get("UIScene");

    // Start game loop
    this.gameLoop();
  }

  prepareNextPieces() {
    // Generate new shapes for both players
    const shapes = {
      player1: this.getRandomShape(),
      player2: this.getRandomShape(),
    };

    // Update nextPieces
    this.nextPieces = shapes;

    // Update UI with next pieces
    if (this.uiScene) {
      Object.entries(shapes).forEach(([player, shape]) => {
        this.uiScene.updateNextPiece(player, shape);
      });
    }
  }

  spawnNewPieces() {
    ["player1", "player2"].forEach((player) => {
      if (!this.currentPieces[player] || !this.currentPieces[player].isActive) {
        // Use the next piece if available
        const shape = this.nextPieces[player] || this.getRandomShape();
        this.currentPieces[player] = new Tetromino(this, shape, player);

        // Generate and show next piece
        this.nextPieces[player] = this.getRandomShape();

        // Update UI preview
        if (this.uiScene) {
          this.uiScene.updateNextPiece(player, this.nextPieces[player]);
        }

        // Check for game over condition
        if (!this.currentPieces[player].isValidPosition()) {
          this.gameOver(player);
        }
      }
    });
  }

  gameOver(losingPlayer) {
    this.isGameOver = true;
    const winningPlayer = losingPlayer === "player1" ? "player2" : "player1";

    if (this.uiScene) {
      this.uiScene.showGameOver(winningPlayer, this.scores);
    }

    // Stop the game loop
    this.scene.pause();
  }

  getRandomShape() {
    const shapes = ["I", "O", "T", "S", "Z", "J", "L"];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  setupControls() {
    // Player 1 controls (Left side)
    this.input.keyboard.on("keydown-W", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player1?.moveUp();
      }
    });

    this.input.keyboard.on("keydown-S", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player1?.moveDown();
      }
    });

    this.input.keyboard.on("keydown-D", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player1?.moveRight();
      }
    });

    this.input.keyboard.on("keydown-E", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player1?.rotate();
      }
    });

    // Player 2 controls (Right side)
    this.input.keyboard.on("keydown-UP", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player2?.moveUp();
      }
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player2?.moveDown();
      }
    });

    this.input.keyboard.on("keydown-LEFT", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player2?.moveLeft();
      }
    });

    this.input.keyboard.on("keydown-SPACE", () => {
      if (!this.isPaused && !this.isGameOver) {
        this.currentPieces.player2?.rotate();
      }
    });

    // Pause control
    this.input.keyboard.on("keydown-ESC", () => {
      this.togglePause();
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.uiScene) {
      this.uiScene.showPauseMenu(this.isPaused);
    }
  }

  update(time) {
    if (this.isPaused || this.isGameOver) {
      return;
    }

    // Handle automatic movement
    ["player1", "player2"].forEach((player) => {
      if (time - this.lastMove[player] > this.moveSpeed) {
        const piece = this.currentPieces[player];
        if (piece && piece.isActive) {
          const canMove =
            player === "player1" ? piece.moveRight() : piece.moveLeft();

          if (!canMove) {
            // Lock piece and spawn new one
            this.lockPiece(player);
            // Check for completed lines
            this.checkLines();
            // Spawn new piece
            this.spawnNewPieces();
          }
        }
        this.lastMove[player] = time;
      }
    });

    // Draw current game state
    this.drawGameState();
  }

  checkLines() {
    let columnsCleared = 0;
    let clearedColumns = [];

    // Check each column from left to right
    for (let x = 0; x < this.gridWidth; x++) {
      if (this.grid.isColumnFull(x)) {
        clearedColumns.push(x);
        columnsCleared++;
      }
    }

    // If columns were cleared, show effect before removing them
    if (clearedColumns.length > 0) {
      // Create effects for all cleared columns
      clearedColumns.forEach((x) => {
        this.createColumnClearEffect(x);
      });

      // Delay the actual column removal
      this.time.delayedCall(300, () => {
        clearedColumns.forEach((x) => {
          this.removeColumn(x);
        });

        // Award points
        const points = columnsCleared * gameConfig.mechanics.pointsPerLine;
        this.scores.player1 += points;
        this.scores.player2 += points;

        // Update UI
        if (this.uiScene) {
          this.uiScene.updateScore("player1", this.scores.player1);
          this.uiScene.updateScore("player2", this.scores.player2);
        }

        // Increase game speed
        this.moveSpeed = Math.max(
          this.moveSpeed - gameConfig.mechanics.speedIncrease,
          gameConfig.mechanics.minimumMoveSpeed
        );
      });
    }
  }

  createColumnClearEffect(x) {
    const effectGraphics = this.add.graphics();

    // Create white flash effect
    effectGraphics.fillStyle(0xffffff, 1);
    effectGraphics.fillRect(
      this.gridOffsetX + x * this.cellSize,
      this.gridOffsetY,
      this.cellSize,
      this.gridHeight * this.cellSize
    );

    // Create blinking animation
    let alpha = 1;
    const flashTimer = this.time.addEvent({
      delay: 50,
      callback: () => {
        alpha = alpha === 1 ? 0.3 : 1;
        effectGraphics.clear();
        effectGraphics.fillStyle(0xffffff, alpha);
        effectGraphics.fillRect(
          this.gridOffsetX + x * this.cellSize,
          this.gridOffsetY,
          this.cellSize,
          this.gridHeight * this.cellSize
        );
      },
      repeat: 5,
    });

    // Destroy effect after animation
    this.time.delayedCall(300, () => {
      effectGraphics.destroy();
    });
  }

  removeColumn(x) {
    // Remove the column
    for (let y = 0; y < this.gridHeight; y++) {
      this.grid.setCellValue(x, y, null);
    }

    // For pieces on the left of the cleared column, shift right
    for (let currentX = x - 1; currentX >= 0; currentX--) {
      for (let y = 0; y < this.gridHeight; y++) {
        const value = this.grid.getCellValue(currentX, y);
        this.grid.setCellValue(currentX + 1, y, value);
        this.grid.setCellValue(currentX, y, null);
      }
    }

    // For pieces on the right of the cleared column, shift left
    for (let currentX = x + 1; currentX < this.gridWidth; currentX++) {
      for (let y = 0; y < this.gridHeight; y++) {
        const value = this.grid.getCellValue(currentX, y);
        this.grid.setCellValue(currentX - 1, y, value);
        this.grid.setCellValue(currentX, y, null);
      }
    }
  }

  lockPiece(player) {
    const piece = this.currentPieces[player];
    if (!piece) return;

    piece.blocks.forEach(([blockX, blockY]) => {
      const gridX = piece.x + blockX;
      const gridY = piece.y + blockY;
      this.grid.setCellValue(gridX, gridY, gameConfig.getColor(piece.color));
    });

    // Mark piece as inactive
    piece.isActive = false;

    // Update score
    this.scores[player] += gameConfig.mechanics.pointsPerPiece;
    if (this.uiScene) {
      this.uiScene.updateScore(player, this.scores[player]);
    }
  }

  drawGameState() {
    const graphics = this.gridGraphics;
    graphics.clear();

    // Draw grid background
    graphics.lineStyle(
      gameConfig.playfield.gridBorderWidth,
      gameConfig.getColor(gameConfig.playfield.gridBorderColor)
    );
    graphics.strokeRect(
      this.gridOffsetX,
      this.gridOffsetY,
      this.gridWidth * this.cellSize,
      this.gridHeight * this.cellSize
    );

    // Draw grid lines
    if (gameConfig.debug.showGridLines) {
      graphics.lineStyle(
        gameConfig.playfield.gridLineWidth,
        gameConfig.getColor(gameConfig.playfield.gridLineColor)
      );

      // Vertical lines
      for (let x = 0; x <= this.gridWidth; x++) {
        graphics.beginPath();
        graphics.moveTo(this.gridOffsetX + x * this.cellSize, this.gridOffsetY);
        graphics.lineTo(
          this.gridOffsetX + x * this.cellSize,
          this.gridOffsetY + this.gridHeight * this.cellSize
        );
        graphics.strokePath();
      }

      // Horizontal lines
      for (let y = 0; y <= this.gridHeight; y++) {
        graphics.beginPath();
        graphics.moveTo(this.gridOffsetX, this.gridOffsetY + y * this.cellSize);
        graphics.lineTo(
          this.gridOffsetX + this.gridWidth * this.cellSize,
          this.gridOffsetY + y * this.cellSize
        );
        graphics.strokePath();
      }
    }

    // Draw locked pieces
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cellValue = this.grid.getCellValue(x, y);
        if (cellValue) {
          graphics.fillStyle(cellValue, 1);
          graphics.fillRect(
            this.gridOffsetX + x * this.cellSize,
            this.gridOffsetY + y * this.cellSize,
            this.cellSize - gameConfig.playfield.cellPadding,
            this.cellSize - gameConfig.playfield.cellPadding
          );
        }
      }
    }

    // Draw current pieces
    Object.values(this.currentPieces).forEach((piece) => {
      if (piece && piece.isActive) {
        piece.draw(graphics);
      }
    });
  }

  gameLoop() {
    if (!this.isPaused && !this.isGameOver) {
      // Clear any existing timer
      if (this.gameLoopTimer) {
        this.gameLoopTimer.remove();
      }

      // Create new timer
      this.gameLoopTimer = this.time.addEvent({
        delay: this.moveSpeed,
        callback: () => {
          ["player1", "player2"].forEach((player) => {
            const piece = this.currentPieces[player];
            if (piece && piece.isActive) {
              const canMove =
                player === "player1" ? piece.moveRight() : piece.moveLeft();

              if (!canMove) {
                this.lockPiece(player);
                this.checkLines();
                this.spawnNewPieces();
              }
            }
          });

          this.gameLoop(); // Schedule next iteration
        },
        callbackScope: this,
      });
    }
  }
}
