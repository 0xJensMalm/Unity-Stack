// src/config/gameConfig.js

// Helper function to convert hex string to number for Phaser
const hexToNumber = (hex) => parseInt(hex.replace("#", ""), 16);

const gameConfig = {
  // Core Phaser configuration
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  // Playfield configuration
  playfield: {
    // Grid dimensions (in cells)
    width: 30,
    height: 14,

    // Cell size in pixels
    cellSize: 32,

    // Grid line styling
    gridLineColor: "#333333",
    gridLineWidth: 1,
    gridBorderColor: "#444444",
    gridBorderWidth: 2,

    // Space between cells (can create gap effect)
    cellPadding: 1,
  },

  // Game mechanics
  mechanics: {
    // Speed configuration (in milliseconds)
    initialMoveSpeed: 1000,
    speedIncrease: 50, // How much to decrease interval after each piece
    minimumMoveSpeed: 200, // Fastest possible speed

    // Scoring
    pointsPerPiece: 100,
    pointsPerLine: 1000,
  },

  // Player configurations
  players: {
    player1: {
      color: "#3498db", // Blue
      controls: {
        up: "W",
        down: "S",
        toward: "D",
      },
      spawnSide: "left",
    },
    player2: {
      color: "#e74c3c", // Red
      controls: {
        up: "UP",
        down: "DOWN",
        toward: "LEFT",
      },
      spawnSide: "right",
    },
  },

  // Color themes
  colors: {
    // UI Colors
    background: "#000000",
    text: "#ffffff",
    scoreText: "#fffb38",

    // Game element colors
    grid: {
      lines: "#333333",
      border: "#444444",
      background: "#000000",
    },

    // Tetromino colors (if you want to keep traditional colors as reference)
    tetrominoes: {
      I: "#00f0f0",
      O: "#f0f000",
      T: "#a000f0",
      S: "#00f000",
      Z: "#f00000",
      J: "#0000f0",
      L: "#f0a000",
    },
  },

  // Debug options
  debug: {
    showGridLines: true,
    showCollisionBoxes: false,
    showFPS: false,
  },

  // Helper functions to get computed values
  getPlayfieldPixelWidth() {
    return this.playfield.width * this.playfield.cellSize;
  },

  getPlayfieldPixelHeight() {
    return this.playfield.height * this.playfield.cellSize;
  },

  getGridOffsetX() {
    return (this.width - this.getPlayfieldPixelWidth()) / 2;
  },

  getGridOffsetY() {
    return (this.height - this.getPlayfieldPixelHeight()) / 2;
  },

  // Helper function to get color as number (for Phaser)
  getColor(hexColor) {
    return hexToNumber(hexColor);
  },

  // Function to validate configuration
  validate() {
    // Check if playfield fits in canvas
    if (this.getPlayfieldPixelWidth() > this.width) {
      console.warn("Playfield width exceeds canvas width");
    }
    if (this.getPlayfieldPixelHeight() > this.height) {
      console.warn("Playfield height exceeds canvas height");
    }

    // Check for minimum playfield size
    if (this.playfield.width < 10 || this.playfield.height < 5) {
      console.warn("Playfield dimensions might be too small for gameplay");
    }
  },
};

// Validate configuration on load
gameConfig.validate();

export default gameConfig;
