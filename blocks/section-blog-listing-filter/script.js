/**
 * Blog Listing Filter - Frontend JavaScript
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const filterToggle = document.getElementById('filterToggle');
        const dropdownFilter = document.getElementById('dropdownFilter');
        const clearFiltersBtn = document.getElementById('clearFilters');
        const applyFiltersBtn = document.getElementById('applyFilters');
        const categoryForm = document.getElementById('categoryFilterForm');

        // Always return to archive root (e.g., /blog/) instead of staying on /page/{n}/.
        const getBaseArchiveUrl = function() {
            const url = new URL(window.location.href);
            url.pathname = url.pathname.replace(/\/page\/\d+\/?$/, '/');
            return url;
        };

        if (!filterToggle || !dropdownFilter) return;

        // Toggle dropdown visibility
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownFilter.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!filterToggle.contains(event.target) && !dropdownFilter.contains(event.target)) {
                dropdownFilter.classList.add('hidden');
            }
        });

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Uncheck all checkboxes
                const checkboxes = categoryForm.querySelectorAll('.category-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });

                // Reload page without category filter
                const url = getBaseArchiveUrl();
                url.searchParams.delete('blog_categories');
                url.searchParams.delete('paged'); // Reset to page 1
                window.location.href = url.toString();
            });
        }

        // Apply filters
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                const checkboxes = categoryForm.querySelectorAll('.category-checkbox:checked');
                const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

                // Build URL with selected categories
                const url = getBaseArchiveUrl();
                
                if (selectedCategories.length > 0) {
                    url.searchParams.set('blog_categories', selectedCategories.join(','));
                } else {
                    url.searchParams.delete('blog_categories');
                }
                
                // Reset to page 1 when filtering
                url.searchParams.delete('paged');
                
                window.location.href = url.toString();
            });
        }
    });
})();
