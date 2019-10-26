
export default class testPlayer {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.matter.add.sprite(x, y, "dude", 0);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.35, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 3, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 3, h * 0.5, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      friction: 0.09
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y);

    this.cursors = scene.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.I,
                                                'left': Phaser.Input.Keyboard.KeyCodes.J,
                                                'right': Phaser.Input.Keyboard.KeyCodes.L,
                                                'coop': Phaser.Input.Keyboard.KeyCodes.K } );

    this.scene.events.on("update", this.update, this);

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;

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
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += 0.1;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= 0.1;
    } else if (bodyA === this.sensors.bottom) {
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

    if (this.cursors.left.isDown) {
      this.sprite.setFlipX(false);
      if (!(isInAir && this.isTouching.left)) {
        this.sprite.setVelocityX(-0.3 * delta)
      }
    } else if (this.cursors.right.isDown) {
      this.sprite.setFlipX(true);
      if (!(isInAir && this.isTouching.right)) {
        this.sprite.setVelocityX(0.3 * delta)
      }
    }

    if (this.cursors.up.isDown && this.canJump && this.isTouching.ground) {
      this.sprite.setVelocityY(-9);

      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.canJump = true)
      });
    }
  }
}
