export default class Android {
  static lives = 7;
  static respawnTime = 1500;
  static jumpVelocity = 5.05;
  static moveVelocity = 0.215;
  static airVelocityFraction = 0.3;
  constructor(scene, androidNumber, x, y, cursors) {
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, 'androidIdle' + androidNumber, 0);
    this.androidNumber = androidNumber;
    this.otherAndroid;

    this.leftMultiply = 1;
    this.rightMultiply = 1;
    this.velInfluence = 0;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    this.mainBody = Bodies.rectangle(0, 6, w * 0.75, h * 0.8, { chamfer: { radius: 5 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, 36, w * 0.6, 8, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 6, 5, h * 0.6, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 6, 5, h * 0.6, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionAir: 0.01,
      friction: 0.09
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .setOrigin(0.5, 0.55)
      .body.collisionFilter.group = -1;

    this.cursors = cursors;

    this.scene.events.on("update", this.update, this);

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.canCoopImpulse = true;
    this.coopTimer = null;

    this.isCoopImpulsing = false;

    this.aditionalJumpVelocity = -0.25;
    this.cursors.up.on('down', function (event) {
      if (this.cursors.up.isDown && this.canJump && this.isTouching.ground) {
        this.aditionalJumpVelocity = -0.25;
        this.sprite.setVelocityY(-Android.jumpVelocity);
        this.canJump = false;
        this.cursors.up.on('up', function (event) {
          this.canJump = true
        }, this);
      }
    }, this);

    this.cursors.coop.on('down', function(event){
      this.isCoopImpulsing = true;
      this.coopJump();
    }, this);

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
    this.canDeathSpawn = true;

    this.deathStuff = [6]; this.deathStuff[0] = 'deathHead' + this.androidNumber; this.deathStuff[1] = 'deathLegs' + this.androidNumber; this.deathStuff[2] = 'deathBodyL' + this.androidNumber;
    this.deathStuff[3] = 'deathFootR' + this.androidNumber; this.deathStuff[4] = 'deathFootL' + this.androidNumber; this.deathStuff[5] = 'deathBodyR' + this.androidNumber;

    //icono indicador
    this.indicator = this.scene.add.image(-999, -999, "item2");
    this.indicator.setScale(0.2);
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
    if (bodyB.name == "interactableBody") return;
    if (bodyB.label == "Body" && bodyB.parent.gameObject.tile.properties.lethal) return;
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      this.rightMultiply = 0;
      if (pair.separation > 2) { this.sprite.x -= 0.1 }
    }
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      this.leftMultiply = 0;
      if (pair.separation > 2) { this.sprite.x += 0.1 }
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }
  update(time, delta) {
    const isInAir = !this.isTouching.ground;

    if (Android.lives <= 0) { return; }

    if (this.alive) {
      if (this.cursors.right.isDown) {
        if (!(isInAir && this.isTouching.right)) {
          this.sprite.setVelocityX(Android.moveVelocity * delta * this.rightMultiply);
        }
      }
      else if (this.cursors.left.isDown) {
        if (!(isInAir && this.isTouching.left)) {
          this.sprite.setVelocityX(-Android.moveVelocity * delta * this.leftMultiply);
        }
      }
      this.sprite.x += this.velInfluence;
      this.playAnimation();

      if (this.cursors.up.isDown && !this.isTouching.ground && this.sprite.body.velocity.y < 0) {
        this.sprite.setVelocityY(this.sprite.body.velocity.y + this.aditionalJumpVelocity);
        if (this.aditionalJumpVelocity < 0) {
          this.aditionalJumpVelocity += 0.01;
        } else {
          this.aditionalJumpVelocity = 0;
        }
      }

      if (this.isTouching.ground && !this.canCoopImpulse) {
        this.coopTimer = this.scene.time.addEvent({
          delay: 250,
          callback: () => (this.canCoopImpulse = true)
        });
      }

      if (this.sprite.y > 640) {
        this.damaged(new Phaser.Math.Vector2(0, -1), 40);
      }

      //BUGFIX
      if (isInAir && !this.cursors.left.isDown && !this.cursors.right.isDown) {
        if (this.sprite.body.velocity.y <= -Android.jumpVelocity * 0.90) {
          this.sprite.setVelocityX(0);
        } else {
          this.sprite.setVelocityX((Android.moveVelocity * Android.airVelocityFraction) * delta * Math.sign(this.sprite.body.velocity.x));
        }
      }
      this.leftMultiply = 1;
      this.rightMultiply = 1;

      const cam = this.scene.cameras.main;
      if (this.sprite.x < cam.scrollX) { this.indicator.x = 10 + cam.scrollX; this.indicator.y = this.sprite.y; }
      else if (this.sprite.x > cam.scrollX + 960) { this.indicator.x = 950 + cam.scrollX; this.indicator.y = this.sprite.y; }
      else { this.indicator.x = -999; this.indicator.y = -999; }
    }
  }
  playAnimation(){
    if(this.sprite.anims.currentAnim == null || this.sprite.anims.currentAnim.key.substr(0,4) != "coop" ||
     (this.sprite.anims.currentAnim.key.substr(0,4) == "coop" && this.sprite.anims.currentFrame.index == this.sprite.anims.currentAnim.getLastFrame().index )){
      if(this.isTouching.ground){
        if(this.cursors.right.isDown){
          this.sprite.anims.play('wRight'+this.androidNumber, true);
        }else if(this.cursors.left.isDown){
          this.sprite.anims.play('wRight'+this.androidNumber, true);
        }else{
          this.sprite.anims.play('idle'+this.androidNumber, true);
        }
      }else{
        if(this.sprite.body.velocity.y < 0){
          this.sprite.anims.play('jumpUp'+this.androidNumber, true);
        }else if(this.sprite.body.velocity.y > 0){
          this.sprite.anims.play('jumpDown'+this.androidNumber, true);
        }
      }
    }
    if(this.isCoopImpulsing){
      if(this.sprite.anims.currentAnim.key == 'wRight' + this.androidNumber)
        this.sprite.play('coopwRight' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'jumpDown' + this.androidNumber)
        this.sprite.play('coopjumpDown' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'jumpUp' + this.androidNumber)
        this.sprite.play('coopjumpUp' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'idle' + this.androidNumber)
        this.sprite.play('coopidle' + this.androidNumber,true);
      this.isCoopImpulsing = false;
    }

    if(this.cursors.right.isDown){
      this.sprite.setFlipX(false);
    }else if(this.cursors.left.isDown){
      this.sprite.setFlipX(true);
    }
  }
  coLink(otherA) {
    this.otherAndroid = otherA;
  }
  coopJump() {
    if (((this.otherAndroid.sprite.x > (this.sprite.x - 16)) && (this.otherAndroid.sprite.x < (this.sprite.x + 16))) &&
      ((this.otherAndroid.sprite.y < this.sprite.y + 32) && (this.otherAndroid.sprite.y > (this.sprite.y - 32)))) {
      if (this.canCoopImpulse && this.otherAndroid.canCoopImpulse) {
        this.otherAndroid.sprite.setVelocityY(-Android.jumpVelocity * 1.1);
        this.canCoopImpulse = false;
      }
    }
  }
  damaged(deathVector, deathSpread) {
    if (!this.invulnerable) {
      this.sprite.visible = false;
      this.sprite.setActive(false);
      this.sprite.setVelocityX(0);
      this.deathSpawn(deathVector, deathSpread);
      if (this.otherAndroid.alive) {
        if (Android.lives > 0 && this.alive) {
          this.alive = false;
          Android.lives--;
          this.scene.lifesText.setText("Lives: " + Android.lives);
          this.scene.time.addEvent({
            delay: Android.respawnTime,
            callback: () => (this.respawn())
          });
        } else if (Android.lives <= 0) {
          this.alive = false;
          console.log("Game Over");
        }
      } else {
        Android.lives = 0;
        this.alive = false;
        console.log("Game Over");
      }
    }
  }
  respawn() {
    this.sprite.setDepth(1);
    this.otherAndroid.sprite.setDepth(0);
    this.sprite.setVelocityY(0);
    this.sprite.setVelocityX(0);
    this.sprite.x = this.otherAndroid.sprite.x;
    this.sprite.y = this.otherAndroid.sprite.y;

    this.invulnerable = true;
    this.sprite.visible = true;
    this.sprite.setActive(true);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      ease: 'Cubic.easeOut',
      duration: 150,
      repeat: 6,
      yoyo: true
    })
    this.alive = true;
    this.scene.time.addEvent({
      delay: 6 * 150,
      callback: () => (this.invulnerable = false)
    });
  }
  deathSpawn(deathVector, deathSpread) {
    if (this.canDeathSpawn) {
      this.canDeathSpawn = false;
      var remainVelocity = 8;
      const dirAngle = deathVector.angle() * (180 / Math.PI);
      var randomAng;
      var randomVec;
      for (var i = 0; i < this.deathStuff.length; i++) {
        var debree = this.scene.matter.add.image(this.sprite.x, this.sprite.y, this.deathStuff[i], 0, { isSensor: true });
        randomAng = Phaser.Math.Between(dirAngle - deathSpread, dirAngle + deathSpread) * (Math.PI / 180);
        randomVec = new Phaser.Math.Vector2(Math.cos(randomAng), Math.sin(randomAng));
        randomVec.normalize();
        randomVec.scale(remainVelocity);
        debree.setVelocity(randomVec.x, randomVec.y);
        //debree.setAngularVelocity(Math.random()/10-0.05);
        this.scene.time.addEvent({
          delay: 3000,
          callback: (destroyDebree),
          args: [debree]
        });
      }
      this.scene.time.addEvent({
        delay: Android.respawnTime - 50,
        callback: () => (this.canDeathSpawn = true)
      });
    }
    function destroyDebree(debree) { debree.destroy() }
  }
}
