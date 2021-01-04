export default class Proyectil{
    constructor(scen, x,y,key, velX, velY){
        this.scene = scen;
        this.velocity = {};
        this.velocity.x = velX;
        this.velocity.y = velY;

        this.imagen = this.scene.matter.add.image(x,y,key); //La imagen (Que tendrá que ser una palabra)
        this.sensor = Phaser.Physics.Matter.Matter.Bodies.circle(10,100,24,{isSensor:true}); // Le creamos un sensor para que pueda triggerear eventos
        console.log(this.sensor);
    }

    preUpdate(){
        this.scene.matter.world.on('collisionstart',
        (event,BodyA, BodyB)=>{
            console.log('Hola holita vecinito');
            for (let i = 0; i < event.pairs.length; i++)
            {
              if(BodyA.label == 'Circle Body' && BodyB.label=='player' || BodyB.label == 'Circle Body' && BodyA.label=='player' ){
                console.log('Hola Maricón de los cojones');
                this.scene.destroy(this)
              }
            }

        });
    }

    LanzaProyectil(){
        this.imagen.setIgnoreGravity(true);
        this.imagen.setVelocity(-25,0);
    }
}