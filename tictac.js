document.addEventListener('DOMContentLoaded', function () {
  const cells = document.querySelectorAll('.cell');
  let playerX = 'X';
  let playerO = 'O';
  let currentPlayer = playerX;
  let board = Array(9).fill(null);
  let playerXScore = 0;
  let playerOScore = 0;
  let playerXMoves = 0;
  let playerOMoves = 0;
  let totalGames = 0;
  let draws = 0;
  let history = [];
  let redoStack = [];

  const playerXScoreElement = document.getElementById('playerX-score');
  const playerOScoreElement = document.getElementById('playerO-score');
  const totalGamesElement = document.getElementById('total-games');
  const drawsElement = document.getElementById('draws');
  const playerXMovesElement = document.getElementById('playerX-moves');
  const playerOMovesElement = document.getElementById('playerO-moves');
  const difficultySelector = document.getElementById('difficulty');
  const symbolSelectorX = document.getElementById('symbolX');
  const symbolSelectorO = document.getElementById('symbolO');
  const themeSelector = document.getElementById('theme');

  symbolSelectorX.addEventListener('change', updateSymbols);
  symbolSelectorO.addEventListener('change', updateSymbols);
  themeSelector.addEventListener('change', updateTheme);

  function updateSymbols() {
    playerX = symbolSelectorX.value || 'X';
    playerO = symbolSelectorO.value || 'O';
    resetGame();
  }

  function updateTheme() {
    const theme = themeSelector.value;
    document.body.className = theme;
  }

  document.getElementById('undo').addEventListener('click', undoMove);
  document.getElementById('redo').addEventListener('click', redoMove);

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const index = cell.getAttribute('data-index');
      if (!board[index] && currentPlayer === playerX) {
        makeMove(index, playerX);
        playerXMoves++;
        updateMoveCount();
        if (!checkWinner() && !board.every(cell => cell !== null)) {
          currentPlayer = playerO;
          setTimeout(() => {
            makeBestMove();
            playerOMoves++;
            updateMoveCount();
            if (!checkWinner()) {
              currentPlayer = playerX;
            }
          }, 500);
        }
      }
    });
  });

  function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    history.push([...board]);
    redoStack = [];
  }

  function undoMove() {
    if (history.length > 1) {
      redoStack.push(history.pop());
      board = history[history.length - 1];
      updateBoard();
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }
  }

  function redoMove() {
    if (redoStack.length > 0) {
      history.push(redoStack.pop());
      board = history[history.length - 1];
      updateBoard();
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }
  }

  function updateBoard() {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.style.backgroundColor = '';
    });
  }

  function makeBestMove() {
    const difficulty = difficultySelector.value;
    if (difficulty === 'easy') {
      makeRandomMove();
    } else if (difficulty === 'medium') {
      makeMediumMove();
    } else {
      makeMinimaxMove();
    }
  }

  function makeRandomMove() {
    let availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        availableMoves.push(i);
      }
    }
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomMove, playerO);
  }

  function makeMediumMove() {
    if (Math.random() < 0.5) {
      makeRandomMove();
    } else {
      let moveMade = false;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = playerO;
          if (checkWinner(true) === playerO) {
            makeMove(i, playerO);
            moveMade = true;
            break;
          }
          board[i] = null;
        }
      }
      if (!moveMade) {
        for (let i = 0; i < board.length; i++) {
          if (!board[i]) {
            board[i] = playerX;
            if (checkWinner(true) === playerX) {
              makeMove(i, playerO);
              moveMade = true;
              break;
            }
            board[i] = null;
          }
        }
      }
      if (!moveMade) {
        makeRandomMove();
      }
    }
  }

  function makeMinimaxMove() {
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
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        if (!returnResult) {
          highlightWinningCells(combination);
          setTimeout(() => {
            alert(`${board[a]} wins!`);
            updateScore(board[a]);
            resetGame();
          }, 1000);
        }
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      if (!returnResult) {
        setTimeout(() => {
          alert('Draw!');
          draws++;
          drawsElement.textContent = draws;
          resetGame();
        }, 1000);
      }
      return 'tie';
    }

    return null;
  }

  function highlightWinningCells(combination) {
    combination.forEach(index => {
      cells[index].style.backgroundColor = 'yellow';
    });
  }

  function updateScore(winner) {
    if (winner === playerX) {
      playerXScore++;
      playerXScoreElement.textContent = playerXScore;
    } else if (winner === playerO) {
      playerOScore++;
      playerOScoreElement.textContent = playerOScore;
    }
    totalGames++;
    totalGamesElement.textContent = totalGames;
  }

  function updateMoveCount() {
    playerXMovesElement.textContent = playerXMoves;
    playerOMovesElement.textContent = playerOMoves;
  }

  function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.backgroundColor = '';
    });
    currentPlayer = playerX;
    playerXMoves = 0;
    playerOMoves = 0;
    updateMoveCount();
    history = [];
    redoStack = [];
  }
});
