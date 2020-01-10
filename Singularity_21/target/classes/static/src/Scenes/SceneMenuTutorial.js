// Variables del menu.
var nextPageButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

// Funcion que detecta si el raton se encuentra sobre el boton 'nextPage' y activa su luz en caso afirmativo.
function CheckOption6(scene) {
  if (scene.input.mousePointer.y > nextPageButton.y - 35 && scene.input.mousePointer.y < nextPageButton.y + 35) {
    if (!nextPageButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
    nextPageButton.isActive = true;
  }
  else
    nextPageButton.isActive = false;
}
// Clase correspondiente a la escena del tutorial del menu.
class SceneMenuTutorial extends Phaser.Scene{
  // Constructor de la escena.
  constructor(){
    super("menuTutorial");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {

    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Añadimos los sonidos a la escena.
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');

    // Añadimos el nextPageground.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos la imagen del tutorial.
    this.add.image(960/2, 540/2, 'menuTutorial');

    // Añadimos el boton de 'nextPage'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
  	nextPageButton = new Button(this, 960/2, 500, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
      isChangingScene = true;
      		this.scene.game.customTransition(this.scene, 'menuTutorial2', 1000);
			cam.fadeOut(1000);
    });

  	// Hacemos la luz invisible.
    nextPageButton.alpha = 0;

  	// Añadimos el texto de 'nextPage'.
    this.add.image(960/2, 500, 'text_nextPage');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
  	// Si se esta sobre el boton 'nextPage', se volverá al menu principal.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene && nextPageButton.isActive) {
            nextPageButton.Behaviour();
        }
    });

  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre el boton 'nextPage' en cada momento.
    if (!isChangingScene)
        CheckOption6(this);

    // Se ejecuta el update del boton 'nextPage'.
    nextPageButton.Update(time, delta);

  }
}
