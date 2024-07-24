let words = [
  {word: "javascript", hint: "A popular programming language."},
  {word: "hangman", hint: "The game you are playing. LOL"},
  {word: "css", hint: "Styles web pages."},
  {word: "html", hint: "Structure of web pages."},
  {word: "developer", hint: "Creates software."}
];
let chosenWord;
let displayWord;
let attemptsLeft;
let guessedLetters;
let wins = 0;
let losses = 0;

function startGame() {
  const difficulty = document.getElementById('difficulty').value;
  let attempts;
  if (difficulty === 'easy') {
    attempts = 10;
  } else if (difficulty === 'medium') {
    attempts = 7;
  } else {
    attempts = 5;
  }

  chosenWord = words[Math.floor(Math.random() * words.length)];
  displayWord = "_ ".repeat(chosenWord.word.length).trim();
  attemptsLeft = attempts;
  guessedLetters = [];

  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = attemptsLeft;
  document.getElementById('lettersUsed').textContent = "None";
  document.getElementById('hangmanGraphic').textContent = chosenWord.hint;
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

  if (!correctGuess) {
    attemptsLeft--;
    document.getElementById('guessesLeft').textContent = attemptsLeft;
    updateHangmanGraphic();

    if (attemptsLeft === 0) {
      alert(`Game over! The word was: ${chosenWord.word}`);
      losses++;
      document.getElementById('losses').textContent = losses;
      startGame();
    }
  } else if (!displayWord.includes('_')) {
    alert('Congratulations! You guessed the word!');
    wins++;
    document.getElementById('wins').textContent = wins;
    startGame();
  }
}

function updateHangmanGraphic() {
  const stages = [
    "_________\n|        |\n|\n|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|        |\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\\\n|\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\\\n|       /\n|\n|\n___________",
    "_________\n|        |\n|        O\n|       /|\\\n|       / \\\n|\n|\n___________"
  ];
  document.getElementById('hangmanGraphic').textContent = stages[stages.length - attemptsLeft - 1];
}

document.addEventListener('DOMContentLoaded', startGame);
