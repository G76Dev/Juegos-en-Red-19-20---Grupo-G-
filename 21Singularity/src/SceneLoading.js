var isLoading = true;
export default class SceneLoading extends Phaser.Scene {
    constructor(){
      super("sceneLoading");
    }
    preload() {
        //Cargamos elementos de la interfaz
        this.load.image('interfazBg', 'assets/Interfaz/BG.png');
        this.load.image('interfazTitle', 'assets/Interfaz/Title.png');
        this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');
        this.load.image('text_click', 'assets/Interfaz/ClickToStart.png')

        //Cargamos los textos del menú
        this.load.image('text_online', 'assets/Interfaz/Text_Online.png');
        this.load.image('text_local', 'assets/Interfaz/Text_Local.png');
        this.load.image('text_options', 'assets/Interfaz/Text_Options.png');
        this.load.image('text_credits', 'assets/Interfaz/Text_Credits.png');

        //Cargamos el sprite de la luz
        this.load.image('light', 'assets/Interfaz/Light.png');

        //Cargamos los sonidos y la música
        this.load.audio('menuHover', 'assets/Audio/Sounds/Menu/MenuHover.wav');
        this.load.audio('menuSelected', 'assets/Audio/Sounds/Menu/MenuSelected.wav');
        this.load.audio('menuMusic', 'assets/Audio/Music/MenuMusic.wav');
        
        let background = this.add.graphics({
            fillStyle: {
                color: 0x404040
            }
        });
        background.fillRect(0, 0, this.game.renderer.width, this.game.renderer.height);
        
        let loadingBar = this.add.graphics({
            lineStyle: {
                width: 3,
                color: 0x996600
            },
            fillStyle: {
                color: 0xffff00
            }
        });

        let loadingText = this.make.text({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 - 20,
            text: 'Please wait...',
            style: {
                font: '18px Monaco',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 + 10,
            text: '0%',
            style: {
                font: '14px Impact',
                fill: '#000000'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: this.game.renderer.width / 2,
            y: this.game.renderer.height / 2 + 40,
            text: '',
            style: {
                font: '18px Monaco',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', (percent)=>{
            loadingBar.clear();
            percentText.setText(parseInt(percent * 100) + '%');
            
            loadingBar.fillRect(this.game.renderer.width / 2 - this.game.renderer.width / 8,
                this.game.renderer.height / 2,
                this.game.renderer.width * percent / 4,
                20);
            loadingBar.strokeRect(this.game.renderer.width / 2 - this.game.renderer.width / 8,
                this.game.renderer.height / 2,
                this.game.renderer.width / 4,
                20);
        })

        this.load.on('fileprogress', (file)=>{
            assetText.setText('Loading: ' + file.key);
        })
        this.load.on('complete', ()=>{
            isLoading = false;
            loadingText.setText('Click anywhere to start');
            assetText.setText('Load complete.');
        })
        
    }
    create() {
        this.sound.pauseOnBlur = false;
        this.input.on('pointerdown', function () {
            if (!isLoading) {
                this.scene.sound.play('menuMusic', {loop: true});
                this.scene.scene.start('menu');
            }
        });
    }
}