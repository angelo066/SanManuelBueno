let speed;
let jumpSpeed;

export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'player',0);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.speed = 300;
        this.jumpSpeed = 400;
        //para que no se salga de los bordes las pantalla
        this.body.setCollideWorldBounds();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        
    }
    preUpdate()
    {

      if(this.cursors.left.isDown)
      {
        this.body.setVelocityX(-this.speed);
      }
      else if(this.cursors.right.isDown)
      {
        this.body.setVelocityX(this.speed);
      }
      else 
      {
        this.body.setVelocityX(0);
      }

      if(this.cursors.up.isDown && this.body.touching.down)
      {
        this.body.setVelocityY(-this.jumpSpeed);
      }
      else if(this.cursors.down.isDown )
      {
        this.body.setVelocityY(this.jumpSpeed*2);
      }
    }
}