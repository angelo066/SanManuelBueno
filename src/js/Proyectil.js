import Word from './word.js';
export default class Proyectil extends Phaser.Physics.Matter.Sprite{
    constructor(scene, x,y,key, velX, velY, player, word){
        super (scene,x, y,key);

        //Para que lo empiece a renderizar
        this.scene.add.existing(this);

        this.velocity = {};
        this.velocity.x = velX;
        this.velocity.y = velY;
        this.player = player;
        this.word = word;
        //let ProyectilBody = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.width, (this.height/2) + 30, this.width * 0.75, this.height*0.7, {isSensor:true ,label:'Proyectil' });; 
        //this.compundBody = Phaser.Physics.Matter.Matter.Body.create(ProyectilBody);
        this.setBody({
            type:'circle',
            width:128,
            height:128,
        });

        this.scene.matter.world.on('collisionstart',
        (event,BodyA, BodyB)=>{
            console.log(BodyA);
            console.log(BodyB.label);
            if(BodyA.label === 'Circle Body'  && BodyB.label === 'player' || BodyB.label === 'Circle Body' && BodyA.label === 'player' ){
                this.destroy(this)
                this.player.takeDamage(5,5,5);    
            }
        });
        
        this.objectWord = new Word({
            scene: this.scene,
            x:this.x,
            y:this.y,
            word: this.word,
            interactive: false,
            letter:null
        });
    }

    //Como de heavy sería hacer las palabras físicas
    LanzaProyectil(){
        this.objectWord.setVelocity(this.velocity.x,this.velocity.y);
        this.objectWord.setIgnoreGravity(true);
        
    }
}