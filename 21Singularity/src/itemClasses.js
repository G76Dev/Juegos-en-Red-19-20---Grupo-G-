//clase objeto arrastrable, hereda de la clase imagen de phaser
class draggableObject extends Phaser.GameObjects.Sprite{
  //objeto muy parecido a "Image" pero con atributos adicionales
  constructor(scene, itemsBar , x, y, interfaceTexture, texture, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 0, expireTime = 3000) {
      super(scene, x, y, texture, frame);
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
      item.setScale(this.scaleImage);
      var addCollider = window[addColliderString];
      eval(addColliderString);
      item.body.collisionFilter.group = -1;
      item.setBounce(this.bounce);
      item.setVelocity(this.scene.input.activePointer.velocity.x/6,this.scene.input.activePointer.velocity.y/6);
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
        bombInstance.setAngularVelocity(this.scene.input.activePointer.velocity.x/150);
        bombInstance.anims.play('eBomb', true);
        this.scene.time.addEvent({
          delay: this.expireTime,
          callback: () => (exprosion(this.scene, bombInstance.x, bombInstance.y))
        });
    }
    function exprosion(scene, posX, posY){
      bombInstance.destroy();
      var bombExprosion = scene.matter.add.sprite(posX, posY, "exprosion");
      bombExprosion.setScale(2.25).setCircle(32).setSensor(true).setStatic(true);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.sprite,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.sprite,
        objectB: bombExprosion,
        callback: inflictDamage,
        context: scene.android2
      });

      bombExprosion.on('animationcomplete', function(){
        bombExprosion.destroy();
      });
      bombExprosion.anims.play('exprosion', true);
    }
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged()}
  }
}

class draggableRect extends draggableObject{
  constructor(scene, itemsBar, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 25, expireTime = 3000) {
      super(scene, itemsBar, x, y, 'item2', 'item2', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
}

//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
export default class ItemBar{
  constructor(scene, positionX, separationY, initialSepY){
    var counter = 0;
    //energia del jugador humano
    this.energy = 100;
    this.items = [5];
    //cada objeto nuevo se añade al array de objetos
    this.items[0] = new draggableObject(scene,this, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[1] = new draggableObject(scene,this, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[2] = new draggableBomb(scene,this, positionX, initialSepY + separationY*(counter++),0,);
    this.items[3] = new draggableBomb(scene,this, positionX, initialSepY + separationY*(counter++),0);
    this.items[4] = new draggableRect(scene,this, positionX, initialSepY + separationY*(counter++),0);

    this.item_bar = scene.add.image(positionX,540/2,'item_bar');
    this.item_bar.originY = 1;
    this.item_bar.setDepth(90).setScrollFactor(0);
    //sprite barra de energia
    this.bar = scene.add.image(positionX + 60,540/2,'bar');
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
