//Variables del menú
var buttonArray;
var fade;
var audioManager;
import Button from "./button.js";
import AudioManager from "./audioManager.js";
import Fade from "./fade.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {

  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 209 + 70 * i && scene.input.mousePointer.y < 279 + 70 * i){
      if (!buttonArray[i].isActive)
        audioManager.PlayMenuHover();
      buttonArray[i].isActive = true;
    }
    else {
      buttonArray[i].isActive = false;
    }
  }
}
//clase escena 1
export default class Scene1 extends Phaser.Scene{
  constructor(){
    super("menu");
  }

  //Función preload, que carga elementos antes de iniciar el juego
  preload ()
  {
    audioManager = new AudioManager(this);
    audioManager.preload();
  	//Cargamos el fondo y la pantalla negra que servirá como transición
    this.load.image('interfazBg', 'assets/Interfaz/BG.png');
	  this.load.image('interfazTitle', 'assets/Interfaz/Title.png');
  	this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');

  	//Cargamos los textos del menú
  	this.load.image('text_online', 'assets/Interfaz/Text_Online.png');
  	this.load.image('text_local', 'assets/Interfaz/Text_Local.png');
  	this.load.image('text_options', 'assets/Interfaz/Text_Options.png');
  	this.load.image('text_credits', 'assets/Interfaz/Text_Credits.png');

  	//Cargamos el sprite de la luz
  	this.load.image('light', 'assets/Interfaz/Light.png');
  }
  //Función create, que crea los elementos del propio juego
  create ()
  {
	  audioManager.create();
	  audioManager.PlayMenuMusic();
    //Añadimos el background y el título
    this.add.image(960/2, 540/2, 'interfazBg');
	  this.add.image(960/2, 540/2, 'interfazTitle');
  	//Añadimos la pantalla negra que servirá de transición entre escenas
  	fade = new Fade(this, 960/2, 540/2, 'interfazBs');
  	//Añadimos las luces que indicarán que botón del menú está activo
  	buttonArray = [
  		new Button(this, 960/2, 244, 'light', function() {
  			fade.isChangingScene = true;
        fade.nextScene = "onlineMode";
        audioManager.PlayMenuSelected();
  		}),
  		new Button(this, 960/2, 314, 'light', function() {
  			fade.isChangingScene = true;
        fade.nextScene = "level1";
        audioManager.PlayMenuSelected();
  		}),
  		new Button(this, 960/2, 384, 'light', function() {
  			fade.isChangingScene = true;
        fade.nextScene = "options";
        audioManager.PlayMenuSelected();
  		}),
  		new Button(this, 960/2, 450, 'light', function() {},)
  	];
  	//Hacemos a todas las luces invisibles en un primer momento.
  	for (var i = 0; i < buttonArray.length; i++) {
  		buttonArray[i].alpha = 0;
  	}
  	//Añadimos los textos de los botones.
  	this.add.image(960/2, 244, 'text_online');
  	this.add.image(960/2, 314, 'text_local');
  	this.add.image(960/2, 384, 'text_options');
  	this.add.image(960/2, 450, 'text_credits');
  	//Añadimos la función que se ejecutará al presionar el botón izquierdo del ratón.
  	//Indica qué función hay que ejecutar según la opción seleccionada en el menú
  	this.input.on('pointerdown', function () {
  	for (var i = 0; i < buttonArray.length; i++) {
  		if (!fade.isChangingScene && buttonArray[i].isActive) {
  			buttonArray[i].Behaviour();
  		}
  	}
  	});
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
    CheckOption(this);
  	for (var i = 0; i < buttonArray.length; i++) {
  	  buttonArray[i].Update(time, delta);
  	}
  	fade.Update(time, delta);
  }
}