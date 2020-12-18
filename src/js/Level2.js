import Player from './player.js';
import Word from './word.js';

let platforms;
export default class Scene2 extends  Phaser.Scene {
  constructor() {
    super({key: 'Level2'});
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
    this.load.image('background2', 'src/assets/bg/BackGround3.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.image('Wall', 'src/assets/platforms/Sonic.png');
    this.load.image('Roof', 'src/assets/caseta/Roof.png');
    this.load.image('Fondo', 'src/assets/caseta/Plantilla.png');

  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    //BG
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    this.add.image(this.game.config.width/2,this.game.config.height/2, 'background2').setScale(2.13,2.13);
    //Platform and player
    platforms = this.physics.add.staticGroup();
    //Caseta
    

    this.player = new Player(this, this.game.config.width/8, this.game.config.height*0.8);
    this.CreaCaseta();

    platforms.create(this.game.config.width/2, this.game.config.height-60, 'ground').setScale(0.75,0.75).refreshBody();
    platforms.children.iterate(function (child) { //Caja de colision
        child.body.setSize(0,100);
        child.setOffset(0, 40);
    });


    //Puzzle
    this.physics.add.collider(this.player, platforms);
    this.word = new Word({
      scene: this,
      x: this.game.config.width* 0.4,
      y: this.game.config.height/3,
      word: 'Calentar'
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
    //Sale por un lado y entra por el otro
    this.player.checkPos(this.game.config.width);
    if(this.player.checkPos(this.game.config.width)){
      this.scene.start('menu');
    }

    if(this.word === 'Central' && !this.complete){
      //Cambiar Imagen con todas las llaves por imagen con una y cambiar de nivel
    }
  }

  CreaCaseta(){
    //Caseta
    this.walls=this.physics.add.staticGroup();
    this.walls.create(this.game.config.width-300,this.game.config.height-500).setScale(0.75,0.75).refreshBody();
    this.walls.create(this.game.config.width - 800, this.game.config.height-500);

    this.walls.children.iterate(function(child){
      child.body.setSize(50,450);
      child.setOffset(0, 0);
    });
    //Techo
    this.add.image(this.game.config.width - 550, this.game.config.height-540,'Roof').setScale(0.33,0.33);
    //FOndo
    this.add.image(this.game.config.width - 550, this.game.config.height-300,'Fondo').setScale(0.45,0.7);

    //Estufa
    //this.add.image = (this.game.config.width - 800, this.game.config.height-500,'ImagenEstufa').setScale(0.75,0.75);

    //Llave
    //this.llaves = this.add.image(this.game.config.width - 800, this.game.config.height-500,'ImagenLlaves').setScale(0.75,0.75);

    this.physics.add.collider(this.player, this.walls);
  }
}