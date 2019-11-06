//clase objeto arrastrable, hereda de la clase imagen de phaser
class draggableObject extends Phaser.GameObjects.Sprite{
  //objeto muy parecido a "Image" pero con atributos adicionales
  constructor(scene, itemsBar , x, y, interfaceTexture, texture, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 0, expireTime = 3000) {
      super(scene, x, y, interfaceTexture, frame);
      scene.add.existing(this);
      this.itemsBar = itemsBar;
      //profundidad de objeto
      this.setDepth(99)
      //coste del item
      this.cost = coste;
      //sprite de barra de objeto y sprite una vez lanzado el objeto en el escenario
      this.interfaceSprite = interfaceTexture;
      this.sprite = texture;
      //posicion inicial del sprite dentro de la barra de tareas
      this.startPosX = x;
      this.startPosY = y;
      //escala de la imgaen del interfaz
      this.scaleIntrefaceImage = scaleIntrefaceImage;
      this.setScale(scaleIntrefaceImage).setScrollFactor(0);
      //escala del objeto al ser lanzado en el escenario y su rebote
      this.scaleImage = scaleImage;
      this.bounce = bounce;
      //comandos para hacer que esta imagen dentro de la barra de tareas sea arrastrable (por esto hereda de Image)
      this.setInteractive();
      scene.input.setDraggable(this);
      //Tiempo en el que se va el item
      this.expireTime = expireTime;
  }
  //metodo para crear un objeto al soltar el ratón y dejar de arrastrar
  dropItemInGame(addColliderString) {
      var item = this.scene.matter.add.sprite(this.x + this.scene.cameras.main.scrollX, this.y + this.scene.cameras.main.scrollY, this.sprite);
      item.setScale(this.scaleImage).setDepth(5);
      var addCollider = window[addColliderString];
      eval(addColliderString);
      item.body.collisionFilter.group = -1;
      item.setBounce(this.bounce);
      this.itemsBar.changeBar(this.itemsBar.energy - this.cost);
      return item; //devuelve la instancia creada
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
//objeto bomba
class draggableBomb extends draggableObject{
  constructor(scene, itemsBar ,x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0.5, coste = 10, expireTime = 3000) {
      super(scene, itemsBar, x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre y continua con la explosion de la bomba)
  dropItemInGame() {
    var bombInstance;
    if(this.itemsBar.energy > this.cost){
        bombInstance = super.dropItemInGame("item.setCircle(11)");
        bombInstance.setOrigin(0.5, 0.61);
        var mouseVel = this.scene.input.activePointer.velocity;
        bombInstance.setVelocity(mouseVel.x/12,mouseVel.y/12);
        bombInstance.setAngularVelocity(mouseVel.x/200);
        bombInstance.anims.play('eBomb', true);
        this.scene.time.addEvent({
          delay: this.expireTime,
          callback: () => (exprosion(this.scene, bombInstance.x, bombInstance.y))
        });
    }
    function exprosion(scene, posX, posY){
      var bombExprosion = scene.matter.add.sprite(posX, posY, "exprosion");
      bombExprosion.setDepth(5).setScale(2.25).setCircle(32).setSensor(true).setStatic(true);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.android2
      });

      bombExprosion.on('animationcomplete', function(){
        bombExprosion.destroy();
      });
      bombExprosion.anims.play('exprosion', true);
      bombInstance.destroy();
    }
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
  }
}

class draggableSpike extends draggableObject{
  constructor(scene, itemsBar, x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0, coste = 25, expireTime = 1500) { //duracion 9000
      super(scene, itemsBar, x, y, 'item3', 'spikeBox', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  dropItemInGame() {
    if(this.itemsBar.energy > this.cost){
        var harmlessSpike = super.dropItemInGame("item.setRectangle(30,20)");
        var mouseVel = this.scene.input.activePointer.velocity;
        harmlessSpike.setOrigin(0.5,0.65).setFixedRotation().setVelocity(mouseVel.x/30,mouseVel.y/30);
        const unsubscribe = this.scene.matterCollision.addOnCollideStart({
          objectA: harmlessSpike,
          callback: eventData => {
            this.scene.time.addEvent({
              delay: this.expireTime,
              callback: () => (createSpike(this.scene, harmlessSpike.x, harmlessSpike.y))
            });
            unsubscribe();
          },
        });
    }

    function createSpike(scene, posX, posY){
      var spike = scene.matter.add.image(0, 0, "item3",0);
      spike.setBody({
        type: 'trapezoid',
        width: 36,
        height: 16,
        slope: 0.6
      });
      spike.setSensor(true).setOrigin(0.5,0.80).setPosition(posX,posY + 4).setStatic(true);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: spike,
        callback: inflictDamage,
        context: scene.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: spike,
        callback: inflictDamage,
        context: scene.android2
      });
      scene.time.addEvent({
        delay: 4500,
        callback: () => (spike.destroy())
      });
      harmlessSpike.destroy();
    }
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(0, bodyA.gameObject.y-bodyB.gameObject.y), 60);}
  }
}

//objeto laser
class draggableLaser extends draggableObject{
  constructor(scene, itemsBar ,x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0.5, coste = 10, expireTime = 4000) {
      super(scene, itemsBar, x, y, 'item1', 'laserNonLethal', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre y continua con la explosion de la bomba)
  dropItemInGame() {
    var laserGadget;
    if(this.itemsBar.energy > this.cost){
        laserGadget = super.dropItemInGame();
        laserGadget.setStatic(true);
        laserGadget.anims.play('laserNonLethal', true);
        this.scene.time.addEvent({
          delay: this.expireTime,
          callback: () => (laserActivate(this.scene, laserGadget.x, laserGadget.y))
        });
    }
    function laserActivate(scene, posX, posY){
      var laser = scene.matter.add.sprite(posX, posY, "laserLethal");
      laser.setDepth(5).setSensor(true).setStatic(true);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: laser,
        callback: inflictDamage,
        context: scene.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: laser,
        callback: inflictDamage,
        context: scene.android2
      });
      scene.time.addEvent({
        delay: 1000,
        callback: () => (laser.destroy())
      });
      laser.anims.play('laserLethal', true);
      laserGadget.destroy();
    }
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 135);}
  }
}

//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
export default class ItemBar{
  constructor(scene, positionX, separationY, initialSepY){
    var counter = 0;
    //energia del jugador humano
    this.energy = 100;
    this.items = [3];
    //cada objeto nuevo se añade al array de objetos
    this.items[0] = new draggableBomb(scene,this, positionX, initialSepY + separationY*(counter++),0,);
    this.items[1] = new draggableSpike(scene,this, positionX, initialSepY + separationY*(counter++),0);
    this.items[2] = new draggableLaser(scene,this, positionX, initialSepY + separationY*(counter++),0);

    this.item_bar = scene.add.image(positionX,540/2,'item_bar');
    this.item_bar.originY = 1;
    this.item_bar.setDepth(90).setScrollFactor(0);
    //sprite barra de energia
    this.bar = scene.add.image(positionX + 45,540/2,'bar');
    this.bar.originY = 1;
    this.bar.setDepth(99).setTint(0xFF5923).setScrollFactor(0);

    scene.input.on('drag', onDrag);
    scene.input.on('dragend', onDragEnd);

    //FUNCIONES DE ARRASTRE
    function onDrag(pointer, gameObject, dragX, dragY){
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
    /*
    function onDragStart(pointer, gameObject){
    }
    */
    function onDragEnd(pointer, gameObject, dropped){
      gameObject.dropItemInGame(this);
      gameObject.x = gameObject.startPosX;
      gameObject.y = gameObject.startPosY;
      gameObject.setScale(gameObject.scaleIntrefaceImage);
    }
  }

  //funcion cambiar cantidad de energia (ajustando la barra)
  changeBar(newEnergy){
    this.bar.scaleY = newEnergy/100;
    this.energy = newEnergy;
  }

  //funcion que restaura la cantidad de energia (ajustando la barra) cada update
  update(time, delta){
    var increaseRate = 0.01 * delta;
    if(this.bar.scaleY < 1){
      this.bar.scaleY += increaseRate/100;
      this.energy += increaseRate;
    } else{
      this.bar.scaleY = 1;
      this.energy = 100;
    }
  }
}
