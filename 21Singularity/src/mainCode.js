"use strict";
import SceneLoading from "./SceneLoading.js";
import Scene1 from "./Scene1.js";
import Scene2 from "./Scene2.js";
import Scene3 from "./Scene3.js";
import SceneOnlineMode from "./SceneOnlineMode.js";
import SceneOptions from "./SceneOptions.js";
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
            debug: true
        }
    },
    //Escena principal
    scene: [SceneLoading, Scene1, Scene2, Scene3, SceneOnlineMode, SceneOptions],
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
