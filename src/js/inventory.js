import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
      
        this.selector = 0;
        
        this.scene.add.existing(this);
        this.sprite = this.scene.add.image(this.scene.cameras.main.width-1570 + this.selector *50 , this.scene.cameras.main.height-173, 'selection', {isStatic:true});
        this.sprite.setScale(0.55);
        this.sprite.setScrollFactor(0);
        this.Letters=l;

        this.offset = 55;
        this.NumElems = 0;
        this.limit = 6;

        this.word = new Word({
            scene:this.scene,
            x: this.scene.cameras.main.width-1570,// TODO: Revisar numeritos pochos
            y: this.scene.cameras.main.height-50,
            word: "",
            interactive: false,
            letter: 'letters'
          });
        //   this.AddLetter("S");
        //   this.AddLetter("A");
        //   this.AddLetter("B");
        //   this.AddLetter("I");
        //   this.AddLetter("O");
        //   this.AddLetter("S");
          
        this.setScale(0.04);

        this.keycodeD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keycodeA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keycodeW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    preUpdate()
    {
        if (Phaser.Input.Keyboard.JustDown(this.keycodeD)){
            
            if(this.selector < this.limit - 1)
            {
                console.log("you just pressed D");
                this.selector++;

                this.moveSelection(this.scene.cameras.main.width-1570 + this.selector *this.offset);
            }


        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeA)){
            console.log("you just pressed A");

            if(this.selector>0)
                this.selector--;
                
            this.moveSelection(this.scene.cameras.main.width-1570 + this.selector *this.offset);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeW))
        {
            console.log("you just pressed W");

            // if(this.selectordad)

            if(!(this.selector + 1 > this.NumElems))
            {
                this.word.removeLetter(this.selector, this.offset);

                this.NumElems--;
            }
          

            // console.log(this.NumElems);
            
            this.moveSelection(this.scene.cameras.main.width-1570 + this.selector *this.offset);

        }
    }

    AddLetter(letrita)
    {
        if(this.NumElems< this.limit)
        {
            this.word.AddLetter(letrita, this.offset);
        
            this.NumElems++;

            console.log(this.NumElems);
        }
        else console.log("Cant add more letters");

    }

    moveSelection(x)
    {
        this.sprite.setX(x);
    }
}