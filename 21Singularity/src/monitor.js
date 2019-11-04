export default class Monitor {
    constructor(scene, posX, posY){
      this.sprite = scene.matter.add.sprite(posX, posY, 'blueButton', 0);
      this.sprite.setStatic(true).setSensor(true);
      this.container = scene.matter.add.sprite(posX, posY, 'generic', 0);
      this.container.setStatic(true).setSensor(true).setVisible(false);
      const containerTopLeft = this.container.getTopLeft();
      this.message = scene.add.text(containerTopLeft.x, containerTopLeft.y, 'Hello World', { fontSize: '32px', fill: '#000' });
      this.message.setVisible(false);
      scene.matterCollision.addOnCollideActive({
        objectA: scene.android1.mainBody,
        objectB: this.sprite,
        callback: this.showContainer,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android1.mainBody,
        objectB: this.sprite,
        callback: this.hideContainer,
        context: this
      });
      scene.matterCollision.addOnCollideActive({
        objectA: scene.android2.mainBody,
        objectB: this.sprite,
        callback: this.showContainer,
        context: this
      });
      scene.matterCollision.addOnCollideEnd({
        objectA: scene.android2.mainBody,
        objectB: this.sprite,
        callback: this.hideContainer,
        context: this
      });
    }
    showContainer(){
      this.container.setVisible(true);
      this.message.setVisible(true);
    }
    hideContainer(){
      this.container.setVisible(false);
      this.message.setVisible(false);
    }
  }
