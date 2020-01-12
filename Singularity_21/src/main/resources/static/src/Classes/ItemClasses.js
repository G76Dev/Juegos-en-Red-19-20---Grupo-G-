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
      //se crea e inicializa el objeto
      const item = this.scene.matter.add.sprite(this.x + this.scene.cameras.main.scrollX, this.y + this.scene.cameras.main.scrollY, this.sprite);
      item.setScale(this.scaleImage).setDepth(5);
      const addCollider = window[addColliderString];
      eval(addColliderString);
      item.body.collisionFilter.group = -1;
      item.setBounce(this.bounce);
      //se quita la energia correspondiente
      this.itemsBar.changeBar(this.itemsBar.energy - this.cost);
      return item; //devuelve la instancia creada
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
//objeto bomba, hereda de draggableObject, por lo que al ser inicializada, tmb inicializa super(), es decir draggableObject
class draggableBomb extends draggableObject{
  constructor(scene, itemsBar ,x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0.5, coste = 20, expireTime = 2000) {
      super(scene, itemsBar, x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre y continua con la explosion de la bomba)
  dropItemInGame() {
    var bombInstance;
    if(this.itemsBar.energy > this.cost){
        bombInstance = super.dropItemInGame("item.setCircle(11)");
        bombInstance.setOrigin(0.5, 0.61);
        //se aplica el momento del raton
        var mouseVel = this.scene.input.activePointer.velocity;
        bombInstance.setVelocity(mouseVel.x/12,mouseVel.y/12);
        bombInstance.setAngularVelocity(mouseVel.x/200);
        //animacion de bomba antes de explotar
        bombInstance.anims.play('eBomb', true);
        //despues de un delay explota
        this.scene.time.addEvent({
          delay: this.expireTime,
          callback: () => (exprosion(this.scene, bombInstance.x, bombInstance.y))
        });
    }
    //funcion de explosion de bomba
    function exprosion(scene, posX, posY){
      //crea e inicializa una instancia de explosion con su sprite
      const bombExprosion = scene.matter.add.sprite(posX, posY, "exprosion");
      bombExprosion.setDepth(5).setScale(2.25).setCircle(32).setSensor(true).setStatic(true);
      //se añaden colliders especificos con la explosion y ambos androides, si chocan so dañados
      const unsubscribe1 = scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android1.mainBody,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.game.android1
      });
      const unsubscribe2 = scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android2.mainBody,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.game.android2
      });
      //al completar su animacion de explsion, dicha instancia se autodestruye
      bombExprosion.on('animationcomplete', function(){
        bombExprosion.destroy();
      });
      //animacion de explosion
      bombExprosion.anims.play('exprosion', true);
      //despues de 150 steps, los colliders de la explosion ya no pueden matar al jugador
      scene.time.addEvent({
        delay: 150,
        callback: () => (unsubscribe1(), unsubscribe2())
      });
      var bombSound = scene.sound.add('bomb', {volume: scene.game.soundVolume});
      bombSound.play();
      bombInstance.destroy();
    }
    //funcion de infligir daño
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
  }
}
//objeto pincho, hereda de draggableObject (coloca unos pinchos en el suelo y despues de un delay estos aparecen)
class draggableSpike extends draggableObject{
  constructor(scene, itemsBar, x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0, coste = 50, expireTime = 1500) { //duracion 9000
      super(scene, itemsBar, x, y, 'item3', 'spikeBox', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre)
  dropItemInGame() {
    if(this.itemsBar.energy > this.cost){
        //se crea un pincho inofensivo que despues de un rato dañara al jugador
        var harmlessSpike = super.dropItemInGame("item.setRectangle(30,20)");
        harmlessSpike.setOrigin(0.5,0.65).setFixedRotation();
        //se inicializan las colisiones del objeto harmlessSpike (pinco sin activar) con el suelo, si lo toca llama a la funcion de crear pinchos
        const unsubscribe = this.scene.matterCollision.addOnCollideStart({
          objectA: harmlessSpike,
          callback: eventData => {
            this.scene.time.addEvent({
              delay: this.expireTime,
              //una vez caido y pasado un delay (this.expireTime) se crea e inicializa el pincho
              callback: () => (createSpike(this.scene, harmlessSpike.x, harmlessSpike.y))
            });
            //una vez colisionado con el suelo, no hace falta el eventlistener de las colisiones que detectan cuando se cae
            unsubscribe();
          },
        });
    }
    //se crea e inicializa el pincho de verdad, que daña al jugador
    function createSpike(scene, posX, posY){
      const spike = scene.matter.add.image(0, 0, "item3",0);
      spike.setBody({
        type: 'trapezoid',
        width: 28,
        height: 16,
        slope: 0.45
      });
      spike.setSensor(true).setOrigin(0.5,0.80).setPosition(posX,posY + 4).setStatic(true);
      //se añaden las colisiones dañinas con android 1 y android 2 (si tocan los pinchos se llama a la funcion inflictDamage())
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android1.mainBody,
        objectB: spike,
        callback: inflictDamage,
        context: scene.game.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android2.mainBody,
        objectB: spike,
        callback: inflictDamage,
        context: scene.game.android2
      });
      scene.time.addEvent({
        delay: 4500,
        callback: () => (spike.destroy())
      });
      harmlessSpike.destroy();
    }
    //funcion que dañña a los androides si tocan los pinchos
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(0, bodyA.gameObject.y-bodyB.gameObject.y), 60);}
  }
}

//objeto laser, hereda de draggableObject, por lo que al ser inicializada, tambien inicializa super(), es decir draggableObject
class draggableLaser extends draggableObject{
  constructor(scene, itemsBar ,x, y, frame, scaleIntrefaceImage = 1, scaleImage = 1, bounce = 0.5, coste = 90, expireTime = 2000) {
    super(scene, itemsBar, x, y, 'laser_icon', 'laserNonLethal', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre)
  dropItemInGame() {
    //antes de iniciar el laser dañino se crea un laser inofensivo de advertencia
    var laserGadget;
    if(this.itemsBar.energy > this.cost){
        laserGadget = super.dropItemInGame();
        //el laser siempre se inicializará en la parte media de la pantalla (x + camera.x)
        laserGadget.x = 480+this.scene.cameras.main.scrollX;
        laserGadget.setStatic(true);
        //animacion del laser inofensivo
        laserGadget.anims.play('laserNonLethalS', true);
        //despues de un delay se crea el laser dañino
        this.scene.time.addEvent({
          delay: this.expireTime,
          callback: () => (laserActivate(this.scene, laserGadget.x, laserGadget.y))
        });
    }
    //funcion de laser dañino
    function laserActivate(scene, posX, posY){
      //se crea e inicializa el laser dañino
      const laser = scene.matter.add.sprite(480+scene.cameras.main.scrollX, posY, "laserLethal");
      laser.setDepth(5).setSensor(true).setStatic(true);
      //se añaden las colisiones dañinas con android 1 y android 2 (si tocan el laser se llama a la funcion inflictDamage())
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android1.mainBody,
        objectB: laser,
        callback: inflictDamage,
        context: scene.game.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android2.mainBody,
        objectB: laser,
        callback: inflictDamage,
        context: scene.game.android2
      });
      scene.time.addEvent({
        delay: 1000,
        callback: () => (laser.destroy())
      });
      laser.anims.play('laserLethalS', true);
      var laserSound = scene.sound.add('laser', {volume: scene.game.soundVolume});
      laserSound.play();
      laserGadget.destroy();
    }
    //funcion que daña a los androides si tocan el laser
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 135);}
  }
}

//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
class ItemBar{
  constructor(scene, positionX, separationY, initialSepY){
    var counter = 0;
    //energia del jugador humano
    this.energy = 100;
    this.items = [3];
    //cada objeto nuevo se añade al array de objetos
    this.items[0] = new draggableBomb(scene,this, positionX-14, initialSepY + separationY*(counter++),0,);
    this.items[1] = new draggableSpike(scene,this, positionX-14, initialSepY + separationY*(counter++),0);
    this.items[2] = new draggableLaser(scene,this, positionX-14, initialSepY + separationY*(counter++),0);

    //sprite decorativo de barra de items
    this.item_bar = scene.add.image(positionX,540/2,'item_bar');
    this.item_bar.originY = 1;
    this.item_bar.setDepth(90).setScrollFactor(0);

    //se crea una barra de energia, que se ira consumiendo según se usen items
    this.bar = scene.add.image(positionX + 27,278,'bar');
    this.bar.originY = 1;
    this.bar.setDepth(99).setScrollFactor(0);

    //event listener de las funciones de arrastre de los items arrastrables
    scene.input.on('drag', onDrag);
    scene.input.on('dragend', onDragEnd);

    //FUNCIONES DE ARRASTRE
    //al sujetar un objeto
    function onDrag(pointer, gameObject, dragX, dragY){
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
    /*
    function onDragStart(pointer, gameObject){
    }
    */
    //al soltar un objeto
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
    //cantidad de energia recuperada cada segundo
    var increaseRate = 0.005 * delta;
    if(this.bar.scaleY < 1){
      this.bar.scaleY += increaseRate/100;
      this.energy += increaseRate;
    } else{
      this.bar.scaleY = 1;
      this.energy = 100;
    }
  }
}
