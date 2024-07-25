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

function updateDisplayWord(letter) {
  let newDisplayWord = '';
  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] === letter) {
      newDisplayWord += letter + ' ';
    } else {
      newDisplayWord += displayWord[i * 2] + ' ';
    }
  }
  displayWord = newDisplayWord;
  document.getElementById('wordContainer').textContent = displayWord;
}


function updateLettersUsedDisplay() {
  document.getElementById('lettersUsed').textContent = lettersUsed.join(', ');
}

function resetGameState() {
  guessesLeft = currentDifficulty === 'easy' ? 6 : currentDifficulty === 'medium' ? 4 : 3;
  lettersUsed = [];
  displayWord = '';
  timeLeft = 60;
  clearInterval(timer);
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timeLeft').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! The word was: ${currentWord}`);
      losses++;
      updateGameStats();
      startGame();
    }
  }, 1000);
}

function updateGameStats() {
  document.getElementById('wins').textContent = wins;
  document.getElementById('losses').textContent = losses;
  highScore = Math.max(highScore, wins);
  document.getElementById('highScore').textContent = highScore;
}

function setDifficulty() {
  currentDifficulty = document.getElementById('difficulty').value;
  startGame();
}

function setCategory() {
  currentCategory = document.getElementById('category').value;
  startGame();
}

window.onload = () => {
  document.getElementById('playerName').focus();
  createLetterButtons();
}

function createLetterButtons() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letterButtonsDiv = document.getElementById('letterButtons');
  letterButtonsDiv.innerHTML = '';

  for (let letter of letters) {
    const button = document.createElement('button');
    button.textContent = letter;
    button.onclick = () => handleLetterClick(letter);
    letterButtonsDiv.appendChild(button);
  }
}
