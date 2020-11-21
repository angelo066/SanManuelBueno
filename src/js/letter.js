export default class Letter extends Phaser.GameObjects.Sprite{
    constructor(data){
        let { scene, x, y, key, frame } = data;
        super(scene, x, y, key, frame);
        this.scene.add.existing(this);
        this.setOrigin(0,0,5);
        this.originalX = x;
        this.originalY = y;
        this.draggable = true;
        this.setInteractive();
    }


}