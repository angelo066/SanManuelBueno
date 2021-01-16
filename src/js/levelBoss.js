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
    this.LoadEssentialAssets();

    this.loadBossAssets();

    this.load.image('boss_bg', 'src/assets/iglesia/church.png');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.image('benches', 'src/assets/iglesia/church_bench.png')
    this.load.audio('bandaSonora','src/assets/sonido/bandasonoracompr.mp3');
    this.load.tilemapTiledJSON('tilemap_level_boss', 'src/assets/tiles/level_boss.json');
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    this.InitSound();
    
    const map = this.make.tilemap({
      key:'tilemap_level_boss',
      tileWidth:64,
      tileHeight:64
    });
    this.mapWidth = map.width*64;
    this.mapHeight = map.height*64;
    const tileset = map.addTilesetImage('tileset');
    
    //BG
    this.background = this.add.image(this.mapWidth/2, this.mapHeight/2, 'boss_bg').setDepth(0);

    this.benches = this.add.image(this.mapWidth/2, this.mapHeight/2, 'benches').setDepth(2);

    //Layers del tileMap
    const colliders = map.createLayer('colliders',tileset,0,0).setDepth(0);

    //Implementacion de colisiones
    colliders.setCollisionByProperty({collides:true});

    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(colliders);

    //Player
    this.player = new Player(this, 0, this.cameras.main.height, 'player_run', 0);
    this.player.setDepth(15);
    
    this.boss= new Enemigo(this, this.mapWidth*0.9 , this.mapHeight*0.65,'Boss', 'Ñ', this.player);
    this.boss.setScale(0.15);
    this.boss.flipX = true;

    this.FadeIn();
  }
  InitSound() {
    let config = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    };
    let musiquita = this.sound.add('bandaSonora', config);
    musiquita.play();
  }

//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
  }

  LoadEssentialAssets() 
  {
    //Filtro Gris
    this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);
    //Player Idle
    this.load.spritesheet({
      key: 'player_idle',
      url: 'src/assets/sprites/unamuno/idle.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 200
      }
    });
    //Player Run
    this.load.spritesheet({
      key: 'player_run',
      url: 'src/assets/sprites/unamuno/run.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 200
      }
    });
    //Player Jumop
    this.load.spritesheet({
      key: 'player_jump',
      url: 'src/assets/sprites/unamuno/jump.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 200
      }
    });
    //Player Attack
    this.load.spritesheet({
      key: 'player_attack',
      url: 'src/assets/sprites/unamuno/attack.png',
      frameConfig: {
        frameWidth: 180,
        frameHeight: 180
      }
    });
     //Player Death
     this.load.spritesheet({
      key: 'player_death',
      url: 'src/assets/sprites/unamuno/death.png',
      frameConfig: {
        frameWidth: 200,
        frameHeight: 200
      }
    });
    //Letras
    this.load.spritesheet({
      key: 'letters',
      url: 'src/assets/sprites/letters/normal.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 120
      }
    });
    //Letras tachadas
    this.load.spritesheet({
      key: 'strikedletters',
      url: 'src/assets/sprites/letters/striked.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 120
      }
    });
    //Letras rotas
    this.load.spritesheet({
      key: 'crackedletters',
      url: 'src/assets/sprites/letters/cracked.png',
      frameConfig: {
        frameWidth: 120,
        frameHeight: 120
      }
    });

    this.load.image('feather', 'src/assets/sprites/unamuno/feather.png');
    this.load.image('inventory', 'src/assets/inventory/pergamino.png');
    this.load.image('selection', 'src/assets/inventory/selector.png');
  }

  loadBossAssets()
  {
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
      url:'src/assets/sprites/Boss/attck1stSST.png',
      frameConfig:{
        frameWidth:1282,
        frameHeight:1907
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
    let newBody = M.Bodies.rectangle(image.x, image.y, w-offsetX, h-offsetY, {isStatic: true});
    image.setExistingBody(newBody);
  }
}