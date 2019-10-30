//Variables del menú
var backButton;
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

  backButton.isActive = false;

  if (scene.input.mousePointer.y > backButton.y - 35 && scene.input.mousePointer.y < backButton.y + 35)
    backButton.isActive = true;

}
//clase escena 1
export default class Scene1 extends Phaser.Scene{
  constructor(){
    super("onlineMode");
  }

  //Función preload, que carga elementos antes de iniciar el juego
  preload ()
  {
  	//Cargamos el fondo y la pantalla negra que servirá como transición
    this.load.image('interfazBg', 'assets/Interfaz/BG.png');
  	this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');

    //Cargamos la imagen que indica el estado del modo online.
    this.load.image('text_onlineMode', 'assets/Interfaz/Text_OnlineMode.png');
    
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
    //Añadimos el texto de la pantalla del modo online provisional (hasta fase 3-4).
    this.add.image(960/2, 540/2, 'text_onlineMode');
  	//Añadimos la pantalla negra que servirá de transición entre escenas
  	fade = new Fade(this, 960/2, 540/2, 'interfazBs');
  	//Añadimos el botón de 'back'
  	backButton = new Button(this, 960/2, 405, 'light', function() {
  			fade.isChangingScene = true;
  			fade.nextScene = "menu";
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