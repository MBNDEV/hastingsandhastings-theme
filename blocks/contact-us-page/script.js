// Video Background Form Section - Frontend JavaScript
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFormEnhancements);
    } else {
        initializeFormEnhancements();
    }
    
    function initializeFormEnhancements() {
        // Apply phone masking to all phone inputs
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(function(input) {
            
            // Initialize with placeholder if not set
            if (!input.value && !input.placeholder) {
                input.placeholder = '+1';
            }
        });
    }
  
})();
