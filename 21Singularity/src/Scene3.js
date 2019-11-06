//Zona de declaración de variables
//Variable gameOver para finalizar la partida
var gameOver = false;
//Variables CAMARA
var cam;
var firstFollow;

var usableItems;
var humanInteractableItems;
var androidInteractableItems;

//mouse
var mouse;

var p1Tracker;
var p2Tracker;

const movingP = [];

import Android from "./Android.js";
import ItemBar from "./ItemClasses.js";
import HumanInteractablesArray from "./HumanInteractableClass.js";
import AndroidInteractablesArray from "./AndroidInteractableClass.js";
import MovingPlatform from "./MovingPlatform.js";
import Tesla from "./Tesla.js";
import ElectricSurface from "./ElectricSurface.js";

export default class Scene3 extends Phaser.Scene {
  constructor() {
    super("level2");
  }
  //Función preload, que carga elementos antes de iniciar el juego
  preload() {
    const music = this.sound.add('menuMusic');
    music.play();
    music.stop();
  }
  //Función create, que crea los elementos del propio juego
  create() {
  const doors = [];
  const extraLifes = [];
  const teslas = [];
  const eSurfaces = [];

    //backgrounds
    this.add.image(480, 270, 'bg_e').setScrollFactor(0).setDepth(-503);
    this.add.image(1300, 290, 'bg1_e').setScale(2).setScrollFactor(0.25).setDepth(-502);
    this.add.image(1100, 320, 'bg2_e').setScale(2).setScrollFactor(0.5).setDepth(-501);
    this.add.image(1200, 400, 'bg3_e').setScale(2).setScrollFactor(0.75).setDepth(-500);

    //inicializacion y creacion de mapa de tiles
    const map2 = this.make.tilemap({ key: "map2" });
    const tileset2 = map2.addTilesetImage("electrical_tileset", "tiles2");

    const layerminus2 = map2.createStaticLayer("background_layer_-2depth", tileset2, 0, 0);
    layerminus2.depth = -20;

    //Sierras giratorias
    //blades[0] = this.matter.add.sprite(2080, 416, "rBlade", 0);

    const layerminus1 = map2.createStaticLayer("deco_layer_-1depth", tileset2, 0, 0);
    layerminus1.depth = -10;
    const baselayer = map2.createStaticLayer("base_layer_0depth", tileset2, 0, 0);
    baselayer.depth = -5;
    const lethallayer = map2.createStaticLayer("lethal_layer_0depth", tileset2, 0, 0);
    lethallayer.depth = -5;
    const debuglayer = map2.createStaticLayer("debug_layer_0depth", tileset2, 0, 0);
    debuglayer.depth = -5;
    /*const offsetlethallayer = map2.createStaticLayer("offset_lethal_layer", tileset2, 0, 0);
    offsetlethallayer.depth = -5;*/

    layerminus1.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(layerminus1);

    baselayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(baselayer);

    lethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(lethallayer);

    debuglayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(debuglayer);

    /*offsetlethallayer.setCollisionByProperty({ Collides: true });
    this.matter.world.convertTilemapLayer(offsetlethallayer);*/

    var cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S });
    this.android1 = new Android(this, '1', 5950, 360, cursors);
    cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.I, 'left': Phaser.Input.Keyboard.KeyCodes.J, 'right': Phaser.Input.Keyboard.KeyCodes.L, 'coop': Phaser.Input.Keyboard.KeyCodes.K });
    this.android2 = new Android(this, '2', 400, 300, cursors);
    this.android1.coLink(this.android2);
    this.android2.coLink(this.android1);

    this.matterCollision.addOnCollideStart({
      objectA: this.android1.mainBody,
      callback: lethalCollide,
      context: this.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: this.android2.mainBody,
      callback: lethalCollide,
      context: this.android2
    });

    function lethalCollide({ gameObjectB }) {
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
      const tile = gameObjectB;
      if (tile.properties.lethal) {
        this.damaged(new Phaser.Math.Vector2(0, -(this.sprite.y - gameObjectB.y)), 60);
      }
    }


    const bladesBig = this.matter.add.sprite(5712, 464, "rBlade", 0);
    bladesBig.setCircle(28)
    bladesBig.setStatic(true).setSensor(true);
    this.matterCollision.addOnCollideStart({
      objectA: this.android1.mainBody,
      objectB: bladesBig,
      callback: inflictDamage,
      context: this.android1
    });
    this.matterCollision.addOnCollideStart({
      objectA: this.android2.mainBody,
      objectB: bladesBig,
      callback: inflictDamage,
      context: this.android2
    });
    bladesBig.anims.play('rotatingBlade', true);
    //Elementos animados o interactuables

    //Plataforma que se mueve
    movingP[0] = new MovingPlatform(this, 4992, 338, 5394, 'moving_platform', 'moving_platformS');
    movingP[1] = new MovingPlatform(this, 4944, 526, 5152, 'moving_platform', 'moving_platformS');
    movingP[2] = new MovingPlatform(this, 5454, 526, 5248, 'moving_platform', 'moving_platformS');

    //Teslas
    teslas[0] = new Tesla(this, 1936, 458);
    teslas[1] = new Tesla(this, 3632, 314);
    teslas[2] = new Tesla(this, 5392, 526);

    teslas[3] = new Tesla(this, 4238, 142);
    teslas[4] = new Tesla(this, 4976, 526);
    teslas[5] = new Tesla(this, 5200, 526);
    teslas[6] = new Tesla(this, 6864, 336);

    eSurfaces[0] = new ElectricSurface(this, 1294, 592,"generic", true);
    eSurfaces[1] = new ElectricSurface(this, 2546, 546,"generic", false);
    eSurfaces[2] = new ElectricSurface(this, 4064, 384,"generic", true);
    //const eS = new ElectricSurface(this, 1000, 500);

    //Puertas
    doors[0] = this.matter.add.sprite(1830, 466, "orangeDoor2", 0);
    doors[1] = this.matter.add.sprite(2258, 466, "orangeDoor2", 0);
    doors[2] = this.matter.add.sprite(2192, 342, "orangeDoor2", 0);
    doors[3] = this.matter.add.sprite(6832, 466, "orangeDoor2", 0);

    for (var i = 0; i < doors.length; i++) {
      doors[i].setRectangle(8, 96);
      doors[i].setStatic(true);
    }
    /*
    //Colisiones entre androides y sierras.
    for (var i = 0; i < blades.length; i++) {
      blades[i].setCircle(28)
      blades[i].setStatic(true).setSensor(true);

      this.matterCollision.addOnCollideStart({
        objectA: this.android1.mainBody,
        objectB: blades[i],
        callback: inflictDamage,
        context: this.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.android2.mainBody,
        objectB: blades[i],
        callback: inflictDamage,
        context: this.android2
      });
    }*/

    this.lifesText = this.add.text(0, 24, 'Lifes: ' + Android.lives, { fontSize: '32px', fill: '#000' });
    this.lifesText.setScrollFactor(0);

    //Vidas Extras
    extraLifes[0] = this.matter.add.sprite(1264, 432, "life", 0);
    extraLifes[1] = this.matter.add.sprite(2128, 208, "life", 0);
    extraLifes[2] = this.matter.add.sprite(5488, 304, "life", 0);
    extraLifes[3] = this.matter.add.sprite(6576, 408, "life", 0);


    for (var i = 0; i < extraLifes.length; i++) {
      extraLifes[i].setStatic(true).setSensor(true);

      this.matterCollision.addOnCollideStart({
        objectA: this.android1.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.android2.mainBody,
        objectB: extraLifes[i],
        callback: addLife,
        context: this
      });
    }

    function addLife({ gameObjectB }) {
      Android.lives++;
      this.lifesText.setText("Lives: " + Android.lives);
      gameObjectB.destroy();
    }

    //Función inflictDamage, que hiere a los androides.
    function inflictDamage({ bodyA, bodyB, pair }) { this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x - bodyB.gameObject.x, bodyA.gameObject.y - bodyB.gameObject.y), 90); }


    //INTERFAZ
    mouse = this.input.activePointer;
    //instancia de barra de objetos
    usableItems = new ItemBar(this, 900, 70, 200);

    //players = new AndroidPlayers(this);
    //players.setGround(floor);

    //Objetos animados
    /*for (var i = 0; i < blades.length; i++) {
      blades[i].anims.play('rotatingBlade', true);
    }
    */
    for (var i = 0; i < extraLifes.length; i++) {
      extraLifes[i].anims.play('lifeS', true);
    }

    //interactuables
    humanInteractableItems = new HumanInteractablesArray(this, usableItems);
    humanInteractableItems.initializeScene3(teslas, eSurfaces,bladesBig);
    androidInteractableItems = new AndroidInteractablesArray(this);
    androidInteractableItems.initializeScene3(eSurfaces, doors);

    //CAMARA:
    cam = this.cameras.main;
    this.matter.world.setBounds(-500, -500, 10000, 10000);
    cam.setBounds(-500, 0, 10000, 10000);
    firstFollow = this.add.container(0, 0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);
    //cam.setZoom(1);

    const progressBar = this.add.image(480, 12, 'generic');
    progressBar.setScrollFactor(0).setScale(5, 0.10).setTint(0x645FC5);
    p1Tracker = this.add.image(0, 25, 'deathHead1');
    p1Tracker.setScrollFactor(0).setScale(0.65);
    p2Tracker = this.add.image(0, 25, 'deathHead2');
    p2Tracker.setScrollFactor(0).setScale(0.65);
    //3º JUGADOR:
    //Se añaden funciones al arrastrar y dejar de arrastrar objetos arrastrables
  }

  update(time, delta) {
    //Si gameOver es true, acaba la partida.
    if (gameOver) {
      return;
    }
    firstFollow.x = Math.max(this.android1.sprite.x, this.android2.sprite.x);
    firstFollow.y = Math.max(Math.min((this.android1.sprite.y + this.android2.sprite.y) / 2, 360), -500);
    usableItems.update(time, delta);
    androidInteractableItems.update(time, delta);
    humanInteractableItems.update(time, delta);
    for (var i = 0; i < movingP.length; i++) {
      movingP[i].update(time,delta);
    }
    p1Tracker.x = this.android1.sprite.x / 9.1 + 40;
    p2Tracker.x = this.android2.sprite.x / 9.1 + 40;

    document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
