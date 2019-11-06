//Variables del menú
var backButton;
var fade;
var hoverSound;
var selectedSound;
import Button from "./button.js";
import Fade from "./fade.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {
  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) {
    if (!backButton.isActive)
      hoverSound.play();
    backButton.isActive = true;
  }
  else
    backButton.isActive = false;
}
//clase escena options
export default class Scene1 extends Phaser.Scene{
  constructor(){
    super("options");
  }
  
  //Función create, que crea los elementos del propio juego
  create ()
  {
    //Añadimos los sonidos a la escena
    hoverSound = this.sound.add('menuHover');
    selectedSound = this.sound.add('menuSelected');
    //Añadimos el background
    this.add.image(960/2, 540/2, 'interfazBg');
    //Añadimos las opciones.
    this.add.image(960/2, 540/2, 'options');
  	//Añadimos la pantalla negra que servirá de transición entre escenas
  	fade = new Fade(this, 960/2, 540/2, 'interfazBs');
  	//Añadimos el botón de 'back'
  	backButton = new Button(this, 960/2, 405, 'light', function() {
  			fade.isChangingScene = true;
        fade.nextScene = "menu";
        selectedSound.play();
  		});
  	//Hacemos la luz invisible
  	backButton.alpha = 0;
  	//Añadimos el texto de 'back'.
  	this.add.image(960/2, 405, 'text_back');
  	//Añadimos la función que se ejecutará al presionar el botón izquierdo del ratón.
  	//Si se está sobre el botón 'back', se volverá al menú principal.
  	this.input.on('pointerdown', function () {
        if (!fade.isChangingScene && backButton.isActive) {
            backButton.Behaviour();
        }
    });
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
    if (!fade.isChangingScene)
      CheckOption(this);
  	backButton.Update(time, delta);
  	fade.Update(time, delta);
  }
}