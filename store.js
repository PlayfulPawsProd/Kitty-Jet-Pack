// ~~~ store.js ~~~ //
// Magic spells for the Plushie Store! Nya~!

// --- Store Data ---
// Define the items available for purchase
const storeItems = [
    {
        id: 'kitty_color_black',    // Unique identifier
        name: 'Shadow Kitty',       // Display name
        cost: 100,                  // Plushie cost
        description: 'A sleek, mysterious look!', // Short description
        type: 'kitty_color'         // Category (helps apply the effect later)
    },
    {
        id: 'kitty_color_orange',
        name: 'Ginger Kitty',
        cost: 100,
        description: 'A classic marmalade friend!',
        type: 'kitty_color'
    },
    {
        id: 'jetpack_rainbow',
        name: 'Rainbow Trail FX',
        cost: 250,
        description: 'Leave a sparkly rainbow trail!',
        type: 'jetpack_fx'
    },
    {
        id: 'plushie_magnet',
        name: 'Plushie Magnet (WIP)', // WIP = Work In Progress
        cost: 500,
        description: 'Attract nearby plushies! (Effect not implemented yet!)',
        type: 'power_up' // Example type
    }
    // Add more items here later! Nya~!
];

let purchasedItems = {}; // Object to store loaded purchase status { 'itemId': true/false }
let storeButtonHeight = 60; // Height of each item display box
let storeButtonSpacing = 75; // Spacing between item boxes
let buyButtonWidth;       // Calculated in setupStore
let buyButtonHeight = 40;
let storeItemYStart;     // Calculated in setupStore
let storeBackButton;      // Calculated in setupStore

// --- Calculate dynamic store layout elements (call from sketch.js setup) ---
function setupStoreLayout(canvasW, canvasH) {
    buyButtonWidth = canvasW * 0.2;
    storeItemYStart = canvasH * 0.25;
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
    if (!width || !height) return; // Safety check if called before setup finishes

    // Draw background, title, total plushies...
    background(50, 50, 70, 220); // Dim background with transparency
    fill(textColor);             // Use global textColor (white-ish)
    stroke(textStrokeColor);     // Use global stroke color
    strokeWeight(3);
    textSize(min(width, height) * 0.08); // Responsive title size
    text("Plushie Store!", width / 2, height * 0.1);

    textSize(min(width, height) * 0.05); // Responsive total plushie size
    strokeWeight(2);
    text(`Total Plushies: ${totalPlushiesCollected}`, width / 2, height * 0.18);

    noStroke(); // Turn off stroke for item boxes/buttons unless needed

    // Loop through items and draw them...
    let itemY = storeItemYStart;
    storeItems.forEach((item, index) => {
        // Ensure purchasedItems is populated before drawing
        if (typeof purchasedItems[item.id] === 'undefined') {
             console.warn(`Purchase status for ${item.id} not loaded yet.`);
             purchasedItems[item.id] = false; // Default to not purchased if loading failed
        }

        // Item Box
        fill(100, 100, 120, 200); // Slightly transparent item box color
        rectMode(CORNER);
        rect(width * 0.05, itemY, width * 0.9, storeButtonHeight, 5);

        // Item Text
        fill(textColor);
        textAlign(LEFT, TOP);
        textSize(min(width, height) * 0.035); // Responsive text size
        stroke(textStrokeColor); strokeWeight(1); // Subtle stroke for item text
        text(`${item.name}`, width * 0.08, itemY + 8);

        textSize(min(width, height) * 0.025); // Smaller description
        noStroke(); // No stroke for description
        text(item.description, width * 0.08, itemY + 32);

        // Buy/Owned Button Area
        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03); // Position from right edge
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2; // Center vertically in item box

        rectMode(CORNER); noStroke(); // No stroke for button fill
        textSize(min(width, height) * 0.03); // Responsive button text size
        textAlign(CENTER, CENTER);

        if (purchasedItems[item.id]) { // Check purchase status
            fill(100, 200, 100); // Greenish Owned
            rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
            fill(0); // Black text
            text("Owned!", buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);
        } else if (totalPlushiesCollected >= item.cost) {
             fill(100, 150, 255); // Blueish Buy
             rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
             fill(textColor); // White text
             text(`Buy (${item.cost})`, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);
        } else {
             fill(150); // Greyed out Not Affordable
             rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
             fill(80); // Dark grey text
             text(`Buy (${item.cost})`, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);
        }

        itemY += storeButtonSpacing; // Move down for next item
    });

    // Draw Back Button (Using calculated bounds)
    if (storeBackButton) {
        fill(backButtonColor); rectMode(CORNER); noStroke();
        rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5);
        fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5);
        text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2);
    }

    textAlign(CENTER, CENTER); noStroke(); // Reset
}

// --- Store Input Handler (Called from sketch.js handlePressStart) ---
function handleStoreInput(px, py) {
     if (!audioStarted) return; // Don't allow interaction before audio starts

     // Check Back Button first
     if (storeBackButton &&
         px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w &&
         py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h)
     {
         gameState = 'start'; // Go back to start screen
         console.log("Exiting Store");
         return;
     }

     // Check Item Buy Buttons
     let itemY = storeItemYStart;
     storeItems.forEach(item => {
        // Ensure purchase status is known before checking button
         if (typeof purchasedItems[item.id] === 'undefined') return; // Skip if status unknown

        let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
        let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;

        // Check if clicking THIS item's buy button
        if (!purchasedItems[item.id] && totalPlushiesCollected >= item.cost && // Check not owned & can afford
            px >= buttonX && px <= buttonX + buttonW &&
            py >= buttonTopY && py <= buttonTopY + buttonH)
        {
            // Buy the item!
            console.log("Buying:", item.name);
            totalPlushiesCollected -= item.cost;
            purchasedItems[item.id] = true; // Update live status immediately

            // Save persistently
            try {
                localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected);
                localStorage.setItem(item.id, 'true');
                console.log("Purchase successful and saved!");
                // Play buy sound? chaChingSound.play();
            } catch (e) {
                console.warn("Could not save purchase to localStorage:", e);
                // Maybe alert the user purchase might not save?
            }
            return; // Stop checking other buttons for this click
        } else if (px >= buttonX && px <= buttonX + buttonW &&
                   py >= buttonTopY && py <= buttonTopY + buttonH) {
             // Clicked button but couldn't buy (already owned or can't afford)
             if(purchasedItems[item.id]){
                console.log("Already own:", item.name);
             } else {
                 console.log("Not enough plushies for:", item.name);
                 // Maybe flash the total plushies display red?
             }
             return;
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
    // Ensure the check happens safely, default to false if unknown
    return purchasedItems[itemId] === true;
}
