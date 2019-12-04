//Clase 'Button' correspondiente a la luz que aparece detras de los textos
export default class Button extends Phaser.GameObjects.Image {
    Behaviour = function() {}; // Funcion que sera llamada al pulsar el boton.
    // Constructor de la clase.
    constructor(scene, x, y, texture, Behaviour = function() {}, isActive = false) {
      super(scene, x, y, texture); // Llama al constructor de Image.
      scene.add.existing(this);
  
      this.isActive = isActive; // Indica si el raton esta sobre el boton o no.
      this.Behaviour = Behaviour;
	  this.lightChangeVelocity = 0.01; // Variable que indicala velocidad con la que se oscurece/esclarece la luz.
    }
    // Funcion que esclarece la luz (segun un valor delta).
    LightOn(delta) {
      this.alpha = Math.max(Math.min(this.alpha + this.lightChangeVelocity * delta, 1), 0);
    }
    // Funcion que oscurece la luz (segun un valor delta).
    LightOff(delta) {
      this.alpha = Math.max(Math.min(this.alpha - this.lightChangeVelocity * delta, 1), 0);
    }
    // Funcion update del boton.
    Update(time, delta) {
      if (this.isActive)
        this.LightOn(delta);
      else
        this.LightOff(delta);
    }
  }