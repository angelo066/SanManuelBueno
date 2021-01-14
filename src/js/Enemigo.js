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
  }
  
  Creapalabra()
  {
    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -4, 0, this.numProyectiles, this);

    palabra.LanzaProyectil();
    this.arrayProyectiles[this.numProyectiles] = palabra;
    
    this.numProyectiles++;

    console.log(palabra.body.id);
  }

  preUpdate(){
    
    if(this.timer <= 0){
      
      this.Creapalabra();
      this.timer = this.tiempo;  
    }
    else this.timer--;

    if(this.ActualWord.word === this.deadWord){
      //Animación cuando la haya

      this.destroy(true);
    }
  }

  destroyProyectil(i)
  {
    console.log(i);
    this.arrayProyectiles[i].objectWord.container.destroy(true);
    this.numProyectiles--;
  }

}