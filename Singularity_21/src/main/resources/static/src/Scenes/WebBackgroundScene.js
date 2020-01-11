
class WebBackgroundScene extends Phaser.Scene {
  // Constructor de la escena.
  constructor(){
    super("web");
    this.serverInfoLoop = false;
    this.chatLoop = false;
  }

  preload (){
    web = this;

    this.getServerInfoMenu = function(scene){
      //serverIp, playercount es global
      $.ajax({
        url: 'http://' + serverIP + ':8080/players/data/playercount'
      }).done(function (playercount) {
        if(playercount >= 3){
          isChangingScene = true;
              cam.fadeOut(1000);
              scene.game.customTransition(scene, 'serverFull', 1000);
        } else {
          isChangingScene = true;
              cam.fadeOut(1000);
              scene.game.customTransition(scene, 'nameScreen', 1000);
        }
      }).fail(function() {
        isChangingScene = true;
            cam.fadeOut(1000);
            scene.game.customTransition(scene, 'connectionFailed', 1000);
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

    function LoadWaitingScreen(scene){
		  $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
			  scene.game.playerIP = data.geoplugin_request;
			  }).done(function () {
				  var player = {
		            player_ip: scene.game.playerIP,
		            player_name: scene.game.playerName,
		            player_password: scene.game.playerPassword,
			        	character_selection: -1,
			        	player_ready: false
			      }

			    createPlayer(player, function (playerWithId) {
			  	console.log(scene);
			  	scene.game.playerID = playerWithId.id;
		    	scene.game.online = true;
		    	cam.fadeOut(1000);
		    	scene.scene.start("waitingScreen");
			  });
			});
    }

    this.getServerInfoNameScreen = function(scene){
      //serverIp es global
      //el resto de var tmb
			$.ajax({
        url: 'http://' + serverIP + ':8080/players/login/' + nameText.text + '/' + scene.game.playerPassword
		    }).done(function (login) {
		        if(login == 0){
		        	errorText.setText("That user is already playing.");
		        } else if (login == 1) {
		        	errorText.setText("Password is incorrect.");
		        } else{
	        		isChangingScene = true;
              canWriteName = false;
              canWritePass = false;
              LoadWaitingScreen(scene);
	        	}
		    })
      }

      //_______________


      this.activateDeactivate = function(scene, sel){
        //serverIP, selection es global
      	$.ajax({
              method: 'PUT',
              url: 'http://' + serverIP + ':8080/players/data/' + scene.game.playerID,
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

      function waitingServerInfoSection(scene){
        //serverIP, waitingPlayersText, playerData, es global
        console.log("Players: " + JSON.stringify(playerData));

        numPlayers = playerData.length;
        waitingPlayersText.setText("Waiting for players (" + numPlayers + "/3)...");
        waitingPlayersText.setOrigin(0.5, 0.5);

        if (numPlayers == 3) {
          cam.fadeOut(500);
          scene.game.customTransition(scene, 'selectionScreen', 500);
        } else {
          for (var i = 0; i < numPlayers; i++) {
              if(playerData[i].player_name == scene.game.playerName) {
                scene.game.playerID = playerData[i].id;
              }
            }
            if(this.serverInfoLoop)
            scene.time.addEvent({
              delay: 500,
              callback: () => web.getServerInfo(scene)
            });
        }
      }
      function characterServerInfoSection(scene){
        //serverIP, playerData, es global
        console.log("Players: " + JSON.stringify(playerData));

        numPlayers = playerData.length;
        if (numPlayers < 3) {
          document.getElementById("chatArea").innerHTML += "Someone left the server. <br />";
		    	cam.fadeOut(500);
          scene.game.customTransition(scene, 'menu', 500);
        } else {
          for (var i = 0; i < 3; i++) {
            DeactivateRole(i);
          }
          for (var i = 0; i < numPlayers; i++) {
              if(playerData[i].player_name == scene.game.playerName) {
                scene.game.playerID = playerData[i].id;
                scene.game.characterSel = playerData[i].character_selection;
              }
              for (var j = 0; j < 3; j++) {
                if(playerData[i].character_selection == j){
                  ActiveRole(j);
                }
              }
            }
            if(this.serverInfoLoop)
            scene.time.addEvent({
            delay: 500,
            callback: () => getServerInfo(scene, serverIP)
          });
        }
      }

      function defaultServerInfoSection(scene){
        //serverIP, playerData, es global
        console.log("Players: " + JSON.stringify(playerData));

        numPlayers = playerData.length;
        if (numPlayers < 3) {
          document.getElementById("chatArea").innerHTML += "Someone left the server. <br />";
		    	cam.fadeOut(500);
          scene.game.customTransition(scene, 'menu', 500);
        } else {
            if(this.serverInfoLoop)
            scene.time.addEvent({
            delay: 500,
            callback: () => getServerInfo(scene, serverIP)
          });
        }
      }

      this.getServerInfo = function(scene) {
        //serverIP, disconnectCounter, waitingPlayersText, playerData, es global
        if (scene.game.online && (disconnectCounter < 3)) {
          $.ajax({
          url: 'http://' + serverIP + ':8080/players/data/' + scene.game.playerID
          }).done(function (playerData) {
            //dependiendo de la escena se ejecuta una funcion u otra
            if(scene.scene.key = "waitingScreen")
              waitingServerInfoSection(scene);
            else if(scene.scene.key = "selectionScreen")
              characterServerInfoSection(scene);
            else
              defaultServerInfoSection(scene);

          }).fail(function () {
            disconnectCounter++;
            if (disconnectCounter >= 3) {
              scene.game.online = false;
            }

            if(this.serverInfoLoop)
            scene.time.addEvent({
              delay: 500,
              callback: () => web.getServerInfo(scene)
            });
          });
        } else {
          console.log("Disconected from server");
          document.getElementById("chatArea").innerHTML += "Disconected from server <br />"
          scene.game.customTransition(scene, 'connectionFailed', 100);
        }
      }

      //___
      this.getNewChats = function(scene) {
        //serverIP, chatData son globales
        if (scene.game.online) {
          $.ajax({
            url: 'http://' + serverIP + ':8080/players/chat/'
            }).done(function (chatData) {
              scene.game.textToChat(chatData);
              if(this.chatLoop)
                scene.time.addEvent({
                  delay: 500,
                  callback: () => web.getNewChats(scene)
                });
            }).fail(function () {
              if(this.chatLoop)
                scene.time.addEvent({
                  delay: 500,
                  callback: () => web.getNewChats(scene)
                });
            });
        }
      }

      this.loopServerInfoStart = function(){
        this.serverInfoLoop = true;
        this.time.addEvent({
    			delay: 500,
    			callback: () => web.getServerInfo(this)
    		});
      }
      this.loopServerInfoStop = function(delay = 0){
        if(delay == 0)
          this.serverInfoLoop = false;
        else
          this.time.addEvent({
            delay: delay,
            callback: () => this.serverInfoLoop = false
          });
      }

      this.loopChatStart = function(){
        this.chatLoop = true;
        this.time.addEvent({
    			delay: 250,
    			callback: () => web.getNewChats(this)
    		});
      }
      this.loopChatStop = function(delay = 0){
        if(delay == 0)
          this.chatLoop = false;
        else
          this.time.addEvent({
            delay: delay,
            callback: () => this.chatLoop = false
          });
      }
  }
  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {
    //console.log(web);
  }
}
