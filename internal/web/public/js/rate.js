// Rate functionality for Exercise Diary
// Handles click select for rate icons

let rateSelector = null;
let currentRateElement = null;

// Rate configurations
const rateConfig = {
    1: { icon: '✗', text: 'Failure', class: 'rate-1' },
    2: { icon: '○', text: 'Challenging', class: 'rate-2' },
    3: { icon: '✓', text: 'Good', class: 'rate-3' },
    4: { icon: '✓✓', text: 'Easy', class: 'rate-4' }
};

// Initialize rate functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    createRateSelector();
    setupEventListeners();
});

// Create the rate selector element
function createRateSelector() {
    rateSelector = document.createElement('div');
    rateSelector.className = 'rate-selector';
    rateSelector.id = 'rateSelector';

    // Create options for each rate level
    for (let i = 1; i <= 4; i++) {
        const option = document.createElement('div');
        option.className = 'rate-option';
        option.dataset.rate = i;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'rate-option-icon';
        iconSpan.textContent = rateConfig[i].icon;
        iconSpan.style.color = getComputedStyle(document.documentElement).getPropertyValue('--rate-' + i + '-color') ||
            (i === 1 ? '#dc3545' : i === 2 ? '#ffc107' : '#28a745');

        const textSpan = document.createElement('span');
        textSpan.className = 'rate-option-text';
        textSpan.textContent = rateConfig[i].text;

        option.appendChild(iconSpan);
        option.appendChild(textSpan);

        // Add click handler
        option.addEventListener('click', function () {
            selectRate(i);
        });

        rateSelector.appendChild(option);
    }

    document.body.appendChild(rateSelector);
}

// Setup event listeners for rate icons
function setupEventListeners() {
    // Handle clicks outside rate selector to close it
    document.addEventListener('click', function (e) {
        if (!rateSelector.contains(e.target) && !e.target.classList.contains('rate-icon')) {
            hideRateSelector();
        }
    });

    // Prevent selector from closing when clicking inside it
    rateSelector.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

// Show rate selector at specific position
function showRateSelector(x, y, currentRate) {
    rateSelector.style.left = x + 'px';
    rateSelector.style.top = y + 'px';
    rateSelector.classList.add('active');

    // Highlight current rate
    const options = rateSelector.querySelectorAll('.rate-option');
    options.forEach(option => {
        option.classList.remove('selected');
        if (parseInt(option.dataset.rate) === currentRate) {
            option.classList.add('selected');
        }
    });
}

// Hide rate selector
function hideRateSelector() {
    rateSelector.classList.remove('active');
    currentRateElement = null;
}

// Select a rate value
function selectRate(rate) {
    if (currentRateElement) {
        updateRateIcon(currentRateElement, rate);
        // Update the hidden input value
        const input = currentRateElement.querySelector('input[name="rate"]');
        if (input) {
            input.value = rate;
        }
    }
    hideRateSelector();
}

// Update rate icon display
function updateRateIcon(element, rate) {
    const iconSpan = element.querySelector('.rate-icon-display');
    if (iconSpan) {
        iconSpan.textContent = rateConfig[rate].icon;
        iconSpan.className = 'rate-icon-display rate-icon ' + rateConfig[rate].class;
    }
}

// Handle rate icon click
function handleRateClick(e, element) {
    e.preventDefault();
    e.stopPropagation();

    // Ensure rate selector is initialized
    if (!rateSelector) {
        createRateSelector();
    }

    currentRateElement = element;

    const currentRate = parseInt(element.querySelector('input[name="rate"]').value) || 2;

    // Get icon position
    const rect = element.getBoundingClientRect();

    // Temporarily show selector to measure its dimensions
    rateSelector.style.visibility = 'hidden';
    rateSelector.classList.add('active');
    const selectorWidth = rateSelector.offsetWidth;
    const selectorHeight = rateSelector.offsetHeight;
    rateSelector.classList.remove('active');
    rateSelector.style.visibility = 'visible';

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    let x, y;

    if (isMobile) {
        // On mobile, position based on the rate icon element position
        // position:absolute needs document coordinates, so add scroll offset
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

        // Position popup below the rate icon to avoid covering it
        x = rect.left + scrollX; // Convert viewport to document coordinates
        y = rect.bottom + scrollY + 10; // Position below icon with spacing

        // Adjust if popup goes off-screen horizontally
        if (x < scrollX + 10) {
            x = scrollX + 10; // Minimum left margin
        } else if (x + selectorWidth > scrollX + viewportWidth - 10) {
            x = scrollX + viewportWidth - selectorWidth - 10; // Minimum right margin
        }

        // Adjust if popup goes off-screen vertically (bottom)
        if (y + selectorHeight > scrollY + viewportHeight - 10) {
            // If no space below, position above the icon
            y = rect.top + scrollY - selectorHeight - 10;
            // If still off-screen above, position at minimum top margin
            if (y < scrollY + 10) {
                y = scrollY + 10;
            }
        }
    } else {
        // Desktop behavior: position relative to icon
        x = rect.right + 10;
        y = rect.top;

        // Check if popup would go off-screen to the right
        if (x + selectorWidth > viewportWidth) {
            x = rect.left - selectorWidth - 10;
        }

        // Check if popup would go off-screen to the bottom
        if (y + selectorHeight > viewportHeight) {
            y = rect.bottom - selectorHeight;
            // If still off-screen, position above the icon
            if (y < 0) {
                y = rect.top - selectorHeight - 10;
            }
        }

        // Ensure popup doesn't go above viewport
        if (y < 0) {
            y = rect.bottom + 10;
        }
    }

    showRateSelector(x, y, currentRate);
}

// Alias for handleRateClick to support mousedown event
function handleRateMouseDown(e, element) {
    handleRateClick(e, element);
}