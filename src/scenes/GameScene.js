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
    this.nextPieces = {
      player1: this.getRandomShape(),
      player2: this.getRandomShape(),
    };
  }

  spawnNewPieces() {
    // For each player that needs a new piece
    ["player1", "player2"].forEach((player) => {
      if (!this.currentPieces[player] || !this.currentPieces[player].isActive) {
        // Use the next piece if available, otherwise get a random one
        const shape = this.nextPieces[player] || this.getRandomShape();
        this.currentPieces[player] = new Tetromino(this, shape, player);

        // Prepare next piece
        this.nextPieces[player] = this.getRandomShape();

        // Update UI with next piece
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

    // Optional: Stop the game loop or provide restart option
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
    let linesCleared = 0;

    // Check each line from bottom to top
    for (let y = this.gridHeight - 1; y >= 0; y--) {
      if (this.grid.isLineFull(y)) {
        // Remove the line and shift everything down
        this.removeLine(y);
        linesCleared++;
        // Since everything shifted down, we need to check this row again
        y++;
      }
    }

    // Award points for cleared lines
    if (linesCleared > 0) {
      const points = linesCleared * gameConfig.mechanics.pointsPerLine;
      // For now, award points to both players
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
    }
  }

  removeLine(y) {
    // Remove the line
    for (let x = 0; x < this.gridWidth; x++) {
      this.grid.setCellValue(x, y, null);
    }

    // Shift all lines above down
    for (let currentY = y - 1; currentY >= 0; currentY--) {
      for (let x = 0; x < this.gridWidth; x++) {
        const value = this.grid.getCellValue(x, currentY);
        this.grid.setCellValue(x, currentY + 1, value);
        this.grid.setCellValue(x, currentY, null);
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
