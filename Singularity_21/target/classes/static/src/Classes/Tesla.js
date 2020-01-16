//Clase Tesla, para instanciar Bobinas teslas.
class Tesla {
  constructor(scene, posX, posY, sprt, anim) {
    //Generamos el sprite.
    this.sprite = scene.add.sprite(posX, posY, sprt, 0);
    this.sprite.setDepth(-4);
    this.scene = scene;
    this.isReady = true;

    //Generamos el sprite de la tesla activada, cambiamos su collider, la activamos como sensor,
    //la hacemos estática y la iniciamos invisible. Además cambiamos su posición.
    this.electricSprite = scene.matter.add.sprite(posX, -999, anim, 0);
    this.electricSprite.setCircle(46).setSensor(true).setStatic(true).setDepth(1).setVisible(false);
    this.electrisSpY = posY - 16;
    //Reproducimos su animación.
    this.electricSprite.anims.play(anim, true);

    //Establecemos colisiones con los jugadores androide.
    scene.matterCollision.addOnCollideActive({
      objectA: scene.game.android1.mainBody,
      objectB: this.electricSprite,
      callback: inflictDamage,
      context: scene.game.android1
    });
    scene.matterCollision.addOnCollideActive({
      objectA: scene.game.android2.mainBody,
      objectB: this.electricSprite,
      callback: inflictDamage,
      context: scene.game.android2
    });

    //Función inflictDamaga, que daña a los androides.
    function inflictDamage({ bodyA, bodyB, pair }) { this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x - bodyB.gameObject.x, bodyA.gameObject.y - bodyB.gameObject.y), 135); }

  }

  //Función startCycle, que inicia el ciclo de activado/desactivado para las bobinas automáticas.
  startCycle(loop, timer, del = 0) {
    if (this.isReady) {
      this.isReady = false;
      this.scene.time.addEvent({
        delay: del,
        callback: () => (delayedOn(this.scene, this), this.sprite.clearTint())
      });
      //Función delayedOn, que activa la tesla.
      function delayedOn(scene, obj) {
        obj.electricSprite.y = obj.electrisSpY;
        obj.electricSprite.setVisible(true);
        if (timer != -1) {
          scene.time.addEvent({
            delay: timer,
            callback: () => (off(scene, obj))
          });
          //Función off, que apaga la tesla.
          function off(scene, obj) {
            obj.electricSprite.y = -999;
            obj.electricSprite.setVisible(false);
            scene.time.addEvent({
              delay: timer,
              callback: () => (startAgain(scene, obj))
            });
            //Función startAgain, que vuelve a llamar a startCycle.
            function startAgain(scene, obj) {
              obj.isReady = true;
              if (loop) {
                obj.startCycle(loop, timer, del)
              }
            }
          }
        }
      }
    }
  }
}
