const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");

let recorder, stream;

const handleRecord = (stream) => {
    recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        video.src = URL.createObjectURL(completeBlob);
    };
    recorder.start();
}

async function recordScreen() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
        return window.alert('화면 녹화가 지원되지 않습니다')
    }
    stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" }, audio: { 'echoCancellation': true } });
    if (window.confirm("오디오를 켜시겠습니까?")) {
        const audioContext = new AudioContext();
        const audioDestination = audioContext.createMediaStreamDestination();
        const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });
        const userAudio = audioContext.createMediaStreamSource(voiceStream);
        userAudio.connect(audioDestination);

        if (displayStream.getAudioTracks().length > 0) {
            const displayAudio = audioContext.createMediaStreamSource(displayStream);
            displayAudio.connect(audioDestination);
        }

        const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
        stream = new MediaStream(tracks);
        handleRecord(stream);
    } else {
        stream = displayStream;
        handleRecord(stream);
    };
    stream.getVideoTracks()[0].onended = function () {
        // doWhatYouNeedToDo();
        console.log('stop sharing')
        stop.setAttribute("disabled", true);
        start.removeAttribute("disabled");

        recorder.stop();
        stream.getAudioTracks()[0].stop();
        stream.getVideoTracks()[0].stop();
    };
}

start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");

    recordScreen();
});

stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");

    recorder.stop();
    stream.getVideoTracks()[0].stop();
    stream.getAudioTracks()[0].stop();
});



