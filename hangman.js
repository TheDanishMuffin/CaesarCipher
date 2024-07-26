let currentWord = '';
let guessesLeft = 6;
let lettersUsed = [];
let displayWord = '';
let wins = 0;
let losses = 0;
let highScore = 0;
let timer = null;
let timeLeft = 60;
let isPaused = false;
let isMultiplayer = false;
let currentPlayerIndex = 0;
let players = [];
let usedHints = 0;

const words = {
  programming: ['JAVASCRIPT', 'PYTHON', 'JAVA', 'HTML', 'CSS'],
  animals: ['ELEPHANT', 'GIRAFFE', 'CROCODILE', 'KANGAROO', 'PANDA'],
  countries: ['CANADA', 'AUSTRALIA', 'GERMANY', 'BRAZIL', 'INDIA']
};

const hints = {
  programming: ['A popular language for web development', 'A snake or a programming language', 'A coffee or a programming language', 'Markup language', 'Stylesheet language'],
  animals: ['Largest land animal', 'Tallest animal', 'Has a strong bite', 'Australian jumper', 'Eats bamboo'],
  countries: ['Maple syrup country', 'Land of kangaroos', 'Land of beer', 'Carnival country', 'Country of spices']
};

let currentCategory = 'programming';
let currentDifficulty = 'easy';

function startGame() {
  resetGameState();
  setRandomWord();
  updateDisplayElements();
  startTimer();
  createLetterButtons();
  updateHangmanVisual();
}

function setRandomWord() {
  const wordList = words[currentCategory];
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  displayWord = '_ '.repeat(currentWord.length);
}

function updateDisplayElements() {
  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = guessesLeft;
  document.getElementById('lettersUsed').textContent = 'None';
  document.getElementById('timeLeft').textContent = timeLeft;
  document.getElementById('usedHints').textContent = usedHints;
}

function handleLetterClick(letter) {
  if (lettersUsed.includes(letter)) {
    alert('You have already used that letter.');
    return;
  }

  lettersUsed.push(letter);
  updateLettersUsedDisplay();

  if (currentWord.includes(letter)) {
    updateDisplayWord(letter);
    playSound('correct');
    if (!displayWord.includes('_')) {
      alert('You won!');
      wins++;
      updateGameStats();
      updateLeaderboard();
      startGame();
    }
  } else {
    guessesLeft--;
    playSound('incorrect');
    document.getElementById('guessesLeft').textContent = guessesLeft;
    updateHangmanVisual();
    if (guessesLeft <= 0) {
      playSound('loss');
      alert(`You lost! The word was: ${currentWord}`);
      losses++;
      updateGameStats();
      startGame();
    }
  }

  if (isMultiplayer) {
    switchPlayer();
  }
}

function switchPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  document.getElementById('currentPlayer').textContent = players[currentPlayerIndex];
}

function createProfile() {
  const playerName = document.getElementById('playerName').value;
  if (playerName) {
    players.push(playerName);
    document.getElementById('currentPlayer').textContent = playerName;
    document.getElementById('profileContainer').style.display = 'none';
    document.getElementById('playerInfo').style.display = 'block';
    startGame();
  } else {
    alert('Please enter your name.');
  }
}

function useHint() {
  if (usedHints < 3) {
    const hintIndex = words[currentCategory].indexOf(currentWord);
    alert(`Hint: ${hints[currentCategory][hintIndex]}`);
    usedHints++;
    document.getElementById('usedHints').textContent = usedHints;
  } else {
    alert('No more hints available!');
  }
}

function updateDisplayWord(letter) {
  let newDisplayWord = '';
  for (let i = 0; i < currentWord.length; i++) {
    newDisplayWord += (currentWord[i] === letter ? letter : displayWord[i * 2]) + ' ';
  }
  displayWord = newDisplayWord;
  document.getElementById('wordContainer').textContent = displayWord;
}

function updateLettersUsedDisplay() {
  document.getElementById('lettersUsed').textContent = lettersUsed.join(', ');
}

function resetGameState() {
  guessesLeft = getGuessesLeftByDifficulty();
  lettersUsed = [];
  displayWord = '';
  timeLeft = 60;
  usedHints = 0;
  clearInterval(timer);
  isPaused = false;
  document.getElementById('pauseButton').textContent = 'Pause';
}

function getGuessesLeftByDifficulty() {
  return currentDifficulty === 'easy' ? 6 : currentDifficulty === 'medium' ? 4 : 3;
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      document.getElementById('timeLeft').textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        alert(`Time's up! The word was: ${currentWord}`);
        losses++;
        updateGameStats();
        startGame();
      }
    }
  }, 1000);
}

function updateGameStats() {
  document.getElementById('wins').textContent = wins;
  document.getElementById('losses').textContent = losses;
  highScore = Math.max(highScore, wins);
  document.getElementById('highScore').textContent = highScore;
  updateTotalGamesAndWinPercentage();
}
function updateTotalGamesAndWinPercentage() {
  const totalGames = wins + losses;
  const winPercentage = totalGames ? ((wins / totalGames) * 100).toFixed(2) : 0;
  document.getElementById('totalGames').textContent = totalGames;
  document.getElementById('winPercentage').textContent = `${winPercentage}%`;
}

function setDifficulty() {
  currentDifficulty = document.getElementById('difficulty').value;
  startGame();
}

function setCategory() {
  currentCategory = document.getElementById('category').value;
  startGame();
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const playerName = document.getElementById('currentPlayer').textContent;
  const playerScore = { name: playerName, score: wins };
  leaderboard.push(playerScore);
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const leaderboardDiv = document.getElementById('leaderboard');
  leaderboardDiv.innerHTML = '<h3>Leaderboard</h3>';
  leaderboard.forEach(player => {
    const playerDiv = document.createElement('div');
    playerDiv.textContent = `${player.name}: ${player.score}`;
    leaderboardDiv.appendChild(playerDiv);
  });
}

function toggleLeaderboard() {
  const leaderboardDiv = document.getElementById('leaderboard');
  leaderboardDiv.style.display = leaderboardDiv.style.display === 'none' ? 'block' : 'none';
}

function playSound(type) {
  const audio = new Audio(`sounds/${type}.mp3`);
  audio.play();
}

function updateHangmanVisual() {
  const hangmanStages = [
    '',
    'O',
    'O\n |',
    'O\n/|',
    'O\n/|\\',
    'O\n/|\\ \n/',
    'O\n/|\\ \n/ \\'
  ];
  document.getElementById('hangmanVisual').textContent = hangmanStages[6 - guessesLeft];
}

function customWordInput() {
  const customWord = prompt('Enter a custom word:').toUpperCase();
  if (customWord && /^[A-Z]+$/.test(customWord)) {
    currentWord = customWord;
    displayWord = '_ '.repeat(currentWord.length);
    updateDisplayElements();
    startTimer();
    createLetterButtons();
    updateHangmanVisual();
  } else {
    alert('Invalid word. Enter only letters.');
  }
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pauseButton').textContent = isPaused ? 'Resume' : 'Pause';
  if (!isPaused) {
    startTimer();
  } else {
    clearInterval(timer);
  }
}

function saveGameState() {
  const gameState = {
    currentWord,
    guessesLeft,
    lettersUsed,
    displayWord,
    wins,
    losses,
    highScore,
    timeLeft,
    currentCategory,
    currentDifficulty,
    players,
    currentPlayerIndex,
  };
  localStorage.setItem('hangmanGameState', JSON.stringify(gameState));
  alert('Game state saved!');
}

function loadGameState() {
  const gameState = JSON.parse(localStorage.getItem('hangmanGameState'));
  if (gameState) {
    currentWord = gameState.currentWord;
    guessesLeft = gameState.guessesLeft;
    lettersUsed = gameState.lettersUsed;
    displayWord = gameState.displayWord;
    wins = gameState.wins;
    losses = gameState.losses;
    highScore = gameState.highScore;
    timeLeft = gameState.timeLeft;
    currentCategory = gameState.currentCategory;
    currentDifficulty = gameState.currentDifficulty;
    players = gameState.players;
    currentPlayerIndex = gameState.currentPlayerIndex;

    updateDisplayElements();
    document.getElementById('lettersUsed').textContent = lettersUsed.join(', ');
    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('highScore').textContent = highScore;
    updateTotalGamesAndWinPercentage();
    startTimer();
    createLetterButtons();
    updateHangmanVisual();
  } else {
    alert('No saved game found.');
  }
}

function createLetterButtons() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const buttonsContainer = document.getElementById('letterButtons');
  buttonsContainer.innerHTML = '';
  for (let letter of alphabet) {
    const button = document.createElement('button');
    button.textContent = letter;
    button.addEventListener('click', () => handleLetterClick(letter));
    buttonsContainer.appendChild(button);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', startGame);
  document.getElementById('customWordButton').addEventListener('click', customWordInput);
  document.getElementById('hintButton').addEventListener('click', useHint);
  document.getElementById('pauseButton').addEventListener('click', togglePause);
  document.getElementById('saveButton').addEventListener('click', saveGameState);
  document.getElementById('loadButton').addEventListener('click', loadGameState);
  document.getElementById('difficulty').addEventListener('change', setDifficulty);
  document.getElementById('category').addEventListener('change', setCategory);
  document.getElementById('toggleLeaderboard').addEventListener('click', toggleLeaderboard);
  document.getElementById('multiplayerButton').addEventListener('click', () => {
    isMultiplayer = !isMultiplayer;
    document.getElementById('multiplayerStatus').textContent = isMultiplayer ? 'Multiplayer Mode: ON' : 'Multiplayer Mode: OFF';
    startGame();
  });
});
