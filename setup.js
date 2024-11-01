// setup.js
const fs = require("fs");
const path = require("path");

// Helper function to create directories recursively
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper function to create files with optional content
function createFile(filePath, content = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
}

// Define the project structure
const projectStructure = {
  public: {
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Player Tetris</title>
  <link rel="stylesheet" href="styles.css">
  <!-- Phaser 3 via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head>
<body>
  <script src="../src/main.js"></script>
</body>
</html>`,
    "styles.css": `/* Basic styles for Two-Player Tetris */
body {
  margin: 0;
  padding: 0;
  background-color: #000;
}`,
    assets: {
      images: {
        tetrominoes: {
          // Placeholder for tetromino images
          "I.png": "",
          "O.png": "",
          "T.png": "",
          "S.png": "",
          "Z.png": "",
          "J.png": "",
          "L.png": "",
        },
        backgrounds: {
          // Placeholder for background images
        },
      },
      sounds: {
        // Placeholder for sound files (if added later)
      },
    },
  },
  src: {
    "main.js": `// main.js
import Phaser from 'phaser';
import gameConfig from './config/gameConfig.js';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  ...gameConfig,
  scene: [BootScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);`,
    config: {
      "gameConfig.js": `// gameConfig.js
export default {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};`,
    },
    scenes: {
      "BootScene.js": `// BootScene.js
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
}`,
      "GameScene.js": `// GameScene.js
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
}`,
      "UIScene.js": `// UIScene.js
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
}`,
    },
    objects: {
      "Tetromino.js": `// Tetromino.js
export default class Tetromino extends Phaser.GameObjects.Container {
  constructor(player, scene) {
    super(scene);
    this.player = player;
    this.scene = scene;
    // Initialize tetromino properties
  }

  // Define movement and rotation methods here
}`,
      "Grid.js": `// Grid.js
export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = this.createGrid(width, height);
  }

  createGrid(width, height) {
    const grid = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(null);
      }
      grid.push(row);
    }
    return grid;
  }

  // Define grid management methods here
}`,
    },
    utils: {
      "helpers.js": `// helpers.js
export function getRandomTetromino() {
  const tetrominoes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

// Add more helper functions as needed`,
    },
    styles: {
      "gameStyles.css": `/* gameStyles.css */
/* Add game-specific styles here */`,
    },
  },
  // Root level files
  "package.json": `{
  "name": "two-player-tetris",
  "version": "1.0.0",
  "description": "A two-player Tetris game built with Phaser 3.",
  "main": "src/main.js",
  "scripts": {
    "start": "webpack serve --open",
    "build": "webpack"
  },
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "babel-loader": "^8.2.5",
    "webpack": "^5.75.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  },
  "dependencies": {
    "phaser": "^3.55.2"
  }
}`,
  "webpack.config.js": `// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};`,
  "README.md": `# Two-Player Tetris

A two-player Tetris game built with Phaser 3.

## Project Structure

- \`public/\`: Contains the main HTML file, styles, and assets.
- \`src/\`: Contains the source JavaScript files, including game configuration, scenes, objects, and utilities.
- \`package.json\`: Project metadata and dependencies.
- \`webpack.config.js\`: Configuration for Webpack bundling.

## Getting Started

1. **Install Dependencies:**

   \`\`\`bash
   npm install
   \`\`\`

2. **Run the Development Server:**

   \`\`\`bash
   npm start
   \`\`\`

   This will start a local development server and open the game in your default browser.

3. **Build for Production:**

   \`\`\`bash
   npm run build
   \`\`\`

   This will bundle your game for production in the \`public/\` directory.

## License

[MIT](LICENSE)
`,
};

// Function to recursively create directories and files
function createProject(structure, basePath) {
  for (const name in structure) {
    const value = structure[name];
    const currentPath = path.join(basePath, name);

    if (typeof value === "object" && !Array.isArray(value)) {
      // It's a directory
      createDir(currentPath);
      createProject(value, currentPath);
    } else {
      // It's a file
      createFile(currentPath, value);
    }
  }
}

// Start creating the project structure from the current directory
createProject(projectStructure, __dirname);

console.log("Project setup complete!");
