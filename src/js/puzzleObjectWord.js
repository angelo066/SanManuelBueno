import Word from './word.js';

export default class PuzzleObjectWord extends Phaser.GameObjects.Container{
    constructor(scene, x, y, keyImage, physicsEnabled, sensorRadius, word, sol,player){
        super(scene, x, y);
        
        if(keyImage !== null)
            this.sprite = scene.matter.add.sprite(x, y, keyImage, {isStatic:true});

        if(physicsEnabled && this.sprite !== undefined)//Objeto con fisicas
            this.sprite.isStatic(false);
        //Trigger
        let circle = new Phaser.Physics.Matter.Matter.Bodies.circle(x,y,sensorRadius,{isStatic:true,isSensor:true});

        if(this.sprite !== undefined)
             this.sprite.setExistingBody(circle);

        //String palabra
        this.word = word;
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
        this.objectWord.container.setVisible(false);
        // this.add(this.sprite); //esto al parecer provoca que no se vea
        this.scene.add.existing(this);
        //Solucion Palabra
        this.sol = sol;
        //Comprobador de que el puzzle está terminado
        this.complete = false;
        //Player
        this.player = player;
        //Variable para que el jugador pueda añadir letras cuando colisione con el puzzle
        //Colisiones

        //Para que cuando se entre en el radio de acción de la palabra esta aparezca y se pueda editar
        this.scene.matter.world.on('collisionstart', (event)=>{

            let wordBody = this.sprite.body;

            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;

                if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))
                {
                    this.wordAppear();
                    this.wordInteractive(true);
                    if(bodyA.label === 'player')
                    {
                        bodyA.gameObject.invent.canAdd = true;
                        bodyA.gameObject.invent.puzzleToInteract = this;
                    }
                    
                    if(bodyB.label === 'player')
                    {
                        bodyB.gameObject.invent.canAdd = true;
                        bodyB.gameObject.invent.puzzleToInteract = this;
                    }
                }
            }
        });

        this.scene.matter.world.on('collisionactive', (event)=>{

            let wordBody = this.sprite.body;

            for (let i = 0; i < event.pairs.length; i++)
            {
                let bodyA = event.pairs[i].bodyA;
                let bodyB = event.pairs[i].bodyB;

                if ((bodyA === wordBody && bodyB.label === 'player')|| (bodyB === wordBody && bodyA.label === 'player'))   
                {
                    if(bodyA.label === 'player')
                    {
                        if(this.objectWord.letter_selected !== null && this.objectWord.letter_selected.tinte)
                        {
                            bodyA.gameObject.playerController.letter_Selected = this.objectWord.letter_selected;
                        }
                        if(this.objectWord.letter_selected === null) bodyA.gameObject.playerController.letter_Selected = null;
                    } 
                    
                    if(bodyB.label === 'player')
                    {
                        if(this.objectWord.letter_selected !== null && this.objectWord.letter_selected.tinte)
                        {
                            bodyB.gameObject.playerController.letter_Selected = this.objectWord.letter_selected;
                        }

                        if(this.objectWord.letter_selected === null) bodyB.gameObject.playerController.letter_Selected = null;
                    } 
                }
            }
        });

        //Para que cuando se salga del campo de colisión con la palabra esta desaparezca y ya no se pueda editar
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
                        this.wordDisappear();
                        this.wordInteractive(false);
                        
                        if(bodyB.label === 'player')
                        {
                            bodyB.gameObject.playerController.letter_Selected = null;
                            bodyB.gameObject.invent.canAdd = false;
                        }
                        else if(bodyA.label === 'player')
                        {
                            bodyA.gameObject.playerController.letter_Selected = null;
                            bodyA.gameObject.invent.canAdd = false;
                        } 
                    }
                }
            }

        });
    }

    preUpdate()
    {
        if(this.player !== undefined)
            this.objectWord.activateStrikeMode(this.player.playerController.isStriking);
        else
            this.objectWord.interactive = true;
    }

    //Flag de puzzle resuelto, poner en el update
    objectSolved(){
        if(this.sol === this.objectWord.word){

            if(this.sprite !== undefined)
            {
                this.scene.matter.world.remove(this.sprite.body);
                //esto es por si en algun momento se soluciona el puzzle añadiendo una letra y ya está.
                if(this.objectWord.selector!== undefined) this.objectWord.selector.destroy();
            }

            this.objectWord.destroy();
            return true;
        }
        else
            return false;
    }
    changeAlpha(value){
        this.sprite.alpha = value;
    }
    changeImage(image){
        this.sprite.setTexture(image);
    }
    //Cambiar escala del sprite
    setScaleSprite(width, height){
        this.sprite.displayWidth = this.sprite.width*width;
        this.sprite.displayHeight = this.sprite.height*height;
    }
    //Animacion de aparicion de palabra
    wordAppear(){

        this.objectWord.container.setVisible(true);
        this.scene.tweens.add({
            targets: this.objectWord.container,
            scale: {from: 0.2, to: 1},
            alpha:{ from: 0, to: 1},
            x: {from:this.objectWord.x - 50,  to: this.objectWord.centerWordPosX()},
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

        if(this.objectWord.selector!==undefined)
            this.objectWord.selector.destroy();

        this.objectWord.letter_selected = null;
        // this.objectWord.container.setVisible(false);
    }

    wordInteractive(bool){
        this.objectWord.interactive = bool;
    }

 }
