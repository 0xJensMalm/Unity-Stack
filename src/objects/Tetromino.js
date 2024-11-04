// src/objects/Tetromino.js

import gameConfig from "../config/gameConfig.js";

export default class Tetromino {
  constructor(scene, shape = "I", player = "player1") {
    this.scene = scene;
    this.shape = shape;
    this.player = player;
    this.color = gameConfig.players[player].color;
    this.blocks = this.getShapeBlocks(shape);
    this.isActive = true; // Add this line

    // Adjust initial position based on player config
    this.y = 0; // Start from the top

    if (gameConfig.players[player].spawnSide === "left") {
      this.x = 0;
    } else {
      this.x = scene.gridWidth - this.getWidth();
    }
  }

  getShapeColor(shape) {
    const colors = {
      I: 0x00f0f0, // Cyan
      O: 0xf0f000, // Yellow
      T: 0xa000f0, // Purple
      S: 0x00f000, // Green
      Z: 0xf00000, // Red
      J: 0x0000f0, // Blue
      L: 0xf0a000, // Orange
    };
    return colors[shape] || 0xffffff;
  }

  getShapeBlocks(shape) {
    // Horizontal-oriented shapes
    const shapes = {
      I: [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      O: [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
      T: [
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ],
      S: [
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
      ],
      Z: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      J: [
        [0, 1],
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      L: [
        [2, 1],
        [0, 0],
        [1, 0],
        [2, 0],
      ],
    };
    return shapes[shape] || shapes["I"];
  }

  getWidth() {
    return Math.max(...this.blocks.map(([x]) => x)) + 1;
  }

  moveUp() {
    this.y--;
    if (!this.isValidPosition()) {
      this.y++;
    }
  }

  moveDown() {
    this.y++;
    if (!this.isValidPosition()) {
      this.y--;
    }
  }

  moveLeft() {
    this.x--;
    if (!this.isValidPosition()) {
      this.x++;
      return false;
    }
    return true;
  }

  moveRight() {
    this.x++;
    if (!this.isValidPosition()) {
      this.x--;
      return false;
    }
    return true;
  }

  // Add this method to the Tetromino class

  rotate() {
    // Store original blocks in case rotation is invalid
    const originalBlocks = [...this.blocks];

    // Perform rotation for each block
    this.blocks = this.blocks.map(([x, y]) => {
      // Rotate 90 degrees clockwise around (0,0)
      return [-y, x];
    });

    // If rotation puts piece in invalid position, revert
    if (!this.isValidPosition()) {
      this.blocks = originalBlocks;
      return false;
    }
    return true;
  }

  isValidPosition() {
    return this.blocks.every(([blockX, blockY]) => {
      const newX = this.x + blockX;
      const newY = this.y + blockY;

      // Check boundaries
      if (
        newX < 0 ||
        newX >= this.scene.gridWidth ||
        newY < 0 ||
        newY >= this.scene.gridHeight
      ) {
        return false;
      }

      // Check collision with locked pieces
      if (this.scene.grid.getCellValue(newX, newY)) {
        return false;
      }

      // Check collision with other player's current piece
      const otherPlayer = this.player === "player1" ? "player2" : "player1";
      const otherPiece = this.scene.currentPieces[otherPlayer];

      if (otherPiece) {
        const collisionWithOther = otherPiece.blocks.some(
          ([otherX, otherY]) =>
            otherPiece.x + otherX === newX && otherPiece.y + otherY === newY
        );
        if (collisionWithOther) {
          return false;
        }
      }

      return true;
    });
  }

  draw(graphics) {
    // Convert hex color to number when drawing
    graphics.fillStyle(gameConfig.getColor(this.color), 1);
    this.blocks.forEach(([blockX, blockY]) => {
      graphics.fillRect(
        this.scene.gridOffsetX + (this.x + blockX) * this.scene.cellSize,
        this.scene.gridOffsetY + (this.y + blockY) * this.scene.cellSize,
        this.scene.cellSize - 1,
        this.scene.cellSize - 1
      );
    });
  }

  // Update the drawPreview method in Tetromino class

  drawPreview(graphics, previewBox) {
    // Get preview box dimensions and position
    const boxWidth = previewBox.width;
    const boxHeight = previewBox.height;
    const cellSize = Math.min(boxWidth, boxHeight) / 4;

    // Get piece dimensions for centering
    const pieceWidth = Math.max(...this.blocks.map(([x]) => x)) + 1;
    const pieceHeight = Math.max(...this.blocks.map(([_, y]) => y)) + 1;

    // Calculate center position of the preview box
    const boxCenterX = previewBox.background.x;
    const boxCenterY = previewBox.background.y;

    // Calculate starting position to center the piece
    const startX = boxCenterX - (pieceWidth * cellSize) / 2;
    const startY = boxCenterY - (pieceHeight * cellSize) / 2;

    // Draw the piece
    graphics.fillStyle(gameConfig.getColor(this.color), 1);
    this.blocks.forEach(([blockX, blockY]) => {
      const x = startX + blockX * cellSize;
      const y = startY + blockY * cellSize;

      graphics.fillRect(
        x,
        y,
        cellSize - 2, // Subtract 2 for spacing
        cellSize - 2 // Subtract 2 for spacing
      );
    });
  }
}
