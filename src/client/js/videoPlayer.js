'use strict'

const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const time = document.getElementById('time');
const volume = document.getElementById('volume');

//video play pause
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

const handlePlay = () => playBtn.innerHTML = '<i class="fas fa-pause"></i>';
const handlePause = () => playBtn.innerHTML = '<i class="fas fa-play"></i>';

const handleMute = (e) => {
}

playBtn.addEventListener('click', handlePlayClick);
video.addEventListener('play', handlePlay)
video.addEventListener('pause', handlePause);

//video mute unmute
muteBtn.addEventListener('click', handleMute);