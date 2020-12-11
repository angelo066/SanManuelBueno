import BaseScene from './BaseScene.js';
import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Word from './word.js';

export default class GameScene extends BaseScene {
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
    this.load.spritesheet({//Letras normales
      key:'letters', 
      url:'src/assets/sprites/letters/normaltipo.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({//Letras tachadas
      key:'strikedletters', 
      url:'src/assets/sprites/letters/strikedtipo.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({//Letras agrietadas
      key:'crackedletters', 
      url:'src/assets/sprites/letters/crackedtipo.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.image('inventory', 'src/assets/inventory/pergamino.png')
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('background', 'src/assets/bg/lake.png');
    this.load.image('brote', 'src/assets/puzzle_objects/brote_nogal.png');
    this.load.image('nogal', 'src/assets/puzzle_objects/nogal.png');
    this.load.image('rosa', 'src/assets/puzzle_objects/rosa.png');
    this.load.image('marchita', 'src/assets/puzzle_objects/rosa_marchita.png');
    this.load.image('nuez', 'src/assets/puzzle_objects/nuez.png');
    this.load.image('sombra', 'src/assets/puzzle_objects/sombra.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.image('tumba', 'src/assets/sprites/tumba.png');
    this.load.image('tumbaSombra', 'src/assets/sprites/tumbaSombra.png');

  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    //BG
    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    this.add.image(this.game.config.width/2,this.game.config.height/2, 'background').setScale(0.75,0.75);

    //#region Plataformas
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(this.game.config.width/2, this.game.config.height-60, 'ground').setScale(0.75,0.75).refreshBody();

    this.platforms.children.iterate(function (child) { //Caja de colision
        child.body.setSize(0,100);
        child.setOffset(0, 40);
    });
    //#endregion

    //tumba
    this.tumba = this.add.image(this.game.config.width/3, this.game.config.height - 175, 'tumba');
    this.tumba.setScale(2.85,2.85);
    
    //nuez
    this.nuez = this.add.image(this.game.config.width/2 + 150, this.game.config.height - 110, 'nuez')
    this.nuez.setScale(0.035,0.035);

    //rosas marchitas
    this.marchita = this.add.image(this.game.config.width/3, this.game.config.height - 120, 'marchita')
    this.marchita.setScale(2.3,2.3);
    this.marchita2 = this.add.image(this.game.config.width/3+20, this.game.config.height - 115, 'marchita')
    this.marchita2.setScale(2.3,2.3);
    this.marchita3 = this.add.image(this.game.config.width/3+40, this.game.config.height - 110, 'marchita')
    this.marchita3.setScale(2.3,2.3);

    //Player
    this.player = new Player(this, this.game.config.width/10, this.game.config.height*0.8);

    this.physics.add.collider(this.player, this.platforms);
    
    //Árbol
    this.brote = this.add.image(this.game.config.width/2, this.game.config.height - 157, 'brote');
    this.brote.setScale(0.4,0.4);

    //Palabras
    this.palabra = this.createWords('lago', this.game.config.width/6, this.game.config.height - 300, false);

    this.palabra2 = this.createWords('uez', this.game.config.width/2 + 135, this.game.config.height - 170, false)

    this.test = this.createWords('n', this.game.config.width/2 + 115, this.game.config.height - 170, true);

    //Particulas
    this.createParticles('leaves'); 
   
    this.FadeIn();
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    this.sky.setTilePosition(this.sky.tilePositionX + 0.1); 
    if(this.palabra.word === 'nogal' && !this.complete){
      //textura del nogal
      this.brote.setTexture('nogal');
      this.brote.setScale(2.35,2.35);
      this.brote.setPosition(this.brote.x, this.game.config.height - 550);
      this.palabra.destroyWord();

      //se crea sombra
      this.sombra = this.add.image(this.game.config.width/2 + 230, this.game.config.height - 350, 'sombra');
      this.sombra.setScale(0.58,0.58);
      this.sombra.setAlpha(0.3);
      this.palabra3 = this.createWords('sombra', 1322, this.game.config.height - 180, false)
     

      this.complete = true;
    }
    if(this.complete){
      if(this.palabra3.word === 'rosa' && !this.complete2){
        this.rosa = this.add.image(this.game.config.width-400, this.game.config.height - 125, 'rosa')
        this.rosa.setScale(0.023,0.023);

        this.complete2=true;
      }
    }

    //this.game.config.width-500, this.game.config.height - 125

    console.log(this.player.body.x);
    //Sale por un lado y carga la siguiente escena
    if(this.player.checkPos(this.game.config.width)){
      this.scene.start('Level2');
    }
  }

  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,this.sky.displayWidth, this.sky.displayHeight);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.3);
    
    this.complete = false;
  }

  createParticles(particleSprite)
  {
    //Particles
    let leaves = this.add.particles(particleSprite);
    leaves.createEmitter({
        frames: [{key: particleSprite, frame: 0}],
        x: -50,
        y: { min: 100, max: this.game.config.height*0.5},
        speedX: { min: 100, max: 300 },
        speedY: { min: -50, max: 50 },
        lifespan: 7000,
        scale: {start: 0.7, end: 0.1},
        rotate: {start: 0, end: 360},
        frequency: 600
    });
  }

  createWords(palabra, posX, posY, isPhysic)
  {
    this.word=new Word({
      scene:this,
      x: posX,
      y: posY,
      word: palabra
    });

    if(isPhysic)
    {
      this.word.scene.physics.add.existing(this.word);
      this.word.body.allowGravity = false;
      this.physics.add.overlap(this.player, this.word, this.player.AddLetter, null, this.player);
    }

    return this.word;
  }
}