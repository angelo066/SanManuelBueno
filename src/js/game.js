import Player from './player.js'

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
    this.canvas = this.sys.game.canvas; //Canvas de la escena
    this.load.video('logo_anim','./src/assets/video/logo_anim.mp4','canplay',false,true);
    this.load.spritesheet({
      key:'player', 
      url:'src/assets/sprites/unamuno/Run.png',
      frameConfig:{
        frameWidth:127, 
        frameHeight:208
      }
    });

    this.load.image('platform', 'src/assets/Plataformas/plataforma.png');
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    player = new Player(this, 30, 40);

    //#region VIDEO
    let video = this.add.video(this.canvas.width/2,this.canvas.height/2,'logo_anim');
    video.play(false);  //No loop
    video.on('complete', function(video){     
      console.log("The audio has ended");
      this.add.text(this.canvas.width/2 -200 , this.canvas.height/2,"Unamuno is coming for u",{fontSize:32});
      player = new Player(this, this.canvas.width/2, this.canvas.height/2);
    },this);
    //#endregion 
    
    //Esto son las plataformas
    platforms = this.physics.add.staticGroup();
    platforms.create(900, 968, 'platform').setScale(4).refreshBody();

    this.physics.add.collider(player, platforms);
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta) 
  {
    
  }
}