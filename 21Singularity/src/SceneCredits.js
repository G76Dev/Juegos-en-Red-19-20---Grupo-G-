//Variables del menú
var backButton;
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
}
//clase escena online mode
export default class SceneCredits extends Phaser.Scene{
  constructor(){
    super("credits");
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
    //Añadimos el texto de la pantalla del modo online provisional (hasta fase 3-4).
    this.add.image(960/2, 540/2, 'text_onlineMode');
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
  	});
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
    if (!isChangingScene)
      CheckOption(this);
  	backButton.Update(time, delta);
  }
}