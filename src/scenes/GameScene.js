// src/scenes/GameScene.js
import Grid from "../objects/Grid.js";
import Tetromino from "../objects/Tetromino.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.cellSize = 32; // Slightly larger cells
    this.gridWidth = 24; // Wider horizontal playing field
    this.gridHeight = 12; // Taller vertical height
    this.moveSpeed = 1000; // Time in ms between automatic moves
    this.lastMove = {
      player1: 0,
      player2: 0,
    };
  }

  create() {
    // Calculate grid position to center it
    this.gridOffsetX = (800 - this.gridWidth * this.cellSize) / 2;
    this.gridOffsetY = (600 - this.gridHeight * this.cellSize) / 2;

    // Initialize grid and graphics
    this.grid = new Grid(this.gridWidth, this.gridHeight);
    this.gridGraphics = this.add.graphics();

    // Create initial pieces for both players
    this.spawnNewPieces();

    // Setup controls
    this.setupControls();
  }

  spawnNewPieces() {
    this.currentPieces = {
      player1: new Tetromino(this, this.getRandomShape(), "player1"),
      player2: new Tetromino(this, this.getRandomShape(), "player2"),
    };
  }

  getRandomShape() {
    const shapes = ["I", "O", "T", "S", "Z", "J", "L"];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  setupControls() {
    // Player 1 controls (Left side)
    this.input.keyboard.on("keydown-W", () => {
      this.currentPieces.player1.moveUp();
    });
    this.input.keyboard.on("keydown-S", () => {
      this.currentPieces.player1.moveDown();
    });
    this.input.keyboard.on("keydown-D", () => {
      this.currentPieces.player1.moveRight();
    });

    // Player 2 controls (Right side)
    this.input.keyboard.on("keydown-UP", () => {
      this.currentPieces.player2.moveUp();
    });
    this.input.keyboard.on("keydown-DOWN", () => {
      this.currentPieces.player2.moveDown();
    });
    this.input.keyboard.on("keydown-LEFT", () => {
      this.currentPieces.player2.moveLeft();
    });
  }

  update(time) {
    // Handle automatic movement
    ["player1", "player2"].forEach((player) => {
      if (time - this.lastMove[player] > this.moveSpeed) {
        const piece = this.currentPieces[player];
        const canMove =
          player === "player1" ? piece.moveRight() : piece.moveLeft();

        if (!canMove) {
          // Lock piece and spawn new one
          this.lockPiece(player);
          this.currentPieces[player] = new Tetromino(
            this,
            this.getRandomShape(),
            player
          );
        }
        this.lastMove[player] = time;
      }
    });

    this.drawGameState();
  }

  lockPiece(player) {
    const piece = this.currentPieces[player];
    piece.blocks.forEach(([blockX, blockY]) => {
      const gridX = piece.x + blockX;
      const gridY = piece.y + blockY;
      this.grid.setCellValue(gridX, gridY, piece.color);
    });
  }

  drawGameState() {
    const graphics = this.gridGraphics;
    graphics.clear();

    // Draw grid background
    graphics.lineStyle(2, 0x444444);
    graphics.strokeRect(
      this.gridOffsetX,
      this.gridOffsetY,
      this.gridWidth * this.cellSize,
      this.gridHeight * this.cellSize
    );

    // Draw grid lines
    graphics.lineStyle(1, 0x333333);

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

    // Draw locked pieces
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const cellValue = this.grid.getCellValue(x, y);
        if (cellValue) {
          graphics.fillStyle(cellValue, 1);
          graphics.fillRect(
            this.gridOffsetX + x * this.cellSize,
            this.gridOffsetY + y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
          );
        }
      }
    }

    // Draw current pieces
    Object.values(this.currentPieces).forEach((piece) => {
      piece.draw(graphics);
    });
  }
}
