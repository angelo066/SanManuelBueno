export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene, L, N} = data;
        super (scene, L, N, 'inventory');
        this.scene.add.existing(this);
        this.Letters=L;
        this.NumElems=N;

        // this.body;
        // this.body.

        // this.invent = this.add.image(this.game.config.width-400, this.game.config.height - 120, 'inventory');
        // this.invent.setScale(0.4,0.4);
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