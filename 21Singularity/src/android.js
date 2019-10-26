
export default class Android {
  static lives;
  constructor(scene, x, y, cursors) {
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, "dude", 0);
    this.otherAndroid;
    this.lives = 5;

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
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.3) this.sprite.x += 0.1;
    }
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.3) this.sprite.x -= 0.1;
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
  damaged(delta){
    if(!this.invulnerable){
      if(this.otherAndroid.alive){
        console.log(this.lives);
        if(this.lives > 0 && this.alive){
          this.alive = false;
          this.lives--;
          this.sprite.visible = false;
          console.log("asdasd");
          this.scene.time.delayedCall(AndroidPlayers.respawnTime * delta, this.respawn, [this.scene, this, this.otherAndroid]);
        }else if(this.lives <= 0){
          //gameOver = true;
        }
      }else{
        //gameOver = true
        this.lives = 0;
      }
    }
  }
  respawn(scene, playerToRespawn, otherPlayer){
    playerToRespawn.depth = 0;
    otherPlayer.depth = 0;
    playerToRespawn.setVelocityY(0);
    playerToRespawn.setVelocityX(0);
    playerToRespawn.x = otherPlayer.x;
    playerToRespawn.y = otherPlayer.y;
    playerToRespawn.depth++;

    playerToRespawn.invulnerable = true;
    playerToRespawn.visible = true;
    scene.tweens.add({
        targets: playerToRespawn,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 125,
        repeat: 6,
        yoyo: true
      })
    playerToRespawn.alive = true;
    scene.time.delayedCall(6*125, function(){playerToRespawn.invulnerable = false;}, playerToRespawn);
  }
}
