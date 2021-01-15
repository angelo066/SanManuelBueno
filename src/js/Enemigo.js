import Word from'./word.js';
import Proyectil from './Proyectil.js';
export default class Enemigo extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, key, lettersKey, player, deadWord)
  {
    super(scene, x, y, key);

    this.scene.add.existing(this);

    this.time = 1500;      //Timepo que tarda en crear un proyectil
    this.lettersK = lettersKey;   //Para las letras
    this.player = player;     //Para hacerle daño

    this.deadWord = deadWord;   //Palabra para derrotarlo

    this.ActualWord = new Word({      //Palabra formada actualmente
      scene: this.scene,
      x:this.x,
      y:this.y,
      word: '',
      interactive: true,
      letter:null
    });

    this.fase=false; //False cuando está en primera y true cuando está en segunda

    this.SetAnims();

    var timer = scene.time.addEvent({
      delay: this.time,                // ms
      callback: () => {
        this.Creapalabra();
        this.states.atacando = true;
        this.states.idle=false;
      },
      loop: true
    });

  }

  preUpdate(time, delta){
    super.preUpdate(time,delta);

    //Compruebo si se muere
    if(this.ActualWord.word === this.deadWord){
      //Animación y cambio de fase
      if(!this.fase)this.fase = true;
      else this.states.muriendo=true;
    }

    this.ManejaEstados();
  }

  SetAnims() {
    this.scene.anims.create({
      key: 'Boss_idle1',
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle1', { start: 0, end: 7 }),
      frameRate: 3,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'Boss_idle2',
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle2', { start: 0, end: 2 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'Boss_Death',
      frames: this.scene.anims.generateFrameNumbers('Boss_Death', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'Boss_attk1',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck1', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'Boss_attk2',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck2', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: 0
    });

    this.states = {
      idle: true,
      atacando: false,
      muriendo: false
    };

    this.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, this);
    this.on('animationcomplete_Boss_attk1', () => {
      this.states.atacando = false;
      this.states.idle = true;
    });
  }

  ManejaEstados(){
    if(this.states.idle){
      if(!this.fase)this.anims.play('Boss_idle1', true);
      else this.anims.play('Boss_Idle2', true);
    }
    else if(this.states.atacando){
      if(!this.fase)this.anims.play('Boss_attk1',true);
      else this.anims.play('Boss_attk2',true);
    }
    else this.anims.play('Boss_Death',true);
  }
  
  Creapalabra()
  {
    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -4, 0, this);

    palabra.LanzaProyectil();
  }

}