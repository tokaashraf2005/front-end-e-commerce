document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderList = document.getElementById("checkout-order-list");

  if (!orderList) return;

  if (cart.length === 0) {
    orderList.innerHTML = `<p class="text-muted">No products in cart.</p>`;
    return;
  }

  // Utility: Update totals
  const updateTotals = () => {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = updatedCart.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.price.replace("$", ""));
      return sum + price * quantity;
    }, 0);

    document.querySelectorAll(".subtotal-amount, .total-amount").forEach(el => {
      el.textContent = `$${total.toFixed(2)}`;
    });
  };

  // Render cart items
  cart.forEach(item => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price.replace("$", ""));
    const totalPrice = (price * quantity).toFixed(2);

    const itemWrapper = document.createElement("div");
    itemWrapper.className = "d-flex align-items-center mb-4 pb-3 border-bottom";
    itemWrapper.innerHTML = `
      <img src="${item.image}" class="rounded me-3" style="width: 60px;" />
      <div class="flex-grow-1">
        <h6 class="mb-1">${item.name}</h6>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary btn-sm px-2 py-1 btn-decrease" data-name="${item.name}">-</button>
          <span class="mx-2 small quantity">${quantity}</span>
          <button class="btn btn-outline-secondary btn-sm px-2 py-1 btn-increase" data-name="${item.name}">+</button>
        </div>
      </div>
      <div class="fw-semibold price" data-price="${price}">$${totalPrice}</div>
    `;

    orderList.appendChild(itemWrapper);
  });

  // Handle increase
  document.querySelectorAll(".btn-increase").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.forEach(item => {
        if (item.name === name) {
          item.quantity = (item.quantity || 1) + 1;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      const quantityEl = button.previousElementSibling;
      const newQuantity = parseInt(quantityEl.textContent) + 1;
      quantityEl.textContent = newQuantity;

      const priceEl = button.closest(".d-flex").nextElementSibling;
      const unitPrice = parseFloat(priceEl.getAttribute("data-price"));
      priceEl.textContent = `$${(unitPrice * newQuantity).toFixed(2)}`;

      updateTotals();
    });
  });

  // Handle decrease
  document.querySelectorAll(".btn-decrease").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.forEach(item => {
        if (item.name === name) {
          item.quantity = Math.max((item.quantity || 1) - 1, 1);
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      const quantityEl = button.nextElementSibling;
      const currentQuantity = parseInt(quantityEl.textContent);
      const newQuantity = Math.max(currentQuantity - 1, 1);
      quantityEl.textContent = newQuantity;

      const priceEl = button.closest(".d-flex").nextElementSibling;
      const unitPrice = parseFloat(priceEl.getAttribute("data-price"));
      priceEl.textContent = `$${(unitPrice * newQuantity).toFixed(2)}`;

      updateTotals();
    });
  });

  updateTotals(); // Initial update
});


