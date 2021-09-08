const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');
const searchBtn = document.querySelector('.showSearchFrom');
const searchForm = document.querySelector('.search__form');

console.log(searchBtn, searchForm)

searchBtn.addEventListener('click', () => {
    console.log('clicked');
    searchForm.classList.toggle('show');
})

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
})