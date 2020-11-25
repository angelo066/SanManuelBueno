export default class SceneManager extends Phaser.Scene{

    constructor(data) {
        let {scene} = data;
        super(data);
        this.scene = scene;
    }

    loadNextScene()
    {
        console.log(this.scene);
        this.scene.scene.remove(this.scene.key);
        if(this.scene.key === 'game'){
            this.scene.scene.start('scene2');
        }
        else if(this.scene.key === 'scene2'){
            this.scene.scene.start('menu');
        }
    }
}