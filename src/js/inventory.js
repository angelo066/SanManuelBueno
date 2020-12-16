import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
      
        this.selector = 0;
        
        this.scene.add.existing(this);
        this.sprite = this.scene.add.image(this.scene.cameras.main.width-1560 + this.selector *40 , this.scene.cameras.main.height-170, 'selection', {isStatic:true});
        this.sprite.setScale(0.08);
        this.sprite.setScrollFactor(0);
        this.Letters=l;
        this.NumElems = 0;

        this.word = new Word({
            scene:this.scene,
            x: this.scene.cameras.main.width-1570,
            y: this.scene.cameras.main.height-50,
            word: "",
            interactive: false,
            letter: 'letters'
          });
          this.AddLetter("S");
          this.AddLetter("I");
          this.AddLetter("M");
          this.AddLetter("I");
          this.AddLetter("O");
          this.AddLetter("S");
         
          
        this.setScale(0.04);

        this.keycodeD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keycodeA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keycodeW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    preUpdate()
    {
        if (Phaser.Input.Keyboard.JustDown(this.keycodeD)){
            
            if(this.selector<5)
            {
                console.log("you just pressed D");
                this.selector++;

                this.moveSelection(this.scene.cameras.main.width-1570 + this.selector *40);
            }


        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeA)){
            console.log("you just pressed A");

            if(this.selector>0)
                this.selector--;
                
            this.moveSelection(this.scene.cameras.main.width-1570 + this.selector *40);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keycodeW)){
            // console.log("you just pressed W");

            this.word.removeLetter(this.selector);

        }
    }

    AddLetter(letrita)
    {
        if(this.NumElems< 6)
        {
            this.word.AddLetter(letrita);
        
            this.NumElems++;
        }

    }

    moveSelection(x)
    {
        this.sprite.setX(x);
    }
}