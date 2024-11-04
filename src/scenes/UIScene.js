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
    const uiWidth = gameConfig.getUIWidth();
    const gameWidth = gameConfig.getPlayfieldPixelWidth();
    const totalWidth = gameConfig.width;

    // Create UI containers
    // Left UI
    this.createUIContainer(0, 0, uiWidth);
    // Right UI
    this.createUIContainer(totalWidth - uiWidth, 0, uiWidth);

    // Create player UIs
    this.createPlayerUI("player1", uiWidth / 2);
    this.createPlayerUI("player2", totalWidth - uiWidth / 2);
  }

  createUIContainer(x, y, width) {
    const height = gameConfig.height;
    // Semi-transparent background for UI
    this.add
      .rectangle(x + width / 2, height / 2, width, height, 0x000000)
      .setAlpha(0.3);
  }

  createPlayerUI(player, xPosition) {
    const color = gameConfig.players[player].color;
    const isPlayer1 = player === "player1";
    const spacing = 50; // Fixed spacing

    // Player label
    this.add
      .text(xPosition, spacing * 2, isPlayer1 ? "PLAYER 1" : "PLAYER 2", {
        fontSize: "24px",
        fill: color,
        align: "center",
      })
      .setOrigin(0.5);

    // Score
    const scoreText = this.add
      .text(xPosition, spacing * 4, "SCORE: 0", {
        fontSize: "20px",
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);
    this[`${player}Score`] = scoreText;

    // Next piece section
    this.add
      .text(xPosition, spacing * 6, "NEXT PIECE", {
        fontSize: "16px",
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    // Next piece preview box
    const preview = this.add
      .rectangle(xPosition, spacing * 8, 100, 100, 0x333333)
      .setStrokeStyle(2, 0x666666);
    this[`${player}Preview`] = preview;

    // Controls section
    this.add
      .text(xPosition, spacing * 11, "CONTROLS", {
        fontSize: "16px",
        fill: "#FFFFFF",
        align: "center",
      })
      .setOrigin(0.5);

    const controls = isPlayer1
      ? "W - Up\nS - Down\nD - Forward"
      : "↑ - Up\n↓ - Down\n← - Forward";

    this.add
      .text(xPosition, spacing * 13, controls, {
        fontSize: "14px",
        fill: "#888888",
        align: "center",
      })
      .setOrigin(0.5);
  }

  updateScore(player, score) {
    const scoreText = this[`${player}Score`];
    if (scoreText) {
      scoreText.setText(`SCORE: ${score}`);
    }
  }

  updateNextPiece(player, shape) {
    // Implement next piece preview update logic here
  }

  showGameOver(winningPlayer, scores) {
    const centerX = gameConfig.width / 2;
    const centerY = gameConfig.height / 2;

    this.add.rectangle(centerX, centerY, 400, 200, 0x000000).setAlpha(0.8);

    this.add
      .text(centerX, centerY - 40, "GAME OVER", {
        fontSize: "32px",
        fill: "#FFFFFF",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY, `${winningPlayer.toUpperCase()} WINS!`, {
        fontSize: "24px",
        fill: gameConfig.players[winningPlayer].color,
      })
      .setOrigin(0.5);
  }

  showPauseMenu(isPaused) {
    if (!this.pauseText) {
      this.pauseText = this.add
        .text(gameConfig.width / 2, gameConfig.height / 2, "PAUSED", {
          fontSize: "32px",
          fill: "#FFFFFF",
        })
        .setOrigin(0.5)
        .setVisible(false);
    }

    this.pauseText.setVisible(isPaused);
  }
}
