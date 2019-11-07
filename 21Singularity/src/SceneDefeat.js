//Variables del menú
var backButton;
var retryButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;
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

  if (scene.input.mousePointer.y > retryButton.y - 35 && scene.input.mousePointer.y < retryButton.y + 35) {
    if (!retryButton.isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
        retryButton.isActive = true;
  }
  else
  retryButton.isActive = false;
    
}
//clase escena online mode
export default class SceneDefeat extends Phaser.Scene{
  constructor(){
    super("defeat");
  }
  
  //Función create, que crea los elementos del propio juego
  create ()
  {
    isChangingScene = false;
	// Música
	this.game.currentMusic.stop();
	this.game.currentMusic = this.sound.add('menuMusic', { loop: true, volume: this.game.musicVolume });
	this.game.currentMusic.play();
    //Añadimos los sonidos a la escena
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');
    //Añadimos el background
    this.add.image(960/2, 540/2, 'interfazBg');
    //Añadimos el texto de victoria.
    this.add.image(960/2, 540/2, 'textDefeat');
    //Añadimos los botones.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
  	backButton = new Button(this, 960/2, 500, 'light', function() {
		isChangingScene = true;
        cam.fadeOut(1000);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => LoadScene(this.scene, 'menu')
        });
    });
    retryButton = new Button(this, 960/2, 400, 'light', function() {
        isChangingScene = true;
        cam.fadeOut(1000);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => LoadScene(this.scene, 'level1')
        });
    });
  	//Hacemos la luz invisible
    backButton.alpha = 0;
    retryButton.alpha = 0;
    //Añadimos los textos.
    this.add.image(960/2, 400, 'text_tryAgain');
  	this.add.image(960/2, 500, 'text_goToMenu');
  	//Añadimos la función que se ejecutará al presionar el botón izquierdo del ratón.
  	//Si se está sobre el botón 'back', se volverá al menú principal.
  	this.input.on('pointerdown', function () {
        if (!isChangingScene) {
            if (backButton.isActive)
                backButton.Behaviour();
            else if (retryButton.isActive)
                retryButton.Behaviour();
        }
  	});
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
    if (!isChangingScene)
      CheckOption(this);
    backButton.Update(time, delta);
    retryButton.Update(time, delta);
  }
}