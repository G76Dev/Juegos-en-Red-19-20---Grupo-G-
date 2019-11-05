var isLoading = true;
export default class SceneLoading extends Phaser.Scene {
    constructor() {
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

        //imagenes fondo TILED
        this.load.image("tiles1", "../assets/Tilesets/tileset_industrial.png");
        this.load.tilemapTiledJSON("map1", "../assets/Mapas/Industrial_Easy.json");

        this.load.image("tiles2", "../assets/Tilesets/Tileset_central_electrica.png");
        this.load.tilemapTiledJSON("map2", "../assets/Mapas/Electrical_medium.json");

        this.load.image('generic', 'assets/Test/virtual.png');

        this.load.image('ground', 'assets/Test/platform.png');
        this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion', 'assets/Sprites/Explosions/explosion-6.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('laser', 'assets/Sprites/laser/laser.png', { frameWidth: 1950, frameHeight: 450 });

        this.load.spritesheet('androidRun1', 'assets/Sprites/Androids/male_android_running.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidIdle1', 'assets/Sprites/Androids/male_android_idle.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidJumpUp1', 'assets/Sprites/Androids/male_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidJumpDown1', 'assets/Sprites/Androids/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopJumpUp1', 'assets/Sprites/Androids/male_android_jumping_up_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopJumpDown1', 'assets/Sprites/Androids/male_android_jumping_down_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopIdle1', 'assets/Sprites/Androids/male_android_idle_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopRun1', 'assets/Sprites/Androids/male_android_running_coop.png', { frameWidth: 32, frameHeight: 64 });

        this.load.spritesheet('androidRun2', 'assets/Sprites/Androids/female_android_running.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidIdle2', 'assets/Sprites/Androids/female_android_idle.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidJumpUp2', 'assets/Sprites/Androids/female_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('androidJumpDown2', 'assets/Sprites/Androids/female_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

        this.load.image('deathHead1', "assets/Sprites/Androids/cabeza.png");
        this.load.image('deathFootR1', "assets/Sprites/Androids/pieDer.png");
        this.load.image('deathFootL1', "assets/Sprites/Androids/pieIzq.png");
        this.load.image('deathBodyL1', "assets/Sprites/Androids/cuerpoIzq.png");
        this.load.image('deathBodyR1', "assets/Sprites/Androids/CuerpoDer.png");
        this.load.image('deathLegs1', "assets/Sprites/Androids/piernas.png");

        this.load.image('deathHead2', "assets/Sprites/Androids/cabeza2.png");
        this.load.image('deathFootR2', "assets/Sprites/Androids/pieDer2.png");
        this.load.image('deathFootL2', "assets/Sprites/Androids/pieIzq2.png");
        this.load.image('deathBodyL2', "assets/Sprites/Androids/cuerpoIzq2.png");
        this.load.image('deathBodyR2', "assets/Sprites/Androids/CuerpoDer2.png");
        this.load.image('deathLegs2', "assets/Sprites/Androids/piernas2.png");

        //cambiar por imagenes de la barra de objetos
        this.load.image('item_bar', 'assets/Interfaz/InGame/item_bar.png');
        this.load.image('item1', 'assets/Sprites/Bomb/Bomb1.png');
        this.load.image('item2', 'assets/Test/selector.png');
        this.load.image('item3', 'assets/Sprites/pinchos/spike.png');
        this.load.image('spikeBox', 'assets/Sprites/pinchos/SPIKE_in_a_box.png');
        this.load.image('item4', 'assets/Test/bomb.png');
        this.load.image('item5', 'assets/Test/bomb.png');

        this.load.image('bar', 'assets/Test/Barra.png');

        this.load.image('bg_i', 'assets/Backgrounds/Industrial/Industrialbg.png');
        this.load.image('bg1_i', 'assets/Backgrounds/Industrial/IndustrialFar.png');
        this.load.image('bg2_i', 'assets/Backgrounds/Industrial/IndustrialMid.png');
        this.load.image('bg3_i', 'assets/Backgrounds/Industrial/IndustrialClose.png');

        this.load.image('bg_e', 'assets/Backgrounds/Sky/SkyBG.png');
        this.load.image('bg1_e', 'assets/Backgrounds/Sky/CloudsFar.png');
        this.load.image('bg2_e', 'assets/Backgrounds/Sky/CloudsMid.png');
        this.load.image('bg3_e', 'assets/Backgrounds/Sky/CloudsClose.png');

        this.load.spritesheet('blueRay', 'assets/Sprites/Rays/Blue_Ray_ss.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('orangeRay', 'assets/Sprites/Rays/Orange_Ray_ss.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('orangeDoor', 'assets/Sprites/Doors/Door_orange.png');

        this.load.spritesheet('rBlade', 'assets/Sprites/rotating_blade.png', { frameWidth: 64, frameHeight: 64 });

        this.load.spritesheet('orangeButton', 'assets/Sprites/Buttons/orange_button.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('blueButton', 'assets/Sprites/Buttons/blue_button.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('life', 'assets/Sprites/life.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('conveyer1', 'assets/Sprites/Conveyers/conveyer_1.png', { frameWidth: 952, frameHeight: 20 });
        this.load.spritesheet('conveyer3', 'assets/Sprites/Conveyers/conveyer_3.png', { frameWidth: 408, frameHeight: 20 });

        this.load.image('elevator', 'assets/Sprites/elevator.png');
        this.load.image('blue_fp', 'assets/Sprites/Falling_platforms/blue_fp.png');
        this.load.spritesheet('fire_fp', 'assets/Sprites/Falling_platforms/fire_fp.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('moving_platform', 'assets/Sprites/Falling_platforms/moving_platform.png', { frameWidth: 96, frameHeight: 16 });
        this.load.image('pressI', 'assets/Sprites/human_press.png');
        this.load.image('pressNI', 'assets/Sprites/ni_press.png');

        this.load.image('monitor', 'assets/Sprites/monitor.png');

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

        this.load.on('progress', (percent) => {
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

        this.load.on('fileprogress', (file) => {
            assetText.setText('Loading: ' + file.key);
        })
        this.load.on('complete', () => {
            isLoading = false;
            loadingText.setText('Click anywhere to start');
            assetText.setText('Load complete.');
        })

    }
    create() {
        //Creamos las animaciones de los personajes: idle, wRight
        this.anims.create({
            key: 'wRight1',
            frames: this.anims.generateFrameNumbers('androidRun1', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle1',
            frames: this.anims.generateFrameNumbers('androidIdle1', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpUp1',
            frames: this.anims.generateFrameNumbers('androidJumpUp1', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpDown1',
            frames: this.anims.generateFrameNumbers('androidJumpDown1', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'coopjumpUp1',
            frames: this.anims.generateFrameNumbers('coopJumpUp1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopjumpDown1',
            frames: this.anims.generateFrameNumbers('coopJumpDown1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopidle1',
            frames: this.anims.generateFrameNumbers('coopIdle1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopwRight1',
            frames: this.anims.generateFrameNumbers('coopRun1', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wRight2',
            frames: this.anims.generateFrameNumbers('androidRun2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle2',
            frames: this.anims.generateFrameNumbers('androidIdle2', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpUp2',
            frames: this.anims.generateFrameNumbers('androidJumpUp2', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'jumpDown2',
            frames: this.anims.generateFrameNumbers('androidJumpDown2', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
        this.anims.create({
            key: 'coopjumpUp2',
            frames: this.anims.generateFrameNumbers('coopJumpUp1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopjumpDown2',
            frames: this.anims.generateFrameNumbers('coopJumpDown1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopidle2',
            frames: this.anims.generateFrameNumbers('coopIdle1', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopwRight2',
            frames: this.anims.generateFrameNumbers('coopRun1', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'eBomb',
            frames: this.anims.generateFrameNumbers('explodingBomb', { start: 0, end: 13 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'exprosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'laserSprite',
            frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 1 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'blueRayS',
            frames: this.anims.generateFrameNumbers('blueRay', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'orangeRayS',
            frames: this.anims.generateFrameNumbers('orangeRay', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'rotatingBlade',
            frames: this.anims.generateFrameNumbers('rBlade', { start: 0, end: 4 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'lifeS',
            frames: this.anims.generateFrameNumbers('life', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'conveyer1S',
            frames: this.anims.generateFrameNumbers('conveyer1', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'conveyer3S',
            frames: this.anims.generateFrameNumbers('conveyer3', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'fire_fpS',
            frames: this.anims.generateFrameNumbers('fire_fp', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'moving_platformS',
            frames: this.anims.generateFrameNumbers('moving_platform', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        

        this.sound.pauseOnBlur = false;
        this.input.on('pointerdown', function () {
            if (!isLoading) {
                this.scene.sound.play('menuMusic', { loop: true });
                this.scene.scene.start('menu');
            }
        });
    }
}