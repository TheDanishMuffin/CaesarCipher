document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  let board = Array(9).fill(null);
  const playerX = 'X';
  const playerO = 'O';
  let currentPlayer = playerX;
  let playerXScore = 0;
  let playerOScore = 0;

  const playerXScoreElement = document.getElementById('playerX-score');
  const playerOScoreElement = document.getElementById('playerO-score');
  const resetButton = document.getElementById('reset-button');
  const undoButton = document.getElementById('undo-button');
  const statusMessage = document.getElementById('status-message');
  const historyContainer = document.getElementById('history-container');
  let moveHistory = [];

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);
  undoButton.addEventListener('click', undoMove);

  function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);
    if (!board[index] && currentPlayer === playerX) {
      makeMove(index, currentPlayer);
      if (!checkWinner() && !isBoardFull()) {
        switchPlayer();
        setTimeout(() => {
          makeBestMove();
          if (!checkWinner() && !isBoardFull()) {
            switchPlayer();
          }
        }, 500);
      }
    }
  }

  function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    moveHistory.push({ index, player });
    updateHistory();
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    updateStatusMessage();
  }

  function makeBestMove() {
    let bestMove = null;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = playerO;
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    makeMove(bestMove, playerO);
    if (!checkWinner() && !isBoardFull()) {
      switchPlayer();
    }
  }

  function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    const result = checkWinner(true);
    if (result !== null) return scores[result];
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
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = playerX;
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function checkWinner(returnResult = false) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (!returnResult) {
          highlightWinningCells(pattern);
          updateScore(board[a]);
          setTimeout(resetBoard, 2000);
        }
        return board[a];
      }
    }

    if (isBoardFull()) {
      if (!returnResult) {
        updateStatusMessage('Draw!');
        setTimeout(resetBoard, 2000);
      }
      return 'tie';
    }

    return null;
  }

  function isBoardFull() {
    return board.every(cell => cell !== null);
  }

  function highlightWinningCells(pattern) {
    pattern.forEach(index => cells[index].classList.add('highlight'));
  }

  function updateScore(winner) {
    if (winner === playerX) {
      playerXScore++;
      playerXScoreElement.textContent = playerXScore;
    } else if (winner === playerO) {
      playerOScore++;
      playerOScoreElement.textContent = playerOScore;
    }
  }

  function resetBoard() {
    board.fill(null);
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('highlight');
    });
    currentPlayer = playerX;
    moveHistory = [];
    updateHistory();
    updateStatusMessage();
  }

  function resetGame() {
    playerXScore = 0;
    playerOScore = 0;
    playerXScoreElement.textContent = playerXScore;
    playerOScoreElement.textContent = playerOScore;
    resetBoard();
  }

  function undoMove() {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory.pop();
      board[lastMove.index] = null;
      cells[lastMove.index].textContent = '';
      currentPlayer = lastMove.player === playerX ? playerO : playerX;
      updateHistory();
      updateStatusMessage();
    }
  }

  function updateStatusMessage(message = `Current Player: ${currentPlayer}`) {
    statusMessage.textContent = message;
  }

  function updateHistory() {
    historyContainer.innerHTML = moveHistory.map(move => `<li>${move.player} to ${move.index}</li>`).join('');
  }
});
