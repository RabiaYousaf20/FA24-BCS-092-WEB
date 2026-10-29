# Midterm – Web Technologies

- **Name:** Rabia Yousaf
- **Roll number:** FA24-BCS-092
- **N:** 92
- **BP (breakpoint):** 1200px
- **H:** 
- **K:** 4

## Files changed

- `midterm/ASSIGNMENT 2/index.html`
- `midterm/ASSIGNMENT 2/product.html`
- `midterm/ASSIGNMENT 2/style.css`
- `midterm/checkout.html`
- `midterm/ASSIGNMENT 2/script.js`
- `midterm/README.md`
- `midterm/FA24-BCS-092-midterm.pdf`

## Task 1 – Mega-menu in the navbar
Added a "Shop by Category" item (in `index.html`, `product.html`, `style.css`).
On wide screens the panel opens on `:hover` and `:focus-within` with K = 4
columns, each with a heading and a list of 5 links, so it works with Tab alone and
no JavaScript. The panel is absolutely positioned with a high `z-index`, so it
covers the page without pushing content down. Below BP, the same groups appear
as a `<details>`/`<summary>` accordion inside the hamburger menu, closed by default.

## Task 2 – Checkout form (HTML5 validation only)
Created `checkout.html`, linked from the cart icon. It has two fieldsets
("Contact" and "Delivery"), each input with a `<label for>`, a phone `pattern`
of `03[0-9]{2}-[0-9]{7}`, and date `min`/`max` for the exam-date window.
Errors use `:user-invalid`, so red borders and messages appear only after the
user interacts. CSS Grid puts the fieldsets side by side from BP up, with
labels in a left column, and in one column below BP. The submit button is
full width.

## Task 3 – Cart badge and mini cart (JavaScript)
Added `script.js` (linked in `index.html`). "Add to Cart" reads the name and
price from the card and pushes them into an array. The navbar cart icon shows
a badge with the item count. Clicking the icon toggles a mini-cart panel
listing items with Remove buttons and a total calculated with `reduce()`.
Each product can be added at most (N mod 4) + 2 = 2 times, after which its
button shows "Limit reached" and is disabled until one is removed.

