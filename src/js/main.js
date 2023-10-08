import '../css/style.css';
import { toogleModeHanlde } from './utils/toogleModeHanlde.js';
import { startGame } from './game.js';

toogleModeHanlde();
const startGameBtn = document.querySelector('#startGame');
startGameBtn.addEventListener('click', startGame);
