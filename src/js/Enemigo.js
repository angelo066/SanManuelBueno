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
    this.proyectiles = {};
    this.numeroProyectiles =0;
    this.player = player; 


    this.objectWord = new Word({
      scene: this.scene,
      x:this.x + 50,
      y:this.y,
      word: 'rosa',
      interactive: true,
      letter:null
  });
  }
  
  Creapalabra(){
    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -8, 0, this.player);
    
    this.proyectiles[this.numeroProyectiles] = palabra;

    palabra.LanzaProyectil();
    this.numeroProyectiles++;

  }

  preUpdate(){
    
    if(this.timer <= 0){
      
      this.Creapalabra();
      this.timer = this.tiempo;   
    }
    else this.timer--;
  }

}