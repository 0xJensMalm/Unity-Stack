// BootScene.js
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load assets here
    // Example:
    // this.load.image('I', 'assets/images/tetrominoes/I.png');
  }

  create() {
    this.scene.start('GameScene');
  }
}