[file name]: ads.js
[file content begin]
// Ad Management System
let adsLoaded = false;
let adReady = false;
let adWatched = false;

function loadAds() {
    if (gameState.purchased.adfree) {
        hideAds();
        return;
    }
    
    console.log("Loading ads...");
    
    // Ad placeholders
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    
    adPlaceholders.forEach((placeholder, index) => {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 15px; width: 100%;">
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                    <i class="fas fa-ad" style="color: #4fc3f7; font-size: 32px; margin-bottom: 10px;"></i>
                    <p style="margin: 10px 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        Advertisement
                    </p>
                    <small style="color: rgba(255,255,255,0.6); display: block; margin-top: 5px;">
                        Support the game by watching ads
                    </small>
                </div>
                <button onclick="watchAdForCoins()" id="watch-ad-btn" style="
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #4fc3f7, #2196f3);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s;
                ">
                    <i class="fas fa-coins"></i> Watch Ad for 10 Coins
                </button>
                <p id="ad-status" style="font-size:12px; color:rgba(255,255,255,0.6); margin-top:8px;">
                    Ad will play before you get coins
                </p>
            </div>
        `;
    });
    
    adsLoaded = true;
    
    // Simulate ad loading delay
    setTimeout(() => {
        adReady = true;
        console.log("Ad ready to play");
    }, 2000);
}

function hideAds() {
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    
    adPlaceholders.forEach(placeholder => {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 20px; width: 100%;">
                <i class="fas fa-heart" style="color: #81c784; font-size: 48px; margin-bottom: 15px;"></i>
                <p style="margin-top: 10px; color: #81c784; font-weight: bold; font-size: 18px;">
                    Thank you for your support!
                </p>
                <small style="color: rgba(255,255,255,0.7); font-size: 14px;">
                    Ads removed - Enjoy ad-free gameplay!
                </small>
            </div>
        `;
    });
}

// Simulate watching an ad for coins
function watchAdForCoins() {
    if (gameState.purchased.adfree) {
        showFeedback('You have ad-free version! No ads needed.', false);
        return;
    }
    
    if (!adReady) {
        showFeedback('Ad is still loading...', true);
        return;
    }
    
    if (adWatched) {
        showFeedback('You already watched an ad recently. Try again later.', true);
        return;
    }
    
    const adBtn = document.getElementById('watch-ad-btn');
    const adStatus = document.getElementById('ad-status');
    
    // Disable button while ad plays
    adBtn.disabled = true;
    adBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ad Playing...';
    adStatus.textContent = 'Ad is playing...';
    adStatus.style.color = '#ffd166';
    
    showFeedback('Ad playing now...');
    
    // Simulate ad playing for 3 seconds
    setTimeout(() => {
        // Simulate ad completion
        adWatched = true;
        
        // Award coins only AFTER ad completes
        gameState.coins += 10;
        updateDisplay();
        saveGameData();
        
        // Update button and status
        adBtn.innerHTML = '<i class="fas fa-check"></i> +10 Coins Awarded!';
        adBtn.style.background = 'linear-gradient(135deg, #81c784, #4caf50)';
        adStatus.textContent = 'Coins added to your account!';
        adStatus.style.color = '#81c784';
        
        showFeedback('+10 coins! Thank you for watching!');
        
        // Small chance for bonus
        if (Math.random() < 0.2) { // 20% chance
            setTimeout(() => {
                gameState.coins += 5;
                updateDisplay();
                showFeedback('Bonus! +5 extra coins!');
                adStatus.textContent = 'Bonus! Total +15 coins!';
            }, 500);
        }
        
        // Reset after 30 seconds
        setTimeout(() => {
            adWatched = false;
            adBtn.disabled = false;
            adBtn.innerHTML = '<i class="fas fa-coins"></i> Watch Ad for 10 Coins';
            adBtn.style.background = 'linear-gradient(135deg, #4fc3f7, #2196f3)';
            adStatus.textContent = 'Ad ready to watch again';
            adStatus.style.color = 'rgba(255,255,255,0.6)';
        }, 30000);
        
    }, 3000); // 3 second ad simulation
}

// Initialize ad system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for gameState to be initialized
    setTimeout(() => {
        if (!gameState.purchased.adfree) {
            loadAds();
        }
    }, 1000);
});
[file content end]
