
export default class Android {
  static lives = 5;
  static respawnTime = 1000;
  constructor(scene, x, y, cursors) {
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, "dude", 0);
    this.otherAndroid;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w *0.9, h);
    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.6, w * 0.8, 6, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.55, 0, 6, h * 0.85, { isSensor: true }),
      right: Bodies.rectangle(w * 0.55, 0, 6, h * 0.85, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionAir: 0.01,
      friction: 0.09
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .body.collisionFilter.group = -1;;

    this.cursors = cursors;

    this.scene.events.on("update", this.update, this);

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.canCoopImpulse = true;
    this.coopTimer = null;

    scene.matter.world.on("beforeupdate", this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

    //var
    this.invulnerable = false;
    this.alive = true;
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.3) this.sprite.x -= 0.1;
    }
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.3) this.sprite.x += 0.1;
    }
    if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }

  }
  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }
  update(time, delta) {
    const isInAir = !this.isTouching.ground;

    if(Android.lives <= 0){return;}

    if(this.alive){
      if(isInAir){this.sprite.setVelocityX(0.1*delta*Math.sign(this.sprite.body.velocity.x));}

      if (this.cursors.left.isDown) {
        this.sprite.anims.play('wLeft', true);
          this.sprite.setFlipX(false);
        if (!(isInAir && this.isTouching.left)) {
          this.sprite.setVelocityX(-0.3 * delta)
        }
      } else if (this.cursors.right.isDown) {
        this.sprite.anims.play('wRight', true);
          this.sprite.setFlipX(false);
        if (!(isInAir && this.isTouching.right)) {
          this.sprite.setVelocityX(0.3 * delta)
        }
      }else{
        this.sprite.anims.play('idle');
      }

      if (this.cursors.up.isDown && this.canJump && this.isTouching.ground) {
        this.sprite.setVelocityY(-9);

        this.canJump = false;
        this.jumpCooldownTimer = this.scene.time.addEvent({
          delay: 250,
          callback: () => (this.canJump = true)
        });
      }

      if (this.cursors.coop.isDown)
      {
          this.coopJump();
      }
      if(this.isTouching.ground && !this.canCoopImpulse) {
        this.coopTimer = this.scene.time.addEvent({
          delay: 250,
          callback: () => (this.canCoopImpulse = true)
        });
      }

      if(this.sprite.y > 600){
        this.damaged();
      }
    }
  }
  coLink(otherA){
    this.otherAndroid = otherA;
  }
  coopJump(){
    if (((this.otherAndroid.sprite.x > (this.sprite.x - 16)) && (this.otherAndroid.sprite.x < (this.sprite.x + 16))) &&
    ((this.otherAndroid.sprite.y < this.sprite.y + 24) && (this.otherAndroid.sprite.y > (this.sprite.y - 24))))
    {
       if(this.canCoopImpulse && this.otherAndroid.canCoopImpulse){
         this.otherAndroid.sprite.setVelocityY(-9);
         this.canCoopImpulse = false;
       }
    }
  }
  damaged(){
    if(!this.invulnerable){
      if(this.otherAndroid.alive){
        if(Android.lives > 0 && this.alive){
          this.alive = false;
          Android.lives--;
          this.sprite.visible = false;
          this.sprite.setVelocityX(0);
          this.scene.time.addEvent({
            delay: Android.respawnTime,
            callback: () => (this.respawn())
          });
        }else if(Android.lives <= 0){
          console.log("Game Over");
        }
      }else{
        Android.lives = 0;
        console.log("Game Over");
      }
    }
  }
  respawn(){
    this.sprite.depth = 0;
    this.otherAndroid.sprite.depth = 0;
    this.sprite.setVelocityY(0);
    this.sprite.setVelocityX(0);
    this.sprite.x = this.otherAndroid.sprite.x;
    this.sprite.y = this.otherAndroid.sprite.y;
    this.sprite.depth++;

    this.invulnerable = true;
    this.sprite.visible = true;
    this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 125,
        repeat: 6,
        yoyo: true
      })
    this.alive = true;
    this.scene.time.addEvent({
      delay: 6*125,
      callback: () => (this.invulnerable = false)
    });
  }
}
