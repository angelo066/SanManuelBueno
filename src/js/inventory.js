export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, L} = data;
        super (scene,x, y,'inventory');
        this.scene.add.existing(this);
        this.Letters=L;
        this.NumElems = 0;

        this.setScale(0.04);
      
    }

    AddLetter(letrita){
        if(this.NumElems <= 6)
        {
            this.Letters[this.NumElems]=letrita;
            this.NumElems++;
        }
    }

    EscribeInventario(){
        console.log("numero de elementos:" + this.NumElems)
        for(let i=0; i<this.NumElems;i++){
            console.log(this.Letters)
        }
    }
}