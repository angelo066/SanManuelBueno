import Inventory from "./inventory.js";
let playerController;
export default class Player extends Phaser.Physics.Matter.Sprite{
    constructor(scene, x, y, key, frame)
    {
      super(scene.matter.world, x, y, key, frame);
      this.scene.add.existing(this);
      playerController = {
        sensors: {
            bottom: null,
            right: null
        },
        blocked: {
            left: false,
            right: false,
            bottom: false
        },
        numTouching: {
            right: 0,
            bottom: 0
        },
        speed: {
            run: 5,
            jump: 20
        }
    };
      let M = Phaser.Physics.Matter.Matter;
      let w = this.width;
      let h = this.height;
      let sx = w / 2;
      let sy = h / 2;
      //speeds
      this.run = playerController.speed.run;
      this.jump = playerController.speed.jump;
      let playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 }, label:'player' });
      playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, { isSensor: true });
      playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.45, sy, 5, h * 0.25, { isSensor: true });
      let compoundBody = M.Body.create({
          parts: [
              playerBody, playerController.sensors.bottom,
              playerController.sensors.right
          ],
          friction: 0.01,
          restitution: 0.05, // Prevent body from sticking against a wall
      });
      this.setExistingBody(compoundBody).setFixedRotation() // Sets max inertia to prevent rotation

      this.onFloor = true;
      this.invent = new Inventory({
        scene:scene,
        x: this.scene.cameras.main.width/8,
        y: this.scene.cameras.main.height*0.96,
        l:{},
      })

    //Creacion de los colliders    // Before matter's update, reset the player's count of what surfaces it is touching.
    console.log(playerController);
    this.scene.matter.world.on('beforeupdate', function (event) {
      playerController.numTouching.right = 0;
      playerController.numTouching.bottom = 0;
  });

  // Loop over the active colliding pairs and count the surfaces the player is touching.
  this.scene.matter.world.on('collisionactive', function (event)
  {
      let playerBody = playerController.body;
      let right = playerController.sensors.right;
      let bottom = playerController.sensors.bottom;

      for (let i = 0; i < event.pairs.length; i++)
      {
          let bodyA = event.pairs[i].bodyA;
          let bodyB = event.pairs[i].bodyB;

          if (bodyA === playerBody || bodyB === playerBody)
          {
              continue;
          }
          else if (bodyA === bottom || bodyB === bottom)
          {
              // Standing on any surface counts (e.g. jumping off of a non-static crate).
              playerController.numTouching.bottom += 1;
          }
          else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
          {
            playerController.numTouching.right += 1;
          }
        }
    });

      // Update over, so now we can determine if any direction is blocked
    this.scene.matter.world.on('afterupdate', function (event) {
      playerController.blocked.right = playerController.numTouching.right > 0 ? true : false;
      playerController.blocked.bottom = playerController.numTouching.bottom > 0 ? true : false;
    });

      //Input de cursores
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
        this.setVelocityX(-this.run);
        this.flipX = true;
        if(this.onFloor)
          this.anims.play('run',true);
        else
          this.anims.play('jump', true);
      }
      else if(this.cursors.right.isDown)
      {
        this.setVelocityX(this.run);
        this.flipX = false;
        if(this.onFloor)
          this.anims.play('run',true);
        else
          this.anims.play('jump', true);
      }
      else
        this.setVelocityX(0);
      
      if(this.cursors.up.isDown && playerController.blocked.bottom){
        this.setVelocityY(-this.jump);
      }

      if(this.body.velocity.x === 0){
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