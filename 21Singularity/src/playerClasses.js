//Objeto player, con la información de nuestros jugadores "player1 y player2"
class Player extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene.physics.world.enableBody(this,0);
    scene.add.existing(this);

    this.cursors;
    this.hasCoopImpul = false;
    this.alive = true;
    this.invulnerable = false;
    this.setCollideWorldBounds(true);
  }
  //update de player (se invoca en cada update de la clase Android Players (mas abajo))
  update(time, delta){
    if(this.alive){
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
  }
//funcion salto coop, comprueba si se puede hacer un salto coop con otro jugador OtherP
  coopJump(otherP) {
    if(this.alive){
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
}
//clase que junta los 2 jugadores (clase Player) e inicializa cosas que la propia clase Player no puede
class AndroidPlayers{
  static respawnTime = 100;
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
  //update de AndroidPlayers, se llama cada update de esena
  update(time, delta, scene){
    this.player1.update(time, delta);
    this.player2.update(time, delta);
    if (this.player1.cursors.coop.isDown && !(this.player1.body.touching.down)) {
       this.player1.coopJump(this.player2);
     }
     if (this.player2.cursors.coop.isDown && !(this.player2.body.touching.down)) {
        this.player2.coopJump(this.player1);
    }

    if(this.player1.y > 600){
      this.damaged(scene,delta, this.player1, this.player2);
    }
    if(this.player2.y > 600){
      this.damaged(scene,delta, this.player2, this.player1);
    }
    //document.getElementById('info').innerHTML = this.player1.depth;
  }
  //funcion que se invoca si un jugador recibe daño
  damaged(scene, delta, damagedPlayer, otherPlayer){
    if(!damagedPlayer.invulnerable){
      if(otherPlayer.alive){
        if(vidas > 0 && damagedPlayer.alive){
          damagedPlayer.alive = false;
          vidas--;
          damagedPlayer.visible = false;
          scene.time.delayedCall(AndroidPlayers.respawnTime * delta, this.respawn, [scene, damagedPlayer, otherPlayer]);
        }else if(vidas <= 0){
          gameOver = true;
        }
      }else{
        gameOver = true;
      }
    }
  }
  //al recibir daño, el jugador correspondiente muere y se llama esta funcion
  respawn(scene, playerToRespawn, otherPlayer){
    playerToRespawn.depth = 0;
    otherPlayer.depth = 0;
    playerToRespawn.setVelocityY(0);
    playerToRespawn.setVelocityX(0);
    playerToRespawn.x = otherPlayer.x;
    playerToRespawn.y = otherPlayer.y;
    playerToRespawn.depth++;

    playerToRespawn.invulnerable = true;
    playerToRespawn.visible = true;
    scene.tweens.add({
        targets: playerToRespawn,
        alpha: 0.5,
        ease: 'Cubic.easeOut',
        duration: 125,
        repeat: 6,
        yoyo: true
      })
    playerToRespawn.alive = true;
    scene.time.delayedCall(6*125, function(){playerToRespawn.invulnerable = false;}, playerToRespawn);
  }
}
