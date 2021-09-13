const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');
const congratulation = document.getElementById('congratulation');

//Focus on textinput on start
text.focus();

//init score
let score = 0;

//init time
let time = 10;

//Define word
let newWords = [];

//set difficulty to value in local storage or medium
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'easy';

//set difficultySelect value
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'easy';

//Get random words from Api and add to DOM
async function getRandomWord() {
  const res = await fetch(
    'https://random-word-api.herokuapp.com//word?number=1'
  );
  const data = await res.json();

  newWords = data;
  word.innerHTML = newWords;

  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.volume = 1; // From 0 to 1
  msg.rate = 1.1; // From 0.1 to 10
  msg.pitch = 0.2; // From 0 to 2
  msg.text = newWords;
  msg.lang = 'en';
  speechSynthesis.speak(msg);
}
getRandomWord();

//add event listener for input
text.addEventListener('input', (e) => {
  const insertedText = e.target.value;

  if (insertedText.toLowerCase() === newWords.toString().toLowerCase()) {
    getRandomWord();

    //Update Score
    function updateScore() {
      score++;
      scoreEl.innerHTML = score;
    }
    updateScore();

    //clear input
    e.target.value = '';

    //Congrats message if score is high
    if (score === 30) {
      congratulation.innerText =
        'Good Job Pro-Typer! RELOAD and go to the next level';

      setTimeout(function () {
        congratulation.innerText = '';
      }, 8000);
    }

    //add time
    if (difficulty === 'protyper') {
      time += 2;
    } else if (difficulty === 'hard') {
      time += 3;
    } else if (difficulty === 'normal') {
      time += 6;
    } else {
      time += 8;
    }
    updateTime();
  }
});

//Start time countdown
const timeInterval = setInterval(updateTime, 1000);

//Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);

    //end game
    gameOver();
  }
}

//Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
	 <h1>Game Over</h1>
	 <p>Sorry you ran out of time</p>
	 <h3>Your final score is ${score}</h3>
	<button onclick="window.location.reload()">Play Again</button>
	`;
  endgameEl.style.display = 'flex';

  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10];
  msg.volume = 1; // From 0 to 1
  msg.rate = 1.1; // From 0.1 to 10
  msg.pitch = 0.2; // From 0 to 2
  msg.text = `Sorry you ran out of time. Your final score is ${score}`;
  msg.lang = 'en';
  speechSynthesis.speak(msg);

  difficultySelect.disabled = false;
}

//add event listener for settings btn
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));

//Difficulty level select
settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});
