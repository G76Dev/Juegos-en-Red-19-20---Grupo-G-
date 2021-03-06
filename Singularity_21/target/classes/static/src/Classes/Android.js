class Android {
  constructor(scene, androidNumber, x, y, playerINPUT, cursors) {
	  //constructor y variables de android
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, 'androidIdle' + androidNumber, 0);
    this.androidNumber = androidNumber;
    
    this.playerINPUT = playerINPUT;
    this.playerMovementArray = [false, false, false, 0.0, 0.0, x, y, false];
    this.setWSMoovement = function(pMA){
    	this.playerMovementArray = pMA;
    }
    
    this.otherAndroid;
    this.arrived = false;

    this.leftMultiply = 1;
    this.rightMultiply = 1;
    this.velInfluence = 0;

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    this.mainBody = Bodies.rectangle(0, 6, w * 0.75, h * 0.8, { chamfer: { radius: 5 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, 36, w * 0.6, 8, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 6, 5, h * 0.6, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 6, 5, h * 0.6, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionAir: 0.01
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .setOrigin(0.5, 0.55)
      .body.collisionFilter.group = -1;

    this.cursors = cursors;

    this.scene.events.on("update", this.update, this);

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.canCoopImpulse = true;
    this.coopTimer = null;

    this.isCoopImpulsing = false;

  //modificado para WS
   if(this.playerINPUT){
	   this.aditionalJumpVelocity = -0.25;
	   this.cursors.up.on('down', function (event) {
	     if (this.canJump && this.isTouching.ground) {
		   
	       this.aditionalJumpVelocity = -0.25;
	       this.sprite.setVelocityY(-this.scene.game.jumpVelocity);
	       var jumpSound = this.scene.sound.add('jump', {volume: this.scene.game.soundVolume});
	       jumpSound.play();
	       this.canJump = false;
	       this.cursors.up.on('up', function (event) {
	    	 if (!this.canJump){
		         this.canJump = true
	    	 }
	       }, this);
	     }
	   }, this);
    
	   this.cursors.coop.on('down', function(event){
		 if(this.canCoopImpulse){
			//WS
			 if (game.online)
				 this.playerMovementArray[7] = true;
			 
		    this.isCoopImpulsing = true;
		    this.coopJump();
		 }
	   }, this);
    }
    scene.matter.world.on("beforeupdate", this.preupdateAndroid, this);
    

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

    //var
    this.invulnerable = false;
    this.alive = true;
    this.canDeathSpawn = true;

    this.deathStuff = [6]; this.deathStuff[0] = 'deathHead' + this.androidNumber; this.deathStuff[1] = 'deathLegs' + this.androidNumber; this.deathStuff[2] = 'deathBodyL' + this.androidNumber;
    this.deathStuff[3] = 'deathFootR' + this.androidNumber; this.deathStuff[4] = 'deathFootL' + this.androidNumber; this.deathStuff[5] = 'deathBodyR' + this.androidNumber;

    //icono indicador
    this.indicator = this.scene.add.image(-999, -999, "farHead" + this.androidNumber);

    scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      callback: this.soundFall,
      context: this
    });
  }
  

  preupdateAndroid() {
	  //funcion que se ejecuta antes de cada update, entre otras cosas modifica los valores recibidos por el websocket
  	//WS
	  if(this.playerINPUT){
		this.playerMovementArray[0] = this.cursors.up.isDown;   //UP
	  	this.playerMovementArray[1] = this.cursors.right.isDown;    //RIGHT
	  	this.playerMovementArray[2] = this.cursors.left.isDown;    //LEFT
	  	this.playerMovementArray[3] = this.sprite.body.velocity.x;    //X
	  	this.playerMovementArray[4] = this.sprite.body.velocity.y;    //Y
	  	this.playerMovementArray[5] = this.sprite.x;    //X
	  	this.playerMovementArray[6] = this.sprite.y;    //Y
	  }else{
		if(parseInt(this.androidNumber) == 1){
			this.playerMovementArray[0] = infoArray1[0];   //UP
		  	this.playerMovementArray[1] = infoArray1[1];    //RIGHT
		  	this.playerMovementArray[2] = infoArray1[2];    //LEFT
		  	this.playerMovementArray[7] = infoArray1[7];    //COOP
		  	
		}
		else if(parseInt(this.androidNumber) == 2){
			this.playerMovementArray[0] = infoArray2[0];   //UP
		  	this.playerMovementArray[1] = infoArray2[1];    //RIGHT
		  	this.playerMovementArray[2] = infoArray2[2];    //LEFT
		  	this.playerMovementArray[7] = infoArray2[7];    //COOP
		}
	  }
	  
  	  this.isTouching.left = false;
  	  this.isTouching.right = false;
  	  this.isTouching.ground = false;
  }
  
  soundFall(bodyB){
    if (bodyB.isSensor) return;
    var landSound = this.scene.sound.add('land', {volume: this.scene.game.soundVolume});
    landSound.play();
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
    if (bodyB.name == "interactableBody") return;
    if (bodyB.label == "Body" && bodyB.parent.gameObject.tile.properties.lethal) return;
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      this.rightMultiply = 0;
      if (pair.separation > 2) { this.sprite.x -= 0.1 }
    }
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      this.leftMultiply = 0;
      if (pair.separation > 2) { this.sprite.x += 0.1 }
    }
  }

  update(time, delta) {
	  //update, todas las fisicas y movimientos del android se calculan aqui
    const isInAir = !this.isTouching.ground;

    if (this.scene.game.lives <= 0) { return; }

    if (this.alive) {
    	if(this.playerINPUT){
	      if (this.playerMovementArray[1]) {
	        if (!(isInAir && this.isTouching.right)) {
	          if(this.playerINPUT) //WS improved
	          this.sprite.setVelocityX(this.scene.game.moveVelocity * delta * this.rightMultiply);
	        }
	      }
	      else if (this.playerMovementArray[2]) {
	        if (!(isInAir && this.isTouching.left)) {
	          if(this.playerINPUT) //WS improved
	          this.sprite.setVelocityX(-this.scene.game.moveVelocity * delta * this.leftMultiply);
	        }
	      } else if (this.playerMovementArray[1] && !this.playerMovementArray[2]){
	    	  this.sprite.setVelocityX(0);
	      }
	      //document.getElementById('info').innerHTML = this.sprite;
	      this.sprite.x += this.velInfluence;
	      this.playAnimation();
	
	      if (this.playerMovementArray[0] && !this.isTouching.ground && this.sprite.body.velocity.y < 0) {
	        this.sprite.setVelocityY(this.sprite.body.velocity.y + this.aditionalJumpVelocity);
	        if (this.aditionalJumpVelocity < 0) {
	          this.aditionalJumpVelocity += 0.01;
	        } else {
	          this.aditionalJumpVelocity = 0;
	        }
	      }
	
	      //BUGFIX
	      if (isInAir && !this.playerMovementArray[2] && !this.playerMovementArray[1]) {
	        if (this.sprite.body.velocity.y <= -this.scene.game.jumpVelocity * 0.90) {
	          this.sprite.setVelocityX(0);
	        } else {
	          if(this.playerINPUT) //WS improved
	          this.sprite.setVelocityX((this.scene.game.moveVelocity * this.scene.game.airVelocityFraction) * delta * Math.sign(this.sprite.body.velocity.x));
	        }
	      }
	
	      const cam = this.scene.cameras.main;
	      if (this.sprite.x < cam.scrollX) { this.indicator.x = 24 + cam.scrollX; this.indicator.y = this.sprite.y; }
	      else if (this.sprite.x > cam.scrollX + 960) { this.indicator.x = 936 + cam.scrollX; this.indicator.y = this.sprite.y; }
	      else { this.indicator.x = -999; this.indicator.y = -999; }
    	}
    	else{ //NO Player input WS
  	        this.sprite.x += this.velInfluence;
  	        this.playAnimation();
        	if(parseInt(this.androidNumber) == 1){
        		//prediccion de la posicion del jugador. Se añade la diferencia de posicion entre el android en local y la recibida por websockets (infoArray[5] y [6])ç
        		//a la velocidad, incrementándola según la diferencia resultando en un movimiento suave
        		this.sprite.setVelocityX(infoArray1[3] + infoArray1[5] - this.sprite.x);
        		this.sprite.setVelocityY(infoArray1[4] + infoArray1[6] - this.sprite.y);

        		if(this.playerMovementArray[7]){
        			 this.isCoopImpulsing = true;
    				 this.coopJump();
        			 this.playerMovementArray[7] = false;
        			 infoArray1[7] = false;
        		}
        	}else if(parseInt(this.androidNumber) == 2){
        		//prediccion de la posicion del jugador. Se añade la diferencia de posicion entre el android en local y la recibida por websockets (infoArray[5] y [6])ç
        		//a la velocidad, incrementándola según la diferencia resultando en un movimiento suave
        		this.sprite.setVelocityX(infoArray2[3] + infoArray2[5] - this.sprite.x);
        		this.sprite.setVelocityY(infoArray2[4] + infoArray2[6] - this.sprite.y);

        		if(this.playerMovementArray[7]){
	       			 this.isCoopImpulsing = true;
	   				 this.coopJump();
	       			 this.playerMovementArray[7] = false;
	       			 infoArray2[7] = false;
        		}
        	}
    	}
	    this.leftMultiply = 1;
	    this.rightMultiply = 1;
		
	    if (this.sprite.y > 640) {
	      this.damaged(new Phaser.Math.Vector2(0, -1), 40);
	    }
		
	    if (this.isTouching.ground && !this.canCoopImpulse) {
	      this.coopTimer = this.scene.time.addEvent({
	        delay: 250,
	        callback: () => (this.canCoopImpulse = true)
	      });
	    }
    }
  }
  playAnimation(){
	  //funcion que se ejecuta cada update, se encarga de las animaciones del androide
    if(this.sprite.anims.currentAnim == null || this.sprite.anims.currentAnim.key.substr(0,4) != "coop" ||
     (this.sprite.anims.currentAnim.key.substr(0,4) == "coop" && this.sprite.anims.currentFrame.index == this.sprite.anims.currentAnim.getLastFrame().index )){
      if(this.isTouching.ground){
        if(this.playerMovementArray[1]){
          this.sprite.anims.play('wRight'+this.androidNumber, true);
        }else if(this.playerMovementArray[2]){
          this.sprite.anims.play('wRight'+this.androidNumber, true);
        }else{
          this.sprite.anims.play('idle'+this.androidNumber, true);
        }
      }else{
        if(this.sprite.body.velocity.y < 0){
          this.sprite.anims.play('jumpUp'+this.androidNumber, true);
        }else if(this.sprite.body.velocity.y > 0){
          this.sprite.anims.play('jumpDown'+this.androidNumber, true);
        }
      }
    }
    if(this.isCoopImpulsing){
      if(this.sprite.anims.currentAnim.key == 'wRight' + this.androidNumber)
        this.sprite.play('coopwRight' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'jumpDown' + this.androidNumber)
        this.sprite.play('coopjumpDown' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'jumpUp' + this.androidNumber)
        this.sprite.play('coopjumpUp' + this.androidNumber,true);
      else if(this.sprite.anims.currentAnim.key == 'idle' + this.androidNumber)
        this.sprite.play('coopidle' + this.androidNumber,true);
      this.isCoopImpulsing = false;
    }

    if(this.playerMovementArray[1]){
      this.sprite.setFlipX(false);
    }else if(this.playerMovementArray[2]){
      this.sprite.setFlipX(true);
    }
  }
  coLink(otherA) {
    this.otherAndroid = otherA;
  }
  coopJump() {
	  //funcion de salto coop
    if (((this.otherAndroid.sprite.x > (this.sprite.x - 32)) && (this.otherAndroid.sprite.x < (this.sprite.x + 32))) &&
      ((this.otherAndroid.sprite.y < this.sprite.y + 48) && (this.otherAndroid.sprite.y > (this.sprite.y - 48)))) {
      if (this.canCoopImpulse && this.otherAndroid.canCoopImpulse) {
        this.otherAndroid.sprite.setVelocityY(-this.scene.game.jumpVelocity * 1.1);
        var coopJumpSound = this.scene.sound.add('coopJump', {volume: this.scene.game.soundVolume});
        coopJumpSound.play();
        this.canCoopImpulse = false;
      }
    }
  }
  //funcion de que hacer al recibir daño
  damaged(deathVector, deathSpread) {
    if (!this.invulnerable) {
      var dieSound = this.scene.sound.add('die', {volume: this.scene.game.soundVolume});
      dieSound.play();
      this.sprite.visible = false;
      this.sprite.setVelocityX(0);
      this.deathSpawn(deathVector, deathSpread);
      this.sprite.y = 900;
      if (this.otherAndroid.alive) {
        if (this.scene.game.lives > 0 && this.alive) {
          this.alive = false;
          this.scene.game.lives--;
          this.scene.lifesText.setText("" + this.scene.game.lives);
          this.scene.time.addEvent({
            delay: this.scene.game.respawnTime,
            callback: () => (this.respawn())
          });
        } else if (this.scene.game.lives <= 0) {
          this.alive = false;
          console.log("Game Over");
        }
      } else {
        this.scene.game.lives = 0;
        this.alive = false;
        console.log("Game Over");
      }
    }
  }
  //funciones de revivir una vez muerto el android
  respawn() {
    this.sprite.setDepth(1);
    this.otherAndroid.sprite.setDepth(0);
    this.sprite.setVelocityY(0);
    this.sprite.setVelocityX(0);
    this.sprite.x = this.otherAndroid.sprite.x;
    this.sprite.y = this.otherAndroid.sprite.y;

    this.invulnerable = true;
    this.sprite.visible = true;
    this.sprite.setActive(true);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      ease: 'Cubic.easeOut',
      duration: 150,
      repeat: 6,
      yoyo: true
    })
    this.alive = true;
    this.scene.time.addEvent({
      delay: 6 * 150,
      callback: () => (this.invulnerable = false)
    });
  }
  deathSpawn(deathVector, deathSpread) {
    if (this.canDeathSpawn) {
      this.canDeathSpawn = false;
      var remainVelocity = 8;
      const dirAngle = deathVector.angle() * (180 / Math.PI);
      var randomAng;
      var randomVec;
      for (var i = 0; i < this.deathStuff.length; i++) {
        var debree = this.scene.matter.add.image(this.sprite.x, this.sprite.y, this.deathStuff[i], 0, { isSensor: true });
        randomAng = Phaser.Math.Between(dirAngle - deathSpread, dirAngle + deathSpread) * (Math.PI / 180);
        randomVec = new Phaser.Math.Vector2(Math.cos(randomAng), Math.sin(randomAng));
        randomVec.normalize();
        randomVec.scale(remainVelocity);
        debree.setVelocity(randomVec.x, randomVec.y);
        //debree.setAngularVelocity(Math.random()/10-0.05);
        this.scene.time.addEvent({
          delay: 3000,
          callback: (destroyDebree),
          args: [debree]
        });
      }
      this.scene.time.addEvent({
        delay: this.scene.game.respawnTime - 50,
        callback: () => (this.canDeathSpawn = true)
      });
    }
    function destroyDebree(debree) { debree.destroy() }
  }
}
