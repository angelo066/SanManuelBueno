export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(data){
        let{scene, x, y, key, frame,interactive} = data
        super(scene, x, y, key, frame);
        this.scene.add.existing(this);
        if(interactive)
            this.setInteractive();
    }
}