import Phaser from 'phaser';
import Preloader from '../components/Preloader';
import MainScene from '../components/MainScene';
import GameOver from '../components/GameOver';

const config = {
  type: Phaser.AUTO,
  parent: 'blast game',
  width: 990,
  height: 820,
  backgroundColor: '#a1a1a1',
  scene: [Preloader, MainScene, GameOver],
  scale: {
    parent: 'body',
    mode: Phaser.Scale.ScaleModes.FIT,
    width: 990,
    height: 820
}
};

export default config;
