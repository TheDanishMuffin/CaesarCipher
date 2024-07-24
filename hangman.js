let words = ["javascript", "hangman", "css", "html", "developer"];
let chosenWord;
let displayWord;
let attemptsLeft;
let guessedLetters;

function startGame() {
  chosenWord = words[Math.floor(Math.random() * words.length)];
  displayWord = "_ ".repeat(chosenWord.length).trim();
  attemptsLeft = 6;
  guessedLetters = [];

  document.getElementById('wordContainer').textContent = displayWord;
  createLetterButtons();
}

function createLetterButtons() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letterButtonsContainer = document.getElementById('letterButtons');
  letterButtonsContainer.innerHTML = '';

  alphabet.split('').forEach(letter => {
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => guessLetter(letter.toLowerCase()));
    letterButtonsContainer.appendChild(button);
  });
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);
  let newDisplayWord = '';
  let correctGuess = false;

  for (let i = 0; i < chosenWord.length; i++) {
    if (chosenWord[i] === letter) {
      newDisplayWord += letter + ' ';
      correctGuess = true;
    } else {
      newDisplayWord += displayWord[i * 2] + ' ';
    }
  }

  displayWord = newDisplayWord.trim();
  document.getElementById('wordContainer').textContent = displayWord;

  if (!correctGuess) {
    attemptsLeft--;
    if (attemptsLeft === 0) {
      alert(`Game over! The word was: ${chosenWord}`);
      startGame();
    }
  } else if (!displayWord.includes('_')) {
    alert('Congratulations! You guessed the word!');
    startGame();
  }
}

document.addEventListener('DOMContentLoaded', startGame);
