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
if (videoLabel) {
    function removeAllChild(parent) {
        parent.childNodes[1].style.display = "none";
        parent.childNodes[2].style.display = "none";
        parent.childNodes[3].style.display = "none";
    }

    function makeLabelToVideo(video) {
        removeAllChild(videoLabel);
        videoLabel.appendChild(video);
    }
}

const inputImage = document.querySelector(".input-image")
if (inputImage) {
    inputImage.addEventListener("change", e => {
        readImage(e.target)
    })
}

const inputVideo = document.querySelector(".input-video")
if (inputVideo) {
    inputVideo.addEventListener("change", e => {
        readVideo(e.target)
    })
}