console.log("RPG v0.1 working")

import StateMachine from './class/StateMachine.js';
import createMainMenu from './states/MainMenuState.js';
import createSettingsState from './states/SettingsState.js';
import createPlayingState from './states/PlayingState.js'
import createPauseState from './states/PauseState.js';
import createFightState from './states/FightState.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const stateMachine = new StateMachine('MainMenu');

//states
const MainMenu = createMainMenu(stateMachine);
const SettingsState = createSettingsState(stateMachine);
const PlayingState = createPlayingState(stateMachine);
const PauseState = createPauseState(stateMachine);
const FightState = createFightState(stateMachine);

stateMachine.addState('MainMenu', MainMenu);
stateMachine.addState('Settings', SettingsState)
stateMachine.addState('Playing', PlayingState);
stateMachine.addState('Paused', PauseState);
stateMachine.addState('Fight', FightState);

//audio
const mainMenuMusic = new Audio('../assets/audio/main_menu.mp3');
// mainMenuMusic.play();

const FPS = 30;
const FRAME_DURATION = 1000 / FPS;
let lastTime = 0;

function gameLoop(timestamp) {
  const delta = timestamp - lastTime;

  if (delta > FRAME_DURATION) {
    lastTime = timestamp - (delta % FRAME_DURATION);

    stateMachine.update();
    stateMachine.render(ctx);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

stateMachine.changeState('MainMenu');
