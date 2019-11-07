//Clase Conveyer, para instanciar cintas mecánicas.
export default class Conveyer {
  constructor(scene, posX, posY, sprt, anim, colSizeX, accelerator){
    //Generamos el sprite y ajustamos su collider.
    this.sprite = scene.matter.add.sprite(posX, posY, sprt, 0);
    this.sprite.setRectangle(colSizeX, 20).setStatic(true);
    //Si la aceleración es negativa, gira el sprite horizontalmente.
    (accelerator > 0) ? this.sprite.setFlipX(false) : this.sprite.setFlipX(true);
    //Activamos la animación.
    this.sprite.anims.play(anim,true);
    //Establecemos colisiones con los jugadores androide.
    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android1.mainBody,
      objectB: this.sprite,
      callback: accelerate,
      context: scene.game.android1
    });
    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android2.mainBody,
      objectB: this.sprite,
      callback: accelerate,
      context: scene.game.android2
    });
    scene.matterCollision.addOnCollideEnd({
      objectA: scene.game.android1.mainBody,
      objectB: this.sprite,
      callback: decelerate,
      context: scene.game.android1
    });
    scene.matterCollision.addOnCollideEnd({
      objectA: scene.game.android2.mainBody,
      objectB: this.sprite,
      callback: decelerate,
      context: scene.game.android2
    });
    //Funciones accelerate y decelerate, para otorgar velocidad a los androides.
    function accelerate(){this.velInfluence = accelerator;}
    function decelerate(){this.velInfluence = 0;}
  }
}
