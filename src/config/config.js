import Phaser from 'phaser';
import Preloader from '../components/Preloader';
import MainScene from '../components/MainScene';
import GameOver from '../components/GameOver';
import CONST from '../utils/constants';

const { GAME_WIDTH, GAME_HEIGHT, GAME_BACKGROUND } = CONST;

const config = {
  type: Phaser.AUTO,
  parent: 'body',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: GAME_BACKGROUND,
  scene: [Preloader, MainScene, GameOver],
  // scale: {
  //   parent: 'phaser-game',
  //   mode: Phaser.Scale.ScaleModes.RESIZE,
  //   width: GAME_WIDTH,
  //   height: GAME_HEIGHT,
  // },
};

window.onload = function() {
  resize();
  window.addEventListener("resize", resize);
};

function resize() {
  const canvas = document.querySelector("canvas");
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = GAME_WIDTH /GAME_HEIGHT;
  if(windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = (windowWidth / gameRatio) + "px";
  } else {
      canvas.style.width = (windowHeight * gameRatio) + "px";
      canvas.style.height = windowHeight + "px";
  }
}

export default config;
