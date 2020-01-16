// Variables del menú.
var buttonArray;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;

// Funcion que detecta donde esta el raton y activa la luz correspondiente segun su posicion.
function CheckOption13(scene) {
  for(var i = 0; i < buttonArray.length; i++) {
    if (scene.input.mousePointer.y > 214 + 70 * i && scene.input.mousePointer.y < 284 + 70 * i){
      if (!buttonArray[i].isActive)
        hoverSound.play({ volume: game.soundVolume });
      buttonArray[i].isActive = true;
    }
    else {
      buttonArray[i].isActive = false;
    }
  }
}
// Clase correspondiente al menu inicial.
class Scene1 extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("menu");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
	game.online = false;
	var actualScene = this;
	// Variable que indica si se está cambiando de escena.
	isChangingScene = false;

	// Añadimos los sonidos a la escena.
	hoverSound = this.sound.add('menuHover');
	selectedSound = this.sound.add('menuSelected');

    // Añadimos el background y el título.
    this.add.image(960/2, 540/2, 'interfazBg');
	this.add.image(960/2, 540/2, 'interfazTitle');

	// Añadimos las luces que indicaran que boton del menu esta activo. Hacemos tambien un fade con la camara.
	cam = this.cameras.main;
	cam.fadeIn(1000);
	
    //Array de botones que componen las opciones a elegir en el menú principal
  	buttonArray = [                           // Este parametro recibe una funcion que se ejecuta al presionar el boton.
      //Boton "Local"
  		new Button(this, 960/2, 249, 'light', function() {
			selectedSound.play({ volume: game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			game.customTransition(this.scene, 'level3', 1000);
  		}),
      //Boton "Options"
  		new Button(this, 960/2, 319, 'light', function() {
			selectedSound.play({ volume: game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			game.customTransition(this.scene, 'options', 1000);
  		}),
      //Boton "Credits"
  		new Button(this, 960/2, 389, 'light', function() {
			selectedSound.play({ volume: game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			game.customTransition(this.scene, 'credits', 1000);
		  },),
      //Boton Tutorial
		new Button(this, 960/2, 459, 'light', function() {
			selectedSound.play({ volume: game.soundVolume });
			isChangingScene = true;
			cam.fadeOut(1000);
			game.customTransition(this.scene, 'menuTutorial', 1000);
		},)
	];

  	// Hacemos a todas las luces invisibles al inicio de la escena.
  	for (var i = 0; i < buttonArray.length; i++) {
  		buttonArray[i].alpha = 0;
	  }

  	// Añadimos los textos de los botones.
  	this.add.image(960/2, 249, 'text_local');
  	this.add.image(960/2, 319, 'text_options');
	this.add.image(960/2, 389, 'text_credits');
	this.add.image(960/2, 459, 'text_tutorial');

  	// Añadimos la funcion que se ejecutara al presionar el boton izquierdo del raton.
  	// Indica que funcion hay que ejecutar segun la opcion seleccionada en el menu.
  	this.input.on('pointerdown', function () {
		for (var i = 0; i < buttonArray.length; i++) {
			if (!isChangingScene && buttonArray[i].isActive) {
				buttonArray[i].Behaviour();
			}
		}
	});


  }

  // Funcion update, que se ejecuta en cada frame.
  update (time, delta)
  {
	// Solo si no se esta cambiando de escena, se comprobara sobre que boton se encuentra el raton en cada momento.
	if (!isChangingScene)
		CheckOption13(this);

	// Se ejecuta el update de cada boton.
  	for (var i = 0; i < buttonArray.length; i++) {
  	  buttonArray[i].Update(time, delta);
	  }
  }
}
