// Word Thermometer Game Logic
console.log("Game logic loaded");

const wordDatabase = {
    easy: {
        food: ['PIZZA', 'BURGER', 'SUSHI', 'PASTA', 'TACOS', 'SALAD', 'STEAK', 'CURRY', 'BREAD', 'FRIES'],
        animals: ['TIGER', 'EAGLE', 'SHARK', 'PANDA', 'ZEBRA', 'KOALA', 'LEMUR', 'OTTER', 'BEAR', 'WOLF'],
        tech: ['PHONE', 'ROBOT', 'DRONE', 'LASER', 'CLOUD', 'WIFI', 'EMAIL', 'APPLE', 'MOUSE', 'CABLE'],
        movies: ['JAWS', 'FROZEN', 'MATRIX', 'ALIEN', 'ROCKY', 'GREASE', 'SHREK', 'TOY', 'JOKER', 'AVATAR'],
        music: ['PIANO', 'GUITAR', 'DRUMS', 'QUEEN', 'BEYONCE', 'TAYLOR', 'BEATLES', 'ELVIS', 'ADELE', 'BTS'],
        sports: ['SOCCER', 'TENNIS', 'GOLF', 'SWIM', 'SKATE', 'SURF', 'SKI', 'BOWL', 'RUGBY', 'BOXING']
    },
    medium: {
        food: ['SPAGHETTI', 'HAMBURGER', 'CHOCOLATE', 'SANDWICH', 'PANCAKES', 'OMELETTE', 'CHEESECAKE', 'CUPCAKES', 'DONUTS', 'COOKIES'],
        animals: ['ELEPHANT', 'KANGAROO', 'CROCODILE', 'ALLIGATOR', 'DOLPHIN', 'BUTTERFLY', 'SCORPION', 'HIPPOPOTAMUS', 'RHINOCEROS', 'PORCUPINE'],
        tech: ['COMPUTER', 'KEYBOARD', 'MONITOR', 'WEBCAM', 'ROUTER', 'PRINTER', 'TABLET', 'LAPTOP', 'SERVER', 'NETWORK'],
        movies: ['TITANIC', 'AVENGERS', 'TOYSTORY', 'GLADIATOR', 'INCEPTION', 'PARASITE', 'JURASSIC', 'FINDINGNEMO', 'LIONKING', 'FORRESTGUMP'],
        music: ['ORCHESTRA', 'SYMPHONY', 'CONCERT', 'FESTIVAL', 'PLAYLIST', 'HEADPHONES', 'SPEAKERS', 'MICROPHONE', 'AMPLIFIER', 'METALLICA'],
        sports: ['BASKETBALL', 'VOLLEYBALL', 'BASEBALL', 'FOOTBALL', 'HANDBALL', 'WRESTLING', 'FENCING', 'ARCHERY', 'JAVELIN', 'MARATHON']
    },
    hard: {
        food: ['GUACAMOLE', 'RATATOUILLE', 'ESCARGOT', 'PAELLA', 'SUSHIROLL', 'TIRAMISU', 'CROISSANT', 'PROSCIUTTO', 'QUICHE', 'BRUSCHETTA'],
        animals: ['CHAMELEON', 'PLATYPUS', 'ARMADILLO', 'ANTEATER', 'MEERKAT', 'WALRUS', 'MANATEE', 'NARWHAL', 'OKAPI', 'AXOLOTL'],
        tech: ['ALGORITHM', 'BLOCKCHAIN', 'CRYPTOCURRENCY', 'VIRTUALREALITY', 'AUGMENTEDREALITY', 'ARTIFICIALINTELLIGENCE', 'CYBERSECURITY', 'DATACENTER', 'QUANTUMCOMPUTING', 'NANOTECHNOLOGY'],
        movies: ['PSYCHOANALYSIS', 'CINEMATOGRAPHY', 'SCREENPLAY', 'PRODUCTION', 'DIRECTOR', 'STORYBOARD', 'SEQUEL', 'PREMISE', 'NARRATIVE', 'CHARACTERARC'],
        music: ['HARMONIZATION', 'MELODICSTRUCTURE', 'INSTRUMENTATION', 'COMPOSITION', 'ARRANGEMENT', 'ORCHESTRATION', 'SYNCOPATION', 'POLYRHYTHM', 'COUNTERPOINT', 'IMPROVISATION'],
        sports: ['GYMNASTICS', 'EQUESTRIAN', 'PENTATHLON', 'DECATHLON', 'TRIATHLON', 'BADMINTON', 'SNOWBOARDING', 'SKATEBOARDING', 'WEIGHTLIFTING', 'TAEKWONDO']
    }
};

let currentGame = {
    targetWord: '',
    guessedWords: [],
    triesLeft: 8,
    correct: false,
    hintPositionsUsed: []
};

let freeHintsAllowed = 0;

// Calculate word similarity
function calculateWordSimilarity(word1, word2) {
    word1 = word1.toUpperCase();
    word2 = word2.toUpperCase();
    let matches = 0;
    const minLength = Math.min(word1.length, word2.length);
    const maxLength = Math.max(word1.length, word2.length);
    
    for (let i = 0; i < minLength; i++) {
        if (word1[i] === word2[i]) matches++;
    }
    
    const lengthBonus = word1.length === word2.length ? 0.1 : 0;
    return (matches / maxLength) + lengthBonus;
}

// Show temperature animation
function showTemperatureAnimation(emoji, color) {
    const anim = document.createElement('div');
    anim.innerHTML = emoji;
    anim.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        font-size: 80px; z-index: 1000; animation: tempPulse 1s; pointer-events: none;
        text-shadow: 0 0 30px ${color}; opacity: 0;
    `;
    document.body.appendChild(anim);
    setTimeout(() => anim.remove(), 1000);
}

// Update recent guesses display
function updateRecentGuesses() {
    if (!currentGame.targetWord || currentGame.guessedWords.length === 0) {
        document.getElementById('guess-list').innerHTML = 'No guesses yet';
        return;
    }
    
    let html = '';
    const recentGuesses = currentGame.guessedWords.slice(-3).reverse();
    
    recentGuesses.forEach(guess => {
        const similarity = calculateWordSimilarity(guess, currentGame.targetWord);
        let tempLabel = '';
        let color = '';
        
        if (similarity === 1) {
            tempLabel = '🔥 BOILING';
            color = '#ff0000';
        } else if (similarity >= 0.8) {
            tempLabel = '🌶️ Very Hot';
            color = '#ff5500';
        } else if (similarity >= 0.6) {
            tempLabel = '☀️ Hot';
            color = '#ff8800';
        } else if (similarity >= 0.4) {
            tempLabel = '💨 Warm';
            color = '#ffaa00';
        } else if (similarity > 0.2) {
            tempLabel = '❄️ Cool';
            color = '#4fc3f7';
        } else {
            tempLabel = '🧊 Cold';
            color = '#00aaff';
        }
        
        html += `<div style="margin: 3px 0; color: ${color}">
            "${guess}" - ${tempLabel} (${Math.round(similarity * 100)}%)
        </div>`;
    });
    
    document.getElementById('guess-list').innerHTML = html;
}

// Update hint button
function updateHintButton() {
    const hintBtn = document.getElementById('hint-btn');
    const hintCost = document.getElementById('hint-cost');
    
    const freeHintsLeft = freeHintsAllowed - gameState.freeHintsUsed;
    const purchasedHintsLeft = gameState.purchased.hintPackHints;
    
    if (freeHintsLeft > 0) {
        hintBtn.disabled = gameState.coins < 20;
        hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> GET HINT (${freeHintsLeft} free left)`;
        hintCost.textContent = 'Costs 20 coins';
    } else if (purchasedHintsLeft > 0) {
        hintBtn.disabled = false;
        hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> GET HINT (${purchasedHintsLeft} paid left)`;
        hintCost.textContent = 'From hint pack';
    } else {
        hintBtn.disabled = true;
        hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> NO HINTS LEFT`;
        hintCost.textContent = 'Buy hint pack for more hints';
    }
}

// Update thermometer color based on heat
function updateThermometerColor() {
    const mercury = document.getElementById('mercury');
    const heat = gameState.heat;
    
    // Create gradient from blue (cold) to red (hot)
    let color;
    if (heat < 25) {
        color = `linear-gradient(to right, #0000ff, #00aaff, #4fc3f7)`;
    } else if (heat < 50) {
        color = `linear-gradient(to right, #00aaff, #4fc3f7, #00ffaa)`;
    } else if (heat < 75) {
        color = `linear-gradient(to right, #ffff00, #ffaa00, #ff8800)`;
    } else {
        color = `linear-gradient(to right, #ff5500, #ff0000, #ff0000)`;
    }
    
    mercury.style.background = color;
    
    // Gold theme if purchased
    if (gameState.purchased.gold) {
        mercury.classList.add('gold-mercury');
    } else {
        mercury.classList.remove('gold-mercury');
    }
}

// Start new game
function startNewGame() {
    if (!gameState.selectedCategory || !gameState.selectedDifficulty) {
        showFeedback('Select difficulty & category first!', true);
        return;
    }
    
    const words = wordDatabase[gameState.selectedDifficulty][gameState.selectedCategory];
    const targetWord = words[Math.floor(Math.random() * words.length)];
    
    // Set free hints based on difficulty
    freeHintsAllowed = gameState.selectedDifficulty === 'easy' ? 1 : 
                      gameState.selectedDifficulty === 'medium' ? 2 : 3;
    
    // Reset current game
    currentGame = {
        targetWord: targetWord,
        guessedWords: [],
        triesLeft: 8,
        correct: false,
        hintPositionsUsed: []
    };
    
    // Reset free hints used for this game
    gameState.freeHintsUsed = 0;
    
    document.getElementById('letters').textContent = targetWord.length;
    document.getElementById('tries-left').textContent = currentGame.triesLeft;
    document.getElementById('hint-display').style.display = 'none';
    document.getElementById('guess-list').innerHTML = 'No guesses yet';
    
    showFeedback(`New ${targetWord.length}-letter word! You get ${freeHintsAllowed} free hint(s)`);
    document.getElementById('guess-input').focus();
    
    updateHintButton();
    saveGameData();
}

// Submit guess
function submitGuess() {
    if (!currentGame.targetWord) {
        startNewGame();
        return;
    }
    
    const input = document.getElementById('guess-input');
    const guess = input.value.trim();
    
    if (!guess) {
        showFeedback('Please type a word!', true);
        return;
    }
    
    const guessUpper = guess.toUpperCase();
    
    // Check if already guessed in THIS GAME
    if (currentGame.guessedWords.some(g => g.toUpperCase() === guessUpper)) {
        showFeedback('You already tried that word in this game!', true);
        input.value = '';
        return;
    }
    
    currentGame.guessedWords.push(guess);
    currentGame.triesLeft--;
    
    // Calculate similarity
    const similarity = calculateWordSimilarity(guess, currentGame.targetWord);
    
    // Calculate heat change - FIXED: Heat goes down for cold guesses
    let heatChange = 0;
    let tempEmoji = '🧊';
    let isHot = true;
    
    if (similarity === 1) {
        tempEmoji = '🔥';
        heatChange = 30;
    } else if (similarity >= 0.8) {
        tempEmoji = '🌶️';
        heatChange = 25;
    } else if (similarity >= 0.6) {
        tempEmoji = '☀️';
        heatChange = 20;
    } else if (similarity >= 0.4) {
        tempEmoji = '💨';
        heatChange = 15;
    } else if (similarity > 0.2) {
        tempEmoji = '❄️';
        heatChange = -10; // COLD - heat goes DOWN
        isHot = false;
    } else {
        tempEmoji = '🧊';
        heatChange = -15; // VERY COLD - heat goes DOWN more
        isHot = false;
    }
    
    // Check if guess is correct
    if (guessUpper === currentGame.targetWord) {
        // WINNER!
        gameState.heat = Math.min(gameState.heat + heatChange, 100);
        gameState.wins++;
        gameState.coins += 25;
        
        showTemperatureAnimation(tempEmoji, '#ff0000');
        showFeedback(`🎉 CORRECT! "${guess}" is right! ${tempEmoji} +${heatChange}° Heat! +25 coins!`);
        
        currentGame.correct = true;
        
        // Update thermometer color
        updateThermometerColor();
        
        // Start new game after 2 seconds
        setTimeout(() => {
            showFeedback('Starting new word...');
            setTimeout(startNewGame, 1000);
        }, 2000);
    } else {
        // Wrong guess - heat can go up OR down based on temperature
        const newHeat = gameState.heat + heatChange;
        gameState.heat = Math.max(0, Math.min(newHeat, 100)); // Keep between 0-100
        
        const color = isHot ? '#ff5500' : '#00aaff';
        showTemperatureAnimation(tempEmoji, color);
        showFeedback(`"${guess}" - ${Math.round(similarity * 100)}% similar. ${tempEmoji} ${heatChange > 0 ? '+' : ''}${heatChange}° Heat`);
        
        // Update thermometer color
        updateThermometerColor();
        
        // Check game over
        if (currentGame.triesLeft <= 0) {
            showFeedback(`Ran out of tries! The word remains a mystery...`, true);
            gameState.heat = Math.max(gameState.heat - 10, 0);
            updateThermometerColor();
            setTimeout(() => startNewGame(), 3000);
        }
    }
    
    document.getElementById('tries-left').textContent = currentGame.triesLeft;
    input.value = '';
    input.focus();
    updateDisplay();
    updateRecentGuesses();
    saveGameData();
}

// Use hint
function useHint() {
    if (!currentGame.targetWord) {
        showFeedback('Start guessing first!', true);
        return;
    }
    
    const freeHintsLeft = freeHintsAllowed - gameState.freeHintsUsed;
    const purchasedHintsLeft = gameState.purchased.hintPackHints;
    
    if (freeHintsLeft <= 0 && purchasedHintsLeft <= 0) {
        showFeedback('No hints available!', true);
        return;
    }
    
    let usingFreeHint = freeHintsLeft > 0;
    
    if (usingFreeHint) {
        if (gameState.coins < 20) {
            showFeedback('Need 20 coins for hint!', true);
            return;
        }
        gameState.coins -= 20;
        gameState.freeHintsUsed++;
    } else {
        gameState.purchased.hintPackHints--;
    }
    
    // Find a hint position that hasn't been used
    const target = currentGame.targetWord;
    const availablePositions = [];
    
    for (let i = 0; i < target.length; i++) {
        if (!currentGame.hintPositionsUsed.includes(i)) {
            availablePositions.push(i);
        }
    }
    
    if (availablePositions.length === 0) {
        showFeedback('No more hint positions available for this word!', false);
        if (usingFreeHint) {
            gameState.coins += 20;
            gameState.freeHintsUsed--;
        } else {
            gameState.purchased.hintPackHints++;
        }
        return;
    }
    
    const hintPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    currentGame.hintPositionsUsed.push(hintPosition);
    
    const hintDisplay = document.getElementById('hint-display');
    hintDisplay.textContent = `💡 Position ${hintPosition + 1} is "${target[hintPosition]}"`;
    hintDisplay.style.display = 'block';
    
    const hintType = usingFreeHint ? 'Free hint used' : 'Paid hint used';
    const costMessage = usingFreeHint ? '-20 coins' : '';
    showFeedback(`${hintType}! ${costMessage}`);
    
    updateHintButton();
    updateDisplay();
    saveGameData();
}

// Make functions available globally
window.startNewGame = startNewGame;
window.submitGuess = submitGuess;
window.useHint = useHint;
window.updateHintButton = updateHintButton;
window.updateRecentGuesses = updateRecentGuesses;
window.updateDisplay = updateDisplay;
window.showFeedback = showFeedback;
window.saveGameData = saveGameData;
window.updateThermometerColor = updateThermometerColor;

// Start first game automatically
setTimeout(() => {
    if (!currentGame.targetWord && gameState.selectedCategory && gameState.selectedDifficulty) {
        startNewGame();
    }
}, 500);

console.log("Game logic fully loaded and ready");
