// Word Thermometer - Firebase Database Integration
console.log("Word Thermometer Firebase Integration Loading...");

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcZ3bV9tQfL9T4H6s7qJ2KpLmN1oP2QrSt",
    authDomain: "word-thermometer.firebaseapp.com",
    databaseURL: "https://word-thermometer-default-rtdb.firebaseio.com",
    projectId: "word-thermometer",
    storageBucket: "word-thermometer.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
let firebaseApp;
let database;
let auth;
let userId = null;
let isFirebaseConnected = false;

// Check if Firebase is available
if (typeof firebase !== 'undefined' && firebase.app) {
    try {
        // Initialize Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        auth = firebase.auth();
        
        // Try anonymous authentication
        auth.signInAnonymously()
            .then(() => {
                console.log("Firebase: Anonymous authentication successful");
                isFirebaseConnected = true;
                auth.onAuthStateChanged((user) => {
                    if (user) {
                        userId = user.uid;
                        console.log("Firebase: User ID set to", userId);
                        // Load game data from Firebase
                        loadGameDataFromFirebase();
                    }
                });
            })
            .catch((error) => {
                console.error("Firebase: Authentication failed", error);
                fallbackToLocalStorage();
            });
    } catch (error) {
        console.error("Firebase: Initialization failed", error);
        fallbackToLocalStorage();
    }
} else {
    console.log("Firebase: Not available, using local storage");
    fallbackToLocalStorage();
}

// Fallback to local storage
function fallbackToLocalStorage() {
    console.log("Using local storage fallback");
    isFirebaseConnected = false;
    
    // Load from local storage
    loadGameDataFromLocalStorage();
    
    // Save to local storage periodically
    setInterval(saveGameDataToLocalStorage, 30000);
}

// Save game to Firebase
async function saveGameDataToFirebase() {
    if (!isFirebaseConnected || !userId || !window.gameState) return;
    
    try {
        const gameData = {
            coins: gameState.coins,
            wins: gameState.wins,
            heat: gameState.heat,
            purchased: gameState.purchased,
            hints: gameState.hints,
            selectedCategory: gameState.selectedCategory,
            lastUpdated: Date.now()
        };
        
        await database.ref(`users/${userId}/gameData`).set(gameData);
        console.log("Firebase: Game saved successfully");
    } catch (error) {
        console.error("Firebase: Save error", error);
        // Fallback to local storage
        saveGameDataToLocalStorage();
    }
}

// Load game from Firebase
async function loadGameDataFromFirebase() {
    if (!isFirebaseConnected || !userId) {
        loadGameDataFromLocalStorage();
        return;
    }
    
    try {
        const snapshot = await database.ref(`users/${userId}/gameData`).once('value');
        const firebaseData = snapshot.val();
        
        if (firebaseData && window.gameState) {
            // Merge Firebase data with current game state
            Object.assign(gameState, firebaseData);
            console.log("Firebase: Game loaded successfully");
            
            // Update display
            if (window.updateDisplay) {
                window.updateDisplay();
            }
        } else {
            // No data in Firebase, check local storage
            loadGameDataFromLocalStorage();
        }
    } catch (error) {
        console.error("Firebase: Load error", error);
        loadGameDataFromLocalStorage();
    }
}

// Save game to local storage
function saveGameDataToLocalStorage() {
    if (!window.gameState) return;
    
    try {
        localStorage.setItem('wordThermometerSave', JSON.stringify(gameState));
        console.log("Local Storage: Game saved");
    } catch (error) {
        console.error("Local Storage: Save error", error);
    }
}

// Load game from local storage
function loadGameDataFromLocalStorage() {
    if (!window.gameState) return;
    
    try {
        const saved = localStorage.getItem('wordThermometerSave');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(gameState, data);
            console.log("Local Storage: Game loaded");
            
            // Update display
            if (window.updateDisplay) {
                window.updateDisplay();
            }
        }
    } catch (error) {
        console.error("Local Storage: Load error", error);
    }
}

// Track purchase in Firebase
async function trackPurchaseInFirebase(type, amount, transactionId = '') {
    if (!isFirebaseConnected || !userId) return;
    
    try {
        const purchaseData = {
            type: type,
            amount: amount,
            transactionId: transactionId,
            timestamp: Date.now(),
            userId: userId
        };
        
        // Save purchase record
        await database.ref(`purchases/${userId}/${Date.now()}`).set(purchaseData);
        
        // Update user's total spent
        const userSpentRef = database.ref(`users/${userId}/totalSpent`);
        const snapshot = await userSpentRef.once('value');
        const currentTotal = snapshot.val() || 0;
        await userSpentRef.set(currentTotal + amount);
        
        console.log(`Firebase: Purchase tracked - ${type} for $${amount}`);
    } catch (error) {
        console.error("Firebase: Purchase tracking error", error);
    }
}

// Track game event
async function trackGameEvent(eventName, eventData = {}) {
    if (!isFirebaseConnected || !userId) return;
    
    try {
        const event = {
            event: eventName,
            data: eventData,
            timestamp: Date.now(),
            userId: userId,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        await database.ref(`events/${userId}/${Date.now()}`).set(event);
        console.log(`Firebase: Event tracked - ${eventName}`);
    } catch (error) {
        console.error("Firebase: Event tracking error", error);
    }
}

// Get leaderboard data
async function getLeaderboardData(limit = 10) {
    if (!isFirebaseConnected) return [];
    
    try {
        const snapshot = await database.ref('users').orderByChild('gameData/wins').limitToLast(limit).once('value');
        const users = snapshot.val();
        const leaderboard = [];
        
        for (const [userId, userData] of Object.entries(users || {})) {
            if (userData.gameData) {
                leaderboard.push({
                    userId: userId.substring(0, 8) + '...', // Truncate for privacy
                    wins: userData.gameData.wins || 0,
                    heat: userData.gameData.heat || 0,
                    coins: userData.gameData.coins || 0
                });
            }
        }
        
        // Sort by wins (descending)
        leaderboard.sort((a, b) => b.wins - a.wins);
        
        return leaderboard.slice(0, limit);
    } catch (error) {
        console.error("Firebase: Leaderboard error", error);
        return [];
    }
}

// Get user statistics
async function getUserStats() {
    if (!isFirebaseConnected || !userId) return null;
    
    try {
        const snapshot = await database.ref(`users/${userId}/gameData`).once('value');
        const gameData = snapshot.val();
        
        if (gameData) {
            return {
                totalWins: gameData.wins || 0,
                totalCoins: gameData.coins || 0,
                maxHeat: gameData.maxHeat || gameData.heat || 0,
                totalGames: gameData.totalGames || (gameData.wins || 0) + 10,
                purchaseCount: gameData.purchaseCount || 0
            };
        }
        return null;
    } catch (error) {
        console.error("Firebase: User stats error", error);
        return null;
    }
}

// Main save function (called by game)
function saveGameData() {
    if (isFirebaseConnected && userId) {
        saveGameDataToFirebase();
    } else {
        saveGameDataToLocalStorage();
    }
}

// Main load function (called by game)
function loadGameData() {
    if (isFirebaseConnected && userId) {
        loadGameDataFromFirebase();
    } else {
        loadGameDataFromLocalStorage();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Firebase system initialized");
    
    // Set up auto-save
    setInterval(() => {
        if (window.gameState) {
            saveGameData();
        }
    }, 30000);
    
    // Track page view
    setTimeout(() => {
        trackGameEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer
        });
    }, 1000);
});

// Make functions available globally
window.saveGameData = saveGameData;
window.loadGameData = loadGameData;
window.trackPurchase = trackPurchaseInFirebase;
window.trackGameEvent = trackGameEvent;
window.getLeaderboardData = getLeaderboardData;
window.getUserStats = getUserStats;

// Export Firebase status
window.firebaseStatus = {
    isConnected: isFirebaseConnected,
    userId: userId,
    database: database,
    auth: auth
};

console.log("Firebase integration ready");