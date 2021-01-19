import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Enemigo from './Enemigo.js';
import Dialogue from './dialogue.js';
export default class LevelBoss extends  Phaser.Scene {
  constructor() {
    super({key: 'Boss'});
  }
  //para cargar los recursos
  preload() 
  {
    this.LoadEssentialAssets();

    this.loadBossAssets();

    this.load.image('text_bg','src/assets/bg/text_bg.png');
    this.load.bitmapFont('dialogue_font','src/assets/fonts/dialogue.png','src/assets/fonts/dialogue.xml')

    this.load.image('wordBg', 'src/assets/sprites/Boss/wordbg.png');
    this.load.image('boss_bg', 'src/assets/iglesia/church.png');
    this.load.image('tileset','src/assets/tiles/tileset.png');
    this.load.image('benches', 'src/assets/iglesia/church_bench.png')
    this.load.audio('bandaSonora','src/assets/sonido/bandasonoracompr.mp3');
    this.load.tilemapTiledJSON('tilemap_level_boss', 'src/assets/tiles/level_boss.json');
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    this.finished=false;

    this.InitSound();
    
    //TileMap
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
    this.SetDialogues();
    //Player
    this.player = new Player(this, this.mapWidth*0.1, this.cameras.main.height, 'player_run', 0,this.dialogoInicial);
    this.player.setDepth(1);
    
    this.boss= new Enemigo(this, this.mapWidth*0.9 , this.mapHeight*0.65,'Boss',this.player, "voz", "fe");
    this.boss.setScale(0.15);
    this.boss.flipX = true;
    
    
    this.FadeIn();
    
    this.SetAnims();

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('Outro');
    });
  }
  //Inicia la banda sonora
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
    if(this.dialogoInicial.endMessage === this.dialogoInicial.i + 1 && !this.dialogoInicialFinished)
    {
      this.boss.agresivo = true;
      this.dialogoInicialFinished = true;
    }
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

  SetAnims() {
    //Animaciones del jefe
    this.anims.create({
      key: 'Boss_idle1',
      frames: this.anims.generateFrameNumbers('Boss_Idle1', { start: 0, end: 7 }),
      frameRate: 3,
      repeat: 0
    });

    this.anims.create({
      key: 'Boss_idle2',
      frames: this.anims.generateFrameNumbers('Boss_Idle2', { start: 0, end: 2 }),
      frameRate: 1,
      repeat: 0
    });

    this.anims.create({
      key: 'Boss_Death',
      frames: this.anims.generateFrameNumbers('Boss_Death', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'Boss_attk1',
      frames: this.anims.generateFrameNumbers('Boss_attck1', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'Boss_attk2',
      frames: this.anims.generateFrameNumbers('Boss_attck2', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.boss.on('animationcomplete', function (anim, frame) {
      this.boss.emit('animationcomplete_' + anim.key, anim, frame);
    }, this);
    this.boss.on('animationcomplete_Boss_attk1', () => {
      this.boss.states.atacando = false;
      this.boss.states.idle = true;
    });
  }

  SetDialogues(){
    const bossPosX = this.mapWidth*0.9;
    const bossPosY = this.mapHeight*0.65;

    this.dialogoInicialFinished =false;

    this.trigger = this.matter.add.sprite(bossPosX , bossPosY);
    this.dialogoInicial = new Dialogue(this, ["Don Manuel: Buenas, hijo mio,¿Qué te trae por nuestra iglesia?","He oido Padre, que es usted especial",
    "Don Manuel:Pues has debido oir mal hijo mio", "Don Manuel:Pues no soy más que un hombre de Dios", "He oido que ha perdido usted la fe Padre",
    "Don Manuel:¡No digas sandeces... Yo no... Yo nunca..."]);
    this.sensorInicial = Phaser.Physics.Matter.Matter.Bodies.circle(bossPosX , bossPosY, 1000,{isSensor:true,isStatic:true});
    this.sensorInicial.label = "inicial";

    this.trigger.setExistingBody(this.sensorInicial);

    this.matter.world.on('collisionstart',
    (event,BodyA, BodyB)=>{
      if(BodyA.label === 'inicial'  && BodyB.label === 'player' || BodyB.label === 'inicial' && BodyA.label === 'player' ){
        this.dialogoInicial.onDialogue = true;
        this.trigger.body.destroy(true);
        
      }
    });
  
    this.dialogoIntermedio = new Dialogue(this,["DOn Manuel: ¡Aléjate de mi templo y de mi rabaño!"]);

    this.dialogoFinal = new Dialogue(this, ["...","...", "Así es hijo mío", "No creo más en Dios",
    "¿Has hablado con Lázaro? es un hombre de ciencia del pueblo", "Me ha hablado tanto de ciencia",
    "Tantas cosas que explicabamos mediante Dios, ahora ya no son Dios",
    "Y me hace pensar, ¿Por qué iba a ser nada Dios?", "¿No será simplemente la dulce las mentiras?",
    "Contada desde el albor de los tiempos, para que no le tengamos miedo a la vida",
    "Hijo mío, no puedo dejar que mis feligreses se enteren",
    "No quiero que pasen por la misma agonía que yo", "La agonía de saber que nada importa", "Que todos estamos condenados a lo mismo",
    "Pues mi sentido común me dice que después de esto solo hay oscuridad y polvo", "Ya no entiendo nada hijo mío",
    "Ahora por favor déjame solo, con mi angustia", "Mi angustia y mi deber de cuidar de mi pueblo."])
  }

  PlayDialogoIntermedio(){
    this.dialogoIntermedio.onDialogue = true;
    this.player.invent.changeDialogue(this.dialogoIntermedio);
  }

  PlayDialogoFinal(){
    this.dialogoFinal.onDialogue = true;
    this.player.invent.changeDialogue(this.dialogoFinal);
  }


}