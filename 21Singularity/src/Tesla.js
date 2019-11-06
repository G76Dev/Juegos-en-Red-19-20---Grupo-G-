export default class Tesla {
  constructor(scene, posX, posY){
    this.sprite = scene.matter.add.image(posX, posY, "generic");
    this.sprite.setSensor(true).setStatic(true).setIgnoreGravity(true).setScale(0.25).setDepth(-4);
    this.isReady = true;
    this.scene = scene;
  }
  startCycle(loop, timer, del=0){
    if(this.isReady){
      this.isReady = false;
      this.scene.time.addEvent({
        delay: del,
        callback: () => (delayedOn(this.scene, this))
      });
      function delayedOn(scene, obj){
        obj.sprite.setTint(0xa1a1a1);
        const unsubscribe1 = scene.matterCollision.addOnCollideActive({
          objectA: scene.android1.mainBody,
          objectB: obj.sprite,
          callback: inflictDamage,
          context: scene.android1
        });
        const unsubscribe2 = scene.matterCollision.addOnCollideActive({
          objectA: scene.android2.mainBody,
          objectB: obj.sprite,
          callback: inflictDamage,
          context: scene.android2
        });
        function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
        if(timer != -1){
        scene.time.addEvent({
          delay: timer,
          callback: () => (off(scene, obj))
        });
          function off(scene, obj){
            obj.sprite.setTint(0x000000);
            unsubscribe1();
            unsubscribe2();
            scene.time.addEvent({
              delay: timer,
              callback: () => (startAgain(scene, obj))
            });
            function startAgain(scene, obj){
                obj.isReady = true;
              if(loop){
                obj.startCycle(loop, timer, del)
              }
            }
          }
        }
      }
    }
  }
}
