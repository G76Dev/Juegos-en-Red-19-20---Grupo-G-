class Human {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.matter.add.sprite(x, y, 'humanImg', 0);
        this.canDie = true;
        this.dead = false;
        this.deadSprite;

        this.sprite.setRectangle(22,56).setScale(1.2).setOrigin(0.5, 0.55);
    }
    death() {
        if (this.canDie) {
            this.canDie = false;
            this.dead = true;
            var deathVector = new Phaser.Math.Vector2(100, -300);
            //var deathSpread = 90;
            var remainVelocity = 6;
            const dirAngle = deathVector.angle() * (180 / Math.PI);
            var randomAng;
            var randomVec;

            this.deadSprite = this.scene.matter.add.sprite(this.sprite.x, this.sprite.y, 'humanImg', 0, { isSensor: true });
            this.deadSprite.anims.play('humanDieS', true);
            this.sprite.destroy();
            randomAng = /*Phaser.Math.Between(dirAngle - deathSpread, dirAngle + deathSpread)*/ dirAngle * (Math.PI / 180);
            randomVec = new Phaser.Math.Vector2(Math.cos(randomAng), Math.sin(randomAng));
            randomVec.normalize();
            randomVec.scale(remainVelocity);
            this.deadSprite.setVelocity(randomVec.x, randomVec.y);

            this.scene.time.addEvent({
                delay: 3000,
                callback: (endGame),
                args: [this]
            });

            this.scene.time.addEvent({
                delay: 5000,
                callback: (destroyDebree),
                args: [this.deadSprite]
            });
        }
        function destroyDebree(debree) { debree.destroy() }
        function endGame(human) {
            human.dead = false;
            game.android1.arrived = true;
            game.android2.arrived = true;
        }
    }
}