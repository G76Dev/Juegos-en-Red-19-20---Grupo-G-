//Clase MovingPlatform, para instanciar plataformas movibles.
class MovingPlatform {
    constructor(scene, x1, y, x2, sprt, anim) {
        //Generamos el sprite, lo hacemos estático y ajustamos su collider.
        this.sprite = scene.matter.add.sprite(x1, y, sprt, 0);
        this.sprite.setRectangle(74, 16).setStatic(true);
        //Reproducimos su animación.
        this.sprite.anims.play(anim, true);
        //Parámetros para funciones.
        this.startPosX = x1;
        this.endPosX = x2;
        this.objectiveX = this.startPosX;
        this.increaseX = 0.07;
        this.delta = 1;

        //Establecemos colisiones con los jugadores androide.
        scene.matterCollision.addOnCollideActive({
            objectA: game.android1.mainBody,
            objectB: this.sprite,
            callback: () => (accelerate(this.objectiveX, this.sprite, this.increaseX, this.delta, game.android1)),
        });
        scene.matterCollision.addOnCollideActive({
            objectA: game.android2.mainBody,
            objectB: this.sprite,
            callback: () => (accelerate(this.objectiveX, this.sprite, this.increaseX, this.delta, game.android2)),
        });
        scene.matterCollision.addOnCollideEnd({
            objectA: game.android1.mainBody,
            objectB: this.sprite,
            callback: decelerate,
            context: game.android1
        });
        scene.matterCollision.addOnCollideEnd({
            objectA: game.android2.mainBody,
            objectB: this.sprite,
            callback: decelerate,
            context: game.android2
        });

        //Funciones accelerate y decelerate, para otorgar velocidad a los androides.
        function accelerate(oX, spr, incX, delt, andr) {
            (spr.x < oX) ? (andr.velInfluence = incX * delt) : (andr.velInfluence = -(incX * delt));
        }
        function decelerate() { this.velInfluence = 0; }
    }

    //Función update, que actualiza la posición de la plataforma.
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
