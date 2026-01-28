// Purchase Management with Firebase Tracking
function initializeStore() {
    updateStoreBadges();
    
    if (window.paypal) {
        setTimeout(initPayPalButtons, 1000);
    } else {
        const checkPayPal = setInterval(() => {
            if (window.paypal) {
                clearInterval(checkPayPal);
                initPayPalButtons();
            }
        }, 500);
        
        setTimeout(() => {
            clearInterval(checkPayPal);
            if (!window.paypal) {
                console.log("PayPal not loaded, showing fallback");
                showPayPalFallback();
            }
        }, 10000);
    }
}

function updateStoreBadges() {
    if (gameState.purchased.gold) {
        document.getElementById('gold-badge').style.display = 'block';
        document.getElementById('gold-paypal').style.display = 'none';
    } else {
        document.getElementById('gold-badge').style.display = 'none';
        document.getElementById('gold-paypal').style.display = 'flex';
    }
    
    if (gameState.purchased.adfree) {
        document.getElementById('adfree-badge').style.display = 'block';
        document.getElementById('adfree-paypal').style.display = 'none';
    } else {
        document.getElementById('adfree-badge').style.display = 'none';
        document.getElementById('adfree-paypal').style.display = 'flex';
    }
    
    if (gameState.purchased.extraHints > 0) {
        document.getElementById('hints-badge').style.display = 'block';
        document.getElementById('hints-paypal').style.display = 'none';
    } else {
        document.getElementById('hints-badge').style.display = 'none';
        document.getElementById('hints-paypal').style.display = 'flex';
    }
}

function initPayPalButtons() {
    console.log("Initializing PayPal buttons...");
    
    try {
        // Gold Thermometer - $1.99
        paypal.HostedButtons({
            hostedButtonId: "H9WB3TEW5VQFG",
            onInit: function(data, actions) {
                console.log("Gold Thermometer button ready");
            },
            onClick: function() {
                console.log("Gold Thermometer purchase started");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_started', { type: 'gold', amount: 1.99 });
                }
            },
            onApprove: function(data, actions) {
                console.log("Gold Thermometer purchase approved");
                return actions.order.capture().then(function(details) {
                    console.log("Purchase completed:", details);
                    
                    // Process purchase
                    gameState.purchased.gold = true;
                    gameState.coins += 50;
                    
                    // Update UI
                    updateStoreBadges();
                    updateDisplay();
                    
                    // Track in Firebase
                    if (window.trackPurchase) {
                        window.trackPurchase('gold', 1.99, details.id || '');
                    }
                    
                    // Track game event
                    if (window.trackGameEvent) {
                        window.trackGameEvent('purchase_completed', { 
                            type: 'gold', 
                            amount: 1.99,
                            transactionId: details.id || ''
                        });
                    }
                    
                    // Show success
                    showPurchaseSuccess('Gold Thermometer purchased! +50 coins!');
                    
                    // Save game
                    saveGameData();
                });
            },
            onCancel: function(data) {
                console.log("Purchase cancelled");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_cancelled', { type: 'gold' });
                }
            },
            onError: function(err) {
                console.error("PayPal error:", err);
                showFeedback('Payment failed. Please try again.', true);
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_error', { type: 'gold', error: err.message });
                }
            }
        }).render("#gold-paypal");
        
        // Hint Pack - $0.99
        paypal.HostedButtons({
            hostedButtonId: "7S553NMVCR4H4",
            onInit: function(data, actions) {
                console.log("Hint Pack button ready");
            },
            onClick: function() {
                console.log("Hint Pack purchase started");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_started', { type: 'hints', amount: 0.99 });
                }
            },
            onApprove: function(data, actions) {
                console.log("Hint Pack purchase approved");
                return actions.order.capture().then(function(details) {
                    console.log("Purchase completed:", details);
                    
                    // Process purchase
                    gameState.purchased.extraHints = (gameState.purchased.extraHints || 0) + 3;
                    gameState.coins += 100;
                    gameState.hints = 3 + gameState.purchased.extraHints;
                    
                    // Update UI
                    updateStoreBadges();
                    updateDisplay();
                    
                    // Track in Firebase
                    if (window.trackPurchase) {
                        window.trackPurchase('hints', 0.99, details.id || '');
                    }
                    
                    // Track game event
                    if (window.trackGameEvent) {
                        window.trackGameEvent('purchase_completed', { 
                            type: 'hints', 
                            amount: 0.99,
                            transactionId: details.id || ''
                        });
                    }
                    
                    // Show success
                    showPurchaseSuccess('Hint pack purchased! +3 extra hints & +100 coins!');
                    
                    // Save game
                    saveGameData();
                });
            },
            onCancel: function(data) {
                console.log("Purchase cancelled");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_cancelled', { type: 'hints' });
                }
            },
            onError: function(err) {
                console.error("PayPal error:", err);
                showFeedback('Payment failed. Please try again.', true);
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_error', { type: 'hints', error: err.message });
                }
            }
        }).render("#hints-paypal");
        
        // Remove Ads - $4.99
        paypal.HostedButtons({
            hostedButtonId: "3ZTECSYKCCYN8",
            onInit: function(data, actions) {
                console.log("Remove Ads button ready");
            },
            onClick: function() {
                console.log("Remove Ads purchase started");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_started', { type: 'adfree', amount: 4.99 });
                }
            },
            onApprove: function(data, actions) {
                console.log("Remove Ads purchase approved");
                return actions.order.capture().then(function(details) {
                    console.log("Purchase completed:", details);
                    
                    // Process purchase
                    gameState.purchased.adfree = true;
                    
                    // Update UI
                    updateStoreBadges();
                    hideAds();
                    
                    // Track in Firebase
                    if (window.trackPurchase) {
                        window.trackPurchase('adfree', 4.99, details.id || '');
                    }
                    
                    // Track game event
                    if (window.trackGameEvent) {
                        window.trackGameEvent('purchase_completed', { 
                            type: 'adfree', 
                            amount: 4.99,
                            transactionId: details.id || ''
                        });
                    }
                    
                    // Show success
                    showPurchaseSuccess('Ads removed! Thank you for your support!');
                    
                    // Save game
                    saveGameData();
                });
            },
            onCancel: function(data) {
                console.log("Purchase cancelled");
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_cancelled', { type: 'adfree' });
                }
            },
            onError: function(err) {
                console.error("PayPal error:", err);
                showFeedback('Payment failed. Please try again.', true);
                if (window.trackGameEvent) {
                    window.trackGameEvent('purchase_error', { type: 'adfree', error: err.message });
                }
            }
        }).render("#adfree-paypal");
        
        console.log("PayPal buttons initialized successfully");
        
    } catch (error) {
        console.error("Error initializing PayPal:", error);
        showPayPalFallback();
    }
}

function showPayPalFallback() {
    const containers = [
        { id: 'gold-paypal', url: 'https://paypal.me/loxiongamer?item_name=Gold+Thermometer&amount=1.99' },
        { id: 'hints-paypal', url: 'https://paypal.me/loxiongamer?item_name=Hint+Pack&amount=0.99' },
        { id: 'adfree-paypal', url: 'https://paypal.me/loxiongamer?item_name=Remove+Ads&amount=4.99' }
    ];
    
    containers.forEach(item => {
        const container = document.getElementById(item.id);
        if (container) {
            container.innerHTML = `
                <a href="${item.url}" target="_blank" 
                   style="display:inline-block; padding:10px 20px; background:#0070ba; 
                          color:white; text-decoration:none; border-radius:5px; font-size:14px;">
                    <i class="fab fa-paypal"></i> Pay via PayPal
                </a>
            `;
        }
    });
}

function showPurchaseSuccess(message) {
    const modal = document.getElementById('purchase-modal');
    const messageEl = document.getElementById('purchase-message');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.style.display = 'flex';
    } else {
        alert(message);
    }
}

// Initialize store when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeStore, 2000);
});