import Phaser from 'phaser';
import Preloader from '../components/Preloader';
import { MainScene } from '../components/MainScene';
import GameOver from '../components/GameOver';
import CONST from '../utils/constants';

const { GAME_WIDTH, GAME_HEIGHT, GAME_BACKGROUND } = CONST;

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: GAME_BACKGROUND,
  scene: [Preloader, MainScene, GameOver],
  title: 'КОНКУРС - ФПК - ПТЗ',
  url: 'https://fpktech.ru',
  version: '3.0',
  banner: {
    hidePhaser: true,
    text: '#fff',
    background: ['#CE2A2E', '#2D333C', '#fff', '#04336a']
  },
};

function resize() {
  const canvas = document.querySelector('#phaser-game');
  const body = document.querySelector('body');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = GAME_WIDTH / GAME_HEIGHT;
  if (windowRatio < gameRatio) {
    canvas.style.width = `${windowWidth - (windowWidth > 500 ? 30 : 0)}px`;
    canvas.style.height = `${windowWidth / gameRatio}px`;
    body.style.height = `${windowWidth / gameRatio}px`;
  } else {
    canvas.style.width = `${windowHeight * gameRatio}px`;
    canvas.style.height = `${windowHeight}px`;
    body.style.height = `${windowWidth * gameRatio}px`;
  }
}

window.onload = () => {
  resize();
  window.addEventListener('resize', resize);
};

export default config;
