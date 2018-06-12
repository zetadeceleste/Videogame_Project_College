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