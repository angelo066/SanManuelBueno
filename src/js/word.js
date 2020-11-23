import Letter from "./letter.js";

export default class Word extends Letter{
    constructor(data){
        let {scene, x, y, word} = data;
        super(data);
        this.scene.add.existing(this);
        //gameObject padre de las letras
        this.container = scene.add.container(x, y);
        this.scene.add.existing(this.container);
        //Palabra
        this.word = word;   
        //Letra seleccionada para intercambio
        this.letter_selected = null; 
        console.log(this.word);
        //Crea los sprites de letras y los hace hijos de palabra
        let i = 0;
        word.split('').forEach(l=>{
            l = l.toLowerCase();
            this.letter = new Letter({
                scene: scene,
                x: 80 * i,
                y: 0,
                key: 'letters',
                frame: l.charCodeAt()-97
            });
            this.container.add(this.letter);
            i++;
          });
          //Tecla de activacion de tachar
          this.keycode = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
          //Modo quitar letra = true y modo intercambiar letras = false
          this.strikeMode = false;
          //Input de raton
          this.scene.input.on('gameobjectdown',(pointer, gameObject)=>{
              if(this.strikeMode)
                this.deleteLetter(gameObject);
            else
                this.selectLetter(gameObject);
          });
    }

    preUpdate(){
        
        if (Phaser.Input.Keyboard.JustDown(this.keycode)){
            this.strikeMode = !this.strikeMode;
            this.letter_selected = null;
          }
    }

    selectLetter(gameObject){
        if (this.letter_selected === null){
            this.letter_selected = gameObject;
        }
        else{
            this.swapLetters(gameObject);
        }
        this.newWord();
    }
    
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

    swapLetters(gameObject){
        let temp = [this.letter_selected.texture,this.letter_selected.frame.name];
        this.letter_selected.setTexture(gameObject.texture,gameObject.frame.name);
        gameObject.setTexture(temp[0], temp[1]);
        this.letter_selected = null;
    }

    newWord(){
        this.word = '';
        this.container.list.forEach(e=>{
            if (!e.strikethrough)
                this.word = this.word + String.fromCharCode(e.frame.name + 97);
        });
        console.log(this.word);
    }
}