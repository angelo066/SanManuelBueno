import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Dialogo from './dialogo.js';
export default class Level2 extends  Phaser.Scene {
  constructor() {
    super({key: 'level2'});
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
    this.load.image('altar', 'src/assets/props/altar/altar.png'); 
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.image('bg', 'src/assets/bg/BGIglesiaSS.png');
    this.load.tilemapTiledJSON('tilemap_level2', 'src/assets/tiles/level2.json');
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
    
    const map = this.make.tilemap({
      key:'tilemap_level2',
      tileWidth:64,
      tileHeight:64
    });
    this.mapWidth = map.width*64;
    this.mapHeight = map.height*64;
    const tileset = map.addTilesetImage('tileset');
    
    //BG
    this.background = this.add.image(this.mapWidth/2, this.mapHeight/2, 0, 0, 'bg');

    //Layers del tileMap
    const inviwall = map.createDynamicLayer('inviWall',tileset,0,0).setDepth(0);
    const ground = map.createDynamicLayer('ground',tileset,0,0).setDepth(1);
    map.createDynamicLayer('fillbghouse',tileset,0,0).setDepth(2);
    map.createDynamicLayer('bghouse',tileset,0,0).setDepth(3);
    const fghouse = map.createDynamicLayer('foregroundhouse',tileset,0,0).setDepth(4);
    map.createDynamicLayer('window',tileset,0,0).setDepth(5);
    map.createDynamicLayer('roofhouse',tileset,0,0).setDepth(6);
    const houseFloor = map.createDynamicLayer('grass',tileset,0,0).setDepth(7);
    //Implementacion de colisiones
    inviwall.setCollisionByProperty({collides:true});
    ground.setCollisionByProperty({collides:true});
    fghouse.setCollisionByProperty({collides:true});
    houseFloor.setCollisionByProperty({collides:true});

    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(inviwall);
    this.matter.world.convertTilemapLayer(ground);
    this.matter.world.convertTilemapLayer(fghouse); 
    this.matter.world.convertTilemapLayer(houseFloor); 
    
    //Player
    this.player = new Player(this, /*this.cameras.main.width*0.125 */3000 , this.cameras.main.height, 'player_run', 0);
    //Particulas
    this.createParticles('leaves'); 
   
    this.FadeIn();
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {

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
    this.cameras.main.setBounds(0,0,this.mapWidth, this.mapHeight);  
    
    this.cameras.main.startFollow(this.player);
    //Offeset para seguir al jugador
    this.cameras.main.followOffset.set(0,200);
    this.cameras.main.setZoom(0.8);
    
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