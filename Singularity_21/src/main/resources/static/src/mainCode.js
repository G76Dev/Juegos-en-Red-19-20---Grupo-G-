"use strict";

//import Scene1 from './Scenes/Scene1.js';

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
      SceneOnlineMode,
      SceneOptions,
      SceneMenuTutorial,
      SceneVictory,
      SceneDefeat,
      SceneCredits,
      SceneMenuTutorial2,
      SplashScreen,
      SceneName,
      SceneWaiting,
      SceneCharacterSelection,
      SceneServerFull,
      SceneConnectionFailed
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

var bladeDoorCheck = false;


//Variables del jugador si se conecta al servidor.
/*APIREST
var ipConfig = new ipConfigClass();
game.serverIP = ipConfig.serverIP;
game.playerIP;
game.playerID = -1;
game.online = false;
game.ready = false;
game.characterSel = -1;
game.playerName = "";
game.playerPassword = "";

//Variables del chat
game.chatColor = "#FF0000";
*/
//Chat
/*APIREST cosas de chat
const chatArea = document.getElementById("chatArea");
const chatInput = document.getElementById("chatInput");

game.textToChat = function(chatTxt){
	chatArea.innerHTML = chatTxt;
}
function submitText(chatTxt){
  var addToChat = "";

  if(game.online){
	var fontFormat = 'color:' + game.chatColor + '; font-weight: bold';
	addToChat += "<span style ='" + fontFormat + "'>" + game.playerName + ": ";
    fontFormat = 'color:' + 'black' + '; font-weight: normal';
    addToChat += "<span style ='" + fontFormat +"'>" + chatTxt + "<br />";

    $.ajax({
        method: "POST",
        url: 'http://' + game.serverIP + ':8080/players/chat',
        data: JSON.stringify(addToChat),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (player) {
        console.log("chat enviado");
    })

  }else{
	chatArea.innerHTML += "<span style = 'font-weight: bold'>" + "Chat is disabled in offline mode" + "<br />";
  }

  chatInput.value = "";
  chatArea.scrollTo(0, 99999);
}


function keyPressed(event){
  if(event.key == "Enter"){
    submitText(chatInput.value);
  }
}

chatInput.onkeypress = keyPressed;

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
}*/
