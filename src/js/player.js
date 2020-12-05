import Inventory from "./inventory.js";

export default class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'player_run',0);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.speed = 300;
        this.jumpSpeed = 600;
        this.body.setGravityY(900);

        this.invent= new Inventory({
          scene:scene,
          L:{},
          N:0
        })

        //Para que no se salga de los bordes las pantalla
        this.body.setCollideWorldBounds();
        this.body.setSize(100,170, true);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        //animaciones
        this.scene.anims.create({
          key:'idle',
          frames: [{key: 'player_run', frame: 28}],
          frameRate: 24
        })
        this.scene.anims.create({
          key:'run',
          frames: this.scene.anims.generateFrameNumbers('player_run',{start: 0, end: 39}),
          frameRate: 60,
          repeat: -1
        });
        this.scene.anims.create({
          key:'jump',
          frames: [{key: 'player_jump', frame: 0}],
          frameRate: 24
        });
    }

    preUpdate(time,delta)
    {
      super.preUpdate(time,delta);
      if(this.cursors.left.isDown)
      {
        this.body.setVelocityX(-this.speed);
        this.flipX = true;
        if(this.body.touching.down)
          this.anims.play('run',true);
        else
          this.anims.play('jump', true);
      }
      else if(this.cursors.right.isDown)
      {
        this.body.setVelocityX(this.speed);
        this.flipX = false;
        if(this.body.touching.down)
          this.anims.play('run',true);
        else
          this.anims.play('jump', true);
      }
      else
        this.body.setVelocityX(0);
      
      if(this.cursors.up.isDown && this.body.touching.down){
        this.body.setVelocityY(-this.jumpSpeed);
      }

      if(this.body.velocity.x === 0 && this.body.touching.down){
        this.anims.play('idle', true);
      }
    }

    addLetter(letrita){
      //letrita.container.destroy();
      console.log(this.invent)
      this.invent.addLet(letrita.word);
      this.invent.EscribeInventario();
    }

    checkPos(width) { 
      if(this.body.x >= width - this.body.width) 
      {
        return true;
      }
    }

    AddLetter(player, letrita)
    {
      console.log(this.invent);
      console.log(letrita);

      this.invent.AddLetter(letrita.word);

      letrita.destroy();
      letrita.destroyWord();

      this.invent.EscribeInventario();
    }
  }