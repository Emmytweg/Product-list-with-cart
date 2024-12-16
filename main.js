const cartItems = [];
const cartItemsList = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const itemCount =   document.getElementById('itemCount')
const finalCart = document.querySelector('.final-cart')
const orderConfirmedBtn = document.querySelector('#confirm-order')
const confirmProductFinalPrice = document.querySelector('#confirmProductFinalPrice')
const popoutCard = document.querySelector('.popout-card')
const container = document.querySelector('.container')
const startNewOrderBtn = document.querySelector('.new-order-btn')
function updatCartHeader() {
  const totalItems = cartItems.reduce((sum,item) => sum + item.quantity, 0)
  itemCount.textContent = totalItems
}
function updateCart() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add('first-product-display')
    listItem.innerHTML = `
    <div> 
     <p id="productName">
                        
 ${item.name}</p>
                         <div class="price-display">
 <div class="one-time">
<span>${item.quantity}x</span>
 </div>

<div class='two-price'>
   @<span>$${item.price} </span> 
 </div>
  <div class="next-price" >
   <span id="productPrice">$${(item.price * item.quantity).toFixed(2)}</span>

</div>
      </div>             
               </div>
    </div>
                 

         <button class="first-product-cancel" data-name='${item.name}' >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#BAB5B2" viewBox="0 0 10 10"><path fill="#BAB5B2" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                 </button> 
    `;
    cartItemsList.append(listItem);
    total += item.price * item.quantity;
    console.log(item.dataImg)
  });

  totalPriceElement.textContent = `$${total.toFixed(2)}`;
  updatCartHeader()
}
orderConfirmedBtn.addEventListener('click', () => {
  container.classList.toggle('blur')
  container.classList.toggle('hide')
  let total = 0
  popoutCard.style.display = 'flex'
  //Populate the popup form
finalCart.innerHTML= ''

cartItems.forEach(item => {
const lastCart = document.createElement('div')
lastCart.innerHTML = `
<div class='orderSummary'>
      <div class="orderSummaryInner">
        <div class='finalCartHeader'>
          <img src='${item.dataImg}' />
          <div > 
          <span> ${item.name} </span>
          <div>
            <span>x${item.quantity} </span>
              <span>  @$${item.price} </span> 
          </div>
          
          </div>
  
        </div>
        <div class="productPrice">
          <span >$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
           

 
        
        
        </div>
      
      </div>

`
finalCart.appendChild(lastCart)
total += item.price * item.quantity;

})
confirmProductFinalPrice.textContent = `$${total.toFixed(2)}`;

})
function updateButtonControls(card, quantity) {
  const actionsDiv = card.querySelector(".actions");
  actionsDiv.innerHTML = `
    <div class="quantity-controls">
      <button class="decrement" data-id="${card.getAttribute("data-id")}">
      <svg class='my-svg' xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"  ><path class='my-path' fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
      </button>

      <span>${quantity}</span>
      <button class="increment" data-id="${card.getAttribute("data-id")}">
      <svg class='my-svg' xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="#fff" viewBox="0 0 10 10"><path class='my-path' fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
      </button>
    </div>
  `;
  itemCount.innerHTML = quantity
}

function addToCart(card, name, price, dataImg) {
  const existingItem = cartItems.find((item) => item.name === name);
  console.log(dataImg)

  if (existingItem) {
    existingItem.quantity += 1;
    updateButtonControls(card, existingItem.quantity);
    document.querySelector('.cart-total').style.display = 'none'
  } else {
    cartItems.push({ name, price: parseFloat(price), quantity: 1,dataImg  });
     document.querySelector('.cart-total').style.display = 'block'
     orderConfirmedBtn.style.display= 'block'
     document.querySelector('.carbon').style.display= 'flex'
      document.querySelector('.empty-cart').style.display= 'none'
    updateButtonControls(card, 1);
  }
    updateCart();
}
startNewOrderBtn.addEventListener('click', resetCart)
function resetCart(){
  popoutCard.style.display = 'none'
  container.classList.toggle('no-blur')
  cartItems.length = 0
  location.reload()
  alert('Please Reload This Page To Perform a new Operation')
  updateCart()
}
// function to remove products
function removeFromCart( name) {
    const itemIndex = cartItems.findIndex((item) => item.name === name)
    if (itemIndex !== -1) {
        const removedItem = cartItems[itemIndex]
        cartItems.splice(itemIndex , 1)
        
        const card = document.querySelector(`.product-card[data-id="${removedItem.name}"]`)
        if (card) {
            card.querySelector('.actions').innerHTML = `
            <button class='add-to-cart' data-name='${removedItem.name}' data-price='${removedItem.price}'> Add To Cart<button>
            `

        }
    }
    console.log('works')

     updateCart()
    }


// Event listener for Add to Cart buttons
document.querySelectorAll(".product-card").forEach((card) => {
  const addButton = card.querySelector(".add-to-cart");
  addButton.addEventListener("click", () => {
    const name = addButton.getAttribute("data-name");
    const price = addButton.getAttribute("data-price");
    // const imageMain  = document.getElementById('#mealImage')

    const itemCount =   document.getElementById('itemCount')
    const dataImg = addButton.getAttribute('data-img')
    if (dataImg) {
      console.log('Image source', dataImg)
      addToCart(card, name, price, dataImg)
    }else{
      console.error('Image not found for', name)
    }
  });
});

// Event delegation for Increment and Decrement buttons
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("increment")) {
    const container = event.target.closest('.product-card-con')
    const card = container.querySelector('.product-card');
    const cardId = card ? card.getAttribute("data-id") : null;
    const name = container.querySelector("h3").textContent;
    const dataImg = container.dataset.img

    const item = cartItems.find((item) => item.name === name);
if (!cardId) {
    console.log('card not found')
    return
}

    if (item) {
        item.quantity += 1;
    updateButtonControls(card, item.quantity);
    updateCart();
    }
  } else if (event.target.classList.contains("decrement")) {
    const container = event.target.closest('.product-card-con')
    const card = container.querySelector('.product-card');

    const cardId = card ? card.getAttribute("data-id") : null;
    const name = container.querySelector("h3").textContent;
    const item = cartItems.find((item) => item.name === name);
    if (!cardId) {
        console.log('card not found')
        return
    }
    if (item) {
     if (item.quantity > 1) {
        item.quantity -= 1;
        updateButtonControls(card, item.quantity);
      }  else {
          removeFromCart(name)
      
      }
      updateCart()
     }
   
    
  }else if(event.target.classList.contains("first-product-cancel")){
const name =  event.target.getAttribute('data-name')
removeFromCart(name)
  }

});
