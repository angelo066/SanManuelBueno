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

    this.arrayProyectiles = {};   //Para destruir los proyectiles 1 a 1
    this.numProyectiles = 0;      //Lo mismo

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
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle1',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key:'Boss_idle2',
      frames: this.scene.anims.generateFrameNumbers('Boss_Idle2',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key:'Boss_Death',
      frames: this.scene.anims.generateFrameNumbers('Boss_Death',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key:'Boss_attk1',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck1',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })

    this.scene.anims.create({
      key:'Boss_attk2',
      frames: this.scene.anims.generateFrameNumbers('Boss_attck2',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
    })
  }
  
  Creapalabra()
  {
    if(!this.fase)this.anims.play('Boss_attk1', true);
    else this.anims.play('Boss_attk2', true);

    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -4, 0, this.numProyectiles, this);

    palabra.LanzaProyectil();
    this.arrayProyectiles[this.numProyectiles] = palabra;
    
    this.numProyectiles++;

    console.log(palabra.body.id);
  }

  preUpdate(){
    if(!this.fase)this.anims.play('Boss_Idle1',true);
    else this.anims.play('Boss_Idle2',true);

    if(this.timer <= 0){
      
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

  destroyProyectil(i)
  {
    console.log(i);
    this.arrayProyectiles[i].objectWord.container.destroy(true);
    this.numProyectiles--;
  }

}