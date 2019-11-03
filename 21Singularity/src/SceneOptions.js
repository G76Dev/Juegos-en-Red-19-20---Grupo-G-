//Variables del menú
var backButton;
var fade;
var audioManager;
import Button from "./button.js";
import AudioManager from "./audioManager.js";
import Fade from "./fade.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {
  if ((scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35) || fade.isChangingScene) {
    if (!backButton.isActive)
      audioManager.PlayMenuHover();
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
  //Función preload, que carga elementos antes de iniciar el juego
  preload ()
  {
    audioManager = new AudioManager(this);
    audioManager.preload();
  	//Cargamos el fondo y la pantalla negra que servirá como transición
    this.load.image('interfazBg', 'assets/Interfaz/BG.png');
  	this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');
    
    //Cargamos la imagen correspondiente a las opciones de música y sonido
    this.load.image('options', 'assets/Interfaz/Options.png');
    
  	//Cargamos el texto 'back'
  	this.load.image('text_back', 'assets/Interfaz/Text_Back.png');

  	//Cargamos el sprite de la luz
  	this.load.image('light', 'assets/Interfaz/Light.png');
  }
  //Función create, que crea los elementos del propio juego
  create ()
  {
    
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
        audioManager.PlayMenuSelected();
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
    CheckOption(this);
  	backButton.Update(time, delta);
  	fade.Update(time, delta);
  }
}