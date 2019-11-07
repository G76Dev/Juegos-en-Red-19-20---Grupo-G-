"use strict";

//todas las clases necesarias (incluyendo todas las escenas-modulos)
import SceneLoading from "./SceneLoading.js";
import Scene1 from "./Scene1.js";
import Scene2 from "./Scene2.js";
import Scene3 from "./Scene3.js";
import SceneMenuTutorial from './SceneMenuTutorial.js';
import SceneMenuTutorial2 from './SceneMenuTutorial2.js';
import SceneOnlineMode from "./SceneOnlineMode.js";
import SceneOptions from "./SceneOptions.js";
import SceneVictory from "./SceneVictory.js";
import SceneDefeat from "./SceneDefeat.js";
import SceneCredits from "./SceneCredits.js";
import SplashScreen from "./SplashScreen.js";
import Android from "./Android.js";
//Configuración de Phaser 3
var config = {
    type: Phaser.AUTO,
    //Dimensiones de la ventana de juego (ancho y alto)
    width: 960,
    height: 540,
    audio: {
      disableWebAudio: true
    },
    //Físicas del juego
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0.98 },
            debug: false
        }
    },
    //escenas principales
    scene: [SceneLoading, Scene1, Scene2, Scene3, SceneOnlineMode, SceneOptions, SceneMenuTutorial, SceneVictory, SceneDefeat, SceneCredits, SceneMenuTutorial2, SplashScreen],
    plugins: {
    //plugin de collisiones de matter  https://github.com/mikewesthad/phaser-matter-collision-plugin
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision"
      }
    ]
  }
};

//Declaramos nuestro juego
var game = new Phaser.Game(config);

//Declaramos variables globales del juego.
game.musicVolume = 0.3;
game.soundVolume = 0.2;
game.currentMusic;
game.android1;
game.android2;
game.scene1Counter = 0;
game.scene2Counter = 0;
