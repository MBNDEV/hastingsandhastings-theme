// Enhanced stacking card animation on scroll + Mobile Swiper
(function() {
  'use strict';
  
  // Initialize Swiper for mobile
  function initMobileSwiper() {
    const swiperContainers = document.querySelectorAll('.testimonials-swiper-container');
    if (!swiperContainers.length || typeof Swiper === 'undefined') return;
    
    // Initialize each Swiper instance independently to support multiple blocks
    swiperContainers.forEach((container) => {
      new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: container.querySelector('.testimonials-pagination'),
          clickable: true,
        },
        breakpoints: {
          1024: {
            enabled: false,
          },
        },
      });
    });
  }
  
  // Initialize desktop stacking animation
  function initStackingCards() {
    const containers = document.querySelectorAll('.testimonials-desktop-cards');
    const isMobile = () => window.innerWidth < 1024;
    
    if (!containers.length) return;
    
    // Process each container independently to support multiple instances
    containers.forEach((container) => {
      const cards = container.querySelectorAll('.testimonial-card');
      if (!cards.length) return;
      
      let ticking = false;
      
      function updateCards() {
        if (isMobile()) {
          // Mobile: No animation - reset all transforms
          cards.forEach((card) => {
            card.style.transform = '';
            card.style.opacity = '';
          });
          ticking = false;
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
        
        ticking = false;
      }
      
      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(updateCards);
          ticking = true;
        }
      }
      
      function onResize() {
        if (!ticking) {
          window.requestAnimationFrame(updateCards);
          ticking = true;
        }
      }
      
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      updateCards(); // Initial call
    });
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
