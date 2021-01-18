import Dialogue from './dialogue.js';
export default class Outro extends  Phaser.Scene {
  constructor() {
    super({key: 'Outro'});
  }
  //para cargar los recursos
  preload(){
    this.load.image('title', 'src/assets/main_menu/title.png');
    this.load.image('logo','src/WebMedia/brands/studio.png')
    this.load.bitmapFont('lastwords_font','src/assets/fonts/lastwords.png','src/assets/fonts/lastwords.xml');
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
    
    this.dialogo = new Dialogue(this,["Y así me llevé conmigo parte de su agonía", "Lo suficiente como para que me atormente personalmente",
    "Y creo que me atormentará para siempre", "O bueno, hasta que muera", "Entonces, tampoco sufriré mucho"]);
    this.dialogo.onDialogue = true; //flag de activar dialogo

    this.FadeIn();

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.bg.destroy(true);
      this.FadeIn();
      //Gracias por jugar
      this.text = this.add.bitmapText(this.cameras.main.centerX-150,this.cameras.main.height*0.35,'lastwords_font','Muchas gracias por jugar a',80,2).setAlpha(0);
      this.title = this.add.image(this.cameras.main.centerX-50,this.cameras.main.height*0.45,'title').setScale(0.4).setAlpha(0).setOrigin(0,0);
      this.text2 = this.add.bitmapText(this.cameras.main.centerX-500,this.cameras.main.height*0.9,'lastwords_font','Ha sido un duro trabajo hacer esto posible pero mereció la pena.',60,2).setAlpha(0);
      this.logo = this.add.image(this.cameras.main.centerX,this.cameras.main.height,'logo').setScale(0.2).setAlpha(0).setOrigin(0,0);
      let timeline = this.tweens.createTimeline();
        timeline.add({ targets: this.text, alpha: { value: 1, duration: 4000 }});
        timeline.add({ targets: this.title, alpha: { value: 1, duration: 2000 }});
        timeline.add({ targets: this.text2, alpha: { value: 1, duration: 4000 }});
        timeline.add({ targets: this.logo, alpha: { value: 1, duration: 3000 }});
        timeline.play();
        this.input.on('pointerdown', ()=> {
            if(this.logo.alpha === 1){
            this.cameras.main.fadeOut(2000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => { this.scene.start('menu');});
            }
        });
    });
  }

  FadeIn()
  {
    //Camara
    this.cameras.main.fadeIn(4000, 0, 0, 0);
    this.cameras.main.setBounds(0,0,7680, 2560);  
    
    this.cameras.main.zoomTo(0.8, 2000);
  }

  update(){
    if(this.dialogo.endMessage === this.dialogo.i + 1 && !this.finished)
    {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.finished = true;
    }
  }
}