export default class ElectricSurface {
  constructor(scene, posX, posY , active){
    this.sprite = scene.matter.add.image(posX, posY, "generic");
    this.sprite.setStatic(true).setIgnoreGravity(true);
    this.scene = scene;
    this.unsubscribe1;
    this.unsubscribe2;
    if(active){
      this.turnOn();
    }
  }
  turnOn(){
    this.unsubscribe1 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.android1.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.android1
    });
    this.unsubscribe2 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.android2.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.android2
    });
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
  }
  turnOff(){
    this.unsubscribe1();
    this.unsubscribe2();
  }
}