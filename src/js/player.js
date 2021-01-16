import Inventory from "./inventory.js";
export default class Player extends Phaser.Physics.Matter.Sprite{
  constructor(scene, x, y, key, frame)
  {
    super(scene.matter.world, 1100, y, key, frame);
    this.scene.add.existing(this);
    this.playerController = {
      sensors: {
        bottom: null,
        right: null
      },
      speed: {
        run: 8,
        jump: 12
      },
      onFloor: false,
      onAttack:false  
    };

    //#region Physics Stats
    this.lifeStat = 1;
    let M = Phaser.Physics.Matter.Matter;
    let w = this.width;
    let h = this.height;
    let sx = w / 2;
    let sy = h / 2;
    let playerBody = M.Bodies.rectangle(sx, sy+30, w * 0.75, h*0.7, { chamfer: { radius: 10 }, label:'player' });
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
    //#endregion

    //Para detectar el filtro Gris
    let postFxPlugin = scene.plugins.get('rexgrayscalepipelineplugin');
    this.cameraFilter = postFxPlugin.add(scene.cameras.main, { intensity: 0 });
    //Pluma Unamuno
    this.fOffsetX = w;
    this.fOffsetY = h*0.25
    this.feather = this.scene.add.image(x,y-this.fOffsetY,'feather');
    this.feather.displayHeight = h* 0.4;
    this.feather.displayWidth = w *0.4;
    //Ataque Unamuno
    this.playerSprite = this;
    this.attack = this.scene.matter.add.sprite(x,y,undefined);
    this.attack.displayHeight = this.attack.height*0.8;
    this.attack.displayWidth = this.attack.width*0.8;
    this.attack.setExistingBody(this.bodyAttack);
    //timer de curación
    this.timer = 500;
    //Inventario
    this.SetInventory(scene);

    //Colisiones    
    //Colisiones de suelo y pegar
    this.scene.matter.world.on('collisionstart',(event)=>{
      let bottom = this.playerController.sensors.bottom;
       for (let i = 0; i < event.pairs.length; i++)
        {
          let bodyA = event.pairs[i].bodyA;
          let bodyB = event.pairs[i].bodyB;
          if ((bodyA === bottom && bodyB.label === 'Rectangle Body') || (bodyB === bottom && bodyA.label === 'Rectangle Body'))
          {
            if((bodyA.gameObject.tile !== undefined && bodyA.gameObject.tile.layer.name === "ground") || (bodyB.gameObject.tile !== undefined && bodyB.gameObject.tile.layer.name === "ground"))
                this.playerController.onFloor = true;
            
            if((bodyA.gameObject.tile !== undefined && bodyA.gameObject.tile.layer.name === "water") || (bodyB.gameObject.tile !== undefined && bodyB.gameObject.tile.layer.name === "water"))
              {
                this.playerController.onFloor = false;
                console.log(this);
                this.restorePos(this.scene.cameras.main.width*0.125, this.scene.cameras.main.height);
              }
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
          if ((bodyA === bottom && bodyB.label === 'Rectangle Body') || (bodyB === bottom && bodyA.label === 'Rectangle Body'))
          {
            if((bodyA.gameObject.tile !== undefined && bodyA.gameObject.tile.layer.name === "water") || (bodyB.gameObject.tile !== undefined && bodyB.gameObject.tile.layer.name === "water"))
            {
              this.playerController.onFloor = false;
              this.restorePos(this.scene.cameras.main.width*0.125, this.scene.cameras.main.height);
            }
          }
        }
    });

    //Input
    this.InitInput();
    
    //Texto Muerte
    this.CreateTextDeath();

    //animaciones
    this.InitAnims();

    //Eventos de animacion y botones
    this.setEvents();
    //Timer de curación
    var timer = scene.time.addEvent({
      delay: this.timer,// ms
      callback: () => {
        this.cureHealth();
      },
      loop: true
    });
    }

  preUpdate(time,delta)
  {
    super.preUpdate(time,delta);
    
    this.text.setX(this.x);
    this.text.setY(this.y - this.height);
    this.scene.add.existing(this.text);

    if(this.lifeStat<=0 && this.canMove)
        this.death();
    
    //Follow de la pluma
    this.ControlFeather();

    //Movement
    this.ControlInput();
  }
  
//Controla la posicion de la pluma y su flip
  ControlFeather() {
    this.feather.setX(this.x - this.fOffsetX);
    this.feather.y = this.y - this.fOffsetY * 2;
    // this.featherFloat();
    if (!this.flipX) {
      this.fOffsetX = this.width;
      this.feather.flipX = false;

    }
    else {
      this.fOffsetX = -this.width;
      this.feather.flipX = true;
    }
  }

  //Crea y ajusta el inventario a la clase actual
  SetInventory(scene) {
    this.invent = new Inventory({
      scene: scene,
      x: this.scene.cameras.main.width*0.14,
      y: this.scene.cameras.main.height * 0.95,
      l: {},
    });

    this.invent.AddLetter("W");
    this.invent.AddLetter("A");
    this.invent.AddLetter("R");
    this.invent.AddLetter("N");
    this.invent.AddLetter("T");

    this.invent.setScrollFactor(0);
    this.invent.setDepth(20);
  }
  //Maneja los eventos de inputs del jugador
  ControlInput() {
    if (this.canMove) {
      if (this.keycodeA.isDown) {
        this.setVelocityX(-this.playerController.speed.run);
        this.flipX = true;

        this.anims.play('run', true);
      }
      else if (this.keycodeD.isDown) {
        this.setVelocityX(this.playerController.speed.run);
        this.flipX = false;

        this.anims.play('run', true);
      }

      else
        this.setVelocityX(0);

      if (this.keycodeW.isDown && this.playerController.onFloor) {
        this.setVelocityY(-this.playerController.speed.jump);

        this.playerController.onFloor = false;
      }
      if (this.body.velocity.x === 0 && this.playerController.onFloor) {
        this.anims.play('idle', true);
      }
      else if (this.body.velocity.x === 0) {
        this.anims.play('jump', true);
      }

      if (this.damage.isDown) {
        this.takeDamage(0.5, 0.1, this.x - 3000);
      }

      //Attack
      this.attack.setX(this.x + this.width * 0.5);
      this.attack.setY(this.y);
      if (!this.flipX) {
        this.attack.flipX = false;
        this.attack.setX(this.x + this.width);
      }
      else {
        this.attack.flipX = true;
        this.attack.setX(this.x - this.width);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keycodeSpace)) {
        this.attack.anims.play('attack', true);
        this.playerController.onAttack = true;
      }
      if (this.playerController.onAttack) {
        this.attack.setExistingBody(this.bodyAttack);
      }
      else {
        this.scene.matter.world.remove(this.attack.body);
      }
    }
  }

//Inicializa las animaciones del jugador
  InitAnims() {
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNumbers('player_run', { start: 0, end: 39 }),
      frameRate: 60,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'jump',
      frames: [{ key: 'player_jump', frame: 0 }],
      frameRate: 24
    });
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNumbers('player_attack', { start: 0, end: 7 }),
      frameRate: 24,
      showOnStart: true,
      hideOnComplete: true
    });
    this.scene.anims.create({
      key: 'death',
      frames: this.scene.anims.generateFrameNumbers('player_death', { start: 0, end: 7 }),
      frameRate: 4,
      showOnStart: true,
      hideOnComplete: false
    });
  }

  setEvents()
{
    //Control animaciones
    this.attack.on('animationcomplete', function (anim, frame) {
      this.emit('animationcomplete_' + anim.key, anim, frame);
    }, this.attack);
    this.attack.on('animationcomplete_attack', () => {
      this.playerController.onAttack = false;
    });

    //Muerte
    this.on('animationcomplete', function (anim) {

      if(anim.key === 'death')
      {
        this.scene.scene.pause(this.scene.scene.key);
        this.scene.scene.launch('deathBox',this.scene.scene.key);
      }
    }, this);
}
//amount debe ser un numero de 0 a 1 | posX es la posicion de quien realiza el daño
 takeDamage(amountDamage)
 {
    this.lifeStat -= amountDamage;
    const fin = this.cameraFilter.intensity + amountDamage*0.9;

    //Para que se vea que baja poco a poco
    this.scene.tweens.add({
      targets: this.cameraFilter,
      intensity: { from: this.cameraFilter.intensity , to: fin },
      duration: 1000,
      ease: 'Expo'
     });

    this.scene.cameras.main.shake(300, 0.005);

    this.scene.cameras.main.once('camerafadeoutcomplete', function (camera) {
      camera.fadeIn(150, 100);
    }, this);

    this.scene.cameras.main.fadeOut(150, 100);
 }
  //Crea los eventos y el texto de la muerte del jugador
 CreateTextDeath() {
  this.text = this.scene.add.text(this.x, this.y - this.height, 'Oh...Una lectura nueva?!').setFont('32px Arial Black').setFill('#ffffff').setShadow(2, 2, "#333333", 2).setDepth(20);
  this.text.setAlpha(0);

  this.text.on('pointerover', () => { this.text.setFill('#cb2821'); });
  this.text.on('pointerout', () => { this.text.setFill('#ffffff'); });
  this.text.on('pointerdown', () => { this.scene.scene.start(this.scene.scene.key); });
}
//Cura la vida del jugador cada lifeTime, constante inicializada en la constructora
 cureHealth()
 {
   if(this.lifeStat >0)
   {
      this.lifeStat += 0.1;

      if(this.cameraFilter.intensity > 0)
        this.cameraFilter.intensity-=0.05;
   }
}
//Detiene el input del jugador y reinicia el nivel
 death()
 {
   this.anims.play('death', false);
   //No usamos el this.input.keyboard.shutdown();ya que  no nos ejecuta las animaciones de muerte.
   
  
   this.canMove = false;
  }
  //Añade una letra al inventario
  addLetter(letrita)
  {
    console.log(letrita);
    this.invent.AddLetter(letrita);
  }
//cambia la pos de jugador dada  las coordenadas
  restorePos(_x, _y)
  {
    this.x = _x;
    this.y = _y;
  }
//inicializa el input del jugador
  InitInput()
  {
    this.canMove = true;
    this.keycodeA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keycodeD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keycodeW =this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keycodeSpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.damage = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
  }

}