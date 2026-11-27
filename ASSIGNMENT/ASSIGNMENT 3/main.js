

const grid = document.querySelector("#deals-grid");
let products = [];

// Build the HTML for one product card
// The links carry the product id:  product.html?id=3
function makeCard(p) {
  let oldPrice = "";
  if (p.oldPrice) {
    oldPrice = '<span class="deal-old">' + formatMoney(p.oldPrice) + "</span>";
  }

  return `
    <div class="col"><div class="deal-card">
      <div class="deal-image">
        <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        <button class="deal-heart" type="button" aria-label="Add to watchlist"><i class="bi bi-heart"></i></button>
      </div>
      <h3 class="deal-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="deal-price">
        <span class="deal-current">${formatMoney(p.price)}</span>
        ${oldPrice}
      </p>
      <button class="btn btn-dark rounded-pill deal-cart-btn" data-id="${p.id}" type="button">Add to Cart</button>
    </div></div>`;
}

// Fetch the JSON file and draw the cards
async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    products = await response.json();
    grid.innerHTML = products.map(makeCard).join("");
  } catch (error) {
    grid.innerHTML = '<p class="text-danger">Could not load products. Open the site with a local server (e.g. VS Code Live Server).</p>';
    console.error(error);
  }
}

// One click listener for ALL "Add to Cart" buttons
grid.addEventListener("click", function (e) {
  const button = e.target.closest(".deal-cart-btn");
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find(function (p) {
    return p.id === id;
  });
  if (!product) return;

  addToCart(product, 1);

  button.textContent = "Added ✓";
  setTimeout(function () {
    button.textContent = "Add to Cart";
  }, 900);
});

loadProducts();