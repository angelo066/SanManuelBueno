export default class PuzzleObjectLetter extends Phaser.GameObjects.Sprite{
    constructor(data){
        let {scene, x, y, key, frame, word, letter} = data;
        super(scene, x, y, key, frame);
        this.scene.add.existing(this);
        this.word = new Word({
            scene: scene,
            x: x,
            y: y + 50,
            word: word,
            interactive: false,
            letter: letter
        });
        this.letter = letter;
        //Añadir animaciones personalizables aqui
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