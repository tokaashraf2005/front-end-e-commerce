document.addEventListener("DOMContentLoaded", () => {
  // Add-to-Cart Button 
  const addToCartButtons = document.querySelectorAll(".add-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".category-card");
      const name = card.querySelector(".product-name").textContent.trim();
      const price = card.querySelector(".price").textContent.trim().split(" ")[0];
      const image = card.querySelector("img").src;
      const color = colorMatch ? colorMatch[0].charAt(0).toUpperCase() + colorMatch[0].slice(1) : "Default";

      const newItem = {
        name,
        price,
        image,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingIndex = cart.findIndex(
        (item) => item.name === newItem.name && item.color === newItem.color
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart badge
      updateCartBadge();

      // Feedback
      button.textContent = "✓ Added!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add to cart";
        button.disabled = false;
      }, 1000);
    });
  });
  // Cart Badge Update
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector(".badge");
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? "inline-block" : "none";
    }
  }

  // Cart Rendering 

  const cartContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.querySelector(".empty-cart-state");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const subtotalEl = document.getElementById("subtotal-amount");
  const totalEl = document.getElementById("total-amount");

  if (cartContainer) renderCart();

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      document.querySelector(".cart-table-container").style.display = "none";
      document.querySelector(".coupon-section").style.display = "none";
      subtotalEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
      return;
    }

    emptyCartMessage.style.display = "none";
    document.querySelector(".cart-table-container").style.display = "block";
    document.querySelector(".coupon-section").style.display = "block";

    cart.forEach((item, index) => {
      const price = parseFloat(item.price.replace("$", ""));
      const quantity = item.quantity || 1;
      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      const itemRow = document.createElement("tr");

      itemRow.innerHTML = `
        <td>
          <div class="cart-item-container">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <button class="remove-btn" data-index="${index}">✕ Remove</button>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="quantity-controls">
            <button class="quantity-btn" data-action="decrease" data-index="${index}">−</button>
            <span class="quantity-display">${quantity}</span>
            <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
          </div>
        </td>
        <td class="text-end price-cell">$${price.toFixed(2)}</td>
        <td class="text-end subtotal-cell">$${itemSubtotal.toFixed(2)}</td>
      `;

      cartContainer.appendChild(itemRow);
    });

    updateTotal(subtotal);
    setupCartEventListeners(cart);
  }

  function updateTotal(subtotal) {
    let shippingCost = 0;
    const selectedShipping = document.querySelector(".shipping-radio:checked");
    if (selectedShipping) {
      shippingCost = parseFloat(selectedShipping.value);
    }

    const total = subtotal + shippingCost;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  function setupCartEventListeners(cart) {
    // Remove button 
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartBadge();
      });
    });

    // Quantity button 
    document.querySelectorAll(".quantity-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;

        if (action === "increase") {
          cart[index].quantity += 1;
        } else if (action === "decrease" && cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartBadge();
      });
    });
  }

  // shipping option changes
  document.querySelectorAll(".shipping-radio").forEach(option => {
    option.addEventListener("change", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace("$", ""));
        return sum + (price * item.quantity);
      }, 0);
      updateTotal(subtotal);
    });
  });

  // Checkout button functionality
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      // Redirect to checkout page 
      alert("Proceeding to checkout...");
    });
  }

  // Initialize cart badge on page load
  updateCartBadge();
});

