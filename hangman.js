let currentWord = '';
let guessesLeft = 6;
let lettersUsed = [];
let displayWord = '';
let wins = 0;
let losses = 0;
let highScore = 0;
let timer = null;
let timeLeft = 60;
const words = {
  programming: ['JAVASCRIPT', 'PYTHON', 'JAVA', 'HTML', 'CSS'],
  animals: ['ELEPHANT', 'GIRAFFE', 'CROCODILE', 'KANGAROO', 'PANDA'],
  countries: ['CANADA', 'AUSTRALIA', 'GERMANY', 'BRAZIL', 'INDIA']
};
let currentCategory = 'programming';
let currentDifficulty = 'easy';

function startGame() {
  resetGameState();

  const wordList = words[currentCategory];
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];

  displayWord = '_ '.repeat(currentWord.length);
  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = guessesLeft;
  document.getElementById('lettersUsed').textContent = 'None';
  document.getElementById('timeLeft').textContent = timeLeft;

  startTimer();
}


function handleLetterClick(letter) {
  if (lettersUsed.includes(letter)) {
    alert('You have already used that letter bruh.');
    return;
  }

  lettersUsed.push(letter);
  updateLettersUsedDisplay();

  if (currentWord.includes(letter)) {
    updateDisplayWord(letter);
    if (!displayWord.includes('_')) {
      alert('You won!');
      wins++;
      updateGameStats();
      startGame();
    }
  } else {
    guessesLeft--;
    document.getElementById('guessesLeft').textContent = guessesLeft;
    if (guessesLeft === 0) {
      alert(`You lost! The word was: ${currentWord}`);
      losses++;
      updateGameStats();
      startGame();
    }
  }
}

function createProfile() {
  const playerName = document.getElementById('playerName').value;
  if (playerName) {
    document.getElementById('currentPlayer').textContent = playerName;
    document.getElementById('profileContainer').style.display = 'none';
    document.getElementById('playerInfo').style.display = 'block';
    startGame();
  } else {
    alert('Please enter your name.');
  }
}

function useHint() {
  alert('Hint feature not implemented yet.');
}

