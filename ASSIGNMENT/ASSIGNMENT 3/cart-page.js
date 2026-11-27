// cart-page.js - used only by cart.html
// (cart.js is loaded first, so getCart(), setQty(), removeItem(), getTotal() ... are available)

const cartList = document.querySelector("#cart-items");
const totalEl = document.querySelector("#cart-total");

/* ---------- 1. Draw the cart from the array ---------- */
function render() {
  const items = getCart();

  if (items.length === 0) {
    cartList.innerHTML =
      '<p>Your cart is empty. <a href="index.html#deals">Continue shopping</a></p>';
  } else {
    // map: turn every cart item into one row of HTML
    cartList.innerHTML = items
      .map(item => `
        <div class="cart-row">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-info">${item.name}<br><strong>${formatMoney(item.price)}</strong></div>
          <input type="number" min="1" max="99" value="${item.qty}" data-id="${item.id}"
                 class="form-control qty-input" aria-label="Quantity">
          <span class="line-total">${formatMoney(item.price * item.qty)}</span>
          <button class="btn btn-outline-danger btn-sm" data-remove="${item.id}" type="button">Remove</button>
        </div>`)
      .join("");
  }

  // running total (calculated with reduce inside getTotal)
  totalEl.textContent = formatMoney(getTotal());
}

/* ---------- 2. Change quantity / remove an item ---------- */
cartList.addEventListener("change", e => {
  if (e.target.matches(".qty-input")) {
    setQty(Number(e.target.dataset.id), e.target.value);
    render();
  }
});

cartList.addEventListener("click", e => {
  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeItem(Number(removeBtn.dataset.remove));
    render();
  }
});

/* ---------- 3. Checkout form validation (regular expressions) ---------- */
const rules = {
  name: {
    re: /^[A-Za-z][A-Za-z\s'.-]{1,49}$/,
    msg: "Enter your full name (letters only, 2–50 characters)."
  },
  email: {
    re: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
    msg: "Enter a valid email, e.g. name@example.com."
  },
  phone: {
    // spaces and dashes are removed first, then 10–15 digits (optional + or 00 at the start)
    clean: value => value.replace(/[\s-]/g, ""),
    re: /^(\+|00)?\d{10,15}$/,
    msg: "Enter a valid phone number (10–15 digits, e.g. +92 300 1234567)."
  },
  address: {
    re: /^[\w\s,.#'/-]{10,120}$/,
    msg: "Enter a full address (at least 10 characters)."
  }
};

// Check ONE field, show/hide its error message, return true/false
function validateField(field) {
  const input = document.querySelector("#" + field);
  const rule = rules[field];

  let value = input.value.trim();
  if (rule.clean) value = rule.clean(value);

  const ok = rule.re.test(value);
  input.classList.toggle("is-invalid", !ok);   // red border + message
  input.classList.toggle("is-valid", ok);      // green border
  input.nextElementSibling.textContent = ok ? "" : rule.msg;
  return ok;
}

const checkoutForm = document.querySelector("#checkout-form");
const successMsg = document.querySelector("#form-success");

// Check a field when the user leaves it, and re-check while typing
// once it is already showing an error (so the error disappears as soon as it is fixed)
Object.keys(rules).forEach(field => {
  const input = document.querySelector("#" + field);
  input.addEventListener("blur", () => validateField(field));
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) validateField(field);
  });
});

checkoutForm.addEventListener("submit", e => {
  e.preventDefault();               // never let the browser submit by itself
  successMsg.textContent = "";

  // validate EVERY field (map, not a loop that stops early) so all errors show together
  const results = Object.keys(rules).map(validateField);
  if (!results.every(Boolean)) return;    // any invalid field -> submission blocked

  if (getCart().length === 0) {
    successMsg.textContent = "Your cart is empty.";
    return;
  }

  successMsg.textContent = "Order placed. Thank you!";
  clearCart();
  checkoutForm.reset();
  checkoutForm.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));
  render();
});

render();