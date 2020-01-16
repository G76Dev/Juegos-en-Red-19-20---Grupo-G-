"use strict";

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
    scene: [
      SceneLoading,
      Scene1,
      Scene2,
      Scene3,
      Scene4,
      SceneOptions,
      SceneMenuTutorial,
      SceneVictory,
      SceneDefeat,
      SceneCredits,
      SceneMenuTutorial2,
      SplashScreen
    ],
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
game.human;

//Variables de los androides
game.lives = 10;
game.respawnTime = 1500;
game.jumpVelocity = 5.05;
game.moveVelocity = 0.215;
game.airVelocityFraction = 0.3;

// Otras variables.
var bladeDoorCheck = false;

var hoverSound;
var selectedSound;
var isChangingScene;

var colorActivated = 0xFF7373;
var colorHover = 0xA9A9A9;

// Método para cambiar de escenas.
function customTransitionStart(scene, nextSceneKey){
  var sceneClassName = "";
  var sceneArray = scene.scene.manager.scenes;

  for(var i=0; i<sceneArray.length; i++){
    if(sceneArray[i].scene.key.localeCompare(nextSceneKey) == 0){ //scene.scene.manager.scenes[i].scene.key.localeCompare(nextSceneKey)
      sceneClassName = sceneArray[i].constructor.name;            //sceneClassName = scene.scene.manager.scenes[i].constructor.name
      break;
    }
  }
  scene.scene.remove(nextSceneKey);
  return sceneClassName;
}

function customTransitionEnd(scene, nextSceneKey, sceneClassName){
  eval("scene.game.scene.add('', new "+ sceneClassName +"(\'"+ nextSceneKey +"\'), true)");
  scene.scene.stop(scene.scene.key);
}

game.customTransition = function(scene, nextSceneKey, fadeDuration){
  var nextSceneClassName = customTransitionStart(scene, nextSceneKey);
  scene.time.addEvent({
    delay: fadeDuration,
    callback: () => (customTransitionEnd(scene, nextSceneKey, nextSceneClassName))
  });
}
