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

/*
  Manejo de Clicks
  */

  function onclick(ev) {
      var t = ev.target;
      if (estadoDelJuego === 'juegoterminado') {
          if (t.id === 'jugardenuevo') {
              muestraInicio();
          }
      }
      if (t.className === 'proximo') {
          instruccionesSiguiente();
      }
      if (t.className === 'endinstructions') {
          instruccionesListo();
      }
      if (t.id === 'botoninstrucciones') {
          mostrarInstrucciones();
      }
      if (t.id === 'botonjugar') {
          startgame(),
              cambiaBackground();
      }
      ev.preventDefault();
  }

  /*
  Manejo de Teclado
  */

  function onkeydown(ev) {
      /*
      Detecta el evento de que el usuario está utilizando el teclado
      y compara con los códigos ASCII del teclado para asignarle la función que corresponda
      */
      if (ev.keyCode === 39) {
          rightdown = true;
      }
      else if (ev.keyCode === 37) {
          leftdown = true;
      }
  }
  function onkeyup(ev) {
      if (ev.keyCode === 39) {
          rightdown = false;
      }
      else if (ev.keyCode === 37) {
          leftdown = false;
      }
  }

  /*
  Manejo del Mouse
  */

  function onmousemove(ev) {
      var mx = ev.clientX - contenedor.offsetLeft;
      if (mx < offset) {
          mx = offset;
      }
      if (mx > width - offset) {
          mx = width - offset;
      }
      x = mx;
  }

  /*
  Introduccion
  */

  function muestraInicio() {
      setactual(principal);
      estadoDelJuego = 'principal';
      var scoreelms = principal.querySelectorAll('output');
      scoreelms[0].innerHTML = scoresGuardados.last;
      scoreelms[1].innerHTML = scoresGuardados.high;
  }

  /*
  muestra las instrucciones para jugarlo
  */

  function mostrarInstrucciones() {
      setactual(instrucciones);
      estadoDelJuego = 'instrucciones';
      now = 0;
      personajes[now].className = 'current';
  }
  /*movimientos del personaje*/
  /*
  Accion cuando se activa Izquierda
  */

  function instruccionesListo() {
      personajes[now].className = 'dentrointrucciones';
      now = 0;
      muestraInicio();
  }

  /*
  Accion cuando se activa Derecha ahora
  */

  function instruccionesSiguiente() {
      if (personajes[now + 1]) {
          now = now + 1;
      }
      if (personajes[now]) {
          personajes[now - 1].className = 'dentrointrucciones';
          personajes[now].className = 'current';
      }
  }

  /*
  Bucle Principal del Juego
  */

  function loop() {
      ctx.clearRect(0, 0, width, height);

      /*
      Renderiza y actualiza Sprites
      */

      j = sprites.length;
      for (i = 0; i < j; i++) {
          sprites[i].render();
          sprites[i].update();
      }

      /*
      Muestra Scores
      */

      muestraDulzura.innerHTML = scores.energy;
      muestraScore.innerHTML = ~~(score / 10);
      score++;

      /*
      Cuando aumenta Score agrega mas Sprites
      */

      if (~~(score / nuevoSprite) > levelincrease) {
          sprites.push(addsprite());
          levelincrease++;
      }

      /*
      Posicion Jugador
      */

      if (rightdown) {
          playerright();
      }
      if (leftdown) {
          playerleft();
      }

      ctx.save();
      ctx.translate(x - offset, playerY);
      ctx.drawImage(player, 0, 0);
      ctx.restore();

      /*
        Cuando aun tienes dulzura, renderiza Siguiente instruccion, sino Juego Terminado
      */

      scores.energy = Math.min(scores.energy, 100);
      if (scores.energy > 0) {
          requestAnimationFrame(loop);
      } else {
          juegoterminado();
      }

  };







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
