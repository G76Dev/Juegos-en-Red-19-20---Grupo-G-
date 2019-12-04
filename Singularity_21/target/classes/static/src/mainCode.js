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

//Variables de los androides
game.lives = 10;
game.respawnTime = 1500;
game.jumpVelocity = 5.05;
game.moveVelocity = 0.215;
game.airVelocityFraction = 0.3;

game.scene1Counter = 0;
game.scene2Counter = 0;

//Variables del jugador si se conecta al servidor.
game.serverIP = "192.168.1.119";
game.playerIP;
game.playerID = -1;
game.online = false;
game.ready = false;
game.characterSel = -1;
game.playerName = "default";

//Variables del chat
game.chatColor = "#FF0000";

//Chat
const chatArea = document.getElementById("chatArea");
const chatInput = document.getElementById("chatInput");

function submitText(text){
	chatArea.innerHTML += game.playerName + ": ";
	chatArea.innerHTML += text + "\n";
	chatInput.value = "";
}
function keyPressed(event){
  if(event.key == "Enter"){
    submitText(chatInput.value);
  }
}

chatInput.onkeydown = keyPressed;

function chatConnect(){
  submitText("Player arrived!");
}
function chatDisconnect(){
  submitText("Player left!");
}
function chatRoleSelect(role){
  switch(role){
    case 0:
      submitText("Player selected Android 1");
      break;

    case 1:
      submitText("Player selected Android 2");
      break;

    case 2:
      submitText("Player selected Human");
      break;
  }
}
function toggleChat(toggle){
  if(!toggle){
    chatArea.style.display = "block";
    chatInput.style.display = "block";
  } else {
    chatArea.style.display = "none";
    chatInput.style.display = "block";
  }
}