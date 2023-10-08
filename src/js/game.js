import { KEYBOARD_LETTERS, WORDS } from './constants.js';

const gameDiv = document.querySelector('#game');
const logo = document.querySelector('#logo');
let tiersCount;
let winCount;

const createPlaceholder = () => {
    const word = sessionStorage.getItem('word');
    const wordArr = Array.from(word);
    const placeholders = wordArr.reduce(
        (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
        '',
    );
    return `<div id="placeholders" class="placeholders-wrapper">${placeholders}</div>`;
};

const createKeyboard = () => {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    keyboard.id = 'keyboard';

    const keyboardHTML = KEYBOARD_LETTERS.reduce((acc, curr) => {
        return (
            acc +
            `<button class="btn-primary keyboard-btn" id="${curr}">${curr}</button>`
        );
    }, '');

    keyboard.innerHTML = keyboardHTML;

    return keyboard;
};

const createHangmanImg = () => {
    const hangmanImg = document.createElement('img');
    hangmanImg.src = 'img/hg-0.png';
    hangmanImg.alt = 'Hangman image';
    hangmanImg.classList.add('hangman-img');
    hangmanImg.id = 'hangman-img';

    return hangmanImg;
};

const checkLetter = (letter) => {
    const word = sessionStorage.getItem('word');
    const inputLetter = letter.toLowerCase();
    if (!word.includes(inputLetter)) {
        const triesCounter = document.querySelector('#tiers-left');
        tiersCount--;
        triesCounter.innerText = tiersCount;
        const hangmanImg = document.querySelector('#hangman-img');
        hangmanImg.src = `img/hg-${10 - tiersCount}.png`;
        if (tiersCount === 0) {
            stopGame('lose');
            return;
        }
    } else {
        const wordArr = Array.from(word);
        wordArr.forEach((currentLetter, ind) => {
            if (currentLetter === inputLetter) {
                winCount++;
                if (winCount === word.length) {
                    stopGame('won');
                    return;
                }
                document.querySelector(`#letter_${ind}`).innerHTML =
                    inputLetter.toUpperCase();
            }
        });
    }
};

const stopGame = (status) => {
    const statusActions = {
        lose: () => {
            document.querySelector('#game').innerHTML +=
                '<h2 class="result-header lose">You lost :(</h2>';
        },
        won: () => {
            document.querySelector('#hangman-img').src = 'img/hg-win.png';
            document.querySelector('#game').innerHTML +=
                '<h2 class="result-header win">You won!!!</h2>';
        },
        quit: () => {
            logo.classList.remove('logo-sm');
            document.querySelector('#hangman-img').remove();
        },
    };

    document.querySelector('#placeholders').remove();
    document.querySelector('#tiers').remove();
    document.querySelector('#keyboard').remove();
    document.querySelector('#quit').remove();

    const word = sessionStorage.getItem('word');

    if (statusActions.hasOwnProperty(status)) {
        statusActions[status]();
    }

    document.querySelector(
        '#game',
    ).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="btn-primary">Play again</button>`;
    document.getElementById('play-again').onclick = startGame;
};

export const startGame = () => {
    tiersCount = 10;
    winCount = 0;
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    const wordGuess = WORDS[randomIndex];
    sessionStorage.setItem('word', wordGuess);

    logo.classList.add('logo-sm');

    gameDiv.innerHTML = createPlaceholder();

    gameDiv.innerHTML += `<p id="tiers" class="mt-2">TIERS LOST: <span id="tiers-left" class="font-medium text-red-600">${tiersCount}</span></p>`;

    const keyboardDiv = createKeyboard();
    keyboardDiv.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            event.target.disabled = true;
            checkLetter(event.target.id);
        }
    });
    gameDiv.appendChild(keyboardDiv);

    const hangmanImg = createHangmanImg();
    gameDiv.prepend(hangmanImg);

    const quitBtn = document.createElement('button');
    quitBtn.classList.add('btn-secondary');
    quitBtn.id = 'quit';
    quitBtn.innerText = 'Quit';

    gameDiv.insertAdjacentElement('beforeend', quitBtn);
    quitBtn.onclick = () => {
        const isSure = confirm(
            'Are you sure you want to quit and lose progress?',
        );
        if (isSure) {
            stopGame('quit');
        }
    };
};
