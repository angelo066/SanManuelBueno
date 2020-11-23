import Player from './player.js'
import Word from './word.js';

let player;
let platforms;
export default class Game extends Phaser.Scene {
  constructor() 
  {
    super({ key: "main" });
  }
  //para cargar los recursos
  preload() 
  {
    this.load.video('logo_anim','./src/assets/video/logo_anim.mp4','canplay',false,true);
    this.load.spritesheet({
      key:'player_run', 
      url:'src/assets/sprites/unamuno/run.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:200
      }
    });
    this.load.spritesheet({
      key:'player_jump', 
      url:'src/assets/sprites/unamuno/jump.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:200
      }
    });
    this.load.spritesheet({
      key:'letters', 
      url:'src/assets/sprites/tipo1a.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({
      key:'strikedletters', 
      url:'src/assets/sprites/tipo1b.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });

    this.load.image('platform', 'src/assets/platforms/grass.png');
    this.load.image('background', 'src/assets/bg/lake.png');
    this.load.image('brote', 'src/assets/puzzle_objects/brote_nogal.png');
    this.load.image('nogal', 'src/assets/puzzle_objects/nogal.png');

  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {                         
    //#region VIDEO
    /*let video = this.add.video(this.game.config.width/2,this.game.config.height/2,'logo_anim');
    video.play(false);  //No loop
    
    video.on('complete', function(video){
      video.destroy();
    },this);*/
    
    //#endregion 
    
    platforms = this.physics.add.staticGroup();
    this.add.image(this.game.config.width/2,this.game.config.height/2, 'background');
    this.brote = this.add.image(this.game.config.width/2, this.game.config.height - 120, 'brote');
    this.brote.setScale(0.4,0.4);
    this.player = new Player(this, this.game.config.width/8, this.game.config.height - 220);
    platforms.create(this.game.config.width/2, this.game.config.height-60, 'platform').refreshBody();
    this.physics.add.collider(this.player, platforms);
    this.word = new Word({
      scene: this,
      x: this.game.config.width*2 /3,
      y: this.game.config.height/3,
      word: 'Logan'
    });
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    let complete = false;
    let sol = 'nogal';
    if(this.word.word === sol && !complete){
      this.nogal = this.add.image(this.game.config.width/2, this.game.config.height/2 + 35, 'nogal');
      this.nogal.setScale(2.2,2.2);
      this.brote.destroy();
      complete = true;
    }
  }

}