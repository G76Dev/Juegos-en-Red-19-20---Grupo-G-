// Variables del menú,
var backButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

import Button from "./button.js";

// Funcion que detecta si el raton se encuentra sobre el boton 'back' y activa su luz en caso afirmativo.
function CheckOption(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}

// Clase correspondiente a la escena del modo online.
export default class SceneOnlineMode extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("onlineMode");
  }
  
  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
	this.game.online = true;
	var disconnectCounter = 0;
	var actualScene = this;

    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Añadimos los sonidos a la escena.
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');

    // Añadimos el background.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos el texto de la pantalla del modo online provisional (hasta fase 3-4).
    this.add.image(960/2, 540/2, 'text_onlineMode');

    // Añadimos el botón de 'back'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    
    //Delete item from server
	function deletePlayer(playerId, serverIP) {
	    $.ajax({
	        method: 'DELETE',
	        url: 'http://' + serverIP + ':8080/players/' + playerId
	    }).done(function (player) {
	        console.log("Player disconnected: " + playerId)
	    })
	}
	
    function LoadScene(scene, nombreEscena){
    	if (disconnectCounter <3) {
    		deletePlayer(scene.game.playerID, scene.game.serverIP);
    	}
    	scene.game.online = false;
    	scene.scene.start(nombreEscena);}
    
  	backButton = new Button(this, 960/2, 405, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
      isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'menu')
			});
    });

  	// Hacemos la luz invisible.
    backButton.alpha = 0;
    
  	// Añadimos el texto de 'back'.
    this.add.image(960/2, 405, 'text_back');
    
  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
  	// Si se esta sobre el boton 'back', se volverá al menu principal.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene && backButton.isActive) {
            backButton.Behaviour();
        }
    });
  	
  	function getServerInfo(scene, serverIP) {
  		if (scene.game.online) {
  			$.ajax({
  		        url: 'http://' + serverIP + ':8080/players/data/' + scene.game.playerID
  		    }).done(function (playerData) {
  		        console.log("Players: " + JSON.stringify(playerData));
  		    }).fail(function () {
  				disconnectCounter++;
  			});
  			
  			if (disconnectCounter >= 2) {
  				scene.game.online = false;
  			}
  		    
  	  		scene.time.addEvent({
  	  			delay: 500,
  	  			callback: () => getServerInfo(scene, serverIP)
  	  		});
  	  	} else {
  	  		console.log("Disconected from server");
  	  		LoadScene(scene, 'menu');
  	  	}
  	}
  	
  	this.time.addEvent({
			delay: 500,
			callback: () => getServerInfo(this, this.game.serverIP)
		});
  	
  	/*window.addEventListener('beforeunload', function (e) {
	    deletePlayer(actualScene.game.playerID);
	});*/
    
  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre el boton 'back' en cada momento.
    if (!isChangingScene)
      CheckOption(this);

    // Se ejecuta el update del boton 'back'.
  	backButton.Update(time, delta);
  }
}