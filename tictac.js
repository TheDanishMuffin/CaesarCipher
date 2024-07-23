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
  const difficultySelector = document.getElementById('difficulty');

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const index = cell.getAttribute('data-index');
      if (!board[index] && currentPlayer === playerX) {
        makeMove(index, playerX);
        if (!checkWinner() && !board.every(cell => cell !== null)) {
          currentPlayer = playerO;
          setTimeout(() => {
            makeBestMove();
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
  }

  function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.backgroundColor = '';
    });
    currentPlayer = playerX;
  }
});
