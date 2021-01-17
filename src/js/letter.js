export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(data){
        let{scene, x, y, key, frame,interactive, tint} = data
        super(scene, x, y, key, frame);
        this.scene.add.existing(this);
        
        if(interactive)
            this.setInteractive();
        
        this.tinte = tint;

        if(this.tinte)
            this.setTint(0x8efff8);
    }
    //Necesita ser tint igual a true
    SetTint()
    {
        this.tinte = true;
        this.setTint(0x8efff8);
    }

    ClearTint()
    {
        this.clearTint();
        this.tinte = false;
    }
}