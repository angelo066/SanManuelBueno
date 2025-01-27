import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Dialogue from './dialogue.js';
export default class Level2 extends  Phaser.Scene {
  constructor() {
    super({key: 'level2'});
  }
  //para cargar los recursos
  preload() 
  {
    this.LoadEssentialAssets();
    //Lluvia
    this.load.spritesheet({
      key:'rainrain',
      url:'src/assets/sprites/particles/rain.png',
      frameConfig:{
        frameWidth:1920,
        frameHeight:374
      }
    })
    //Guadalupe
    this.load.spritesheet({
      key:'guadalupe',
      url:'src/assets/sprites/game_objects/sraguadalupe.png',
      frameConfig:{
        frameWidth:115,
        frameHeight:171.8
      }
    })
    //Puerta
    this.load.spritesheet({
      key:'puerta',
      url:'src/assets/sprites/game_objects/puerta.png',
      frameConfig:{
        frameWidth:619,
        frameHeight:1037
      }
    })
    //Caldera
    this.load.spritesheet({
      key:'caldera',
      url:'src/assets/sprites/game_objects/chimenea.png',
      frameConfig:{
        frameWidth:1071,
        frameHeight:1061
      }
    })
    //Assets dialogos
    this.load.image('text_bg','src/assets/bg/text_bg.png');
    this.load.bitmapFont('dialogue_font','src/assets/fonts/dialogue.png','src/assets/fonts/dialogue.xml')
    //otros assets
    this.load.image('bg2', 'src/assets/bg/bg_iglesia.png');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('rosa', 'src/assets/puzzle_objects/rosa.png');
    this.load.image('nuez', 'src/assets/puzzle_objects/nuez.png');
    this.load.image('nogal', 'src/assets/puzzle_objects/nogal.png');
    this.load.image('llaves','src/assets/sprites/keys/fullkeys.png');
    this.load.image('sombra', 'src/assets/puzzle_objects/sombra.png');
    this.load.image('menosllaves','src/assets/sprites/keys/emptykeys.png')
    this.load.image('brote', 'src/assets/puzzle_objects/brote_nogal.png');
    this.load.image('tumba', 'src/assets/sprites/game_objects/tumba.png');
    this.load.audio('bandaSonora','src/assets/sonido/bandasonoracompr.mp3');
    this.load.image('marchita', 'src/assets/puzzle_objects/rosa_marchita.png');
    this.load.tilemapTiledJSON('tilemap_level2', 'src/assets/tiles/level2.json');
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {

    this.InitSounds();
    
    this.SetTileMap(); 
    
    //BG
    this.background = this.add.image(this.mapWidth/2 -5000, this.mapHeight/2-200, 'bg2');
    this.scaleThis(this.background, 2, 2);
    
    //Rain
    this.rain = this.add.sprite(this.mapWidth/2, this.mapHeight/2, 'rainrain', 0);
    this.rain.setAlpha(0.34);
    this.scaleThis(this.rain, 2.42, 5);
    this.rain.setDepth(1);

    this.anims.create({
      key:'PuertaAbre',
      frames: this.anims.generateFrameNumbers('puerta',{start: 0, end: 5}),
      frameRate: 3,
      repeat: 0
    });

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
      frames: this.anims.generateFrameNumbers('puerta',{start: 0, end: 5}),
      frameRate: 8,
    })

    //AnimacionCaldera
    this.anims.create({
      key:'calderaAnim',
      frames: this.anims.generateFrameNumbers('caldera',{start: 0, end: 1}),
      frameRate: 8,
    })
    //Dialogo de prueba
    this.SetImages();
    this.setDialogues();
    
    //Player
    this.player = new Player(this,this.cameras.main.width*0.08, this.cameras.main.height*1.4, 'player_run', 0, this.dialogoInicio).setDepth(15);
    
    this.SetPuzzles();

    this.FadeIn();

    this.caldera.sprite.anims.play('calderaAnim',true);
    this.rain.anims.play('rainanim', true);
    this.guadalupe.anims.play('guadalupeanim', true);

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('Boss');
    });

    this.SetEnd();

  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    //La lluvia siga al player
    this.rain.setPosition(this.player.x, this.player.y-280);
    if(this.brote.objectSolved() && !this.brote.complete){
      this.brote.changeImage('nogal');
      //Sombra
      this.sombra = new PuzzleObjectWord(this, this.mapWidth/2 + 470, this.mapHeight - 740, 'sombra', false, 280, 'sombra', 'rosa',this.player);
      this.rosa= this.add.image(this.mapWidth/2 + 470, this.mapHeight - 740, 'rosa');
      this.sombra.changeAlpha(0.21);
      this.brote.complete = true;

    }
    if(this.nuez.solved){
       this.player.addLetter(this.nuez.getLetter());
     }
    if(this.sombra !== undefined && this.sombra.objectSolved() && !this.sombra.complete){
      this.puerta.anims.play('puertaAnim',true);
      this.puerta.body.destroy();
      this.sombra.complete = true;
      this.guadalupe.anims.stop();
      this.guadalupe.setTexture(this.guadalupe.texture);

      this.GuadalupeNuevoDialogo();

    }
    if(this.caldera.objectSolved() && !this.caldera.complete){
      let menosllaves = this.add.image(this.llaves.x, this.llaves.y,'menosllaves').setDepth(15);
      menosllaves.setScale(0.05, 0.05);
      this.llaves.destroy();

      this.puertaFinal.anims.play('puertaAnim',true);
      this.puertaFinal.body.destroy();
      this.caldera.complete=true;
    }
  }

  SetPuzzles() {
    //Nuez
    this.nuez = new PuzzleObjectLetter(this, this.mapWidth / 2 - 100, this.mapHeight - 820, 'nuez', false, 200, 'nuez', 'n');

    //Árbol
    this.brote = new PuzzleObjectWord(this, this.mapWidth / 2, this.mapHeight - 940, 'brote', false, 400, 'lago', 'nogal',this.player);

    //Caldera 
    this.caldera = new PuzzleObjectWord(this,this.mapWidth / 2 + 3300, this.mapHeight - 1050, 'caldera', false, 1000, 'calentar', 'central',this.player);
    this.caldera.setScaleSprite(0.3,0.3);
    this.caldera.sprite.setDepth(3);
  }

  SetImages() {
    //Primera puerta
    this.puerta = this.matter.add.sprite(this.mapWidth / 2 + 2850, this.mapHeight - 1030, 'puerta', 0).setDepth(14);
    let puertaBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.puerta.x,this.puerta.y,500,500,{isStatic:true});
    this.puerta.setExistingBody(puertaBody);
    this.scaleThis(this.puerta, 0.27, 0.27);

    //SegundaPuerta
    this.puertaFinal = this.matter.add.sprite(this.mapWidth - 750, this.mapHeight - 1030, 'puerta', 0).setDepth(14);
    let puertaFinalBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.puertaFinal.x,this.puertaFinal.y,500,500,{isStatic:true});
    this.puertaFinal.setExistingBody(puertaFinalBody);
    this.scaleThis(this.puertaFinal, 0.27, 0.27);

    //Tumba
    this.tumba = this.add.sprite(this.mapWidth / 2 + 470, this.mapHeight - 900, 'tumba', 0).setDepth(2);
    this.scaleThis(this.tumba, 1.5, 1.5);
    //RosasMarchitas
    this.marchita1 = this.add.sprite(this.mapWidth / 2 + 500, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita1, 2, 2);
    this.marchita2 = this.add.sprite(this.mapWidth / 2 + 470, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita2, 2, 2);
    this.marchita3 = this.add.sprite(this.mapWidth / 2 + 440, this.mapHeight - 850, 'marchita', 0).setDepth(2);
    this.scaleThis(this.marchita3, 2, 2);
    //SEÑORAGUADALUPESACAMEDEAQUI
    this.guadalupe = this.matter.add.sprite(this.mapWidth / 2 + 2000, this.mapHeight - 1000, 'guadalupe', 0);
    this.scaleThis(this.guadalupe, 1.2, 1.2);
    this.guadalupe.flipX = true;

    this.llaves = this.add.sprite(this.mapWidth / 2 + 3600, this.mapHeight - 1200, 'llaves', 0).setDepth(15);
    this.llaves.setScale(0.05,0.05);
  }

  SetTileMap() {
    const map = this.make.tilemap({
      key: 'tilemap_level2',
      tileWidth: 64,
      tileHeight: 64
    });
    this.mapWidth = map.width * 64;
    this.mapHeight = map.height * 64;
    const tileset = map.addTilesetImage('tileset');
    //Layers del tileMap
    const inviwall = map.createLayer('inviWall', tileset, 0, 0).setDepth(0);
    const ground = map.createLayer('ground', tileset, 0, 0).setDepth(1);
    map.createLayer('fillbghouse', tileset, 0, 0).setDepth(2);
    map.createLayer('bghouse', tileset, 0, 0).setDepth(3);
    const fghouse = map.createLayer('foregroundhouse', tileset, 0, 0).setDepth(4);
    map.createLayer('window', tileset, 0, 0).setDepth(5);
    map.createLayer('roofhouse', tileset, 0, 0).setDepth(6);
    const houseFloor = map.createLayer('grass', tileset, 0, 0).setDepth(7);

    //Implementacion de colisiones
    inviwall.setCollisionByProperty({ collides: true });
    ground.setCollisionByProperty({ collides: true });
    fghouse.setCollisionByProperty({ collides: true });
    houseFloor.setCollisionByProperty({ collides: true });

    //convertir colisiones a matter
    this.matter.world.convertTilemapLayer(inviwall);
    this.matter.world.convertTilemapLayer(ground);
    this.matter.world.convertTilemapLayer(fghouse);
    this.matter.world.convertTilemapLayer(houseFloor);
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
    this.load.image('dust', 'src/assets/sprites/particles/dust.png');
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
  //Crear particulas
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
  
  setDialogues(){ 
  //Dialogo
  this.dialogoInicio = new Dialogue(this,["Aquella iglesia, en aquel templo a la fe ciega conocí a Manuel", "Santo por su devocióón y sacrificio a su rebaño"]);
  this.dialogoInicio.onDialogue = true;

  this.dialogoGuadalupe = new Dialogue(this, ["Señora Guadalupe: ¡Ay de mi, Mi marido falleció hace 3 días!", "Señora Guadalupe: ¡Y no tengo ni una triste flor que dejarle en su lecho"]);
  this.senSorGuadalupe = Phaser.Physics.Matter.Matter.Bodies.circle(this.mapWidth / 2 + 2000, this.mapHeight - 1000, 500,{isSensor:true,isStatic:true});
  this.senSorGuadalupe.label = 'DialogoGuadalupe';

  this.guadalupe.setExistingBody(this.senSorGuadalupe);

  this.matter.world.on('collisionstart',
  (event,BodyA, BodyB)=>{
    if(BodyA.label === 'DialogoGuadalupe'  && BodyB.label === 'player' || BodyB.label === 'DialogoGuadalupe' && BodyA.label === 'player' ){
      this.dialogoGuadalupe.onDialogue = true;
      this.player.invent.changeDialogue(this.dialogoGuadalupe);
      this.player.stopAndStay();
      this.guadalupe.body.destroy(true);
    }
  });

  this.matter.world.on('collisionactive',
  (event,BodyA, BodyB)=>{
    if(BodyA.label === 'DialogoGuadalupe'  && BodyB.label === 'player' || BodyB.label === 'DialogoGuadalupe' && BodyA.label === 'player' ){

      if(!this.dialogoGuadalupe.onDialogue)
        this.player.freeMovement();
    }
  });
  }

  SetEnd(){
    this.final=this.matter.add.image(this.mapWidth -200, this.mapHeight - 1030,);
    this.senSorFinal = Phaser.Physics.Matter.Matter.Bodies.circle(this.mapWidth -200, this.mapHeight - 1030, 200,{isSensor:true,isStatic:true});
    this.senSorFinal.label = 'Final';

    this.final.setExistingBody(this.senSorFinal);

    this.matter.world.on('collisionstart',
    (event,BodyA, BodyB)=>{
      if(BodyA.label === 'Final'  && BodyB.label === 'player' || BodyB.label === 'Final' && BodyA.label === 'player' ){
        this.cameras.main.fadeOut(1000, 0, 0, 0);
      }
    });
  }


  GuadalupeNuevoDialogo(){
    this.dialogoGuadalupeFinal = new Dialogue(this, ["Señora Guadalupe: Muchas Gracias buen señor, ahora Pedro descansa en paz",
    "Pase a mi casa a refugiarse de la lluvia y a calentarse junto al fuego"]);
    this.senSorGuadalupe2 = Phaser.Physics.Matter.Matter.Bodies.circle(this.mapWidth / 2 + 2000, this.mapHeight - 1000, 500,{isSensor:true,isStatic:true});
    this.senSorGuadalupe2.label = 'DialogoGuadalupeFinal';

    this.guadalupe.setExistingBody(this.senSorGuadalupe2);

    this.matter.world.on('collisionstart',
      (event,BodyA, BodyB)=>{
        if(BodyA.label === 'DialogoGuadalupeFinal'  && BodyB.label === 'player' || BodyB.label === 'DialogoGuadalupeFinal' && BodyA.label === 'player' ){
          this.dialogoGuadalupeFinal.onDialogue = true;
          this.player.invent.changeDialogue(this.dialogoGuadalupeFinal);
          this.guadalupe.body.destroy(true);
        }
      });
    
    } 
  }

