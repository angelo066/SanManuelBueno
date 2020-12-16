import BaseScene from './BaseScene.js';
import Player from './player.js';
import Word from './word.js';

let platforms;
export default class Scene2 extends BaseScene {
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
    this.load.spritesheet({
      key:'bell', 
      url:'src/assets/sprites/letters/bell.png',
      frameConfig:{
        frameWidth:120,
        frameHeight:120
      }
    })
    this.load.image('guardia','src/assets/platforms/grass.png');
    this.load.image('ground', 'src/assets/platforms/grass.png');
    this.load.image('background3', 'src/assets/bg/bg.png');
    this.load.image('Fondo', 'src/assets/caseta/Plantilla.png');
    this.load.image('puerta','src/assets/caseta/Plantilla.png');
    this.load.image('estanteria','src/assets/caseta/Plantilla.png');
    this.loag.image('cuerda','src/assets/caseta/Plantilla.png');
  }
//coloca objetos apartir de los assets dentro de la escena
  create() 
  {
    //BG
    this.add.image(this.game.config.width/2,this.game.config.height/2, 'background3').setScale(2.13,2.13);
    //Platform and player
    platforms = this.physics.add.staticGroup();    

    this.player = new Player(this, this.game.config.width/8, this.game.config.height*0.8);

    this.CreaPuerta;
    this.CrearPlataformasIglesia(); 
    //Estantería 
    this.add.image(100,100,'estanteria').setScale(1,1);

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
      word: 'Guardia'
    });

    //Puzzle2
    this.physics.add.collider(this.player, platforms);
    this.word2 = new Word({
      scene: this,
      x: this.game.config.width* 0.4,
      y: this.game.config.height/3,
      word: 'Educar'
    });

    //Puzzle3
    this.physics.add.collider(this.player, platforms);
    this.word3 = new Word({
      scene: this,
      x: this.game.config.width* 0.4,
      y: this.game.config.height/3,
      word: 'Cortar'
    });

    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,this.sky.displayWidth, this.sky.displayHeight*2);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.3);
    this.complete = false;
    this.complete2 = false;
    this.complete3 = false;
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta)
  {
    //Sale por un lado y entra por el otro
    this.player.checkPos(this.game.config.width);
    if(this.player.checkPos(this.game.config.width)){
      this.scene.start('menu');
    }

    if(this.word === 'Guarida' && !this.complete){
      this.physics.destroy(this.puerta);
      this.complete=true;
    }

    if(this.word2 ==="Cuerda" && !this.complete2){
      //Crear cuerda
      this.CreaCuerda();
      this.complete2=true;
    }

    if(this.word3 ==="Tocar" && !this.complete3){
      //Tocar campana pasar de nivel
      this.TocarCampana();
      this.complete3=true;
    }
  }

  CreaPuerta(){
    //Caseta
    this.puerta=this.physics.add.staticGroup();
    this.walls.create(this.game.config.width-300,this.game.config.height-500).setScale(0.75,0.75).refreshBody();
    //Puerta
    this.add.image(this.game.config.width - 550, this.game.config.height-540,'Puerta').setScale(0.33,0.33);

    this.physics.add.collider(this.player, this.puerta);
  }

  CreaCuerda(){
    //Caseta
    this.cuerda=this.physics.add.staticGroup();
    this.cuerda.create(this.game.config.width-300,this.game.config.height-500).setScale(0.75,0.75).refreshBody();
    //Puerta
    this.add.image(this.game.config.width - 550, this.game.config.height-540,'Cuerda').setScale(0.33,0.33);

    this.physics.add.collider(this.player, this.cuerda);
  }

  TocarCampana(){
    //Animación y sonido
    //Pasar de escena
  }

  CrearPlataformasIglesia(){
    this.platIglesia=this.physics.add.staticGroup();
    this.platIglesia.create(this.game.config.width-300,this.game.config.height-500).setScale(0.75,0.75).refreshBody();
    this.platIglesia.create(this.game.config.width - 800, this.game.config.height-500);

    this.platIglesia.children.iterate(function(child){
      child.body.setSize(50,450);
      child.setOffset(0, 0);
    });
  }
}