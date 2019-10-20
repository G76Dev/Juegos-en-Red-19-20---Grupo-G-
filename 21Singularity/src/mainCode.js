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
var platforms;
//Variables CAMARA
var cam;
var firstFollow;

//clase objeto arrastrable, hereda de la clase imagen de phaser
class draggableObject extends Phaser.GameObjects.Image{
  //objeto muy parecido a "Image" pero con atributos adicionales
  constructor(scene, x, y, interfaceTexture, texture, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, texture, frame);
      scene.add.existing(this);
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
    var bombInstance = this.scene.physics.add.sprite(this.x + cam.scrollX, this.y + cam.scrollY, this.sprite);
    bombInstance.setScale(this.scaleImage);
    bombInstance.setCollideWorldBounds(true);
    this.scene.physics.add.collider(bombInstance, platforms);
    bombInstance.setBounce(this.bounce);

    return bombInstance; //devuelve la instancia creada
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
class draggableBomb extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce);

      //codigo explotar bomba
  }
}

class draggableRect extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item2', 'item2', frame, scaleIntrefaceImage, scaleImage, bounce);
  }
}


var usableItems;
//estructura redimensionable que guarda todos los objetos sellecionables por el 3º jugador
function itemBar(scene, positionX, separationY, initialSepY){
  var counter = 0;
  this.items = [];
  //cada objeto nuevo se añade al array de objetos
  this.items[0] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
  this.items[1] = new draggableObject(scene, positionX, initialSepY + separationY*(counter++), 'generic', 'generic',0);
  this.items[2] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0);
  this.items[3] = new draggableBomb(scene, positionX, initialSepY + separationY*(counter++),0, 0.35, 0.6, 0.5);
  this.items[4] = new draggableRect(scene, positionX, initialSepY + separationY*(counter++),0);
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
    this.hasCoopImuled = false;
  }

  update(){
    if(this.body.touching.down){
      this.hasCoopImuled = false;
    }
    if (this.cursors.left.isDown)
    {
        this.setVelocityX(-160);
        this.anims.play('wLeft', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.setVelocityX(160);
        this.anims.play('wRight', true);
    }
    else
    {
        this.setVelocityX(0);
        this.anims.play('idle');
    }
    if (this.cursors.up.isDown && this.body.touching.down)
    {
        this.setVelocityY(-550);
    }
  }

  saltoCoop(otherP) {
    if ((otherP.x > (this.x - 16)) && (otherP.x < (this.x + 16)))
    {
      if((otherP.y < this.y + 12) && (otherP.y > (this.y - 24)))
      {
        if(!this.hasCoopImuled && !otherP.hasCoopImuled){
          otherP.setVelocityY(-550);
          otherP.setAccelerationY(0);
          this.hasCoopImuled = true;
        }
      }
    }
  }
}

class AndroidPlayers{
  constructor(scene){
    //variables para los 2 jugadores humanos
    //Añadimos sprite y físicas a los jugadores
    this.player1 = new Player(scene, 100, 450, 'dude');
    this.player2 = new Player(scene, 200, 450, 'dude');
    this.player1.setCollideWorldBounds(true);
    this.player2.setCollideWorldBounds(true);
    //Colores provisionales para distinguir los personajes
    this.player1.setTint(0xff0000);
    this.player2.setTint(0x0000ff);
    //Inputs de los jugadores
    this.player1.cursors = scene.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.R } );
    this.player2.cursors = scene.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down': Phaser.Input.Keyboard.KeyCodes.DOWN, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.L } );
  }

  update(){
    this.player1.update();
    this.player2.update();
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
    this.load.image('generic', 'assets/Test/virtual.png');

    this.load.image('ground', 'assets/Test/platform.png');
    this.load.spritesheet('dude', 'assets/Test/dude.png', { frameWidth: 32, frameHeight: 48 });

    //cambiar por imagenes de la barra de objetos
    this.load.image('item1', 'assets/Test/bomb.png');
    this.load.image('item2', 'assets/Test/selector.png');
    this.load.image('item3', 'assets/Test/bomb.png');
    this.load.image('item4', 'assets/Test/bomb.png');
    this.load.image('item5', 'assets/Test/bomb.png');

    this.load.image('bg', 'assets/Test/bg.jpg');
}
//Función create, que crea los elementos del propio juego
function create ()
{
    //Añadimos el background
    this.add.image(1280/2, 720/2, 'bg');

    //INTERFAZ
    //instancia de barra de objetos
    usableItems = new itemBar(this,900,100,50);

    //Añadimos físicas estáticas a nuestras plataformas
    platforms = this.physics.add.staticGroup();
    //Creamos las plataformas del nivel
    platforms.create(480, 800, 'ground').setScale(20).refreshBody();

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
    //Añadimos las colisiones entre los jugadores y las plataformas
    this.physics.add.collider(players.player1, platforms);
    this.physics.add.collider(players.player2, platforms);

    //CAMARA:
    cam = this.cameras.main;
    this.physics.world.setBounds(-500, 0, 960 * 2, 1080 * 2);
    cam.setBounds(-500, 0, 960 * 2, 176);
    firstFollow = this.add.container(0,0);
    cam.startFollow(firstFollow, false, 0.05, 0.05);
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

function update ()
{
    //Si gameOver es true, acaba la partida.
    if (gameOver)
    {
        return;
    }
    players.update();
    firstFollow.x = Math.max(players.player1.x, players.player2.x);
}
