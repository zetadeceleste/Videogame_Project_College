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
    Configuracion del juego
    */

   function init() {
    var actual,
    sprdata,
    informacionpuntaje,
    i,
    j;

    /*
    Trae el Sprite del HTML
    */

    sprdata = document.querySelectorAll('img.sprite');
    i = sprdata.length;
    while (i--) {
        actual = {};
        actual.effects = [];
        actual.img = sprdata[i];
        actual.offset = sprdata[i].offsetWidth / 2;
        informacionpuntaje = sprdata[i].getAttribute('data-collision').split(',');
        j = informacionpuntaje.length;
        while (j--) {
            var keyval = informacionpuntaje[j].split(':');
            actual.effects.push({
                effect: keyval[0],
                value: keyval[1]
            });
        }
        actual.type = sprdata[i].getAttribute('data-type');
        listaSprites.push(actual);
    }
    contadorSprite = listaSprites.length;
    initsprites = +$('#personajes').getAttribute('data-countstart');
    nuevoSprite = +$('#personajes').getAttribute('data-newsprite');

    /*
    Habilita el teclado en el juego
    */
    contenedor.tabIndex = -1;
    contenedor.focus();

    /*
    Asigna Manejadores de Eventos
    */
    contenedor.addEventListener('keydown', onkeydown, false);
    contenedor.addEventListener('keyup', onkeyup, false);
    contenedor.addEventListener('click', onclick, false);
    contenedor.addEventListener('mousemove', onmousemove, false);

    /*
    scoreGuardados sirve para guardar los últimos puntajes obtenidos
    */

    scoresGuardados = { last: 0, high: 0 };

    /*
    Muestra la introduccion
    */

    showintro();

};



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
