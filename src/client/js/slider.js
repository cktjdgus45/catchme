const swiper = new Swiper('.swiper', {
    // If we need pagination
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    centeredSlides: true,
    speed: 2000,
    effect: "fade",
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});