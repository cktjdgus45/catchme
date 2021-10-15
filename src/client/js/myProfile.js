//laeve account
const modalContainer = document.querySelector('.modal');
const modalBtn = document.querySelector('.modalBtn');
const modalCloseBtn = document.querySelector('.modal-close');
const modalCardCloseBtn = document.querySelector('.delete');
const agreeBtn = document.querySelector('.modalSave');
const disagreeBtn = document.querySelector('.modalClose');
const userSection = document.querySelector('.userData');

const leave = document.querySelector('.leave-account');
leave.addEventListener('click', () => {
    modalContainer.classList.add('is-active');
})
//modalBtn
if (modalContainer) {
    modalCloseBtn.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
}
if (disagreeBtn) {
    modalCardCloseBtn.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
    agreeBtn.addEventListener('click', async () => {
        const { dataset: { id } } = userSection;
        modalContainer.classList.remove('is-active');
        const response = await fetch(`/users/${id}/leave-account`, {
            method: "GET",
        })
        if (response.status == 201) {
            window.location.href = "/home";
        }
    })
    disagreeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
}