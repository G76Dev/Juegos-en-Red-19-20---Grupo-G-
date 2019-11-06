export default class Tesla {
  constructor(scene, posX, posY, sprt, anim){
    this.sprite = scene.add.sprite(posX, posY, sprt,0);
    this.sprite.setDepth(-4);
    this.scene = scene;
    this.isReady = true;

    this.electricSprite = scene.matter.add.sprite(posX, -999,  anim, 0);
    this.electricSprite.setCircle(46).setSensor(true).setStatic(true).setScale(1).setDepth(1).setVisible(false);
    this.electrisSpY = posY-16;
    this.electricSprite.anims.play(anim, true);
    scene.matterCollision.addOnCollideActive({
      objectA: scene.android1.mainBody,
      objectB: this.electricSprite,
      callback: inflictDamage,
      context: scene.android1
    });
    scene.matterCollision.addOnCollideActive({
      objectA: scene.android2.mainBody,
      objectB: this.electricSprite,
      callback: inflictDamage,
      context: scene.android2
    });
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}

  }
  startCycle(loop, timer, del=0){
    if(this.isReady){
      this.isReady = false;
      this.scene.time.addEvent({
        delay: del,
        callback: () => (delayedOn(this.scene, this))
      });
      function delayedOn(scene, obj){
        obj.electricSprite.y = obj.electrisSpY;
        obj.electricSprite.setVisible(true);
        if(timer != -1){
        scene.time.addEvent({
          delay: timer,
          callback: () => (off(scene, obj))
        });
          function off(scene, obj){
            //obj.sprite.setTint(0x000000);
            obj.electricSprite.y = -999;
            obj.electricSprite.setVisible(false);
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
