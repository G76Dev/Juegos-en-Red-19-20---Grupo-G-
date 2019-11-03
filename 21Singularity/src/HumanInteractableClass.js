class HumanInteractableClass{
  constructor(scene, existingObj, mainObject, xObb, yObj, sprObj, sclObj, includeActivator = false, xAct = 0, yAct = 0, sprAct = "", sclAct = 0, follow = false, followXoffset = 0, followYoffset = 0){
    this.scene = scene;
    if(!existingObj){
      this.mainObject = scene.matter.add.sprite(xObb, yObj, sprObj, 0);
      this.mainObject.setScale(sclObj);
    }else{
      this.mainObject = mainObject;
    }
    this.isActive = false;
    if(includeActivator){
      this.activator = scene.add.sprite(xAct, yAct, sprAct, 0);
      this.activator.setScale(sclAct);
      this.activator.setInteractive().on('pointerdown', this.onClick, this);
      this.follow = follow;
      if(this.follow){
        this.followXoffset = followXoffset;
        this.followYoffset = followYoffset;
      }
    }else{
      if(this.mainObject instanceof Phaser.GameObjects.Sprite || this.mainObject instanceof Phaser.GameObjects.Image){
        this.mainObject.setInteractive().on('pointerdown', this.onClick, this);
      }else{
        this.mainObject.sprite.setInteractive().on('pointerdown', this.onClick, this);
      }
    }
  }
  onClick(pointer, localX, localY, event){
    this.isActive = !this.isActive;
    (this.isActive)? console.log("activated object") : console.log("desactivated object");
    this.objectActivate();
  }
  objectActivate(){}
  update(){
    if(this.follow){
      this.activator.x = this.mainObject.x + this.followXoffset;
      this.activator.y = this.mainObject.y + this.followYoffset;
      this.activator.setOrigin(this.followXoffset, this.followYoffset);
      this.activator.setAngle(this.mainObject.angle);
    }
  }
}

class Door extends HumanInteractableClass{
  constructor(scene, door, xAct, yAct, distance){
    super(scene, true, door, 0, 0, "", 1, true, xAct, yAct, "buttonUn", 1);
    this.mainObject.setDepth(-1);
    this.startPosY = this.mainObject.y;
    this.endPosY = this.startPosY + distance;
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
    super.update();
    if(Math.abs(this.mainObject.y - this.objectiveY) > 1){
      if(this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * delta;
      else if(this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
  }
}

class GravityPlatform extends HumanInteractableClass{
  constructor(scene, xObb, yObj){
    super(scene, false, null, xObb, yObj, "bar", 0.4, true, 0, 0, "item2", 0.2, true, 0 ,0.5);
    this.mainObject.setStatic(true).setAngle(90);
  }
  objectActivate(){
    this.mainObject.setStatic(false);
  }
  update(){
    super.update();
  }
}

class GravityPlatform2 extends HumanInteractableClass{
  constructor(scene, xObb, yObj){
    super(scene, false, null, xObb, yObj, "bar", 0.4, false);
    this.mainObject.setStatic(true).setAngle(90);
  }
  objectActivate(){
    this.mainObject.setStatic(false);
  }
}

class BlueRay extends HumanInteractableClass{
  constructor(scene, mainObj, xAct, yAct){
    super(scene, true , mainObj, 0, 0, "", 1, true, xAct, yAct, "buttonUn", 1, false);
    this.ActiveYPos = [];
    for(var i=0; i<this.mainObject.length; i++){
      this.ActiveYPos[i] = this.mainObject[i].y;
      this.mainObject[i].y = -999;
    }
  }
  objectActivate(){
    for(var i=0; i<this.mainObject.length; i++){
      this.mainObject[i].y = this.ActiveYPos[i];
    }
  }
}

class Press extends HumanInteractableClass{
  constructor(scene, press){
    super(scene, true, press, 0, 0, "", 1, false);
  }
  objectActivate(){
    if(this.mainObject.isReady)
    this.mainObject.startCycle(1,0);
  }
}

class InteractiveBlade extends HumanInteractableClass{
  constructor(scene, blade, xObb, yObj, xAct, yAct, distance){
    super(scene, true, blade, 0, 0, "", 1, true, xAct, yAct, "buttonUn", 1, false);

    this.startPosX = xObb;
    this.endPosX = xObb + distance;
    this.objectiveX = this.startPosX;
    this.increaseX = 0;
  }
  objectActivate(){
    if(!this.isActive){
      this.increaseX = 0;
    }else{
      this.increaseX = 0.15;
    }
  }
  update(time, delta){
    super.update();
    if(Math.abs(this.mainObject.x - this.objectiveX) > 4){
      if(this.mainObject.x < this.objectiveX)
        this.mainObject.x += this.increaseX * delta;
      else if(this.mainObject.x > this.objectiveX)
        this.mainObject.x -= this.increaseX * delta;
    }else{
      if(Math.abs(this.mainObject.x - this.startPosX) < 10)
        this.objectiveX = this.endPosX;
      else if(Math.abs(this.mainObject.x - this.endPosX) < 10)
        this.objectiveX = this.startPosX;
    }
  }
}

export default class HumanInteractablesArray{
  constructor(scene, blueRays, blades,presses, doors){
    this.items = [];
    this.items[0] = new BlueRay(scene,[blueRays[6], blueRays[7]], 3118, 113);
    //this.items[1] = new GravityPlatform(scene, 1250, 476);
    this.items[1] = new InteractiveBlade(scene, blades[2], 3902, 576, 3950, 560, -300);
    //this.items[0] = new GravityPlatform2(scene, 762, 476);
    this.items[2] = new Door(scene, doors[0], 2830, 464, -100);

    this.items[3] = new Press(scene, presses[8]);
    this.items[4] = new Press(scene, presses[9]);
    this.items[5] = new Press(scene, presses[10]);
    this.items[6] = new Press(scene, presses[11]);
    this.items[7] = new Press(scene, presses[12]);
    this.items[8] = new Press(scene, presses[13]);
  }

  update(time, delta){
    this.items[1].update(time, delta);
    this.items[2].update(time, delta);
  }
}


/*
class GravityPlatform2 extends InteractableClass{
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
}*/
