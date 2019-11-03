export default class AudioManager{
    constructor(scene) {
        this.scene = scene;
        this.menuHover;
        this.menuSelected;
        this.menuMusic;
    }
    preload(){
        this.scene.load.audio('menuHover', 'assets/Audio/Sounds/Menu/MenuHover.wav');
        this.scene.load.audio('menuSelected', 'assets/Audio/Sounds/Menu/MenuSelected.wav');
        this.scene.load.audio('menuMusic', 'assets/Audio/Music/MenuMusic.wav');
    }
    create() {
        this.menuHover = this.scene.sound.add('menuHover');
        this.menuSelected = this.scene.sound.add('menuSelected');
        this.menuMusic = this.scene.sound.add('menuMusic');
    }
    PlayMenuHover() {
        this.menuHover.play();
    }
    PlayMenuSelected() {
        this.menuSelected.play();
    }
    PlayMenuMusic() {
        this.menuMusic.play({loop: true});
    }
}