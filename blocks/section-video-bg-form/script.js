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
        
        // Initialize phone masking
        initializePhoneMasking();
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
    
    function initializePhoneMasking() {
        // Phone number masking function
        function maskPhoneNumber(value) {
            const digits = value.replace(/\D/g, '');

            if (digits.length === 0) {
                return '';
            }

            // Support both:
            // - 10-digit input: 4807061100
            // - 11-digit input with country code: 14807061100
            const hasLeadingOne = digits.startsWith('1');
            const nationalPart = hasLeadingOne ? digits.substring(1, 11) : digits.substring(0, 10);

            let masked = '+1';

            if (nationalPart.length > 0) {
                masked += ' (' + nationalPart.substring(0, 3);
            }

            if (nationalPart.length >= 3) {
                masked += ')';
            }

            if (nationalPart.length > 3) {
                masked += ' ' + nationalPart.substring(3, 6);
            }

            if (nationalPart.length >= 6) {
                masked += '-';
            }

            if (nationalPart.length > 6) {
                masked += nationalPart.substring(6, 10);
            }

            return masked;
        }
        
        // Apply phone masking to all phone inputs
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(function(input) {
            input.addEventListener('input', function(e) {
                const oldValue = e.target.value;
                const oldCursorPosition = e.target.selectionStart;
                
                // Apply mask
                const newValue = maskPhoneNumber(oldValue);
                e.target.value = newValue;
                
                // Calculate new cursor position
                let newCursorPosition = oldCursorPosition;
                
                // If value got shorter (deleting), adjust cursor
                if (newValue.length < oldValue.length) {
                    // Count how many characters were deleted
                    const deletedCount = oldValue.length - newValue.length;
                    newCursorPosition = Math.max(0, oldCursorPosition - deletedCount);
                    
                    // Don't let cursor go before "+1 "
                    if (newCursorPosition < 3 && newValue.length > 0) {
                        newCursorPosition = newValue.length;
                    }
                } else if (newValue.length > oldValue.length) {
                    // Value got longer, move cursor forward
                    const addedCount = newValue.length - oldValue.length;
                    newCursorPosition = oldCursorPosition + addedCount;
                }
                
                // Set cursor position
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
            });
            
            // Handle backspace/delete specially
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    const cursorPosition = e.target.selectionStart;
                    const value = e.target.value;
                    const digitsOnly = value.replace(/\D/g, '');
                    
                    // If trying to delete when only "+1" remains or cursor is at start
                    if (digitsOnly.length <= 1 || cursorPosition <= 3) {
                        e.target.value = '';
                        e.preventDefault();
                    }
                }
            });
            
            // Initialize with placeholder if not set
            if (!input.value && !input.placeholder) {
                input.placeholder = '+1 (555) 555-5555';
            }
        });
    }
})();
