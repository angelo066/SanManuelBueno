import Inventory from "./inventory.js";
export default class Player extends Phaser.Physics.Matter.Sprite{
  constructor(scene, x, y, key, frame)
  {
    super(scene.matter.world, x, y, key, frame);
    this.scene.add.existing(this);
    this.playerController = {
      sensors: {
        bottom: null,
        right: null
      },
      speed: {
        run: 5,
        jump: 13
      },
      onFloor: false
    };
    let M = Phaser.Physics.Matter.Matter;
    let w = this.width;
    let h = this.height;
    let sx = w / 2;
    let sy = h / 2;
    let playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 }, label:'player' });
    this.playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 10, { isSensor: true });
    this.playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.45, sy, 20, h * 0.25, { isSensor: true });
    let compoundBody = M.Body.create({
      parts: [
        playerBody, this.playerController.sensors.bottom,
        this.playerController.sensors.right
      ],
      friction: 0.01,
      restitution: 0.05, // Prevent body from sticking against a wall
    });
    this.setExistingBody(compoundBody).setFixedRotation() // Sets max inertia to prevent rotation

    this.invent = new Inventory({
      scene:scene,
      x: this.scene.cameras.main.width/3.9,
      y: this.scene.cameras.main.height*0.84,
      l:{},
    })

    this.invent.setScrollFactor(0);

    //Creacion de las colisiones    
    //Colisiones de suelo y pegar
    this.scene.matter.world.on('collisionstart',(event)=>{
      let right = this.playerController.sensors.right;
      let bottom = this.playerController.sensors.bottom;
       for (let i = 0; i < event.pairs.length; i++)
        {
          let bodyA = event.pairs[i].bodyA;
          let bodyB = event.pairs[i].bodyB;
          if ((bodyA === bottom && bodyB.label === 'ground') || (bodyB === bottom && bodyA.label === 'ground'))
          {
            this.playerController.onFloor = true;
          }
          else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
          {
            //proximamente
          }
        }
    });
    //Colision de salida del salto
    this.scene.matter.world.on('collisionend',(event)=>{ //Con el suelo
      let bottom = this.playerController.sensors.bottom;
       for (let i = 0; i < event.pairs.length; i++)
        {
          let bodyA = event.pairs[i].bodyA;
          let bodyB = event.pairs[i].bodyB;
          if ((bodyA === bottom && bodyB.label === 'ground') || (bodyB === bottom && bodyA.label === 'ground'))
          {
            this.playerController.onFloor = false;
          }
        }
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
      this.setVelocityX(-this.playerController.speed.run);
      this.flipX = true;
      if(this.playerController.onFloor)
        this.anims.play('run',true);
      else
        this.anims.play('jump', true);
    }
    else if(this.cursors.right.isDown)
    {
      this.setVelocityX(this.playerController.speed.run);
      this.flipX = false;
      if(this.playerController.onFloor)
        this.anims.play('run',true);
      else
        this.anims.play('jump', true);
    }
    else
      this.setVelocityX(0);
    
    if(this.cursors.up.isDown && this.playerController.onFloor){
      this.setVelocityY(-this.playerController.speed.jump);
    }
     if(this.body.velocity.x === 0 && this.playerController.onFloor){
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
      console.log(this.invent);
      console.log(letrita);

      this.invent.AddLetter(letrita.word);

      letrita.destroy();
      letrita.destroyWord();

      // this.invent.EscribeInventario();
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