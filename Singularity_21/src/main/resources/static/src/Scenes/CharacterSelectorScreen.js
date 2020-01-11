// Variables del menú,
var buttonArray;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

var android1Button;
var android1Idle;
var android1Anim;
var android1IsReady = false;
var android1Ready;
var android1Leave;

var android2Button;
var android2Idle;
var android2Anim;
var android2IsReady = false;
var android2Ready;
var android2Leave;

var humanButton;
var humanIdle;
var humanAnim;
var humanIsReady = false;
var humanReady;
var humanLeave;

var three;
var two;
var one
var startingGame;
var isStartingGame = false;

var selection = -1;

var numPlayers = 3;
var disconnectCounter = 0;

// Funcion que detecta donde esta el raton y activa la luz correspondiente segun su posicion.
function CheckOption1(scene) {
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

function DeactivateRole(i) {
    if (i == 0) {
        android1Idle.setVisible(true);
        android1Anim.setVisible(false);
        android1Ready.setVisible(false);
        android1Leave.setVisible(false);
        android1IsReady = false;
    }
    else if (i == 1) {
        android2Idle.setVisible(true);
        android2Anim.setVisible(false);
        android2Ready.setVisible(false);
        android2Leave.setVisible(false);
        android2IsReady = false;
    }
    else if (i == 2) {
        humanIdle.setVisible(true);
        humanAnim.setVisible(false);
        humanReady.setVisible(false);
        humanLeave.setVisible(false);
        humanIsReady = false;
    }
}

function ActiveRole(i) {
    if (i == 0) {
        android1Idle.setVisible(false);
        android1Anim.setVisible(true);
        android1Ready.setVisible(true);
        android1IsReady = true;
    }
    else if (i == 1) {
        android2Idle.setVisible(false);
        android2Anim.setVisible(true);
        android2Ready.setVisible(true);
        android2IsReady = true;
    }
    else if (i == 2) {
        humanIdle.setVisible(false);
        humanAnim.setVisible(true);
        humanReady.setVisible(true);
        humanIsReady = true;
    }
}

function CheckIfEveryoneIsReady() {
    return android1IsReady && android2IsReady && humanIsReady;
}

function StartGame(scene) {
    isStartingGame = true;
    startingGame.setVisible(true);
    three.setVisible(true);
    scene.time.addEvent({
        delay: 1000,
        callback: () => {
            if (!CheckIfEveryoneIsReady())
                return;
            two.setVisible(true);
            three.setVisible(false);
            scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    if (!CheckIfEveryoneIsReady())
                        return;
                    one.setVisible(true);
                    two.setVisible(false);
                    scene.time.addEvent({
                        delay: 1000,
                        callback: () => {
                            if (!CheckIfEveryoneIsReady())
                                return;
                            isChangingScene = true;
                            // ...
                            this.scene.game.customTransition(this.scene, 'level10', 1000);
                            cam.fadeOut(1000);
                        }
                    });
                }
            });
        }
    });
}

// Clase correspondiente a la escena del modo online.
class SceneCharacterSelection extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("selectionScreen");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
  // Variable que indica si se está cambiando de escena.
  isChangingScene = false;

  var actualScene = this;

  // Añadimos los sonidos a la escena.
  hoverSound = this.sound.add('menuHover');
  selectedSound = this.sound.add('menuSelected');

  // Añadimos el background.
  this.add.image(960/2, 540/2, 'interfazBg');

  // Añadimos el texto de 'VS'
  this.add.image(550, 270, 'text_vs');

  // Añadimos los botones de cada rol.
  android1Button = this.add.sprite(144, 540/2, 'androidSelectionBox').setDepth(1);
  android1Button.setInteractive();
  android1Idle = this.add.sprite(144, 540/2, 'androidMale').setDepth(2);
  android1Idle.setFrame(0);
  android1Anim = this.add.sprite(144, 540/2, 'androidMaleActive');
  android1Anim.anims.play('androidMaleActiveAnim', true);
  android1Anim.setVisible(false);
  android1Ready = this.add.sprite(144, 380, 'ready');
  android1Ready.setVisible(false);
  android1Leave = this.add.sprite(144, 540/2, 'androidLeave').setDepth(3);
  android1Leave.setVisible(false);

  android1Button.on('pointerover', () => {
      if (selection == 0) {
        android1Leave.setVisible(true);
      }
      else if (!android1IsReady) {
        android1Idle.setFrame(1);
      }
    });
  android1Button.on('pointerout', () => {
      if (selection == 0) {
        android1Leave.setVisible(false);
      }
      else if (!android1IsReady) {
        android1Idle.setFrame(0);
      }
    });
  android1Button.on('pointerdown', () => {
      if (!android1IsReady) {
        if (selection >= 0 && selection <= 2) {
        	web.activateDeactivate(actualScene,-1);
        }
        selection = 0;
        web.activateDeactivate(actualScene,selection)
        document.getElementById("chatArea").innerHTML += actualScene.game.playerName + " selected the Male Android. <br />"
        android1Leave.setVisible(true);
      }
      else if(selection == 0) {
    	web.activateDeactivate(actualScene,-1);
        selection = -1;
        android1Idle.setFrame(1);
      }
    });

    android2Button = this.add.sprite(333, 540/2, 'androidSelectionBox').setDepth(1);
    android2Button.setInteractive();
    android2Idle = this.add.sprite(333, 540/2, 'androidFemale').setDepth(2);
    android2Idle.setFrame(0);
    android2Anim = this.add.sprite(333, 540/2, 'androidFemaleActive');
    android2Anim.anims.play('androidFemaleActiveAnim', true);
    android2Anim.setVisible(false);
    android2Ready = this.add.sprite(333, 380, 'ready');
    android2Ready.setVisible(false);
    android2Leave = this.add.sprite(333, 540/2, 'androidLeave').setDepth(3);
    android2Leave.setVisible(false);

    android2Button.on('pointerover', () => {
        if (selection == 1) {
          android2Leave.setVisible(true);
        }
        else if (!android2IsReady) {
          android2Idle.setFrame(1);
        }
      });
    android2Button.on('pointerout', () => {
        if (selection == 1) {
          android2Leave.setVisible(false);
        }
        else if (!android2IsReady) {
          android2Idle.setFrame(0);
        }
      });
    android2Button.on('pointerdown', () => {
        if (!android2IsReady) {
          if (selection >= 0 && selection <= 2) {
        	  web.activateDeactivate(actualScene,-1);
          }
          selection = 1;
          web.activateDeactivate(actualScene,selection)
          document.getElementById("chatArea").innerHTML += actualScene.game.playerName + " selected the Female Android. <br />"
          android2Leave.setVisible(true);
        }
        else if(selection == 1) {
          web.activateDeactivate(actualScene,-1);
          selection = -1;
          android2Idle.setFrame(1);
        }
      });

    humanButton = this.add.sprite(790, 540/2, 'humanSelectionBox').setDepth(1);
    humanButton.setInteractive();
    humanIdle = this.add.sprite(790, 540/2, 'human').setDepth(2);
    humanIdle.setFrame(0);
    humanAnim = this.add.sprite(790, 540/2, 'humanActive');
    humanAnim.anims.play('humanActiveAnim', true);
    humanAnim.setVisible(false);
    humanReady = this.add.sprite(790, 445, 'ready');
    humanReady.setVisible(false);
    humanLeave = this.add.sprite(790, 540/2, 'humanLeave').setDepth(3);
    humanLeave.setVisible(false);

    humanButton.on('pointerover', () => {
        if (selection == 2) {
        humanLeave.setVisible(true);
        }
        else if (!humanIsReady) {
        humanIdle.setFrame(1);
        }
    });
    humanButton.on('pointerout', () => {
        if (selection == 2) {
        humanLeave.setVisible(false);
        }
        else if (!humanIsReady) {
        humanIdle.setFrame(0);
        }
    });
    humanButton.on('pointerdown', () => {
        if (!humanIsReady) {
        if (selection >= 0 && selection <= 2) {
        	web.activateDeactivate(actualScene,-1)
        }
        selection = 2;
        web.activateDeactivate(actualScene,selection)
        document.getElementById("chatArea").innerHTML += actualScene.game.playerName + " selected the Human. <br />"
        humanLeave.setVisible(true);
        }
        else if(selection == 2)  {
    	  web.activateDeactivate(actualScene,-1);
        selection = -1;
        humanIdle.setFrame(1);
        }
    });

    //ActiveRole(1); // Provisional para testear.
    //ActiveRole(2); // Provisional para testear.

    //Añadimos los textos de la cuenta atras.
    three = this.add.image(960/2, 540/2, '3').setDepth(5);
    three.setVisible(false);
    two = this.add.image(960/2, 540/2, '2').setDepth(5);
    two.setVisible(false);
    one = this.add.image(960/2, 540/2, '1').setDepth(5);
    one.setVisible(false);

    //Añadimos el texto para indicar que está comenzando la partida.
    startingGame = this.add.image(960/2, 40, 'text_startingGame').setDepth(6);
    startingGame.setVisible(false); // Comenzara invisible hasta que todos los jugadores esten listos.

  //Añadimos las luces que indicaran que boton del menu esta activo. Hacemos tambien un fade con la camara.
  cam = this.cameras.main;
  cam.fadeIn(1000);

    buttonArray = [
        new Button(this, 960/2, 500, 'light', function() {
        selectedSound.play({ volume: this.scene.game.soundVolume });
        isChangingScene = true;
        // ...
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
  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

  // Solo si no se esta cambiando de escena, se comprobara sobre que boton se encuentra el raton en cada momento.
  if (!isChangingScene)
    CheckOption1(this);

  // Se ejecuta el update de cada boton.
    for (var i = 0; i < buttonArray.length; i++) {
      buttonArray[i].Update(time, delta);
    }

    // Se desactiva la cuenta atras si alguien ha dejado su rol.
    if (!CheckIfEveryoneIsReady()) {
        one.setVisible(false);
        two.setVisible(false);
        three.setVisible(false);
        startingGame.setVisible(false);
        isStartingGame = false;
    }
    // Si todos estan listos y aun no ha empezado la cuenta atras, se comienza.
    else if (!isStartingGame) {
        StartGame(this);
    }

  }

}
