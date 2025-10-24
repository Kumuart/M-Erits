// Demo data for quick filling
const demoData = {
    residential: {
        tax_period_from: "2024-01-01",
        tax_period_to: "2024-12-31",
        gross_amount: "75000",
        tax_rate: "10",
        landlord_pin: "P123456789L",
        invoice_no: "INV-2024-RES-001",
        invoice_date: "2024-01-15",
        payment_date: "2024-01-20"
    },
    commercial: {
        tax_period_from: "2024-01-01",
        tax_period_to: "2024-03-31",
        gross_amount: "150000",
        tax_rate: "12",
        landlord_pin: "P987654321L",
        invoice_no: "INV-2024-COM-001",
        invoice_date: "2024-01-10",
        payment_date: "2024-01-25"
    },
    apartment: {
        tax_period_from: "2024-04-01",
        tax_period_to: "2024-06-30",
        gross_amount: "50000",
        tax_rate: "10",
        landlord_pin: "P456789123L",
        invoice_no: "INV-2024-APT-001",
        invoice_date: "2024-04-05",
        payment_date: "2024-04-12"
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendarIcons();
    initializeDemoButtons();
});

// Add calendar icons to date inputs
function initializeCalendarIcons() {
    const dateInputs = document.querySelectorAll('input[type="text"][placeholder*="YYYY-MM-DD"]');
    
    dateInputs.forEach(input => {
        const container = document.createElement('div');
        container.className = 'date-input-container';
        
        // Wrap the input
        input.parentNode.insertBefore(container, input);
        container.appendChild(input);
        
        // Add calendar icon
        const calendarIcon = document.createElement('button');
        calendarIcon.type = 'button';
        calendarIcon.className = 'calendar-icon';
        calendarIcon.innerHTML = '📅';
        calendarIcon.title = 'Pick a date';
        container.appendChild(calendarIcon);
        
        // Add date picker functionality
        calendarIcon.addEventListener('click', function() {
            showDatePicker(input);
        });
        
        // Add today's date on double click
        input.addEventListener('dblclick', function() {
            const today = new Date().toISOString().split('T')[0];
            input.value = today;
        });
    });
}

// Simple date picker
function showDatePicker(input) {
    const dates = {
        'Today': new Date().toISOString().split('T')[0],
        'Start of Year': '2024-01-01',
        'End of Year': '2024-12-31',
        'Start of Quarter': '2024-04-01',
        'End of Quarter': '2024-06-30'
    };
    
    const selected = prompt(`Quick dates:\n${Object.entries(dates).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nOr enter date (YYYY-MM-DD):`);
    
    if (selected) {
        if (dates[selected]) {
            input.value = dates[selected];
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(selected)) {
            input.value = selected;
        } else {
            alert('Please enter date in YYYY-MM-DD format');
        }
    }
}

// Initialize demo buttons
function initializeDemoButtons() {
    const form = document.querySelector('form');
    if (!form) return;
    
    // Create demo section
    const demoSection = document.createElement('div');
    demoSection.className = 'quick-fill-section';
    demoSection.innerHTML = `
        <div class="quick-fill-title">💡 Quick Demo Data</div>
        <div class="demo-buttons">
            <button type="button" class="demo-btn" data-type="residential">Residential Rental</button>
            <button type="button" class="demo-btn" data-type="commercial">Commercial Property</button>
            <button type="button" class="demo-btn" data-type="apartment">Apartment Complex</button>
        </div>
        <div style="text-align: center; font-size: 12px; color: #666; margin-top: 5px;">
            Click any button to auto-fill form with demo data
        </div>
    `;
    
    form.parentNode.insertBefore(demoSection, form);
    
    // Add event listeners to demo buttons
    document.querySelectorAll('.demo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const dataType = this.getAttribute('data-type');
            fillFormWithDemoData(dataType);
        });
    });
}

// Fill form with demo data
function fillFormWithDemoData(type) {
    const data = demoData[type];
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
            // Trigger input event for any validation
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    
    // Show confirmation
    showNotification(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} demo data loaded!`, 'success');
}

// SDK Push functionality
function requestSDKPush(method) {
    const prnNumber = document.querySelector('.modal p strong')?.nextSibling?.textContent?.trim();
    const amount = document.querySelector('.modal p:nth-child(3)')?.textContent?.replace('Amount: KSh', '').trim();
    
    if (!prnNumber) {
        showNotification('❌ No PRN found. Please generate PRN first.', 'error');
        return;
    }
    
    const statusDiv = document.getElementById('sdk-status');
    statusDiv.innerHTML = `<p class="success">🔄 Requesting ${method.toUpperCase()} push for PRN: ${prnNumber}...</p>`;
    
    // Simulate API call delay
    setTimeout(() => {
        const paymentSection = document.createElement('div');
        paymentSection.className = 'sdk-payment-section';
        paymentSection.innerHTML = `
            <h4>📱 Payment Instructions</h4>
            <div class="payment-instructions">
                <p><strong>Paybill Number:</strong> 222222</p>
                <p><strong>Account Number:</strong> ${prnNumber}</p>
                <p><strong>Amount:</strong> KSh ${amount}</p>
            </div>
            
            <div class="payment-steps">
                <div class="payment-step">
                    <div class="step-number">1</div>
                    <div>Go to M-Pesa on your phone</div>
                </div>
                <div class="payment-step">
                    <div class="step-number">2</div>
                    <div>Select "Lipa na M-Pesa"</div>
                </div>
                <div class="payment-step">
                    <div class="step-number">3</div>
                    <div>Enter Paybill: <strong>222222</strong></div>
                </div>
                <div class="payment-step">
                    <div class="step-number">4</div>
                    <div>Enter Account: <strong>${prnNumber}</strong></div>
                </div>
                <div class="payment-step">
                    <div class="step-number">5</div>
                    <div>Enter Amount: <strong>KSh ${amount}</strong></div>
                </div>
                <div class="payment-step">
                    <div class="step-number">6</div>
                    <div>Enter your M-Pesa PIN</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="simulatePayment('${prnNumber}')" style="
                    background: linear-gradient(135deg, #00a854, #007a3d);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    ✅ Simulate Payment
                </button>
            </div>
        `;
        
        statusDiv.innerHTML = '';
        statusDiv.appendChild(paymentSection);
        
        // Show success message
        showNotification(`✅ SDK push sent via ${method.toUpperCase()}! Check your ${method} for payment instructions.`, 'success');
    }, 2000);
}

// Simulate payment completion
function simulatePayment(prnNumber) {
    showNotification(`✅ Payment for PRN ${prnNumber} completed successfully!`, 'success');
    
    // Update the status
    const statusDiv = document.getElementById('sdk-status');
    statusDiv.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
            <h4 style="color: #00a854;">Payment Successful!</h4>
            <p>PRN: <strong>${prnNumber}</strong></p>
            <p>Status: <strong style="color: #00a854;">PAID</strong></p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
                Transaction completed at ${new Date().toLocaleTimeString()}
            </p>
        </div>
    `;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.getElementById('global-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'global-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#00a854' : type === 'error' ? '#d71a1a' : '#333'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}