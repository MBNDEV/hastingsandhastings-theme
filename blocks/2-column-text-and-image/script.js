(function () {
  'use strict';

  function initAwardsSliders() {
    const sliders = document.querySelectorAll('.wp-block-mbn-theme-two-column-text-and-image .section-two-column-text-image__awards-slider');

    if (!sliders.length || typeof Swiper === 'undefined') {
      return;
    }

    sliders.forEach((slider) => {
      if (slider.swiper) {
        return;
      }

      new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: false,
        pagination: false,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 48,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 64,
          },
        },
      });
    });
  }

  function whenSwiperReady(callback) {
    if (typeof Swiper !== 'undefined') {
      callback();
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;

      if (typeof Swiper !== 'undefined') {
        window.clearInterval(timer);
        callback();
      }

      if (attempts >= 40) {
        window.clearInterval(timer);
      }
    }, 100);
  }

  function boot() {
    whenSwiperReady(initAwardsSliders);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
