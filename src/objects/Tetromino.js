// src/objects/Tetromino.js
export default class Tetromino {
  constructor(scene, shape = "I", player = "player1") {
    this.scene = scene;
    this.shape = shape;
    this.player = player;
    this.color = this.getShapeColor(shape);
    this.blocks = this.getShapeBlocks(shape);

    // Set initial position based on player
    this.y = Math.floor(scene.gridHeight / 2) - 1; // Vertical center

    // Set horizontal position based on player
    if (player === "player1") {
      this.x = 0; // Left side
    } else {
      this.x = scene.gridWidth - this.getWidth(); // Right side
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

  isValidPosition() {
    return this.blocks.every(([blockX, blockY]) => {
      const newX = this.x + blockX;
      const newY = this.y + blockY;
      return (
        newX >= 0 &&
        newX < this.scene.gridWidth &&
        newY >= 0 &&
        newY < this.scene.gridHeight &&
        !this.scene.grid.getCellValue(newX, newY)
      );
    });
  }

  draw(graphics) {
    graphics.fillStyle(this.color, 1);
    this.blocks.forEach(([blockX, blockY]) => {
      graphics.fillRect(
        this.scene.gridOffsetX + (this.x + blockX) * this.scene.cellSize,
        this.scene.gridOffsetY + (this.y + blockY) * this.scene.cellSize,
        this.scene.cellSize - 1,
        this.scene.cellSize - 1
      );
    });
  }
}
