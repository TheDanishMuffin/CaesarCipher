document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  let currentPlayer = 'X';
  let board = ['', '', '', '', '', '', '', '', ''];

  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const index = cell.getAttribute('data-index');
      if (board[index] === '') {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWinner(currentPlayer)) {
          alert(currentPlayer + ' wins!');
          resetBoard();
        } else if (board.every(cell => cell !== '')) {
          alert('It\'s a tie!');
          resetBoard();
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    });
  });

  function checkWinner(player) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
      return pattern.every(index => board[index] === player);
    });
  }

  function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
  }

  window.resetGame = resetBoard;
});
