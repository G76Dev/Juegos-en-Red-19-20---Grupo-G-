export default class Press {
  constructor(scene, posX, posY, sprt){
    this.sprite = scene.matter.add.image(posX, posY, sprt);
    this.sprite.setStatic(true).setIgnoreGravity(true).setDepth(-20);
    this.scene = scene;
    this.initialX = posX;
    this.initialY = posY;
  }
  update(){
    this.sprite.y  += this.staticVelY;
  }
  setStaticVelY(v){this.staticVelY = v}
  startCycle(n, del=0){
    this.isReady = false;
      this.setStaticVelY(0);
      this.sprite.x = this.initialX;
      this.sprite.y = this.initialY;
      this.scene.time.addEvent({
        delay: del,
        callback: () => (delayedStart(this.scene, this))
      });
    function delayedStart(scene, obj){
      obj.isReady = true;
      if(n < 0 ||n > 0){
      obj.isReady = false;
        scene.time.addEvent({
          delay: 2000,
          callback: () => (initiateDescend(scene, obj))
        });
        function initiateDescend(scene, obj){
          const unsubscribe1 = scene.matterCollision.addOnCollideActive({
            objectA: scene.android1.mainBody,
            objectB: obj.sprite,
            callback: inflictDamage,
            context: scene.android1
          });
          const unsubscribe2 = scene.matterCollision.addOnCollideStart({
            objectA: scene.android2.mainBody,
            objectB: obj.sprite,
            callback: inflictDamage,
            context: scene.android2
          });
          function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}

          obj.setStaticVelY(20);
          scene.time.addEvent({
            delay: 80,
            callback: () => (stop(scene, obj))
          });
          function stop(scene, obj){
            obj.setStaticVelY(0);
            scene.time.addEvent({
              delay: 500,
              callback: () => (initiateAsccend(scene, obj))
            });
            function initiateAsccend(){
              unsubscribe1();
              unsubscribe2();
              obj.setStaticVelY(-2.5);
              scene.time.addEvent({
                delay: 700,
                callback: () => (obj.startCycle(n-1, 0))
              });
            }
          }
        }
      }
    }
  }
}
