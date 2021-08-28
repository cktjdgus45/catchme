const form = document.getElementById('commentForm');  //pug에 있는 html태그를 js에 가져옴.
const delBtns = document.querySelectorAll('.delBtn'); ////pug에 있는 html태그를 js에 가져옴.

const addComment = (text, newCommentId, commentOwner, createdAt) => {
    const now = moment().format('YYYY-M-D-H-m-s'); //"현재시각"
    const nowArr = now.split('-');
    const writeTime = moment(nowArr); //댓글쓴시간 ==현재
    const currentTime = moment(createdAt); //현재시간
    let cmTime = writeTime.diff(currentTime, 'seconds');
    if (cmTime < 60) {
        cmTime = '방금 전';
    }

    const videoComments = document.querySelector('.video__comments ul'); ////pug에 있는 html태그를 js에 가져옴.
    const newComment = document.createElement("li");  //html을 js를 통해 새로만듬.
    const span2 = document.createElement("span");
    newComment.dataset.id = newCommentId;
    span2.innerText = '❌';
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
                <span>${cmTime}</span>
            </div>
            <div class="content">
                <span>${text}</span>
            </div>
        </div>
    </div>
    `
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener('click', handleDelete); // ❌ 가 클릭되면 handleDelete 실행.
}

const handleDelete = async (event) => {
    event.preventDefault();
    const delbtn = event.target; // <span>❌</span> 와 동일.
    const comment = delbtn.parentNode; // li 를 의미
    const videoComments = comment.parentNode;  //ul 을 의미.
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comments/${commentId}`, { //누르면 우리의 서버로 delete 리퀘스트를 보냄. 보내서 서버에서 처리하면서 데이터베이스업데이트하고 다시 res받음.)
        method: "DELETE",
    })
    if (response.status === 201) {
        videoComments.removeChild(comment);
    }
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const video = document.querySelector('video');////pug에 있는 html태그를 js에 가져옴.
    const textarea = form.querySelector('textarea');////pug에 있는 html태그를 js에 가져옴.
    const videoId = video.dataset.id;
    const text = textarea.value; //댓글 값.
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, { //댓글 버튼을 누르면 우리서버로 POST 리퀘스트를 보냄 -> 서버는 요청을처리하면서 db업데이트하고 res 를 다시보냄.
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
