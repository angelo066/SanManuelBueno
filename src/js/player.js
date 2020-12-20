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
        jump: 10
      },
      onFloor: false,
      onAttack:false
    };
    let M = Phaser.Physics.Matter.Matter;
    let w = this.width;
    let h = this.height;
    let sx = w / 2;
    let sy = h / 2;
    let playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 }, label:'player' });
    this.playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 10, { isSensor: true , label: 'foot'});
    this.playerController.sensors.right = M.Bodies.rectangle(w*3, sy, w*1.2, h * 1.2, {isStatic:true, isSensor: true, label:'player_attack'});
    let compoundBody = M.Body.create({
      parts: [
        playerBody, this.playerController.sensors.bottom
      ],
      friction: 0.01,
      restitution: 0.05, // Prevent body from sticking against a wall
    });
    this.bodyAttack = M.Body.create({parts:[this.playerController.sensors.right],      friction: 0.01,      restitution: 0.05})
    this.setExistingBody(compoundBody).setFixedRotation() // Sets max inertia to prevent rotation
    //Pluma Unamuno
    this.fOffsetX = w;
    this.fOffsetY = h*0.25
    this.feather = this.scene.add.image(x,y,'feather');
    this.feather.displayHeight = h* 0.4;
    this.feather.displayWidth = w *0.4;
  //Ataque Unamuno
  this.attack = this.scene.matter.add.sprite(x,y,undefined);
  this.attack.displayHeight = this.attack.height*0.8;
  this.attack.displayWidth = this.attack.width*0.8;
  this.attack.setExistingBody(this.bodyAttack);
  //Inventario
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
      let bottom = this.playerController.sensors.bottom;
       for (let i = 0; i < event.pairs.length; i++)
        {
          let bodyA = event.pairs[i].bodyA;
          let bodyB = event.pairs[i].bodyB;
          if ((bodyA === bottom && bodyB.label === 'ground') || (bodyB === bottom && bodyA.label === 'ground'))
          {
            this.playerController.onFloor = true;
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

    //Input
      this.keycodeA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keycodeD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keycodeW =this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keycodeSpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //animaciones
    this.scene.anims.create({
      key:'idle',
      frames: this.scene.anims.generateFrameNumbers('player_idle',{start: 0, end: 5}),
      frameRate: 8,
      repeat: -1
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
    this.scene.anims.create({
      key:'attack',
      frames: this.scene.anims.generateFrameNumbers('player_attack',{start: 0, end: 7}),
      frameRate: 24,
      showOnStart:true,
      hideOnComplete: true
    });
    //Control animaciones
    this.attack.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, this.attack);
    this.attack.on('animationcomplete_attack',()=> {
      this.playerController.onAttack = false;
    });
  }

  preUpdate(time,delta)
  {
    super.preUpdate(time,delta);
    //Follow de la pluma
    this.feather.setX(this.x-this.fOffsetX);
    this.feather.setY(this.y - 80);
    this.featherFloat();
    if(!this.flipX){
      this.fOffsetX = this.width;
      this.feather.flipX = false;
    }
    else{
      this.fOffsetX = -this.width;
      this.feather.flipX = true;
    }
    //Movement
    if(this.keycodeA.isDown)
    {
      this.setVelocityX(-this.playerController.speed.run);
      this.flipX = true;
      if(this.playerController.onFloor)
        this.anims.play('run',true);
      else
        this.anims.play('jump', true);
    }
    else if(this.keycodeD.isDown)
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
    
    if(this.keycodeW.isDown && this.playerController.onFloor){
      this.setVelocityY(-this.playerController.speed.jump);
    }
     if(this.body.velocity.x === 0 && this.playerController.onFloor){
      this.anims.play('idle', true);
    }
    else if(this.body.velocity.x === 0){
      this.anims.play('jump', true);
    }

    
    //Attack
    this.attack.setX(this.x + this.width*0.5);
    this.attack.setY(this.y);
    if(!this.flipX){
      this.attack.flipX = false;
      this.attack.setX(this.x + this.width);
    }
    else{
      this.attack.flipX = true;
      this.attack.setX(this.x - this.width);
    }
    if(Phaser.Input.Keyboard.JustDown(this.keycodeSpace)){
      this.attack.anims.play('attack',true);
      this.playerController.onAttack = true;
    }
    if(this.playerController.onAttack){
      this.attack.setExistingBody(this.bodyAttack);
    }
    else{
      this.scene.matter.world.remove(this.attack.body);
    }
  }

  featherFloat(){
    this.scene.tweens.add({
      targets: this.feather,
      y: {from:this.feather.y - 15, to:this.feather.y+10},
      duration:500,
      yoyo: true,
      loop:-1
  }); 
  }

  // addLetter(letrita){
  //   //letrita.container.destroy();
  //   console.log(this.invent)
  //   this.invent.addLet(letrita.word);
  //   this.invent.EscribeInventario();
  //   }

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

  addLetter(letrita)
  {
    console.log(letrita);
    this.invent.AddLetter(letrita);
  }
}