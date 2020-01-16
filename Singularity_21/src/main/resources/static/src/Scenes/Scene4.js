//Zona de declaración de variables
//Variables de la camara.
var cam;
var firstFollow;

//Items y elementos interactuables.
var usableItems;
var humanInteractableItems;
var androidInteractableItems;

//Mouse.
var mouse;

//Barra de progreso.
var progressBar;

//Variable fadeOut, que controla el fin del nivel.
var fadeOut;

var presses2 = [];

const movingP2 = [];

var trigger1 = false;
var trigger2 = false;
var trigerCodeOnce = true;

//Clase Scene4, que extiende de Phaser.Scene.
class Scene4 extends Phaser.Scene {
  constructor(key = "level3") {
    super(key);
  }
  //Función create, que crea los elementos del propio juego.
  create() {
    this.shouldBeActive = true;
    fadeOut = false;
    //Música.
    game.currentMusic.stop();
    game.currentMusic = this.sound.add('theme2', { loop: true, volume: game.musicVolume });
    game.currentMusic.play();

    //Variables para los elementos interactuables.
    const doors = [];
    const extraLifes = [];
    const teslas = [];
    const esurfTimer = [];
    const conveyers = [];
    const orangeRays = [];
    const blueRaysTimer = [];



    //Backgrounds.
    this.add.image(480, 170, 'bg_f').setScrollFactor(0).setDepth(-504);
    this.add.image(1300, 280, 'bg1_f').setScale(2).setScrollFactor(0.2).setDepth(-503);
    this.add.image(1100, 480, 'bg21_f').setScale(2).setScrollFactor(0.3).setDepth(-502);
    this.add.image(1100, 470, 'bg2_f').setScale(2).setScrollFactor(0.5).setDepth(-501);
    this.add.image(1200, 590, 'bg3_f').setScale(2).setScrollFactor(0.75).setDepth(-500);

    //Inicializacion y creacion de mapa de tiles.
    const map3 = this.make.tilemap({ key: "map3" });
    const tileset3 = map3.addTilesetImage("final_boss_tileset", "tiles3",32,32);

    //Capas de tiles.
    const layerminus1 = map3.createStaticLayer("back_layer", tileset3, 0, 0);
    layerminus1.depth = -20;
    const baselayer = map3.createStaticLayer("base_layer", tileset3, 0, 0);
    baselayer.depth = -5;
    const auxlayer = map3.createStaticLayer("aux_layer", tileset3, 0, 0);
    auxlayer.depth = -3;
    const lethallayer = map3.createStaticLayer("lethal_layer", tileset3, 0, 0);
    lethallayer.depth = -5;

    //Colisiones de las capas.
    layerminus1.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(layerminus1);

    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);

    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    auxlayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(auxlayer);

    //Generamos las teclas y las añadimos a cada jugador androide, creándolos.
    var cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S });
    game.android1 = new Android(this, '1', 68, 230, cursors);
    cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.DOWN });
    game.android2 = new Android(this, '2', 132, 230, cursors);
    game.android1.coLink(game.android2);
    game.android2.coLink(game.android1);

    game.human = new Human(this, 2782, 80);
    game.human.sprite.anims.play('humanS', true);

    //Colisiones con los jugadores androides.
    this.matterCollision.addOnCollideStart({
      objectA: game.android1.mainBody,
      callback: lethalCollide,
      context: game.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: game.android2.mainBody,
      callback: lethalCollide,
      context: game.android2
    });

    //Función lethalCollide, que comprueba si la colisión con los pinchos ha sido letal.
    function lethalCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
      const tile = gameObjectB;
      if (tile.properties.lethal) {
        this.damaged(new Phaser.Math.Vector2(0, -(this.sprite.y - gameObjectB.y)), 60);
      }
    }

    trigger1 = false;
    trigger2 = false;
    trigerCodeOnce = true;

    //Elementos interactuables.
    //Sierra mecánica Grande.
    const bladesBig = this.matter.add.sprite(2128, 335, "rBigBlade", 0);
    //Cambiamos su collider y la hacemos estática y sensor.
    bladesBig.setCircle(60).setScale(0.6);
    bladesBig.setStatic(true).setSensor(true);
    //Reproducimos su animación.
    bladesBig.anims.play('rotatingBigBlade', true);

    //Colisiones con los jugadores androides.
    this.matterCollision.addOnCollideStart({
      objectA: game.android1.mainBody,
      objectB: bladesBig,
      callback: inflictDamage,
      context: game.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: game.android2.mainBody,
      objectB: bladesBig,
      callback: inflictDamage,
      context: game.android2
    });

    //Sierra mecánica pequeña.
    bladeDoorCheck = false;
    const blade = this.matter.add.sprite(2430, 102, "rBlade", 0);
    //Cambiamos su collider y la hacemos estática y sensor.
    blade.setCircle(30).setScale(1).setDepth(-6);
    blade.setStatic(true).setSensor(true);
    //Reproducimos su animación.
    blade.anims.play('rotatingBlade', true);

    //Colisiones con los jugadores androides.
    this.matterCollision.addOnCollideStart({
      objectA: game.android1.mainBody,
      objectB: blade,
      callback: inflictDamage,
      context: game.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: game.android2.mainBody,
      objectB: blade,
      callback: inflictDamage,
      context: game.android2
    });

    //Colision con el humano.
    this.matterCollision.addOnCollideStart({
      objectA: game.human.sprite,
      objectB: blade,
      callback: humanDeath,
      context: game.human
    });

    //Plataforma que se mueve
    movingP2[0] = new MovingPlatform(this, 2224, 322, 2383, 'moving_platform', 'moving_platformS');

    //Teslas
    teslas[0] = new Tesla(this, 2017, 96, 'teslaHumanOFF', 'teslaHumanS');

    //Superificie electrica
    esurfTimer[0] = new ElectricSurface(this, 2302, 417,"eSurf4", false, 'eSurf4_anim', 'eSurf4S') //posicion por actualizar
    //eSurfaces[1] = new ElectricSurface(this, 2302, 417,"eSurf4", false, 'eSurf4_anim', 'eSurf4S') //posicion por actualizar


    //Puertas
     doors[0] = this.matter.add.sprite(1904, 464, "orangeDoor1", 0); //x 1902 y 462
     doors[1] = this.matter.add.sprite(2480, 162, "orangeDoor1", 0);
     doors[2] = this.matter.add.sprite(2738, 80, "orangeDoor1", 0);

    //Cinta mecanica
    conveyers[0] = new Conveyer(this, 2544, 602, "conveyer_4",'conveyer4S', 352, -2);
    conveyers[0].sprite.setRectangle(332, 10).setStatic(true).setFixedRotation(true);

    //presas hidraulicas
    presses2[0] = new Press(this, 2540, 440, "pressI");
    presses2[0].startCycle(1, 0);
    presses2[1] = new Press(this, 2650, 440, "pressI");
    presses2[1].startCycle(1, 0);

    //Puerta de rayos azul
    blueRaysTimer[0] = this.matter.add.sprite(2414, 463, "blueRay", 0);
    blueRaysTimer[1] = this.matter.add.sprite(2446, 463, "blueRay", 0);
    blueRaysTimer[2] = this.matter.add.sprite(2478, 463, "blueRay", 0);

    //Colisiones con los jugadores androides.
    for (var i = 0; i < blueRaysTimer.length; i++) {
      //Cambiamos el collider.
      blueRaysTimer[i].setRectangle(16, 32);
      blueRaysTimer[i].setAngle(90);
      blueRaysTimer[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: game.android1.mainBody,
        objectB: blueRaysTimer[i],
        callback: inflictDamage,
        context: game.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: game.android2.mainBody,
        objectB: blueRaysTimer[i],
        callback: inflictDamage,
        context: game.android2
      });
    }

    for (var i = 0; i < blueRaysTimer.length; i++) {
      blueRaysTimer[i].anims.play('blueRayS', true);
    }

    for (var i = 0; i < doors.length; i++) {
      //Cambiamos su collider y las hacemos estáticas.
      doors[i].setRectangle(8, 96);
      doors[i].setStatic(true);
    }
    doors[1].setAngle(90);

    //Vidas Extras
    extraLifes[0] = this.matter.add.sprite(1400, 237, "life", 0);

    //Colisiones con los jugadores androides.
    for (var i = 0; i < extraLifes.length; i++) {
      //Las hacemos estáticas y sensores.
      extraLifes[i].setStatic(true).setSensor(true);

      this.matterCollision.addOnCollideStart({
        objectA: game.android1.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
      this.matterCollision.addOnCollideStart({
        objectA: game.android2.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
    }

    //Función addLife, que añade una vida a los jugadores androide.
    function addLife({ gameObjectB }) {
      game.lives++;
      this.lifesText.setText("" + game.lives);
      gameObjectB.destroy();
    }

    //Función inflictDamage, que hiere a los androides.
    function inflictDamage({ bodyA, bodyB, pair }) { this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x - bodyB.gameObject.x, bodyA.gameObject.y - bodyB.gameObject.y), 90); }

    //Función humanDeath, que mata al humano.
    function humanDeath({ bodyA, bodyB, pair }) { this.death(); }

    //Elementos animados.
    for (var i = 0; i < extraLifes.length; i++) {
      extraLifes[i].anims.play('lifeS', true);
    }

    //Interfaz.
    //Mostramos las vidas por pantalla.
    this.lifesUI = this.add.image(66, 56,'lifesUI');
    this.lifesUI.setScrollFactor(0).setDepth(100);
    this.lifesText = this.add.text(72, 38, "" + game.lives, { fontSize: '32px', fill: '#FFFFFF', fontFamily: 'Consolas' });
    this.lifesText.setScrollFactor(0).setDepth(100).setStroke('#FF9E37', 4);

    //Instancia de barra de objetos.
    usableItems = new ItemBar(this, 916, 61, 210);

    //Interactuables.
    humanInteractableItems = new HumanInteractablesArray(this, usableItems);
    humanInteractableItems.initializeScene4(teslas, esurfTimer, bladesBig, presses2, blueRaysTimer);
    androidInteractableItems = new AndroidInteractablesArray(this);
    androidInteractableItems.initializeScene4(doors, blade);

    //Camara.
    cam = this.cameras.main;
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, 0, 7292, 10000);
    firstFollow = this.add.container(0, 0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);

    //Barra de progreso.
    progressBar = this.add.image(480, 12, 'progression_bar_fb');//7200
    progressBar.setScrollFactor(0);

    //Pointer del ratón.
    mouse = this.input.activePointer;
  }

  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //Si las vidas son igual o menores que 0, se acaba la partida.
    if(game.lives <= 0 && this.shouldBeActive){
      this.shouldBeActive = false;
      this.cameras.main.fadeOut(1000);
      this.time.addEvent({
        delay: 1000,
        callback: () => (LoadScene(this, 'defeat'))
      });
      //Función LoadScene, que carga una escena.
      function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
    }

    if (game.android1.sprite.x > 2020) {
      trigger1 = true;
    }
    if (game.android2.sprite.x > 2020) {
      trigger2 = true;
    }
    if (trigger1 && trigger2) {
      firstFollow.x = 2440;
      firstFollow.y = 320;
      if(trigerCodeOnce){
        trigerCodeOnce = false;
        cam.setZoom(0.9);
        usableItems.bar.x += 50;
        usableItems.item_bar.x += 50;
        for(var i=0; i<usableItems.items.length; i++){
          usableItems.items[i].x += 50;
        }
        progressBar.y -= 30;
        this.lifesUI.x += 275;
        this.lifesText.x += 275;
      }
    } else {
      firstFollow.x = Math.max(game.android1.sprite.x, game.android2.sprite.x);
      firstFollow.y = Math.max(Math.min((game.android1.sprite.y + game.android2.sprite.y) / 2, 360), -500);
    }

    //Si el humano muere, girarlo
    if (game.human.dead) {
      game.human.deadSprite.setAngle(game.human.deadSprite.angle + 1);
      game.human.deadSprite.setVelocityY(game.human.deadSprite.body.velocity.y -0.14);
    }

    //Interactuables.
    usableItems.update(time, delta);
    androidInteractableItems.update(time, delta);
    humanInteractableItems.update(time, delta);

    //update presas hidraulicas
    for (var i = 0; i < presses2.length; i++) {
      presses2[i].update();
    }


    //Update de las plataformas móviles.
    for (var i = 0; i < movingP2.length; i++) {
      movingP2[i].update(time,delta);
    }

    //Si el humano muere, borrar la interfaz
    if (!game.human.canDie) {
      game.human.canDie = true;
      this.lifesUI.destroy();
      this.lifesText.destroy();
      progressBar.destroy();
      usableItems.item_bar.setVisible(false);
      for(var i = 0; i < usableItems.items.length; i++) {
        usableItems.items[i].setVisible(false);
      }
      usableItems.bar.setVisible(false);
    }

    //Si consiguen acabar con el jugador humano, hacemos transición a la pantalla de victoria.
    if(game.android1.arrived && game.android2.arrived && !fadeOut) {
      fadeOut = true;
      cam.fadeOut(2000);
      this.time.addEvent({
        delay: 2000,
        callback: () => (advanceToVictory(this))
      });
    }
    function advanceToVictory(scene){
      scene.scene.start('victory');
    }

    //document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
