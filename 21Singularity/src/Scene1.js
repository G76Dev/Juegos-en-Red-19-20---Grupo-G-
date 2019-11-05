//Variables del menú
var buttonArray;
var fade;
var hoverSound;
var selectedSound;
import Button from "./button.js";
import Fade from "./fade.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {

  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 209 + 70 * i && scene.input.mousePointer.y < 279 + 70 * i){
      if (!buttonArray[i].isActive)
        hoverSound.play();
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
  //Función create, que crea los elementos del propio juego
  create ()
  {
	//Añadimos los sonidos a la escena
	hoverSound = this.sound.add('menuHover');
	selectedSound = this.sound.add('menuSelected');

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
			selectedSound.play();
  		}),
  		new Button(this, 960/2, 314, 'light', function() {
  			fade.isChangingScene = true;
        	fade.nextScene = "level2";
			selectedSound.play();
  		}),
  		new Button(this, 960/2, 384, 'light', function() {
  			fade.isChangingScene = true;
        	fade.nextScene = "options";
			selectedSound.play();
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