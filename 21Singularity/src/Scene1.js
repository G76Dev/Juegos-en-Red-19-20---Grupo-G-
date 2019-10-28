
//Variables del menú
var buttonArray;
var fade;
//Clase 'Button' correspondiente a la luz que aparece detrás de los textos
class Button extends Phaser.GameObjects.Image {
  static lightChangeVelocity = 0.01;
  Behaviour = function() {};
  constructor(scene, x, y, texture, Behaviour = function() {}, isActive = false) {
    super(scene, x, y, texture);
    scene.add.existing(this);

    this.isActive = isActive;
    this.Behaviour = Behaviour;
  }
  LightOn(delta) {
    this.alpha = Math.max(Math.min(this.alpha + Button.lightChangeVelocity * delta, 1), 0);
  }
  LightOff(delta) {
    this.alpha = Math.max(Math.min(this.alpha - Button.lightChangeVelocity * delta, 1), 0);
  }
  Update(time, delta) {
    if (this.isActive)
      this.LightOn(delta);
      else
      this.LightOff(delta);
  }
}
//Clase 'Fade' correspondiente al efecto de transición
class Fade extends Phaser.GameObjects.Image {
  static fadeChangeVelocity = 0.001;
  constructor(scene, x, y, texture, nextScene = "scene", isChangingScene = false) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    this.scene = scene;
    this.isChangingScene = isChangingScene;
    this.nextScene = nextScene;
    this.depth++;
  }
  FadeOn(delta) {
  this.alpha = Math.max(Math.min(this.alpha - Fade.fadeChangeVelocity * delta, 1), 0);
  }
  FadeOff(delta) {
    this.alpha = Math.max(Math.min(this.alpha + Fade.fadeChangeVelocity * delta, 1), 0);
    if (this.alpha == 1) {
      this.LoadScene(this.nextScene);
    }
  }
  Update(time, delta) {
    if (this.isChangingScene)
      this.FadeOff(delta);
    else
      this.FadeOn(delta);
  }
  //Método que carga una escena dado el nombre de ésta
  LoadScene(name) {
    this.scene.scene.start(name);
  }
}
//Función que detecta donde está el ratón y activa la luz correspondiente según su posición
function CheckOption(scene) {

  for (var i = 0; i < buttonArray.length; i++) {
    buttonArray[i].isActive = false;
  }

  var i = 0;
  var found = false;

  while (i < buttonArray.length && !found) {
    if (scene.input.mousePointer.y > 209 + 70 * i && scene.input.mousePointer.y < 279 + 70 * i){
      buttonArray[i].isActive = true;
      found = true;
    }
    else
      i++;
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
  	//Cargamos el fondo y la pantalla negra que servirá como transición
    this.load.image('interfazBg', 'assets/Interfaz/BG.png');
  	this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');

  	//Cargamos los textos del menú
  	this.load.image('text_online', 'assets/Interfaz/Text_Online.png');
  	this.load.image('text_local', 'assets/Interfaz/Text_Local.png');
  	this.load.image('text_options', 'assets/Interfaz/Text_Options.png');
  	this.load.image('text_exit', 'assets/Interfaz/Text_Exit.png');

  	//Cargamos el sprite de la luz
  	this.load.image('light', 'assets/Interfaz/Light.png');
  }
  //Función create, que crea los elementos del propio juego
  create ()
  {
    //Añadimos el background
    this.add.image(960/2, 540/2, 'interfazBg');
  	//Añadimos la pantalla negra que servirá de transición entre escenas.
  	fade = new Fade(this, 960/2, 540/2, 'interfazBs');
  	//Añadimos las luces que indicarán que botón del menú está activo y su comportamiento
  	buttonArray = [
  		new Button(this, 960/2, 244, 'light', function() {},),
  		new Button(this, 960/2, 314, 'light', function() {
  			fade.isChangingScene = true;
  			fade.nextScene = "level1";
  		}),
  		new Button(this, 960/2, 384, 'light', function() {},),
  		new Button(this, 960/2, 450, 'light', function() {},)
  	];
  	//Hacemos a todas las luces invisibles en un primer momento. Además, le añadimos el comportamiento de cada botón
  	for (var i = 0; i < buttonArray.length; i++) {
  		buttonArray[i].alpha = 0;
  	}
  	//Añadimos los textos de los botones.
  	this.add.image(960/2, 244, 'text_online');
  	this.add.image(960/2, 314, 'text_local');
  	this.add.image(960/2, 384, 'text_options');
  	this.add.image(960/2, 450, 'text_exit');
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
