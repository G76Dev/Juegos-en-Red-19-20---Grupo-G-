// Variables del menú,
var buttonArray;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;
var waitingPlayersText;

var numPlayers = 1;

// Funcion que detecta donde esta el raton y activa la luz correspondiente segun su posicion.
function CheckOption12(scene) {
  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 465 + 70 * i && scene.input.mousePointer.y < 535 + 70 * i){
      if (!buttonArray[i].isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
      buttonArray[i].isActive = true;
    }
    else {
      buttonArray[i].isActive = false;
    }
  }
}


// Clase correspondiente a la escena del modo online.
class SceneWaiting extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("waitingScreen");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
	  	var disconnectCounter = 0;
	  	var actualScene = this;

        // Variable que indica si se está cambiando de escena.
        isChangingScene = false;

        // Añadimos los sonidos a la escena.
        hoverSound = this.sound.add('menuHover');
        selectedSound = this.sound.add('menuSelected');

        // Añadimos el background y el titulo.
        this.add.image(960/2, 540/2, 'interfazBg');
        this.add.image(960/2, 540/2, 'interfazTitle');

        // Añadimos el texto que indica cuantos jugadores quedan.
        waitingPlayersText = this.add.text(960/2, 240, "", { fontFamily: 'Impact', fontSize: '32px', fill: '#fff', align: 'center', }).setDepth(1);
        waitingPlayersText.setStroke('rgba(0,0,0,1)', 4);

      //Delete player from server
    	function deletePlayer(playerId, serverIP) {
    	    $.ajax({
    	        method: 'DELETE',
    	        url: 'http://' + serverIP + ':8080/players/' + playerId
    	    }).done(function (player) {
    	        console.log("Player disconnected: " + playerId)
    	    })
    	}

        // Añadimos las luces que indicaran que boton del menu esta activo. Hacemos tambien un fade con la camara.
        cam = this.cameras.main;
        cam.fadeIn(1000);

            buttonArray = [
            new Button(this, 960/2, 500, 'light', function() {
                selectedSound.play({ volume: this.scene.game.soundVolume });
                isChangingScene = true;
                this.scene.game.customTransition(this.scene, 'menu', 1000);
                cam.fadeOut(1000);
            },)
        ];

        // Hacemos a todas las luces invisibles al inicio de la escena.
        for (var i = 0; i < buttonArray.length; i++) {
        buttonArray[i].alpha = 0;
        }

        // Añadimos los textos de los botones.
        this.add.image(960/2, 500, 'text_back');

        // Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
        // Indica que funcion hay que ejecutar segun la opcion seleccionada en el menu.
        this.input.on('pointerdown', function () {
            for (var i = 0; i < buttonArray.length; i++) {
            	if (!isChangingScene && buttonArray[i].isActive) {
            		buttonArray[i].Behaviour();
            	}
            }
        });
        function getServerInfo(scene, serverIP) {
      		if (scene.game.online && (disconnectCounter < 3)) {
      			$.ajax({
      		        url: 'http://' + serverIP + ':8080/players/data/' + scene.game.playerID
      		    }).done(function (playerData) {
      		        console.log("Players: " + JSON.stringify(playerData));

      		        numPlayers = playerData.length;
		        	waitingPlayersText.setText("Waiting for players (" + numPlayers + "/3)...");
		            waitingPlayersText.setOrigin(0.5, 0.5);

      		        if (numPlayers == 3) {
      		        	scene.game.customTransition(scene, 'selectionScreen', 500);
      		        } else {
      		        	for (var i = 0; i < numPlayers; i++) {
          		        	if(playerData[i].player_name == scene.game.playerName) {
          		        		scene.game.playerID = playerData[i].id;
          		        	}
          		        }

          		        scene.time.addEvent({
            	  			delay: 500,
            	  			callback: () => getServerInfo(scene, serverIP)
            	  		});
      		        }
      		    }).fail(function () {
      				disconnectCounter++;
      				if (disconnectCounter >= 3) {
      					scene.game.online = false;
      				}

      				scene.time.addEvent({
    	  	  	  			delay: 500,
    	  	  	  			callback: () => getServerInfo(scene, serverIP)
    	  	  	  		});
      			});

      	  	} else {
      	  		console.log("Disconected from server");
      	  		document.getElementById("chatArea").innerHTML += "Disconected from server <br />"
      	  		scene.game.customTransition(scene, 'connectionFailed', 100);
      	  	}
      	}
        
      	function getNewChats(scene, serverIP) {
      		if (scene.game.online) {
      			$.ajax({
      		        url: 'http://' + serverIP + ':8080/players/chat/'
      		    }).done(function (chatData) {
        			scene.game.textToChat(chatData);
        			scene.time.addEvent({
          	  			delay: 500,
          	  			callback: () => getNewChats(scene, serverIP)
          	  		});
      		    }).fail(function () {
      		    	scene.time.addEvent({
      	  	  			delay: 500,
      	  	  			callback: () => getNewChats(scene, serverIP)
      	  	  		});
      			});
      		}
      	}

      	this.time.addEvent({
    			delay: 500,
    			callback: () => getServerInfo(this, this.game.serverIP)
    		});

      	this.time.addEvent({
    		delay: 250,
    		callback: () => getNewChats(this, this.game.serverIP)
    	});

  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {
    // Solo si no se esta cambiando de escena, se comprobara sobre que boton se encuentra el raton en cada momento.
    if (!isChangingScene)
        CheckOption12(this);

    // Se ejecuta el update de cada boton.
    for (var i = 0; i < buttonArray.length; i++) {
      buttonArray[i].Update(time, delta);
    }

  }

}
