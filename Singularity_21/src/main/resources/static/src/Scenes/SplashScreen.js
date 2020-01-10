// Clase correspondiente a la escena de splash screen.
class SplashScreen extends Phaser.Scene {

  // Constructor de la escena.
  constructor(){
    super("splashScreen");
  }

  // Funcion create, que crea los elementos del propio juego.
  create ()
  {
    // Añadimos el logo del equipo (NaNa Team).
    this.add.image(960/2, 540/2, 'logo');

    // Hacemos un fade con la camara.
    var cam = this.cameras.main;
    cam.fadeIn(1000);

    function StartMenu(scene) {
      scene.game.currentMusic = scene.sound.add('menuMusic', { loop: true, volume: scene.game.musicVolume });
      scene.game.currentMusic.play();
      scene.game.customTransition(scene, 'menu', 0);
    }

    function LoadMenu(scene){
      cam.fadeOut(1000);
      scene.time.addEvent({
        delay: 1000,
        callback: () => StartMenu(scene)
      });
    }

    this.time.addEvent({
      delay: 3000,
      callback: () => LoadMenu(this)
    });

  }
}
