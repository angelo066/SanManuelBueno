import Word from "./word.js";

export default class Dialogo{
    constructor(scene, x, y, text, bocadillo, sensorR){
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.text=text;
      

        this.sprite = this.scene.matter.add.image(this.x,this.y,bocadillo,{isStatic:true});
        
        this.dialogue=this.scene.add.text(this.x,this.y);
        this.dialogue.setAlign('center');

        this.dialogue.setFont('Calibri');
        this.dialogue.setFontSize(50);

        this.dialogue.setStroke('#000000', 6)
        this.dialogue.setFill('#43d637');
        this.dialogue.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);


        this.radius= new Phaser.Physics.Matter.Matter.Bodies.circle(this.x, this.y, sensorR,{isStatic:true,isSensor:true});
        this.sprite.setExistingBody(this.radius);

        this.scene.add.existing(this);

        this.dialogue.setAlpha(0);
        this.sprite.setAlpha(0);

        this.scene.matter.world.on('collisionstart', (event)=>{
            let wordBody = this.sprite.body;
            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;

                if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))
                {

                    this.MuestraTexto();
                }
            }
        });


        this.scene.matter.world.on('collisionend', (event)=>{
            let wordBody = this.sprite.body;
            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;

                if (bodyA === wordBody || bodyB === wordBody)
                {
                    if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))
                    {
                        this.EscondeTexto();
                    }
                }
            }

        });
        
    }

    MuestraTexto(){
        this.scene.tweens.add({
            targets: this.sprite,
            scale: {from: 0.2, to: 1},
            alpha:{ from: 0, to: 1},
            x: {from:this.x - 50, to: this.x},
            y: this.y-150,
            ease: 'Sine.easeInOut',
            duration: 1000
        })

        this.scene.tweens.add({
            targets: this.dialogue,
            scale: {from: 0.2, to: 1},
            alpha:{ from: 0, to: 1},
            x: {from:this.x - 50, to: this.x},
            y: this.y-150,
            ease: 'Sine.easeInOut',
            duration: 1000
        })
        
    }

    EscondeTexto(){
       //Destruir palabra del objeto despues de terminar animacion
       let timeline = this.scene.tweens.createTimeline();
       timeline.add({
           targets: this.dialogue,
           scale: {from: 1, to: 0},
           alpha:{ from: 1, to: 0},
           x: {from:this.x, to: this.x - 50},
           y: this.y,
           ease: 'Sine.easeInOut',
           duration: 1000
       });

       //Destruir palabra del objeto despues de terminar animacion
       timeline.add({
           targets: this.sprite,
           scale: {from: 1, to: 0},
           alpha:{ from: 1, to: 0},
           x: {from:this.x, to: this.x - 50},
           y: this.y,
           ease: 'Sine.easeInOut',
           duration: 1000
       });
       timeline.play();
    }

    CambiaTexto(newText){
        this.text = newText;
    }
}