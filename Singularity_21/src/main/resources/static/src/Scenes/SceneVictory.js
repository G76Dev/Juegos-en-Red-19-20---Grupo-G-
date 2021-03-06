// Variables del menu.
var backButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

// Funcion que detecta si el raton se encuentra sobre el boton 'back' y activa su luz en caso afirmativo.
function CheckOption10(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}

// Clase correspondiente a la escena de la pantalla de victoria.
class SceneVictory extends Phaser.Scene{

  // Constructor de la escena.
  constructor(){
    super("victory");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {

    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Reproducimos la musica correspondiente.
    this.game.currentMusic.stop();
    this.game.currentMusic = this.sound.add('menuMusic', { loop: true, volume: this.game.musicVolume });
    this.game.currentMusic.play();

    // Añadimos los sonidos a la escena.
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');

    // Añadimos el background.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos el texto de victoria.
    this.add.image(960/2, 540/2, 'textVictory');

    // Añadimos el boton de 'back'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
  	backButton = new Button(this, 960/2, 500, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
      isChangingScene = true;
      this.scene.game.customTransition(this.scene, 'menu', 1000);
			cam.fadeOut(1000);
    });

  	// Hacemos la luz invisible.
    backButton.alpha = 0;

  	//Añadimos el texto de 'go to menu'.
    this.add.image(960/2, 500, 'text_goToMenu');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
  	// Si se esta sobre el boton 'back', se volverá al menu principal.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene && backButton.isActive) {
            backButton.Behaviour();
        }
    });

  }
  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre el boton 'back' en cada momento.
    if (!isChangingScene)
      CheckOption10(this);

    // Se ejecuta el update del boton 'back'.
  	backButton.Update(time, delta);
  }
}
