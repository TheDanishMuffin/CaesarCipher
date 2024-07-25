const words = {
  programming: [
    { word: "javascript", hint: "A popular programming language. (pythons better bruh)" },
    { word: "hangman", hint: "The game you are playing RIGHT NOW!." },
    { word: "css", hint: "Styles web pages." },
    { word: "html", hint: "Structure/baclbome of web pages." },
    { word: "developer", hint: "Creates software like this!." }
  ],
  animals: [
    { word: "elephant", hint: "The largest land animal to ever exist." },
    { word: "kangaroo", hint: "australian marsupial known for jumping." },
    { word: "giraffe", hint: "The tallesst land animal." },
    { word: "penguin", hint: "A bird found in Antarctica, THAT CANT FLY?!." },
    { word: "dolphin", hint: "A highly intelligent marine mammal." }
  ],
  countries: [
    { word: "canada", hint: "Country known for its maple syrup and kind people." },
    { word: "brazil", hint: "Country famous for the Amazon rainforest." },
    { word: "france", hint: "Country known for its wine and the Eiffel Tower." },
    { word: "japan", hint: "Country known for sushi and technology." },
    { word: "india", hint: "Country known for its diverse culture and Bollywood." }
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

  chosenWord = words[category][Math.floor(Math.random() * words[category].length)];
  displayWord = "_ ".repeat(chosenWord.word.length).trim();
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

  for (let i = 0; i < chosenWord.word.length; i++) {
    if (chosenWord.word[i] === letter) {
      newDisplayWord += letter + ' ';
      correctGuess = true;
    } else {
      newDisplayWord += displayWord[i * 2] + ' ';
    }
  }

  displayWord = newDisplayWord.trim();
  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('lettersUsed').textContent = guessedLetters.join(', ');

  if (correctGuess) {
    playSound('correctSound');
  } else {
    attemptsLeft
