export default class Dialogue extends Phaser.GameObjects.Container{
    constructor(scene, message){
        super(scene, 0, 0);
        //BG DEL TEXTO
        this.scene.add.existing(this);
        this.bg = this.scene.add.image(this.scene.cameras.main.centerX, this.scene.cameras.main.height*0.975,'text_bg').setDepth(30);
        this.bg.displayWidth = this.bg.width*1.25;
        this.bg.displayHeigth = this.bg.height*1.25;
        this.bg.setScrollFactor(0);
        this.i = 0;
        //Dialogo
        this.dialogue = this.scene.add.bitmapText((this.bg.x - this.bg.width/2) - 120,(this.bg.y-this.bg.height/2)+60,'dialogue_font',message[this.i],80,0).setDepth(30);
        this.dialogue.setScrollFactor(0);
        this.counter = 0;
        this.endMessage = message.length;
        //flag de dialogo activo
        this.onDialogue = false;
        this.scene.input.on('pointerdown', ()=> {
            if(this.onDialogue){
                if(this.i<message.length-1){
                    this.i++;
                    this.dialogue.setText(message[this.i]);
                }
                else{
                    this.onDialogue = false;   
                }
            }
        });
    }

    preUpdate(time, delta){
        if(!this.onDialogue){
            this.bg.setAlpha(0);
            this.dialogue.setAlpha(0);
        }
        else{
            this.bg.setAlpha(1);
            this.dialogue.setAlpha(1);
        }
    }
}