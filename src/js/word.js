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
        this.offSetLetter = 80;
        //Crea los sprites de letras y los hace hijos de palabra
        this.i = 0;
        let letterKey = 'letters';
        this.interactive = interactive;
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
                x: this.offSetLetter * this.i,
                y: 0,
                key: letterKey,
                frame: l.charCodeAt()-97,
                interactive: interactive
            });
            this.container.add(this.let);
            if(letter === l){this.container.sendToBack(this.let);}
            this.i++;

        });
        
        this.container.setDepth(10);
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

    changePos(posX, posY)
    {
        this.container.x = posX;
        this.container.y = posY;
        this.scene.add.existing(this.container);
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
    //Quitar una letra de la palabra
    removeLetter(selection, i)
    {
        // console.log("removing child number " + selection);
        let letra = this.container.getAt(selection).frame.name;
        this.container.bringToTop(this.container.getAt(selection));

        this.container.iterate ( child =>{
            if(this.container.getIndex(child) >= selection &&  this.container.getIndex( (this.container.last) !== this.container.getIndex(child)  )) 
                child.x = child.x - i ;
        });
     
        this.container.remove(this.container.last);
        this.i--;
        return letra + 97;
    }

    //Cambiar la posicion de las letras
    swapLetters(gameObject){
        let temp = [this.letter_selected.texture,this.letter_selected.frame.name];
        this.letter_selected.setTexture(gameObject.texture,gameObject.frame.name);
        gameObject.setTexture(temp[0], temp[1]);
        console.log("desselecioando");
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
    //Activar el modo quitar letra desde el puzzle en cuestión
    activateStrikeMode(modeOn)
    {
        this.strikeMode = modeOn;
    }
    //Añadir una letra a la palabra
    AddLetter(l, offset, interactivo )
    {
        l = l.toLowerCase();
        let letter = new Letter({
            scene: this.scene,
            x: offset*this.i,
            y: 0,
            key: 'letters',
            frame: l.charCodeAt()-97,
            interactive: interactivo,
        });
        this.container.add(letter);
        this.i++;

    }

}