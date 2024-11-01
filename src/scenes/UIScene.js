// UIScene.js
export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    // Initialize UI elements here
    this.add.text(400, 50, 'UI Scene', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  }

  update() {
    // Update UI elements here
  }
}