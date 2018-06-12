(function () {

    /*
    Elementos del DOM
    */

    var contenedor = $('#contenedor'),
        juego = $('#juego'),
        player = $('#luis'),
        principal = $('#principal'),
        instrucciones = $('#instrucciones'),
        muestraScore = $('#puntaje output'),
        muestraDulzura = $('#dulzura output'),
        canvas = $('canvas'),
        terminado = $('#juegoterminado'),
        msjjuegoterminado = terminado.querySelector('.mensaje'),
        personajes = document.querySelectorAll('div.dentrointrucciones'),
        ctx = canvas.getContext('2d'),
        startenergy = +muestraDulzura.innerHTML;

    /*
    Datos del Juego
    */

    var scores = {
        energy: startenergy
    },
        playerincrease = +player.getAttribute('data-increase');
/*
    Contadores
    */

   var score = 0,
   estadoDelJuego = null,
   x = 0,
   sprites = [],
   listaSprites = [],
   contadorSprite = 0,
   now = 0,
   viejo = null,
   playerY = 0,
   offset = 0,
   width = 0, height = 0,
   levelincrease = 0, i = 0,
   scoresGuardados = null,
   initsprites = 0,
   nuevoSprite = 500,
   rightdown = false,
   leftdown = false;





/*
Función para cambiar el background durante el juego
*/

function cambiaBackground() {
    var images = ['Assets/2.png', 'Assets/3.png', 'Assets/4.png', 'Assets/5.png', 'Assets/6.png', 'Assets/7.png', 'Assets/8.png']

    setInterval(function () {

        document.getElementById("cambiabackground").style.backgroundImage = "url('" + images[0] + "')";

        var firstValue = images.shift();
        images.push(firstValue);


    }, 12000);

}










})();
/*
Función para activar/desactivar el audio
*/

var cambiaicoaudio = 0,
    audio = document.getElementById("audio");

function activaDesactivaAudio() {

    if (cambiaicoaudio == 0) {
        document.getElementById("audioico").setAttribute('src', 'Assets/audio_mute.png');
        cambiaicoaudio++;
        audio.pause();
    }
    else {
        document.getElementById("audioico").setAttribute('src', 'Assets/audio_on.png');
        cambiaicoaudio--;
        audio.play();
    }
}
