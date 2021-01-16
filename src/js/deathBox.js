export default class DeathBox extends Phaser.Scene {
    constructor() {
        super({ key: "deathBox" });
    }
    //Se llama al crear la escena. No es lo mismo que el Constructor
    init(data)
    {
        this.keyScene = data;
    }

    preload() 
    {

    }

    create() {
        this.RetryText();
    }

    update(time, delta)
    {
    }

    RetryText() {
        this.text = this.add.text(this.cameras.main.width /2.5, this.cameras.main.height / 2, 'Oh...Una lectura nueva?!').setFont('32px Arial Black').setFill('#ffffff').setShadow(2, 2, "#333333", 2).setDepth(20);
        this.text.setAlpha(0);
        this.text.setInteractive()
            .on('pointerover', () => { this.text.setFill('#cb2821'); })
            .on('pointerout', () => { this.text.setFill('#ffffff'); })
            .on('pointerdown', () => { 
                this.scene.start(this.keyScene); 
            });

        this.tweens.add({
            targets: this.text,
            alpha: { from: 0, to: 1 },
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
    }

}