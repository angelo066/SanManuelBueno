

//SE COMENTA EL CóDIGO CRACKS(COJONES DICE GUILLE) >:()


import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Dialogo from './dialogo.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'game'});
  }
  //para cargar los recursos
  preload() 
  {
    this.load.spritesheet({
    key:'player_idle', 
    url:'src/assets/sprites/unamuno/idle.png',
    frameConfig:{
      frameWidth:120,
      frameHeight:200
    }
  });
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
      key:'player_attack', 
      url:'src/assets/sprites/unamuno/attack.png',
      frameConfig:{
        frameWidth:180,
        frameHeight:180
      }
    });
    this.load.spritesheet({//Letras normales
      key:'letters', 
      url:'src/assets/sprites/letters/normal.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({//Letras tachadas
      key:'strikedletters', 
      url:'src/assets/sprites/letters/striked.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.spritesheet({//Letras agrietadas
      key:'crackedletters', 
      url:'src/assets/sprites/letters/cracked.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    });
    this.load.image('feather', 'src/assets/sprites/unamuno/feather.png');
    this.load.image('inventory', 'src/assets/inventory/pergamino.png');
    this.load.image('selection', 'src/assets/inventory/selector.png');
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
    this.load.image('tumba', 'src/assets/sprites/gameObjects/tumba.png');


    this.load.tilemapTiledJSON('tilemap_level1', 'src/assets/tiles/level1.json');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.audio('bandaSonora','src/assets/Sonido/bandaSonoraCompr.mp3');

    //this.load.image('bocadillo',);
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    let config={
      mute:false,
      volume:1,
      rate:1,
      detune:0,
      seek:0,
      loop:true,
      delay:0
    };
    let musiquita = this.sound.add('bandaSonora',config);
    musiquita.play();
    
    this.bg = this.add.image(this.cameras.main.centerX,this.cameras.main.centerY, 'background');
    this.scaleThis(this.bg,0.75,0.75);

    this.sky = this.add.tileSprite(this.game.config.width/2,this.game.config.height/2, 0, 0, 'sky').setScale(0.75,0.75);
    const map = this.make.tilemap({
      key:'tilemap_level1',
      tileWidth:64,
      tileHeight:64
    });
    const tileset = map.addTilesetImage('tileset');
    
    //Layers del tileMap
    const water = map.createDynamicLayer('water',tileset);
    map.createDynamicLayer('waterplant',tileset);
    const ground = map.createDynamicLayer('ground',tileset,0,0);
    map.createDynamicLayer('waterfall2',tileset,0,0);
    const waterfall = map.createDynamicLayer('waterfall',tileset,0,0);
    map.createDynamicLayer('foamWaterFall',tileset,0,0);
    map.createDynamicLayer('backgroundcave',tileset,0,0);
    const cave = map.createDynamicLayer('foregroundcave',tileset,0,0);
    map.createDynamicLayer('entrycave',tileset,0,0);
    map.createDynamicLayer('grass',tileset,0,0);
    //Implementacion de colisiones
    water.setCollisionByProperty({collides:true});
    ground.setCollisionByProperty({collides:true});
    waterfall.setCollisionByProperty({collides:true});
    cave.setCollisionByProperty({collides:true});
    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(water);
    this.matter.world.convertTilemapLayer(ground);
    this.matter.world.convertTilemapLayer(waterfall);
    this.matter.world.convertTilemapLayer(cave);
    //DEBUG
    this.matter.world.createDebugGraphic();
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // suelo.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });  


    //BG
    // this.sky = this.add.tileSprite(this.cameras.main.centerX,this.cameras.main.centerY, 0, 0, 'sky');
    // this.scaleThis(this.sky,0.75,0.75);

    // this.sky2 = this.add.tileSprite(this.cameras.main.centerX + 1920,this.cameras.main.centerY, 0, 0, 'sky');
    // this.scaleThis(this.sky2,0.75,0.75);

    

    // this.bg2 = this.add.image(this.cameras.main.centerX + this.bg.width - 650,this.cameras.main.centerY, 'background').setFlipX(true);
    // this.scaleThis(this.bg2,0.75,0.75);

    //#region Plataformas
    // this.ground =  this.matter.add.image(this.cameras.main.width/2, this.cameras.main.height-60, 'ground');
    // this.addStaticCollision(this.ground,0,120);
    // this.scaleThis(this.ground,0.75,0.75); 

    // this.ground2 =  this.matter.add.image(this.cameras.main.width + this.cameras.main.width/2, this.cameras.main.height-60, 'ground');
    // this.addStaticCollision(this.ground2,0,120);
    // this.scaleThis(this.ground2,0.75,0.75);
    //#endregion

    //Tumba
    // this.tumba = new PuzzleObjectWord(this, this.game.config.width/3, this.game.config.height - 175, 'tumba', false, 1, '', '');

    //RosasMarchitas
    // this.marchita = new PuzzleObjectWord(this, this.game.config.width/3, this.game.config.height - 118, 'marchita', false, 1, '', '');
    // this.marchita2 = new PuzzleObjectWord(this, this.game.config.width/3 + 20, this.game.config.height - 115, 'marchita', false, 1, '', '');
    // this.marchita3 = new PuzzleObjectWord(this, this.game.config.width/3 + 40, this.game.config.height - 120, 'marchita', false, 1, '', '');

    //Nuez
    // this.nuez = new PuzzleObjectLetter(this, this.game.config.width/2 + 150, this.game.config.height - 50, 'nuez', false, 200, 'nuez', 'n');

    //Player
    this.player = new Player(this, /*this.cameras.main.width*0.125 */3000 , this.cameras.main.height, 'player_run', 0);

    //Árbol
    //this.brote = new PuzzleObjectWord(this, this.game.config.width/2, this.game.config.height - 250, 'brote', false, 400, 'logan', 'nogal');

    //Particulas
    this.createParticles('leaves'); 
   
    this.FadeIn();
    this.Dialogo = new Dialogo(this, this.cameras.main.width/2, this.cameras.main.height-400,'Hola hijo de puta','sky',400);
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {

    // this.sky.setTilePosition(this.sky.tilePositionX + 0.1);
    // this.sky2.setTilePosition(this.sky.tilePositionX + 0.1);

    // if(this.brote.objectSolved() && !this.complete){
    //   this.brote.changeImage('nogal');
    //   //Sombra
    //   this.sombra = new PuzzleObjectWord(this, this.game.config.width/2 + 500, this.game.config.height - 50, 'sombra', false, 280, 'sombra', 'rosa')
    //   this.sombra.changeAlpha(0.3);
    //   this.complete = true;
    // }
    // if(this.nuez.solved){
    //    this.player.addLetter(this.nuez.getLetter());
    //  }
    // if(this.complete){
    //   if(this.sombra.objectSolved() && !this.complete2){
    //     //Rosa
    //     this.rosa = new PuzzleObjectWord(this, this.game.config.width-400, this.game.config.height - 175, 'rosa', false, 1, '', '');
    //     this.complete2 = true;
    //   }
    // }
  }

  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    // this.cameras.main.setBounds(0,-1000,this.sky.displayWidth*2, this.sky.displayHeight * 2);  
    
    this.cameras.main.startFollow(this.player);
    //Offeset para seguir al jugador
    this.cameras.main.followOffset.set(0,250);
    this.cameras.main.setZoom(1);
    
    this.complete = false;
  }

  createParticles(particleSprite)
  {
    //Particles
    let leaves = this.add.particles(particleSprite);
    leaves.createEmitter({
        frames: [{key: particleSprite, frame: 0}],
        x: -50,
        y: { min: 100, max: this.cameras.main.centerY},
        speedX: { min: 100, max: 300 },
        speedY: { min: -50, max: 50 },
        lifespan: 7000,
        scale: {start: 0.7, end: 0.1},
        rotate: {start: 0, end: 360},
        frequency: 600
    });
  }
  //escalar la imagen con display en vez de setScale
  scaleThis(image,w, h){
    image.displayWidth = image.width*w;
    image.displayHeight = image.height*h;
  }
  //Añadir collide estatico a imagen
  addStaticCollision(image, offsetX, offsetY){
    let M = Phaser.Physics.Matter.Matter;
    let w = image.width;
    let h = image.height;
    let newBody = M.Bodies.rectangle(image.x, image.y, w-offsetX, h-offsetY, {isStatic: true, label:'ground'});
    image.setExistingBody(newBody);
  }
}