class AndroidInteractableClass{
  constructor(scene, existingObj, mainObject, xObb, yObj, sprObj, sclObj, includeActivator = false, xAct = 0, yAct = 0, sprAct = "generic", sclAct = 0, follow = false, followXoffset = 0, followYoffset = 0){
    this.scene = scene;
    if(!existingObj){
      this.mainObject = scene.matter.add.sprite(xObb, yObj, sprObj, 0);
      this.mainObject.setScale(sclObj);
    }else{
      this.mainObject = mainObject;
    }
    this.isActive = false;
    this.collidingAndroid1 = false;
    this.collidingAndroid2 = false;
    if(includeActivator){
      this.activator = scene.matter.add.sprite(xAct, yAct, sprAct, 0,{isSensor: true , isStatic: true});
      this.activator.setScale(sclAct);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: this.activator,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android1.mainBody,
        objectB: this.activator,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: this.activator,
        callback: changeIsColliding2,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android2.mainBody,
        objectB: this.activator,
        callback: changeIsColliding2,
        context: this
      });
      this.follow = follow;
      if(this.follow){
        this.followXoffset = followXoffset;
        this.followYoffset = followYoffset;
      }
    }else{
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android1.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding2,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android2.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding2,
        context: this
      });
    }
    function changeIsColliding1(){this.collidingAndroid1 = !this.collidingAndroid1;}
    function changeIsColliding2(){this.collidingAndroid2 = !this.collidingAndroid2;}

    scene.android1.cursors.coop.on('down', function(event){
      if(this.collidingAndroid1){
        this.isActive = !this.isActive;
        (this.isActive)? console.log("activated object") : console.log("desactivated object");
        this.objectActivate();
      }
    }, this);
    scene.android2.cursors.coop.on('down', function(event){
      if(this.collidingAndroid2){
        this.isActive = !this.isActive;
        (this.isActive)? console.log("activated object") : console.log("desactivated object");
        this.objectActivate();
      }
    }, this);
  }
  objectActivate(){
    (this.isActive) ? this.activator.setFrame(1) : this.activator.setFrame(0);
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

class Door extends AndroidInteractableClass{
  constructor(scene, door, xAct, yAct, distance){
    super(scene, true, door, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1);
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

class DoorTimer extends AndroidInteractableClass{
  constructor(scene, door, xAct, yAct, distance){
    super(scene, true, door, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1);
    this.mainObject.setDepth(-11);
    this.startPosY = this.mainObject.y;
    this.endPosY = this.startPosY + distance;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.1;
  }
  objectActivate(){
    super.objectActivate();
    if(this.objectiveY = this.startPosY){
      this.objectiveY = this.endPosY;
      this.scene.time.addEvent({
        delay: 1800,
        callback: () => (reset(this)),
      });
      function reset(obj){obj.objectiveY = obj.startPosY;}
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

class Elevator extends AndroidInteractableClass{
  constructor(scene, xObb, yObj, scale, xAct, yAct, newPosY){
    super(scene, false , null, xObb, yObj, "elevator", scale, true, xAct, yAct, "orangeButton", 1);
    this.mainObject.setRectangle(92,12).setOrigin(0.5,0.3).setStatic(true);
    this.startPosY = yObj;
    this.endPosY = newPosY;
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

class OrangeRay extends AndroidInteractableClass{
  constructor(scene, mainObj, xAct, yAct){
    super(scene, true , mainObj, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1, false);
  }
  update(){}
  objectActivate(){
    super.objectActivate();
    for(var i=0; i<this.mainObject.length; i++){
      this.mainObject[i].destroy();
    }
  }
}

class OrangeRayRestore extends AndroidInteractableClass{
  constructor(scene, mainObj, xAct, yAct){
    super(scene, true , mainObj, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1, false);
    this.isReady = true;
    this.initialY = [];
    for(var i=0; i<this.mainObject.length; i++){
      this.initialY[i] = this.mainObject[i].y;
    }
  }
  update(){}
  objectActivate(){
    super.objectActivate();
    if(this.isReady){
      this.isReady = false;
      for(var i=0; i<this.mainObject.length; i++){
        this.mainObject[i].y = -999;
      }
      this.scene.time.addEvent({
        delay: 400,
        callback: () => (restoreLaser(this, this.initialY)),
      });
      function restoreLaser(obj, initialY){
        for(var i=0; i<obj.mainObject.length; i++){
          obj.mainObject[i].y = initialY[i];
        }
        obj.isActive = false;
        obj.activator.setFrame(0);
        obj.isReady = true;
      }
    }
  }
}

class FirePlatform extends AndroidInteractableClass{
  constructor(scene, xObb, yObj){
    super(scene, false, null, xObb, yObj, "fire_fp", 1, false);
    this.mainObject.setRectangle(64, 21).setStatic(true);
    this.mainObject.setOrigin(0.5, 0.3);
    this.mainObject.anims.play('fire_fpS',true);

    scene.matterCollision.addOnCollideStart({
      objectA: scene.android1.mainBody,
      objectB: this.mainObject,
      callback: objectActivate,
      context: this
    });
    scene.matterCollision.addOnCollideStart({
      objectA: scene.android2.mainBody,
      objectB: this.mainObject,
      callback: objectActivate,
      context: this
    });

    function objectActivate(){
      this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.mainObject.setStatic(false))
      });
    }

  }
  update(){}
}

export default class AndroidInteractablesArray{
  constructor(scene){
    this.items = [];
    this.scene = scene;
  }

  initializeScene2(orangeRays, doors){
    this.items = [];
    this.items[0] = new Elevator(this.scene, 2258, 424, 1 ,2128,144, 200);
    this.items[1] = new OrangeRay(this.scene, [orangeRays[3],orangeRays[4],orangeRays[5]] ,1616,176);
    this.items[2] = new Elevator(this.scene, 4078, 574, 1 ,4148, 560, 328);
    this.items[3] = new DoorTimer(this.scene, doors[1], 4240, 562, -100);
    this.items[4] = new DoorTimer(this.scene, doors[2], 4240, 306, -100);
    this.items[5] = new Door(this.scene, doors[3], 6512, 466, 100);
    this.items[6] = new Door(this.scene, doors[4], 7182, 466, 100);
    this.items[7] = new Elevator(this.scene, 7280, 613, 1 ,7342, 560, 356);
    this.items[8] = new OrangeRayRestore(this.scene, [orangeRays[28],orangeRays[29],orangeRays[30],orangeRays[31]] ,7488,336);
    this.items[9] = new OrangeRay(this.scene, [orangeRays[8],orangeRays[9],orangeRays[10]] ,7886,434);
    this.items[10] = new Elevator(this.scene, 7696, 456, 1 ,7600, 338, 70);
    this.items[11] = new OrangeRay(this.scene, [orangeRays[6],orangeRays[7]] ,6864,208);
    this.items[12] = new Door(this.scene, doors[0], 2830, 464, -100);
  }
  initializeScene3(){
    this.items = [];
    this.items[0] = new Elevator(this.scene, 1776, 324, 1 ,1714,308, 518);
    this.items[1] = new Elevator(this.scene, 2896, 518, 1 ,2832,368, 260);
    this.items[2] = new Elevator(this.scene, 3024, 112, 1 ,2960,518, 134);
    this.items[3] = new Elevator(this.scene, 5586, 518, 1 ,5520,498, 390);

    this.items[4] = new FirePlatform(this.scene, 1472, 300);
    this.items[5] = new FirePlatform(this.scene, 3776, 176);
    this.items[6] = new FirePlatform(this.scene, 3968, 176);
    this.items[7] = new FirePlatform(this.scene, 4160, 176);
    this.items[8] = new FirePlatform(this.scene, 4352, 176);
  }
  update(time, delta){
    for(var i=0; i<this.items.length; i++){
      this.items[i].update(time, delta);
    }
  }
}


/*424 - 202 = 222
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
