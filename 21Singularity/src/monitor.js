export default class Monitor {
    constructor(scene, posX, posY){
      this.sprite = scene.matter.add.sprite(posX, posY, 'blueButton', 0);
      this.sprite.setStatic(true).setSensor(true);
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android1.mainBody,
        objectB: this.sprite,
        callback: function() {console.log("pantalla tocada")},
        context: scene.android1
      });
      scene.matterCollision.addOnCollideStart({
        objectA: scene.android2.mainBody,
        objectB: this.sprite,
        callback: function() {console.log("pantalla dejada de tocar")},
        context: scene.android2
      });
    }
  }  