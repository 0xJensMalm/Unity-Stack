// src/main.js
import Phaser from "phaser";
import gameConfig from "./config/gameConfig.js";
import BootScene from "./scenes/BootScene.js";
import GameScene from "./scenes/GameScene.js";
import UIScene from "./scenes/UIScene.js";

const config = {
  ...gameConfig,
  scene: [BootScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);
