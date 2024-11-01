// src/objects/Tetromino.js
export default class Tetromino {
  constructor(scene, shape = "I") {
    this.scene = scene;
    this.shape = shape;
    this.color = this.getShapeColor(shape);
    this.blocks = this.getShapeBlocks(shape);
    this.x = Math.floor(scene.grid.width / 2) - 1;
    this.y = 0;
  }

  getShapeColor(shape) {
    const colors = {
      I: 0x00f0f0,
      O: 0xf0f000,
      T: 0xa000f0,
      S: 0x00f000,
      Z: 0xf00000,
      J: 0x0000f0,
      L: 0xf0a000,
    };
    return colors[shape] || 0xffffff;
  }

  getShapeBlocks(shape) {
    // Define basic shape patterns
    const shapes = {
      I: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      O: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
      T: [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      S: [
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
      ],
      Z: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
      J: [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      L: [
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    };
    return shapes[shape] || shapes["I"];
  }

  moveLeft() {
    this.x--;
    if (!this.isValidPosition()) {
      this.x++;
    }
  }

  moveRight() {
    this.x++;
    if (!this.isValidPosition()) {
      this.x--;
    }
  }

  moveDown() {
    this.y++;
    if (!this.isValidPosition()) {
      this.y--;
      return false; // Indicates piece can't move down further
    }
    return true;
  }

  isValidPosition() {
    return this.blocks.every(([blockY, blockX]) => {
      const newX = this.x + blockX;
      const newY = this.y + blockY;
      return (
        this.scene.grid.isWithinBounds(newX, newY) &&
        !this.scene.grid.getCellValue(newX, newY)
      );
    });
  }

  draw(graphics) {
    graphics.fillStyle(this.color, 1);
    this.blocks.forEach(([blockY, blockX]) => {
      graphics.fillRect(
        this.scene.gridOffsetX + (this.x + blockX) * this.scene.cellSize,
        this.scene.gridOffsetY + (this.y + blockY) * this.scene.cellSize,
        this.scene.cellSize - 1,
        this.scene.cellSize - 1
      );
    });
  }
}
