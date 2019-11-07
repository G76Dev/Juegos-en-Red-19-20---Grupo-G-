//Variables del menú
var backButton;
var hoverSound;
var selectedSound;

var cam;
var isChangingScene;

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

import Button from "./button.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
      hoverSound.play({ volume: scene.game.soundVolume });
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}
function IsOnSlider(slider, scene) {
  return (slider.x > scene.input.mousePointer.x - long && slider.x < scene.input.mousePointer.x + long &&
    slider.y > scene.input.mousePointer.y - long && slider.y < scene.input.mousePointer.y + long);
}
//clase escena options
export default class Scene1 extends Phaser.Scene{
  constructor(){
    super("options");
  }
  
  //Función create, que crea los elementos del propio juego
  create ()
  {
    isChangingScene = false;
    //Añadimos los sonidos a la escena
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');
    //Añadimos el background
    this.add.image(960/2, 540/2, 'interfazBg');
    //Añadimos las opciones.
    this.add.image(960/2, 540/2, 'options');
    // Añadimos los botones deslizantes de cada barra.
    soundSlider = this.add.image(sliderMinPosX + this.game.soundVolume * (sliderMaxPosX - sliderMinPosX), 186, 'sliderObject');
    musicSlider = this.add.image(sliderMinPosX + this.game.musicVolume * (sliderMaxPosX - sliderMinPosX), 264, 'sliderObject');
    // Añadimos las cruces que indicarán que la música o los sonidos están silenciados del todo.
    soundOff = this.add.image(384, 186, 'X');
    musicOff = this.add.image(384, 264, 'X');
    //Añadimos el botón de 'back'
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
  	backButton = new Button(this, 960/2, 405, 'light', function() {
      isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'menu')
			});
    });
  	//Hacemos la luz invisible
  	backButton.alpha = 0;
  	//Añadimos el texto de 'back'.
  	this.add.image(960/2, 405, 'text_back');
  	//Añadimos la función que se ejecutará al presionar el botón izquierdo del ratón.
  	//Si se está sobre el botón 'back', se volverá al menú principal.
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
    this.input.on('pointerup', function() { currentSlider = null; });
    console.log(this.game.musicVolume);
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
    if (!isChangingScene)
      CheckOption(this);

    if (currentSlider != null)
      currentSlider.x = Math.min(Math.max(this.input.mousePointer.x, sliderMinPosX), sliderMaxPosX);

    this.game.soundVolume = (soundSlider.x - sliderMinPosX) / (sliderMaxPosX - sliderMinPosX);
    soundOff.visible = (this.game.soundVolume == 0);
    this.game.musicVolume = (musicSlider.x - sliderMinPosX) / (sliderMaxPosX - sliderMinPosX);
    musicOff.visible = (this.game.musicVolume == 0);
  	backButton.Update(time, delta);

    this.game.currentMusic.volume = this.game.musicVolume;
  }
}