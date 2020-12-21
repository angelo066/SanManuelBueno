import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
      
        this.selector = 0;
        this.originX = x-(this.width/2)*0.04 + 60;
        this.scene.add.existing(this);
        this.sprite = this.scene.add.image(this.originX , this.y, 'selection', {isStatic:true}).setDepth(21);
        this.sprite.setScale(0.55);
        this.sprite.setScrollFactor(0);
        this.Letters=l;
        this.offset = 50;
        this.NumElems = 0;
        this.limit = 6;

        this.puzzleToInteract = null;

        this.canAdd = false;

        this.word = new Word({
            scene:this.scene,
            x: this.originX,
            y: this.y,
            word: '',
            interactive: false,
            letter: null
          });
          
        this.word.container.setScrollFactor(0);
        this.word.container.setScale(0.5)
        this.word.container.setDepth(21);

        this.setScale(0.04);
        this.setAlpha(0.6);
        this.keycodeC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keycodeV = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keycodeF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    preUpdate()
    {
        if (Phaser.Input.Keyboard.JustDown(this.keycodeV)){
            
            if(this.selector < this.limit - 1)
            {
                this.selector++;

                this.moveSelection(this.originX + this.selector *this.offset);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeC)){
            if(this.selector>0)
                this.selector--;
                
            this.moveSelection(this.originX + this.selector *this.offset);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeF) && this.canAdd)
        {

            if(!(this.selector + 1 > this.NumElems))
            {
                let letraEliminada = this.word.removeLetter(this.selector, this.offset*2);

                this.NumElems--;
                let n = String.fromCharCode(letraEliminada); 
                console.log(n);

                if(this.puzzleToInteract !== null)
                    this.puzzleToInteract.objectWord.AddLetter(n, this.puzzleToInteract.objectWord.offSetLetter, true);
            }
            // this.moveSelection(this.originX + this.selector *this.offset);
        }
    }

    AddLetter(letrita)
    {
        if(this.NumElems< this.limit)
        {
            this.word.AddLetter(letrita, this.offset*2, false);
        
            this.NumElems++;
        }
        else console.log("Cant add more letters");

    }

    moveSelection(x)
    {
        this.sprite.setX(x);
    }
}