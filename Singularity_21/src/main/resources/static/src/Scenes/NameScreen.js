// Variables del menú,
var buttonArray;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;
var nameText;
var passText;
var errorText;
var canWriteName = false;
var canWritePass = false;

// Funcion que detecta donde esta el raton y activa la luz correspondiente segun su posicion.
function CheckOption3(scene) {
  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 395 + 70 * i && scene.input.mousePointer.y < 465 + 70 * i){
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
class SceneName extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("nameScreen");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
	 var actualScene = this;

    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Añadimos los sonidos a la escena.
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');

    // Añadimos el background y el fondo.
    this.add.image(960/2, 540/2, 'interfazBg');
    this.add.image(960/2, 540/2, 'interfazTitle');

    // Añadimos el texto para introducir el nombre del jugador.
    this.add.image(960/2, 540/2, 'text_enterYourName');

    // Añadimos el texto correspondiente al nombre del jugador dentro de la partida.
    nameText = this.add.text(960/2, 240, this.game.playerName, { fontFamily: 'Impact', fontSize: '32px', fill: '#fff', align: 'center', }).setDepth(1);
    nameText.setStroke('rgba(0,0,0,1)', 4);
    passText = this.add.text(960/2, 340, "", { fontFamily: 'Impact', fontSize: '32px', fill: '#fff', align: 'center', }).setDepth(1);
    passText.setStroke('rgba(0,0,0,1)', 4);
    errorText = this.add.text(960/2, 385, "", { fontFamily: 'Arial', fontSize: '14px', fill: '#f00', align: 'center', }).setDepth(1);
    errorText.setStroke('rgba(0,0,0,1)', 4);
    actualScene.game.playerPassword = "";

    // Funcion que detecta las teclas pulsadas (hecho con HTML y javascript puro).
    document.addEventListener('keydown', function(event) {
        if (canWriteName) {
          var character = event.which || event.keyCode;

          if (character == 8 && nameText.text.length > 0)
              nameText.setText(nameText.text.substring(0, nameText.text.length - 1));
          else if (((character >= 65 && character <= 90) || (character >= 97 && character <= 122) || (character >= 48 && character <= 57)) && nameText.text.length < 14)
              nameText.setText(nameText.text + String.fromCharCode(character));
          else if (character == 32)
              nameText.setText(nameText.text + " ");
      }
        else if (canWritePass) {
          var character = event.which || event.keyCode;

          if (character == 8 && actualScene.game.playerPassword.length > 0)
        	  actualScene.game.playerPassword = actualScene.game.playerPassword.substring(0, actualScene.game.playerPassword.length - 1);
          else if (((character >= 65 && character <= 90) || (character >= 97 && character <= 122) || (character >= 48 && character <= 57)) && actualScene.game.playerPassword.length < 14)
        	  actualScene.game.playerPassword += String.fromCharCode(character);
          else if (character == 32)
        	  actualScene.game.playerPassword += " ";

          var passHidden = "";
          for(var i = 0; i < actualScene.game.playerPassword.length; i++)
            passHidden += "*";
          passText.setText(passHidden);
        }
    });


  //Create player in server
  /*APIREST
	function createPlayer(serverIP, player, callback) {
	    $.ajax({
	        method: "POST",
	        url: 'http://' + serverIP + ':8080/players',
	        //url: 'http://10.10.109.158:8080/players',
	        data: JSON.stringify(player),
	        processData: false,
	        headers: {
	            "Content-Type": "application/json"
	        }
	    }).done(function (player) {
	        console.log("Player connected: " + JSON.stringify(player));
	        callback(player);
	    })
	}*/

    // Añadimos las luces que indicaran que boton del menu esta activo. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){
      scene.scene.start(nombreEscena);
		}
    /*APIREST
    function LoadScene(scene, nombreEscena){
    	if(nombreEscena == "waitingScreen") {

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

				    createPlayer(scene.game.serverIP, player, function (playerWithId) {
				    	scene.game.playerID = playerWithId.id;
				    	scene.game.online = true;
				    	scene.scene.start(nombreEscena);
				    });
				});
		} else {
			scene.scene.start(nombreEscena);
		}
  }*/
    /*APIREST
    function getServerInfo(scene, serverIP) {
			$.ajax({
		        url: 'http://' + serverIP + ':8080/players/login/' + nameText.text + '/' + actualScene.game.playerPassword
		    }).done(function (login) {
		        if(login == 0){
		        	errorText.setText("That user is already playing.");
		        } else if (login == 1) {
		        	errorText.setText("Password is incorrect.");
		        } else{
	        		isChangingScene = true;
	                canWriteName = false;
	                canWritePass = false;
	                cam.fadeOut(1000);
	                scene.time.addEvent({
	                  delay: 1000,
	                  callback: () => LoadScene(scene, 'waitingScreen')
	                });
	        	}
		    })
	}*/

      buttonArray = [
        new Button(this, 960/2, 430, 'light', function() {


        selectedSound.play({ volume: this.scene.game.soundVolume });
        if (actualScene.game.playerPassword.length < 4 && this.scene.game.playerName.length < 4)
          errorText.setText("Password and name are too short.");
        else if (nameText.text.length < 4)
          errorText.setText("Name is too short.");
        else if (actualScene.game.playerPassword.length < 4)
          errorText.setText("Password is too short.");
        // Preguntar al servidor para comparar usuario y contraseña. Si no coinciden, no continuar.
        //if(!Coincide)
        //  errorText.setText("...");
        else {
        	//APIREST  getServerInfo(actualScene, actualScene.game.serverIP);
          isChangingScene = true;
          canWriteName = false;
          canWritePass = false;
          cam.fadeOut(1000);
          actualScene.time.addEvent({
            delay: 1000,
            callback: () => LoadScene(actualScene, 'waitingScreen')
          });
        }
        },),
      new Button(this, 960/2, 500, 'light', function() {
        selectedSound.play({ volume: this.scene.game.soundVolume });
        isChangingScene = true;
        canWriteName = false;
        canWritePass = false;
        cam.fadeOut(1000);
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => LoadScene(this.scene, 'menu')
        });
      },)
    ];

      // Hacemos a todas las luces invisibles al inicio de la escena.
      for (var i = 0; i < buttonArray.length; i++) {
        buttonArray[i].alpha = 0;
      }

      // Añadimos los textos de los botones.
      this.add.image(960/2, 430, 'text_joinGame');
      this.add.image(960/2, 500, 'text_back');

      // Añadimos los text boxes.
      var nameTextBox = this.add.sprite(960/2, 240, 'textBox');
      nameTextBox.setInteractive();
      nameTextBox.on('pointerover', () => { nameTextBox.setFrame(canWriteName ? 4 : 1); });
      nameTextBox.on('pointerdown', () => { canWriteName = true; canWritePass = false; passTextBox.setFrame(0); nameTextBox.setFrame(5); });
      nameTextBox.on('pointerout',  () => { nameTextBox.setFrame(canWriteName ? 3 : 0); });
      nameTextBox.on('pointerup',   () => { nameTextBox.setFrame(canWriteName ? 4 : 1); });

      var passTextBox = this.add.sprite(960/2, 340, 'textBox');
      passTextBox.setInteractive();
      passTextBox.on('pointerover', () => { passTextBox.setFrame(canWritePass ? 4 : 1); });
      passTextBox.on('pointerdown', () => { canWriteName = false; canWritePass = true; nameTextBox.setFrame(0); passTextBox.setFrame(5); });
      passTextBox.on('pointerout',  () => { passTextBox.setFrame(canWritePass ? 3 : 0); });
      passTextBox.on('pointerup',   () => { passTextBox.setFrame(canWritePass ? 4 : 1); });

      // Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
      // Indica que funcion hay que ejecutar segun la opcion seleccionada en el menu.
      this.input.on('pointerdown', function () {
      for (var i = 0; i < buttonArray.length; i++) {
        if (!isChangingScene && buttonArray[i].isActive) {
          buttonArray[i].Behaviour();
        }
      }
    });

  }

  // Funcion update, que se ejecuta en cada frame.
  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {
  // Solo si no se esta cambiando de escena, se comprobara sobre que boton se encuentra el raton en cada momento.
  if (!isChangingScene)
    CheckOption3(this);

  // Se ejecuta el update de cada boton.
    for (var i = 0; i < buttonArray.length; i++) {
      buttonArray[i].Update(time, delta);
    }

    this.game.playerName = nameText.text;
    nameText.setOrigin(0.5, 0.5);
    passText.setOrigin(0.5, 0.5);
    errorText.setOrigin(0.5, 0.5);

    console.log(this.game.playerPassword.length);
  }
}
