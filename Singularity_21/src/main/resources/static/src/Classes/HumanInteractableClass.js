//Clase HumanInteractableClass, para los elementos con los que puede interactuar el jugador humano.
class HumanInteractableClass {
  constructor(scene, itemBar, existingObj, mainObject, xObb, yObj, sprObj, sclObj, includeActivator = false, xAct = 0, yAct = 0, sprAct = "", sclAct = 0, follow = false, followXoffset = 0, followYoffset = 0) {
    this.scene = scene;
    this.canActivate = true;
    this.itemBar = itemBar;
    if (!existingObj) {
      this.mainObject = scene.matter.add.sprite(xObb, yObj, sprObj, 0);
      this.mainObject.setScale(sclObj);
    } else {
      this.mainObject = mainObject;
    }
    this.isActive = false;
    if (includeActivator) {
      this.activator = scene.add.sprite(xAct, yAct, sprAct, 0);
      this.activator.setScale(sclAct);
      this.activator.setInteractive().on('pointerdown', this.onClick, this);
      this.follow = follow;
      if (this.follow) {
        this.followXoffset = followXoffset;
        this.followYoffset = followYoffset;
      }
    } else {
      if (this.mainObject instanceof Phaser.GameObjects.Sprite || this.mainObject instanceof Phaser.GameObjects.Image) {
        this.mainObject.setInteractive().on('pointerdown', this.onClick, this);
      } else {
        this.mainObject.sprite.setInteractive().on('pointerdown', this.onClick, this);
      }
    }
  }
  //Función onClick, cuando el jugador hace click sobre un elemento.
  onClick(pointer, localX, localY, event) {
    if (this.canActivate && this.itemBar.energy > 10) {
      this.isActive = !this.isActive;
      (this.isActive) ? console.log("activated object") : console.log("desactivated object");
      this.objectActivate();
      this.itemBar.changeBar(this.itemBar.energy - 10);
    }
  }
  //Función objectActivate, que activa el objeto.
  objectActivate(delay = false) {
    (this.isActive) ? this.activator.setFrame(1) : this.activator.setFrame(0);
    if (delay) {
      this.canActivate = false;
    }
  }
  //Función update, que actualiza el objeto.
  update() {
    if (this.follow) {
      this.activator.x = this.mainObject.x + this.followXoffset;
      this.activator.y = this.mainObject.y + this.followYoffset;
      this.activator.setOrigin(this.followXoffset, this.followYoffset);
      this.activator.setAngle(this.mainObject.angle);
    }
  }
}

//Clase GravityPlatform, para instanciar plataformas que se pueden tirar.
class GravityPlatform extends HumanInteractableClass {
  constructor(scene, itemBar, xObb, yObj) {
    super(scene, itemBar, false, null, xObb, yObj, "blue_fp", 1, false);
    this.mainObject.setStatic(true).setSensor(false);
  }
  update() { }
  objectActivate() {
    this.mainObject.setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 250,
      callback: () => (fall(this.scene, this), this.mainObject.clearTint())
    });
    function fall(scene, obj) {
      obj.mainObject.setStatic(false);
      obj.mainObject.setFixedRotation();
      scene.time.addEvent({
        delay: 250,
        callback: () => (obj.mainObject.setSensor(true))
      });
    }
  }
}

//Clase BlueRay, para instanciar rayos azules.
class BlueRay extends HumanInteractableClass {
  constructor(scene, itemBar, mainObj, xAct, yAct) {
    super(scene, itemBar, true, mainObj, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);
    this.ActiveYPos = [];
    for (var i = 0; i < this.mainObject.length; i++) {
      this.ActiveYPos[i] = this.mainObject[i].y;
      this.mainObject[i].y = -999;
    }
  }
  update() { }
  objectActivate() {
    super.objectActivate(true);
    this.activator.setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 750,
      callback: () => (change(this), this.activator.clearTint())
    });
    function change(obj) {
      if (obj.isActive) {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
      } else {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = -999;
        }
      }
      obj.canActivate = true;
    }
  }
}

//Clase BlueRayDouble, para instanciar rayos azules dobles.
class BlueRayDouble extends HumanInteractableClass {
  constructor(scene, itemBar, mainObj, xAct, yAct) {
    super(scene, itemBar, true, mainObj, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);
    this.ActiveYPos = [];
    for (var i = 0; i < this.mainObject.length; i++) {
      this.ActiveYPos[i] = this.mainObject[i].y;
      if (i < 3)
        this.mainObject[i].y = -999;
    }
  }
  update() { }
  objectActivate() {
    super.objectActivate(true);
    this.mainObject[0].setTint(colorActivated);
    this.mainObject[1].setTint(colorActivated);
    this.mainObject[2].setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 750,
      callback: () => (change(this), this.mainObject[0].clearTint(), this.mainObject[1].clearTint(), this.mainObject[2].clearTint())
    });
    function change(obj) {
      if (obj.isActive) {
        for (var i = 0; i < 3; i++) {
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
        for (var i = 3; i < 6; i++) {
          obj.mainObject[i].y = -999;
        }
      } else {
        for (var i = 0; i < 3; i++) {
          obj.mainObject[i].y = -999;
        }
        for (var i = 3; i < 6; i++) {
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
      }
      obj.canActivate = true;
    }
  }
}

//Clase BlueRayTimer, para instanciar rayos azules que desaparecen al cabo de un tiempo.
class BlueRayTimer extends HumanInteractableClass {
  constructor(scene, itemBar, mainObj, xAct, yAct) {
    super(scene, itemBar, true, mainObj, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);
    this.ActiveYPos = [];
    for (var i = 0; i < this.mainObject.length; i++) {
      this.ActiveYPos[i] = this.mainObject[i].y;
      this.mainObject[i].y = -999;
    }
  }
  update() { }
  objectActivate() {
    super.objectActivate(true);
    this.activator.setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 750,
      callback: () => (change(this), this.activator.clearTint())
    });
    this.scene.time.addEvent({
      delay: 2750,
      callback: () => (change2(this))
    });
    function change(obj) {
      if (obj.isActive) {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = obj.ActiveYPos[i];
          obj.isActive = false;
        }
      } else {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = -999;
        }
      }
    }
    function change2(obj) {
      if (obj.isActive) {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = obj.ActiveYPos[i];
        }
      } else {
        for (var i = 0; i < obj.mainObject.length; i++) {
          obj.mainObject[i].y = -999;
        }
      }
      obj.canActivate = true;
      obj.activator.setFrame(0);
    }
  }
}

//Clase Press, para instanciar presas activables.
class PressInteractable extends HumanInteractableClass {
  constructor(scene, itemBar, press) {
    super(scene, itemBar, true, press, 0, 0, "", 1, false);
  }
  update() { }
  objectActivate() {
    this.mainObject.sprite.setTint(colorActivated);
    if (this.mainObject.isReady)
      this.mainObject.startCycle(1, 0);
    else
      this.itemBar.changeBar(this.itemBar.energy + 10);
  }
}

//Clase FirePlatform, para instanciar plataformas que se pueden tirar.
class FirePlatInteractable extends HumanInteractableClass {
  constructor(scene, itemBar, xObb, yObj) {
    super(scene, itemBar, false, null, xObb, yObj, "fire_fp_human", 1, false);
    this.mainObject.setRectangle(64, 21).setStatic(true);
    this.mainObject.setOrigin(0.5, 0.3);
    this.mainObject.anims.play('fire_fp_humanS', true);
    this.initialX = xObb;
  }
  update() {
    this.mainObject.x = this.initialX;
  }
  objectActivate() {
    this.mainObject.setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 250,
      callback: () => (fall(this.scene, this), this.mainObject.clearTint())
    });
    function fall(scene, obj) {
      obj.mainObject.setStatic(false);
      obj.mainObject.setFixedRotation();
      scene.time.addEvent({
        delay: 250,
        callback: () => (obj.mainObject.setSensor(true))
      });
    }
  }
}

//Clase InteractiveBlade, para instanciar sierras mecánicas.
class InteractiveBlade extends HumanInteractableClass {
  constructor(scene, itemBar, blade, xObb, yObj, xAct, yAct, distance) {
    super(scene, itemBar, true, blade, 0, 0, "", 1, true, xAct, yAct, "blueButton", 1, false);

    this.startPosX = xObb;
    this.endPosX = xObb + distance;
    this.objectiveX = this.startPosX;
    this.increaseX = 0;
  }
  objectActivate() {
    super.objectActivate();
    if (!this.isActive) {
      this.increaseX = 0;
    } else {
      this.increaseX = 0.15;
    }
  }
  update(time, delta) {
    super.update();
    if (Math.abs(this.mainObject.x - this.objectiveX) > 4) {
      if (this.mainObject.x < this.objectiveX)
        this.mainObject.x += this.increaseX * delta;
      else if (this.mainObject.x > this.objectiveX)
        this.mainObject.x -= this.increaseX * delta;
    } else {
      if (Math.abs(this.mainObject.x - this.startPosX) < 10)
        this.objectiveX = this.endPosX;
      else if (Math.abs(this.mainObject.x - this.endPosX) < 10)
        this.objectiveX = this.startPosX;
    }
  }
}

//Clase InteractiveBlade2, para instanciar sierras mecánicas gigantes.
class InteractiveBlade2 extends HumanInteractableClass {
  constructor(scene, itemBar, blade, xObb, yObj, xAct, yAct, distance) {
    super(scene, itemBar, true, blade, 0, 0, "", 1, true, xAct, yAct, "blueLever", 1, false);

    this.startPosX = xObb;
    this.endPosX = xObb + distance;
    this.objectiveX = this.startPosX;
    this.increaseX = 0;
  }
  objectActivate() {
    super.objectActivate();
    this.increaseX = 0.1;
  }
  update(time, delta) {
    this.mainObject.x += this.increaseX * delta;
    if (this.mainObject.x > 6900)
      this.mainObject.y = -999;
  }
}

//Igual que InteractiveBlade2 pero moviendonos en el eje Y
class InteractiveBlade3 extends HumanInteractableClass {
  constructor(scene, itemBar, blade, xObb, yObj, xAct, yAct, distance) {
    super(scene, itemBar, true, blade, 0, 0, "", 1, true, xAct, yAct, "blueLever", 1, false);

    this.startPosY = yAct;
    this.endPosY = yObj + distance;
    this.objectiveY = this.startPosY;
    this.increaseY = 0.1;
  }
  objectActivate() {
    super.objectActivate();
    if (this.objectiveY = this.startPosY) {
      this.objectiveY = this.endPosY;
        this.scene.time.addEvent({
          delay: 2500,
          callback: () => (reset(this)),
        });
        function reset(obj) { obj.objectiveY = obj.startPosY; }
    }
  }
  update(time, delta) {
    super.update();
    if (Math.abs(this.mainObject.y - this.objectiveY) > 1) {
      if (this.mainObject.y < this.objectiveY)
        this.mainObject.y += this.increaseY * 2 * delta;
      else if (this.mainObject.y > this.objectiveY)
        this.mainObject.y -= this.increaseY * delta;
    }
    //this.mainObject.y -= this.increaseY * delta;
  }
}

//Clase ESurfHumanInterac, para instanciar superficies eléctricas activables.
class ESurfHumanInterac extends HumanInteractableClass {
  constructor(scene, itemBar, elSurf) {
    super(scene, itemBar, true, elSurf, 0, 0, "", 1, false);
  }
  update() { }
  objectActivate() {
    this.scene.time.addEvent({
      delay: 500,
      callback: () => (this.mainObject.turnOn())
    });
  }
}

//Clase ESurfHumanInteracTimer, para instanciar superficies eléctricas activables.
class ESurfHumanInteracTimer extends HumanInteractableClass {
  constructor(scene, itemBar, elSurf) {
    super(scene, itemBar, true, elSurf, 0, 0, "", 1, false);
  }
  update() { }
  objectActivate() {
    this.mainObject.sprite.setTint(colorActivated);
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => (this.mainObject.turnOn())
    });
    this.scene.time.addEvent({
      delay: 3500,
      callback: () => (this.mainObject.turnOff())
    });
  }
}

//Clase TeslaInteractable, para instanciar teslas activables.
class TeslaInteractable extends HumanInteractableClass {
  constructor(scene, itemBar, tesla) {
    super(scene, itemBar, true, tesla, 0, 0, "", 1, false);
  }
  update() { }
  objectActivate() {
    this.mainObject.sprite.setTint(colorActivated);
    if (this.mainObject.isReady)
      this.mainObject.startCycle(false, 1000, 1000);
    else
      this.itemBar.changeBar(this.itemBar.energy + 10);
  }
}

//Exportamos el array de interactuables.
class HumanInteractablesArray {
  constructor(scene, itemBar) {
    this.items = [];
    this.scene = scene;
    this.itemBar = itemBar;
  }

  //Inicializamos la escena 2 (nivel 1).
  initializeScene2(blueRays, blades, presses) {
    this.items = [];
    this.items[0] = new BlueRay(this.scene, this.itemBar, [blueRays[6], blueRays[7]], 3118, 113);
    this.items[1] = new InteractiveBlade(this.scene, this.itemBar, blades[2], 3902, 576, 3950, 560, -300);
    this.items[2] = new PressInteractable(this.scene, this.itemBar, presses[8]);
    this.items[3] = new PressInteractable(this.scene, this.itemBar, presses[9]);
    this.items[4] = new PressInteractable(this.scene, this.itemBar, presses[10]);
    this.items[5] = new PressInteractable(this.scene, this.itemBar, presses[11]);
    this.items[6] = new PressInteractable(this.scene, this.itemBar, presses[12]);
    this.items[7] = new PressInteractable(this.scene, this.itemBar, presses[13]);

    this.items[8] = new BlueRayDouble(this.scene, this.itemBar, [blueRays[0], blueRays[1], blueRays[2], blueRays[3], blueRays[4], blueRays[5]], 5874, 370);

    this.items[9] = new GravityPlatform(this.scene, this.itemBar, 6972, 286);
    this.items[10] = new GravityPlatform(this.scene, this.itemBar, 6480, 296);
    this.items[11] = new GravityPlatform(this.scene, this.itemBar, 6800, 530);
  }
  //Inicializamos la escena 3 (nivel 2).
  initializeScene3(teslas, eSurfaces, bladesBig) {
    this.items = [];
    this.items[0] = new FirePlatInteractable(this.scene, this.itemBar, 2286, 155);
    this.items[1] = new ESurfHumanInteracTimer(this.scene, this.itemBar, eSurfaces[0]);
    this.items[2] = new InteractiveBlade2(this.scene, this.itemBar, bladesBig, 5712, 464, 5744, 368, 2000);
    this.items[3] = new TeslaInteractable(this.scene, this.itemBar, teslas[2]);
    this.items[4] = new TeslaInteractable(this.scene, this.itemBar, teslas[3]);
    this.items[5] = new TeslaInteractable(this.scene, this.itemBar, teslas[4]);
    this.items[6] = new TeslaInteractable(this.scene, this.itemBar, teslas[5]);
    this.items[7] = new TeslaInteractable(this.scene, this.itemBar, teslas[6]);
    this.items[8] = new FirePlatInteractable(this.scene, this.itemBar, 6688, 460);
  }
  //Inicializamos la escena 4 (nivel 3).
  initializeScene4(teslas, esurfTimer, bladesBig, presses, blueRaysTimer) {
    this.items = [];
    this.items[0] = new ESurfHumanInteracTimer(this.scene, this.itemBar, esurfTimer[0]);
    this.items[1] = new InteractiveBlade3(this.scene, this.itemBar, bladesBig, 2128, 336, 2094, 336, -3000);
    this.items[2] = new TeslaInteractable(this.scene, this.itemBar, teslas[0]);
    this.items[3] = new PressInteractable(this.scene, this.itemBar, presses[0]);
    this.items[4] = new PressInteractable(this.scene, this.itemBar, presses[1]);
    this.items[5] = new BlueRayTimer(this.scene, this.itemBar, [blueRaysTimer[0], blueRaysTimer[1],blueRaysTimer[2]], 2513, 370); //posicion por actualizar
  }
  //Función update, que actualiza los elementos de los niveles.
  update(time, delta) {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].update(time, delta);
    }
  }
}
