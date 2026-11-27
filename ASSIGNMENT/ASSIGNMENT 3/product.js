

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id")) || 9;   // no id in the URL -> featured product (9)

const addBtn = document.querySelector(".product-cart-btn");
const qtyInput = document.querySelector("#quantity");
let currentProduct = null;

// Put one product's data into the page
function showProduct(product) {
  document.title = "eBay Product - " + product.name;

  const image = document.querySelector("#product-image");
  image.src = product.image;
  image.alt = product.name;

  document.querySelector("#product-category").textContent = "Product \u00B7 " + product.category;
  document.querySelector("#breadcrumb-category").textContent = product.category;
  document.querySelector("#product-heading").textContent = product.name;
  document.querySelector("#price-current").textContent = formatMoney(product.price);

  // old price + savings are shown only when the product has an oldPrice
  const oldEl = document.querySelector("#price-old");
  const saveEl = document.querySelector("#price-save");
  if (product.oldPrice) {
    const saved = product.oldPrice - product.price;
    const percent = Math.round((saved / product.oldPrice) * 100);
    oldEl.textContent = formatMoney(product.oldPrice);
    saveEl.textContent = "You save " + formatMoney(saved) + " (" + percent + "%)";
  } else {
    oldEl.textContent = "";
    saveEl.textContent = "";
  }

  document.querySelector("#product-description").textContent = product.description;

  document.querySelector("#product-specs").innerHTML = `
    <dt class="col-5 col-md-3">Category</dt><dd class="col-7 col-md-9">${product.category}</dd>
    <dt class="col-5 col-md-3">Item number</dt><dd class="col-7 col-md-9">${product.id}</dd>
    <dt class="col-5 col-md-3">Price</dt><dd class="col-7 col-md-9">${formatMoney(product.price)}</dd>`;
}

// "More deals" at the bottom: 4 OTHER products, each linking to its own page
function showRelated(products) {
  const others = products.filter(p => p.id !== productId).slice(0, 4);

  document.querySelector("#related-grid").innerHTML = others
    .map(p => `
      <div class="col"><div class="deal-card">
        <div class="deal-image">
          <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" /></a>
        </div>
        <h3 class="deal-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <p class="deal-price">
          <span class="deal-current">${formatMoney(p.price)}</span>
          ${p.oldPrice ? '<span class="deal-old">' + formatMoney(p.oldPrice) + "</span>" : ""}
        </p>
        <a class="btn btn-dark rounded-pill deal-cart-btn" href="product.html?id=${p.id}">View deal</a>
      </div></div>`)
    .join("");
}

// Load products.json (Fetch API) and show the product that matches the URL
async function loadProduct() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const products = await response.json();

    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) {
      document.querySelector("#product-heading").textContent = "Product not found";
      document.querySelector("#product-description").textContent =
        "Sorry, this product does not exist. Go back to the deals and pick another one.";
      return;
    }

    showProduct(currentProduct);
    showRelated(products);
  } catch (error) {
    document.querySelector("#product-heading").textContent = "Could not load the product";
    console.error(error);
  }
}

addBtn.addEventListener("click", () => {
  if (!currentProduct) return;

  // read the quantity box, keep it between 1 and 10
  const qty = Math.min(10, Math.max(1, parseInt(qtyInput.value, 10) || 1));
  addToCart(currentProduct, qty);

  addBtn.innerHTML = '<i class="bi bi-check2 me-2"></i>Added';
  setTimeout(() => {
    addBtn.innerHTML = '<i class="bi bi-cart3 me-2"></i>Add to Cart';
  }, 900);
});

loadProduct();