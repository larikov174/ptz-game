import Phaser from 'phaser';
import Preloader from '../components/Preloader';
import MainScene from '../components/MainScene';
import GameOver from '../components/GameOver';
import CONST from '../utils/constants';

const { GAME_WIDTH, GAME_HEIGHT, GAME_BACKGROUND } = CONST;

const config = {
  type: Phaser.AUTO,
  parent: 'blast game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: GAME_BACKGROUND,
  scene: [Preloader, MainScene, GameOver],
  scale: {
    parent: 'body',
    mode: Phaser.Scale.ScaleModes.FIT,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
};

export default config;
