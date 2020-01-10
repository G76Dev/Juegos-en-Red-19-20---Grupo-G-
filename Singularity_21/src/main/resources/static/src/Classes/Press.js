//clase Press (apisonadora)
class Press {
  constructor(scene, posX, posY, sprt){
    //inicializacion del objeto, creando su sprite correspondiente
    this.sprite = scene.matter.add.image(posX, posY, sprt);
    this.sprite.setStatic(true).setIgnoreGravity(true).setDepth(-20);
    //variables necesarias
    this.scene = scene;
    //posicion inicial
    this.initialX = posX;
    this.initialY = posY;
  }
  //al ser un objeto Static, no puede hacer uso de velocidadY, por lo que esta se simula con el update (usando staticVelY)
  update(){
    this.sprite.y  += this.staticVelY;
  }
  //inicial su velocidad
  setStaticVelY(v){this.staticVelY = v}
  //metodo que inicia el ciclo de la apisonadora
  startCycle(n, del=0){
    this.sprite.setSensor(false)
    this.isReady = false;
      this.setStaticVelY(0);
      //evento añadido a escena que activa su callback despues de delay
      this.scene.time.addEvent({
        delay: del,
        callback: () => (delayedStart(this.scene, this))
      });
      //despues de un tiempo se activa
    function delayedStart(scene, obj){
      obj.isReady = true;
      //si n != 0 se inicial el descenso despues de 1000 steps
      if(n < 0 ||n > 0){
      obj.isReady = false;
        scene.time.addEvent({
          delay: 1000,
          callback: () => (initiateDescend(scene, obj))
        });
        //inicio del descenso
        function initiateDescend(scene, obj){
          //se inicializan las colisiones con ambos androides usando el plugin de colisiones
          const unsubscribe1 = scene.matterCollision.addOnCollideActive({
            objectA: scene.game.android1.mainBody,
            objectB: obj.sprite,
            callback: inflictDamage,
            context: scene.game.android1
          });
          const unsubscribe2 = scene.matterCollision.addOnCollideStart({
            objectA: scene.game.android2.mainBody,
            objectB: obj.sprite,
            callback: inflictDamage,
            context: scene.game.android2
          });
          //si cualquiera de los androides choca con Press se activa esta funcion que les daña
          function inflictDamage({ bodyA, bodyB, pair }){this.damaged(new Phaser.Math.Vector2(bodyA.gameObject.x-bodyB.gameObject.x, bodyA.gameObject.y-bodyB.gameObject.y), 90);}
          //velocidad del descenso
          obj.setStaticVelY(20);
          scene.time.addEvent({
            delay: 80,
            callback: () => (stop(scene, obj))
          });
          //Despues de 80 steps se para el descenso
          function stop(scene, obj){
            obj.setStaticVelY(0);
            scene.time.addEvent({
              delay: 500,
              callback: () => (initiateAsccend(scene, obj))
            });
            //Despues de 500 steps se inicia el ascenso
            function initiateAsccend(){
              //se quitan las colisionas dañinans con android1 / android2
              unsubscribe1();
              unsubscribe2();
              //velocidad de ascenso
              obj.setStaticVelY(-2.5);
              scene.time.addEvent({
                delay: 700,
                callback: () => (stop2(scene, obj))
              });
              //despues de 700 steps se para la apisonadora
              function stop2(){
                obj.sprite.setSensor(true)
                obj.setStaticVelY(0);
                //se reajusta su posicion
                obj.sprite.x = obj.initialX;
                obj.sprite.y = obj.initialY;
                //se vuelve a llamar a su metodo inicial con un delay de 200 steps pero con una n menor (hasta que n==0)
                scene.time.addEvent({
                  delay: 2000,
                  callback: () => (obj.startCycle(n-1, 0))
                });
              }
            }
          }
        }
      }
    }
  }
}
