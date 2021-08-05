'use strict'

const positivePageHeight = window.innerHeight; //912 ==100vh
const negativePageHeight = -window.innerHeight; //-912 ==100vh

const sections = document.querySelectorAll('section');// 무시
console.log(sections);

const handleWheel = (e) => {
    const scrolldirection = e.deltaY; //마위스 휠방향에따라 100과 -100으로 나뉨.

    if (scrolldirection < 0) {//y -100 , scroll up , top -
        window.scrollBy({
            top: negativePageHeight, //css생각하면됨.
            left: 0,
            behavior: 'smooth'
            //up
        })
    } else {
        window.scrollBy({  //scrollBy 100vh씩 scroll 한다.
            top: positivePageHeight,
            left: 0,
            behavior: 'smooth'
            //down
        })
    }
    window.removeEventListener('wheel', handleWheel); //무시
}

window.addEventListener('wheel', handleWheel); //scroll 이벤트함수등록