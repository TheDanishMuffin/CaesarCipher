let currentWord = '';
let guessesLeft = 6;
let lettersUsed = [];
let displayWord = '';
let wins = 0;
let losses = 0;

function startGame() {
  guessesLeft = 6;
  lettersUsed = [];
  displayWord = '';

  const words = ['PROGRAMMING', 'ANIMALS', 'COUNTRIES', 'CHICKEN'];
  currentWord = words[Math.floor(Math.random() * words.length)];

  for (let i = 0; i < currentWord.length; i++) {
    displayWord += '_ ';
  }

  document.getElementById('wordContainer').textContent = displayWord;
  document.getElementById('guessesLeft').textContent = guessesLeft;
  document.getElementById('lettersUsed').textContent = 'None';
}

function handleLetterClick(letter) {

  if (lettersUsed.includes(letter)) {
    alert('You have already used that letter.');
    return;
  }


  lettersUsed.push(letter);


  if (currentWord.includes(letter)) {

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


    if (!displayWord.includes('_')) {
      alert('You won!');
      wins++;
      document.getElementById('wins').textContent = wins;
      startGame();
    }
  } else {
    guessesLeft--;
    document.getElementById('guessesLeft').textContent = guessesLeft;

    if (guessesLeft === 0) {
      alert('You lost! The word was: ' + currentWord);
      losses++;
      document.getElementById('losses').textContent = losses;
      startGame();
    }
  }

  document.getElementById('lettersUsed').textContent = lettersUsed.join(', ');
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

window.onload = () => {
  document.getElementById('playerName').focus();
}
