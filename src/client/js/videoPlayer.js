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

let volumeValue = 1;
let controlsTimeout = null;
let controlsMove = null;
video.volume = volumeValue;

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
    currentTime.innerText = '00:00';
    totalTime.innerText = `00:${Math.floor(video.duration)}`;
    timeLine.max = Math.floor(video.duration);
}
video.addEventListener('loadedmetadata', handleLoadedMetadata);

const handleFormatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);
const handleTimeUpdate = () => {
    currentTime.innerText = handleFormatTime(Math.ceil(video.currentTime));
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
    controlsMove = setTimeout(() => { hideControls() }, 2000);
}
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(() => {
        hideControls();
    }, 2000);
}

videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
//play
const handleVideoPlay = () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerHTML = video.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}
//play when click video
video.addEventListener('click', (event) => {
    handleVideoPlay();
})

//play when click playBtn
const handlePlayClick = (e) => {
    handleVideoPlay();
}
playBtn.addEventListener('click', handlePlayClick);

//play when press keyboard
const handlePressKey = (e) => {
    const pressedKey = e.code;
    if (pressedKey === "Space" && e.target.localName !== "textarea") {
        e.preventDefault();
        handleVideoPlay();
    }
}
document.addEventListener('keypress', handlePressKey);

//register view count

const handleVideoEnded = async () => {
    const { dataset: { id } } = video;
    await fetch(`/api/videos/${id}/view`, {
        method: "POST",
    })
}

video.addEventListener('ended', handleVideoEnded);





