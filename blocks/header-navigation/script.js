/**
 * Header Navigation - Sticky & Mobile Menu Behavior
 * Handles sticky header after 100px scroll and mobile menu interactions
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }

  function initHeader() {
    initStickyHeader();
    initMobileMenu();
  }

  /**
   * Sticky Header Functionality
   */
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    
    if (!header) {
      return;
    }

    const SCROLL_THRESHOLD = 100;
    let ticking = false;

    function updateHeaderState() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollPosition > SCROLL_THRESHOLD) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
      
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    }

    // Initial check
    updateHeaderState();

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Mobile Menu Functionality
   */
  function initMobileMenu() {
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuDrawer = document.getElementById('mobile-menu-drawer');
    
    if (!menuToggle || !menuDrawer) {
      return;
    }

    const body = document.body;

    // Toggle mobile menu
    function toggleMobileMenu() {
      menuToggle.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      menuDrawer.classList.toggle('active');
      header.classList.toggle('mobile-menu-open');
      body.style.overflow = menuDrawer.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu
    function closeMobileMenu() {
      menuToggle.classList.remove('active');
      menuOverlay.classList.remove('active');
      menuDrawer.classList.remove('active');
      header.classList.remove('mobile-menu-open');
      body.style.overflow = '';
    }

    // Menu toggle click
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close button click
    if (menuClose) {
      menuClose.addEventListener('click', closeMobileMenu);
    }

    // Overlay click to close
    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMobileMenu);
    }

    // First-level submenu toggles using event delegation
    menuDrawer.addEventListener('click', function(e) {
      // Check if clicked element is a mobile-menu-link or inside one
      const link = e.target.closest('.mobile-menu-link');
      
      if (link) {
        const submenuId = link.getAttribute('data-submenu');
        
        if (submenuId) {
          e.preventDefault();
          
          const parentItem = link.parentElement;
          const submenu = parentItem.querySelector('.mobile-submenu');
          
          // Check if we're clicking an already active item
          const isActive = parentItem.classList.contains('active');
          
          // Close all first-level submenus
          const allItems = menuDrawer.querySelectorAll('.mobile-menu-item');
          allItems.forEach(item => {
            item.classList.remove('active');
            const otherSubmenu = item.querySelector('.mobile-submenu');
            if (otherSubmenu) {
              otherSubmenu.classList.remove('active');
            }
          });
          
          // If it wasn't active, open it
          if (!isActive) {
            parentItem.classList.add('active');
            if (submenu) {
              submenu.classList.add('active');
            }
          }
        }
      }
      
      // Check if clicked element is a mobile-submenu-header or inside one
      const categoryHeader = e.target.closest('.mobile-submenu-header');
      
      if (categoryHeader) {
        e.stopPropagation();
        
        const categoryContent = categoryHeader.nextElementSibling;
        const isActive = categoryHeader.classList.contains('active');
        
        // Toggle current category
        categoryHeader.classList.toggle('active');
        if (categoryContent && categoryContent.classList.contains('mobile-submenu-content')) {
          categoryContent.classList.toggle('active');
        }
      }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    });
  }
})();
