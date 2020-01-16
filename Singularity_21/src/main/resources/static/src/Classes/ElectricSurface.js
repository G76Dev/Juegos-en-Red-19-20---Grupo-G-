//Clase ElectricSurface, para instanciar superficies eléctricas.
class ElectricSurface {
  constructor(scene, posX, posY, sprt , active, sprtElec, animElec){
    //Generamos el sprite y lo hacemos estático.
    this.sprite = scene.matter.add.image(posX, posY, sprt);
    this.sprite.setStatic(true);
    //Generamos el sprite de la electricidad y activamos su animación.
    this.elecSprite = scene.add.sprite(posX, posY, sprtElec, 0);
    this.elecSprite.anims.play(animElec, true);
    this.scene = scene;

    //Establecemos colisiones con los jugadores androide.
    this.unsubscribe1 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.game.android1.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.game.android1
    });
    this.unsubscribe2 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.game.android2.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.game.android2
    });

    //Función inflictDamaga, que daña a los androides.
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(0, bodyA.gameObject.y-bodyB.gameObject.y), 90);}

    //Si no se inicia activa, la apaga.
    if(!active){
      this.turnOff(scene);
    }
  }
  //Función turnOn, que enciende la superficie eléctrica.
  turnOn(scene, posX, posY, sprtElec, animElec){
    this.sprite.clearTint();
    this.elecSprite.setVisible(true);
    this.unsubscribe1 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.game.android1.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.game.android1
    });
    this.unsubscribe2 = this.scene.matterCollision.addOnCollideActive({
      objectA: this.scene.game.android2.mainBody,
      objectB: this.sprite,
      callback: inflictDamage,
      context: this.scene.game.android2
    });
    //Función inflictDamaga, que daña a los androides.
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(0, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
  }
  //Función turnOff, que apaga la superficie eléctrica.
  turnOff(scene, posX, sprtElec){
    this.elecSprite.setVisible(false);
    this.unsubscribe1();
    this.unsubscribe2();
  }
}
