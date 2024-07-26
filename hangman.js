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
  const wordList = words[currentCategory];
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];

  displayWord = '_ '.repeat(currentWord.length);
  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = guessesLeft;
  document.getElementById('lettersUsed').textContent = 'None';
  document.getElementById('timeLeft').textContent = timeLeft;

  startTimer();
  createLetterButtons();
  updateHangmanVisual();
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
    if (guessesLeft === 0) {
      playSound('loss');
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
  const hintIndex = words[currentCategory].indexOf(currentWord);
  alert(`Hint: ${hints[currentCategory][hintIndex]}`);
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
  isPaused = false;
  document.getElementById('pauseButton').textContent = 'Pause';
}

function startTimer() {
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
  const totalGames = wins + losses;
  const winPercentage = totalGames ? ((wins / totalGames) * 100).toFixed(2) : 0;
  document.getElementById('totalGames').textContent = totalGames;
  document.getElementById('winPercentage').textContent = winPercentage + '%';
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
    document.getElementById('wordContainer').textContent = displayWord;
    document.getElementById('guessesLeft').textContent = guessesLeft;
    document.getElementById('lettersUsed').textContent = 'None';
    document.getElementById('timeLeft').textContent = timeLeft;
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

    document.getElementById('wordContainer').textContent = displayWord;
    document.getElementById('guesses
