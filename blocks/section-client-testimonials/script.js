// Enhanced stacking card animation on scroll + Mobile Swiper
(function() {
  'use strict';
  
  // Initialize Swiper for mobile
  function initMobileSwiper() {
    // Check if Swiper is loaded
    if (typeof Swiper === 'undefined') {
      // Load Swiper from CDN
      const swiperCSS = document.createElement('link');
      swiperCSS.rel = 'stylesheet';
      swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(swiperCSS);
      
      const swiperJS = document.createElement('script');
      swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      swiperJS.onload = function() {
        initSwiper();
      };
      document.head.appendChild(swiperJS);
    } else {
      initSwiper();
    }
    
    function initSwiper() {
      const swiperContainer = document.querySelector('.testimonials-swiper-container');
      if (!swiperContainer) return;
      
      new Swiper('.testimonials-swiper-container', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.testimonials-pagination',
          clickable: true,
        },
        breakpoints: {
          1024: {
            enabled: false,
          },
        },
      });
    }
  }
  
  // Initialize desktop stacking animation
  function initStackingCards() {
    const cards = document.querySelectorAll('.testimonials-desktop-cards .testimonial-card');
    const isMobile = () => window.innerWidth < 1024;
    
    if (!cards.length) return;
    
    function updateCards() {
      if (isMobile()) {
        // Mobile: No animation - reset all transforms
        cards.forEach((card) => {
          card.style.transform = '';
          card.style.opacity = '';
        });
        return;
      }
      
      // Desktop only: Vertical stacking with scale
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top;
        const scaleStart = 100 + (index * 20);
        
        if (cardTop <= scaleStart) {
          // Card is stacked - apply scale
          const progress = Math.max(0, 1 - (scaleStart - cardTop) / 100);
          const scale = 0.95 + (progress * 0.05);
          const opacity = 0.7 + (progress * 0.3);
          
          card.style.transform = `scale(${scale})`;
          card.style.opacity = opacity;
        } else {
          // Card is in normal position
          card.style.transform = 'scale(1)';
          card.style.opacity = '1';
        }
      });
    }
    
    window.addEventListener('scroll', updateCards);
    window.addEventListener('resize', updateCards);
    updateCards(); // Initial call
  }
  
  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMobileSwiper();
      initStackingCards();
    });
  } else {
    initMobileSwiper();
    initStackingCards();
  }
})();
