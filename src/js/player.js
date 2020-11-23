import Game from "./game.js";

let speed;
let jumpSpeed;

export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'player_run',0);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.speed = 300;
        this.jumpSpeed = 600;
        this.body.setGravityY(600);
        //para que no se salga de los bordes las pantalla
        this.body.setCollideWorldBounds();
        this.body.setSize(80, 90, true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        //animaciones
        this.scene.anims.create({
          key:'run',
          frames: this.scene.anims.generateFrameNames('player_run',{start: 0, end: 34}),
          frameRate: 20,
          repeat: -1
        });
        this.scene.anims.create({
          key:'jump',
          frames: this.scene.anims.generateFrameNames('player_jump',{start: 0, end: 24}),
          frameRate: 20,
          repeat: -1
        });
    }
    preUpdate()
    {
      if(this.cursors.left.isDown)
      {
        this.body.setVelocityX(-this.speed);
        this.flipX = true;
      }
      else if(this.cursors.right.isDown)
      {
        this.body.setVelocityX(this.speed);
        this.flipX = false;
      }
      else 
      {
        this.body.setVelocityX(0);
      }

      if(this.cursors.up.isDown && this.body.touching.down)
      {
        this.body.setVelocityY(-this.jumpSpeed);
      }
      if(this.body.touching.down){
        this.play('run');
      }
      else{
        this.play('jump');
      }
    }
  }