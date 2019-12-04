//Clase AndroidInteractableClass, para los elementos con los que pueden interactuar los androides.
class AndroidInteractableClass {
  constructor(scene, existingObj, mainObject, xObb, yObj, sprObj, sclObj, includeActivator = false, xAct = 0, yAct = 0, sprAct = "generic", sclAct = 0, follow = false, followXoffset = 0, followYoffset = 0) {
    this.scene = scene;
    if (!existingObj) {
      this.mainObject = scene.matter.add.sprite(xObb, yObj, sprObj, 0);
      this.mainObject.setScale(sclObj);
    } else {
      this.mainObject = mainObject;
    }
    this.isActive = false;
    this.collidingAndroid1 = false;
    this.collidingAndroid2 = false;
    if (includeActivator) {
      this.activator = scene.matter.add.sprite(xAct, yAct, sprAct, 0, { isSensor: true, isStatic: true });
      this.activator.setScale(sclAct);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android1.mainBody,
        objectB: this.activator,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android1.mainBody,
        objectB: this.activator,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android2.mainBody,
        objectB: this.activator,
        callback: changeIsColliding2,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android2.mainBody,
        objectB: this.activator,
        callback: changeIsColliding2,
        context: this
      });
      this.follow = follow;
      if (this.follow) {
        this.followXoffset = followXoffset;
        this.followYoffset = followYoffset;
      }
    } else {
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android1.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android1.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding1,
        context: this
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.game.android2.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding2,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android2.mainBody,
        objectB: this.mainObject,
        callback: changeIsColliding2,
        context: this
      });
    }
    function changeIsColliding1() { this.collidingAndroid1 = !this.collidingAndroid1; }
    function changeIsColliding2() { this.collidingAndroid2 = !this.collidingAndroid2; }

    scene.game.android1.cursors.coop.on('down', function (event) {
      if (this.collidingAndroid1) {
        this.isActive = !this.isActive;
        (this.isActive) ? console.log("activated object") : console.log("desactivated object");
        this.objectActivate();
      }
    }, this);
    scene.game.android2.cursors.coop.on('down', function (event) {
      if (this.collidingAndroid2) {
        this.isActive = !this.isActive;
        (this.isActive) ? console.log("activated object") : console.log("desactivated object");
        this.objectActivate();
      }
    }, this);
  }
  objectActivate() {
    (this.isActive) ? this.activator.setFrame(1) : this.activator.setFrame(0);
  }
  update() {
    if (this.follow) {
      this.activator.x = this.mainObject.x + this.followXoffset;
      this.activator.y = this.mainObject.y + this.followYoffset;
      this.activator.setOrigin(this.followXoffset, this.followYoffset);
      this.activator.setAngle(this.mainObject.angle);
    }
  }
}

//Clase Door, para instanciar puertas.
class Door extends AndroidInteractableClass {
  constructor(scene, door, xAct, yAct, sprtAct, distance) {
    super(scene, true, door, 0, 0, "", 1, true, xAct, yAct, sprtAct, 1);
    this.mainObject.setDepth(-9);
    this.startPosY = this.mainObject.y;
    this.endPosY = this.startPosY + distance;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.075;
  }
  objectActivate() {
    super.objectActivate();
    if (!this.isActive) {
      this.objectiveY = this.startPosY;
    } else {
      this.objectiveY = this.endPosY;
    }
  }
  update(time, delta) {
    super.update();
    if (Math.abs(this.mainObject.y - this.objectiveY) > 1) {
      if (this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * delta;
      else if (this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
  }
}

//Clase DoorTimer, para instanciar puertas que se cierran al cabo de un tiempo.
class DoorTimer extends AndroidInteractableClass {
  constructor(scene, door, xAct, yAct, distance) {
    super(scene, true, door, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1);
    this.mainObject.setDepth(-11);
    this.startPosY = this.mainObject.y;
    this.endPosY = this.startPosY + distance;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.1;
  }
  objectActivate() {
    super.objectActivate();
    if (this.objectiveY = this.startPosY) {
      this.objectiveY = this.endPosY;
      this.scene.time.addEvent({
        delay: 1800,
        callback: () => (reset(this)),
      });
      function reset(obj) { obj.objectiveY = obj.startPosY; }
    }
  }
  update(time, delta) {
    super.update();
    if (Math.abs(this.mainObject.y - this.objectiveY) > 1) {
      if (this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * delta;
      else if (this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
  }
}

//Clase Elevator, para instanciar ascensores.
class Elevator extends AndroidInteractableClass {
  constructor(scene, xObb, yObj, sprt, xAct, yAct, sprtAct, newPosY) {
    super(scene, false, null, xObb, yObj, sprt, 1, true, xAct, yAct, sprtAct, 1);
    this.mainObject.setRectangle(92, 12).setOrigin(0.5, 0.3).setStatic(true);
    this.startPosY = yObj;
    this.endPosY = newPosY;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.075;
  }
  objectActivate() {
    super.objectActivate();
    if (!this.isActive) {
      this.objectiveY = this.startPosY;
    } else {
      this.objectiveY = this.endPosY;
    }
  }
  update(time, delta) {
    super.update();
    if (Math.abs(this.mainObject.y - this.objectiveY) > 1) {
      if (this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * delta;
      else if (this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
  }
}

//Clase OrangeRay, para instanciar rayos naranjas.
class OrangeRay extends AndroidInteractableClass {
  constructor(scene, mainObj, xAct, yAct) {
    super(scene, true, mainObj, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1, false);
  }
  update() { }
  objectActivate() {
    super.objectActivate();
    for (var i = 0; i < this.mainObject.length; i++) {
      this.mainObject[i].destroy();
    }
  }
}

//Clase OrangeRayRestore, para instanciar rayos naranjas que vuelven a aparecer.
class OrangeRayRestore extends AndroidInteractableClass {
  constructor(scene, mainObj, xAct, yAct) {
    super(scene, true, mainObj, 0, 0, "", 1, true, xAct, yAct, "orangeButton", 1, false);
    this.isReady = true;
    this.initialY = [];
    for (var i = 0; i < this.mainObject.length; i++) {
      this.initialY[i] = this.mainObject[i].y;
    }
  }
  update() { }
  objectActivate() {
    super.objectActivate();
    if (this.isReady) {
      this.isReady = false;
      for (var i = 0; i < this.mainObject.length; i++) {
        this.mainObject[i].y = -999;
      }
      this.scene.time.addEvent({
        delay: 400,
        callback: () => (restoreLaser(this, this.initialY)),
      });
      function restoreLaser(obj, initialY) {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = initialY[i];
        }
        obj.isActive = false;
        obj.activator.setFrame(0);
        obj.isReady = true;
      }
    }
  }
}

//Clase FirePlatform, para instanciar plataformas que se caen al tocarlas.
class FirePlatform {
  constructor(scene, xObb, yObj) {
    this.mainObject = scene.matter.add.sprite(xObb, yObj, "fire_fp");
    this.mainObject.setRectangle(64, 21).setStatic(true);
    this.mainObject.setOrigin(0.5, 0.3);
    this.mainObject.anims.play('fire_fpS', true);
    this.initialX = xObb;

    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android1.mainBody,
      objectB: this.mainObject,
      callback: objectActivate,
      context: this
    });
    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android2.mainBody,
      objectB: this.mainObject,
      callback: objectActivate,
      context: this
    });

    function objectActivate() {
      scene.time.addEvent({
        delay: 250,
        callback: () => (this.mainObject.setStatic(false), this.mainObject.setFixedRotation())
      });
    }

  }
  update() {
    this.mainObject.x = this.initialX;
  }
}

//Clase ElectricSurface, para instanciar superficies eléctricas que pueden desactivarse.
class ElectricSurface extends AndroidInteractableClass {
  constructor(scene, elSurf, xAct, yAct) {
    super(scene, true, elSurf, 0, 0, "", 1, true, xAct, yAct, "orangeLever", 1, false);
  }
  update() { }
  objectActivate() {
    super.objectActivate();
    if (!this.isActive) {
      this.mainObject.turnOn();
    } else {
      this.mainObject.turnOff();
    }
  }
}

//Clase FinishLine, para instanciar una meta para terminar un nivel.
class FinishLine {
  constructor(scene, xObb, yObj) {
    this.mainObject = scene.matter.add.sprite(xObb, yObj, 'finishLine', 0);
    this.mainObject.setRectangle(64, 96);
    this.mainObject.setStatic(true).setSensor(true).setScale(3.5,1);

    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android1.mainBody,
      objectB: this.mainObject,
      callback: function () { this.arrived = true },
      context: scene.game.android1
    });
    scene.matterCollision.addOnCollideStart({
      objectA: scene.game.android2.mainBody,
      objectB: this.mainObject,
      callback: function () { this.arrived = true },
      context: scene.game.android2
    });

    scene.matterCollision.addOnCollideEnd({
      objectA: scene.game.android1.mainBody,
      objectB: this.mainObject,
      callback: function () { this.arrived = false },
      context: scene.game.android1
    });
    scene.matterCollision.addOnCollideEnd({
      objectA: scene.game.android2.mainBody,
      objectB: this.mainObject,
      callback: function () { this.arrived = false },
      context: scene.game.android2
    });
  }
  update() {

  }
}

//Exportamos el array de interactuables.
export default class AndroidInteractablesArray {
  constructor(scene) {
    this.items = [];
    this.scene = scene;
  }

  //Inicializamos la escena 2 (nivel 1).
  initializeScene2(orangeRays, doors) {
    this.items = [];
    this.items[0] = new Elevator(this.scene, 2258, 424, "elevator1", 2128, 144, "orangeButton", 200);
    this.items[1] = new OrangeRay(this.scene, [orangeRays[3], orangeRays[4], orangeRays[5]], 1616, 176);
    this.items[2] = new Elevator(this.scene, 4078, 574, "elevator1", 4148, 560, "orangeButton", 328);
    this.items[3] = new DoorTimer(this.scene, doors[1], 4240, 562, -100);
    this.items[4] = new DoorTimer(this.scene, doors[2], 4240, 306, -100);
    this.items[5] = new Door(this.scene, doors[3], 6512, 466, "orangeButton", 100);
    this.items[6] = new Door(this.scene, doors[4], 7182, 450, "orangeButton", 100);
    this.items[7] = new Elevator(this.scene, 7280, 613, "elevator1", 7342, 560, "orangeButton", 356);
    this.items[8] = new OrangeRayRestore(this.scene, [orangeRays[28], orangeRays[29], orangeRays[30], orangeRays[31]], 7488, 336);
    this.items[9] = new OrangeRay(this.scene, [orangeRays[8], orangeRays[9], orangeRays[10]], 7886, 434);
    this.items[10] = new Elevator(this.scene, 7696, 456, "elevator1", 7600, 338, "orangeButton", 134);
    this.items[11] = new OrangeRay(this.scene, [orangeRays[6], orangeRays[7]], 6864, 208);
    this.items[12] = new Door(this.scene, doors[0], 2830, 464, "orangeButton", -100);
    this.items[13] = new FinishLine(this.scene, 8084, 400);
  }
  //Inicializamos la escena 3 (nivel 2).
  initializeScene3(eSurfaces, doors) {
    this.items = [];
    this.items[0] = new Elevator(this.scene, 1776, 324, "elevator2", 1714, 308, "orangeLever", 518);
    this.items[1] = new Elevator(this.scene, 2896, 518, "elevator2", 2832, 368, "orangeLever", 260);
    this.items[2] = new Elevator(this.scene, 3024, 134, "elevator2", 2960, 112, "orangeLever", 518);
    this.items[3] = new Elevator(this.scene, 5586, 518, "elevator2", 5520, 498, "orangeLever", 390);
    this.items[4] = new Elevator(this.scene, 2370, 198, "elevator2" ,2208, 82, "orangeLever", 104);

    this.items[5] = new FirePlatform(this.scene, 1472, 300);
    this.items[6] = new FirePlatform(this.scene, 3776, 176);
    this.items[7] = new FirePlatform(this.scene, 3968, 176);
    this.items[8] = new FirePlatform(this.scene, 4160, 176);
    this.items[9] = new FirePlatform(this.scene, 4352, 176);

    this.items[10] = new Door(this.scene, doors[0], 1584, 306, "orangeLever", -100);
    this.items[11] = new Door(this.scene, doors[1], 2258, 368, "orangeLever", 100);
    this.items[12] = new Door(this.scene, doors[2], 2190, 498, "orangeLever", -100);
    this.items[13] = new Door(this.scene, doors[3], 6832, 368, "orangeLever", 100);

    this.items[14] = new ElectricSurface(this.scene, eSurfaces[0], 1586, 496);

    this.items[15] = new FinishLine(this.scene, 7084, 464);
  }
  //Función update, que actualiza los elementos de los niveles.
  update(time, delta) {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].update(time, delta);
    }
  }
}