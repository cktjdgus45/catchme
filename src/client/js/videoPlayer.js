'use strict'

const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const time = document.getElementById('time');
const volumeRange = document.getElementById('volume');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const timeLine = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

let volumeValue = 0.5;
let controlsTimeout = null;
let controlsMove = null;
video.volume = volumeValue;

//video play pause
const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerHTML = video.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
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
    muteBtn.innerHTML = volumeSize == 0 ? '<i class="fas fa-volume-off"></i>' : '<i class="fas fa-volume-up"></i>';
}
volumeRange.addEventListener('input', handleVolumeChange);

//time duration
const handleLoadedMetadata = () => {
    totalTime.innerText = Math.floor(video.duration);
    timeLine.max = Math.floor(video.duration);
}
video.addEventListener('loadedmetadata', handleLoadedMetadata);

const handleFormatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);
const handleTimeUpdate = () => {
    currentTime.innerText = handleFormatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
    if (video.ended) {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}
video.addEventListener('timeupdate', handleTimeUpdate);

//timeLine
const handleTimeLineChange = (event) => {
    const { target: { value } } = event;
    video.currentTime = value;
}
timeLine.addEventListener('input', handleTimeLineChange);

//Full Screen

const handleFullScreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
        fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    }
}
fullScreenBtn.addEventListener('click', handleFullScreen);

//video controls event
const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMove) {
        clearTimeout(controlsMove);
        controlsMove = null;
    }
    videoControls.classList.add("showing");
    controlsMove = setTimeout(() => { hideControls() }, 3000);
}
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(() => {
        hideControls();
    }, 3000);
}

video.addEventListener('mousemove', handleMouseMove);
video.addEventListener('mouseleave', handleMouseLeave);



