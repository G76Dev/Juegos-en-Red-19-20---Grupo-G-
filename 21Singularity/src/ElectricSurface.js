export default class ElectricSurface {
  constructor(scene, posX, posY, sprt , active, sprtElec, animElec){
    this.sprite = scene.matter.add.image(posX, posY, sprt);
    this.sprite.setStatic(true);
    this.elecSprite = scene.matter.add.sprite(posX, posY, sprtElec, 0);
    this.elecSprite.setStatic(true);
    this.elecSprite.anims.play(animElec, true);
    this.scene = scene;
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

    if(!active){
      this.turnOff(scene);
    }
  }
  turnOn(scene, posX, posY, sprtElec, animElec){
    this.elecSprite.setActive(true);
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
  turnOff(scene, posX, sprtElec){
    this.elecSprite.setActive(false);
    this.unsubscribe1();
    this.unsubscribe2();
  }
}
