const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');
const searchBtn = document.querySelector('.showSearchFrom');
const searchForm = document.querySelector('.search__form');
const userInfo = document.querySelector('.dropdown');


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

