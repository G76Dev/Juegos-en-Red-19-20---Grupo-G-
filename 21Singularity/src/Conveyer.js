export default class Conveyer {
  constructor(scene, posX, posY, accelerator){
    this.sprite = scene.matter.add.sprite(posX, posY, "generic");
    this.sprite.setScale(0.1,3).setStatic(true).setAngle(90);
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
