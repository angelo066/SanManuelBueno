export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }



  //para cargar los recursos
  preload() {
    this.load.image ('player', 'ruta');

    //si tenemos un spriteSheet
    this.load.image('spriteSheet', 'spriteSheeeet.png', {fW: 64, fH: 64});

    //para deshacerme de ella image.destroy();
  }
//coloca objetos apartir de los assets dentro de la escena
  create() {
    //creacion de objeto      //pos x //pos Y creo, o el tamaño..

    // add es una factoria, un objeto que crea objetos
    player  = scene.add.sprite(100, 200, 'player'); // si esto se hace en el preload igual hace KaBoom

    this.scene.anims.create... //no alcance a copiar srroy esta al final de la clase de Entidades de Phaser

    this.add.text(10, 10, "Unamuno viene a por ti, a consolarte.", { fontColor: 0xffff00 });
  }
//actualiza los eventos. El delta es para calcular las fisicas
  update(time, delta) {}



  //usando this. accedemos a todos los metodos que nos permite "jugar" con las escenas

  //Para crear jueguitos: (pasar muchos parametros hetereogeneos mediante un objeto)
  // new Phaser.Game({
  //   type: Phaser.AUTO, //asumiendo que AUTO es algo...un objeto
  //   //Phaser crea un canvas pero nosotros podemos crear un mas personalizado
  //   canvas: document.getElementById('juego'),
  //   width: 800,
  //   height: 400,
  //   scene : [ClaseEscenaInicial, ClaseEscenaInicial] 
  // })

  //<script>canvas: document.getElementById('juego').focus()</script>
  // El foco es la zona de la pagina en la que recibe los eventos. Si selecciono la barra de busqueda, escribo un espacio
  //Si estoy en YT y presiono space, se detiene el video. You got it?

  //nunca poner URLS absolutas(con el https y mas mierdas), solo la parte relativa(despues del dominio)

  //Nunca \ <- esa barra al principio

  // ./carpetaLegal = carpetaLegal 
}
