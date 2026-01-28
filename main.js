// Word Thermometer - Main Game File
console.log("Word Thermometer Loading...");

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("Game initializing...");
    
    // Setup difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameState.selectedDifficulty = this.dataset.difficulty;
            showFeedback(`Difficulty: ${this.textContent}`);
            saveGameData();
            
            // Reset heat and start new game
            gameState.heat = 0;
            updateDisplay();
            
            setTimeout(() => {
                if (window.startNewGame) {
                    window.startNewGame();
                    document.getElementById('guess-input').focus();
                }
            }, 300);
        });
    });
    
    // Setup category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameState.selectedCategory = this.dataset.category;
            showFeedback(`Category: ${this.textContent}`);
            saveGameData();
            
            // Reset heat and start new game
            gameState.heat = 0;
            updateDisplay();
            
            setTimeout(() => {
                if (window.startNewGame) {
                    window.startNewGame();
                    document.getElementById('guess-input').focus();
                }
            }, 300);
        });
    });
    
    // Setup guess input
    document.getElementById('submit-guess').addEventListener('click', submitGuess);
    document.getElementById('guess-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') submitGuess();
    });
    
    // Setup hint button
    document.getElementById('hint-btn').addEventListener('click', useHint);
    
    // Initialize store
    if (window.initializeStore) {
        setTimeout(() => {
            window.initializeStore();
        }, 1000);
    }
    
    // Start first game
    setTimeout(() => {
        if (window.startNewGame) {
            window.startNewGame();
            document.getElementById('guess-input').focus();
        }
    }, 1000);
    
    console.log("Game ready!");
});