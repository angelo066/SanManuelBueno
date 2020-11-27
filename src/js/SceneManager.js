export default class SceneManager extends Phaser.Scene{
    constructor(key) {
        super(key);
    }

    loadNextScene()
    {
        if(this.scene.key === 'game'){
            this.scene.start('scene2');
        }
        else if(this.scene.key === 'scene2'){
            this.scene.start('menu');
        }else if(this.scene.key === 'menu'){
            this.scene.start('game');
        }
    }
}