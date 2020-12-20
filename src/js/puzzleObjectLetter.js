import Word from './word.js';

export default class PuzzleObjectLetter extends Phaser.GameObjects.Container{
    constructor(scene, x, y, key,physicsEnabled, sensorRadius, word, letter){
        super(scene, x, y);
        this.sprite = scene.matter.add.image(scene.matter.world, x, y, key,{isStatic:true});
        if(physicsEnabled)//Objeto con fisicas
            this.sprite.isStatic(false);
        //Trigger
        let circle = new Phaser.Physics.Matter.Matter.Bodies.circle(x,y,sensorRadius,{isStatic:true,isSensor:true});
        this.sprite.setExistingBody(circle);
        //String palabra
        this.word = word;
        this.letter = letter;
        this.objectWord = '';
        //Palabra del objeto
        this.objectWord = new Word({
            scene: this.scene,
            x:this.x,
            y:this.y,
            word: this.word,
            interactive: false,
            letter:this.letter
        });
        this.objectWord.container.setVisible(false);
        this.add(this.objectWord);
        //Letra del objeto
        this.letter = letter;
        this.add(this.sprite);
        this.scene.add.existing(this);
        this.solved = false;
        //Colisiones
        this.scene.matter.world.on('collisionstart', (event)=>{
            let wordBody = this.sprite.body;
            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;
                console.log(bodyA);
                console.log(bodyB);
                if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))
                {
                    this.wordAppear();
                }
                if ((bodyA === wordBody && bodyB.label === 'player_attack')|| (bodyB === wordBody && bodyA.label === 'player_attack')) //Aqui no detecta el label del sensor
                {
                    console.log('F');
                    if(this.giveLetter()){
                        this.solved = true;
                        this.scene.matter.world.remove(this.sprite);
                    }
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
    //Flag para devolver letra o destruir las otras
    giveLetter(){
        if(this.objectWord.container.getIndex(this.objectWord.container.last) === 0){
            this.objectWord.destroyWord();
            return true;
        }
        else{
            this.objectWord.destroyCrackedLetter();
            return false;
        }
    }
    //Devolver letra especial
    getLetter(){
        this.solved = false;
        return this.letter;
    }
    //Animacion de aparicion de palabra
    wordAppear(){
        this.objectWord.container.setVisible(true);
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
        this.objectWord.container.setVisible(false);
    }
 }