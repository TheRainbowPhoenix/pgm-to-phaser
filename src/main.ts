import { Boot } from './scenes/Boot';
import Preload from './scenes/Preload';

import { Types } from "phaser";

import 'phaser/plugins/spine4.1/dist/SpinePlugin';

import TestTilemapScene from './scenes/TestTilemapScene';
import TitleScreen from './scenes/TitleScreen';
import WebfontLoader from './plugins/WebfontLoader';

// @ts-ignore
const documentWidth = window.innerWidth; // @ts-ignore
const documentHeight = window.innerHeight;
const zoomLevel = Math.floor(Math.min(documentWidth / 640, documentHeight / 360));
console.log(zoomLevel)
// TODO: experimental "wide screen" mode
const gameWidth = documentWidth / zoomLevel;
const gameHeight = documentHeight / zoomLevel;
// const gameWidth = 640; // documentWidth / zoomLevel;
// const gameHeight = 360; // documentHeight / zoomLevel;

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    antialias: false,
    antialiasGL: false,
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'game-container',
    backgroundColor: '#0A0A0A',
    roundPixels: false,
		scale: {
			mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: zoomLevel
		},
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: { // @ts-ignore
          debug: (__DEBUG__ || false ), 
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
        }, {
          key: 'WebfontLoader',
          plugin: WebfontLoader,
          mapping: 'webfont',
          sceneKey: 'webfont',
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
game.scene.add("TitleScreen", TitleScreen);
game.scene.add("TestTilemapScene", TestTilemapScene);
game.scene.add("Boot", Boot, true);



export default game;
