import Word from './word.js';

export default class PuzzleObjectLetter extends Phaser.GameObjects.Container{
    constructor(scene, x, y, key, word, letter){
        let sprite;
        if(physics)//Objeto con fisicas
            sprite = new Phaser.Physics.Matter.Sprite(scene.matter.world, 0, 0, key, null);
        else
            sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, key, null);
        //Trigger
        let trigger = new Phaser.Physics.Matter.Bodies.circle(0,0,sensorRadius,{isSensor:true});
        //Palabra del objeto
        let objectWord = new Word({
            scene: scene,
            x: 0,
            y: 50,
            word: word,
            interactive: false,
            letter: letter
        });
        super(scene, x, y,[sprite,trigger,objectWord]);
        //instancias de los hijos del container
        this.sprite = sprite;
        this.trigger = trigger;
        this.word = objectWord;
        //Letra del objeto
        this.letter = letter;
        this.scene.add.existing(this);
    }
    //Flag para devolver letra o destruir las otras
    giveLetter(){
        if(this.word === this.letter){
            this.word.destroyWord();
            return false;
        }
        else{
            this.word.destroyCrackedLetter();
            return false;
        }
    }
    //Devolver letra especial
    getLetter(){
        return this.letter;
    }
 }