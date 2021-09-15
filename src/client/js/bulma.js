const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');
const searchBtn = document.querySelector('.showSearchFrom');
const searchForm = document.querySelector('.search__form');
const userInfo = document.querySelector('.dropdown');

//searchBtn - header
searchBtn.addEventListener('click', () => {
    searchForm.classList.toggle('show');
})

//burgerIcon - reactive web
burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
})

//user info - header
userInfo.addEventListener('click', () => {
    userInfo.classList.toggle('is-active');
})
