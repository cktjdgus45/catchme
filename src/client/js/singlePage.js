'use strict'

const positivePageHeight = window.innerHeight; //912
const negativePageHeight = -window.innerHeight; //-912

const sections = document.querySelectorAll('section');
console.log(sections);

const handleWheel = (e) => {
    const scrolldirection = e.deltaY;

    if (scrolldirection < 0) {//y -100 , scroll up , top -
        window.scrollBy({
            top: negativePageHeight,
            left: 0,
            behavior: 'smooth'
            //up
        })
    } else {
        window.scrollBy({
            top: positivePageHeight,
            left: 0,
            behavior: 'smooth'
            //down
        })
    }
    window.removeEventListener('wheel', handleWheel);
}

window.addEventListener('wheel', handleWheel);