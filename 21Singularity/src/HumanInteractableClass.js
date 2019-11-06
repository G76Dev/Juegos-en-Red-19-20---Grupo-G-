class HumanInteractableClass{
  constructor(scene, itemBar, existingObj, mainObject, xObb, yObj, sprObj, sclObj, includeActivator = false, xAct = 0, yAct = 0, sprAct = "", sclAct = 0, follow = false, followXoffset = 0, followYoffset = 0){
    this.scene = scene;
    this.itemBar = itemBar;
    this.canActivate = true;
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
    if(this.canActivate && this.itemBar.energy > 20){
      this.isActive = !this.isActive;
      (this.isActive)? console.log("activated object") : console.log("desactivated object");
      this.objectActivate();
      this.itemBar.changeBar(this.itemBar.energy - 20);
    }
  }
  objectActivate(delay = false){
    (this.isActive) ? this.activator.setFrame(1) : this.activator.setFrame(0);
    if(delay){
      this.canActivate = false;
    }
  }
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
  constructor(scene, itemBar, door, xAct, yAct, distance){
    super(scene, itemBar, true, door, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1);
    this.mainObject.setDepth(-1);
    this.startPosY = this.mainObject.y;
    this.endPosY = this.startPosY + distance;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.075;
  }
  objectActivate(){
    super.objectActivate();
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
  constructor(scene, itemBar, xObb, yObj){
    super(scene, itemBar, false, null, xObb, yObj, "blue_fp", 1, false);
    this.mainObject.setStatic(true).setSensor(false);
  }
  update(){}
  objectActivate(){
    this.scene.time.addEvent({
      delay: 250,
      callback: () => (this.mainObject.setStatic(false))
    });
  }
}

class BlueRay extends HumanInteractableClass{
  constructor(scene, itemBar, mainObj, xAct, yAct){
    super(scene, itemBar, true , mainObj, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);
    this.ActiveYPos = [];
    for(var i=0; i<this.mainObject.length; i++){
      this.ActiveYPos[i] = this.mainObject[i].y;
      this.mainObject[i].y = -999;
    }
  }
  update(){}
  objectActivate(){
    super.objectActivate(true);
    this.scene.time.addEvent({
      delay: 750,
      callback: () => (change(this))
    });
    function change(obj) {
      if(obj.isActive){
        for(var i=0; i<obj.mainObject.length; i++){
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
      }else{
        for(var i=0; i<obj.mainObject.length; i++){
          obj.mainObject[i].y = -999;
        }
      }
      obj.canActivate = true;
    }
  }
}

class BlueRayDouble extends HumanInteractableClass{
  constructor(scene, itemBar, mainObj, xAct, yAct){
    super(scene, itemBar, true , mainObj, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);
    this.ActiveYPos = [];
    for(var i=0; i<this.mainObject.length; i++){
      this.ActiveYPos[i] = this.mainObject[i].y;
      if(i < 3)
      this.mainObject[i].y = -999;
    }
  }
  update(){}
  objectActivate(){
    super.objectActivate(true);
    this.scene.time.addEvent({
      delay: 750,
      callback: () => (change(this))
    });
    function change(obj) {
      if(obj.isActive){
        for(var i=0; i<3; i++){
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
        for(var i=3; i<6; i++){
          obj.mainObject[i].y = -999;
        }
      }else{
        for(var i=0; i<3; i++){
          obj.mainObject[i].y = -999;
        }
        for(var i=3; i<6; i++){
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
      }
      obj.canActivate = true;
    }
  }
}

class Press extends HumanInteractableClass{
  constructor(scene, itemBar, press){
    super(scene, itemBar, true, press, 0, 0, "", 1, false);
  }
  update(){}
  objectActivate(){
    if(this.mainObject.isReady)
      this.mainObject.startCycle(1,0);
    else
      this.itemBar.changeBar(this.itemBar.energy + 20);
  }
}

class FirePlatform extends HumanInteractableClass{
  constructor(scene, itemBar, xObb, yObj){
    super(scene, itemBar, false, null, xObb, yObj, "fire_fp", 1, false);
    this.mainObject.setRectangle(64, 21).setStatic(true);
    this.mainObject.setOrigin(0.5, 0.3);
    this.mainObject.anims.play('fire_fpS',true);
  }
  update(){}
  objectActivate(){
    this.scene.time.addEvent({
      delay: 250,
      callback: () => (this.mainObject.setStatic(false))
    });
  }
}

class InteractiveBlade extends HumanInteractableClass{
  constructor(scene, itemBar, blade, xObb, yObj, xAct, yAct, distance){
    super(scene, itemBar, true, blade, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);

    this.startPosX = xObb;
    this.endPosX = xObb + distance;
    this.objectiveX = this.startPosX;
    this.increaseX = 0;
  }
  objectActivate(){
    super.objectActivate();
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

class ElectricSurface extends HumanInteractableClass{
  constructor(scene, itemBar, elSurf){
    super(scene, itemBar, true, elSurf, 0, 0, "", 1, false);
  }
  update(){}
  objectActivate(){
    this.scene.time.addEvent({
      delay: 500,
      callback: () => (this.mainObject.turnOn())
    });
  }
}

class TeslaInteractable extends HumanInteractableClass{
  constructor(scene, itemBar, tesla){
    super(scene, itemBar, true, tesla, 0, 0, "", 1, false);
  }
  update(){}
  objectActivate(){
    if(this.mainObject.isReady)
      this.mainObject.startCycle(false,1000,1000);
    else
      this.itemBar.changeBar(this.itemBar.energy + 20);
  }
}

export default class HumanInteractablesArray{
  constructor(scene, itemBar){
    this.items = [];
    this.scene = scene;
    this.itemBar = itemBar;
  }

  initializeScene2(blueRays, blades,presses, doors){
    this.items = [];
    this.items[0] = new BlueRay(this.scene,this.itemBar,[blueRays[6], blueRays[7]], 3118, 113);
    this.items[1] = new InteractiveBlade(this.scene, blades[2], 3902, 576, 3950, 560, -300);
    this.items[2] = new Press(this.scene,this.itemBar, presses[8]);
    this.items[3] = new Press(this.scene,this.itemBar, presses[9]);
    this.items[4] = new Press(this.scene,this.itemBar, presses[10]);
    this.items[5] = new Press(this.scene,this.itemBar, presses[11]);
    this.items[6] = new Press(this.scene,this.itemBar, presses[12]);
    this.items[7] = new Press(this.scene,this.itemBar, presses[13]);

    this.items[8] = new BlueRayDouble(this.scene,this.itemBar,[blueRays[0], blueRays[1], blueRays[2], blueRays[3], blueRays[4], blueRays[5]], 5874, 370);

    this.items[9] = new GravityPlatform(this.scene,this.itemBar, 6972, 286);
    this.items[10] = new GravityPlatform(this.scene,this.itemBar, 6480, 296);
    this.items[11] = new GravityPlatform(this.scene,this.itemBar, 6800, 530);
  }
  initializeScene3(teslas, eSurfaces){
    this.items = [];
    this.items[0] = new FirePlatform(this.scene, this.itemBar, 6688, 434);
    this.items[1] = new TeslaInteractable(this.scene, this.itemBar, teslas[3]);
    this.items[2] = new TeslaInteractable(this.scene, this.itemBar, teslas[4]);
    this.items[3] = new TeslaInteractable(this.scene, this.itemBar, teslas[5]);
    this.items[4] = new TeslaInteractable(this.scene, this.itemBar, teslas[6]);

    this.items[5] = new ElectricSurface(this.scene, this.itemBar, eSurfaces[0]);
  }
  update(time, delta){
    for(var i=0; i<this.items.length; i++){
      this.items[i].update(time, delta);
    }
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
    super.objectActivate();
    if(this.isActive){
      this.mainObject.setStatic(false).setTint(0x00E3F2);
    }else{
      this.mainObject.setStatic(true).setTint(0xE17012);
    }
  }
}*/
