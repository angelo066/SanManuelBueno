import Word from './word.js';

export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
      

        this.scene.add.existing(this);
        this.sprite = this.scene.add.image(this.scene.cameras.main.width-1570, this.scene.cameras.main.height-170, 'selection', {isStatic:true});
        this.sprite.setScale(0.08);
        this.sprite.setScrollFactor(0);
        this.Letters=l;
        this.NumElems = 0;

        this.word = new Word({
            scene:this.scene,
            x: this.scene.cameras.main.width-1800,
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
    }

    AddLetter(letrita)
    {
        if(this.NumElems< 6)
        {
            this.word.AddLetter(letrita);
        
            this.NumElems++;
        }

    }
}