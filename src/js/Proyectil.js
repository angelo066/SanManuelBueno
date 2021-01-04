import Player from './player.js';
export default class Proyectil extends Phaser.Physics.Matter.Sprite{
    constructor(scene, x,y,key, velX, velY, player){
        super (scene,x, y,key);

        //Para que lo empiece a renderizar
        this.scene.add.existing(this);

        this.velocity = {};
        this.velocity.x = velX;
        this.velocity.y = velY;
        this.player = player;
        //this.imagen = this.scene.matter.add.image(x,y,key); //La imagen (Que tendrá que ser una palabra)
        //this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(10,100,24,{isSensor:true}); // Le creamos un sensor para que pueda triggerear eventos
        
    }

    preUpdate(){
        this.scene.matter.world.on('collisionstart',
        (event,BodyA, BodyB)=>{
            for (let i = 0; i < event.pairs.length; i++)
            {
              if(BodyA.label != undefined && BodyB.label=='player' || BodyB.label != undefined && BodyA.label=='player' ){
                this.destroy(this)
                this.player.takeDamage(5,5,5);
              }
            }
        });
    }

    LanzaProyectil(){
        // this.imagen.setIgnoreGravity(true);
        // this.imagen.setVelocity(-25,0);
        this.setVelocity(this.velocity.x,this.velocity.y);
        this.setIgnoreGravity(true);
    }
}