// src/config/gameConfig.js

// Helper function to convert hex string to number for Phaser
const hexToNumber = (hex) => parseInt(hex.replace("#", ""), 16);

const gameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#000000",

  // Playfield configuration
  playfield: {
    width: 30,
    height: 14,
    cellSize: 32,
    uiSideWidth: 0.2, // 20% of screen width for each side
    gridLineColor: "#333333",
    gridLineWidth: 1,
    gridBorderColor: "#444444",
    gridBorderWidth: 2,
    cellPadding: 1,
  },

  // Game mechanics
  mechanics: {
    initialMoveSpeed: 1000,
    speedIncrease: 50,
    minimumMoveSpeed: 200,
    pointsPerPiece: 100,
    pointsPerLine: 1000,
  },

  // Player configurations
  players: {
    player1: {
      color: "#3498db",
      controls: {
        up: "W",
        down: "S",
        toward: "D",
      },
      spawnSide: "left",
    },
    player2: {
      color: "#e74c3c",
      controls: {
        up: "UP",
        down: "DOWN",
        toward: "LEFT",
      },
      spawnSide: "right",
    },
  },

  // Debug options
  debug: {
    showGridLines: true,
    showCollisionBoxes: false,
    showFPS: false,
  },

  // Helper functions
  getPlayfieldPixelWidth() {
    return this.playfield.width * this.playfield.cellSize;
  },

  getPlayfieldPixelHeight() {
    return this.playfield.height * this.playfield.cellSize;
  },

  getUIWidth() {
    return Math.floor(this.width * this.playfield.uiSideWidth);
  },

  getGridOffsetX() {
    return (this.width - this.getPlayfieldPixelWidth()) / 2;
  },

  getGridOffsetY() {
    return (this.height - this.getPlayfieldPixelHeight()) / 2;
  },

  getColor(hexColor) {
    return hexToNumber(hexColor);
  },
};

export default gameConfig;
