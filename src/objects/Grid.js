// src/objects/Grid.js
export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = this.createGrid(width, height);
  }

  createGrid(width, height) {
    return Array(height)
      .fill(null)
      .map(() => Array(width).fill(null));
  }

  isWithinBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  setCellValue(x, y, value) {
    if (this.isWithinBounds(x, y)) {
      this.cells[y][x] = value;
      return true;
    }
    return false;
  }

  getCellValue(x, y) {
    if (this.isWithinBounds(x, y)) {
      return this.cells[y][x];
    }
    return null;
  }

  isColumnFull(x) {
    if (x >= 0 && x < this.width) {
      return this.cells.every((row) => row[x] !== null);
    }
    return false;
  }
}
