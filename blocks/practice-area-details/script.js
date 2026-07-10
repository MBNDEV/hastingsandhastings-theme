/**
 * Practice Area Details - Frontend Accordion Functionality
 */

(function () {
  'use strict';

  /**
   * Initialize accordion functionality for all blocks on the page
   */
  function initAccordions() {
    // Find all practice-area-details blocks on the page
    const blocks = document.querySelectorAll('.wp-block-mbn-theme-practice-area-details');

    blocks.forEach(function (block) {
      // Find all accordion buttons within this block
      const buttons = block.querySelectorAll('.pad-steps__question');

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const item = btn.closest('.pad-steps__item');
          if (!item) {
            return;
          }
          const answer = item.querySelector('.pad-steps__answer');
          if (!answer) {
            return;
          }
          const isOpen = item.classList.contains('pad-steps__item--open');

          if (isOpen) {
            item.classList.remove('pad-steps__item--open');
            answer.classList.add('pad-steps__answer--hidden');
            btn.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('pad-steps__item--open');
            answer.classList.remove('pad-steps__answer--hidden');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions);
  } else {
    initAccordions();
  }
})();
