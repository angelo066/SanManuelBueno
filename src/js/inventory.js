export default class Inventory extends Phaser.GameObjects.Sprite{
    constructor(data){
            //Letras   //Número de elemtos 
        let {scene, L, N} = data;
        super (scene, L, N);
        this.scene.add.existing(this);
        this.Letters=L;                             
        this.NumElems=N;
    }

    AddLetter(letrita){
        this.Letters[this.NumElems]=letrita;
        this.NumElems++;
    }
   
    EscribeInventario(){
        console.log("numero de elementos:" + this.NumElems)
        for(let i=0; i<this.NumElems;i++){
            console.log(this.Letters)
        }
        // this.AddLetter('M');
        // this.AddLetter('T');
        // console.log("numero de elementos:" + this.NumElems)
        // for(let i=0; i<this.NumElems;i++){
        //     console.log(this.Letters)
        // }
    }
}