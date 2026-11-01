
/*
    Author: Adam Smithhisler
    Date: 11/1/2026
    Purpose: SDC260 Assignment 4.4 - Planting Sessions.
    Display plant products, manage a shopping cart,
    and save cart information using sessionStorage.
*/

/* =========================================
   GLOBAL VARIABLES
========================================= */

// STEP 2

// Plant Data
const plants = [
    {
        id: 1,
        name: "Monstera Deliciosa",
        description: "Large tropical leaves perfect for bright interiors.",
        price: 34.99,
        image: "images/monsteradeliciosa.png",
        alt: "Monstera Deliciosa",
        sun: "☀️"
    },
    {
        id: 2,
        name: "Snake Plant",
        description: "Low-maintenance plant with upright leaves.",
        price: 14.99,
        image: "images/snakeplant.png",
        alt: "Snake Plant",
        sun: "🌙"
    },
    {
        id: 3,
        name: "Bird of Paradise",
        description: "Bold tropical foliage with dramatic appearance.",
        price: 49.99,
        image: "images/paradiseplant.png",
        alt: "Paradise Plant",
        sun: "🌤"
    },
    {
        id: 4,
        name: "Peace Lily",
        description: "Elegant indoor plant with beautiful white blooms.",
        price: 29.99,
        image: "images/peacelily.png",
        alt: "Peace Lily",
        sun: "🌤"
    },
    {
        id: 5,
        name: "Golden Pothos",
        description: "Trailing green and golden leaves ideal for indoor spaces.",
        price: 19.99,
        image: "images/goldenpothos.png",
        alt: "Golden Pothos plant with trailing variegated leaves",
        sun: "🌤"
    },
    {
        id: 6,
        name: "ZZ Plant",
        description: "Glossy green foliage that thrives with minimal maintenance.",
        price: 24.99,
        image: "images/zzplant.png",
        alt: "ZZ Plant with upright stems and glossy green leaves",
        sun: "🌙"
    },
    {
        id: 7,
        name: "Spider Plant",
        description: "Arching striped leaves that make a great hanging plant.",
        price: 16.99,
        image: "images/spiderplant.png",
        alt: "Spider Plant with long arching green and white leaves",
        sun: "🌤"
    }
];

/* =========================================
   DOM REFERENCES
========================================= */

// STEP 3

const plantGrid = document.getElementById("plant-grid");
const cartPanel = document.getElementById("cart-panel");
const cartToggle = document.getElementById("cart-toggle");
const collapseCart = document.getElementById("collapse-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

/* =========================================
   SESSION STORAGE
========================================= */

// STEP 4

// Retrieve cart data from session storage.
// If no saved cart exists, initialize an empty array.

let cart = JSON.parse(sessionStorage.getItem("plantCart")) || [];

/* =========================================
   RENDER PLANTS
========================================= */

// STEP 5

function renderPlants() {

    // Clear existing content before rendering.
    plantGrid.innerHTML = "";

    // Loop through every plant object.
    plants.forEach((plant) => {

        // Create an article element for each plant card.
        const card = document.createElement("article");
        card.classList.add("plant-card");

        card.innerHTML = `
            <div class="image-container">
                <img src="${plant.image}" alt="${plant.alt}">

                <div class="sun-level" aria-label="Sunlight level">
                    ${plant.sun}
                </div>
            </div>

            <div class="card-content">
                <h3>${plant.name}</h3>
                <p>${plant.description}</p>
                <p class="price">$${plant.price.toFixed(2)}</p>

                <button class="add-btn" data-id="${plant.id}">
                    Add to Cart
                </button>
            </div>
        `;

        // Append the completed plant card to the page.
        plantGrid.appendChild(card);
    });
}

/* =========================================
   SAVE CART
========================================= */

// STEP 6

function saveCart() {

    // Save current cart array into session storage.
    sessionStorage.setItem("plantCart", JSON.stringify(cart));
}

/* =========================================
   ADD TO CART
========================================= */

// STEP 7

function addToCart(id) {

    // Locate the selected plant object.
    const plant = plants.find((item) => item.id === id);

    // Check whether the item already exists in the cart.
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {

        // Increase the quantity of an existing item.
        existingItem.quantity++;

    } else {

        // Add a new item with an initial quantity of one.
        cart.push({ ...plant, quantity: 1 });
    }

    // Save changes, update the cart, and animate the button.
    saveCart();
    renderCart();
    animateCartButton();
}

/* =========================================
   UPDATE QUANTITY
========================================= */

// STEP 8

function updateQuantity(id, change) {

    // Find the matching cart item.
    const item = cart.find((product) => product.id === id);

    // Exit if the item does not exist.
    if (!item) return;

    // Increase or decrease the quantity.
    item.quantity += change;

    // Remove the item if the quantity reaches zero.
    if (item.quantity <= 0) {
        cart = cart.filter((product) => product.id !== id);
    }

    // Save changes and refresh the cart.
    saveCart();
    renderCart();
}

/* =========================================
   RENDER CART
========================================= */

// STEP 9

function renderCart() {

    // Display an empty-cart message when appropriate.
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "Total: $0.00";
        return;
    }

    // Clear the previous cart display.
    cartItems.innerHTML = "";

    let total = 0;

    // Loop through every item in the cart.
    cart.forEach((item) => {

        // Calculate the running total.
        total += item.price * item.quantity;

        // Create the cart item element.
        const cartItem = document.createElement("article");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <h3>${item.name}</h3>

            <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>

            <div class="quantity-controls">
                <button
                    class="quantity-btn decrease-btn"
                    data-id="${item.id}">
                    -
                </button>

                <span>${item.quantity}</span>

                <button
                    class="quantity-btn increase-btn"
                    data-id="${item.id}">
                    +
                </button>
            </div>
        `;

        // Append the item to the cart panel.
        cartItems.appendChild(cartItem);
    });

    // Display the updated cart total.
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

/* =========================================
   TOGGLE CART
========================================= */

function toggleCart() {

    // Toggle the cart's open state.
    cartPanel.classList.toggle("open");

    // Change the arrow direction.
    if (cartPanel.classList.contains("open")) {
        collapseCart.innerHTML = "❯";
    } else {
        collapseCart.innerHTML = "❮";
    }
}

// Open or close the cart with the main button.
cartToggle.addEventListener("click", () => {
    toggleCart();
});

// Open or close the cart with the side arrow.
collapseCart.addEventListener("click", () => {
    toggleCart();
});

/* =========================================
   CLICK EVENTS
========================================= */

// STEP 10

document.addEventListener("click", (event) => {

    // ADD TO CART
    if (event.target.classList.contains("add-btn")) {

        const id = Number(event.target.dataset.id);
        addToCart(id);
    }

    // INCREASE QUANTITY
    if (event.target.classList.contains("increase-btn")) {

        const id = Number(event.target.dataset.id);
        updateQuantity(id, 1);
    }

    // DECREASE QUANTITY
    if (event.target.classList.contains("decrease-btn")) {

        const id = Number(event.target.dataset.id);
        updateQuantity(id, -1);
    }
});

/* =========================================
   CHECKOUT
========================================= */

// STEP 11

checkoutBtn.addEventListener("click", () => {

    // Prevent checkout if the cart is empty.
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Calculate the purchase total.
    let total = 0;

    cart.forEach((item) => {
        total += item.price * item.quantity;
    });

    // Display the purchase confirmation.
    alert(`Confirm Purchase\n\nTotal: $${total.toFixed(2)}`);
});

/* =========================================
   CART BUTTON ANIMATION
========================================= */

function animateCartButton() {

    cartToggle.classList.add("bounce");

    setTimeout(() => {
        cartToggle.classList.remove("bounce");
    }, 500);
}

/* =========================================
   INITIALIZE
========================================= */

// Set the initial arrow direction.
collapseCart.innerHTML = "❮";

// Display the plant products.
renderPlants();

// Restore and display the saved shopping cart.
renderCart();
