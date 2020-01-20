
var activeScene;
var sceneChangeIncoming = true;
var infoArray1 = [false, false, false, 0.0, 0.0, 500.0, 350.0, false];
var infoArray2 = [false, false, false, 0.0, 0.0, 400.0, 350.0, false];
var connection;
var connectionBool = true;

//escena web que se ejecuta siempre en paralelo con todo el juego. Cada vez que se llama al servidor por ApiRest o se manda o recibe una funcion por Web Scokets se emplea 
//esta escena
class WebBackgroundScene extends Phaser.Scene {
  // Constructor de la escena.
  constructor(){
    super("web");
    web = this;
    
  }
  //en el preload estan todas las funciones de ApiRest
  preload (){
    //this.serverInfoLoop = false;
    //this.chatLoop = false;
    this.serverEvent;
    this.chatEvent;

    var playerData;
	    
    this.updateScene = function(sc){
  	  activeScene = sc;
    }
    this.getActiveScene = function(){
    	return activeScene;
    }
    

    
    this.getServerInfoMenu = function(){
      //serverIp, playercount es global
      $.ajax({
        url: 'http://' + serverIP + ':8080/players/data/playercount'
      }).done(function (playercount) {
        if(playercount >= 3){
          isChangingScene = true;
              cam.fadeOut(1000);
              web.game.customTransition(activeScene, 'serverFull', 1000);
        } else {
          isChangingScene = true;
              cam.fadeOut(1000);
              web.game.customTransition(activeScene, 'nameScreen', 1000);
        }
      }).fail(function() {
        isChangingScene = true;
            cam.fadeOut(1000);
            web.game.customTransition(activeScene, 'connectionFailed', 500);
      })
    }

    //_________________________________

    function createPlayer(player, callback) {
    //serverIP global
	    $.ajax({
	        method: "POST",
	        url: 'http://' + serverIP + ':8080/players',
	        data: JSON.stringify(player),
	        processData: false,
	        headers: {
	            "Content-Type": "application/json"
	        }
	    }).done(function (player) {
	        console.log("Player connected: " + JSON.stringify(player));
	        callback(player);
	    })
  	}

    function LoadWaitingScreen(){
		  $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
			  web.game.playerIP = data.geoplugin_request;
			  }).done(function () {
				  var player = {
		            player_ip: web.game.playerIP,
		            player_name: web.game.playerName,
		            player_password: web.game.playerPassword,
			        	character_selection: -1,
			        	player_ready: false
			      }

			    createPlayer(player, function (playerWithId) {
			  	web.game.playerID = playerWithId.id;
			  	web.game.online = true;
		    	cam.fadeOut(1000);
		    	//activeScene.scene.start("waitingScreen");
		    	activeScene.game.customTransition(activeScene, 'waitingScreen', 1000);
			  });
			});
    }

    this.getServerInfoNameScreen = function(){
      //serverIp es global
      //el resto de var tmb
			$.ajax({
        url: 'http://' + serverIP + ':8080/players/login/' + nameText.text + '/' + web.game.playerPassword
		    }).done(function (login) {
		        if(login == 0){
		        	errorText.setText("That user is already playing.");
		        } else if (login == 1) {
		        	errorText.setText("Password is incorrect.");
		        } else{
	        		isChangingScene = true;
              canWriteName = false;
              canWritePass = false;
              LoadWaitingScreen();
	        	}
		    })
      }

      //_______________


      this.activateDeactivate = function(sel){
        //serverIP, selection es global
    	console.log(sel);
    	console.log("playerid: " + web.game.playerID);
      	$.ajax({
              method: 'PUT',
              url: 'http://' + serverIP + ':8080/players/data/' + web.game.playerID,
              data: JSON.stringify(sel),
              processData: false,
              headers: {
                  "Content-Type": "application/json"
              }
          }).done(function (selection) {
          	console.log("role selected");
          });
      }

      //______________

    	this.deletePlayer = function(playerId, serverIP) {
        //serverIP es global
  	    $.ajax({
  	        method: 'DELETE',
  	        url: 'http://' + serverIP + ':8080/players/' + playerId
  	    }).done(function (player) {
  	        console.log("Player disconnected: " + playerId)
  	    })
    	}

      function waitingServerInfoSection(){
        //serverIP, waitingPlayersText, playerData, es global
        //console.log("Players: " + JSON.stringify(playerData));

        numPlayers = playerData.length;
        waitingPlayersText.setText("Waiting for players (" + numPlayers + "/3)...");
        waitingPlayersText.setOrigin(0.5, 0.5);

        if (numPlayers == 3 && sceneChangeIncoming) {
          cam.fadeOut(500);
          activeScene.game.customTransition(activeScene, 'selectionScreen', 500);
          sceneChangeIncoming = false;
	      //activeScene.scene.start("selectionScreen");
        } else {
          for (var i = 0; i < numPlayers; i++) {
              if(playerData[i].player_name == web.game.playerName) {
            	  web.game.playerID = playerData[i].id;
              }
            }
        }
      }
      function characterServerInfoSection(){
        //serverIP, playerData, es global
        //console.log("Players: " + JSON.stringify(playerData));
        //console.log(playerData.length);

        numPlayers = playerData.length;
        if (numPlayers < 3) {
          document.getElementById("chatArea").innerHTML += "Someone left the server. <br />";
          /*cam.fadeOut(500);
          web.game.customTransition(activeScene, 'menu', 500);*/
          game.online = false;
        } else {
          for (var i = 0; i < 3; i++) {
            DeactivateRole(i);
          }
          for (var i = 0; i < numPlayers; i++) {
              if(playerData[i].player_name == web.game.playerName) {
            	  web.game.playerID = playerData[i].id;
            	  web.game.characterSel = playerData[i].character_selection;
              }
              for (var j = 0; j < 3; j++) {
                if(playerData[i].character_selection == j){
                  ActiveRole(j);
                }
              }
            }
        }
      }

      function defaultServerInfoSection(){
        //serverIP, playerData, es global
        //console.log("Players: " + JSON.stringify(playerData));

        numPlayers = playerData.length;
        if (numPlayers < 3) {
          document.getElementById("chatArea").innerHTML += "Someone left the server. <br />";
          cam.fadeOut(500);
          web.game.customTransition(activeScene, 'connectionFailed2', 500);
          web.loopServerInfoStop();
          web.loopChatStop();
        } else {
        }
      }

      this.getServerInfo = function() {
        //serverIP, disconnectCounter, waitingPlayersText, playerData, es global
        if (web.game.online && (disconnectCounter < 3)) {
          $.ajax({
          url: 'http://' + serverIP + ':8080/players/data/' + web.game.playerID
          }).done(function (playerDataS) {
        	  playerData = playerDataS;
            //dependiendo de la escena se ejecuta una funcion u otra
            if(activeScene.scene.key == "waitingScreen") {
            	waitingServerInfoSection();
            }
            else if(activeScene.scene.key == "selectionScreen") {
            	characterServerInfoSection();
            }
            else {
            	defaultServerInfoSection();
            }
          }).fail(function () {
            disconnectCounter++;
            if (disconnectCounter >= 3) {
            	web.game.online = false;
            }
          });
          /*if(web.serverInfoLoop){
        	web.serverEvent = web.time.addEvent({
            delay: 500,
            callback: () => web.getServerInfo()
            });
          }*/
        } else {
           web.loopServerInfoStop();
           web.loopChatStop();
          console.log("Disconected from server");
          document.getElementById("chatArea").innerHTML += "Disconected from server <br />"
          web.game.customTransition(activeScene, 'connectionFailed', 500);
        }
      }

      //___
      this.getNewChats = function() {
        //serverIP, chatData son globales
        if (web.game.online) {
          $.ajax({
            url: 'http://' + serverIP + ':8080/players/chat/'
            }).done(function (chatData) {
            	web.game.textToChat(chatData);
              /*if(web.chatLoop)
            	  activeScene.time.addEvent({
                  delay: 500,
                  callback: () => web.getNewChats(activeScene)
                });*/
            })
        }
      }

      this.loopServerInfoStart = function(){
        //this.serverInfoLoop = true;
        this.serverEvent = this.time.addEvent({
    			delay: 750,
    			callback: () => web.getServerInfo(),
    			loop: true
    		});
      }
      this.loopServerInfoStop = function(){
          //this.serverInfoLoop = false;
    	  this.serverEvent.remove();
      }

      this.loopChatStart = function(){
        //this.chatLoop = true;
    	
    	this.chatEvent = this.time.addEvent({
    			delay: 750,
    			callback: () => web.getNewChats(),
    			loop: true
    		});
      }
      this.loopChatStop = function(){
          //this.chatLoop = false;
    	  this.chatEvent.remove();
      }
  }
  //en el create están todas las funciones de WebScokets (no estan en el preload por atener una separacion clara de las dos, en verdad no importa si estan el el preload o create)
  create ()
  {
	this.webSocketLoop;
	
	this.startConnectionWS = function(){
		//WebSockets
		connection = new WebSocket('ws://' + serverIP + ':8080/game');
	    console.log("WebSocket connection established");
		connection.onerror = function(e) {
			console.log("WS error: " + e);
		}
		connection.onmessage = function(msg) {
			var message = JSON.parse(msg.data)
			switch(message.id){
				case "2": //humano activa algo
					web.recieveAndroidInteractable(message.ms);
				break;
				case "3": //humano activa algo
					web.recieveAndroidInteractable(message.ms);
				break;
				case "4": //humano activa algo
					web.recieveHumanInteractable(message.ms);
				break;
				case "5": //humano lanza objecto
					web.recieveitemDrop(message.ms, message.ms2, message.ms3, message.ms4, message.ms5);
				break;
				case "a": //loop continuo de informacion
					web.recieveAndroidsPosAR(message.ms, message.ms2);
				break;
				default:
					console.log("recieved message: " + message.id);
				break;
				
			}
		}
		connection.onclose = function() {
			console.log("websocket closed");
			/*web.time.addEvent({
    			delay: 1000,
    			callback: () => wsCallback(),
    		});
			function wsCallback(){
				connection = new WebSocket('ws://' + serverIP + ':8080/game');
			}*/
		}
		
		
	}
	
	this.loopWSStart = function(){
		this.webSocketLoop = this.time.addEvent({
    			delay: 25,
    			callback: () => web.sendAndroidPosAR(),
    			loop: true
    		});
     }
	
	 this.loopWSStop = function(){
		 if(!game.characterSel == -1)
			 this.webSocketLoop.remove();
	 }
	 
	 this.sendAndroidPosAR = function(){
		 if(connection.readyState === connection.OPEN){
			 var msge;
			 if(web.game.characterSel == 0){
				 msge = {
					 id : "m",
					 ms : [web.game.android1.playerMovementArray[0], web.game.android1.playerMovementArray[1], web.game.android1.playerMovementArray[2], web.game.android1.playerMovementArray[3], web.game.android1.playerMovementArray[4] , web.game.android1.playerMovementArray[5], web.game.android1.playerMovementArray[6], web.game.android1.playerMovementArray[7]]
				 }
				 web.game.android1.playerMovementArray[7] = false;
			 }else if(web.game.characterSel == 1){
				 msge = {
					 id : "f",
					 ms : [web.game.android2.playerMovementArray[0], web.game.android2.playerMovementArray[1], web.game.android2.playerMovementArray[2], web.game.android2.playerMovementArray[3], web.game.android2.playerMovementArray[4] , web.game.android2.playerMovementArray[5], web.game.android2.playerMovementArray[6], web.game.android2.playerMovementArray[7]]
				 }
				 web.game.android2.playerMovementArray[7] = false;
			 }else if(web.game.characterSel == 2){
				 msge = {
					 id : "h",
					 ms : 0
				 }
			 }
			 connection.send(JSON.stringify(msge))
		 }
	 }
	 
	 this.recieveAndroidsPosAR = function(recievedArray1, recievedArray2){
		 if(web.game.characterSel == 0){
			 if(recievedArray2 != null)
			 infoArray2 = recievedArray2;
		 }else if(web.game.characterSel == 1){
			 if(recievedArray1 != null)
			 infoArray1 = recievedArray1;
		 }else{
			 if(recievedArray1 != null)
			 infoArray1 = recievedArray1;
			 if(recievedArray2 != null)
			 infoArray2 = recievedArray2;
		 }
	 }
	

	this.sendHumanInteractable = function(objectID){
		const msge = {
				id : "4",
				ms: objectID
			}
		connection.send(JSON.stringify(msge))
	}
	
	this.recieveHumanInteractable = function(objectID){
		const object = humanInteractableItems.items[objectID];
		object.isActive = !object.isActive;
        (object.isActive) ? console.log("activated object") : console.log("desactivated object");
        object.objectActivate();
        object.itemBar.changeBar(object.itemBar.energy - 10);
	}
	
	this.sendAndroidInteractable = function(objectID){
		var msge;
		if(web.game.characterSel == 0){
			msge = {
				id : "2",
				ms: objectID
			}
		}else if(web.game.characterSel == 1){
			msge = {
				id : "3",
				ms: objectID
			}
		}
		connection.send(JSON.stringify(msge))
	}
	
	this.recieveAndroidInteractable = function(objectID){
		const object = androidInteractableItems.items[objectID];
		object.isActive = !object.isActive;
        (object.isActive) ? console.log("activated object") : console.log("desactivated object");
        object.objectActivate();
	}
	
	this.senditemDrop = function(objectID, posX, posY, mouseVel, energy){
		const msge = {
				id : "5",
				ms: objectID,
				ms2: posX,
				ms3: posY,
				ms4: mouseVel,
				ms5: energy
			}
		connection.send(JSON.stringify(msge))
	}
	
	this.recieveitemDrop = function(objectID, posX, posY, mouseVel, energy){
		usableItems.bar.scaleY = energy/100;
		usableItems.energy = energy;
		
		usableItems.items[objectID].dropItemInGame(posX, posY, mouseVel);
	}
	
  }
}
