import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
 
        const {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
      
        this.originX = x-300;
        this.scene.add.existing(this); //Para que empiece a renderizar
        
        this.selector = 0;      //Indice del vector de letras donde estamos

        //Objeto que nos indica donde estamos del inventario
        this.selection = this.scene.add.image(this.originX , this.y, 'selection', {isStatic:true}).setDepth(21);
        this.selection.setScale(0.9);
        this.selection.setScrollFactor(0);

        this.Letters=l;
        this.offset = 95;
        this.Letteroffset = 60;
        this.NumElems = 0;
        this.limit = 6;     //Límite para que no se salgan de la imagen del inventario
        this.canAdd = false;    //Boleano para no poder eliminarte letras fuera un puzzle

        //Puzzle para pasar la letra seleccionada
        this.puzzleToInteract = null;


        this.word = new Word({
            scene:this.scene,
            x: this.originX,
            y: this.y,
            word: '',
            interactive: false,
            letter: null
          });
        //Tamaño de las letras
        this.word.container.setScrollFactor(0);
        this.word.container.setScale(0.8)
        this.word.container.setDepth(21);
        //Tamaño del inventario 
        this.setScale(0.08);
        this.setAlpha(0.7);
        this.keycodeC = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.keycodeV = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.keycodeF = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    preUpdate()
    {
        //Moverse a la izquierda en el inventario
        if (Phaser.Input.Keyboard.JustDown(this.keycodeV)){
            
            if(this.selector < this.limit - 1)
            {
                this.selector++;

                this.moveSelection(this.originX + this.selector *this.offset);
            }
        }
        //Moverse a la derecha
        if (Phaser.Input.Keyboard.JustDown(this.keycodeC)){
            if(this.selector>0)
                this.selector--;
                
            this.moveSelection(this.originX + this.selector *this.offset);
        }

        //Añadir (si se puede) una letra a un puzzle
        if (Phaser.Input.Keyboard.JustDown(this.keycodeF) && this.canAdd)
        {

            if(!(this.selector + 1 > this.NumElems))
            {
                let letraEliminada = this.word.removeLetter(this.selector, this.Letteroffset*2);

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
        //Añadir una letra al inventario
        if(this.NumElems< this.limit)
        {
            this.word.AddLetter(letrita, this.Letteroffset*2, false);
        
            this.NumElems++;
        }
        else console.log("Cant add more letters");

    }

    moveSelection(x)
    {
        this.selection.setX(x);
    }
}