"use strict";
import SceneLoading from "./SceneLoading.js";
import Scene1 from "./Scene1.js";
import Scene2 from "./Scene2.js";
import Scene3 from "./Scene3.js";
import SceneMenuTutorial from './SceneMenuTutorial.js';
import SceneOnlineMode from "./SceneOnlineMode.js";
import SceneOptions from "./SceneOptions.js";
import SceneVictory from "./SceneVictory.js";
import SceneDefeat from "./SceneDefeat.js";
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
    //Escena principal
    scene: [SceneLoading, Scene1, Scene2, Scene3, SceneOnlineMode, SceneOptions, SceneMenuTutorial, SceneVictory, SceneDefeat],
    plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  }
};

//Declaramos nuestro juego
var game = new Phaser.Game(config);
//Declaramos variables globales relativas al sonido y la música.
game.musicVolume = 0.3;
game.soundVolume = 0.2;
game.currentMusic;
game.android1;
game.android2;
