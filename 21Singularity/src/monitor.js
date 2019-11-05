export default class Monitor {
    constructor(scene, posX, posY, txt){
      this.sprite = scene.matter.add.image(posX, posY, 'monitor', 0);
      this.sprite.setStatic(true).setSensor(true).setDepth(-1);
      this.container = scene.add.image(posX, posY, 'generic');
      this.container.setVisible(false).setDepth(-1);
      const containerTopLeft = this.container.getTopLeft();
      this.message = scene.add.text(containerTopLeft.x, containerTopLeft.y, txt, { fontSize: '32px', fill: '#000' });
      this.message.setVisible(false).setDepth(-1);;
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
