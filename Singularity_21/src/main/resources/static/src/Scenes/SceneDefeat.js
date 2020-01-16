// Variables del menú.
var backButton;
var retryButton;
var cam;

// Funcion que detecta si el raton se encuentra sobre el boton 'back' o el 'try again' y activa su luz en caso afirmativo.
function CheckOption5(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
        hoverSound.play({ volume: game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;

  if (scene.input.mousePointer.y > retryButton.y - 35 && scene.input.mousePointer.y < retryButton.y + 35) {
    if (!retryButton.isActive)
        hoverSound.play({ volume: game.soundVolume });
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
	game.currentMusic.stop();
	game.currentMusic = this.sound.add('menuMusic', { loop: true, volume: game.musicVolume });
    game.currentMusic.play();

    // Añadimos el background.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos el texto de victoria.
    this.add.image(960/2, 540/2, 'textDefeat');

    // Añadimos los botones. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
    /*
    function FinalSolution(scene, start) {
        scene.game.scene1Counter++;
        scene.scene.remove('level1'+ (scene.game.scene1Counter-1));
        scene.game.scene.add('', new Scene2('level1'), start);
    }*/
  	backButton = new Button(this, 960/2, 500, 'light', function() {
        selectedSound.play({ volume: game.soundVolume });
		isChangingScene = true;
        cam.fadeOut(1000);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => LoadScene(this.scene, 'menu')
        });
    });
    retryButton = new Button(this, 960/2, 400, 'light', function() {
        selectedSound.play({ volume: game.soundVolume });
        isChangingScene = true;
        cam.fadeOut(1000);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => LoadScene(this.scene, 'level1')
        });
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
