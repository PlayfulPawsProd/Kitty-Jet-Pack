// --- Store Data ---
const storeItems = [
    { id: 'jetpack_rainbow', name: 'Rainbow Trail', cost: 50, description: 'Leave a sparkly trail!', type: 'jetpack_fx' },
    { id: 'kitty_color_black', name: 'Shadow Kitty', cost: 100, description: 'Become one with the night!', type: 'kitty_color' },
    // Add more items!
];
let purchasedItems = {}; // Store loaded purchase status

// --- Store Display Function ---
function displayStore() {
    // Draw background, title, total plushies...
    background(50, 50, 70); // Dim background
    fill(255); textSize(30);
    text("Plushie Store!", width / 2, height * 0.1);
    textSize(20);
    text(`Total Plushies: ${totalPlushiesCollected}`, width / 2, height * 0.2);

    // Loop through items and draw them...
    let itemY = height * 0.3;
    storeItems.forEach(item => {
        fill(200);
        rect(width * 0.1, itemY, width * 0.8, 60, 5); // Item box
        fill(0); textAlign(LEFT, TOP); textSize(16);
        text(`${item.name} (${item.cost} Plushies)`, width * 0.15, itemY + 10);
        textSize(12);
        text(item.description, width * 0.15, itemY + 35);

        // Draw Buy/Purchased Button
        let buttonX = width * 0.7;
        let buttonW = width * 0.18;
        let buttonH = 40;
        if (purchasedItems[item.id]) { // Use the loaded status
            fill(100, 200, 100); // Greenish
            rect(buttonX, itemY + 10, buttonW, buttonH, 3);
            fill(0); textSize(14); textAlign(CENTER, CENTER);
            text("Owned!", buttonX + buttonW / 2, itemY + 10 + buttonH / 2);
        } else if (totalPlushiesCollected >= item.cost) {
             fill(100, 150, 255); // Blueish
             rect(buttonX, itemY + 10, buttonW, buttonH, 3);
             fill(255); textSize(14); textAlign(CENTER, CENTER);
             text("Buy", buttonX + buttonW / 2, itemY + 10 + buttonH / 2);
        } else {
             fill(150); // Greyed out
             rect(buttonX, itemY + 10, buttonW, buttonH, 3);
             fill(80); textSize(14); textAlign(CENTER, CENTER);
             text("Buy", buttonX + buttonW / 2, itemY + 10 + buttonH / 2);
        }

        itemY += 75; // Move down for next item
    });

    // Draw Back Button
    fill(backButtonColor); rectMode(CORNER); // Use corner mode maybe easier
    rect(15, height - 55, 100, 40, 5);
    fill(textColor); textSize(18); textAlign(CENTER, CENTER);
    text("Back", 15 + 50, height - 55 + 20);

     textAlign(CENTER, CENTER); // Reset
}

// --- Store Input Handler ---
function handleStoreInput(px, py) {
     // Check Back Button first
     if (px >= 15 && px <= 115 && py >= height - 55 && py <= height - 15) {
         gameState = 'start';
         return;
     }

     // Check Item Buy Buttons
     let itemY = height * 0.3;
     storeItems.forEach(item => {
        let buttonX = width * 0.7;
        let buttonW = width * 0.18;
        let buttonH = 40;
        let buttonTopY = itemY + 10;

        if (!purchasedItems[item.id] && totalPlushiesCollected >= item.cost && // Check not owned & can afford
            px >= buttonX && px <= buttonX + buttonW &&
            py >= buttonTopY && py <= buttonTopY + buttonH)
        {
            // Buy the item!
            console.log("Buying:", item.name);
            totalPlushiesCollected -= item.cost;
            purchasedItems[item.id] = true; // Update live status
            localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); // Save new total
            localStorage.setItem(item.id, 'true'); // Save purchase
            // Play sound?
            return; // Stop checking other buttons
        }
        itemY += 75; // Move to next item's potential button area
     });
}

// Helper to load purchases (call this in sketch.js setup)
function loadPurchases() {
    console.log("Loading purchased items...");
    purchasedItems = {}; // Reset before loading
    storeItems.forEach(item => {
        if (localStorage.getItem(item.id) === 'true') {
            purchasedItems[item.id] = true;
            console.log(`- ${item.name} is owned.`);
        } else {
             purchasedItems[item.id] = false;
        }
    });
}

// Helper to check purchase status (call this in sketch.js drawing)
function isItemPurchased(itemId) {
    return purchasedItems[itemId] === true;
}
