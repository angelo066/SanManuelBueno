//SE COMENTA EL CóDIGO CRACKS(COJONES DICE GUILLE) >:()


import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Dialogo from './dialogo.js';

export default class level1 extends Phaser.Scene {
  constructor() {
    super({key: 'level1'});
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

    this.load.spritesheet({
      key:'arbol',
      url:'src/assets/puzzle_Objects/ArbolSS.png',
      frameConfig:{
        frameWidth:1398,
        frameHeight:1000,
      }
    });

    this.load.spritesheet({
      key:'vacaCome',
      url:'src/assets/props/vacas/cowEat.png',
      frameConfig:{
        frameWidth:32,
        frameHeight:512,
      }
    });

    this.load.spritesheet({
      key:'velas',
      url:'src/assets/sprites/gameObjects/VelasSS.png',
      frameConfig:{
        frameWidth:1248,
        frameHeight:1458,
      }
    });

    this.load.image('feather', 'src/assets/sprites/unamuno/feather.png');
    this.load.image('inventory', 'src/assets/inventory/pergamino.png');
    this.load.image('selection', 'src/assets/inventory/selector.png');
    this.load.image('bg', 'src/assets/bg/lake.png');
    this.load.image('altar', 'src/assets/props/altar/altar.png'); 
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.image('cow', 'src/assets/props/vacas/cow.png',);
    this.load.tilemapTiledJSON('tilemap_level1', 'src/assets/tiles/level1.json');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.audio('bandaSonora','src/assets/Sonido/bandaSonoraCompr.mp3');

    //this.load.image('bocadillo',);
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
<<<<<<< Updated upstream
    this.anims.create({
      key:'talado',
      frames: this.anims.generateFrameNumbers('arbol',{start: 0, end: 6}),
      frameRate: 2,
      showOnStart:true,
      hideOnComplete: true
    });
=======
    // this.anims.create({
    //   key:'idle',
    //   frames: this.anims.generateFrameNumbers('vacaCome',{start: 0, end: 4}),
    //   frameRate: 6,
    //   repeat: -1
    // });

>>>>>>> Stashed changes

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
    
    //BG
    this.sky = this.add.tileSprite(3840,this.cameras.main.centerY, 0, 0, 'sky');
    this.scaleThis(this.sky,3,3);

    this.bg = this.add.image(3840,this.cameras.main.centerY, 'bg');
    this.scaleThis(this.bg,3,3);
    const map = this.make.tilemap({
      key:'tilemap_level1',
      tileWidth:64,
      tileHeight:64
    });
    const tileset = map.addTilesetImage('tileset');
    
    //Layers del tileMap
    const inviwalls = map.createDynamicLayer('inviWall',tileset);
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
    inviwalls.setCollisionByProperty({collides:true});
    water.setCollisionByProperty({collides:true});
    ground.setCollisionByProperty({collides:true});
    waterfall.setCollisionByProperty({collides:true});
    cave.setCollisionByProperty({collides:true});

    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(inviwalls);
    this.matter.world.convertTilemapLayer(water);
    this.matter.world.convertTilemapLayer(ground);
    this.matter.world.convertTilemapLayer(waterfall);
    this.matter.world.convertTilemapLayer(cave); 
    
    //Player
    this.player = new Player(this, /*this.cameras.main.width*0.125 */3000 , this.cameras.main.height, 'player_run', 0);

    //Puzzle 1
<<<<<<< Updated upstream
    this.altar= new PuzzleObjectWord(this, this.game.config.width/3, this.game.config.height*1.35, 'altar', false, 2000,'Altar','talar');
    this.scaleThis(this.altar.sprite, 0.10, 0.10);
    this.arbol = this.add.sprite(this.game.config.width*0.7, this.game.config.height*1.05, 'arbol', 0);
    this.arbol.flipX = true;
    this.arbol.setDepth(9); //habria que hacer otras cosas pero luego Juan lo hace porque es nuestro padre
=======
    this.altar = new PuzzleObjectWord(this, this.game.config.width/3, this.game.config.height*1.35, 'altar', false, 2000,'Altar','Talar');
    this.scaleThis(this.altar.sprite, 0.10, 0.10);


    this.arbol = this.add.image(this.game.config.width*1.2, this.game.config.height*1.05, 'arbol', 0);
    // this.arbol.sprite.setDepth();

    
    this.vacas = new PuzzleObjectWord(this, this.game.config.width*2.8, this.game.config.height/1.05, 'cow', false, 400,'Altar','Talar');
    this.scaleThis(this.vacas.sprite, 2, 2);

    this.vaca1 = this.add.image(this.game.config.width*2.8, this.game.config.height/1.05, 'vacaCome', 0);



      // this.rec = Phaser.Physics.Matter.Matter.Bodies.rectangle(x, t); 
>>>>>>> Stashed changes
    //Particulas
    this.createParticles('leaves'); 
   
    this.FadeIn();
    this.Dialogo = new Dialogo(this, this.cameras.main.width/2, this.cameras.main.height-400,'Hola hijo de puta','sky',400);
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {

    this.sky.setTilePosition(this.sky.tilePositionX + 0.1);
    //this.sky2.setTilePosition(this.sky.tilePositionX + 0.1);

    if(this.altar.objectSolved() && !this.altar.complete)
    {
      this.arbol.anims.play('talado',true);     

      this.arbol.setPosition(this.arbol.x, this.arbol.y + 50);
      let puente = this.matter.add.image(this.arbol.x,this.arbol.y);
      let rectangle = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.arbol.x,this.arbol.y,64*6,64,{isStatic:true,label:'ground'});
      let puenteBody = Phaser.Physics.Matter.Matter.Body.create({parts:[rectangle]});
      puente.setExistingBody(puenteBody).setFixedRotation();
      
      this.altar.complete=true;
      
    }
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
    this.cameras.main.setBounds(0,0,7680, 2560);  
    
    this.cameras.main.startFollow(this.player);
    //Offeset para seguir al jugador
    this.cameras.main.followOffset.set(0,125);
    this.cameras.main.setZoom(1.2);
    
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
