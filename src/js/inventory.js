export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene,x, y, l} = data;
        super (scene,x, y,'inventory');
        this.scene.add.existing(this);
        this.letters=l;
        this.numElems = 0;
        this.setScale(0.04);
    }

    AddLetter(letrita){
        if(this.numElems <= 6)
        {
            this.letters[this.numElems]=letrita;
            this.numElems++;
        }
    }

    EscribeInventario(){
        console.log("numero de elementos:" + this.numElems)
        for(let i=0; i<this.numElems;i++){
            console.log(this.netters)
        }
    }
}