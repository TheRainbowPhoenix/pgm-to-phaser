import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Preload from './scenes/Preload';
import Level from './scenes/Level';

import { Types } from "phaser";

import 'phaser/plugins/spine4.1/dist/SpinePlugin';
import { MatterGravityFixPlugin } from './plugins/MatterGravityFixPlugin';
import MatterLevel from './scenes/MatterLevel';
import TestTilemapScene from './scenes/TestTilemapScene';
import TitleScreen from './scenes/TitleScreen';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game-container',
    backgroundColor: '#0A0A0A',
    roundPixels: false,
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          fixedStep: false,
          gravity: {
            x: 0,
            y: 0
          }
        }
    },
		render: {
			pixelArt: true,
		},
    input: {
      gamepad: true,
			activePointers: 3
    },
    plugins: {
      scene: [
        {
          key: 'SpinePlugin',
          plugin: window['SpinePlugin'],
          mapping: 'spine',
          sceneKey: 'spine',
        }
      ],
    },
    scene: [
        // Boot,
        // Preload,
        // MainMenu,
        // MainGame,
        // GameOver
    ]
};

const game = new Phaser.Game(config);

game.scene.add("Preload", Preload);
// game.scene.add("Level", Level);
game.scene.add("MatterLevel", MatterLevel);
game.scene.add("TitleScreen", TitleScreen);
game.scene.add("TestTilemapScene", TestTilemapScene);
game.scene.add("Boot", Boot, true);

export default game;
