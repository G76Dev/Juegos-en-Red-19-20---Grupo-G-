//Zona de declaración de variables
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

const movingP = [];

//Clase Scene3, que extiende de Phaser.Scene.
class Scene3 extends Phaser.Scene {
  constructor(key = "level2") {
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
    const eSurfaces = [];

    //Backgrounds.
    this.add.image(480, 270, 'bg_e').setScrollFactor(0).setDepth(-503);
    this.add.image(1300, 350, 'bg1_e').setScale(2).setScrollFactor(0.25).setDepth(-502);
    this.add.image(1100, 320, 'bg2_e').setScale(2).setScrollFactor(0.5).setDepth(-501);
    this.add.image(1200, 400, 'bg3_e').setScale(2).setScrollFactor(0.75).setDepth(-500);

    //Sonido
    var bonusSound = this.sound.add('bonus', {volume: game.soundVolume});

    //Inicializacion y creacion de mapa de tiles.
    const map2 = this.make.tilemap({ key: "map2" });
    const tileset2 = map2.addTilesetImage("electrical_tileset", "tiles2");

    //Capas de tiles.
    const layerminus2 = map2.createStaticLayer("background_layer_-2depth", tileset2, 0, 0);
    layerminus2.depth = -20;
    const layerminus1 = map2.createStaticLayer("deco_layer_-1depth", tileset2, 0, 0);
    layerminus1.depth = -10;
    const baselayer = map2.createStaticLayer("base_layer_0depth", tileset2, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map2.createStaticLayer("lethal_layer_0depth", tileset2, 0, 0);
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
    game.android1 = new Android(this, '1', 70, 440, cursors);
    cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.DOWN });
    game.android2 = new Android(this, '2', 120, 440, cursors);
    game.android1.coLink(game.android2);
    game.android2.coLink(game.android1);

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

    //Elementos interactuables.
    //Sierra mecánica.
    const bladesBig = this.matter.add.sprite(5712, 464, "rBigBlade", 0);
    //Cambiamos su collider y la hacemos estática y sensor.
    bladesBig.setCircle(60)
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

    //Plataforma que se mueve
    movingP[0] = new MovingPlatform(this, 4992, 338, 5394, 'moving_platform', 'moving_platformS');
    movingP[1] = new MovingPlatform(this, 4912, 526, 5454, 'moving_platform', 'moving_platformS');

    //Teslas
    //Automáticas
    teslas[0] = new Tesla(this, 1936, 480, 'teslaAutoOFF', 'teslaAutoS');
    teslas[0].startCycle(true, 2100, 2100);
    teslas[1] = new Tesla(this, 3632, 320, 'teslaAutoOFF', 'teslaAutoS');
    teslas[1].startCycle(true, 1500, 1500);

    //Activables por el humano
    teslas[2] = new Tesla(this, 5392, 512, 'teslaHumanOFF', 'teslaHumanS');
    teslas[3] = new Tesla(this, 4240, 128, 'teslaHumanOFF', 'teslaHumanS');
    teslas[4] = new Tesla(this, 4976, 512, 'teslaHumanOFF', 'teslaHumanS');
    teslas[5] = new Tesla(this, 5200, 512, 'teslaHumanOFF', 'teslaHumanS');
    teslas[6] = new Tesla(this, 6864, 352, 'teslaHumanOFF', 'teslaHumanS');

    eSurfaces[0] = new ElectricSurface(this, 1280, 576,"eSurf1", true, 'eSurf1_anim', 'eSurf1S');
    eSurfaces[1] = new ElectricSurface(this, 2544, 544,"eSurf2", false, 'eSurf2_anim', 'eSurf2S');
    eSurfaces[2] = new ElectricSurface(this, 4064, 384,"eSurf3", true, 'eSurf3_anim', 'eSurf3S');

    //Puertas
    doors[0] = this.matter.add.sprite(1830, 464, "orangeDoor2", 0);
    doors[1] = this.matter.add.sprite(2258, 464, "orangeDoor2", 0);
    doors[2] = this.matter.add.sprite(2192, 342, "orangeDoor2", 0);
    doors[3] = this.matter.add.sprite(6832, 464, "orangeDoor2", 0);
    doors[4] = this.matter.add.sprite(16, 432, "orangeDoor2", 0);
    doors[4] = this.matter.add.sprite(7200, 464, "orangeDoor2", 0);

    for (var i = 0; i < doors.length; i++) {
      //Cambiamos su collider y las hacemos estáticas.
      doors[i].setRectangle(8, 96);
      doors[i].setStatic(true);
    }

    //Vidas Extras
    extraLifes[0] = this.matter.add.sprite(1264, 432, "life", 0);
    extraLifes[1] = this.matter.add.sprite(2128, 208, "life", 0);
    extraLifes[2] = this.matter.add.sprite(5488, 304, "life", 0);
    extraLifes[3] = this.matter.add.sprite(6584, 408, "life", 0);


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
      bonusSound.play();
      this.lifesText.setText("" + game.lives);
      gameObjectB.destroy();
    }

    //Función inflictDamage, que hiere a los androides.
    function inflictDamage({ bodyA, bodyB, pair }) { this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x - bodyB.gameObject.x, bodyA.gameObject.y - bodyB.gameObject.y), 90); }

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
    humanInteractableItems.initializeScene3(teslas, eSurfaces,bladesBig);
    androidInteractableItems = new AndroidInteractablesArray(this);
    androidInteractableItems.initializeScene3(eSurfaces, doors);

    //Camara.
    cam = this.cameras.main;
    cam.fadeIn(1000);
    this.matter.world.setBounds(0, -500, 10000, 10000);
    cam.setBounds(0, 0, 7292, 10000);
    firstFollow = this.add.container(0, 0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);

    //Barra de progreso.
    const progressBar = this.add.image(480, 12, 'progression_bar');//7200
    progressBar.setScrollFactor(0);
    p1Tracker = this.add.image(0, 22, 'deathHead1');
    p1Tracker.setScrollFactor(0).setScale(0.7);
    p2Tracker = this.add.image(0, 22, 'deathHead2');
    p2Tracker.setScrollFactor(0).setScale(0.7);

    //Pointer del ratón.
    //mouse = this.input.activePointer;
  }

  //Función update, que actualiza el estado de la escena.
  update(time, delta) {
    //Si las vidas son igual o menores que 0, se acaba la partida.
    if(game.lives <= 0 && this.shouldBeActive){
      this.shouldBeActive = false;
      this.cameras.main.fadeOut(1000);
      game.customTransition(this, 'defeat', 1000);
    }
    firstFollow.x = Math.max(game.android1.sprite.x, game.android2.sprite.x);
    firstFollow.y = Math.max(Math.min((game.android1.sprite.y + game.android2.sprite.y) / 2, 360), -500);

    //Interactuables.
    usableItems.update(time, delta);
    androidInteractableItems.update(time, delta);
    humanInteractableItems.update(time, delta);

    //Update de las plataformas móviles.
    for (var i = 0; i < movingP.length; i++) {
      movingP[i].update(time,delta);
    }

    //Si ambos llegan al final del nivel, hacemos transición al siguiente.
    if(game.android1.arrived && game.android2.arrived && !fadeOut) {
      fadeOut = true;
      cam.fadeOut(2000);
      game.customTransition(this, 'level3', 2000);
    }

    //Trackers de la barra de progreso.
    p1Tracker.x = game.android1.sprite.x / 15.7 + 440;
    p2Tracker.x = game.android2.sprite.x / 15.7 + 440;

    //document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
