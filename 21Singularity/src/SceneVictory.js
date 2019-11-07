//Variables del menú
var backButton;
var hoverSound;
var selectedSound;
var cam;
var isChangingScene;
import Button from "./button.js";
import Scene2 from "./Scene2.js";
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
export default class SceneVictory extends Phaser.Scene{
  constructor(){
    super("victory");
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
    this.add.image(960/2, 540/2, 'textVictory');
    //Añadimos el botón de 'back'
    cam = this.cameras.main;
    cam.fadeIn(1000);
    function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
    function FinalSolution(scene, start) {
      scene.game.scene.add('', new Scene2('level1' + (scene.game.scene1Counter + 1)), start);
      scene.scene.remove('level1', scene.game.scene1Counter);
      scene.game.scene1Counter++;
  }
  	backButton = new Button(this, 960/2, 500, 'light', function() {
			selectedSound.play({ volume: this.scene.game.soundVolume });
      isChangingScene = true;
			cam.fadeOut(1000);
			this.scene.time.addEvent({
				delay: 1000,
				callback: () => (FinalSolution(this.scene, false), LoadScene(this.scene, 'menu'))
			});
    });
  	//Hacemos la luz invisible
  	backButton.alpha = 0;
  	//Añadimos el texto de 'back'.
  	this.add.image(960/2, 500, 'text_goToMenu');
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