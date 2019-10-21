"use strict";
//Configuración de Phaser 3
var config = {
    type: Phaser.AUTO,
    //Dimensiones de la ventana de juego (ancho y alto)
    width: 960,
    height: 540,
    //Físicas del juego
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1300 },
            debug: false
        }
    },
    //Escena principal
    scene: {
        preload: preload,
        create: create,
        update: update
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

//clase objeto arrastrable, hereda de la clase imagen de phaser
class draggableObject extends Phaser.GameObjects.Image{
  //objeto muy parecido a "Image" pero con atributos adicionales
  constructor(scene, x, y, interfaceTexture, texture, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25, coste = 0) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
      //profundidad de objeto
      this.setDepth(99)
      //coste del item
      this.cost = coste;
      //sprite de barra de objeto y sprite una vez lanzado el objeto en el escenario
      this.interfaceSprite = interfaceTexture;
      this.sprite = texture;
      //posicion inicial del sprite dentro de la barra de tareas
      this.startPosX = x;
      this.startPosY = y;
      //escala de la imgaen del interfaz
      this.setScale(scaleIntrefaceImage);
      //escala del objeto al ser lanzado en el escenario y su rebote
      this.scaleImage = scaleImage;
      this.bounce = bounce;
      //permanece en pantall siempre
      this.setScrollFactor(0);
      //comandos para hacer que esta imagen dentro de la barra de tareas sea arrastrable (por esto hereda de Image)
      this.setInteractive();
      scene.input.setDraggable(this);
  }
  //metodo para crear un objeto al soltar el ratón y dejar de arrastrar
  dropItemInGame() {
    if(usableItems.barra.scaleY > this.cost){
      var bombInstance = this.scene.physics.add.sprite(this.x + cam.scrollX, this.y + cam.scrollY, this.sprite);
      bombInstance.setScale(this.scaleImage);
      bombInstance.setCollideWorldBounds(true);
      this.scene.physics.add.collider(bombInstance, floor);
      bombInstance.setBounce(this.bounce);
      usableItems.changeBar(usableItems.barra.scaleY - this.cost);
      return bombInstance; //devuelve la instancia creada
    }
    return null;
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
class draggableBomb extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce, 0.25);
  }
}

class draggableRect extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item2', 'item2', frame, scaleIntrefaceImage, scaleImage, bounce, 0.80);
  }
}


var usableItems;
//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
class itemBar{
  constructor(scene, positionX, separationY, initialSepY){
    var counter = 0;
    this.items = [];
    //cada objeto nuevo se añade al array de objetos
    this.items[0] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[1] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
    this.items[2] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0);
    this.items[3] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0, 0.35, 0.6, 0.5);
    this.items[4] = new draggableRect(scene, positionX, initialSepY + separationY*(counter++),0);

    this.barra = scene.add.image(positionX + 60,540/2,'bar');
    this.barra.originY = 1;
    this.barra.setDepth(99).setTint(0xFF5923).setScrollFactor(0);
  }

  changeBar(newScaleY){
    this.barra.scaleY = newScaleY;
  }
  update(time, delta){
    var increaseRate = 0.0001 * delta;
    if(this.barra.scaleY < 1){
      this.barra.scaleY += increaseRate;
    } else{
      this.barra.scaleY = 1;
    }
    //document.getElementById('info').innerHTML = this.barra.y;
  }
}

//Vidas de los jugadores
var vidas = 5;
//variables jugadores
var players;
//Objeto player, con la información de nuestros jugadores "player1 y player2"
class Player extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene﻿.physics.world.enableBody(this,0);
    scene.add.existing(this);

    this.cursors;
    this.hasCoopImpul = false;

    this.setCollideWorldBounds(true);
  }

  update(time, delta){
    if(this.body.onFloor()){
      this.hasCoopImpul = false;
    }
    if (this.cursors.left.isDown)
    {
        this.setVelocityX(-16 * delta);
        this.anims.play('wLeft', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.setVelocityX(16 * delta);
        this.anims.play('wRight', true);
    }
    else
    {
        this.setVelocityX(0);
        this.anims.play('idle');
    }
    if (this.cursors.up.isDown && this.body.onFloor())
    {
        this.setVelocityY(-550);
    }
  }

  saltoCoop(otherP) {
    if ((otherP.x > (this.x - 16)) && (otherP.x < (this.x + 16)))
    {
      if((otherP.y < this.y + 12) && (otherP.y > (this.y - 24)))
      {
        if(!this.hasCoopImpul && !otherP.hasCoopImpul){
          otherP.setVelocityY(-550);
          otherP.setAccelerationY(0);
          this.hasCoopImpul = true;
        }
      }
    }
  }
}

class AndroidPlayers{
  constructor(scene){
    //variables para los 2 jugadores humanos
    //Añadimos sprite y físicas a los jugadores
    this.player1 = new Player(scene, 60, 250, 'dude');
    this.player2 = new Player(scene, 100, 250, 'dude');
    //Colores provisionales para distinguir los personajes
    this.player1.setTint(0xff0000);
    this.player2.setTint(0x0000ff);
    //Inputs de los jugadores
    this.player1.cursors = scene.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.R } );
    this.player2.cursors = scene.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down': Phaser.Input.Keyboard.KeyCodes.DOWN, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.L } );
  }

  update(time, delta){
    this.player1.update(time, delta);
    this.player2.update(time, delta);
    if (this.player1.cursors.coop.isDown && !(this.player1.body.touching.down)) {
       this.player1.saltoCoop(this.player2);
     }
     if (this.player2.cursors.coop.isDown && !(this.player2.body.touching.down)) {
        this.player2.saltoCoop(this.player1);
    }
  }
}



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

    this.load.image('bg1', 'assets/Backgrounds/Industrial/IndustrialClose.png');
    this.load.image('bg2', 'assets/Backgrounds/Industrial/IndustrialMid.png');
    this.load.image('bg3', 'assets/Backgrounds/Industrial/IndustrialFar.png');
}
var backg1;
var backg2;
var backg3;
//Función create, que crea los elementos del propio juego
function create ()
{
    //backgrounds
    backg1 = this.add.image(0,400,'bg1');
    backg1.setScrollFactor(0.5);
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
    pinchos = map.createStaticLayer("Pinchos", tileset2, 0, 0);
    pinchos.setScale(2);
    overlapDeco = map.createStaticLayer("Decoracion sobrelapada", tileset1, 0, 0);
    overlapDeco.setScale(2);

    floor.setCollisionByProperty({ collides: true });

    //INTERFAZ
    //instancia de barra de objetos
    usableItems = new itemBar(this,875,100,50);
    usableItems.changeBar(0.25);

    players = new AndroidPlayers(this);

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

    //collisiones con tiles
    this.physics.add.collider(players.player1, floor);
    this.physics.add.collider(players.player2, floor);

    //CAMARA:
    cam = this.cameras.main;
    this.physics.world.setBounds(-500, 0, 10000, 10000);
    cam.setBounds(-500, 0, 10000, 10000);
    firstFollow = this.add.container(0,0);
    cam.startFollow(firstFollow, false, 0.05, 0.01, 0, 0);
    //firstFollow.y = 176;
    //this.cameras.main.setZoom(1);

    //3º JUGADOR:
    //Se añaden funciones al arrastrar y dejar de arrastrar objetos arrastrables
    this.input.on('drag', onDrag);
    this.input.on('dragend', onDragEnd);
}

//FUNCIONES DE ARRASTRE
function onDrag(pointer, gameObject, dragX, dragY){
  gameObject.x = dragX;
  gameObject.y = dragY;
}
/*
function onDragStart(pointer, gameObject){
}
*/
function onDragEnd(pointer, gameObject, dropped){
  gameObject.dropItemInGame();
  gameObject.x = gameObject.startPosX;
  gameObject.y = gameObject.startPosY;
}

function update (time, delta)
{
    //Si gameOver es true, acaba la partida.
    if (gameOver)
    {
        return;
    }
    players.update(time, delta);
    firstFollow.x = Math.max(players.player1.x, players.player2.x);
    //firstFollow.y = (players.player1.x > players.player2.x)? players.player1.y : players.player2.y;
    firstFollow.y = (players.player1.y + players.player2.y)/2;
    usableItems.update(time, delta);

}
