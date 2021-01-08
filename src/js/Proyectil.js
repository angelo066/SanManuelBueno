import Word from './word.js';
export default class Proyectil extends Phaser.Physics.Matter.Sprite{
    constructor(scene, x,y,key, velX, velY, player){
        super (scene,x, y,key);

        //Para que lo empiece a renderizar
        this.scene.add.existing(this);

        this.velocity = {};
        this.velocity.x = velX;
        this.velocity.y = velY;
        this.player = player;

        this.tiempo= 30;
        this.timer =this.tiempo;
        console.log(this.timer);
        //let ProyectilBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.width, (this.height/2) + 30, this.width * 0.75, this.height*0.7, {isSensor:true ,label:'Proyectil' });; 
        //this.compundBody = Phaser.Physics.Matter.Matter.Body.create(ProyectilBody);
        this.setBody({
            type:'circle',
            width:128,
            height:128,
        });

        this.scene.matter.world.on('collisionstart',
        (event,BodyA, BodyB)=>{
            if(BodyA.label === 'Circle Body'  && BodyB.label === 'player' || BodyB.label === 'Circle Body' && BodyA.label === 'player' ){
                this.destroy(this);
                this.player.takeDamage(5,5,x);    
            }
        });
    }

    preUpdate(){    
        if(this.timer <= 0){
            this.AlteraTrayectoria();
            this.timer = this.tiempo;   
        }
        else this.timer--;
    }

    //Como de heavy sería hacer las palabras físicas
    LanzaProyectil(){
        this.setVelocity(this.velocity.x,this.velocity.y);
        this.setIgnoreGravity(true);   
    }


    AlteraTrayectoria(){
        let abajo = 5;
        let arriba= -5;

        console.log(this.velocity.y);
        if(this.velocity.y === abajo)this.velocity.y = arriba;
        else this.velocity.y = abajo;

        this.setVelocity(this.velocity.x, this.velocity.y);
    }
}