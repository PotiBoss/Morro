import Phaser from 'phaser';
import SceneGame from './scripts/SceneGame';

const config = 
{
	width: 960,
	heigth: 540,
	type: Phaser.AUTO,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	},
	scene: [SceneGame],
	plugins: {
        scene: [
            {
            }
        ]
    }
}

const game = new Phaser.Game(config)
