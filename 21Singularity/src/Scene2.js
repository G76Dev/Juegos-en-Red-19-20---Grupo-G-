
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

var blueRays = [];
var orangeRays = [];
var doors = [];
var blades = [];
var buttonSprites = [];
var buttonBoolsP1 = [];
var buttonBoolsP2 = [];
var presses = [];
var extraLifes = [];

import Android from "./Android.js";
import ItemBar from "./ItemClasses.js";
import Conveyer from "./Conveyer.js";
import Press from "./Press.js";
import HumanInteractablesArray from "./HumanInteractableClass.js";
import AndroidInteractablesArray from "./AndroidInteractableClass.js";
import Monitor from "./monitor.js";

export default class Scene2 extends Phaser.Scene{
  constructor(){
    super("level1");
  }
  //Función preload, que carga elementos antes de iniciar el juego
  preload ()
  {
    //imagenes fondo TILED
    this.load.image("tiles1", "../assets/Tilesets/tileset_industrial.png");
    this.load.tilemapTiledJSON("map", "../assets/Mapas/Industrial_Easy.json");

    this.load.image('generic', 'assets/Test/virtual.png');

    this.load.image('ground', 'assets/Test/platform.png');
    this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('explosion', 'assets/Sprites/Explosions/explosion-6.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('laser', 'assets/Sprites/laser/laser.png', { frameWidth: 1950, frameHeight: 450 });

    this.load.spritesheet('android1Run', 'assets/Sprites/Androids/male_android_running.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1Idle', 'assets/Sprites/Androids/male_android_idle.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1JumpUp', 'assets/Sprites/Androids/male_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1JumpDown', 'assets/Sprites/Androids/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

    this.load.image('deathHead', "assets/Sprites/Androids/cabeza.png");
    this.load.image('deathFootR', "assets/Sprites/Androids/pieDer.png");
    this.load.image('deathFootL', "assets/Sprites/Androids/pieIzq.png");
    this.load.image('deathBodyL', "assets/Sprites/Androids/cuerpoIzq.png");
    this.load.image('deathBodyR', "assets/Sprites/Androids/CuerpoDer.png");
    this.load.image('deathLegs', "assets/Sprites/Androids/piernas.png");

    //cambiar por imagenes de la barra de objetos
    this.load.image('item_bar', 'assets/Interfaz/InGame/item_bar.png');
    this.load.image('item1', 'assets/Sprites/Bomb/Bomb1.png');
    this.load.image('item2', 'assets/Test/selector.png');
    this.load.image('item3', 'assets/Sprites/pinchos/spike.png');
    this.load.image('spikeBox', 'assets/Sprites/pinchos/SPIKE_in_a_box.png');
    this.load.image('item4', 'assets/Test/bomb.png');
    this.load.image('item5', 'assets/Test/bomb.png');

    this.load.image('bar', 'assets/Test/Barra.png');

    this.load.image('bg', 'assets/Backgrounds/Industrial/Industrialbg.png');
    this.load.image('bg1', 'assets/Backgrounds/Industrial/IndustrialFar.png');
    this.load.image('bg2', 'assets/Backgrounds/Industrial/IndustrialMid.png');
    this.load.image('bg3', 'assets/Backgrounds/Industrial/IndustrialClose.png');

    this.load.spritesheet('blueRay', 'assets/Sprites/Rays/Blue_Ray_ss.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('orangeRay', 'assets/Sprites/Rays/Orange_Ray_ss.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('orangeDoor', 'assets/Sprites/Doors/Door_orange.png');

    this.load.spritesheet('rBlade', 'assets/Sprites/rotating_blade.png', { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('orangeButton', 'assets/Sprites/Buttons/orange_button.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('blueButton', 'assets/Sprites/Buttons/blue_button.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('life', 'assets/Sprites/life.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('conveyer1', 'assets/Sprites/Conveyers/conveyer_1.png', { frameWidth: 952, frameHeight: 20 });
    this.load.spritesheet('conveyer3', 'assets/Sprites/Conveyers/conveyer_3.png', { frameWidth: 408, frameHeight: 20 });

    this.load.image('elevator', 'assets/Sprites/elevator.png');
    this.load.image('blue_fp', 'assets/Sprites/Falling_platforms/blue_fp.png');

    this.load.image('pressI', 'assets/Sprites/human_press.png');
    this.load.image('pressNI', 'assets/Sprites/ni_press.png');

  }
  //Función create, que crea los elementos del propio juego
  create ()
  {
    //backgrounds
    const bg = this.add.image(0,0,'bg').setScale(30).setDepth(-503);
    const backg1 = this.add.image(1300,550,'bg1').setScale(0.9);
    backg1.setScrollFactor(0.25).setDepth(-502);
    const backg2 = this.add.image(1100,450,'bg2').setScale(1);
    backg2.setScrollFactor(0.5).setDepth(-501);
    const backg3 = this.add.image(1200,650,'bg3').setScale(1.2);
    backg3.setScrollFactor(0.75).setDepth(-500);

    //inicializacion y creacion de mapa de tiles
    const map = this.make.tilemap({ key: "map" });
    const tileset1 = map.addTilesetImage("Tileset Industrial x32", "tiles1");

    const layerminus2 = map.createStaticLayer("background_layer_-2depth", tileset1, 0, 0);
    layerminus2.depth = -20;

    //Sierras giratorias
    blades[0] = this.matter.add.sprite(2080, 416, "rBlade", 0);
    blades[1] = this.matter.add.sprite(3296, 288, "rBlade", 0);
    blades[2] = this.matter.add.sprite(3902, 576, "rBlade", 0);
    blades[3] = this.matter.add.sprite(6336, 608, "rBlade", 0);
    blades[4] = this.matter.add.sprite(6736, 592, "rBlade", 0);
    blades[5] = this.matter.add.sprite(6864, 592, "rBlade", 0);

    const layerminus1 = map.createStaticLayer("deco_layer_-1depth", tileset1, 0, 0);
    const baselayer = map.createStaticLayer("base_layer_0depth", tileset1, 0, 0);
    const lethallayer = map.createStaticLayer("lethal_layer_0depth", tileset1, 0, 0);

    layerminus1.setCollisionByProperty({Collides: true});
    this.matter.world.convertTilemapLayer(layerminus1);

    baselayer.setCollisionByProperty({Collides: true});
    this.matter.world.convertTilemapLayer(baselayer);

    lethallayer.setCollisionByProperty({Collides: true});
    this.matter.world.convertTilemapLayer(lethallayer);

    var cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S } );
    this.android1 = new Android(this, 300, 300, cursors);
    cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.I, 'left': Phaser.Input.Keyboard.KeyCodes.J, 'right': Phaser.Input.Keyboard.KeyCodes.L, 'coop': Phaser.Input.Keyboard.KeyCodes.K } );
    this.android2 = new Android(this, 400, 300, cursors);
    this.android1.coLink(this.android2);
    this.android2.coLink(this.android1);
    const monitorTest = new Monitor(this,300,300);

    presses[0] = new Press(this,4464, 148, "pressNI");
    presses[0].startCycle(-1,0);
    presses[1] = new Press(this,4534, 146, "pressNI");
    presses[1].startCycle(-1,1800);
    presses[2] = new Press(this,4604, 146, "pressNI");
    presses[2].startCycle(-1,0);
    presses[3] = new Press(this,4674, 146, "pressNI");
    presses[3].startCycle(-1,1800);
    presses[4] = new Press(this,4864, 403, "pressNI");
    presses[4].startCycle(-1,0);
    presses[5] = new Press(this,4934, 403, "pressNI");
    presses[5].startCycle(-1,1800);
    presses[6] = new Press(this,5004, 403, "pressNI");
    presses[6].startCycle(-1,0);
    presses[7] = new Press(this,5074, 403, "pressNI");
    presses[7].startCycle(-1,1800);

    presses[8] = new Press(this,4464, 403, "pressI");
    presses[8].startCycle(1,0);
    presses[9] = new Press(this,4564, 403, "pressI");
    presses[9].startCycle(1,0);
    presses[10] = new Press(this,4664, 403, "pressI");
    presses[10].startCycle(1,0);

    presses[11] = new Press(this,4864, 146, "pressI");
    presses[11].startCycle(1,0);
    presses[12] = new Press(this,4964, 146, "pressI");
    presses[12].startCycle(1,0);
    presses[13] = new Press(this,5064, 146, "pressI");
    presses[13].startCycle(1,0);

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

    function lethalCollide({ gameObjectB }){
      if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
        const tile = gameObjectB;
        if (tile.properties.lethal) {
          this.damaged(new Phaser.Math.Vector2(0, -(this.sprite.y-gameObjectB.y)), 60);
      }
    }

    //Elementos animados o interactuables
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

    //Colisiones entre androides y rayos.
    for(var i = 0; i < orangeRays.length; i++) {
      orangeRays[i].setRectangle(16,32);
      if(i >= 11)
        orangeRays[i].setAngle(90);
      orangeRays[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: this.android1.mainBody,
        objectB: orangeRays[i],
        callback: inflictDamage,
        context: this.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.android2.mainBody,
        objectB: orangeRays[i],
        callback: inflictDamage,
        context: this.android2
      });
    }

    for(var i = 0; i < blueRays.length; i++) {
      blueRays[i].setRectangle(16,32);
      if(i >= 6)
        blueRays[i].setAngle(90);
      blueRays[i].setStatic(true).setSensor(true);
      this.matterCollision.addOnCollideStart({
        objectA: this.android1.mainBody,
        objectB: blueRays[i],
        callback: inflictDamage,
        context: this.android1
      });
      this.matterCollision.addOnCollideStart({
        objectA: this.android2.mainBody,
        objectB: blueRays[i],
        callback: inflictDamage,
        context: this.android2
      });
    }

    //Puertas
    doors[0] = this.matter.add.sprite(2800, 432, "orangeDoor", 0);
    doors[1] = this.matter.add.sprite(4272, 272, "orangeDoor", 0);
    doors[2] = this.matter.add.sprite(4272, 528, "orangeDoor", 0);
    doors[3] = this.matter.add.sprite(6512, 560, "orangeDoor", 0);
    doors[4] = this.matter.add.sprite(7216, 560, "orangeDoor", 0);

    for(var i = 0; i < doors.length; i++) {
      doors[i].setRectangle(8,96);
      doors[i].setStatic(true);
    }

    //Colisiones entre androides y sierras.
    for(var i = 0; i < blades.length; i++) {
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
    }

    this.lifesText = this.add.text(0, 24, 'Lifes: 7', { fontSize: '32px', fill: '#000' });
    this.lifesText.setScrollFactor(0);

    //Vidas Extras
    extraLifes[0] = this.matter.add.sprite(2640, 406, "life", 0);
    extraLifes[1] = this.matter.add.sprite(3664, 272, "life", 0);
    extraLifes[2] = this.matter.add.sprite(6560, 582, "life", 0);

    for(var i = 0; i < extraLifes.length; i++) {
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

    function addLife({gameObjectB}) {
      Android.lives ++;
      this.lifesText.setText("Lives: " + Android.lives);
      gameObjectB.destroy();
    }

    //Función inflictDamage, que hiere a los androides.
    function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}


    //INTERFAZ
    mouse = this.input.activePointer;
    //instancia de barra de objetos
    usableItems = new ItemBar(this,900,70,200);

    //players = new AndroidPlayers(this);
    //players.setGround(floor);

    //Creamos las animaciones de los personajes: idle, wLeft, wRight
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('android1Run', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('android1Idle', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpUp',
        frames: this.anims.generateFrameNumbers('android1JumpUp', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpDown',
        frames: this.anims.generateFrameNumbers('android1JumpDown', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
      key: 'eBomb',
      frames: this.anims.generateFrameNumbers('explodingBomb', { start: 0, end: 13 }),
      frameRate: 5,
      repeat: 0
    });

    this.anims.create({
      key: 'exprosion',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: 0
    });
    this.anims.create({
      key: 'laserSprite',
      frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 1 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'blueRayS',
      frames: this.anims.generateFrameNumbers('blueRay', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'orangeRayS',
      frames: this.anims.generateFrameNumbers('orangeRay', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'rotatingBlade',
      frames: this.anims.generateFrameNumbers('rBlade', { start: 0, end: 4 }),
      frameRate: 30,
      repeat: -1
    });
    this.anims.create({
      key: 'lifeS',
      frames: this.anims.generateFrameNumbers('life', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'conveyer1S',
      frames: this.anims.generateFrameNumbers('conveyer1', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'conveyer3S',
      frames: this.anims.generateFrameNumbers('conveyer3', { start: 0, end: 3 }),
      frameRate: 20,
      repeat: -1
    });

    const conveyer1 = new Conveyer(this, 4767, 310,"conveyer_1",928, 2);
    const conveyer2 = new Conveyer(this, 4767, 566,"conveyer_1",928, -2);
    const conveyer3 = new Conveyer(this, 6800, 600,"conveyer_3",400, 2);

    //Objetos animados
    for(var i = 0; i < orangeRays.length; i++) {
      orangeRays[i].anims.play('orangeRayS', true);
    }

    for(var i = 0; i < blueRays.length; i++) {
      blueRays[i].anims.play('blueRayS', true);
    }
    for(var i = 0; i < blades.length; i++) {
      blades[i].anims.play('rotatingBlade', true);
    }

    conveyer1.sprite.anims.play('conveyer1S', true);
    conveyer2.sprite.anims.play('conveyer1S', true);
    conveyer3.sprite.anims.play('conveyer3S', true);

    for(var i = 0; i < extraLifes.length; i++) {
      extraLifes[i].anims.play('lifeS', true);
    }

    //interactuables
    humanInteractableItems = new HumanInteractablesArray(this, blueRays, blades, presses, doors);
    androidInteractableItems = new AndroidInteractablesArray(this, orangeRays, doors);

    //CAMARA:
    cam = this.cameras.main;
    this.matter.world.setBounds(-500, -500, 10000, 10000);
    cam.setBounds(-500, 0, 10000, 10000);
    firstFollow = this.add.container(0,0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);
    //cam.setZoom(1);

    const progressBar = this.add.image(480,12,'generic');
    progressBar.setScrollFactor(0).setScale(5,0.10).setTint(0x645FC5);
    p1Tracker = this.add.image(0,25,'deathHead');
    p1Tracker.setScrollFactor(0).setScale(0.65);
    p2Tracker = this.add.image(0,25,'deathHead');
    p2Tracker.setScrollFactor(0).setScale(0.65);
    //3º JUGADOR:
    //Se añaden funciones al arrastrar y dejar de arrastrar objetos arrastrables
  }

  update (time, delta)
  {
    //Si gameOver es true, acaba la partida.
    if (gameOver)
    {
        return;
    }
    firstFollow.x = Math.max(this.android1.sprite.x, this.android2.sprite.x);
    firstFollow.y = Math.max(Math.min((this.android1.sprite.y + this.android2.sprite.y)/2, 360),-500);
    usableItems.update(time, delta);
    androidInteractableItems.update(time, delta);
    humanInteractableItems.update(time, delta);
    for(var i=0; i<presses.length; i++){
      presses[i].update();
    }

    p1Tracker.x = this.android1.sprite.x/9.1 + 40;
    p2Tracker.x = this.android2.sprite.x/9.1 + 40;

    document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
