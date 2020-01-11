var isLoading = true; // Variable que detecta si se estan cargando assets aun o no.
var isFading = false;
// Clase correspondiente a la escena de carga.
class SceneLoading extends Phaser.Scene {
    // Constructor de la escena.
    constructor() {
        super("sceneLoading");
    }

    // Funcion preload que carga los assets.
    preload() {

        // Cargamos elementos de la interfaz.
        this.load.image('interfazBg', 'assets/Interfaz/BG.png');
        this.load.image('interfazTitle', 'assets/Interfaz/Title.png');
        this.load.image('interfazBs', 'assets/Interfaz/BlackScreen.png');
        this.load.image('text_click', 'assets/Interfaz/ClickToStart.png');

        this.load.image('menuTutorial', 'assets/Interfaz/TutorialScreen.png');
        this.load.image('menuTutorial2', 'assets/Interfaz/TutorialScreen2.png');
        this.load.image('text_onlineMode', 'assets/Interfaz/Text_OnlineMode.png');
        this.load.image('text_creditsScreen', 'assets/Interfaz/Text_CreditsScreen.png');
        this.load.image('options', 'assets/Interfaz/Options.png');
        this.load.image('sliderObject', 'assets/Interfaz/SliderObject.png');
        this.load.image('textVictory', 'assets/Interfaz/Text_Victory.png');
        this.load.image('textDefeat', 'assets/Interfaz/Text_Defeat.png');
        this.load.image('text_nextPage', 'assets/Interfaz/Text_NextPage.png')
        this.load.image('light', 'assets/Interfaz/Light.png');
        this.load.image('X', 'assets/Interfaz/X.png');
        this.load.image('logo', 'assets/Interfaz/LogoNanaTeam_pixelart.png');

        this.load.image('3', 'assets/Interfaz/OnlineMode/3.png');
        this.load.image('2', 'assets/Interfaz/OnlineMode/2.png');
        this.load.image('1', 'assets/Interfaz/OnlineMode/1.png');
        this.load.image('serverFull', 'assets/Interfaz/OnlineMode/ServerFull.png');
        this.load.image('connectionFailed', 'assets/Interfaz/OnlineMode/ConnectionFailed.png');
        this.load.image('humanLeave', 'assets/Interfaz/OnlineMode/Hover_leave_large.png');
        this.load.image('androidLeave', 'assets/Interfaz/OnlineMode/Hover_leave_small.png');
        this.load.image('text_enterYourName', 'assets/Interfaz/OnlineMode/EnterYourName.png');
        this.load.image('text_startingGame', 'assets/Interfaz/OnlineMode/StartingGame.png');
        this.load.image('text_vs', 'assets/Interfaz/OnlineMode/VS.png');
        this.load.image('text_waitingForPlayers', 'assets/Interfaz/OnlineMode/WaitingForPlayers.png');
        this.load.image('text_joinGame', 'assets/Interfaz/OnlineMode/Text_JoinGame.png');
        this.load.image('startingGame', 'assets/Interfaz/OnlineMode/StartingGame.png');
        this.load.image('ready', 'assets/Interfaz/OnlineMode/Ready.png');
        this.load.spritesheet('textBox', 'assets/Interfaz/OnlineMode/TextBox.png', { frameWidth: 400, frameHeight: 63, startFrame: 0, endFrame: 5 });
        this.load.spritesheet('androidSelectionBox', 'assets/Interfaz/OnlineMode/selection_box_small.png', { frameWidth: 127, frameHeight: 172, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('humanSelectionBox', 'assets/Interfaz/OnlineMode/selection_box_large.png', { frameWidth: 167, frameHeight: 305, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('androidMale', 'assets/Interfaz/OnlineMode/android_male.png', { frameWidth: 50, frameHeight: 116, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('androidFemale', 'assets/Interfaz/OnlineMode/android_female.png', { frameWidth: 46, frameHeight: 108, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('androidMaleActive', 'assets/Interfaz/OnlineMode/android_male_active.png', { frameWidth: 64, frameHeight: 128, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('androidFemaleActive', 'assets/Interfaz/OnlineMode/android_female_active.png', { frameWidth: 64, frameHeight: 128, startFrame: 0, endFrame: 3 });
        this.load.spritesheet('human', 'assets/Interfaz/OnlineMode/human.png', { frameWidth: 97, frameHeight: 239, startFrame: 0, endFrame: 1 });
        this.load.spritesheet('humanActive', 'assets/Interfaz/OnlineMode/human_active.png', { frameWidth: 97, frameHeight: 239, startFrame: 0, endFrame: 1 });

        this.load.image('text_online', 'assets/Interfaz/Text_Online.png');
        this.load.image('text_local', 'assets/Interfaz/Text_Local.png');
        this.load.image('text_options', 'assets/Interfaz/Text_Options.png');
        this.load.image('text_credits', 'assets/Interfaz/Text_Credits.png');
        this.load.image('text_tutorial', 'assets/Interfaz/Text_Tutorial.png');
        this.load.image('text_back', 'assets/Interfaz/Text_Back.png');
        this.load.image('text_tryAgain', 'assets/Interfaz/Text_TryAgain.png');
        this.load.image('text_goToMenu', 'assets/Interfaz/Text_GoToMenu.png');

        // Cargamos los sonidos y la musica.
        this.load.audio('menuHover', 'assets/Audio/Sounds/Menu/MenuHover.wav');
        this.load.audio('menuSelected', 'assets/Audio/Sounds/Menu/MenuSelected.wav');
        this.load.audio('land', 'assets/Audio/Sounds/Land.wav');
        this.load.audio('jump', 'assets/Audio/Sounds/Jump.wav');
        this.load.audio('coopJump', 'assets/Audio/Sounds/CoopJump.wav');
        this.load.audio('laser', 'assets/Audio/Sounds/Laser.wav');
        this.load.audio('bomb', 'assets/Audio/Sounds/Bomb.wav');
        this.load.audio('die', 'assets/Audio/Sounds/Die.wav');
        this.load.audio('menuMusic', 'assets/Audio/Music/MenuMusic.wav');
        this.load.audio('theme', 'assets/Audio/Music/Theme.wav');
        this.load.audio('theme2', 'assets/Audio/Music/Theme2.wav');

        // Cargamos los elementos correspondientes a Tiled.
        this.load.image("tiles1", "../assets/Tilesets/tileset_industrial.png");
        this.load.tilemapTiledJSON("map1", "../assets/Mapas/Industrial_Easy.json");

        this.load.image("tiles2", "../assets/Tilesets/Tileset_central_electrica.png");
        this.load.tilemapTiledJSON("map2", "../assets/Mapas/Electrical_medium.json");

        // Cargamos sprites de los distintos elementos del juego.
        this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('explosion', 'assets/Sprites/Explosions/explosion-6.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('laserNonLethal', 'assets/Sprites/laser/laser_nonletal.png', { frameWidth: 960, frameHeight: 32 }); //62
        this.load.spritesheet('laserLethal', 'assets/Sprites/laser/laser_letal.png', { frameWidth: 960, frameHeight: 32 }); //42*/
        this.load.image('laser_icon', 'assets/Sprites/laser/laser_icon.png');

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

        this.load.spritesheet('coopJumpUp2', 'assets/Sprites/Androids/female_android_jumping_up_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopJumpDown2', 'assets/Sprites/Androids/female_android_jumping_down_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopIdle2', 'assets/Sprites/Androids/female_android_idle_coop.png', { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet('coopRun2', 'assets/Sprites/Androids/female_android_running_coop.png', { frameWidth: 32, frameHeight: 64 });

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

        this.load.image('farHead1', "assets/Sprites/Androids/angry_android1.png");
        this.load.image('farHead2', "assets/Sprites/Androids/angry_android2.png");

        this.load.image('bar', 'assets/Interfaz/InGame/energy_bar.png');
        this.load.image('item_bar', 'assets/Interfaz/InGame/item_energy_bar.png');
        this.load.image('item1', 'assets/Sprites/Bomb/Bomb1.png');
        this.load.image('item3', 'assets/Sprites/pinchos/spike.png');
        this.load.image('spikeBox', 'assets/Sprites/pinchos/SPIKE_in_a_box.png');

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

        this.load.image('orangeDoor1', 'assets/Sprites/Doors/Door_orange.png');
        this.load.image('orangeDoor2', 'assets/Sprites/Doors/Door2_orange.png');

        this.load.spritesheet('rBlade', 'assets/Sprites/rotating_blade.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('rBigBlade', 'assets/Sprites/BIG_rotating_blade.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('orangeButton', 'assets/Sprites/Buttons/orange_button.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('blueButton', 'assets/Sprites/Buttons/blue_button.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('orangeLever', 'assets/Sprites/Buttons/orange_lever.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('blueLever', 'assets/Sprites/Buttons/blue_lever.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('life', 'assets/Sprites/life.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('conveyer1', 'assets/Sprites/Conveyers/conveyer_1.png', { frameWidth: 952, frameHeight: 20 });
        this.load.spritesheet('conveyer3', 'assets/Sprites/Conveyers/conveyer_3.png', { frameWidth: 408, frameHeight: 20 });

        this.load.image('elevator1', 'assets/Sprites/elevator.png');
        this.load.image('elevator2', 'assets/Sprites/electric_elevator.png');
        this.load.image('blue_fp', 'assets/Sprites/Falling_platforms/blue_fp.png');

        this.load.spritesheet('fire_fp', 'assets/Sprites/Falling_platforms/fire_fp.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('fire_fp_human', 'assets/Sprites/Falling_platforms/fire_fp_human.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('moving_platform', 'assets/Sprites/Falling_platforms/moving_platform.png', { frameWidth: 96, frameHeight: 16 });

        this.load.image('pressI', 'assets/Sprites/human_press.png');
        this.load.image('pressNI', 'assets/Sprites/ni_press.png');

        this.load.image('monitor', 'assets/Sprites/monitor.png');

        this.load.image('eSurf1', 'assets/Sprites/ElectricalSurfaces/eSurf1.png');
        this.load.image('eSurf2', 'assets/Sprites/ElectricalSurfaces/eSurf2.png');
        this.load.image('eSurf3', 'assets/Sprites/ElectricalSurfaces/eSurf3.png');
        this.load.spritesheet('eSurf1_anim', 'assets/Sprites/ElectricalSurfaces/eSurf1_anim.png', { frameWidth: 448, frameHeight: 64 });
        this.load.spritesheet('eSurf2_anim', 'assets/Sprites/ElectricalSurfaces/eSurf2_anim.png', { frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('eSurf3_anim', 'assets/Sprites/ElectricalSurfaces/eSurf3_anim.png', { frameWidth: 768, frameHeight: 64 });

        this.load.image('teslaAutoOFF', 'assets/Sprites/Teslas/Tesla_coil.png');
        this.load.image('teslaHumanOFF', 'assets/Sprites/Teslas/Tesla_humancontrol_coil.png');
        this.load.spritesheet('teslaAutoON', 'assets/Sprites/Teslas/Tesla_coil_on.png', { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('teslaHumanON', 'assets/Sprites/Teslas/Tesla_coil_humancontrol_on.png', { frameWidth: 96, frameHeight: 96 });

        this.load.image('textbox', 'assets/Sprites/textbox.png');
        this.load.image('finishLine', 'assets/Sprites/finish_line.png');
        this.load.image('lifesUI', 'assets/Interfaz/InGame/lifes.png');

        this.load.image('progression_bar', 'assets/Interfaz/InGame/progression_bar.png');

        // Codigo relativo a la barra de carga.
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
        // Creamos las animaciones.
        this.anims.create({
            key: 'androidMaleAnim',
            frames: this.anims.generateFrameNumbers('androidMale', { start: 0, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'androidFemaleAnim',
            frames: this.anims.generateFrameNumbers('androidFemale', { start: 0, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'androidMaleActiveAnim',
            frames: this.anims.generateFrameNumbers('androidMaleActive', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'androidFemaleActiveAnim',
            frames: this.anims.generateFrameNumbers('androidFemaleActive', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: -1
        });
        this.anims.create({
            key: 'humanAnim',
            frames: this.anims.generateFrameNumbers('human', { start: 0, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'humanActiveAnim',
            frames: this.anims.generateFrameNumbers('humanActive', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.anims.create({
            key: 'textBoxAnim',
            frames: this.anims.generateFrameNumbers('textBox', { start: 0, end: 5 }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'humanSelectionBoxAnim',
            frames: this.anims.generateFrameNumbers('humanSelectionBox', { start: 0, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
        this.anims.create({
            key: 'androidSelectionBoxAnim',
            frames: this.anims.generateFrameNumbers('androidSelectionBox', { start: 0, end: 1 }),
            frameRate: 0,
            repeat: -1
        });
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
            frames: this.anims.generateFrameNumbers('coopJumpUp2', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopjumpDown2',
            frames: this.anims.generateFrameNumbers('coopJumpDown2', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopidle2',
            frames: this.anims.generateFrameNumbers('coopIdle2', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'coopwRight2',
            frames: this.anims.generateFrameNumbers('coopRun2', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'eBomb',
            frames: this.anims.generateFrameNumbers('explodingBomb', { start: 0, end: 13 }),
            frameRate: 7,
            repeat: 0
        });

        this.anims.create({
            key: 'exprosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });
        this.anims.create({
            key: 'laserNonLethalS',
            frames: this.anims.generateFrameNumbers('laserNonLethal', { start: 0, end: 16}),
            frameRate: 8,
            repeat: 1
        });
        this.anims.create({
            key: 'laserLethalS',
            frames: this.anims.generateFrameNumbers('laserLethal', { start: 0, end: 16 }),
            frameRate: 15,
            repeat: 1
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
            key: 'rotatingBigBlade',
            frames: this.anims.generateFrameNumbers('rBigBlade', { start: 0, end: 4 }),
            frameRate: 25,
            repeat: -1
        });
        this.anims.create({
            key: 'lifeS',
            frames: this.anims.generateFrameNumbers('life', { start: 0, end: 1 }),
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
            key: 'fire_fp_humanS',
            frames: this.anims.generateFrameNumbers('fire_fp_human', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'moving_platformS',
            frames: this.anims.generateFrameNumbers('moving_platform', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'eSurf1S',
            frames: this.anims.generateFrameNumbers('eSurf1_anim', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'eSurf2S',
            frames: this.anims.generateFrameNumbers('eSurf2_anim', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'eSurf3S',
            frames: this.anims.generateFrameNumbers('eSurf3_anim', { start: 0, end: 4 }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'teslaAutoS',
            frames: this.anims.generateFrameNumbers('teslaAutoON', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'teslaHumanS',
            frames: this.anims.generateFrameNumbers('teslaHumanON', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: -1
        });

        this.sound.pauseOnBlur = false;
        this.input.on('pointerdown', function () {
            if (!isLoading && !isFading) {

              //creamos la escena web en paralelo con el resto del juego
              this.scene.scene.launch("web");

              isFading = true;
              this.scene.cameras.main.fadeOut(1000);
              this.scene.time.addEvent({
                  delay: 1000,
                  callback: () => this.scene.game.customTransition(this.scene, 'splashScreen', 1000)
              });
              //this.scene.game.customTransition(this.scene, 'menu', 1000);
            }
        });
    }
}
