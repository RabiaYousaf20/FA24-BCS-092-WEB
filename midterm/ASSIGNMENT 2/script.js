// ===== Task 3: cart badge + mini cart (plain JavaScript) =====

// N = the number from the assignment brief. Limit per product = (N mod 4) + 2
const N = 92;
const MAX_PER_PRODUCT = (N % 4) + 2;

// The cart is an array of { name, price }
const cart = [];

const toggleLink = document.getElementById("cart-toggle");
const miniCart = document.getElementById("mini-cart");
const badge = document.getElementById("cart-badge");
const list = document.getElementById("cart-list");
const totalEl = document.getElementById("cart-total");
const addButtons = document.querySelectorAll(".deal-cart-btn");

const money = (n) => "$" + n.toFixed(2);

// Read name and price from the card itself
function readCard(button) {
  const card = button.closest(".deal-card");
  const name = card.querySelector(".deal-name").textContent.trim();
  const priceText = card.querySelector(".deal-current").textContent;
  const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
  return { name, price };
}

// How many times is this product already in the cart?
function countOf(name) {
  return cart.filter((item) => item.name === name).length;
}

// Redraw badge, list, total and the "Add to Cart" buttons
function render() {
  // Badge
  badge.textContent = cart.length;
  badge.hidden = cart.length === 0;

  // List
  list.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "mini-cart-item";

    const name = document.createElement("span");
    name.className = "mini-cart-name";
    name.textContent = item.name;

    const price = document.createElement("span");
    price.className = "mini-cart-price";
    price.textContent = money(item.price);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "mini-cart-remove";
    remove.textContent = "Remove";
    remove.dataset.index = index;

    li.append(name, price, remove);
    list.appendChild(li);
  });

  if (cart.length === 0) {
    const empty = document.createElement("li");
    empty.className = "mini-cart-empty";
    empty.textContent = "Your cart is empty.";
    list.appendChild(empty);
  }

  // Total with reduce()
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalEl.textContent = money(total);

  // Buttons: "Limit reached" + disabled when the product hit its limit
  addButtons.forEach((button) => {
    const { name } = readCard(button);
    const full = countOf(name) >= MAX_PER_PRODUCT;
    button.disabled = full;
    button.textContent = full ? "Limit reached" : "Add to Cart";
  });
}

// Add to Cart
addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = readCard(button);
    if (countOf(product.name) >= MAX_PER_PRODUCT) return;
    cart.push(product);
    render();
  });
});

// Remove (one listener on the list handles every Remove button)
list.addEventListener("click", (event) => {
  const button = event.target.closest(".mini-cart-remove");
  if (!button) return;
  cart.splice(Number(button.dataset.index), 1);
  render();
});

// Cart icon opens / closes the panel
toggleLink.addEventListener("click", (event) => {
  event.preventDefault();                    // stay on the page
  const open = miniCart.hidden;              // hidden now -> open it
  miniCart.hidden = !open;
  toggleLink.setAttribute("aria-expanded", String(open));
});

render();