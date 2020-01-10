// Variables del menú.
var backButton;
var retryButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

// Funcion que detecta si el raton se encuentra sobre el boton 'back' o el 'try again' y activa su luz en caso afirmativo.
function CheckOption5(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;

  if (scene.input.mousePointer.y > retryButton.y - 35 && scene.input.mousePointer.y < retryButton.y + 35) {
    if (!retryButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
        retryButton.isActive = true;
  }
  else
  retryButton.isActive = false;
}
// Clase correspondiente a la escena de la pantalla de derrota.
class SceneDefeat extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("defeat");
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
    this.add.image(960/2, 540/2, 'textDefeat');

    // Añadimos los botones. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    /*
    function FinalSolution(scene, start) {
        scene.game.scene1Counter++;
        scene.scene.remove('level1'+ (scene.game.scene1Counter-1));
        scene.game.scene.add('', new Scene2('level1'), start);
    }*/
  	backButton = new Button(this, 960/2, 500, 'light', function() {
        selectedSound.play({ volume: this.scene.game.soundVolume });
		isChangingScene = true;
		this.scene.game.customTransition(this.scene, 'menu', 1000);
        cam.fadeOut(1000);
        //this.scene.game.customTransition(this.scene, 'menu', 1000)
    });
    retryButton = new Button(this, 960/2, 400, 'light', function() {
        selectedSound.play({ volume: this.scene.game.soundVolume });
        isChangingScene = true;
        this.scene.game.customTransition(this.scene, 'level1', 1000);
        cam.fadeOut(1000);
    });

  	// Hacemos las luces invisibles.
    backButton.alpha = 0;
    retryButton.alpha = 0;

    // Añadimos los textos.
    this.add.image(960/2, 400, 'text_tryAgain');
    this.add.image(960/2, 500, 'text_goToMenu');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
    // Si se esta sobre el boton 'back', se volvera al menu principal.
    // Si esta sobre el boton 'try again', se volvera al nivel 1.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene) {
            if (backButton.isActive)
                backButton.Behaviour();
            else if (retryButton.isActive)
                retryButton.Behaviour();
        }
      });

  }
  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {
    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre los botones en cada momento.
    if (!isChangingScene)
      CheckOption5(this);

    // Se ejecuta el update de cada boton.
    backButton.Update(time, delta);
    retryButton.Update(time, delta);

  }
}
