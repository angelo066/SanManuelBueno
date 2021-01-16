import Word from'./word.js';
import Proyectil from './Proyectil.js';
export default class Enemigo extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, key, lettersKey, player, deadWord)
  {
    super(scene, x, y, key);

    this.scene.add.existing(this); //Para que se renderice

    this.time = 1500;      //Timepo que tarda en crear un proyectil
    this.lettersK = lettersKey;   //Para las letras
    this.player = player;     //Para comprobar su posicion

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

    //his.SetAnims();


    //Timer de phaser
    var timer = scene.time.addEvent({
      delay: this.time,                // ms
      callback: () => {
        if(this.player.x < this.x)
            this.Creapalabra(1);
        else this.Creapalabra(-1);
        this.states.atacando = true;
        this.states.idle=false;
      },
      loop: true
    });

    
    this.states = {
      idle: true,
      atacando: false,
      muriendo: false
    };

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

  ManejaEstados(){
    //Método para que las animaciones no se pisen las unas a las otras y poder así ejecutarlas corretamente

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
  //Dir: Para saber si es izq o derecha
  Creapalabra(dir)
  {
    // if(this.player.x < this.x)
      let palabra = new Proyectil(this.scene.matter.world,this.x + 50, this. y,this.lettersK, -4*dir, 0, this);
      palabra.LanzaProyectil();
  }

}