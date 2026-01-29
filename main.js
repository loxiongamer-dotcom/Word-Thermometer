// Word Thermometer - Main Game File
console.log("Word Thermometer Main Script Loading...");

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, setting up game...");
    
    // Setup difficulty buttons
    setTimeout(function() {
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        if (difficultyBtns.length > 0) {
            console.log("Found " + difficultyBtns.length + " difficulty buttons");
            
            difficultyBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    console.log("Difficulty clicked: " + this.dataset.difficulty);
                    
                    // Remove active class from all buttons
                    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Update game state
                    if (window.gameState) {
                        gameState.selectedDifficulty = this.dataset.difficulty;
                        gameState.heat = 0; // Reset heat when changing difficulty
                        
                        // Update display
                        if (typeof updateDisplay === 'function') {
                            updateDisplay();
                        }
                        
                        // Start new game
                        if (typeof startNewGame === 'function') {
                            setTimeout(startNewGame, 300);
                        }
                        
                        // Save game
                        if (typeof saveGameData === 'function') {
                            saveGameData();
                        }
                        
                        // Show feedback
                        if (typeof showFeedback === 'function') {
                            showFeedback(`Difficulty: ${this.textContent}`);
                        }
                    }
                });
            });
        } else {
            console.error("No difficulty buttons found!");
        }
    }, 500);
    
    // Setup category buttons
    setTimeout(function() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        if (categoryBtns.length > 0) {
            console.log("Found " + categoryBtns.length + " category buttons");
            
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    console.log("Category clicked: " + this.dataset.category);
                    
                    // Remove active class from all buttons
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Update game state
                    if (window.gameState) {
                        gameState.selectedCategory = this.dataset.category;
                        gameState.heat = 0; // Reset heat when changing category
                        
                        // Update display
                        if (typeof updateDisplay === 'function') {
                            updateDisplay();
                        }
                        
                        // Start new game
                        if (typeof startNewGame === 'function') {
                            setTimeout(startNewGame, 300);
                        }
                        
                        // Save game
                        if (typeof saveGameData === 'function') {
                            saveGameData();
                        }
                        
                        // Show feedback
                        if (typeof showFeedback === 'function') {
                            showFeedback(`Category: ${this.textContent}`);
                        }
                    }
                });
            });
        } else {
            console.error("No category buttons found!");
        }
    }, 500);
    
    // Setup guess button
    setTimeout(function() {
        const submitBtn = document.getElementById('submit-guess');
        if (submitBtn) {
            console.log("Found submit button");
            submitBtn.addEventListener('click', function() {
                console.log("Submit guess clicked");
                if (typeof submitGuess === 'function') {
                    submitGuess();
                } else {
                    console.error("submitGuess function not found!");
                }
            });
        } else {
            console.error("Submit button not found!");
        }
    }, 500);
    
    // Setup guess input (Enter key)
    setTimeout(function() {
        const guessInput = document.getElementById('guess-input');
        if (guessInput) {
            console.log("Found guess input");
            guessInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    console.log("Enter key pressed in input");
                    if (typeof submitGuess === 'function') {
                        submitGuess();
                    }
                }
            });
        }
    }, 500);
    
    // Setup hint button
    setTimeout(function() {
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            console.log("Found hint button");
            hintBtn.addEventListener('click', function() {
                console.log("Hint button clicked");
                if (typeof useHint === 'function') {
                    useHint();
                } else {
                    console.error("useHint function not found!");
                }
            });
        }
    }, 500);
    
    // Initialize store
    setTimeout(function() {
        console.log("Initializing store...");
        if (typeof initializeStore === 'function') {
            initializeStore();
        }
    }, 2000);
    
    // Auto-start first game
    setTimeout(function() {
        console.log("Attempting to auto-start game...");
        
        // Make sure game state exists
        if (!window.gameState) {
            console.error("gameState not found!");
            return;
        }
        
        // Start game if functions exist
        if (typeof startNewGame === 'function') {
            console.log("Starting new game...");
            startNewGame();
            
            // Focus input
            const guessInput = document.getElementById('guess-input');
            if (guessInput) {
                guessInput.focus();
            }
        } else {
            console.error("startNewGame function not found!");
        }
    }, 1000);
    
    console.log("Game setup complete!");
});// Word Thermometer - Main Game File
