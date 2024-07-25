let words = {
  programming: [
    { word: "javascript", hint: "A popular programming language." },
    { word: "hangman", hint: "The game you are playing RIGHT NOW!" },
    { word: "css", hint: "Styles web pages." },
    { word: "html", hint: "Structure of web pages." },
    { word: "developer", hint: "Creates software like this!" }
  ],
  animals: [
    { word: "elephant", hint: "The largest land animal." },
    { word: "kangaroo", hint: "Australian marsupial known for jumping." },
    { word: "giraffe", hint: "The tallest land animal." },
    { word: "penguin", hint: "A bird found in Antarctica." },
    { word: "dolphin", hint: "A highly intelligent marine mammal." }
  ],
  countries: [
    { word: "canada", hint: "Known for its maple syrup and kind people." },
    { word: "brazil", hint: "Famous for the Amazon rainforest." },
    { word: "france", hint: "Known for its wine and the Eiffel Tower." },
    { word: "japan", hint: "Known for sushi and technology." },
    { word: "india", hint: "Known for its diverse culture and Bollywood." }
  ]
};

let chosenWord;
let displayWord;
let attemptsLeft;
let guessedLetters;
let wins = 0;
let losses = 0;
let highScore = 0;
let timer;
let timeLeft;
let achievements = [];
let currentPlayer = '';
let players = JSON.parse(localStorage.getItem('players')) || {};

document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
  startGame();
});

function createProfile() {
  currentPlayer = document.getElementById('playerName').value.trim();
  if (!currentPlayer) {
    alert('Please enter a name');
    return;
  }
  if (!players[currentPlayer]) {
    players[currentPlayer] = { highScore: 0, wins: 0, losses: 0, achievements: [] };
    localStorage.setItem('players', JSON.stringify(players));
  }
  document.getElementById('playerInfo').style.display = 'block';
  document.getElementById('currentPlayer').textContent = currentPlayer;
  document.getElementById('playerHighScore').textContent = players[currentPlayer].highScore;
  startGame();
}

function startGame() {
  clearInterval(timer);
  const difficulty = document.getElementById('difficulty').value;
  const category = document.getElementById('category').value;
  let attempts;
  if (difficulty === 'easy') {
    attempts = 10;
    timeLeft = 90;
  } else if (difficulty === 'medium') {
    attempts = 7;
    timeLeft = 60;
  } else {
    attempts = 5;
    timeLeft = 45;
  }

  chosenWord = words[category][Math.floor(Math.random() * words[category].length)].word;
  displayWord = "_ ".repeat(chosenWord.length).trim();
  attemptsLeft = attempts;
  guessedLetters = [];

  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = attemptsLeft;
  document.getElementById('lettersUsed').textContent = "None";
  document.getElementById('timeLeft').textContent = timeLeft;
  createLetterButtons();
  startTimer();
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
  document.getElementById('lettersUsed').textContent = guessedLetters.join(', ');

  if (!correctGuess) {
    attemptsLeft--;
    document.getElementById('guessesLeft').textContent = attemptsLeft;
    if (attemptsLeft === 0) {
      alert(`Game over! The word was: ${chosenWord}`);
      losses++;
      document.getElementById('losses').textContent = losses;
      saveScore(false);
      resetGame();
    }
  } else if (!displayWord.includes('_')) {
    alert('Congratulations! You guessed the word!');
    wins++;
    document.getElementById('wins').textContent = wins;
    if (wins > highScore) {
      highScore = wins;
      document.getElementById('highScore').textContent
