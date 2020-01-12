//Clase Monitor, para instanciar monitores para el tutorial inGame.
class Monitor {
    constructor(scene, posX, posY, txt){
      //Generamos el sprite y lo hacemos estático y sensor.
      this.sprite = scene.matter.add.image(posX, posY, 'monitor', 0);
      this.sprite.setStatic(true).setSensor(true).setDepth(-1);
      //Generamos el contenedor del texto y lo hacemos invisible al iniciar.
      this.container = scene.add.image(posX, posY - 56, 'textbox');
      this.container.setVisible(false).setDepth(1);
      const containerTopLeft = this.container.getTopLeft();
      //Generamos el mensaje, lo hacemos visible y establecemos las propiedades del texto.
      this.message = scene.add.text(containerTopLeft.x + 8, containerTopLeft.y + 8, txt, { fontSize: '24px', fill: '#FF9E37', fontFamily: 'Consolas'});
      this.message.setStroke('#000000', 2);
      this.message.setVisible(false).setDepth(1);

      //Establecemos colisiones con los jugadores androide.
      scene.matterCollision.addOnCollideActive({
        objectA: scene.game.android1.mainBody,
        objectB: this.sprite,
        callback: this.showContainer,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android1.mainBody,
        objectB: this.sprite,
        callback: this.hideContainer,
        context: this
      });
      scene.matterCollision.addOnCollideActive({
        objectA: scene.game.android2.mainBody,
        objectB: this.sprite,
        callback: this.showContainer,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.game.android2.mainBody,
        objectB: this.sprite,
        callback: this.hideContainer,
        context: this
      });
    }
    //Función showContainer, que muestra el mensaje del tutorial.
    showContainer(){
      this.container.setVisible(true);
      this.message.setVisible(true);
    }
    //Función hideContainer, que esconde el mensaje del tutorial.
    hideContainer(){
      this.container.setVisible(false);
      this.message.setVisible(false);
    }
  }
