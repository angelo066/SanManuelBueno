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
  }

  Creapalabra(){
    let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,'rosa', -25, 0, this.player);
    // palabra.setIgnoreGravity(true);
    // palabra.setVelocity(-25,0);
    
    this.proyectiles[this.numeroProyectiles] = palabra;

    palabra.LanzaProyectil();
    this.numeroProyectiles++;
    //let palabrita = new Word(this.scene, this.x + 50, this. y, 'Satan', false, null);
    //let letrita = this.scene.matter.add.image(this.x + 50, this.y, this.lettersK);

  }

  preUpdate(){
    
    if(this.timer <= 0){
      this.Creapalabra();
      this.timer = this.tiempo;   
    }
    else this.timer--;
  }

}