// Simple Monetization Tracking

class Monetization {
    constructor() {
        this.gameCount = 0;
    }
    
    // Track game plays
    trackGamePlay() {
        this.gameCount++;
        console.log(`Game plays: ${this.gameCount}`);
    }
}

// Initialize monetization
document.addEventListener('DOMContentLoaded', function() {
    window.monetization = new Monetization();
});

// Watch rewarded ad for coins
function watchRewardedAd() {
    if (gameState.purchased.adfree) {
        showFeedback("You have ad-free version! No ads needed.", false);
        return;
    }
    
    showFeedback("Loading ad...");
    
    setTimeout(() => {
        // Simulate successful ad view
        gameState.coins += 25;
        updateDisplay();
        saveGameData();
        
        showFeedback('+25 coins! Thank you for watching!');
        
        // Small chance for bonus
        if (Math.random() < 0.3) { // 30% chance
            gameState.coins += 10;
            updateDisplay();
            showFeedback('Bonus! +10 extra coins!');
        }
    }, 1500);
}