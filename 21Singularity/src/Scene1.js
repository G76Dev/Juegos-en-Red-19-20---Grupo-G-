//Variables del menú
var buttonArray;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;
import Button from "./button.js";
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {
  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 179 + 70 * i && scene.input.mousePointer.y < 249 + 70 * i){
      if (!buttonArray[i].isActive)
        hoverSound.play({ volume: scene.game.soundVolume });
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
	isChangingScene = false;
	//Añadimos los sonidos a la escena
	hoverSound = this.sound.add('menuHover');
	selectedSound = this.sound.add('menuSelected');

    //Añadimos el background y el título
    this.add.image(960/2, 540/2, 'interfazBg');
	this.add.image(960/2, 540/2, 'interfazTitle');
	//Añadimos las luces que indicarán que botón del menú está activo
	cam = this.cameras.main;
	cam.fadeIn(1000);
	function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
  	buttonArray = [
  		new Button(this, 960/2, 214, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'onlineMode')
			});
  		}),
  		new Button(this, 960/2, 284, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'level1' + this.scene.game.scene1Counter)
			});
  		}),
  		new Button(this, 960/2, 354, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'options')
			});
  		}),
  		new Button(this, 960/2, 420, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'level2')
			});
		  },),
		new Button(this, 960/2, 486, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => LoadScene(this.scene, 'menuTutorial')
			});
		},)
  	];
  	//Hacemos a todas las luces invisibles en un primer momento.
  	for (var i = 0; i < buttonArray.length; i++) {
  		buttonArray[i].alpha = 0;
  	}
  	//Añadimos los textos de los botones.
  	this.add.image(960/2, 214, 'text_online');
  	this.add.image(960/2, 284, 'text_local');
  	this.add.image(960/2, 354, 'text_options');
	this.add.image(960/2, 420, 'text_credits');
	this.add.image(960/2, 486, 'text_tutorial');
  	//Añadimos la función que se ejecutará al presionar el botón izquierdo del ratón.
  	//Indica qué función hay que ejecutar según la opción seleccionada en el menú
  	this.input.on('pointerdown', function () {
  	for (var i = 0; i < buttonArray.length; i++) {
  		if (!isChangingScene && buttonArray[i].isActive) {
  			buttonArray[i].Behaviour();
  		}
  	}
  	});
  }
  //Función update, que se ejecuta en cada frame
  update (time, delta)
  {
	if (!isChangingScene)
    	CheckOption(this);
  	for (var i = 0; i < buttonArray.length; i++) {
  	  buttonArray[i].Update(time, delta);
  	}
  }
}