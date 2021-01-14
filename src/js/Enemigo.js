import Word from'./word.js';
import Proyectil from './Proyectil.js';
export default class Enemigo extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, key, lettersKey, player, deadWord)
  {
    super(scene, x, y, key);

    this.scene.add.existing(this);

    this.tiempo = 300;      //Timepo que tarda en crear un proyectil
    this.timer=this.tiempo; //Timer para la creación
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

    this.scene.anims.create({
      key:'Boss_idle1',
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle1',{start: 0, end: 7}),
      frameRate: 0,
      repeat: -1
    })

    this.scene.anims.create({
      key:'Boss_idle2',
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle2',{start: 0, end: 2}),
      frameRate: 1,
      repeat: 0
    })

    this.scene.anims.create({
      key:'Boss_Death',
      frames: this.scene.anims.generateFrameNumbers('Boss_Death',{start: 0, end: 5}),
      frameRate: 8,
      repeat: 0
    })

    //Creación de la animación
    this.scene.anims.create({
      key:'Boss_attk1',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck1',{start: 0, end: 7}),
      frameRate: 8,
      repeat: 0
    })

    this.scene.anims.create({
      key:'Boss_attk2',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck2',{start: 0, end: 7}),
      frameRate: 8,
      repeat: 0
    })
  }
  
  Creapalabra()
  {
    if(!this.fase)this.anims.play('Boss_attk1', true);
    else this.anims.play('Boss_attk2', true);

    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -4, 0, this);

    palabra.LanzaProyectil();
  }

  preUpdate(time, delta){
    super.preUpdate(time,delta);

    if(!this.fase) this.anims.play('Boss_idle1',true);  //Ilde
    else this.anims.play('Boss_idle2',true);

    if(this.timer <= 0){
      if(!this.fase){
        this.anims.play('Boss_attk1', true);      //Animación del ataque quiero que se ejecute pero dice que no le apetece
      }
      else this.anims.play('Boss_attk2', true);

      this.Creapalabra();
      this.timer = this.tiempo;  
    }
    else this.timer--;

    if(this.ActualWord.word === this.deadWord){
      //Animación cuando la haya
      if(!this.fase)
      {
        this.anims.play('Boss_Death',true);
        this.fase = true;
      }

      if(this.fase)this.destroy(true);
    }
  }

}