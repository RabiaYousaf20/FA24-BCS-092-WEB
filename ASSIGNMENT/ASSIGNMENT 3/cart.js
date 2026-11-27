// cart.js - shared cart logic for EVERY page.
// Load it BEFORE the page's own script:  <script src="cart.js"></script>

// The cart is an array that lives in memory while the page is open.
// We also copy it into localStorage so it is still there when the user
// moves from index.html -> product.html -> cart.html (each page reloads).
let cart = loadCart();

// Read the saved cart (or start with an empty one if nothing / bad data)
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// Give other files the current cart array
function getCart() {
  return cart;
}

// Save the cart and refresh the number in the header
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateBadge();
}

// Format a number as money, e.g. $1,899.98
function formatMoney(number) {
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Add a product (or increase its quantity if it is already in the cart)
function addToCart(product, qty = 1) {
  const found = cart.find(item => item.id === product.id);

  if (found) {
    found.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }
  saveCart();
}

// Change the quantity of one item (map builds a new array with the change)
function setQty(id, qty) {
  let newQty = parseInt(qty, 10);
  if (isNaN(newQty) || newQty < 1) newQty = 1;   // never below 1
  if (newQty > 99) newQty = 99;                  // sensible upper limit

  cart = cart.map(item => (item.id === id ? { ...item, qty: newQty } : item));
  saveCart();
}

// Remove one item (filter keeps every item EXCEPT the one with this id)
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

// Empty the whole cart (used after a successful order)
function clearCart() {
  cart = [];
  saveCart();
}

// Total price = sum of (price x qty) for every item (reduce)
function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Total number of items = sum of all quantities (reduce)
function getCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// Show the number in the red badge in the header
function updateBadge() {
  const badge = document.querySelector("#cart-count");
  if (badge) {
    badge.textContent = getCount();
  }
}

// Run once when the page loads so the badge is correct straight away
updateBadge();