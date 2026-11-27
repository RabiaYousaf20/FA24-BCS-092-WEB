# Assignment 3 – Making It Interactive: Cart, Validation, and Live Data

An eBay-style shopping site built with **plain JavaScript** (no framework). It takes the static pages from Assignment 2 and makes them work: a real cart, a cart page, a validated checkout form, and product data loaded from a JSON file.

**Student:** Rabia Yousaf
**University:** COMSATS University Islamabad, Lahore Campus
**Course:** Web Technologies (CSC336)
**Covers:** Lectures 11–15 (Core JavaScript ES6+, array methods, regular expressions, Async JavaScript, Promises and Fetch)

---

## Features

### 1. Add to Cart
- Every product has an **Add to Cart** button (home page cards and the featured product page).
- The red number next to the cart icon in the header updates immediately.
- The cart is an in-memory array and is also saved in `localStorage`, so it is kept when moving between pages.
- Adding the same product again increases its quantity (no duplicate rows).

### 2. Cart page (`cart.html`)
- Lists every item in the cart with image, name, price, quantity box and line total.
- Change the quantity or press **Remove**. The list, the running total and the header badge all update.
- Everything is calculated and re-rendered by JavaScript using array methods:

| Method | Used for |
|---|---|
| `map` | Building the HTML rows; changing one item's quantity |
| `filter` | Removing an item |
| `reduce` | Running total (price × quantity) and header item count |
| `find` | Checking if a product is already in the cart |

### 3. Checkout form with regex validation
Name, email, phone and address are checked with regular expressions. Invalid input shows a clear error message and **blocks submission**.

| Field | Rule |
|---|---|
| Name | Letters, spaces, `. ' -` only, 2–50 characters |
| Email | Standard format, e.g. `name@example.com` |
| Phone | 10–15 digits, optional `+` or `00` at the start (spaces and dashes are ignored), e.g. `+92 300 1234567` |
| Address | 10–120 characters |

All fields are validated together on submit, so every error shows at once. A valid order clears the cart and shows "Order placed. Thank you!".

### 4. Products loaded with Fetch
- Products live in `products.json`, not in the HTML.
- `main.js` fetches the file when the page loads (`async` / `await`, with `try` / `catch`) and builds the product grid from it.
- Change a price in `products.json`, refresh, and the card changes.

---

## Project structure

```
assignment-3/
├── index.html        Home page (empty #deals-grid filled by main.js)
├── product.html      Featured product page
├── cart.html         Cart + checkout form
├── products.json     Product data
├── cart.js           Shared cart logic (used by every page)
├── main.js           Home page: fetch products, render cards, Add to Cart
├── product.js        Product page: fetch product, Add to Cart with quantity
├── cart-page.js      Cart page: render, quantity/remove, form validation
├── style.css         Styling
└── assets/           Images
```

### Script order matters
`cart.js` must be loaded **before** the page's own script:

```html
<script src="cart.js"></script>
<script src="main.js"></script>   <!-- index.html -->
```

---

## How to run

The site uses `fetch()`, so it must be opened through a local web server. Opening the HTML file by double-click will **not** load the products (browsers block `fetch` on `file://`).

**Option 1 – Python**
```bash
cd assignment-3
python -m http.server 5500
```
Then open <http://localhost:5500/index.html>.

**Option 2 – VS Code Live Server**
Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**.

---

## How to test

1. **Products from JSON:** the home page shows 9 deals. Edit a `price` in `products.json`, refresh, and the card shows the new price.
2. **Add to Cart:** click Add to Cart on a few products. The header badge goes up each time. Open `product.html`, set a quantity and add it too.
3. **Cart page:** click the cart icon. Change a quantity and watch the line total, the Total and the badge update. Press Remove on an item. Remove everything to see the empty-cart message.
4. **Validation:** with items in the cart, try invalid values:
   - Email `abc` or `abc@mail` → error, order blocked
   - Phone `123` or `abc12345678` → error, order blocked
   - Address `short` → error, order blocked
   - Leave everything empty and press Place order → all four errors appear
5. **Successful order:** enter valid data (for example `Rabia Yousaf`, `rabia@example.com`, `+92 300 1234567`, `House 5, Street 2, Lahore`) and press Place order. The success message appears and the cart is emptied.

To reset the cart manually: browser DevTools → Application → Local Storage → delete the `cart` key.

---

## Technologies

- HTML5, CSS3
- Bootstrap 5.3 and Bootstrap Icons (CDN)
- JavaScript (ES6+): arrow functions, template literals, spread syntax, `async` / `await`, Fetch API, array methods, regular expressions, `localStorage`

---

## Notes

- The cart is stored in the browser (`localStorage`) only. There is no backend, so "Place order" does not send data anywhere.
- Product images are in `assets/`.
