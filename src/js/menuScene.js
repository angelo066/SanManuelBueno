import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';

export default class MenuScene extends  Phaser.Scene {
    constructor() {
      super({ key: 'menu' });
    }

    preload(){
        this.load.spritesheet({//Letras normales
            key:'letters', 
            url:'src/assets/sprites/letters/normal.png',
            frameConfig:{
              frameWidth:120,
              frameHeight:120
            }
          });

        this.load.video('logo_anim','./src/assets/video/logo_anim.mp4','canplay',false,true);
        this.load.image('sky', 'src/assets/bg/sky.png');
        this.load.image('ground', 'src/assets/platforms/grass.png');
        this.load.image('background', 'src/assets/bg/lake.png');
        this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
        this.load.image('title', 'src/assets/main_menu/title.png');
        this.load.image('press','src/assets/main_menu/press.png');
        this.load.image('selection', 'src/assets/inventory/selector.png');
    }
    create(){  
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    //#region VIDEO
    const video = this.add.video(this.game.config.width/2,this.game.config.height/2,'logo_anim');
    video.play(false);  //No loop
    
    //Puzzle de inicio
    this.playGame = new PuzzleObjectWord(this,this.game.config.width/2,this.game.config.height*0.9,null, false, 2000, 'jagru', 'jugar',undefined).setScale(1.3).setAlpha(0);
    //Video inicial
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
                lifespan: 7000, //lo que dura la particula
                scale: {start: 0.7, end: 0.1},
                rotate: {start: 0, end: 360},
                frequency: 400
            });

            this.cameras.main.fadeIn(2000, 0, 0, 0);
      //Evento que detecta cuando se termina el FadeIn
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
                this.title = this.add.image(this.game.config.width/2,this.game.config.height*0.4,'title').setScale(0.6).setAlpha(0);
                // this.press = this.add.image(this.game.config.width/2,this.game.config.height*0.7,'press').setScale(1.3).setAlpha(0);

                let timeline = this.tweens.createTimeline();
                //Presenta el titulo (fadeIn)
                timeline.add({ targets: this.title, alpha: { value: 1, duration: 3000 }});
                
                
                this.playGame.wordAppear();

                timeline.play();

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('Intro');
                })
            });
        },this);
    //#endregion 
    }
    update()
    {
        //Movimiento del cielo
        this.sky.setTilePosition(this.sky.tilePositionX + 0.1); 
        
        //Control del puzzle
        if(this.playGame.objectSolved() && !this.playGame.complete)
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.playGame.complete=true;
        }
    }
}