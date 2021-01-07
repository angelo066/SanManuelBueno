export default class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
  
        this.load.plugin('rexgrayscalepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgrayscalepipelineplugin.min.js', true);  

        this.load.setPath('./src/assets/testHray/');

        this.load.image('cake', 'cake.png');
        this.load.image('crab', 'crab.png');
        this.load.image('fish', 'fish.png');
        this.load.image('pudding', 'pudding.png');    
    }

    create() {
        this.add.sprite(100, 300, 'pudding');
        this.add.sprite(400, 300, 'crab').setScale(1.5);
        // this.fish = this.add.sprite(400, 300, 'fish');
        // const Between = Phaser.Math.Between;
        // for (var i = 0; i < 100; i++) {
        //     this.add.circle(0, 0, Between(5, 30), Between(0, 0x1000000))
        //         .setRandomPosition(100, 100, 600, 400)
        //         .setAlpha(Math.random());
        // }

        var postFxPlugin = this.plugins.get('rexgrayscalepipelineplugin');
        this.cameraFilter = postFxPlugin.add(this.cameras.main, { intensity: 0 });

        var scene = this;
        // this.input.on('pointerup', function (pointer, currentlyOver) {
        //     scene.tweens.add({
        //         targets: scene.cameraFilter,
        //         intensity: 0,
        //         ease: 'Linear',
        //         duration: 1000,
        //         repeat: 0,
        //         yoyo: false
        //     });
        // });
    }

    update() {
        var activePointer = this.input.activePointer;
        if (activePointer.isDown) {
            this.cameraFilter.intensity += 0.5;
        }
    }
}