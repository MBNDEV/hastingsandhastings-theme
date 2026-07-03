/**
 * Blog Listing Filter - Frontend JavaScript
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const blocks = document.querySelectorAll('.blog-listing-filter-block');

        if (!blocks.length) return;

        // Always return to archive root (e.g., /blog/) instead of staying on /page/{n}/.
        const getBaseArchiveUrl = function() {
            const url = new URL(window.location.href);
            url.pathname = url.pathname.replace(/\/page\/\d+\/?$/, '/');
            return url;
        };

        blocks.forEach(function(block) {
            const filterToggle = block.querySelector('.filter-toggle');
            const dropdownFilter = block.querySelector('.dropdown-filter');
            const clearFiltersBtn = block.querySelector('.clear-filters');
            const applyFiltersBtn = block.querySelector('.apply-filters');
            const categoryForm = block.querySelector('.category-filter-form');

            if (!filterToggle || !dropdownFilter || !categoryForm) return;

            // Toggle dropdown visibility.
            filterToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownFilter.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside current block.
            document.addEventListener('click', function(event) {
                if (!block.contains(event.target)) {
                    dropdownFilter.classList.add('hidden');
                }
            });

            // Clear all filters.
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', function() {
                    const checkboxes = categoryForm.querySelectorAll('.category-checkbox');
                    checkboxes.forEach(function(checkbox) {
                        checkbox.checked = false;
                    });

                    const url = getBaseArchiveUrl();
                    url.searchParams.delete('blog_categories');
                    url.searchParams.delete('paged'); // Reset to page 1.
                    window.location.href = url.toString();
                });
            }

            // Apply filters.
            if (applyFiltersBtn) {
                applyFiltersBtn.addEventListener('click', function() {
                    const checkboxes = categoryForm.querySelectorAll('.category-checkbox:checked');
                    const selectedCategories = Array.from(checkboxes).map(function(cb) {
                        return cb.value;
                    });

                    const url = getBaseArchiveUrl();

                    if (selectedCategories.length > 0) {
                        url.searchParams.set('blog_categories', selectedCategories.join(','));
                    } else {
                        url.searchParams.delete('blog_categories');
                    }

                    // Reset to page 1 when filtering.
                    url.searchParams.delete('paged');
                    window.location.href = url.toString();
                });
            }
            });
    });
})();
