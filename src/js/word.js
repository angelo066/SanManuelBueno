import Letter from "./letter.js";

export default class Word extends Letter{
    constructor(data){
        let{scene, x, y, word, interactive, letter} = data
        super(data);
        this.scene.add.existing(this);
        //gameObject padre de las letras
        this.container = scene.add.container(x, y);
        this.scene.add.existing(this.container);
        //Palabra
        this.word = word; 
        //Letra seleccionada para intercambio
        this.letter_selected = null; 
        //Crea los sprites de letras y los hace hijos de palabra
        this.i = 0;
        let letterKey = 'letters';
        this.word.split('').forEach(l=>{
            l = l.toLowerCase();
            //Si la palabra no es interactiva(solo es para dar una letr al jugador)
            if(!interactive){
                //La letra que recibe el jugador mantiene el sprite, las otras son diferentes
                if(l === letter){ letterKey = 'letters'; }
                else{ letterKey = 'crackedletters'; }
            }
            this.let = new Letter({
                scene: this.scene,
                x: 80 * this.i,
                y: 0,
                key: letterKey,
                frame: l.charCodeAt()-97,
                interactive: interactive
            });
            this.container.add(this.let);
            if(letter === l){this.container.sendToBack(this.let);}
            this.i++;

        });

        //Tecla de activacion de tachar
        this.keycode = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        //Modo quitar letra = true y modo intercambiar letras = false
        this.strikeMode = false;
        //Input de raton
        if(interactive){
            this.scene.input.on('gameobjectdown',(pointer, gameObject)=>{
                if(this.strikeMode){
                    this.deleteLetter(gameObject);
                }
                else{
                    this.selectLetter(gameObject);
                }
            });
        }
    }

    preUpdate(time,delta){
        super.preUpdate(time,delta);
        if (Phaser.Input.Keyboard.JustDown(this.keycode)){
            console.log(this.strikeMode);
            this.strikeMode = !this.strikeMode;
            console.log(this.strikeMode);
            //Feedback visual de que el modo tachar esta activo
			if(this.strikeMode === true){
                this.mode = this.scene.add.text(250, this.scene.game.config.height -200, 'Strike Mode Activated', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fontSize: '35px' });
                this.mode.setOrigin(0);
                this.mode.setScrollFactor(0);
            }
            else {
                this.mode.destroy();
            }
            this.letter_selected = null;
          }
    }
    centerWordPosX(){
        return this.x-((this.i-1)*80/2);
    }
    //Seleccion de letra
    selectLetter(gameObject){
        if (this.letter_selected === null){
            this.letter_selected = gameObject;
        }
        else{
            this.swapLetters(gameObject);
        }
        this.newWord();
    }
    //tachar letra
    deleteLetter(gameObject){
        if (!gameObject.strikethrough){
            gameObject.setTexture('strikedletters',gameObject.frame.name);
            gameObject.strikethrough = true;
        }
        else {
            gameObject.setTexture('letters',gameObject.frame.name);
            gameObject.strikethrough = false;
        }
        this.newWord();
    }

    removeLetter(selection, i)
    {
        // console.log("removing child number " + selection);

        this.container.bringToTop(this.container.getAt(selection));

        this.container.iterate ( child =>{
            if(this.container.getIndex(child) >= selection &&  this.container.getIndex( (this.container.last) !== this.container.getIndex(child)  )) 
                child.x = child.x - i ;
        });
        
        this.container.remove(this.container.last);
        this.i--;
    }

    //Cambiar la posicion de las letras
    swapLetters(gameObject){
        let temp = [this.letter_selected.texture,this.letter_selected.frame.name];
        this.letter_selected.setTexture(gameObject.texture,gameObject.frame.name);
        gameObject.setTexture(temp[0], temp[1]);
        this.letter_selected = null;
    }
    //Nueva palabra al cambiar letras
    newWord(){
        this.word = '';
        this.container.list.forEach(e=>{
            if (!e.strikethrough)
                this.word = this.word + String.fromCharCode(e.frame.name + 97);
        });
    }
    //Destruir ultima letra agrietada
    destroyCrackedLetter(){
        if(this.container.getIndex(this.container.last) !== 0){
            //Añadir animacion de destruir letra agrietada aqui
            this.container.remove(this.container.last, true);
        }
    }
    //Destruir todas las letras y su contenedor
    destroyWord(){
        this.container.destroy();
    }

    AddLetter(l, offset)
    {
        l = l.toLowerCase();
        let letter = new Letter({
            scene: this.scene,
            x: offset*this.i,
            y: -120,
            key: 'letters',
            frame: l.charCodeAt()-97,
            interactive: false
        });
        letter.setScale(0.5);
        this.container.add(letter);
        this.i++;

    }
}