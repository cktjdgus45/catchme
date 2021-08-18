'use strict'

const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const time = document.getElementById('time');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');

let volumeValue = 0.5;
video.volume = volumeValue;

//video play pause
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerHTML = video.paused ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}
playBtn.addEventListener('click', handlePlayClick);

//video muted unmute
const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    volumeRange.value = video.muted ? 0 : volumeValue;
}
muteBtn.addEventListener('click', handleMute);

//video volume Range
const handleVolumeChange = (event) => {
    const { target: { value: volumeSize } } = event;
    volumeValue = volumeSize;
    video.volume = volumeSize;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}
volumeRange.addEventListener('input', handleVolumeChange);

//time duration
const handleLoadedMetadata = () => {
    totalTime.innerText = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = Math.floor(video.currentTime);
}

video.addEventListener('loadedmetadata', handleLoadedMetadata);
video.addEventListener('timeupdate', handleTimeUpdate);



