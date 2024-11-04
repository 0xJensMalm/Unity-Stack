// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Add a loading text
    const loadingText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "Loading...",
      {
        fontSize: "32px",
        fill: "#fff",
      }
    );
    loadingText.setOrigin(0.5);
  }

  create() {
    console.log("Boot Scene Created");
    this.scene.start("GameScene");
    this.scene.start("UIScene");
  }
}
