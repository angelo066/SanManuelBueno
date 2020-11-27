import SceneManager from './SceneManager.js'
import Player from './player.js'
import Word from './word.js';

let platforms;
export default class GameScene extends SceneManager {
  constructor() {
    super({key: 'game'});
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
      url:'src/assets/sprites/letters/tipo1a.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({
      key:'strikedletters', 
      url:'src/assets/sprites/letters/tipo1b.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('background', 'src/assets/bg/lake.png');
    this.load.image('brote', 'src/assets/puzzle_objects/brote_nogal.png');
    this.load.image('nogal', 'src/assets/puzzle_objects/nogal.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');

  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    //BG
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    this.add.image(this.game.config.width/2,this.game.config.height/2, 'background').setScale(0.75,0.75);
    //Platform and player
    platforms = this.physics.add.staticGroup();
    this.player = new Player(this, this.game.config.width/8, this.game.config.height*0.8);
    platforms.create(this.game.config.width/2, this.game.config.height-60, 'ground').setScale(0.75,0.75).refreshBody();
    platforms.children.iterate(function (child) { //Caja de colision
        child.body.setSize(0,100);
        child.setOffset(0, 40);
    });
    //arbol y palabra
    this.brote = this.add.image(this.game.config.width-400, this.game.config.height - 120, 'brote');
    this.brote.setScale(0.4,0.4);
    this.physics.add.collider(this.player, platforms);
    this.word = new Word({
      scene: this,
      x: this.game.config.width*2 /3,
      y: this.game.config.height/3,
      word: 'Logan'
    });
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
    this.complete = false;
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    this.sky.setTilePosition(this.sky.tilePositionX + 0.1); 
    if(this.word.word === 'nogal' && !this.complete){
      this.brote.setTexture('nogal');
      this.brote.setScale(2.2,2.2);
      this.brote.setPosition(this.brote.x, this.game.config.height - 500);
      this.word.destroyWord();
      console.log("lag");
      this.complete = true;
    }
    //Sale por un lado y carga la siguiente escena
    if(this.player.checkPos(this.game.config.width)){
      this.loadNextScene();
    }
  }
}