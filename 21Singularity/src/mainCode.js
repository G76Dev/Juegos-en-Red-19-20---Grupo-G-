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
            gravity: { y: 600 },
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

      //escala del objeto al ser lanzado en el escenario y su rebote
      this.scaleImage = scaleImage;
      this.bounce = bounce;

      //comandos para hacer que esta imagen dentro de la barra de tareas sea arrastrable (por esto hereda de Image)
      this.setScale(scaleIntrefaceImage);
      this.setInteractive();
      scene.input.setDraggable(this);
  }
  //metodo para crear un objeto al soltar el ratón y dejar de arrastrar
  dropItemInGame() {
    this.bombInstance = this.scene.physics.add.sprite(this.x, this.y, this.sprite);
    this.bombInstance.setScale(this.scaleImage);
    this.bombInstance.setCollideWorldBounds(true);
    this.scene.physics.add.collider(this.bombInstance, platforms);
    this.bombInstance.setBounce(this.bounce);

    return this.bombInstance; //devuelve la instancia creada
  }
}

//LISTA DE ITEMS ARRASTRABLES (heredan de draggableObject):
class draggableBomb extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item1', 'item1', frame, scaleIntrefaceImage, scaleImage, bounce);
  }
}

class draggableRect extends draggableObject{
  constructor(scene, x, y, frame, scaleIntrefaceImage = 0.25, scaleImage = 0.25, bounce = 0.25) {
      super(scene, x, y, 'item2', 'item2', frame, scaleIntrefaceImage, scaleImage, bounce);
  }
}


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
//Objeto player, con la información de nuestros jugadores "player1 y player2"
function Player() {
    this.cursors;
    this.canCoop;
}

//Función saltoCoop para comprobar si pueden ejecutar el salto cooperativo
function saltoCoop(thisP, otherP) {
    if ((otherP.x > (thisP.x - 16)) && (otherP.x < (thisP.x + 16)))
    {
        if((otherP.y < thisP.y) && (otherP.y > (thisP.y - 24)))
        {
            thisP.canCoop = true;
        } else {
            thisP.canCoop = false;
        }
    }
}

//se inicializan los 2 jugadores
var player1 = new Player();
var player2 = new Player();
//Declaramos nuestro juego
var game = new Phaser.Game(config);
//Función preload, que carga elementos antes de iniciar el juego
function preload ()
{
    this.load.image('generic', 'assets/virtual.png');

    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

    //cambiar por imagenes de la barra de objetos
    this.load.image('item1', 'assets/bomb.png');
    this.load.image('item2', 'assets/selector.png');
    this.load.image('item3', 'assets/bomb.png');
    this.load.image('item4', 'assets/bomb.png');
    this.load.image('item5', 'assets/bomb.png');

}
//Función create, que crea los elementos del propio juego
function create ()
{
    //instancia de barra de objetos
    var usableItems = new itemBar(this,900,100,50);

    //Añadimos el background
    //this.add.image(480, 270, 'bg');
    //Añadimos físicas estáticas a nuestras plataformas
    platforms = this.physics.add.staticGroup();
    //Creamos las plataformas del nivel
    platforms.create(480, 540, 'ground').setScale(2.4).refreshBody();
    //Añadimos sprite y físicas a los jugadores
    player1 = this.physics.add.sprite(100, 450, 'dude');
    player2 = this.physics.add.sprite(200, 450, 'dude');
    player1.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);
    //Colores provisionales para distinguir los personajes
    player1.setTint(0xff0000);
    player2.setTint(0x0000ff);
    //Inputs de los jugadores
    player1.cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'coop': Phaser.Input.Keyboard.KeyCodes.R } );
    player2.cursors = this.input.keyboard.addKeys( { 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down': Phaser.Input.Keyboard.KeyCodes.DOWN, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'coop': Phaser.Input.Keyboard.KeyCodes.L } );
    //Establecemos canCoop a false
    player1.canCoop = false;
    player2.canCoop = false;
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
    this.physics.add.collider(player1, platforms);
    this.physics.add.collider(player2, platforms);


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
3
function update ()
{
    //Si gameOver es true, acaba la partida.
    if (gameOver)
    {
        return;
    }
    //Comprobamos si pueden saltar cooperativamente
    saltoCoop(player1, player2);
    saltoCoop(player2, player1);
    //Jugador 1
    if (player1.cursors.left.isDown)
    {
        player1.setVelocityX(-160);
        player1.anims.play('wLeft', true);
    }
    else if (player1.cursors.right.isDown)
    {
        player1.setVelocityX(160);
        player1.anims.play('wRight', true);
    }
    else
    {
        player1.setVelocityX(0);
        player1.anims.play('idle');
    }
    if (player1.cursors.up.isDown && player1.body.touching.down)
    {
        player1.setVelocityY(-330);
    } else if (player1.cursors.coop.isDown && !(player1.body.touching.down)) {
        if(player1.canCoop) {
            player2.setVelocityY(-330);
        }
    }
    //Jugador 2
    if (player2.cursors.left.isDown)
    {
        player2.setVelocityX(-160);
        player2.anims.play('wLeft', true);
    }
    else if (player2.cursors.right.isDown)
    {
        player2.setVelocityX(160);
        player2.anims.play('wRight', true);
    }
    else
    {
        player2.setVelocityX(0);
        player2.anims.play('idle');
    }
    if (player2.cursors.up.isDown && player2.body.touching.down)
    {
        player2.setVelocityY(-330);
    } else if (player2.cursors.coop.isDown && !(player2.body.touching.down)) {
        if(player2.canCoop) {
            player1.setVelocityY(-330);
        }
    }
}
