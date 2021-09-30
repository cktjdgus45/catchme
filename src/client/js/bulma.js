const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');
const searchBtn = document.querySelector('.showSearchFrom');
const searchForm = document.querySelector('.search__form');
const userInfo = document.querySelector('.dropdown');
const modalContainer = document.querySelector('.modal');
const modalBtn = document.querySelector('.modalBtn');
const modalCloseBtn = document.querySelector('.modal-close');
const modalCardCloseBtn = document.querySelector('.delete');
const modalCardCloseBtn2 = document.querySelector('.modalSave');
const modalCardCloseBtn3 = document.querySelector('.modalClose');

//searchBtn - header
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchForm.classList.toggle('show');
    })
}

//burgerIcon - reactive web
if (burgerIcon) {
    burgerIcon.addEventListener('click', () => {
        navbarMenu.classList.toggle('is-active');
    })
}

//user info - header
if (userInfo) {
    userInfo.addEventListener('click', () => {
        userInfo.classList.toggle('is-active');
    })
}

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



