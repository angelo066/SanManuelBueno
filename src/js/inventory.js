export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos
        let {scene, L, N} = data;
        super (scene, L, N, 'inventory');
        this.scene.add.existing(this);
        this.Letters=L;
        this.NumElems=N;

        // this.setScale(0.5);
        //CArlos soy maricon
        this.setVisible(true);
        console.log(this.scale);
        this.setScale(0.5);
        console.log(this.scale);
      
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