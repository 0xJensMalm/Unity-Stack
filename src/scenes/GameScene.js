// GameScene.js
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Preload assets if not done in BootScene
  }

  create() {
    // Initialize game elements here
    this.add.text(400, 300, 'Game Scene', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  }

  update(time, delta) {
    // Game loop logic here
  }
}