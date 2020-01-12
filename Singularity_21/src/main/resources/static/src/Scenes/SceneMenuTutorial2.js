// Variables del menu.
var goToMenuButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

// Funcion que detecta si el raton se encuentra sobre el boton 'goToMenu' y activa su luz en caso afirmativo.
function CheckOption7(scene) {
  if (scene.input.mousePointer.y > goToMenuButton.y - 35 && scene.input.mousePointer.y < goToMenuButton.y + 35) {
    if (!goToMenuButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
    goToMenuButton.isActive = true;
  }
  else
    goToMenuButton.isActive = false;
}
// Clase correspondiente a la escena del tutorial del menu.
class SceneMenuTutorial2 extends Phaser.Scene{
  // Constructor de la escena.
  constructor(){
    super("menuTutorial2");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Añadimos los sonidos a la escena.
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');

    // Añadimos el background.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos la imagen del tutorial.
    this.add.image(960/2, 540/2, 'menuTutorial2');

    // Añadimos el boton de 'goToMenu'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
  	goToMenuButton = new Button(this, 960/2, 500, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
      isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'menu')
			});
    });

  	// Hacemos la luz invisible.
    goToMenuButton.alpha = 0;

  	// Añadimos el texto de 'goToMenu'.
    this.add.image(960/2, 500, 'text_goToMenu');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
  	// Si se esta sobre el boton 'goToMenu', se volverá al menu principal.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene && goToMenuButton.isActive) {
            goToMenuButton.Behaviour();
        }
    });

  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre el boton 'goToMenu' en cada momento.
    if (!isChangingScene)
        CheckOption7(this);

    // Se ejecuta el update del boton 'goToMenu'.
    goToMenuButton.Update(time, delta);

  }
}
