document.addEventListener('DOMContentLoaded', function() {
  const words = ['JAVASCRIPT', 'HTML', 'CSS', 'HANGMAN', 'GAME'];
  let selectedWord = '';
  let displayWord = '';
  let attempts = 6;
  const letters = document.querySelectorAll('#letters span');
  const wordDisplay = document.getElementById('wordDisplay');
  const message = document.getElementById('message');

  function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord = '_ '.repeat(selectedWord.length).trim();
    wordDisplay.textContent = displayWord;
    attempts = 6;
    message.textContent = '';
    letters.forEach(letter => {
      letter.classList.remove('clicked');
      letter.addEventListener('click', handleLetterClick);
    });
  }

  function handleLetterClick(event) {
    const letter = event.target.textContent;
    event.target.classList.add('clicked');
    event.target.removeEventListener('click', handleLetterClick);

    if (selectedWord.includes(letter)) {
      updateWordDisplay(letter);
    } else {
      attempts--;
      if (attempts === 0) {
        message.textContent = 'Game Over! The word was: ' + selectedWord;
        endGame();
      }
    }
  }

  function updateWordDisplay(letter) {
    let newDisplay = '';
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === letter) {
        newDisplay += letter + ' ';
      } else {
        newDisplay += displayWord[i * 2] + ' ';
      }
    }
    displayWord = newDisplay.trim();
    wordDisplay.textContent = displayWord;

    if (!displayWord.includes('_')) {
      message.textContent = 'Congratulations! You guessed the word! :))';
      endGame();
    }
  }

  function endGame() {
    letters.forEach(letter => {
      letter.removeEventListener('click', handleLetterClick);
    });
  }

  startGame();
});
