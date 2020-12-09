import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, L} = data;
        super (scene,x, y,'inventory');
        this.scene.add.existing(this);
        this.Letters=L;
        this.NumElems = 0;

        console.log(y);

        this.word = new Word({
            scene:this.scene,
            x: 70,
            y: this.scene.cameras.main.height-70,
            word: "P",
            interactive: false,
            letter: undefined
          });

        this.word.setScrollFactor(0);

        this.setScale(0.04);
        //POdemos usar el inventario como una clase que contenga una palabra, la cual no se puede reordenar pero si se le pueden añadir y quitar letras.
        //creo que es una buena manera de reutilizar código.
    }

    AddLetter(letrita)
    {
        if(this.NumElems< 6)
        {
            this.word.AddLetter(letrita);
        
            this.NumElems++;
        }
        

        // if(this.NumElems <= 6)
        // {
        //     this.Letters[this.NumElems]=letrita;
        //     this.NumElems++;
        // }
    }

    // EscribeInventario()
    // {
    //     console.log("numero de elementos:" + this.NumElems)
    //     for(let i=0; i<this.NumElems;i++){
    //         console.log(this.Letters)
    //     }
    // }
}