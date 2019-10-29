class InteractableClass{
  constructor(scene, xObb, yObj, sprObj, sclObj, xAct, yAct, sprAct, sclAct, follow = false,  human = true, android = false){
    this.scene = scene;
    this.mainObject = scene.matter.add.sprite(xObb, yObj, sprObj, 0);
    this.mainObject.setScale(sclObj);
    this.activator = scene.add.sprite(xAct, yAct, sprAct, 0);
    this.activator.setScale(sclAct);
    this.activator.setInteractive().on('pointerdown', this.onClick, this);
    this.isActive = false;
  }
  onClick(pointer, localX, localY, event){
    this.isActive = !this.isActive;
    (this.isActive)? console.log("activated object") : console.log("desactivated object");
    this.objectActivate();
  }
  objectActivate(){}
  update(){}
}

class Door extends InteractableClass{
  constructor(scene, xObb, yObj, xAct, yAct){
    super(scene, xObb, yObj, "bar", 0.5, xAct, yAct, "item2", 0.2);
    this.mainObject.setStatic(true).setDepth(-5);
    this.startPosY = yObj;
    this.endPosY = yObj + 200;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.075;
  }
  objectActivate(){
    if(!this.isActive){
      this.objectiveY = this.startPosY;
    }else{
      this.objectiveY = this.endPosY;
    }
  }
  update(time, delta){
    if(Math.abs(this.mainObject.y - this.objectiveY) > 1){
      if(this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * delta;
      else if(this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
  }
}

class DestructiblePlatform extends InteractableClass{
  constructor(scene, xObb, yObj, xAct, yAct){
    super(scene, xObb, yObj, "bar", 0.5, xAct, yAct, "item2", 0.2);
    this.mainObject.setStatic(true).setAngle(90).setTint(0xE17012);
    this.mainObject.body.name = "interactableBody";
  }
  objectActivate(){
    if(this.isActive){
      this.mainObject.setStatic(false).setTint(0x00E3F2);
    }else{
      this.mainObject.setStatic(true).setTint(0xE17012);
    }
  }
}

export default class AllInteractablesArray{
  constructor(scene, n){
    this.items = [n];
    this.items[0] = new Door(scene, 471, 290, 400, 200);
    this.items[1] = new DestructiblePlatform(scene, 1600, 295, 1400, 200);
  }

  update(time, delta){
    this.items[0].update(time, delta);
  }
}