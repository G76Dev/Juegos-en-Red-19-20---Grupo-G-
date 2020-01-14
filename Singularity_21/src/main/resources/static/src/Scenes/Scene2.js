//Zona de declaración de variables.
//Variables de la camara.
var cam;
var firstFollow;

//Items y elementos interactuables.
var usableItems;
var humanInteractableItems;
var androidInteractableItems;

//Mouse.
//var mouse;

//Trackers para la barra de progreso.
var p1Tracker;
var p2Tracker;

//Variable fadeOut, que controla el fin del nivel.
var fadeOut;

//Variable presses, para las presas hidráulicas.
const presses = [];

//Clase Scene2, que extiende de Phaser.Scene.
class Scene2 extends Phaser.Scene {
  constructor(key = "level1") {
    super(key);
  }
  //Función create, que crea los elementos del propio juego.
  create() {
    this.shouldBeActive = true;
    fadeOut = false;
    //Música.
    this.game.currentMusic.stop();
    this.game.currentMusic = this.sound.add('theme', { loop: true, volume: this.game.musicVolume });
    this.game.currentMusic.play();

    //Variables para los elementos interactuables.
    const blueRays = [];
    const orangeRays = [];
    const conveyers = [];
    const doors = [];
    const blades = [];
    const extraLifes = [];
    const monitors = [];

    //Backgrounds.
    this.add.image(0, 0, 'bg_i').setScale(30).setScrollFactor(0).setDepth(-503);
    this.add.image(1300, 550, 'bg1_i').setScale(0.9).setScrollFactor(0.25).setDepth(-502);
    this.add.image(1100, 450, 'bg2_i').setScale(1).setScrollFactor(0.5).setDepth(-501);
    this.add.image(1200, 650, 'bg3_i').setScale(1.2).setScrollFactor(0.75).setDepth(-500);

    //Inicializacion y creacion de mapa de tiles.
    const map1 = this.make.tilemap({ key: "map1" });
    const tileset1 = map1.addTilesetImage("Tileset Industrial x32", "tiles1");

    //Capas de tiles.
    const layerminus2 = map1.createStaticLayer("background_layer_-2depth", tileset1, 0, 0);
    layerminus2.depth = -20;
    const layerminus1 = map1.createStaticLayer("deco_layer_-1depth", tileset1, 0, 0);
    layerminus1.depth = -10;
    const baselayer = map1.createStaticLayer("base_layer_0depth", tileset1, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map1.createStaticLayer("lethal_layer_0depth", tileset1, 0, 0);
    lethallayer.depth = -5;

    //Colisiones de las capas.
    layerminus1.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(layerminus1);
    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);
    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    //Generamos las teclas y las añadimos a cada jugador androide, creándolos.
    var cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S });
    this.game.android1 = new Android(this, '1', 8000, 400, cursors);
    cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.DOWN });
    this.game.android2 = new Android(this, '2', 400, 300, cursors);
    this.game.android1.coLink(this.game.android2);
    this.game.android2.coLink(this.game.android1);
    //Iniciamos las vidas a 10.
    this.game.lives = 10;

    //Elementos interactuables
    //Presas hidráulicas
    //Automáticas
    presses[0] = new Press(this, 4464, 148, "pressNI");
    presses[0].startCycle(-1, 0);
    presses[1] = new Press(this, 4534, 146, "pressNI");
    presses[1].startCycle(-1, 1800);
    presses[2] = new Press(this, 4604, 146, "pressNI");
    presses[2].startCycle(-1, 0);
    presses[3] = new Press(this, 4674, 146, "pressNI");
    presses[3].startCycle(-1, 1800);
    presses[4] = new Press(this, 4864, 403, "pressNI");
    presses[4].startCycle(-1, 0);
    presses[5] = new Press(this, 4934, 403, "pressNI");
    presses[5].startCycle(-1, 1800);
    presses[6] = new Press(this, 5004, 403, "pressNI");
    presses[6].startCycle(-1, 0);
    presses[7] = new Press(this, 5074, 403, "pressNI");
    presses[7].startCycle(-1, 1800);

    //Interactuables
    presses[8] = new Press(this, 4464, 403, "pressI");
    presses[8].startCycle(1, 0);
    presses[9] = new Press(this, 4564, 403, "pressI");
    presses[9].startCycle(1, 0);
    presses[10] = new Press(this, 4664, 403, "pressI");
    presses[10].startCycle(1, 0);

    presses[11] = new Press(this, 4864, 146, "pressI");
    presses[11].startCycle(1, 0);
    presses[12] = new Press(this, 4964, 146, "pressI");
    presses[12].startCycle(1, 0);
    presses[13] = new Press(this, 5064, 146, "pressI");
    presses[13].startCycle(1, 0);

    //Colisiones con los jugadores androides.
    this.matterCollision.addOnCollideStart({
      objectA: this.game.android1.mainBody,
      callback: lethalCollide,
      context: this.game.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: this.game.android2.mainBody,
      callback: lethalCollide,
      context: this.game.android2
    });

    //Función lethalCollide, que comprueba si la colisión con los pinchos ha sido letal.
    function lethalCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
      const tile = gameObjectB;
      if (tile.properties.lethal) {
        this.damaged(new Phaser.Math.Vector2(this.sprite.x - gameObjectB.x, -(this.sprite.y - gameObjectB.y)), 60);
      }
    }

    //Monitores
    monitors[0] = new Monitor(this, 720, 552, "Press w/up arrow to\njump!");
    monitors[1] = new Monitor(this, 1232, 232, "Watch out for spikes\nand menacing objects!");
    monitors[2] = new Monitor(this, 1936, 232, "Try pressing s/down\nkey while your partner\nis in mid air!");
    monitors[3] = new Monitor(this, 2000, 392, "Pressing s/down key\nyou can also operate\nORANGE buttons\nand levers.");
    monitors[4] = new Monitor(this, 2096, 136, "Coordinate with your\npartner to progress\nthrough the levels!");
    monitors[5] = new Monitor(this, 2448, 136, "Orange floating\ncapsules give you\nextra lifes, but\nare difficult to get.");
    monitors[6] = new Monitor(this, 2704, 136, "The human can activate\nblue objects like\ndoors and rays.");
    monitors[7] = new Monitor(this, 3952, 296, "Some objects can only be\nactivated for a short\ntime.");

    //Rayos
    //Naranjas
    //Verticales
    orangeRays[0] = this.matter.add.sprite(80, 304, "orangeRay", 0);
    orangeRays[1] = this.matter.add.sprite(80, 336, "orangeRay", 0);
    orangeRays[2] = this.matter.add.sprite(80, 368, "orangeRay", 0);

    orangeRays[3] = this.matter.add.sprite(1648, 112, "orangeRay", 0);
    orangeRays[4] = this.matter.add.sprite(1648, 144, "orangeRay", 0);
    orangeRays[5] = this.matter.add.sprite(1648, 176, "orangeRay", 0);

    orangeRays[6] = this.matter.add.sprite(6864, 272, "orangeRay", 0);
    orangeRays[7] = this.matter.add.sprite(6864, 304, "orangeRay", 0);

    orangeRays[8] = this.matter.add.sprite(7792, 368, "orangeRay", 0);
    orangeRays[9] = this.matter.add.sprite(7792, 400, "orangeRay", 0);
    orangeRays[10] = this.matter.add.sprite(7792, 432, "orangeRay", 0);

    //Horizontales
    orangeRays[11] = this.matter.add.sprite(6448, 336, "orangeRay", 0);
    orangeRays[12] = this.matter.add.sprite(6480, 336, "orangeRay", 0);
    orangeRays[13] = this.matter.add.sprite(6512, 336, "orangeRay", 0);
    orangeRays[14] = this.matter.add.sprite(6544, 336, "orangeRay", 0);
    orangeRays[15] = this.matter.add.sprite(6576, 336, "orangeRay", 0);
    orangeRays[16] = this.matter.add.sprite(6608, 336, "orangeRay", 0);
    orangeRays[17] = this.matter.add.sprite(6640, 336, "orangeRay", 0);
    orangeRays[18] = this.matter.add.sprite(6672, 336, "orangeRay", 0);
    orangeRays[19] = this.matter.add.sprite(6704, 336, "orangeRay", 0);
    orangeRays[20] = this.matter.add.sprite(6736, 336, "orangeRay", 0);
    orangeRays[21] = this.matter.add.sprite(6768, 336, "orangeRay", 0);
    orangeRays[22] = this.matter.add.sprite(6800, 336, "orangeRay", 0);
    orangeRays[23] = this.matter.add.sprite(6832, 336, "orangeRay", 0);

    orangeRays[24] = this.matter.add.sprite(6928, 336, "orangeRay", 0);
    orangeRays[25] = this.matter.add.sprite(6960, 336, "orangeRay", 0);
    orangeRays[26] = this.matter.add.sprite(6992, 336, "orangeRay", 0);
    orangeRays[27] = this.matter.add.sprite(7024, 336, "orangeRay", 0);

    orangeRays[28] = this.matter.add.sprite(7824, 240, "orangeRay", 0);
    orangeRays[29] = this.matter.add.sprite(7856, 240, "orangeRay", 0);
    orangeRays[30] = this.matter.add.sprite(7888, 240, "orangeRay", 0);
    orangeRays[31] = this.matter.add.sprite(7920, 240, "orangeRay", 0);

    //Azules
    //Verticales
    blueRays[0] = this.matter.add.sprite(6000, 272, "blueRay", 0);
    blueRays[1] = this.matter.add.sprite(6000, 304, "blueRay", 0);
    blueRays[2] = this.matter.add.sprite(6000, 336, "blueRay", 0);

    blueRays[3] = this.matter.add.sprite(6000, 432, "blueRay", 0);
    blueRays[4] = this.matter.add.sprite(6000, 464, "blueRay", 0);
    blueRays[5] = this.matter.add.sprite(6000, 496, "blueRay", 0);

    blueRays[6] = this.matter.add.sprite(3054, 144, "blueRay", 0);
    blueRays[7] = this.matter.add.sprite(3086, 144, "blueRay", 0);

    //Colisiones con los jugadores androides.
    for (var i = 0; i < orangeRays.length; i++) {
      //Cambiamos el collider.
      orangeRays[i].setRectangle(16, 32);
      if (i >= 11)
        orangeRays[i].setAngle(90);
      orangeRays[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android1.mainBody,
        objectB: orangeRays[i],
        callback: inflictDamage,


        context: this.game.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android2.mainBody,
        objectB: orangeRays[i],
        callback: inflictDamage,
        context: this.game.android2
      });
    }

    //Colisiones con los jugadores androides.
    for (var i = 0; i < blueRays.length; i++) {
      //Cambiamos el collider.
      blueRays[i].setRectangle(16, 32);
      if (i >= 6)
        blueRays[i].setAngle(90);
      blueRays[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android1.mainBody,
        objectB: blueRays[i],
        callback: inflictDamage,
        context: this.game.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android2.mainBody,
        objectB: blueRays[i],
        callback: inflictDamage,
        context: this.game.android2
      });
    }

    //Puertas
    doors[0] = this.matter.add.sprite(2800, 432, "orangeDoor1", 0);
    doors[1] = this.matter.add.sprite(4272, 272, "orangeDoor1", 0);
    doors[2] = this.matter.add.sprite(4272, 528, "orangeDoor1", 0);
    doors[3] = this.matter.add.sprite(6512, 560, "orangeDoor1", 0);
    doors[4] = this.matter.add.sprite(7216, 560, "orangeDoor1", 0);
    doors[5] = this.matter.add.sprite(8200, 400, "orangeDoor1", 0);

    //Cambiamos el collider de las puertas y las ponemos estáticas.
    for (var i = 0; i < doors.length; i++) {
      doors[i].setRectangle(8, 96);
      doors[i].setStatic(true);
    }

    //Sierras giratorias
    blades[0] = this.matter.add.sprite(2080, 416, "rBlade", 0);
    blades[1] = this.matter.add.sprite(3296, 288, "rBlade", 0);
    blades[2] = this.matter.add.sprite(3902, 576, "rBlade", 0);
    blades[3] = this.matter.add.sprite(6336, 608, "rBlade", 0);
    blades[4] = this.matter.add.sprite(6736, 592, "rBlade", 0);
    blades[5] = this.matter.add.sprite(6864, 592, "rBlade", 0);

    //Colisiones con los jugadores androides.
    for (var i = 0; i < blades.length; i++) {
      //Cambiamos el collider y las ponemos estáticas y sensores.
      blades[i].setCircle(28)
      blades[i].setStatic(true).setSensor(true);
      blades[i].setDepth(-15);

      this.matterCollision.addOnCollideStart({
        objectA: this.game.android1.mainBody,
        objectB: blades[i],
        callback: inflictDamage,
        context: this.game.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android2.mainBody,
        objectB: blades[i],
        callback: inflictDamage,
        context: this.game.android2
      });
    }

    //Cintas mecánicas
    conveyers[0] = new Conveyer(this, 4767, 310, "conveyer_1",'conveyer1S', 928, 2);
    conveyers[1] = new Conveyer(this, 4767, 566, "conveyer_1",'conveyer1S', 928, -2);
    conveyers[2] = new Conveyer(this, 6800, 600, "conveyer_3",'conveyer3S', 400, 2);

    //Vidas Extras
    extraLifes[0] = this.matter.add.sprite(2640, 412, "life", 0);
    extraLifes[1] = this.matter.add.sprite(3664, 272, "life", 0);
    extraLifes[2] = this.matter.add.sprite(6560, 582, "life", 0);

    //Colisiones con los jugadores androide.
    for (var i = 0; i < extraLifes.length; i++) {
      //Las ponemos estáticas y sensores.
      extraLifes[i].setStatic(true).setSensor(true);

      this.matterCollision.addOnCollideStart({
        objectA: this.game.android1.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.game.android2.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
    }

    //Función addLife, que añade una vida a los jugadores androide.
    function addLife({ gameObjectB }) {
      this.game.lives++;
      this.lifesText.setText("" + this.game.lives);
      gameObjectB.destroy();
    }

    //Función inflictDamage, que hiere a los androides.
    function inflictDamage({ bodyA, bodyB, pair }) { this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x - bodyB.gameObject.x, bodyA.gameObject.y - bodyB.gameObject.y), 90); }

    //Objetos animados
    for (var i = 0; i < orangeRays.length; i++) {
      orangeRays[i].anims.play('orangeRayS', true);
    }

    for (var i = 0; i < blueRays.length; i++) {
      blueRays[i].anims.play('blueRayS', true);
    }
    for (var i = 0; i < blades.length; i++) {
      blades[i].anims.play('rotatingBlade', true);
    }

    for (var i = 0; i < extraLifes.length; i++) {
      extraLifes[i].anims.play('lifeS', true);
    }

    //Interfaz.
    //Mostramos las vidas por pantalla.
    this.lifesUI = this.add.image(66, 56,'lifesUI');
    this.lifesUI.setScrollFactor(0).setDepth(100);
    this.lifesText = this.add.text(72, 38, "" + this.game.lives, { fontSize: '32px', fill: '#FFFFFF', fontFamily: 'Consolas' });
    this.lifesText.setScrollFactor(0).setDepth(100).setStroke('#FF9E37', 4);

    //Instancia de barra de objetos.
    usableItems = new ItemBar(this, 916, 61, 210);

    //Interactuables.
    humanInteractableItems = new HumanInteractablesArray(this, usableItems);
    humanInteractableItems.initializeScene2( blueRays, blades, presses, doors);
    androidInteractableItems = new AndroidInteractablesArray(this);
    androidInteractableItems.initializeScene2( orangeRays, doors);

    //Camara.
    cam = this.cameras.main;
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, 0, 8290, 10000);
    firstFollow = this.add.container(0, 0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);

    //Barra de progreso.
    const progressBar = this.add.image(480, 12, 'progression_bar'); //8160
    progressBar.setScrollFactor(0);
    p1Tracker = this.add.image(0, 25, 'deathHead1');
    p1Tracker.setScrollFactor(0).setScale(0.65);
    p2Tracker = this.add.image(0, 25, 'deathHead2');
    p2Tracker.setScrollFactor(0).setScale(0.65);
  }

  //Pointer del ratón.
  //mouse = this.input.activePointer;

  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //Si las vidas son igual o menores que 0, se acaba la partida.
    if(this.game.lives <= 0 && this.shouldBeActive){
      this.shouldBeActive = false;
      this.cameras.main.fadeOut(1000);
      this.time.addEvent({
        delay: 1000,
        callback: () => (LoadScene(this, 'defeat'))
      });
      //Función LoadScene, que carga una escena.
      function LoadScene(scene, nombreEscena){scene.scene.start(nombreEscena);}
    }
    firstFollow.x = Math.max(this.game.android1.sprite.x, this.game.android2.sprite.x);
    firstFollow.y = Math.max(Math.min((this.game.android1.sprite.y + this.game.android2.sprite.y) / 2, 360), -500);

    //Interactuables.
    usableItems.update(time, delta);
    androidInteractableItems.update(time, delta);
    humanInteractableItems.update(time, delta);

    //Update de las presas hidráulicas.
    for (var i = 0; i < presses.length; i++) {
      presses[i].update();
    }

    //Si ambos llegan al final del nivel, hacemos transición al siguiente.
    if(this.game.android1.arrived && this.game.android2.arrived && !fadeOut) {
      fadeOut = true;
      cam.fadeOut(2000);
      this.time.addEvent({
        delay: 2000,
        callback: () => (advanceToScene2(this))
      });
    }
    function advanceToScene2(scene){
      scene.scene.start('level2');
    }

    //Trackers de la barra de progreso.
    p1Tracker.x = this.game.android1.sprite.x / 17;
    p2Tracker.x = this.game.android2.sprite.x / 17;

    //document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
