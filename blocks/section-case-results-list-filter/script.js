(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var blocks = document.querySelectorAll('.case-results-filter-block');

    if (!blocks.length) {
      return;
    }

    blocks.forEach(function(block) {
      var toggle = block.querySelector('.case-results-filter__dropdown');
      var panel = block.querySelector('.dropdown-filter');
      var clearButton = block.querySelector('.dropdown-filter__btn-clear');
      var applyButton = block.querySelector('.dropdown-filter__btn-apply');
      var defaultLabel = block.getAttribute('data-default-label') || 'All Cases';

      if (!toggle || !panel) {
        return;
      }

      var dropdownLabel = toggle.querySelector('.case-results-filter__dropdown-text');
      var checkboxes = panel.querySelectorAll('.dropdown-filter__checkbox');
      var cards = block.querySelectorAll('.case-results-filter__item');
      var emptyMessage = block.querySelector('.case-results-filter__empty');

      function getSelectedValues() {
        var selected = [];
        checkboxes.forEach(function(checkbox) {
          if (checkbox.checked) {
            selected.push(checkbox.value);
          }
        });

        return selected;
      }

      function updateDropdownLabel() {
        if (!dropdownLabel) {
          return;
        }

        var selectedLabels = [];
        checkboxes.forEach(function(checkbox) {
          if (checkbox.checked) {
            selectedLabels.push(checkbox.getAttribute('data-label') || checkbox.value);
          }
        });

        if (!selectedLabels.length) {
          dropdownLabel.textContent = defaultLabel;
          return;
        }

        if (selectedLabels.length === 1) {
          dropdownLabel.textContent = selectedLabels[0];
          return;
        }

        dropdownLabel.textContent = selectedLabels.length + ' filters selected';
      }

      function applyFilters() {
        var selected = getSelectedValues();
        var visibleCount = 0;

        cards.forEach(function(item) {
          var termsRaw = item.getAttribute('data-case-categories') || '';
          var terms = termsRaw
            .split(',')
            .map(function(term) {
              return term.trim();
            })
            .filter(function(term) {
              return term.length > 0;
            });

          var matches = !selected.length || selected.some(function(slug) {
            return terms.indexOf(slug) !== -1;
          });

          if (matches) {
            item.classList.remove('is-hidden');
            item.removeAttribute('aria-hidden');
            visibleCount += 1;
          } else {
            item.classList.add('is-hidden');
            item.setAttribute('aria-hidden', 'true');
          }
        });

        if (emptyMessage) {
          emptyMessage.hidden = visibleCount !== 0;
        }

        updateDropdownLabel();
      }

      function closePanel() {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }

      toggle.addEventListener('click', function(event) {
        event.stopPropagation();
        var isOpen = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', function(event) {
        if (!block.contains(event.target)) {
          closePanel();
        }
      });

      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          closePanel();
        }
      });

      if (clearButton) {
        clearButton.addEventListener('click', function() {
          checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
          });
          applyFilters();
        });
      }

      if (applyButton) {
        applyButton.addEventListener('click', function() {
          applyFilters();
          closePanel();
        });
      }

      applyFilters();
    });
  });
})();
