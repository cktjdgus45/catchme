const videoLabel = document.getElementById('video-label');

function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
            const previewImage = document.getElementById("preview-image")
            previewImage.src = e.target.result
        }
        reader.readAsDataURL(input.files[0])
    }
}
function readVideo(input) {
    console.log(input)
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = e => {
            const previewVideo = document.createElement("video");
            previewVideo.src = e.target.result
            previewVideo.controls = true;
            previewVideo.loop = true;
            previewVideo.autoplay = true;
            makeLabelToVideo(previewVideo);
        }
        reader.readAsDataURL(input.files[0])
    }
}

function removeAllChild(parent) {
    while (videoLabel.hasChildNodes()) {
        videoLabel.removeChild(videoLabel.firstChild);
    }
}

function makeLabelToVideo(video) {
    removeAllChild(videoLabel);
    videoLabel.appendChild(video);
}
const inputImage = document.querySelector(".input-image")
inputImage.addEventListener("change", e => {
    readImage(e.target)
})
const inputVideo = document.querySelector(".input-video")
inputVideo.addEventListener("change", e => {
    readVideo(e.target)
})