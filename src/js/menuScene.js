import SceneManager from './SceneManager.js'
export default class MenuScene extends SceneManager {
    constructor() {
      super({ key: 'menu' });
    }

    preload(){
        this.load.video('logo_anim','./src/assets/video/logo_anim.mp4','canplay',false,true);
        this.load.image('sky', 'src/assets/bg/sky.png');
        this.load.image('ground', 'src/assets/platforms/grass.png');
        this.load.image('background', 'src/assets/bg/lake.png');
        this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
        this.load.image('title', 'src/assets/main_menu/title.png');
        this.load.image('press','src/assets/main_menu/press.png');
    }
    create(){  
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    //#region VIDEO
    let video = this.add.video(this.game.config.width/2,this.game.config.height/2,'logo_anim');
    video.play(false);  //No loop
    video.on('complete', (video)=>{
            video.destroy();
            //BG
            this.add.image(this.game.config.width/2,this.game.config.height/2, 'background').setScale(0.75,0.75);
            this.add.image(this.game.config.width/2, this.game.config.height-60, 'ground').setScale(0.75,0.75);
            //Particles
            let leaves = this.add.particles('leaves');
            leaves.createEmitter({
                frames: [{key: 'leaves', frame: 0}],
                x: -50,
                y: { min: 100, max: this.game.config.height*0.7},
                speedX: { min: 100, max: 300 },
                speedY: { min: -50, max: 50 },
                lifespan: 7000, //lo que dira la particula
                scale: {start: 0.7, end: 0.1},
                rotate: {start: 0, end: 360},
                frequency: 400
            });

            this.cameras.main.fadeIn(2000, 0, 0, 0);

            //Evento que detecta cuando se termina el FadeIn
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
                this.title = this.add.image(this.game.config.width/2,this.game.config.height*0.4,'title').setScale(0.6).setAlpha(0);
                this.press = this.add.image(this.game.config.width/2,this.game.config.height*0.7,'press').setScale(1.3).setAlpha(0);

                let timeline = this.tweens.createTimeline();
                //Presenta el titulo (fadeIn)
                timeline.add({ targets: this.title, alpha: { value: 1, duration: 3000 }});

                //Parapadeo de input
                timeline.add({
                    targets: this.press,
                    alpha: { value: 1, duration: 1500 },
                    yoyo: true, // de 0 a 1 y de 1 a 0. Pero progresivo. Si es false va de 0 a 1 y luego de 0 a 1 progresivo
                    loop: -1
                });

                timeline.play();

                //Si recibe input pasa a la siguiente escena cuando termine de fundir a negro
                this.input.keyboard.on('keydown', ()=> {this.cameras.main.fadeOut(1000, 0, 0, 0)});
                //O cualquier click, se pasa de escena
                this.input.on('pointerdown', ()=> {this.cameras.main.fadeOut(1000, 0, 0, 0)});

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.loadNextScene();
                })
            });

        },this);
    //#endregion 
    }
    update(){
        this.sky.setTilePosition(this.sky.tilePositionX + 0.1); 
    }
}