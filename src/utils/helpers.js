// helpers.js
export function getRandomTetromino() {
  const tetrominoes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
}

// Add more helper functions as needed