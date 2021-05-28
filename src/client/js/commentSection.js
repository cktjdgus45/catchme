const form = document.getElementById('commentForm');

const handleSubmit = (event) => {
    event.preventDefault();
    const video = document.querySelector('video');
    const textarea = form.querySelector('textarea');
    const videoId = video.dataset.id;
    const text = textarea.value;
    if (text === "") {
        return;
    }
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json"
        }
    })
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}