"use strict";
import Android from "./android.js";
import itemBar from "./itemClasses.js";
//Configuración de Phaser 3
var config = {
    type: Phaser.AUTO,
    //Dimensiones de la ventana de juego (ancho y alto)
    width: 960,
    height: 540,
    //Físicas del juego
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true
        }
    },
    //Escena principal
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      }
    ]
  }
};
//Zona de declaración de variables
//Variable gameOver para finalizar la partida
var gameOver = false;
//Plataformas
var bgItems;
var deco;
var floor;
var pinchos;
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
//Declaramos nuestro juego
var game = new Phaser.Game(config);
//Función preload, que carga elementos antes de iniciar el juego
function preload ()
{
    //imagenes fondo TILED
    this.load.image("tiles1", "../assets/Tilesets/Roberts.png");
    this.load.image("tiles2", "../assets/Tilesets/customTileset1.png");
    this.load.tilemapTiledJSON("map", "../assets/Mapas/Testing_Grounds.json");

    this.load.image('generic', 'assets/Test/virtual.png');

    this.load.image('ground', 'assets/Test/platform.png');
    this.load.spritesheet('dude', 'assets/Test/dude.png', { frameWidth: 32, frameHeight: 48 });

    //cambiar por imagenes de la barra de objetos
    this.load.image('item1', 'assets/Test/bomb.png');
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
var bg;
var backg1;
var backg2;
var backg3;
//Función create, que crea los elementos del propio juego
function create ()
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
    const tileset1 = map.addTilesetImage("Industrial Fabrica", "tiles1");
    const tileset2 = map.addTilesetImage("Custom tileset", "tiles2");

    bgItems = map.createStaticLayer("Elementos en el fondo", tileset1, 0, 0);
    bgItems.setScale(2);
    deco = map.createStaticLayer("Decoracion", tileset1, 0, 0);
    deco.setScale(2);
    floor = map.createStaticLayer("Suelo", tileset1, 0, 0);
    floor.setScale(2);
    overlapDeco = map.createStaticLayer("Decoracion sobrelapada", tileset1, 0, 0);
    overlapDeco.setScale(2);

    floor.setCollisionByProperty({ collides: true});

    this.matter.world.convertTilemapLayer(floor);

    //INTERFAZ
    mouse = this.input.activePointer;
    //instancia de barra de objetos
    usableItems = new itemBar(this,875,100,50);

    //players = new AndroidPlayers(this);
    //players.setGround(floor);

    //Creamos las animaciones de los personajes: idle, wLeft, wRight
    this.anims.create({
        key: 'wLeft',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    var cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.S } );
    android1 = new Android(this, 100, 0, cursors);
    var cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.I, 'left': Phaser.Input.Keyboard.KeyCodes.J, 'right': Phaser.Input.Keyboard.KeyCodes.L, 'coop': Phaser.Input.Keyboard.KeyCodes.K } );
    android2 = new Android(this, 200, 0, cursors);
    android1.coLink(android2);
    android2.coLink(android1);
    //CAMARA:
    cam = this.cameras.main;
    this.matter.world.setBounds(-500, 0, 10000, 10000);
    cam.setBounds(-500, 0, 10000, 10000);
    firstFollow = this.add.container(0,0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);
    //firstFollow.y = 176;
    //this.cameras.main.setZoom(1);

    //3º JUGADOR:
    //Se añaden funciones al arrastrar y dejar de arrastrar objetos arrastrables
}

function update (time, delta)
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
    document.getElementById('mouse').innerHTML = "X: " + Math.round(mouse.x + cam.scrollX) + " | Y: " + Math.round(mouse.y + cam.scrollY);
}
