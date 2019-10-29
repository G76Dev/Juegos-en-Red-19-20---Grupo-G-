
import Android from "./android.js";
import ItemBar from "./itemClasses.js";

//Zona de declaración de variables
//Variable gameOver para finalizar la partida
var gameOver = false;
//Plataformas
var bgItems;
var deco;
var floor;
var overlapDeco;

//Variables CAMARA
var cam;
var firstFollow;

var usableItems;
//Vidas de los jugadores
var vidas = 5;
//variables jugadores
var android1;
var android2;
//mouse
var mouse;
//backgrounds
var bg;
var backg1;
var backg2;
var backg3;

export default class Scene2 extends Phaser.Scene{
  constructor(){
    super("level1");
  }
  //Función preload, que carga elementos antes de iniciar el juego
  preload ()
  {
    //imagenes fondo TILED
    this.load.image("tiles1", "../assets/Tilesets/tileset_industrial.png");
    this.load.tilemapTiledJSON("map", "../assets/Mapas/Industrial_v1.json");

    this.load.image('generic', 'assets/Test/virtual.png');

    this.load.image('ground', 'assets/Test/platform.png');
    this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('android1Run', 'assets/Sprites/Androids/male_android_running.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1Idle', 'assets/Sprites/Androids/male_android_idle.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1JumpUp', 'assets/Sprites/Androids/male_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('android1JumpDown', 'assets/Sprites/Androids/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

    //cambiar por imagenes de la barra de objetos
    this.load.image('item_bar', 'assets/Test/item_bar.png');
    this.load.image('item1', 'assets/Sprites/Bomb/Bomb1.png');
    this.load.image('item2', 'assets/Test/selector.png');
    this.load.image('item3', 'assets/Test/bomb.png');
    this.load.image('item4', 'assets/Test/bomb.png');
    this.load.image('item5', 'assets/Test/bomb.png');

    this.load.image('bar', 'assets/Test/Barra.png');

    this.load.image('bg', 'assets/Backgrounds/Industrial/Industrialbg.png');
    this.load.image('bg1', 'assets/Backgrounds/Industrial/IndustrialFar.png');
    this.load.image('bg2', 'assets/Backgrounds/Industrial/IndustrialMid.png');
    this.load.image('bg3', 'assets/Backgrounds/Industrial/IndustrialClose.png');
  }
  //Función create, que crea los elementos del propio juego
  create ()
  {
    //backgrounds
    bg = this.add.image(0,0,'bg').setScale(30);
    backg1 = this.add.image(1300,550,'bg1').setScale(0.9);
    backg1.setScrollFactor(0.25);
    backg2 = this.add.image(1100,450,'bg2').setScale(1);
    backg2.setScrollFactor(0.5);
    backg3 = this.add.image(1200,650,'bg3').setScale(1.2);
    backg3.setScrollFactor(0.75);

    //inicializacion y creacion de mapa de tiles
    const map = this.make.tilemap({ key: "map" });
    const tileset1 = map.addTilesetImage("Tileset Industrial x32", "tiles1");

    bgItems = map.createDynamicLayer("Capa -3", tileset1, 0, 0);
    deco = map.createDynamicLayer("Capa -2", tileset1, 0, 0);
    overlapDeco = map.createDynamicLayer("Capa -1", tileset1, 0, 0);
    floor = map.createDynamicLayer("Base", tileset1, 0, 0);

    floor.setCollisionByProperty({Collides: true});
    this.matter.world.convertTilemapLayer(floor);

    deco.setCollisionByProperty({Collides: true});
    this.matter.world.convertTilemapLayer(deco);

    //INTERFAZ
    mouse = this.input.activePointer;
    //instancia de barra de objetos
    usableItems = new ItemBar(this,875,100,50);

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
      frameRate: 6,
      repeat: 0
  });

    var cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S } );
    android1 = new Android(this, 100, 200, cursors);
    var cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.I, 'left': Phaser.Input.Keyboard.KeyCodes.J, 'right': Phaser.Input.Keyboard.KeyCodes.L, 'coop': Phaser.Input.Keyboard.KeyCodes.K } );
    android2 = new Android(this, 200, 200, cursors);
    android1.coLink(android2);
    android2.coLink(android1);

    //interactuables
    interactableItems = new AllInteractablesArray(this, 10);

    //CAMARA:
    cam = this.cameras.main;
    this.matter.world.setBounds(-500, 0, 10000, 10000);
    cam.setBounds(-500, 0, 10000, 10000);
    firstFollow = this.add.container(0,0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);
    cam.setZoom(1);
    //firstFollow.y = 176;

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
    document.getElementById('info').innerHTML = android1.invulnerable;
    //players.update(time, delta, this);
    firstFollow.x = Math.max(android1.sprite.x, android2.sprite.x);
    //firstFollow.y = (players.player1.x > players.player2.x)? players.player1.y : players.player2.y;
    firstFollow.y = Math.max(Math.min((android1.sprite.y + android2.sprite.y)/2, 360),-500);
    usableItems.update(time, delta);
    interactableItems.update(time, delta);
    document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
  }
}
