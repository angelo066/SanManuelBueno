import Word from './word.js';
export default class Proyectil extends Phaser.Physics.Matter.Sprite{
    constructor(scene, x,y, key, velX, velY, enemigo){
        super (scene,x, y);

        //Para que lo empiece a renderizar
        this.scene.add.existing(this);
        this.palabra = key;
        this.velocity = {};
        this.velocity.x = velX;
        this.velocity.y = velY;

        //tiempo de vida
        this.lifeTime = 800;
        this.LivingTime = this.lifeTime;

        //Tiempo trayectoria
        this.tiempo= 60;
        this.enemy = enemigo;

        this.timer =this.tiempo;
        //let ProyectilBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.width, (this.height/2) + 30, this.width * 0.75, this.height*0.7, {isSensor:true ,label:'Proyectil' });; 
        //this.compundBody = Phaser.Physics.Matter.Matter.Body.create(ProyectilBody);
        this.setBody({
            type:'circle',
            width:128,
            height:128,
        });

        this.objectWord = new Word({
            scene: this.scene,
            x:this.x,
            y:this.y,
            word: this.palabra,
            interactive: true,
            letter:null
        });

        this.scene.matter.world.on('collisionstart',
        (event,BodyA, BodyB)=>{
            if(BodyA.label === 'Circle Body'  && BodyB.label === 'player' || BodyB.label === 'Circle Body' && BodyA.label === 'player' ){

                if(BodyA.label == "player")
                {
                    if(BodyB.label === 'Circle Body' && this.body !== undefined && BodyB.id === this.body.id)
                    {
                         BodyA.gameObject.takeDamage(0.4,0.2,x)
                         BodyB.gameObject.objectWord.container.destroy(true);
                         BodyB.destroy(true);
                    }
                }
                else
                {
                    if(BodyA.label === 'Circle Body' && BodyA.id === this.body.id)
                    {
                         BodyB.gameObject.takeDamage(0.1,0.2,x)
                         BodyA.gameObject.objectWord.container.destroy(true);
                         BodyA.destroy(true);
                    }
                }
            }
        });
    }

    preUpdate(){    
        if(this.timer <= 0){
            this.AlteraTrayectoria();
            this.timer = this.tiempo;   
        }
        else this.timer--;

        if(this.LivingTime<=0)
        {
            this.objectWord.container.destroy(true);
            this.destroy(true);
        }
        else this.LivingTime--;

        //Mover la pos de cada palabra
        if(this.LivingTime>0)
            this.objectWord.changePos(this.x, this.y); 
    }

    //Como de heavy sería hacer las palabras físicas
    LanzaProyectil(){
        this.setVelocity(this.velocity.x,this.velocity.y);
        this.setIgnoreGravity(true);   
    }

    AlteraTrayectoria(){
        const value = Phaser.Math.Between(-10, 0);
        let arriba = value;
        const value2 = Phaser.Math.Between(0, 10);
        let abajo = value2;

        if(this.velocity.y === abajo)this.velocity.y = arriba;
        else this.velocity.y = abajo;

        this.setVelocity(this.velocity.x, this.velocity.y);
    }
}