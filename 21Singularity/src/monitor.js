export default class Monitor {
    constructor(scene, posX, posY, txt){
      this.sprite = scene.matter.add.image(posX, posY, 'monitor', 0);
      this.sprite.setStatic(true).setSensor(true).setDepth(-1);
      this.container = scene.add.image(posX, posY - 56, 'textbox');
      this.container.setVisible(false).setDepth(1);
      const containerTopLeft = this.container.getTopLeft();
      this.message = scene.add.text(containerTopLeft.x + 8, containerTopLeft.y + 8, txt, { fontSize: '24px', fill: '#FF9E37', fontFamily: 'Consolas'});
      this.message.setStroke('#000000', 2);
      this.message.setVisible(false).setDepth(1);;
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
    showContainer(){
      this.container.setVisible(true);
      this.message.setVisible(true);
    }
    hideContainer(){
      this.container.setVisible(false);
      this.message.setVisible(false);
    }
  }
