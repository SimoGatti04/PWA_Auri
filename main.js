import Game from './game.js';

const canvas = document.getElementById('gameCanvas');
const levelDisplay = document.getElementById('level');

const game = new Game(canvas, levelDisplay);
game.start();

// Gestione dell'orientamento per dispositivi mobili
function handleOrientation() {
    if (window.innerHeight > window.innerWidth) {
        alert("Per una migliore esperienza di gioco, si consiglia di ruotare il dispositivo in orizzontale.");
    }
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.addEventListener("orientationchange", handleOrientation);
    handleOrientation(); // Controlla l'orientamento all'avvio
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registrato', reg))
        .catch(err => console.log('Service Worker non registrato', err));
}
