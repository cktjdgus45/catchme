'use strict'

const btn = document.querySelector('.btn');

const positivePageHeight = window.innerHeight; //912
const negativePageHeight = -window.innerHeight; //-912

let ticking = false;

const doSomething = (y) => {
    if (y < 0) {//y -100 , scroll up , top -
        window.scrollBy({
            top: negativePageHeight,
            left: 0,
            behavior: 'smooth'
        })
    } else {
        window.scrollBy({
            top: positivePageHeight,
            left: 0,
            behavior: 'smooth'
        })
    }
}

window.addEventListener('wheel', function (e) {
    const y = e.deltaY;
    if (!ticking) {
        window.requestAnimationFrame(function () {
            doSomething(y);
            ticking = false;
        });
        ticking = true;
    }
});
btn.addEventListener('click', () => {
    window.scrollBy({
        top: positivePageHeight,
        left: 0,
        behavior: 'smooth'
    })
})




