//Clase 'Button' correspondiente a la luz que aparece detrás de los textos
export default class Button extends Phaser.GameObjects.Image {
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