const form = document.getElementById('commentForm');

const addComment = (text) => {
    const videoComments = document.querySelector('.video__comments ul');
    const newComment = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = `${text}`;
    newComment.appendChild(span);
    videoComments.prepend(newComment);
}

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
        addComment(text);
    }
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}