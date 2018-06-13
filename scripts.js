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
        terminado = $('#juego-terminado'),
        msjJuegoTerminado = terminado.querySelector('.mensaje'),
        personajes = document.querySelectorAll('div.dentro-instrucciones'),
        ctx = canvas.getContext('2d'),
        comienzaDulzura = +muestraDulzura.innerHTML;

    /*
    Datos del Juego
    */

    var puntajes = {
        energy: comienzaDulzura
    },
        playerIncrease = +player.getAttribute('data-increase');

    /*
    Contadores
    */

    var puntaje = 0,
        estadoDelJuego = null,
        x = 0,
        sprites = [],
        listaSprites = [],
        contadorSprite = 0,
        ahora = 0,
        viejo = null,
        playerY = 0,
        offset = 0, // Offset se refiere a la distancia (desplazamiento) desde el inicio hasta cierto elemento dentro de un array
        width = 0,
        height = 0,
        incrementeNivel = 0,
        i = 0,
        scoresGuardados = null,
        iniciaSprites = 0,
        nuevoSprite = 500,
        izquierdaAbajo = false,
        derechaAbajo = false;

    /*
    Configuracion del juego
    */

    function init() {
        var actual,
            spriteData,
            informacionPuntaje,
            i,
            j;

        /*
        Trae el Sprite del HTML
        */

        spriteData = document.querySelectorAll('img.sprite');
        i = spriteData.length;
        while (i--) {
            actual = {};
            actual.efectos = [];
            actual.img = spriteData[i];
            actual.offset = spriteData[i].offsetWidth / 2;
            informacionPuntaje = spriteData[i].getAttribute('data-collision').split(',');
            j = informacionPuntaje.length;
            while (j--) {
                var valorTecla = informacionPuntaje[j].split(':');
                actual.efectos.push({
                    efecto: valorTecla[0],
                    value: valorTecla[1]
                });
            }
            actual.type = spriteData[i].getAttribute('data-type');
            listaSprites.push(actual);
        }
        contadorSprite = listaSprites.length;
        iniciaSprites = +$('#personajes').getAttribute('data-countstart');
        nuevoSprite = +$('#personajes').getAttribute('data-newsprite');

        /*
        Habilita el teclado en el juego
        */
        contenedor.tabIndex = -1;
        contenedor.focus();

        /*
        Asigna Manejadores de Eventos
        */
        contenedor.addEventListener('keydown', enTeclaAbajo, false);
        contenedor.addEventListener('keyup', enTeclaArriba, false);
        contenedor.addEventListener('click', enClick, false);
        contenedor.addEventListener('mousemove', enMovimientoMouse, false);

        /*
        scoreGuardados sirve para guardar los últimos puntajes obtenidos
        */

        scoresGuardados = { last: 0, high: 0 };

        /*
        Muestra la introduccion
        */

        muestraPrincipio();

    };

    /*
    Función para cambiar el background durante el juego
    almacena en una array los diferentes assets de fondo de pantalla del juego
    */

    function cambiaBackground() {
        var imagenes = ['Assets/2.png', 'Assets/3.png', 'Assets/4.png', 'Assets/5.png', 'Assets/6.png', 'Assets/7.png', 'Assets/8.png']

        setInterval(function () {

            document.getElementById("cambia-background").style.backgroundImage = "url('" + imagenes[0] + "')";

            var primerValor = imagenes.shift();
            imagenes.push(primerValor);

        }, 12000);

    }

    /*
    Manejo de Clicks 
    */

    function enClick(ev) {
        var t = ev.target;
        if (estadoDelJuego === 'juego-terminado') {
            if (t.id === 'jugar-de-nuevo') {
                muestraPrincipio();
            }
        }
        if (t.className === 'proximo') {
            instruccionesSiguiente();
        }
        if (t.className === 'fin-instrucciones') {
            instruccionesListo();
        }
        if (t.id === 'boton-instrucciones') {
            mostrarInstrucciones();
        }
        if (t.id === 'boton-jugar') {
            juegoEmpieza(),
                cambiaBackground();
        }
        ev.preventDefault();
    }

    /*
    Manejo de Teclado
    */

    function enTeclaAbajo(ev) {
        /*
        Detecta el evento de que el usuario está utilizando el teclado
        y compara con los códigos ASCII del teclado para asignarle la función que corresponda
        */
        if (ev.keyCode === 39) {
            izquierdaAbajo = true;
        }
        else if (ev.keyCode === 37) {
            derechaAbajo = true;
        }
    }
    function enTeclaArriba(ev) {
        if (ev.keyCode === 39) {
            izquierdaAbajo = false;
        }
        else if (ev.keyCode === 37) {
            derechaAbajo = false;
        }
    }

    /*
    Manejo del Mouse
    */

    function enMovimientoMouse(ev) {
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

    function muestraPrincipio() {
        setActual(principal);
        estadoDelJuego = 'principal';
        var scoreelms = principal.querySelectorAll('output');
        scoreelms[0].innerHTML = scoresGuardados.last;
        scoreelms[1].innerHTML = scoresGuardados.high;
    }

    /*
    muestra las instrucciones para jugarlo
    */

    function mostrarInstrucciones() {
        setActual(instrucciones);
        estadoDelJuego = 'instrucciones';
        ahora = 0;
        personajes[ahora].className = 'current';
    }
    /*movimientos del personaje*/
    /*
    Accion cuando se activa Izquierda
    */

    function instruccionesListo() {
        personajes[ahora].className = 'dentro-instrucciones';
        ahora = 0;
        muestraPrincipio();
    }

    /*
    Accion cuando se activa Derecha ahora
    */

    function instruccionesSiguiente() {
        if (personajes[ahora + 1]) {
            ahora = ahora + 1;
        }
        if (personajes[ahora]) {
            personajes[ahora - 1].className = 'dentro-instrucciones';
            personajes[ahora].className = 'current';
        }
    }

    /*
    Prepara el juego para empezar y setea los valores
    */

    function juegoEmpieza() {
        setActual(juego);
        estadoDelJuego = 'jugando';
        document.body.className = 'jugando';
        width = juego.offsetWidth;
        height = juego.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        playerY = height - player.offsetHeight;
        offset = player.offsetWidth / 2;
        x = width / 2;
        sprites = [];
        for (i = 0; i < iniciaSprites; i++) {
            sprites.push(agregaSprite());
        }
        puntajes.energy = comienzaDulzura;
        incrementeNivel = 0;
        puntaje = 0;
        muestraDulzura.innerHTML = comienzaDulzura;
        ciclo();
    }

    /*
    Bucle Principal del Juego
    */

    function ciclo() {
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
        Muestra puntajes
        */

        muestraDulzura.innerHTML = puntajes.energy;
        muestraScore.innerHTML = ~~(puntaje / 10);
        puntaje++;

        /*
        Cuando aumenta puntaje agrega mas Sprites
        */

        if (~~(puntaje / nuevoSprite) > incrementeNivel) {
            sprites.push(agregaSprite());
            incrementeNivel++;
        }

        /*
        Posicion Jugador
        */

        if (izquierdaAbajo) {
            playerright();
        }
        if (derechaAbajo) {
            playerleft();
        }

        ctx.save();
        ctx.translate(x - offset, playerY);
        ctx.drawImage(player, 0, 0);
        ctx.restore();

        /*
          Cuando aun tienes dulzura, renderiza Siguiente instruccion, sino Juego Terminado
        */

        puntajes.energy = Math.min(puntajes.energy, 100);
        if (puntajes.energy > 0) {
            requestAnimationFrame(ciclo);
        } else {
            juegoTerminado();
        }

    };

    /*
    Accion cuando se activa la izquierda
    */

    function playerleft() {
        x -= playerIncrease;
        if (x < offset) {
            x = offset;
        }
    }

    /*
    Accion cuando se activa la derecha
    */

    function playerright() {
        x += playerIncrease;
        if (x > width - offset) {
            x = width - offset;
        }
    }

    /*
    Juego Terminado
    */

    function juegoTerminado() {
        document.body.className = 'juego-terminado';
        setActual(terminado);
        estadoDelJuego = 'juego-terminado';
        var nowscore = ~~(puntaje / 10);
        terminado.querySelector('output').innerHTML = nowscore;
        scoresGuardados.last = nowscore;
        if (nowscore > scoresGuardados.high) {
            msjJuegoTerminado.innerH9TML = msjJuegoTerminado.getAttribute('data-highscore');
            scoresGuardados.high = nowscore;
        }
    }

    /*
    Sistema de Sprite de Personajes
    */

    function sprite() {
        this.px = 0;
        this.py = 0;
        this.vx = 0;
        this.vy = 0;
        this.bueno = false;
        this.height = 0;
        this.width = 0;
        this.efectos = [];
        this.img = null;
        this.update = function () {
            this.px += this.vx;
            this.py += this.vy;
            if (~~(this.py + 10) > playerY) {
                if ((x - offset) < this.px && this.px < (x + offset)) {
                    this.py = -200;
                    i = this.efectos.length;
                    while (i--) {
                        puntajes[this.efectos[i].efecto] += +this.efectos[i].value;
                    }
                }
            }
            if (this.px > (width - this.offset) || this.px < this.offset) {
                this.vx = -this.vx;
            }
            if (this.py > height + 100) {
                if (this.type === 'bueno') {
                    i = this.efectos.length;
                    while (i--) {
                        puntajes[this.efectos[i].efecto] -= +this.efectos[i].value;
                    }
                }
                seteaDataSprite(this);
            }
        };
        this.render = function () {
            ctx.save();
            ctx.translate(this.px, this.py);
            ctx.translate(this.width * -0.5, this.height * -0.5);
            ctx.drawImage(this.img, 0, 0);
            ctx.restore();
        };
    };

    function agregaSprite() {
        var s = new sprite();
        seteaDataSprite(s);
        return s;
    };

    /*
    Obtiene los Sprites para mostrarlos por pantalla
    */

    function seteaDataSprite(sprite) {
        var r = ~~rand(0, contadorSprite);
        sprite.img = listaSprites[r].img;
        sprite.height = sprite.img.offsetHeight;
        sprite.width = sprite.img.offsetWidth;
        sprite.type = listaSprites[r].type;
        sprite.efectos = listaSprites[r].efectos;
        sprite.offset = listaSprites[r].offset;
        sprite.py = -100;
        sprite.px = rand(sprite.width / 2, width - sprite.width / 2);
        sprite.vx = rand(-1, 2);
        sprite.vy = rand(1, 5);
    };

    /*
    Seleccionador de Query
    */

    function $(str) {
        return document.querySelector(str);
    };

    /*
    Obtiene número random entre un minimo y máximo
    */

    function rand(min, max) {
        return ((Math.random() * (max - min)) + min);
    };

    /*
    Muestra parte actual del juego y oculta la anterior
    */
    function setActual(elm) {
        if (viejo) {
            viejo.className = '';
        }
        elm.className = 'current';
        viejo = elm;
    };

    /*
    Detecta y Setea requestAnimationFrame
    */

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }

    /*
    Ejecutar
    */

    init();
})();

/*
Función para activar/desactivar el audio
*/

var toggleIcoAudio = 0,
    audio = document.getElementById("audio");

function toggleAudio() {

    if (toggleIcoAudio == 0) {
        document.getElementById("audio-ico").setAttribute('src', 'Assets/audio_mute.png');
        toggleIcoAudio++;
        audio.pause();
    }
    else {
        document.getElementById("audio-ico").setAttribute('src', 'Assets/audio_on.png');
        toggleIcoAudio--;
        audio.play();
    }
}
