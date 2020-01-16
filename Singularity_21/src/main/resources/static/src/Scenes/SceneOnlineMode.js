// Variables del menú,
var backButton;
var cam;

// Funcion que detecta si el raton se encuentra sobre el boton 'back' y activa su luz en caso afirmativo.
function CheckOption8(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
        hoverSound.play({ volume: game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}

// Clase correspondiente a la escena del modo online.
class SceneOnlineMode extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("onlineMode");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
    // Variable que indica si se está cambiando de escena.
    isChangingScene = false;

    // Añadimos el background.
    this.add.image(960/2, 540/2, 'interfazBg');

    // Añadimos el texto de la pantalla del modo online provisional (hasta fase 3-4).
    this.add.image(960/2, 540/2, 'text_onlineMode');

    // Añadimos el botón de 'back'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);

    function LoadScene(scene, nombreEscena){
    	scene.scene.start(nombreEscena);
    }

  	backButton = new Button(this, 960/2, 405, 'light', function() {
  		selectedSound.play({ volume: game.soundVolume });
  		isChangingScene = true;
		cam.fadeOut(1000);
		this.scene.time.addEvent({
			delay: 1000,
			callback: () => LoadScene(this.scene, 'menu')
		});
    });

  	// Hacemos la luz invisible.
    backButton.alpha = 0;

  	// Añadimos el texto de 'back'.
    this.add.image(960/2, 405, 'text_back');

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
      CheckOption8(this);

    // Se ejecuta el update del boton 'back'.
  	backButton.Update(time, delta);
  }
}
