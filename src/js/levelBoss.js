import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Enemigo from './Enemigo.js';
export default class Level2 extends  Phaser.Scene {
  constructor() {
    super({key: 'Boss'});
  }
  //para cargar los recursos
  preload() 
  {
    this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);  

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

    //Boss SpriteSheets
    this.load.spritesheet({
      key:'Boss_Idle1',
      url:'src/assets/sprites/Boss/donManuelIdle1SS.png',
      frameConfig:{
        frameWidth:1082,
        frameHeight:1922
      }
    })
    this.load.spritesheet({
      key:'Boss_Idle2',
      url:'src/assets/sprites/Boss/donManuelIdle2SS.png',
      frameConfig:{
        frameWidth:1082,
        frameHeight:1922
      }
    })
    this.load.spritesheet({
      key:'Boss_Death',
      url:'src/assets/sprites/Boss/donManuelDeathSS.png',
      frameConfig:{
        frameWidth:1082,
        frameHeight:1922
      }
    })
    this.load.spritesheet({
      key:'Boss_attck1',
      url:'src/assets/sprites/Boss/attck1stSS.png',
      frameConfig:{
        frameWidth:1082,
        frameHeight:1922
      }
    })
    this.load.spritesheet({
      key:'Boss_attck2',
      url:'src/assets/sprites/Boss/attck2ndSS.png',
      frameConfig:{
        frameWidth:1082,
        frameHeight:1922
      }
    })


    this.load.image('feather', 'src/assets/sprites/unamuno/feather.png');
    this.load.image('inventory', 'src/assets/inventory/pergamino.png');
    this.load.image('selection', 'src/assets/inventory/selector.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('bg3', 'src/assets/bg/bg_iglesia.png');
    this.load.tilemapTiledJSON('tilemap_level2', 'src/assets/tiles/level2.json');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.audio('bandaSonora','src/assets/sonido/bandasonoracompr.mp3');
    this.load.image('brote', 'src/assets/puzzle_objects/brote_nogal.png');
    this.load.image('nogal', 'src/assets/puzzle_objects/nogal.png');
    this.load.image('rosa', 'src/assets/puzzle_objects/rosa.png');
    this.load.image('marchita', 'src/assets/puzzle_objects/rosa_marchita.png');
    this.load.image('nuez', 'src/assets/puzzle_objects/nuez.png');
    this.load.image('sombra', 'src/assets/puzzle_objects/sombra.png');
    this.load.image('tumba', 'src/assets/sprites/game_objects/tumba.png');
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
    this.background = this.add.image(this.mapWidth/2 -5000, this.mapHeight/2-200, 'bg3');
    this.scaleThis(this.background, 2, 2);

    //Rain
    this.rain = this.add.sprite(this.mapWidth/2, this.mapHeight/2, 'rainrain', 0);
    this.rain.setAlpha(0.34);
    this.scaleThis(this.rain, 2.42, 3.5);
    this.rain.setDepth(1);
    this.anims.create({
      key:'rainanim',
      frames: this.anims.generateFrameNumbers('rainrain',{start: 0, end: 4}),
      frameRate: 8,
      repeat: -1
    })

    //animacion de la señora guadalupe gracias 
    this.anims.create({
      key:'guadalupeanim',
      frames: this.anims.generateFrameNumbers('guadalupe',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    }) 

    //animacionPUERTA
    this.anims.create({
      key:'puertaAnim',
      frames: this.anims.generateFrameNumbers('puertaAnim',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })

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
    
    //Puerta
    this.puerta = this.add.sprite(this.mapWidth/2 + 2710, this.mapHeight - 1050, 'puerta', 0).setDepth(14);
    this.scaleThis(this.puerta, 0.27, 0.27);

    //Player
    this.player = new Player(this, /*this.cameras.main.width*0.125 */3000 , this.cameras.main.height, 'player_run', 0);
    this.player.setDepth(15);
    
    this.boss= new Enemigo(this, this.mapWidth*0.3 , this.mapHeight*0.65,'Boss', 'rosa', this.player);
    this.boss.setScale(0.15);
    this.boss.flipX = true;

    //Tumba
    this.tumba = this.add.sprite(this.mapWidth/2 + 470, this.mapHeight - 900, 'tumba', 0).setDepth(2);
    this.scaleThis(this.tumba, 1.5, 1.5);

    //RosasMarchitas
    this.marchita1 = this.add.sprite(this.mapWidth/2 + 500, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita1, 2, 2);
    this.marchita2 = this.add.sprite(this.mapWidth/2 + 470, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita2, 2, 2);
    this.marchita3 = this.add.sprite(this.mapWidth/2 + 440, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita3, 2, 2);

    //SEÑORAGUADALUPESACAMEDEAQUI
    this.guadalupe = this.add.sprite(this.mapWidth/2 + 2000, this.mapHeight - 1000, 'guadalupe', 0);
    this.scaleThis(this.guadalupe, 1.2, 1.2);
    this.guadalupe.flipX = true;

    //Nuez
    this.nuez = new PuzzleObjectLetter(this, this.mapWidth/2 - 300, this.mapHeight - 700, 'nuez', false, 200, 'nuez', 'n');

    //Árbol
    this.brote = new PuzzleObjectWord(this, this.mapWidth/2, this.mapHeight - 940, 'brote', false, 400, 'lago', 'nogal');

    this.FadeIn();
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    //this.rain.anims.play('rainanim', true);
    //this.guadalupe.anims.play('guadalupeanim', true);
    //this.puerta.anims.play('puertaAnim', true);
    //La lluvia siga al player
    //this.rain.setPosition(this.player.x, this.player.y-280);

    if(this.brote.objectSolved() && !this.complete){
      this.brote.changeImage('nogal');
      //Sombra
      this.sombra = new PuzzleObjectWord(this, this.mapWidth/2 + 470, this.mapHeight - 740, 'sombra', false, 280, 'sombra', 'rosa')
      this.sombra.changeAlpha(0.21);
      this.complete = true;
    }
    if(this.nuez.solved){
       this.player.addLetter(this.nuez.getLetter());
     }
    if(this.complete){
      if(this.sombra.objectSolved() && !this.complete2){
        //Rosa
        this.rosa = new PuzzleObjectWord(this, this.mapWidth/2 + 470, this.mapHeight - 740, 'rosa', false, 1, '', '');
        this.complete2 = true;
      }
    }
  }

  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,this.mapWidth, this.mapHeight);  
    
    this.cameras.main.startFollow(this.player, false, 0.03, 0.03);
    //Offeset para seguir al jugador
    this.cameras.main.followOffset.set(0,125);
    this.cameras.main.zoomTo(0.8, 4000);
    
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