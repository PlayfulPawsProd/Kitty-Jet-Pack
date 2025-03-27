// ~~~ store.js ~~~ //
// Magic spells for the Plushie Store! Nya~! (WIP Version)

// --- Store Data ---
const storeItems = [
    { id: 'kitty_color_black', name: 'Shadow Kitty', cost: 100, description: 'A sleek, mysterious look!', type: 'kitty_color' },
    { id: 'kitty_color_orange', name: 'Ginger Kitty', cost: 100, description: 'A classic marmalade friend!', type: 'kitty_color' },
    { id: 'jetpack_rainbow', name: 'Rainbow Trail FX', cost: 250, description: 'Leave a sparkly rainbow trail!', type: 'jetpack_fx' },
    { id: 'plushie_magnet', name: 'Plushie Magnet (WIP)', cost: 500, description: 'Attract nearby plushies! (Effect TBD!)', type: 'power_up' }
    // Add more items here later! Nya~!
];

let purchasedItems = {}; // Object to store loaded purchase status { 'itemId': true/false }
let storeButtonHeight = 60; // Height of each item display box
let storeButtonSpacing = 75; // Spacing between item boxes
let buyButtonWidth;       // Calculated in setupStoreLayout
let buyButtonHeight = 40;
let storeItemYStart;     // Calculated in setupStoreLayout
let storeBackButton;      // Calculated in setupStoreLayout

// --- Calculate dynamic store layout elements (call from sketch.js setup) ---
function setupStoreLayout(canvasW, canvasH) {
    buyButtonWidth = canvasW * 0.2;
    storeItemYStart = canvasH * 0.25; // Start items lower to make space for WIP message
    storeBackButton = {
        x: 15,
        y: canvasH - 55,
        w: 100,
        h: 40
    };
    console.log("Store layout calculated!");
}


// --- Store Display Function (Called from sketch.js draw when gameState is 'store') ---
function displayStore() {
    if (!width || !height) return; // Safety check

    // Draw background, title, total plushies...
    background(50, 50, 70, 220);
    fill(textColor); stroke(textStrokeColor); strokeWeight(3);
    textSize(min(width, height) * 0.08);
    text("Plushie Store!", width / 2, height * 0.1);

    textSize(min(width, height) * 0.05); strokeWeight(2);
    text(`Total Plushies: ${totalPlushiesCollected}`, width / 2, height * 0.18);

    // --- ADD HILARIOUS WIP MESSAGE ---
    fill(255, 200, 200); // Light pink/warning-ish color
    textSize(min(width, height) * 0.03); // Smaller text
    noStroke();
    text("Window shopping only, nya~!", width/2, height * 0.22); // Adjusted Y
    text("Buying machine broken! (Blame Kana!)", width/2, height * 0.22 + min(width, height) * 0.035);
    // --- END WIP MESSAGE ---

    noStroke(); // Ensure stroke is off before drawing items

    // Loop through items and draw them...
    let itemY = storeItemYStart; // Use calculated start position
    storeItems.forEach((item, index) => {
        // Ensure purchasedItems is populated before drawing
        if (typeof purchasedItems[item.id] === 'undefined') {
             purchasedItems[item.id] = false; // Default to not purchased if loading failed/not run yet
        }

        // Item Box
        fill(100, 100, 120, 200); rectMode(CORNER);
        rect(width * 0.05, itemY, width * 0.9, storeButtonHeight, 5);

        // Item Text
        fill(textColor); textAlign(LEFT, TOP); textSize(min(width, height) * 0.035); stroke(textStrokeColor); strokeWeight(1);
        text(`${item.name}`, width * 0.08, itemY + 8);
        textSize(min(width, height) * 0.025); noStroke();
        text(item.description, width * 0.08, itemY + 32);

        // Buy/Owned Button Area - ALWAYS Greyed Out for now
        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;
        rectMode(CORNER); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER);

        fill(150); // Greyed out
        rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
        fill(80); // Dark grey text
        if (purchasedItems[item.id]) {
            text("Owned!", buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);
        } else {
            text(`Buy (${item.cost})`, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);
        }

        itemY += storeButtonSpacing; // Move down for next item
    });

    // Draw Back Button
    if (storeBackButton) {
        fill(backButtonColor); rectMode(CORNER); noStroke();
        rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5);
        fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5);
        text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2);
    }

    textAlign(CENTER, CENTER); noStroke(); // Reset
}

// --- Store Input Handler (Called from sketch.js handlePressStart - Buying Disabled) ---
function handleStoreInput(px, py) {
     if (!audioStarted) return;

     // Check Back Button first
     if (storeBackButton && px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w && py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h) {
         gameState = 'start'; // Go back to start screen
         console.log("Exiting Store");
         return;
     }

     // Check Item Buy Buttons - Just log, don't buy
     let itemY = storeItemYStart;
     storeItems.forEach(item => {
        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;

        // Check if clicking THIS item's buy button area
        if (px >= buttonX && px <= buttonX + buyButtonWidth &&
            py >= buttonTopY && py <= buttonTopY + buyButtonHeight)
        {
            console.log("Clicked Buy Button for", item.name, "- But buying is broken! Blame Kana! *Hiss*");
            // Maybe add a little visual pop/feedback later?
            return; // Stop checking other buttons for this click
        }
        itemY += storeButtonSpacing; // Move to next item's potential button area
     });
}

// --- Helper to load purchases (call this in sketch.js setup) ---
function loadPurchases() {
    console.log("Loading purchased items...");
    purchasedItems = {}; // Reset before loading
    storeItems.forEach(item => {
         try {
            if (localStorage.getItem(item.id) === 'true') {
                purchasedItems[item.id] = true;
                console.log(`- ${item.name} is owned.`);
            } else {
                 purchasedItems[item.id] = false;
            }
         } catch (e) {
             console.warn(`Could not load purchase status for ${item.id}:`, e);
             purchasedItems[item.id] = false; // Default to false on error
         }
    });
    console.log("Purchase loading complete.");
}

// --- Helper to check purchase status (call from sketch.js drawing/logic) ---
function isItemPurchased(itemId) {
    // Ensure the check happens safely, default to false if unknown or not loaded
    return purchasedItems[itemId] === true;
}
