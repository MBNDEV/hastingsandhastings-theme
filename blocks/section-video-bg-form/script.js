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
        // Initialize help icons and tooltips
        initializeHelpIcons();
        
    }
    
    function initializeHelpIcons() {
        // Find all email fields with help
        const emailFields = document.querySelectorAll('.gfield_email_with_help .ginput_container_email');
        
        emailFields.forEach(function(container) {
            // Create help icon element
            const helpIcon = document.createElement('span');
            helpIcon.className = 'gfield_help_icon';
            helpIcon.setAttribute('tabindex', '0');
            helpIcon.setAttribute('role', 'button');
            helpIcon.setAttribute('aria-label', 'Help: Email format');
            
            // Create tooltip element
            const tooltip = document.createElement('span');
            tooltip.className = 'gfield_help_tooltip';
            tooltip.textContent = 'Please enter a valid email address (e.g., name@example.com)';
            
            // Append tooltip to help icon
            helpIcon.appendChild(tooltip);
            
            // Append help icon to container
            container.appendChild(helpIcon);
        });
        
        // Find all phone fields with help
        const phoneFields = document.querySelectorAll('.gfield_phone_with_help .ginput_container_phone');
        
        phoneFields.forEach(function(container) {
            // Create help icon element
            const helpIcon = document.createElement('span');
            helpIcon.className = 'gfield_help_icon';
            helpIcon.setAttribute('tabindex', '0');
            helpIcon.setAttribute('role', 'button');
            helpIcon.setAttribute('aria-label', 'Help: Phone format');
            
            // Create tooltip element
            const tooltip = document.createElement('span');
            tooltip.className = 'gfield_help_tooltip';
            tooltip.textContent = 'Please enter a valid phone number (e.g., (555) 123-4567)';
            
            // Append tooltip to help icon
            helpIcon.appendChild(tooltip);
            
            // Append help icon to container
            container.appendChild(helpIcon);
        });
        
        // Tooltip functionality
        const helpIcons = document.querySelectorAll('.gfield_help_icon');
        
        helpIcons.forEach(function(icon) {
            // Handle click for mobile devices
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
                
                // Close other tooltips
                helpIcons.forEach(function(otherIcon) {
                    if (otherIcon !== icon) {
                        otherIcon.classList.remove('active');
                    }
                });
            });
            
            // Handle keyboard accessibility
            icon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.classList.toggle('active');
                }
            });
        });
        
        // Close tooltip when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.gfield_help_icon')) {
                helpIcons.forEach(function(icon) {
                    icon.classList.remove('active');
                });
            }
        });
    }
    
})();
