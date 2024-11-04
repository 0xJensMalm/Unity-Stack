// src/scenes/UIScene.js
import gameConfig from "../config/gameConfig.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: "UIScene" });
    this.scores = {
      player1: 0,
      player2: 0,
    };
  }

  create() {
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
    const previewBg = this.add
      .rectangle(
        xCenter,
        currentY + previewSize / 2,
        previewSize,
        previewSize,
        0x333333
      )
      .setStrokeStyle(1, 0x666666);
    this[`${player}Preview`] = previewBg;
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
      .rectangle(xCenter, currentY + 35, width * 0.9, 70, 0x000000, 0.3)
      .setStrokeStyle(1, 0x333333);

    const controls = isPlayer1
      ? "W - Move Up\nS - Move Down\nD - Move Right"
      : "↑ - Move Up\n↓ - Move Down\n← - Move Left";

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

  updateScore(player, score) {
    const scoreText = this[`${player}Score`];
    if (scoreText) {
      scoreText.setText(score.toString());
    }
  }

  updateNextPiece(player, shape) {
    const preview = this[`${player}Preview`];
    if (preview) {
      // Update preview box color
      preview.setFillStyle(0x444444);

      // Later we'll add actual piece preview rendering here
      // This is a placeholder for now
    }
  }

  showGameOver(winningPlayer, scores) {
    // Create semi-transparent overlay
    const overlay = this.add
      .rectangle(0, 0, gameConfig.width, gameConfig.height, 0x000000, 0.7)
      .setOrigin(0, 0);

    const centerX = gameConfig.width / 2;
    const centerY = gameConfig.height / 2;

    // Create game over box
    this.add
      .rectangle(centerX, centerY, 400, 200, 0x000000, 0.9)
      .setStrokeStyle(2, 0x333333);

    // Game Over text
    this.add
      .text(centerX, centerY - 50, "GAME OVER", {
        fontSize: "32px",
        fontFamily: "monospace",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY, `${winningPlayer.toUpperCase()} WINS!`, {
        fontSize: "24px",
        fontFamily: "monospace",
        fill: gameConfig.players[winningPlayer].color,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 50, "Press SPACE to restart", {
        fontSize: "18px",
        fontFamily: "monospace",
        fill: "#888888",
      })
      .setOrigin(0.5);
  }

  showPauseMenu(isPaused) {
    if (!this.pauseOverlay) {
      // Create pause overlay
      this.pauseOverlay = this.add
        .rectangle(0, 0, gameConfig.width, gameConfig.height, 0x000000, 0.7)
        .setOrigin(0, 0)
        .setVisible(false);

      const centerX = gameConfig.width / 2;
      const centerY = gameConfig.height / 2;

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

    this.pauseOverlay.setVisible(isPaused);
    this.pauseBox.setVisible(isPaused);
    this.pauseText.setVisible(isPaused);
  }
}
