let words = {
  programming: [
    {word: "javascript", hint: "A popular programming language."},
    {word: "hangman", hint: "The game you are playing right this instant! :) Ha."},
    {word: "css", hint: "Styles web pages."},
    {word: "html", hint: "Structure of web pages."},
    {word: "developer", hint: "Creates software."}
  ],
  animals: [
    {word: "elephant", hint: "The largest land animal."},
    {word: "kangaroo", hint: "Australian marsupial known for jumping."},
    {word: "giraffe", hint: "The tallest land animal."},
    {word: "penguin", hint: "A flightless bird found in Antarctica."},
    {word: "dolphin", hint: "An intelligent marine mammal."}
  ],
  countries: [
    {word: "canada", hint: "Country known for its maple syrup! Sweety"},
    {word: "brazil", hint: "Country famous for the Amazon rainforest."},
    {word: "france", hint: "Country known for its wine and the Eiffel Tower."},
    {word: "japan", hint: "Country known for sushi and technology."},
    {word: "india", hint: "Country known for its diverse culture and Bollywood."}
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

function startGame() {
  clearInterval(timer);
  const difficulty = document.getElementById('difficulty').value;
  const category = document.getElementById('category').value;
  let attempts;
  if (difficulty === 'easy') {
    attempts = 10;
  } else if (difficulty === 'medium') {
    attempts = 7;
  } else {
    attempts = 5;
  }

  chosenWord = words[category][Math.floor(Math.random() * words[category].length)];
  displayWord = "_ ".repeat(chosenWord.word.length).trim();
  attemptsLeft = attempts;
  guessedLetters = [];
  timeLeft = 60;

  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = attemptsLeft;
  document.getElementById('lettersUsed').textContent = "None";
  document.getElementById('hangmanGraphic').textContent = "";
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
    attemptsLeft--;
    document.getElementById('guessesLeft').textContent = attemptsLeft;
    playSound('incorrectSound');
    updateHangmanGraphic();
  }

  if (attemptsLeft === 0) {
    alert(`Game over! The word was: ${chosenWord.word}`);
    losses++;
    document.getElementById('losses').textContent = losses;
    startGame();
  } else if (!displayWord.includes('_')) {
    alert('Congratulations! You guessed the word!');
    wins++;
    document.getElementById('wins').textContent = wins;
    if (wins > highScore) {
      highScore = wins;
      document.getElementById('highScore').textContent = highScore;
    }
    startGame();
  }
}

function useHint() {
  alert(`Hint: ${chosenWord.hint}`);
}

function updateHangmanGraphic() {
  const stages = [
    "_________\n|        |\n|\n|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|        |\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\\\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|
