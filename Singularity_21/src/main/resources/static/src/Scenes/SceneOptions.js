// Variables del menu.
var backButton;

var cam;

var soundVolume = 0.2;
var musicVolume = 0.3;

var sliderMinPosX = 440;
var sliderMaxPosX = 600;

var musicSlider;
var musicOff;
var soundSlider;
var soundOff;
var currentSlider = null;
var long = 10;

// Funcion que detecta si el raton se encuentra sobre el boton 'back' y activa su luz en caso afirmativo.
function CheckOption9(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
      hoverSound.play({ volume: game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}

// Funcion que detecta si el raton esta sobre cierto slider.
function IsOnSlider(slider, scene) {
  return (slider.x > scene.input.mousePointer.x - long && slider.x < scene.input.mousePointer.x + long &&
    slider.y > scene.input.mousePointer.y - long && slider.y < scene.input.mousePointer.y + long);
}

// Clase correspondiente a la escena de la pantalla de opciones.
class SceneOptions extends Phaser.Scene {
  // Constructor de la escena.
  constructor(){
    super("options");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {

    // Variable que indica si se esta cambiando de escena.
    isChangingScene = false;

    // Añadimos el background.
    const backgroundimg = this.matter.add.sprite(960/2, 540/2, "Portrait", 0);
    backgroundimg.anims.play('portrait_anim', true);
    backgroundimg.setStatic(true);

    // Añadimos las opciones.
    this.add.image(960/2, 540/2, 'options');

    // Añadimos los botones deslizantes de cada barra.
    soundSlider = this.add.image(sliderMinPosX + game.soundVolume * (sliderMaxPosX - sliderMinPosX), 186, 'sliderObject');
    musicSlider = this.add.image(sliderMinPosX + game.musicVolume * (sliderMaxPosX - sliderMinPosX), 264, 'sliderObject');

    // Añadimos las cruces que indicarán que la musica o los sonidos estan silenciados del todo.
    soundOff = this.add.image(384, 186, 'X');
    musicOff = this.add.image(384, 264, 'X');

    // Añadimos el boton de 'back'. Hacemos tambien un fade con la camara.
    cam = this.cameras.main;
    //cam.fadeIn(1000);
  	backButton = new Button(this, 960/2, 405, 'light', function() {
			selectedSound.play({ volume: game.soundVolume });
      isChangingScene = true;
      //cam.fadeOut(1000);
      game.customTransition(this.scene, 'menu', 0);
    });

  	// Hacemos la luz invisible.
    backButton.alpha = 0;

  	// Añadimos el texto de 'back'.
    this.add.image(960/2, 405, 'text_back');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
    // Si se esta sobre el boton 'back', se volverá al menu principal.
    // Si se esta sobre algun slider, este quedara marcado y podra ajustarse con el raton.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene && backButton.isActive) {
            backButton.Behaviour();
        }
        else if (IsOnSlider(musicSlider, this.scene))
          currentSlider = musicSlider;
        else if (IsOnSlider(soundSlider, this.scene))
          currentSlider = soundSlider;
        else
          currentSlider = null;
    });

    // Al levantar dejar de presionar el boton izquierdo del raton, se dejara de marcar el slider seleccionado previamente.
    this.input.on('pointerup', function() { currentSlider = null; });
  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {

    // Solo si no se esta cambiando de escena, se comprobara si se esta sobre el boton 'back' en cada momento.
    if (!isChangingScene)
      CheckOption9(this);

    // Se clampeara la posicion del selector del slider para que no sobrepase ciertos limites.
    if (currentSlider != null)
      currentSlider.x = Math.min(Math.max(this.input.mousePointer.x, sliderMinPosX), sliderMaxPosX);

    // Se ajustan los volumenes del sonido y de la musica en funcion de los valores de posicion de los sliders.
    game.soundVolume = (soundSlider.x - sliderMinPosX) / (sliderMaxPosX - sliderMinPosX);
    soundOff.visible = (game.soundVolume == 0);
    game.musicVolume = (musicSlider.x - sliderMinPosX) / (sliderMaxPosX - sliderMinPosX);
    musicOff.visible = (game.musicVolume == 0);

    // Se ejecuta el update del boton 'back'.
  	backButton.Update(time, delta);

    // Se actualiza el volumen de la musica general del juego (el volumen de los sonidos se indica al reproducir los propios sonidos).
    game.currentMusic.volume = game.musicVolume;

  }
}
