// src/scenes/UIScene.js
import gameConfig from "../config/gameConfig.js";
import Tetromino from "../objects/Tetromino.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
    this.scores = {
      player1: 0,
      player2: 0,
    };
    this.nextPieces = {
      player1: null,
      player2: null,
    };
    this.previewGraphics = null;
    this.pauseOverlay = null;
    this.pauseBox = null;
    this.pauseText = null;
  }

  create() {
    // Initialize graphics object for previews
    this.previewGraphics = this.add.graphics();

    // Get grid dimensions and position
    const gridStartX = gameConfig.getGridOffsetX();
    const gridEndX = gridStartX + gameConfig.getPlayfieldPixelWidth();

    // Calculate UI widths and positions
    const uiWidth = gridStartX * 0.9; // Slightly smaller than available space
    const leftX = gridStartX / 2; // Center of left panel
    const rightX = gridEndX + gridStartX / 2; // Center of right panel

    // Create UI containers with backgrounds
    this.createUIPanel(leftX - uiWidth / 2, 0, uiWidth, "player1");
    this.createUIPanel(rightX - uiWidth / 2, 0, uiWidth, "player2");

    // Initialize pause menu elements (hidden by default)
    this.createPauseMenu();
  }

  createUIPanel(x, y, width, player) {
    const height = gameConfig.height;
    const isPlayer1 = player === "player1";
    const xCenter = x + width / 2;

    // Panel background
    this.add
      .rectangle(xCenter, height / 2, width - 10, height - 20, 0x000000)
      .setAlpha(0.3)
      .setStrokeStyle(1, 0x333333);

    // Calculate vertical spacing
    const topMargin = 30;
    const sectionSpacing = 20;
    let currentY = topMargin;

    // Player Title
    this.add
      .text(xCenter, currentY, isPlayer1 ? "PLAYER 1" : "PLAYER 2", {
        fontSize: "20px",
        fontFamily: "monospace",
        fill: gameConfig.players[player].color,
      })
      .setOrigin(0.5);
    currentY += 40;

    // Score Section
    this.add
      .text(xCenter, currentY, "SCORE", {
        fontSize: "16px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);
    currentY += 25;

    this[`${player}Score`] = this.add
      .text(xCenter, currentY, "0", {
        fontSize: "24px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);
    currentY += 45;

    // Next Piece Section
    this.add
      .text(xCenter, currentY, "NEXT PIECE", {
        fontSize: "16px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);
    currentY += 30;

    // Next piece preview box
    const previewSize = Math.min(width * 0.6, 80);
    const previewX = xCenter;
    const previewY = currentY + previewSize / 2;

    // Create background for preview
    const previewBg = this.add
      .rectangle(previewX, previewY, previewSize, previewSize, 0x222222)
      .setStrokeStyle(1, 0x444444);

    // Store preview information
    this[`${player}Preview`] = {
      background: previewBg,
      width: previewSize,
      height: previewSize,
    };

    currentY += previewSize + sectionSpacing;

    // Controls Section
    this.add
      .text(xCenter, currentY, "CONTROLS", {
        fontSize: "16px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);
    currentY += 25;

    // Controls background
    const controlsBg = this.add
      .rectangle(xCenter, currentY + 45, width * 0.9, 90, 0x000000, 0.3)
      .setStrokeStyle(1, 0x333333);

    const controls = isPlayer1
      ? "W - Move Up\nS - Move Down\nD - Move Right\nE - Rotate"
      : "↑ - Move Up\n↓ - Move Down\n← - Move Left\nSPACE - Rotate";

    this.add
      .text(xCenter, currentY + 35, controls, {
        fontSize: "14px",
        fontFamily: "monospace",
        fill: "#888888",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);
  }

  createPauseMenu() {
    const centerX = gameConfig.width / 2;
    const centerY = gameConfig.height / 2;

    // Create pause overlay
    this.pauseOverlay = this.add
      .rectangle(0, 0, gameConfig.width, gameConfig.height, 0x000000, 0.7)
      .setOrigin(0, 0)
      .setVisible(false);

    // Create pause box
    this.pauseBox = this.add
      .rectangle(centerX, centerY, 200, 100, 0x000000, 0.9)
      .setStrokeStyle(2, 0x333333)
      .setVisible(false);

    // Create pause text
    this.pauseText = this.add
      .text(centerX, centerY, "PAUSED", {
        fontSize: "32px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  updateScore(player, score) {
    const scoreText = this[`${player}Score`];
    if (scoreText) {
      scoreText.setText(score.toString());
    }
  }

  updateNextPiece(player, shape) {
    console.log(`Updating next piece for ${player} with shape ${shape}`); // Debug line

    const preview = this[`${player}Preview`];
    if (!preview) {
      console.log(`No preview found for ${player}`); // Debug line
      return;
    }

    // Store the shape for this player
    this.nextPieces[player] = shape;

    // Clear previous preview graphics
    if (!this.previewGraphics) {
      this.previewGraphics = this.add.graphics();
    }
    this.previewGraphics.clear();

    // Redraw all current previews
    Object.entries(this.nextPieces).forEach(([plyr, pieceShape]) => {
      if (pieceShape && this[`${plyr}Preview`]) {
        console.log(`Drawing preview for ${plyr}: ${pieceShape}`); // Debug line
        const previewPiece = new Tetromino(this, pieceShape, plyr);
        previewPiece.drawPreview(this.previewGraphics, this[`${plyr}Preview`]);
      }
    });
  }

  showGameOver(winningPlayer, scores) {
    // Create semi-transparent overlay
    const overlay = this.add
      .rectangle(0, 0, gameConfig.width, gameConfig.height, 0x000000, 0.7)
      .setOrigin(0, 0);

    const centerX = gameConfig.width / 2;
    const centerY = gameConfig.height / 2;

    // Create game over box
    const gameOverBox = this.add
      .rectangle(centerX, centerY, 400, 300, 0x000000, 0.9)
      .setStrokeStyle(2, 0x333333);

    // Game Over text
    this.add
      .text(centerX, centerY - 80, "GAME OVER", {
        fontSize: "32px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    // Winner announcement
    this.add
      .text(centerX, centerY - 20, `${winningPlayer.toUpperCase()} WINS!`, {
        fontSize: "24px",
        fontFamily: "monospace",
        fill: gameConfig.players[winningPlayer].color,
      })
      .setOrigin(0.5);

    // Final scores
    this.add
      .text(
        centerX,
        centerY + 30,
        `Player 1: ${scores.player1}\nPlayer 2: ${scores.player2}`,
        {
          fontSize: "18px",
          fontFamily: "monospace",
          fill: "#FFFFFF",
          align: "center",
        }
      )
      .setOrigin(0.5);

    // Restart instruction
    this.add
      .text(centerX, centerY + 80, "Press SPACE to restart", {
        fontSize: "16px",
        fontFamily: "monospace",
        fill: "#888888",
      })
      .setOrigin(0.5);

    // Add keyboard listener for restart
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
      this.scene.start("UIScene");
    });
  }

  showPauseMenu(isPaused) {
    if (this.pauseOverlay && this.pauseBox && this.pauseText) {
      this.pauseOverlay.setVisible(isPaused);
      this.pauseBox.setVisible(isPaused);
      this.pauseText.setVisible(isPaused);
    }
  }

  update() {
    // Add any necessary update logic here
  }
}
