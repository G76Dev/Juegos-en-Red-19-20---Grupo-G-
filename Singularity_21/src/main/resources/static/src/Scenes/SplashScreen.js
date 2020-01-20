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
    var splashSound = this.sound.add('splash', {volume: game.soundVolume});
    splashSound.play();

    function StartMenu(scene) {
      game.currentMusic = scene.sound.add('menuMusic', { loop: true, volume: game.musicVolume });
      game.currentMusic.play();
      scene.scene.start('menu');
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
