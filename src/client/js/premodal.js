const modalContainer = document.querySelector('.modal');
const modalBtn = document.querySelector('.modalBtn');
const modalCloseBtn = document.querySelector('.modal-close');
const modalCardCloseBtn = document.querySelector('.delete');
const modalCardCloseBtn2 = document.querySelector('.modalSave');
const modalCardCloseBtn3 = document.querySelector('.modalClose');

//modalBtn
if (modalContainer) {
    window.onload = () => {
        modalContainer.classList.add('is-active');
    }
    modalCloseBtn.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
}
if (modalCardCloseBtn3) {
    modalCardCloseBtn.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
    modalCardCloseBtn2.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
    modalCardCloseBtn3.addEventListener('click', () => {
        modalContainer.classList.remove('is-active');
    })
}