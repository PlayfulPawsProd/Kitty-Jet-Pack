// ~~~ store.js ~~~ //
// Magic spells for the Plushie Store! Nya~! (Buying Enabled!)

// --- Store Data ---
const storeItems = [
    { id: 'kitty_bow_pink', name: 'Pink Bow', cost: 1, description: 'A cute bow for kitty!', type: 'kitty_accessory' }, // NEW ITEM!
    { id: 'kitty_color_black', name: 'Shadow Kitty', cost: 100, description: 'A sleek, mysterious look!', type: 'kitty_color' },
    { id: 'kitty_color_orange', name: 'Ginger Kitty', cost: 100, description: 'A classic marmalade friend!', type: 'kitty_color' },
    { id: 'jetpack_rainbow', name: 'Rainbow Trail FX', cost: 250, description: 'Leave a sparkly rainbow trail!', type: 'jetpack_fx' },
    { id: 'plushie_magnet', name: 'Plushie Magnet (WIP)', cost: 500, description: 'Attract nearby plushies! (Effect TBD!)', type: 'power_up' }
];

let purchasedItems = {}; // { 'itemId': true/false }
let equippedItems = { // Store currently equipped items by type
    kitty_accessory: null, // Only one accessory at a time for now
    kitty_color: null, // Allow one color override later
    jetpack_fx: null // Allow one jetpack effect later
};

let storeButtonHeight = 60;
let storeButtonSpacing = 75;
let buyButtonWidth;
let buyButtonHeight = 40;
let storeItemYStart;
let storeBackButton;

// --- Calculate dynamic store layout elements ---
function setupStoreLayout(canvasW, canvasH) {
    buyButtonWidth = canvasW * 0.25; // Slightly wider button
    storeItemYStart = canvasH * 0.25; // Start items a bit lower
    storeBackButton = { x: 15, y: canvasH - 55, w: 100, h: 40 };
    console.log("Store layout calculated!");
}

// --- Store Display Function ---
function displayStore(currentTotalPlushies) { // Accept total plushies from sketch
    if (!width || !height) return;

    // Background, Title, Total Plushies
    background(50, 50, 70, 220);
    fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.08);
    text("Plushie Store!", width / 2, height * 0.1);
    textSize(min(width, height) * 0.05); strokeWeight(2);
    text(`Total Plushies: ${currentTotalPlushies}`, width / 2, height * 0.18); // Use passed-in value
    noStroke();

    // Loop through items
    let itemY = storeItemYStart;
    storeItems.forEach((item, index) => {
        if (typeof purchasedItems[item.id] === 'undefined') { purchasedItems[item.id] = false; }

        // Item Box
        fill(100, 100, 120, 200); rectMode(CORNER);
        rect(width * 0.05, itemY, width * 0.9, storeButtonHeight, 5);

        // Item Text
        fill(textColor); textAlign(LEFT, TOP); textSize(min(width, height) * 0.035); stroke(textStrokeColor); strokeWeight(1);
        text(`${item.name}`, width * 0.08, itemY + 8);
        textSize(min(width, height) * 0.025); noStroke();
        text(item.description, width * 0.08, itemY + 32);

        // --- Buy/Equip/Unequip Button ---
        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;
        rectMode(CORNER); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER);
        let buttonText = "";
        let buttonColor = color(150); // Default grey
        let buttonTextColor = color(80);

        if (purchasedItems[item.id]) { // If owned
            buttonColor = color(100, 150, 200); // Blueish for owned
            buttonTextColor = color(255);
            // Check if THIS specific item is equipped for its type
            if (equippedItems[item.type] === item.id) {
                buttonText = "Unequip";
                buttonColor = color(200, 100, 100); // Reddish if equipped
            } else {
                buttonText = "Equip";
            }
        } else { // Not owned
             if (currentTotalPlushies >= item.cost) {
                 buttonColor = color(100, 200, 100); // Green if affordable
                 buttonTextColor = color(0);
             } else {
                 buttonColor = color(150); // Grey if cannot afford
                 buttonTextColor = color(80);
             }
             buttonText = `Buy (${item.cost})`;
        }

        fill(buttonColor);
        rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
        fill(buttonTextColor); stroke(textStrokeColor); strokeWeight(1); // Add stroke to button text
        text(buttonText, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);

        itemY += storeButtonSpacing;
    });

    // Draw Back Button
    if (storeBackButton) { /* ... same ... */ fill(backButtonColor); rectMode(CORNER); noStroke(); rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2); }

    textAlign(CENTER, CENTER); noStroke();
}

// --- Store Input Handler - UPDATED for Buying/Equipping! ---
function handleStoreInput(px, py, currentTotalPlushies) {
     if (!audioStarted) return false; // Return false if not handled or buy fails

     // Check Back Button
     if (storeBackButton && px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w && py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h) { gameState = 'start'; console.log("Exiting Store"); return true; } // Handled

     // Check Item Buttons
     let itemY = storeItemYStart;
     let itemHandled = false; // Flag to see if we handle a button click
     for (let item of storeItems) { // Use for..of to allow early exit with 'return'
        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;

        if (px >= buttonX && px <= buttonX + buyButtonWidth && py >= buttonTopY && py <= buttonTopY + buyButtonHeight)
        {
            console.log("Clicked button for:", item.name);
            if (purchasedItems[item.id]) { // --- Handle Equip/Unequip ---
                 if (equippedItems[item.type] === item.id) { // Currently equipped? -> Unequip
                     equippedItems[item.type] = null;
                     localStorage.removeItem(`equipped_${item.type}`); // Remove from storage
                     console.log(`Unequipped ${item.name}`);
                 } else { // Not equipped? -> Equip
                     equippedItems[item.type] = item.id;
                     localStorage.setItem(`equipped_${item.type}`, item.id); // Save to storage
                     console.log(`Equipped ${item.name}`);
                 }
                 itemHandled = true; break; // Exit loop after handling equip/unequip
            } else { // --- Handle Buy ---
                if (currentTotalPlushies >= item.cost) {
                    console.log("Attempting to buy", item.name);
                    purchasedItems[item.id] = true; // Mark as purchased
                    try { localStorage.setItem(item.id, 'true'); } catch (e) { console.warn("Failed to save purchase:", e);} // Save purchase
                    console.log("Purchased!", item.name);
                    // Return the cost so the main sketch can subtract it
                    return item.cost; // Indicate purchase success and cost
                } else {
                    console.log("Not enough plushies to buy", item.name);
                    shakeTime = 10; // Add a little shake feedback for failed buy?
                    itemHandled = true; break; // Exit loop after handling failed buy
                }
            }
        }
        itemY += storeButtonSpacing;
     }
     return itemHandled; // Return true if any button logic was processed, false otherwise
}

// --- Load Purchases and Equipped Items ---
function loadItems() {
    console.log("Loading items...");
    purchasedItems = {};
    equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null }; // Reset equipped

    storeItems.forEach(item => { // Load purchased status
         try { purchasedItems[item.id] = localStorage.getItem(item.id) === 'true'; }
         catch (e) { console.warn(`Could not load purchase status for ${item.id}:`, e); purchasedItems[item.id] = false; }
    });

    // Load equipped status for each type
    for (let type in equippedItems) {
        try {
            let equippedId = localStorage.getItem(`equipped_${type}`);
            if (equippedId && purchasedItems[equippedId]) { // Check if it exists and is actually owned
                 equippedItems[type] = equippedId;
                 console.log(`- Equipped ${type}: ${equippedId}`);
            } else {
                 equippedItems[type] = null; // Ensure it's null if not found or not owned
                 localStorage.removeItem(`equipped_${type}`); // Clean up storage if invalid
            }
        } catch (e) { console.warn(`Could not load equipped status for ${type}:`, e); equippedItems[type] = null; }
    }
    console.log("Item loading complete.");
}

// --- Helper to check purchase status ---
function isItemPurchased(itemId) { return purchasedItems[itemId] === true; }

// --- Helper to check equipped status ---
function getEquippedItem(itemType) { return equippedItems[itemType]; } // Returns the ID or null