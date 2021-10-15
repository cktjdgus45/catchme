const form = document.getElementById('commentForm');
const delBtns = document.querySelectorAll('.delBtn');

const addComment = (text, newCommentId, commentOwner, createdAt) => {
    const now = moment().format('YYYY-M-D-H-m-s'); //"현재시각"
    const nowArr = now.split('-');
    const currentTime = moment(nowArr);
    const commentTime = moment(createdAt);
    let cmTime = currentTime.diff(commentTime, 'seconds');
    if (cmTime < 60) {
        cmTime = currentTime.diff(commentTime, 'seconds') + '초전';
    }
    else if (cmTime > 60 && cmTime <= 3600) {
        cmTime = currentTime.diff(commentTime, 'minutes') + '분전';
    } else if (cmTime > 3600 && cmTime <= 86400) {
        cmTime = currentTime.diff(commentTime, 'hours') + '시간전';
    } else if (cmTime > 86400 && cmTime <= 2772000) {
        cmTime = currentTime.diff(commentTime, 'days') + '일전';
    } else if (cmTime > 2772000 && cmTime <= 31536000) {
        cmTime = currentTime.diff(commentTime, 'months') + '달전';
    } else if (cmTime > 31536000) {
        cmTime = currentTime.diff(commentTime, 'years') + '년전';
    }

    const videoComments = document.querySelector('.video__comments ul');
    const newComment = document.createElement("li");
    const span2 = document.createElement("span");
    newComment.dataset.id = newCommentId;
    span2.innerHTML = `<i class="fas fa-eraser" style="cursor:pointer;"></i>`;
    newComment.appendChild(span2);
    newComment.className = "comment";
    newComment.innerHTML = `
    <div class="comment-box">
        <div class="comment-profile">
            <img class="profileImg" src=${commentOwner.avatarUrl}>
        </div>
        <div class="comment-wrapper">
            <div class="writer">
                <span>${commentOwner.name}</span>
                <span class="write-time">${cmTime}</span>
            </div>
            <div class="content">
                <span>${text}</span>
            </div>
        </div>
    </div>
    `
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener('click', handleDelete);
}

const handleDelete = async (event) => {
    event.preventDefault();
    const icon = event.target;
    const delbtn = icon.parentNode;
    const comment = delbtn.parentNode;
    const videoComments = comment.parentNode;
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
    })
    if (response.status === 201) {
        videoComments.removeChild(comment);
    }
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
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    textarea.value = "";
    if (response.status === 201) {
        const { newCommentId, commentOwner, createdAt } = await response.json();
        addComment(text, newCommentId, commentOwner, createdAt);
    }
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}

if (delBtns) {
    delBtns.forEach(delBtn => {
        delBtn.addEventListener('click', handleDelete);
    })
}
