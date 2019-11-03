//Clase 'Fade' correspondiente al efecto de transición
export default class Fade extends Phaser.GameObjects.Image {
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