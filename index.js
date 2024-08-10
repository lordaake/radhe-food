import { menuArray } from "./data.js";

const foodItems = document.querySelector(".Food-items")
const cartItems = document.querySelector(".cart-items")
const totalPriceDiv = document.querySelector(".total-price")
const completeOrderBtn = document.querySelector(".complete-order-btn")
const payOrderBtn = document.querySelector(".pay-order-btn")
const payModal = document.querySelector(".pay-modal")
const closeBtn = document.querySelector(".close-btn")
const orderDiv = document.querySelector(".order-div")
const customerName = document.getElementById("name")

let itemHtml = "";
let cart = [];

loadCart();
renderCart();

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem("cart")

    if (savedCart) {
        cart = JSON.parse(savedCart)
    }
}

menuArray.forEach(item => {
    itemHtml +=
        `
        <div class="item-container">
            <img src=${item.img} class="food-img">
            <div class="food">
                    <h3>${item.name}</h3>
                    <p>${item.ingredients.join(', ')}</p>
                    <p>$${item.price}</p>
            </div>
            <div id=${item.id} class="cross">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                            <circle cx="25" cy="25" r="24.25" stroke="#DEDEDE" stroke-width="1.5" />
                            <line x1="15" y1="25" x2="35" y2="25" stroke="#DEDEDE" stroke-width="1.5" />
                            <line x1="25" y1="15" x2="25" y2="35" stroke="#DEDEDE" stroke-width="1.5" />
                        </svg>
            </div>
        </div>  
        `
});

foodItems.addEventListener("click", function (e) {

    if (e.target.closest(".cross")) {
        const clickedElement = e.target.closest(".cross");
        const clickedItemId = clickedElement.id;
        const clickedItem = menuArray.find(item => clickedItemId == item.id)
        addItemsToCart(clickedItem)
        renderCart()
    }
})

function addItemsToCart(item) {
    const cartItem = cart.find(function (cartItem) {
        return cartItem.id == item.id;
    })

    if (cartItem) {
        cartItem.quantity += 1
    } else {
        cart.push({ ...item, quantity: 1 })
    }

    saveCart()
}

function renderCart() {
    cartItems.innerHTML = ""

    cart.forEach(item => {
        const cartHtml = (`
            <div class="cart-item">
                <p class="item-name">${item.name} x ${item.quantity}</p>
                <button id=${item.id} class="remove-btn">Remove</button>
                <p class="item-price">$${item.price * item.quantity}</p>
            </div>
            `)

        cartItems.innerHTML += cartHtml
    })

    cartItems.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            const clickedButtonId = e.target.id
            removeItem(clickedButtonId)
            renderCart();
        })
    })

    const totalPrice = calculateTotalPrice();
    totalPriceDiv.textContent = `$${totalPrice}`
}

function removeItem(itemId) {
    const itemIndex = cart.findIndex(function (cartItem) {
        return itemId == cartItem.id
    })

    if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
    } else {
        cart.splice(itemIndex, 1);
    }
}

function calculateTotalPrice() {
    return cart.reduce(function (total, foodItem) {
        return total + (foodItem.price * foodItem.quantity)
    }, 0);
}

completeOrderBtn.addEventListener("click", function (e) {

    if (payModal.style.display !== "flex") {
        payModal.style.display = "flex";
    } else {
        payModal.style.display = "none";
    }

})

payOrderBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target === payOrderBtn) {
        cart = [];
        saveCart();
        renderCart();
        alert("Your purchase is registered!")
        payModal.style.display = "none";
        orderDiv.innerHTML = `
        <h3 class="order-successful-h3">${orderName()}, your order was successful!</h3>
        `
    }
})

function orderName() {
    return customerName.value
}

closeBtn.addEventListener("click", function (e) {
    if (e.target === closeBtn) {
        payModal.style.display = "none"
    }
})

foodItems.innerHTML = itemHtml;