const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");

let recorder, stream;

async function recordScreen() {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
        return window.alert('Screen Record not supported!')
    }
    stream = null;
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "motion" }, audio: { 'echoCancellation': true } });
    if (window.confirm("Record audio with screen?")) {
        const audioContext = new AudioContext();

        const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });
        const userAudio = audioContext.createMediaStreamSource(voiceStream);

        const audioDestination = audioContext.createMediaStreamDestination();
        userAudio.connect(audioDestination);

        if (displayStream.getAudioTracks().length > 0) {
            const displayAudio = audioContext.createMediaStreamSource(displayStream);
            displayAudio.connect(audioDestination);
        }

        const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
        stream = new MediaStream(tracks);
        recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
            const completeBlob = new Blob(chunks, { type: chunks[0].type });
            video.src = URL.createObjectURL(completeBlob);
        };

        recorder.start();

    } else {
        stream = displayStream;
        recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = e => {
            const completeBlob = new Blob(chunks, { type: chunks[0].type });
            video.src = URL.createObjectURL(completeBlob);
        };
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
});

