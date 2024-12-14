// Global Variables
const cartItems = [];
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const itemCount = document.getElementById("itemCount");
const finalCart = document.querySelector(".final-cart");
const orderConfirmedBtn = document.querySelector("#confirm-order");
const confirmProductFinalPrice = document.querySelector("#confirmProductFinalPrice");
const popoutCard = document.querySelector(".popout-card");
const container = document.querySelector(".container");
const startNewOrderBtn = document.querySelector(".new-order-btn");

// Utility Functions
function updateCartHeader() {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  itemCount.textContent = totalItems;
}

function toggleCartUI(show) {
  document.querySelector(".cart-total").style.display = show ? "block" : "none";
  document.querySelector(".carbon").style.display = show ? "flex" : "none";
  document.querySelector(".empty-cart").style.display = show ? "none" : "block";
  orderConfirmedBtn.style.display = show ? "block" : "none";
}

// Cart Update Functions
function updateCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("first-product-display");
    listItem.innerHTML = `
      <div>
        <p id="productName">${item.name}</p>
        <div class="price-display">
          <div class="one-time"><span>${item.quantity}x</span></div>
          <div class="two-price">@<span>$${item.price}</span></div>
          <div class="next-price"><span id="productPrice">$${(item.price * item.quantity).toFixed(2)}</span></div>
        </div>
      </div>
      <button class="first-product-cancel" data-name="${item.name}">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#BAB5B2" viewBox="0 0 10 10">
          <path fill="#BAB5B2" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
        </svg>
      </button>`;
    cartItemsList.appendChild(listItem);
    total += item.price * item.quantity;
  });

  totalPriceElement.textContent = `$${total.toFixed(2)}`;
  updateCartHeader();
}

function updateButtonControls(card, quantity) {
  const actionsDiv = card.querySelector(".actions");
  actionsDiv.innerHTML = `
    <div class="quantity-controls">
      <button class="decrement" data-id="${card.getAttribute("data-id")}">-</button>
      <span>${quantity}</span>
      <button class="increment" data-id="${card.getAttribute("data-id")}">+</button>
    </div>`;
}

// Add to Cart
function addToCart(card, name, price, dataImg) {
  const existingItem = cartItems.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
    updateButtonControls(card, existingItem.quantity);
  } else {
    cartItems.push({ name, price: parseFloat(price), quantity: 1, dataImg });
    toggleCartUI(true);
    updateButtonControls(card, 1);
  }

  updateCart();
}

// Remove from Cart
function removeFromCart(name) {
  const itemIndex = cartItems.findIndex((item) => item.name === name);
  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
  }
  if (cartItems.length === 0) toggleCartUI(false);
  updateCart();
}

// Event Listeners
orderConfirmedBtn.addEventListener("click", () => {
  container.classList.add("blur");
  popoutCard.style.display = "flex";

  finalCart.innerHTML = cartItems.map((item) => `
    <div class="orderSummary">
      <div class="orderSummaryInner">
        <div class="finalCartHeader">
          <img src="${item.dataImg}" />
          <div>
            <span>${item.name}</span>
            <div><span>x${item.quantity}</span> @<span>$${item.price}</span></div>
          </div>
        </div>
        <div class="productPrice">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    </div>`).join("");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  confirmProductFinalPrice.textContent = `$${total.toFixed(2)}`;
});

startNewOrderBtn.addEventListener("click", () => {
  cartItems.length = 0;
  toggleCartUI(false);
  location.reload();
});

// Delegated Event Handling
document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("increment")) {
    const name = target.closest(".product-card-con").querySelector("h3").textContent;
    const item = cartItems.find((item) => item.name === name);
    if (item) {
      item.quantity++;
      updateCart();
    }
  } else if (target.classList.contains("decrement")) {
    const name = target.closest(".product-card-con").querySelector("h3").textContent;
    const item = cartItems.find((item) => item.name === name);
    if (item) {
      item.quantity > 1 ? item.quantity-- : removeFromCart(name);
      updateCart();
    }
  } else if (target.classList.contains("first-product-cancel")) {
    const name = target.getAttribute("data-name");
    removeFromCart(name);
  }
});

// Initialize Add to Cart Buttons
document.querySelectorAll(".product-card .add-to-cart").forEach((addButton) => {
  addButton.addEventListener("click", () => {
    const card = addButton.closest(".product-card");
    const name = addButton.getAttribute("data-name");
    const price = addButton.getAttribute("data-price");
    const dataImg = addButton.getAttribute("data-img");

    if (dataImg) {
      addToCart(card, name, price, dataImg);
    } else {
      console.error(`Image not found for ${name}`);
    }
  });
});
