export default class PuzzleObjectWord extends Phaser.GameObjects.Sprite{
    constructor(data){
        let {scene, x, y, key, frame, word, sol} = data;
        super(scene, x, y, key, frame);
        this.scene.add.existing(this);
        this.word = new Word({
            scene: scene,
            x: x,
            y: y + 50,
            word: word,
            interactive: true,
            letter: null
        });
        this.sol = sol;
        //Añadir animaciones personalizables aqui
    }
    //Flag de puzzle resuelto
    puzzlesSolved(){
        if(this.sol === this.word)
            return true;
        else
            return false;
    }
 }
