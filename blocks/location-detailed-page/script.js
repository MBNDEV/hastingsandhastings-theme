/**
 * Frontend script for Location Detailed Page block
 * Initializes Swiper slider for testimonials section
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if Swiper is loaded
  if (typeof Swiper === 'undefined') {
    return;
  }

  // Initialize all testimonial sliders on the page
  const testimonialContainers = document.querySelectorAll('.ldp-testimonial__swiper-container');
  
  testimonialContainers.forEach((container) => {
    // Find pagination and navigation elements within this specific container
    const pagination = container.querySelector('.ldp-testimonial__pagination');
    // const prevButton = container.querySelector('.ldp-testimonial__button-prev');
    // const nextButton = container.querySelector('.ldp-testimonial__button-next');

    // Initialize Swiper for this container
    new Swiper(container, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation:false, // Disable navigation for now
      pagination: {
        el: pagination,
        clickable: true,
      },
      // navigation: {
      //   nextEl: nextButton,
      //   prevEl: prevButton,
      // },
      // breakpoints: {
      //   768: {
      //     slidesPerView: 2,
      //     spaceBetween: 30,
      //   },
      //   1024: {
      //     slidesPerView: 3,
      //     spaceBetween: 40,
      //   },
      // },
    });
  });

  document.querySelectorAll('.ldp-accordion__question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item   = btn.closest('.ldp-accordion__item');
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      if (!item || !answer) {
        return;
      }
      var isOpen = item.classList.contains('ldp-accordion__item--open');

      if (isOpen) {
        item.classList.remove('ldp-accordion__item--open');
        answer.classList.add('ldp-accordion__answer--hidden');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('ldp-accordion__item--open');
        answer.classList.remove('ldp-accordion__answer--hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
