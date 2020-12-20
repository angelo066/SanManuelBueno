import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';

export default class Scene1 extends  Phaser.Scene {
  constructor() {
    super({key: 'Level1'});
  }
  //para cargar los recursos
  preload() 
  {
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
      url:'src/assets/sprites/letters/normal.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({
      key:'strikedletters', 
      url:'src/assets/sprites/letters/cracked.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('background2', 'src/assets/bg/BackGround3.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.image('Wall', 'src/assets/platforms/Sonic.png');
    this.load.image('Roof', 'src/assets/caseta/Roof.png');
    this.load.image('Fondo', 'src/assets/caseta/Plantilla.png');
    this.load.tilemapTiledJSON('tilemap1', 'src/assets/tiles/level1.json');
    this.load.image('patronesTilemap','src/assets/tiles/tileset.png')

  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    this.map = this.make.tilemap({
      key:'tilemap1',
      // tileWidth:1024,
      // tileHeight:1024
    });

    const tileset1 = this.map.addTilesetImage('tileset','patronesTilemap');

    this.backGroundLayer = this.map.createStaticLayer('backgroundcave', tileset1);
    this.groundLayer = this.map.createStaticLayer('ground',tileset1);
    this.foregroundLayer=this.map.createStaticLayer('grass',tileset1);
    
    //BG
  
    //Platform and player

    this.player = new Player(this, this.game.config.width/8, this.game.config.height*0.8);
    //this.playerMaricon= this.map.createFromObjects('ground',1);
    

    //Puzzle1
    this.altar = new PuzzleObjectWord(this, this.game.config.width/5, this.game.config.height/2, 'altar', false,true,'Altar','Talar');
    this.complete=false;

    //Puzzle2
    this.vaca = new PuzzleObjectWord(this, this.game.config.width/3, this.game.config.height/2, 'vaca',false, true, 'Vaca', 'Cava');
    this.complete2=false;

    //Puzzle 3
    this.velas = new PuzzleObjectWord(this, this.game.config.width * 3/4, this.game.config.height * 3/4, 'Velas', false, true, 'Ceras', 'Secar');
    this.complete3=false;
    
    //Particles
    let leaves = this.add.particles('leaves');
    leaves.createEmitter({
        frames: [{key: 'leaves', frame: 0}],
        x: -50,
        y: { min: 100, max: this.game.config.height*0.5},
        speedX: { min: 100, max: 300 },
        speedY: { min: -50, max: 50 },
        lifespan: 7000,
        scale: {start: 0.7, end: 0.1},
        rotate: {start: 0, end: 360},
        frequency: 600
    });
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,this.sky.displayWidth, this.sky.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.3);
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    //Sale por un lado y entra por el otro
    this.player.checkPos(this.game.config.width);
    if(this.player.checkPos(this.game.config.width)){
      this.scene.start('menu');
    }

    if(this.altar.objectSolved() && !this.complete){
      //destruir ábol y ponerlo tumbado
      this.complete=true;
    }
    if(this.vaca.objectSolved() && !this.complete2){
      //destruir suelo y caer
      this.complete2=true;
    }

    if(this.vaca.objectSolved() && !this.complete3){
      //destruir quitar cascada
      this.complete3=true;
    }
  }
}