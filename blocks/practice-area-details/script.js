/**
 * Practice Area Details - Frontend Accordion & Popup Functionality
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

  /**
   * Initialize popup modals for pad-split items. Each modal lives inside its
   * own .pad-split container, so a trigger link only ever opens the modal
   * within the same container — no unique ids needed.
   */
  function initPopupModals() {
    const blocks = document.querySelectorAll('.wp-block-mbn-theme-practice-area-details');

    blocks.forEach(function (block) {
      const splits = block.querySelectorAll('.pad-split');

      splits.forEach(function (split) {
        const modal = split.querySelector('.pad-split__modal');
        if (!modal) {
          return;
        }
        const closeBtn = modal.querySelector('.pad-split__modal-close');
        const backdrop = modal.querySelector('.pad-split__modal-backdrop');
        if (!closeBtn || !backdrop) {
          return;
        }
        let activeElementBeforeModal;

        function openModal() {
          activeElementBeforeModal = document.activeElement;
          modal.removeAttribute('hidden');
          document.body.style.overflow = 'hidden';
          closeBtn.focus();
        }

        function closeModal() {
          modal.setAttribute('hidden', '');
          document.body.style.overflow = '';
          if (activeElementBeforeModal) {
            activeElementBeforeModal.focus();
          }
        }

        split.querySelectorAll('a[href="#popup"]').forEach(function (link) {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
          });
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal();
          }
        });
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAccordions();
      initPopupModals();
    });
  } else {
    initAccordions();
    initPopupModals();
  }
})();
