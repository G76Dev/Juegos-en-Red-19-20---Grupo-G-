export default class MovingPlatform {
    constructor(scene, x1, y, x2, sprt, anim) {
        this.sprite = scene.matter.add.sprite(x1, y, sprt, 0);
        this.sprite.setRectangle(74,16).setStatic(true);
        this.sprite.anims.play(anim, true);
        this.startPosX = x1;
        this.endPosX = x2;
        this.objectiveX = this.startPosX;
        this.increaseX = 0.07;
        this.delta = 1;

        scene.matterCollision.addOnCollideActive({
            objectA: scene.game.android1.mainBody,
            objectB: this.sprite,
            callback: () => (accelerate(this.objectiveX, this.sprite, this.increaseX, this.delta, scene.game.android1)),
        });
        scene.matterCollision.addOnCollideActive({
            objectA: scene.game.android2.mainBody,
            objectB: this.sprite,
            callback: () => (accelerate(this.objectiveX, this.sprite, this.increaseX, this.delta, scene.game.android2)),
        });
        function accelerate(oX, spr, incX, delt, andr) {
            (spr.x < oX) ? (andr.velInfluence = incX*delt) : (andr.velInfluence = -(incX*delt));
        }
        scene.matterCollision.addOnCollideEnd({
            objectA: scene.game.android1.mainBody,
            objectB: this.sprite,
            callback: decelerate,
            context: scene.game.android1
        });
        scene.matterCollision.addOnCollideEnd({
            objectA: scene.game.android2.mainBody,
            objectB: this.sprite,
            callback: decelerate,
            context: scene.game.android2
        });
        function decelerate() { this.velInfluence = 0; }
    }
    update(time, delta) {
        this.delta = delta;
        if (Math.abs(this.sprite.x - this.objectiveX) > 4) {
            if (this.sprite.x < this.objectiveX)
                this.sprite.x += this.increaseX * delta;
            else if (this.sprite.x > this.objectiveX)
                this.sprite.x -= this.increaseX * delta;
        } else {
            if (Math.abs(this.sprite.x - this.startPosX) < 10)
                this.objectiveX = this.endPosX;
            else if (Math.abs(this.sprite.x - this.endPosX) < 10)
                this.objectiveX = this.startPosX;
        }
    }
}