import Player from './player.js';
import Dialogue from './dialogue.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';

export default class level1 extends Phaser.Scene {
  constructor() {
    super({key: 'level1'});
  }
  //para cargar los recursos
  preload() 
  {
    //filtro Gris camara y bitmap
    this.LoadEssentialAssets();
    //Arbol
    this.load.spritesheet({
      key:'arbol',
      url:'src/assets/puzzle_objects/arbolss.png',
      frameConfig:{
        frameWidth:1426,
        frameHeight:980,
      }
    });
    //Vaca Comiendo
    this.load.spritesheet({
      key:'vacaCome',
      url:'src/assets/props/vacas/cow_eat.png',
      frameConfig:{
        frameWidth:128,
        frameHeight:128,
      }
    });
    //Velas
    this.load.spritesheet({
      key:'velas',
      url:'src/assets/sprites/game_objects/velas_ss.png',
      frameConfig:{
        frameWidth:1020,
        frameHeight:1254,
      }
    });
    
    //Cargamos imagenes
    this.load.image('sky', 'src/assets/bg/sky.png');
    this.load.image('bg1', 'src/assets/bg/lake.png');
    this.load.image('cow', 'src/assets/props/vacas/cow.png',);
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('altar', 'src/assets/props/altar/altar.png'); 
    this.load.image('vela', 'src/assets/sprites/game_objects/velas.png');
    this.load.image('leaves', 'src/assets/sprites/particles/leaves.png');
    this.load.audio('bandaSonora','src/assets/sonido/bandasonoracompr.mp3');
    this.load.tilemapTiledJSON('tilemap_level1', 'src/assets/tiles/level1.json');
  }
  

//coloca objetos apartir de los assets dentro de la escena
  create()
  {
    //Arbol Talado
    this.anims.create({
      key:'talado',
      frames: this.anims.generateFrameNumbers('arbol',{start: 0, end: 5}),
      frameRate: 4,
      showOnStart:true,
      hideOnComplete: false
    });
    //Idle de la vaca
    this.anims.create({
      key:'idlee',
      frames: this.anims.generateFrameNumbers('vacaCome',{start: 0, end: 3}),
      frameRate: 6,
      repeat: -1
    });
    //velas
    this.anims.create({
      key:'velasMuevan',
      frames: this.anims.generateFrameNumbers('velas',{start: 0, end: 2}),
      frameRate: 3,
      repeat: -1
    });

    //Musica
    this.InitSounds();
    
    //BG
    this.SetBackGround();

    //TileMap
    this.SetTileMap(); 

    //Dialogo
    this.dialogo = new Dialogue(this,["Ah si, Valverde de Lucerna"/*,"Tengo unos maravillosos recuerdos de este lugar"*/]);
    this.dialogo.onDialogue = true; //flag de activar dialogo
    
    //Player
    this.player = new Player(this, this.cameras.main.width*0.125 , this.cameras.main.height, 'player_run', 0,this.dialogo).setDepth(2);

    //Crea los puzzles
    this.SetPuzzles();
    
    //Particulas
    this.createParticles('leaves'); 
   
    //Efecto de la cámara
    this.FadeIn();

    //Animación de las vacas
    for(let i=0; i<4; i++){
      this.vaquitas[i].anims.play('idlee', true);
    }
    //Animación de las velas
    // this.velas.sprite.anims.play('velasMuevan', true);
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    //Movimiento del cielo
    this.sky.setTilePosition(this.sky.tilePositionX + 0.1);

    //Comprobación de si está resuelto el primer puzzle
    if(this.altar.objectSolved() && !this.altar.complete)
    {
      this.arbol.anims.play('talado',true);     
      this.altar.complete=true;
      
    }

    //Animación de las vacas
    // for(let i = 0; i < 4; i++)
    //   this.vaquitas[i].anims.play('idlee', true);

    //   //Animación de las velas
    //   this.velaAnima.anims.play('velasMuevan',true);
    
    //Comprobación de la solución de las vacas
    // if(this.vacas.objectSolved() && !this.vacas.complete){
      // this.suelo.destroy();
    // }

    // //COmprobación de la solución de las velas
    // if(this.velas.objectSolved() && !this.velas.complete){
    //   this.cascade.destroy();
    //   this.waterfall.destroy(true);
    //   this.waterfall2.destroy(true);
    // }
    
  }

  LoadEssentialAssets() 
  {
    //Filtro Gris
    this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);
    //BitMap de dialogos
    this.load.bitmapFont('dialogue_font','src/assets/fonts/dialogue.png','src/assets/fonts/dialogue.xml');
    //Fondo de dialogos
    this.load.image('text_bg','src/assets/bg/text_bg.png');
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

  SetPuzzles() {

    //#region Puzzle 1
    this.altar = new PuzzleObjectWord(this, this.game.config.width / 3, this.game.config.height * 1.37, 'altar', false, 2000, 'Altar', 'talar',this.player);
    this.altar.sprite.setDepth(1);
    this.scaleThis(this.altar.sprite, 0.10, 0.10);

    this.arbol = this.add.sprite(this.game.config.width * 0.7, this.game.config.height * 1.05, 'arbol', 0).setDepth(1);
    this.arbol.flipX = true;
    this.arbol.setDepth(1); //habria que hacer otras cosas pero luego Juan lo hace porque es nuestro padre
    //cuando termine la animacion del arbol se crea el collide
    this.arbol.on('animationcomplete',(anim)=>{
      if(anim.key === 'talado'){
        this.arbol.setPosition(this.arbol.x, this.arbol.y + 50);
        let puente = this.matter.add.image(this.arbol.x,this.arbol.y);
        let rectangle = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.arbol.x,this.arbol.y+this.arbol.height*0.45,64*6,32,{isStatic:true});
        puente.setExistingBody(rectangle).setFixedRotation();
      }
    },this.arbol)
    //#endregion

    //#region Puzzle 2
    // this.vacas = new PuzzleObjectWord(this, this.game.config.width * 2.8, this.game.config.height / 1.05, 'cow', false, 190, 'vacas', 'cavas',this.player);
    // this.vacas.sprite.setDepth(1);
    // this.scaleThis(this.vacas.sprite, 4, 4);

    this.vaquitas = {};
    this.vaquitas[0] = this.add.sprite(this.game.config.width * 2.75, this.game.config.height / 1.05, 'vacaCome', 0).setDepth(2);
    this.scaleThis(this.vaquitas[0], 4, 4);

    this.vaquitas[1] = this.add.sprite(this.game.config.width * 2.72, this.game.config.height / 1.05, 'vacaCome', 0).setDepth(2);
    this.scaleThis(this.vaquitas[1], 4, 4);

    this.vaquitas[2] = this.add.sprite(this.game.config.width * 2.86, this.game.config.height / 1.05, 'vacaCome', 0).setDepth(2);
    this.scaleThis(this.vaquitas[2], 4, 4);

    this.vaquitas[3] = this.add.sprite(this.game.config.width * 2.8, this.game.config.height / 1.05, 'vacaCome', 0).setDepth(2);
    this.scaleThis(this.vaquitas[3], 4, 4);

    this.suelo = this.matter.add.image(74 * 64, 17 * 64, undefined, { isStatic: true });
    let r = Phaser.Physics.Matter.Matter.Bodies.rectangle(76 * 64 + 32, 17 * 64 + 30, 64 * 5, 64, { isStatic: true});
    let suelobody = Phaser.Physics.Matter.Matter.Body.create({ parts: [r] });
    this.suelo.setExistingBody(suelobody);
    //#endregion

    //#region Puzzle 3
    // this.velas = new PuzzleObjectWord(this, this.game.config.width * 2.9, this.game.config.height / 0.53, undefined, false, 4000, 'ceras', 'secar',this.player);
    // this.velas.sprite.setDepth(1);
    // this.scaleThis(this.velas.sprite, 0.1, 0.1);

    this.velaAnima = this.add.sprite(this.game.config.width * 2.9, this.game.config.height / 0.53, 'vela', 0).setDepth(1);
    this.scaleThis(this.velaAnima, 0.1, 0.1);

    let cascadebody = Phaser.Physics.Matter.Matter.Bodies.rectangle(101 * 64 + 32, 30 * 64 + 30, 64, 64 * 9, { isStatic: true});
    this.cascade = this.matter.add.image(74 * 64, 17 * 64, undefined);
    this.cascade.setExistingBody(cascadebody);
    //#endregion

  }

  SetTileMap() {
    const map = this.make.tilemap({
      key: 'tilemap_level1',
      tileWidth: 64,
      tileHeight: 64
    });
    const tileset = map.addTilesetImage('tileset');

    //Layers del tileMap
    const inviwalls = map.createLayer('inviWall', tileset).setDepth(0);
    const water = map.createLayer('water', tileset).setDepth(0);
    map.createLayer('waterplant', tileset).setDepth(0);
    const ground = map.createLayer('ground', tileset, 0, 0).setDepth(0);
    this.waterfall2 = map.createLayer('waterfall2', tileset, 0, 0).setDepth(1);
    this.waterfall = map.createLayer('waterfall', tileset, 0, 0).setDepth(1);
    map.createLayer('foamWaterFall', tileset, 0, 0).setDepth(1);
    map.createLayer('backgroundcave', tileset, 0, 0).setDepth(1);
    const cave = map.createLayer('foregroundcave', tileset, 0, 0).setDepth(3);
    map.createLayer('entrycave', tileset, 0, 0).setDepth(3);
    map.createLayer('grass', tileset, 0, 0).setDepth(3);
    //Implementacion de colisiones
    inviwalls.setCollisionByProperty({ collides: true });
    water.setCollisionByProperty({ collides: true });
    ground.setCollisionByProperty({ collides: true });
    this.waterfall.setCollisionByProperty({ collides: false });
    this.waterfall2.setCollisionByProperty({ collides: false });
    cave.setCollisionByProperty({ collides: true });

    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(this.waterfall);
    this.matter.world.convertTilemapLayer(this.waterfall2);
    this.matter.world.convertTilemapLayer(inviwalls);
    this.matter.world.convertTilemapLayer(water);
    this.matter.world.convertTilemapLayer(ground);
    this.matter.world.convertTilemapLayer(cave);
  }

  SetBackGround() {
    this.sky = this.add.tileSprite(3840, this.cameras.main.centerY, 0, 0, 'sky');
    this.scaleThis(this.sky, 3, 3);

    this.bg = this.add.image(3840, this.cameras.main.centerY, 'bg1');
    this.scaleThis(this.bg, 3, 3);
  }

  InitSounds() {
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
  //Entrada de Juego con difuminado
  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,7680, 2560);  
    
    this.cameras.main.startFollow(this.player, false, 0.03, 0.03);
    //Offeset para seguir al jugador
    this.cameras.main.followOffset.set(0,125);
    this.cameras.main.zoomTo(0.8, 4000);

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
