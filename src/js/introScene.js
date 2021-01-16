import Dialogue from './dialogue.js';
export default class Intro extends  Phaser.Scene {
  constructor() {
    super({key: 'Intro'});
  }
  //para cargar los recursos
  preload(){
    this.load.image('text_bg','src/assets/bg/text_bg.png');
    this.load.bitmapFont('dialogue_font','src/assets/fonts/dialogue.png','src/assets/fonts/dialogue.xml');

    this.load.spritesheet({
      key:'intro',
      url:'src/assets/bg/intross.png',
      frameConfig:{
        frameWidth:1920,
        frameHeight:1080
      }
    });
  }

  create(){

    this.anims.create({
      key: 'opening',
      frames: this.anims.generateFrameNumbers('intro', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    this.finished = false;
    this.bg = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY+200, 'intro');
    this.bg.setScale(1.5,1.5);
    this.bg.anims.play('opening', true);
    
    this.dialogo = new Dialogue(this,["Desde hace tiempo, pienso en la vida y en su sentido", "Vaga es la idea de una vida con sentido",
    "Pues un Dios me parece una idea demasiado dulce para lo que esta vida me presenta", "Muerte, guerra, enfermedad y pena no pueden ser la obra de un Dios bondadoso",
    "Mas sin embargo la iglesia y los dirigentes no dejan de nombrarle a él y a su gracia", "¿Qué he de hacer pues Dios mio?",
    "¿Para saber de tu existencia y dejar de padecer esta agonía que me asola a todas horas?",
    "Esto me recuerda a aquella vez que visité aquel pueblecito...",
    "¿Cuál era su nombre?"]);
    this.dialogo.onDialogue = true; //flag de activar dialogo

    this.FadeIn();

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('level1');
    });
  }

  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,7680, 2560);  
    
    this.cameras.main.zoomTo(0.8, 4000);

  }

  update(){
    if(this.dialogo.endMessage === this.dialogo.i + 1 && !this.finished)
    {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.finished = true;
      }
  }
}