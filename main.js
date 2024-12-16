const cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const confirmOrderButton = document.querySelector('.confirm-order');
const modal = document.querySelector('.order-confirmation-modal');
const modalOrderSummary = document.querySelector('.order-summary');
const modalOrderTotal = document.querySelector('.order-total');
const closeModalButton = document.querySelector('.close-modal');
const startNewOrderButton = document.querySelector('.start-new-order');

// Function to update cart UI
function updateCart() {
  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.name} x ${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`;
    cartItemsContainer.appendChild(div);
  });
}

// Show the modal when "Confirm Order" is clicked
confirmOrderButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Populate modal with cart items
  modalOrderSummary.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.innerHTML = `
    <img src='${item.img}' />
      <span>${item.name} x ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    modalOrderSummary.appendChild(div);  
  });

  modalOrderTotal.textContent = `$${total.toFixed(2)}`;

  // Show the modal
  modal.classList.remove('hidden');
});

// Close modal and reset cart
closeModalButton.addEventListener('click', resetCart);
startNewOrderButton.addEventListener('click', resetCart);

function resetCart() {
  // Hide modal
  modal.classList.add('hidden');

  // Clear the cart array
  cart.length = 0;

  // Update the cart UI
  updateCart();
}

// Add to cart functionality
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    const productCard = e.target.closest('.product-card');
    const name = productCard.querySelector('h3').textContent;
    const price = parseFloat(productCard.querySelector('p').textContent.slice(1)); // Remove $ sign
    const img = productCard.dataset.img;

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }
    updateCart();
  }
});
