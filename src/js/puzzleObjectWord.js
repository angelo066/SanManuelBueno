import Word from './word.js';

export default class PuzzleObjectWord extends Phaser.GameObjects.Container{
    constructor(scene, x, y, keyImage, physicsEnabled, sensorRadius, word, sol){
        super(scene, x, y);
        
        this.sprite = this.scene.matter.add.image(x, y, keyImage, {isStatic:true});
        if(physicsEnabled)//Objeto con fisicas
            this.sprite.isStatic(false);
        //Trigger
        let circle = new Phaser.Physics.Matter.Matter.Bodies.circle(x,y,sensorRadius,{isStatic:true,isSensor:true});
        this.sprite.setExistingBody(circle);    
        //String palabra
        this.word = word;
        this.objectWord = '';
        // this.add(this.sprite); //esto al parecer provoca que no se vea
        this.scene.add.existing(this);
        //Solucion Palabra
        this.sol = sol;
        //Colisiones
        this.scene.matter.world.on('collisionstart', (event)=>{
            let wordBody = this.sprite.body;
            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;

                if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))
                {
                    this.wordAppear();
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
                    if(bodyA === wordBody && bodyB.label === 'player'){
                        this.wordDisappear();
                    }
                    else if(bodyA.label === 'player'){
                        this.wordDisappear();
                    }
                }
            }
        });
    }
    //Flag de puzzle resuelto, poner en el update
    objectSolved(){
        if(this.sol === this.objectWord)
            return true;
        else
            return false;
    }
    //Cambiar escala del sprite
    setScaleSprite(width, height){
        this.sprite.displayWidth = this.sprite.width*width;
        this.sprite.displayHeight = this.sprite.height*height;
    }
    //Animacion de aparicion de palabra
    wordAppear(){
        //Palabra del objeto
        this.objectWord = new Word({
            scene: this.scene,
            x:this.x,
            y:this.y,
            word: this.word,
            interactive: true,
            letter:null
        });
        this.add(this.objectWord);
        this.scene.tweens.add({
            targets: this.objectWord.container,
            scale: {from: 0.2, to: 1},
            alpha:{ from: 0, to: 1},
            x: {from:this.objectWord.x - 50, to: this.objectWord.centerWordPosX()},
            y: this.objectWord.y-150,
            ease: 'Sine.easeInOut',
            duration: 1000
        });
    }
    //Animacion de desaparicion de palabra
    wordDisappear(){
        //Destruir palabra del objeto despues de terminar animacion
        let timeline = this.scene.tweens.createTimeline();
        timeline.add({
            targets: this.objectWord.container,
            scale: {from: 1, to: 0},
            alpha:{ from: 1, to: 0},
            x: {from:this.objectWord.centerWordPosX(), to: this.objectWord.x - 50},
            y: this.y,
            ease: 'Sine.easeInOut',
            duration: 1000
        });
        timeline.play();
        this.remove(this.objectWord);
    }
 }
