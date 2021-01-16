import Player from './player.js';
import PuzzleObjectWord from './puzzleObjectWord.js';
import PuzzleObjectLetter from './puzzleObjectLetter.js';
import Enemigo from './Enemigo.js';
export default class Intro extends  Phaser.Scene {
  constructor() {
    super({key: 'Intro'});
  }
  //para cargar los recursos
  preload(){
    this.load.video('opening', 'src/assets/video/bg_iglesia.png');
  }

  create(){

  }
}