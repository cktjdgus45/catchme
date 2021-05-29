const form = document.getElementById('commentForm');

const handleSubmit = async (event) => {
    event.preventDefault();
    const video = document.querySelector('video');
    const textarea = form.querySelector('textarea');
    const videoId = video.dataset.id;
    const text = textarea.value;
    if (text === "") {
        return;
    }
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    textarea.value = "";
    if (status === 201) {
        console.log("create fake Comments");
    }
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}