// domains.js - Domain page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips if using Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Domain Search Functionality
    const domainSearchForm = document.getElementById('domainSearchForm');
    const domainInput = document.getElementById('domainInput');
    const tldSelect = document.getElementById('tldSelect');
    const searchResults = document.getElementById('searchResults');
    const resultsSection = document.getElementById('searchResultsSection');
    
    if (domainSearchForm) {
        domainSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchDomain();
        });
    }
    
    // Auto-focus search input
    if (domainInput) {
        domainInput.focus();
    }
    
    // Domain Transfer Form
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            initiateTransfer();
        });
    }
    
    // TLD Selection
    const tldItems = document.querySelectorAll('.tld-item');
    tldItems.forEach(item => {
        item.addEventListener('click', function() {
            const tld = this.getAttribute('data-tld');
            if (domainInput) {
                const currentValue = domainInput.value.split('.')[0];
                domainInput.value = currentValue + tld;
                searchDomain();
            }
        });
    });
    
    // TLD Box Selection
    const tldBoxes = document.querySelectorAll('.tld-box');
    tldBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const tld = this.getAttribute('data-tld');
            if (domainInput) {
                const currentValue = domainInput.value.split('.')[0];
                domainInput.value = currentValue + tld;
                if (tldSelect) {
                    tldSelect.value = tld;
                }
                searchDomain();
            }
        });
    });
    
    // Setup domain suggestions
    setupDomainSuggestions();
    
    // Billing period toggle
    const billingToggle = document.getElementById('billingToggle');
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            toggleBillingPeriod(this.checked ? 'yearly' : 'monthly');
            const toggleSection = document.querySelector('.toggle-section');
            if (toggleSection) {
                toggleSection.classList.toggle('toggle-on', this.checked);
            }
        });
    }
});

// Search Domain Function
function searchDomain() {
    const domainInput = document.getElementById('domainInput');
    const searchResults = document.getElementById('searchResults');
    const resultsSection = document.getElementById('searchResultsSection');
    
    if (!domainInput || !searchResults) return;
    
    const domain = domainInput.value.trim();
    if (!domain) {
        showNotification('Please enter a domain name', 'warning');
        return;
    }
    
    // Validate domain format
    if (!isValidDomain(domain)) {
        showNotification('Please enter a valid domain name', 'warning');
        return;
    }
    
    // Show results section
    if (resultsSection) {
        resultsSection.style.display = 'block';
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    // Show loading state
    searchResults.innerHTML = `
        <div class="domain-result">
            <div class="domain-name">Searching for <strong>${domain}</strong>...</div>
            <div class="domain-status">
                <span class="spinner-border spinner-border-sm" role="status"></span> Checking
            </div>
        </div>
    `;
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Mock results (in real implementation, this would be an API call)
        const baseDomain = domain.includes('.') ? domain.split('.')[0] : domain;
        const mockResults = [
            { domain: baseDomain + '.com', available: Math.random() > 0.6, price: 'R338' },
            { domain: baseDomain + '.co.za', available: Math.random() > 0.5, price: 'R149' },
            { domain: baseDomain + '.net', available: Math.random() > 0.7, price: 'R438' },
            { domain: baseDomain + '.org', available: Math.random() > 0.8, price: 'R438' },
            { domain: baseDomain + '.africa', available: Math.random() > 0.9, price: 'R778' },
        ];
        
        displayResults(mockResults);
    }, 1200);
}

// Validate domain name
function isValidDomain(domain) {
    const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return pattern.test(domain) || /^[a-zA-Z0-9-]+$/.test(domain);
}

// Display Search Results
function displayResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    results.forEach((result, index) => {
        setTimeout(() => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'domain-result';
            resultDiv.style.animationDelay = `${index * 0.1}s`;
            
            const statusClass = result.available ? 'available' : 'taken';
            const statusText = result.available ? 'Available' : 'Taken';
            
            resultDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="domain-name">${result.domain}</div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="domain-status ${statusClass}">${statusText}</div>
            `;
            
            if (result.available) {
                resultDiv.innerHTML += `
                    <button class="pricing-btn ms-3" style="padding: 8px 20px; font-size: 0.9rem;" 
                            onclick="registerDomain('${result.domain}', '${result.price}')">
                        Register ${result.price}/yr
                    </button>
                `;
            } else {
                resultDiv.innerHTML += `
                    <button class="btn btn-outline-secondary ms-3" style="padding: 8px 20px; font-size: 0.9rem;" 
                            onclick="showTransferModal('${result.domain}')">
                        Transfer
                    </button>
                `;
            }
            
            resultDiv.innerHTML += `</div>`;
            searchResults.appendChild(resultDiv);
        }, index * 100);
    });
}

// Register Domain Function
function registerDomain(domain, price) {
    showNotification(`Adding ${domain} to cart...`, 'success');
    
    // In real implementation, add to cart and redirect
    setTimeout(() => {
        window.location.href = `checkout.html?domain=${encodeURIComponent(domain)}&price=${encodeURIComponent(price)}`;
    }, 800);
}

// Show transfer modal
function showTransferModal(domain) {
    const modal = new bootstrap.Modal(document.getElementById('transferModal'));
    const domainInput = document.querySelector('#transferModal input[name="domain"]');
    if (domainInput) {
        domainInput.value = domain;
    }
    modal.show();
}

// Initiate Transfer Function
function initiateTransfer() {
    const domain = document.getElementById('transferDomain')?.value;
    const authCode = document.getElementById('authCode')?.value;
    const email = document.getElementById('contactEmail')?.value;
    
    if (!domain || !authCode || !email) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    // Show loading state
    const transferBtn = document.querySelector('#transferForm button[type="submit"]');
    const originalText = transferBtn.textContent;
    transferBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Processing...';
    transferBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification(`Transfer initiated for ${domain}. We will contact you with further instructions.`, 'success');
        transferBtn.textContent = originalText;
        transferBtn.disabled = false;
        
        // Reset form
        document.getElementById('transferForm').reset();
    }, 1500);
}

// TLD Pricing Filter
function filterTLDs(searchTerm) {
    const tldItems = document.querySelectorAll('.tld-item');
    searchTerm = searchTerm.toLowerCase().trim();
    
    tldItems.forEach((item, index) => {
        const extension = item.getAttribute('data-tld')?.toLowerCase() || '';
        const description = item.textContent.toLowerCase();
        
        if (!searchTerm || extension.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = 'block';
            item.style.animationDelay = `${index * 0.05}s`;
        } else {
            item.style.display = 'none';
        }
    });
}

// Toggle Billing Period
function toggleBillingPeriod(period) {
    const prices = document.querySelectorAll('.tld-price, .pricing-price');
    const periodElements = document.querySelectorAll('.period, .tld-subtitle');
    
    prices.forEach(priceElement => {
        const monthlyPrice = priceElement.getAttribute('data-monthly');
        const yearlyPrice = priceElement.getAttribute('data-yearly');
        
        if (monthlyPrice && yearlyPrice) {
            if (period === 'yearly') {
                priceElement.textContent = `R${yearlyPrice}`;
                const parent = priceElement.closest('.tld-box, .pricing-card');
                if (parent && parent.querySelector('.tld-subtitle')) {
                    parent.querySelector('.tld-subtitle').textContent = 'Special offer';
                }
            } else {
                priceElement.textContent = `R${monthlyPrice}`;
                const parent = priceElement.closest('.tld-box, .pricing-card');
                if (parent && parent.querySelector('.tld-subtitle')) {
                    parent.querySelector('.tld-subtitle').textContent = 'Monthly';
                }
            }
        }
    });
    
    periodElements.forEach(element => {
        if (element.classList.contains('period')) {
            element.textContent = period === 'yearly' ? '/year' : '/month';
        }
    });
}

// Setup domain suggestions
function setupDomainSuggestions() {
    const domainInput = document.getElementById('domainInput');
    const suggestionsBox = document.getElementById('domainSuggestions');
    
    if (!domainInput || !suggestionsBox) return;
    
    domainInput.addEventListener('input', function() {
        const query = this.value.trim().replace(/\..+$/, '');
        if (query.length < 2) {
            suggestionsBox.style.display = 'none';
            return;
        }
        
        const suggestions = [
            `${query}.com`,
            `${query}.co.za`,
            `${query}.net`,
            `${query}.org`,
            `${query}.africa`,
            `${query}.joburg`,
            `${query}.io`,
            `${query}.co`
        ];
        
        suggestionsBox.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');
        
        suggestionsBox.style.display = 'block';
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!domainInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

function selectSuggestion(domain) {
    const domainInput = document.getElementById('domainInput');
    const suggestionsBox = document.getElementById('domainSuggestions');
    
    if (domainInput) {
        domainInput.value = domain;
        domainInput.focus();
    }
    
    if (suggestionsBox) {
        suggestionsBox.style.display = 'none';
    }
    
    searchDomain();
}

// Filter by category
function filterByCategory(category) {
    const items = document.querySelectorAll('.tld-item, .tld-card');
    const buttons = document.querySelectorAll('.category-filter button');
    
    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent.toLowerCase().includes('all'))) {
            btn.classList.add('active');
        }
    });
    
    // Filter items
    items.forEach((item, index) => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.style.animationDelay = `${index * 0.05}s`;
        } else {
            item.style.display = 'none';
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Add to cart function
function addToCart(domain, price, type = 'registration') {
    let cart = JSON.parse(localStorage.getItem('domainCart') || '[]');
    cart.push({
        domain,
        price,
        type,
        addedAt: new Date().toISOString()
    });
    localStorage.setItem('domainCart', JSON.stringify(cart));
    
    showNotification(`${domain} added to cart!`, 'success');
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('domainCart') || '[]');
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}