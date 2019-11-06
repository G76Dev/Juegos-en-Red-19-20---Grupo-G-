export default class Tesla {
  constructor(scene, posX, posY, sprt, anim){
    this.sprite = scene.matter.add.sprite(posX, posY, sprt,0);
    this.sprite.setSensor(true).setStatic(true).setScale(1).setDepth(-4);
    this.oPosX = posX;
    this.oPosY = posY;
    this.oSprt = sprt;
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
        obj.sprite = scene.matter.add.sprite(obj.oPosX, obj.oPosY-16, obj.oSprt, 0);
        obj.sprite.setStatic(true).setSensor(true);
        obj.sprite.setActive(true);
        //obj.sprite.anims.play('teslaHumanS', true);
        //obj.sprite.setTint(0xa1a1a1);
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
            //obj.sprite.setTint(0x000000);
            obj.sprite = scene.matter.add.sprite(obj.oPosX, obj.oPosY, obj.oSprt, 0);
            obj.sprite.setStatic(true).setSensor(true);
            obj.sprite.setActive(false);
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
