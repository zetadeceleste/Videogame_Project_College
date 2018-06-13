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

        muestraInicio();

    }

    /*
    Función para cambiar el background durante el juego
    almacena en una array los diferentes assets de fondo de pantalla del juego
    */

    function cambiaBackground() {
        var images = ['Assets/2.png', 'Assets/3.png', 'Assets/4.png', 'Assets/5.png', 'Assets/6.png', 'Assets/7.png', 'Assets/8.png'];

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
            comenzarJuego(),
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
    /*comenzarJuego prepara el juego para comezar y setea los valores
    /*
    Comienza el Juego
    */

    function comenzarJuego() {
        setactual(juego);
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
        for (i = 0; i < initsprites; i++) {
            sprites.push(addsprite());
        }
        scores.energy = startenergy;
        levelincrease = 0;
        score = 0;
        muestraDulzura.innerHTML = startenergy;
        buclePrincipal();
    }

    /*
    Bucle Principal del Juego
    */

    function buclePrincipal() {
        ctx.clearRect(0, 0, width, height);

        /*
        Renderiza y actualiza Sprites
        */

        var j = sprites.length;
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
            requestAnimationFrame(buclePrincipal);
        } else {
            juegoterminado();
        }

    }

    /*
    Accion cuando se activa la izquierda
    */

    function playerleft() {
        x -= playerincrease;
        if (x < offset) {
            x = offset;
        }
    }

    /*
    Accion cuando se activa la derecha
    */

    function playerright() {
        x += playerincrease;
        if (x > width - offset) {
            x = width - offset;
        }
    }

    /*
    Juego Terminado
    */

    function juegoterminado() {
        document.body.className = 'juegoterminado';
        setactual(terminado);
        estadoDelJuego = 'juegoterminado';
        var nowscore = ~~(score / 10);
        terminado.querySelector('output').innerHTML = nowscore;
        scoresGuardados.last = nowscore;
        if (nowscore > scoresGuardados.high) {
            msjjuegoterminado.innerH9TML = msjjuegoterminado.getAttribute('data-highscore');
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
        this.goodguy = false;
        this.height = 0;
        this.width = 0;
        this.effects = [];
        this.img = null;
        this.update = function () {
            this.px += this.vx;
            this.py += this.vy;
            if (~~(this.py + 10) > playerY) {
                if ((x - offset) < this.px && this.px < (x + offset)) {
                    this.py = -200;
                    i = this.effects.length;
                    while (i--) {
                        scores[this.effects[i].effect] += +this.effects[i].value;
                    }
                }
            }
            if (this.px > (width - this.offset) || this.px < this.offset) {
                this.vx = -this.vx;
            }
            if (this.py > height + 100) {
                if (this.type === 'bueno') {
                    i = this.effects.length;
                    while (i--) {
                        scores[this.effects[i].effect] -= +this.effects[i].value;
                    }
                }
                setspritedata(this);
            }
        };
        this.render = function () {
            ctx.save();
            ctx.translate(this.px, this.py);
            ctx.translate(this.width * -0.5, this.height * -0.5);
            ctx.drawImage(this.img, 0, 0);
            ctx.restore();
        };
    }

    function addsprite() {
        var s = new sprite();
        setspritedata(s);
        return s;
    }
    /*
    funcion que obtiene los sprites para ostrarlos por pantalla
    */

    function setspritedata(sprite) {
        var r = ~~rand(0, contadorSprite);
        sprite.img = listaSprites[r].img;
        sprite.height = sprite.img.offsetHeight;
        sprite.width = sprite.img.offsetWidth;
        sprite.type = listaSprites[r].type;
        sprite.effects = listaSprites[r].effects;
        sprite.offset = listaSprites[r].offset;
        sprite.py = -100;
        sprite.px = rand(sprite.width / 2, width - sprite.width / 2);
        sprite.vx = rand(-1, 2);
        sprite.vy = rand(1, 5);
    }

    /*
    Seleccionador de Query
    */

    function $(str) {
        return document.querySelector(str);
    }

    /*
    Obtiene numero random entre un minimo y maximo
    */

    function rand(min, max) {
        return ((Math.random() * (max - min)) + min);
    }

    /*
    Muestra parte actual del juego y oculta la anterior
    */
    function setactual(elm) {
        if (viejo) {
            viejo.className = '';
        }
        elm.className = 'current';
        viejo = elm;
    }

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

var cambiaicoaudio = 0,
    audio = document.getElementById("audio");

function activaDesactivaAudio() {

    if (cambiaicoaudio === 0) {
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
