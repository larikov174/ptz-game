import Phaser from 'phaser';
import Preloader from '../components/Preloader';

const config = {
	type: Phaser.AUTO,
	parent: 'blast game',
	width: 990,
	height: 820,
	backgroundColor: '#a1a1a1',
	scene: [Preloader],
};

export default config;
