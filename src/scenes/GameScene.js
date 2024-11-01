// src/scenes/GameScene.js (updated)
import Grid from "../objects/Grid.js";
import Tetromino from "../objects/Tetromino.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.cellSize = 30;
    this.gridOffsetX = 200;
    this.gridOffsetY = 50;
    this.dropSpeed = 1000; // Time in ms between automatic drops
    this.lastDrop = 0;
  }

  create() {
    // Initialize the game grid
    this.grid = new Grid(10, 20);

    // Create graphics object for drawing
    this.gridGraphics = this.add.graphics();

    // Create initial tetromino
    this.currentPiece = new Tetromino(this);

    // Set up keyboard inputs
    this.cursors = this.input.keyboard.createCursorKeys();

    // Set up input handling
    this.setupInputs();
  }

  setupInputs() {
    this.input.keyboard.on("keydown-LEFT", () => {
      this.currentPiece.moveLeft();
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      this.currentPiece.moveRight();
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.currentPiece.moveDown();
    });
  }

  update(time) {
    // Handle automatic dropping
    if (time - this.lastDrop > this.dropSpeed) {
      if (!this.currentPiece.moveDown()) {
        // Piece can't move down further, lock it in place
        this.lockPiece();
        // Create new piece
        this.currentPiece = new Tetromino(this);
      }
      this.lastDrop = time;
    }

    // Redraw the game state
    this.drawGameState();
  }

  lockPiece() {
    // Lock the current piece into the grid
    this.currentPiece.blocks.forEach(([blockY, blockX]) => {
      const gridX = this.currentPiece.x + blockX;
      const gridY = this.currentPiece.y + blockY;
      this.grid.setCellValue(gridX, gridY, this.currentPiece.color);
    });
  }

  drawGameState() {
    this.gridGraphics.clear();

    // Draw grid and locked pieces
    this.drawGrid();

    // Draw current piece
    this.currentPiece.draw(this.gridGraphics);
  }

  drawGrid() {
    // (previous grid drawing code remains the same)
    this.gridGraphics.lineStyle(1, 0x333333, 1);

    // Draw vertical lines
    for (let x = 0; x <= this.grid.width; x++) {
      this.gridGraphics.beginPath();
      const startX = this.gridOffsetX + x * this.cellSize;
      this.gridGraphics.moveTo(startX, this.gridOffsetY);
      this.gridGraphics.lineTo(
        startX,
        this.gridOffsetY + this.grid.height * this.cellSize
      );
      this.gridGraphics.strokePath();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.grid.height; y++) {
      this.gridGraphics.beginPath();
      const startY = this.gridOffsetY + y * this.cellSize;
      this.gridGraphics.moveTo(this.gridOffsetX, startY);
      this.gridGraphics.lineTo(
        this.gridOffsetX + this.grid.width * this.cellSize,
        startY
      );
      this.gridGraphics.strokePath();
    }

    // Draw filled cells
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        const cellValue = this.grid.getCellValue(x, y);
        if (cellValue) {
          this.gridGraphics.fillStyle(cellValue, 1);
          this.gridGraphics.fillRect(
            this.gridOffsetX + x * this.cellSize,
            this.gridOffsetY + y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
          );
        }
      }
    }
  }
}
