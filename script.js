// --- CONFIGURATION ---
const MOCK_PRICES = {
    ETH: 2450.82,
    USDC: 1.00,
    BTC: 64200.15,
    DAI: 1.00
};

let userBalance = {
    ETH: 1.42,
    USDC: 500.00
};

// --- DOM ELEMENTS ---
const sellInput = document.querySelectorAll('.asset-input input')[0];
const buyInput = document.querySelectorAll('.asset-input input')[1];
const confirmBtn = document.querySelector('.confirm-btn');
const balanceDisplay = document.querySelector('.balance') || document.querySelector('.input-meta span:last-child');

// --- SIMULATOR LOGIC ---

/**
 * Updates the output field based on simulated price
 */
function calculateSwap() {
    const amount = parseFloat(sellInput.value) || 0;
    // For simplicity, we're simulating ETH to USDC swap
    const rate = MOCK_PRICES.ETH / MOCK_PRICES.USDC;
    const result = amount * rate;
    
    // Animate the result appearing
    buyInput.value = result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Simulates a blockchain transaction
 */
function executeSwap() {
    const amount = parseFloat(sellInput.value);
    
    if (isNaN(amount) || amount <= 0) {
        showFeedback("Enter a valid amount", "error");
        return;
    }

    if (amount > userBalance.ETH) {
        showFeedback("Insufficient ETH Balance", "error");
        return;
    }

    // Process simulation
    confirmBtn.innerText = "Broadcasting to Network...";
    confirmBtn.disabled = true;

    setTimeout(() => {
        const received = amount * (MOCK_PRICES.ETH / MOCK_PRICES.USDC);
        
        userBalance.ETH -= amount;
        userBalance.USDC += received;
        
        updateUI();
        showFeedback("Transaction Confirmed!", "success");
        
        confirmBtn.innerText = "Execute Protocol";
        confirmBtn.disabled = false;
        sellInput.value = "";
        buyInput.value = "";
    }, 1500);
}

/**
 * Updates balances and numbers in the UI
 */
function updateUI() {
    // Update the balance display in the meta section
    if (balanceDisplay) {
        balanceDisplay.innerText = `Balance: ${userBalance.ETH.toFixed(2)} ETH`;
    }
}

/**
 * Simple UI Toast feedback
 */
function showFeedback(msg, type) {
    const originalText = confirmBtn.innerText;
    confirmBtn.innerText = msg;
    confirmBtn.style.background = type === "error" ? "#ff4a4a" : "#00ffaa";
    confirmBtn.style.color = "#000";

    setTimeout(() => {
        confirmBtn.innerText = "Execute Protocol";
        confirmBtn.style.background = ""; // Revert to CSS default
    }, 3000);
}

// --- EVENT LISTENERS ---

sellInput.addEventListener('input', calculateSwap);
confirmBtn.addEventListener('click', executeSwap);

// Simulated Price Ticker (Makes the site feel alive)
setInterval(() => {
    const drift = (Math.random() - 0.5) * 2;
    MOCK_PRICES.ETH += drift;
    
    const priceDisplay = document.querySelector('.price-up');
    if (priceDisplay) {
        priceDisplay.innerText = `ETH / USDC: $${MOCK_PRICES.ETH.toFixed(2)}`;
        priceDisplay.style.color = drift > 0 ? "#00ffaa" : "#ff4a4a";
    }
    
    // Recalculate if user has numbers typed in
    if (sellInput.value) calculateSwap();
}, 3000);

// Initialize
updateUI();