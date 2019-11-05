export default class Conveyer {
  constructor(scene, posX, posY, sprt, anim, colSizeX, accelerator){
    this.sprite = scene.matter.add.sprite(posX, posY, sprt, 0);
    this.sprite.setRectangle(colSizeX, 20).setStatic(true);
    (accelerator > 0) ? this.sprite.setFlipX(false) : this.sprite.setFlipX(true);
    this.sprite.anims.play(anim,true);
    scene.matterCollision.addOnCollideStart({
      objectA: scene.android1.mainBody,
      objectB: this.sprite,
      callback: accelerate,
      context: scene.android1
    });
    scene.matterCollision.addOnCollideStart({
      objectA: scene.android2.mainBody,
      objectB: this.sprite,
      callback: accelerate,
      context: scene.android2
    });
    function accelerate(){this.velInfluence = accelerator;}
    scene.matterCollision.addOnCollideEnd({
      objectA: scene.android1.mainBody,
      objectB: this.sprite,
      callback: decelerate,
      context: scene.android1
    });
    scene.matterCollision.addOnCollideEnd({
      objectA: scene.android2.mainBody,
      objectB: this.sprite,
      callback: decelerate,
      context: scene.android2
    });
    function decelerate(){this.velInfluence = 0;}
    //this.sprite.anims.play('exprosion', true);
  }
}
