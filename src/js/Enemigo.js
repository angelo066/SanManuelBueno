import Word from'./word.js';
import Proyectil from './Proyectil.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
export default class Enemigo extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, key, player, deadWord, finalDeadWord)
  {
    super(scene, x, y, key);

    this.scene.add.existing(this); //Para que se renderice

    this.time = 10000;      //Timepo que tarda en crear un proyectil

    this.lettersK = ["Vida" , "Oracion", "Zanjar", "Falso", "Eternidad"];   //Para las letras
  
    this.player = player;     //Para comprobar su posicion

    this.finalDeadWord = finalDeadWord; // Palabra para dejar de morir

    this.Word = new PuzzleObjectWord(this.scene, this.x-500, this.y, 'wordBg', false, 900, '', deadWord, this.player);
    this.Word.setScaleSprite(0.5,0.5);


    this.fase=false; //False cuando está en primera y true cuando está en segunda


    //Timer de phaser
    var timer = scene.time.addEvent({
      delay: this.time,                // ms
      callback: () => {
          if(this.agresivo){
          if(this.player.x < this.x)
            this.Creapalabra(1);
          else this.Creapalabra(-1);
          this.states.atacando = true;
          this.states.idle=false;
        }

      },
      loop: true
    });

    
    this.states = {
      idle: true,
      atacando: false,
      muriendo: false
    };

    this.agresivo = false;
    
    this.muerto = false; 
  }

  preUpdate(time, delta){
    super.preUpdate(time,delta);
  
    //Compruebo si se muere
    if(this.Word.objectSolved() && !this.Word.complete){
      //Animación y cambio de fase

      this.fase = true;
      this.scene.PlayDialogoIntermedio();
      this.fase = true;
      this.scene.PlayDialogoIntermedio();
      this.fase = true;
      this.scene.PlayDialogoIntermedio();
      this.finalPuzzle = new PuzzleObjectWord(this.scene, this.x-500, this.y, 'wordBg', false, 900, '', this.finalDeadWord, this.player);
      this.finalPuzzle.setScaleSprite(0.5,0.5);
      this.Word.complete=true;

    }

    if(this.finalPuzzle != undefined && this.finalPuzzle.objectSolved() && !this.finalPuzzle.complete){
      this.agresivo = false;
      this.scene.PlayDialogoFinal();
      this.states.muriendo = true;
      this.states.atacando = false;
      this.states.idle = false;
      this.finalPuzzle.complete = true;
    }

    if(this.scene.dialogoFinal.endMessage === this.scene.dialogoFinal.i + 1 && !this.finished)
    {
      this.scene.cameras.main.fadeOut(1000, 0, 0, 0);
      this.finished = true;
    }

    this.ManejaEstados();
  }

  ManejaEstados(){
    //Método para que las animaciones no se pisen las unas a las otras y poder así ejecutarlas corretamente

    if(this.states.idle){
      if(!this.fase)this.anims.play('Boss_idle1', true);
      else this.anims.play('Boss_idle2', true);
    }
    else if(this.states.atacando){
      if(!this.fase)this.anims.play('Boss_attk1',true);
      else this.anims.play('Boss_attk2',true);
    }
    else if(!this.muerto){
      this.anims.play('Boss_Death',true);
      this.muerto = true;
    } 
  }
  //Dir: Para saber si es izq o derecha
  Creapalabra(dir)
  {
      const letter  = Phaser.Math.Between(0,this.lettersK.length-1);

      const posY = (this.y + this.player.y) / 2;

      let palabra = new Proyectil(this.scene.matter.world,this.x + 50, posY ,this.lettersK[letter], -4*dir, 0, this, this.player);
      palabra.LanzaProyectil();
  }

}