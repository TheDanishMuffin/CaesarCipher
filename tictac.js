document.addEventListener('DOMContentLoaded', function () {
  const cells = document.querySelectorAll('.cell');
  const playerX = 'X';
  const playerO = 'O';
  let currentPlayer = playerX;
  let board = Array(9).fill(null);
  let playerXScore = 0;
  let playerOScore = 0;

  const playerXScoreElement = document.getElementById('playerX-score');
  const playerOScoreElement = document.getElementById('playerO-score');

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const index = cell.getAttribute('data-index');
      if (!board[index] && currentPlayer === playerX) {
        makeMove(index, playerX);
        if (!checkWinner() && !board.every(cell => cell !== null)) {
          currentPlayer = playerO;
          makeBestMove();
          checkWinner();
          currentPlayer = playerX;
        }
      }
    });
  });

  function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
  }

  function makeBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = playerO;
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    makeMove(move, playerO);
  }

  function minimax(board, depth, isMaximizing) {
    const scores = {
      X: -1,
      O: 1,
      tie: 0
    };
    let result = checkWinner(true);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = playerO;
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
