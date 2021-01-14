import Word from'./word.js';
import Proyectil from './Proyectil.js';
export default class Enemigo extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, key, lettersKey, player)
  {
    super(scene, x, y, key);

    this.scene.add.existing(this);

    this.tiempo = 300;
    this.timer=this.tiempo;
    this.lettersK = lettersKey;
    this.player = player; 

    this.can = true;

    this.arrayProyectiles = {};
    this.numProyectiles = 0;

    this.cosas;
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
  }

  destroyProyectil(i)
  {
    console.log(i);
    this.arrayProyectiles[i].objectWord.container.destroy(true);
    this.numProyectiles--;
  }

}