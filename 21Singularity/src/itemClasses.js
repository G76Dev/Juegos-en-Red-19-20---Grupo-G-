
//clase objeto arrastrable, hereda de la clase imagen de phaser
class draggableObject extends Phaser.GameObjects.Sprite{
  //objeto muy parecido a "Image" pero con atributos adicionales
  constructor(scene , x, y, interfaceTexture, texture, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 0, expireTime = 3000) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
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
  dropItemInGame(itemsBar, addColliderString) {
      var item = this.scene.matter.add.sprite(this.x + cam.scrollX, this.y + cam.scrollY, this.sprite);
      item.setScale(this.scaleImage);
      var addCollider = window[addColliderString];
      eval(addColliderString);
      item.body.collisionFilter.group = -1;
      item.setBounce(this.bounce);
      item.setVelocity(mouse.velocity.x/6,mouse.velocity.y/6);
      itemsBar.changeBar(itemsBar.energy - this.cost);
      return item; //devuelve la instancia creada
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
//objeto bomba
class draggableBomb extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.1, bounce = 0.5, coste = 10, expireTime = 3000) {
      super(scene , x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
  //cambio de metodo generico de draggableobject (si hay suficiente energia, llama al padre y continua con la explosion de la bomba)
  dropItemInGame(itemsBar) {
    if(itemsBar.energy > this.cost){
        var bombInstance = super.dropItemInGame(itemsBar, "item.setCircle(11)");
        bombInstance.setAngularVelocity(mouse.velocity.x/150);
        this.scene.time.delayedCall(this.expireTime, function() {
          //var explosion = scene.matter.add.sprite(bombInstance.x, bombInstance.y, key, 0);
          bombInstance.destroy();
        });
    }
  }
}

class draggableRect extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 25, expireTime = 3000) {
      super(scene, x, y, 'item2', 'item2', frame, scaleIntrefaceImage, scaleImage, bounce, coste, expireTime);
  }
}

//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
class itemBar{
  constructor(scene, positionX, separationY, initialSepY){
    var counter = 0;
    //energia del jugador humano
    this.energy = 100;
    this.items = [5];
    //cada objeto nuevo se añade al array de objetos
    this.items[0] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[1] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[2] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0,);
    this.items[3] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0);
    this.items[4] = new draggableRect(scene, positionX, initialSepY + separationY*(counter++),0);

    //sprite barra de energia
    this.bar = scene.add.image(positionX + 60,540/2,'bar');
    this.bar.originY = 1;
    this.bar.setDepth(99).setTint(0xFF5923).setScrollFactor(0);

    scene.input.on('drag', onDrag);
    scene.input.on('dragend', onDragEnd);

    //FUNCIONES DE ARRASTRE
    function onDrag(pointer, gameObject, dragX, dragY){
      gameObject.setScale(gameObject.scaleImage);
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
    /*
    function onDragStart(pointer, gameObject){
    }
    */
    function onDragEnd(pointer, gameObject, dropped){
      gameObject.dropItemInGame(usableItems);
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
