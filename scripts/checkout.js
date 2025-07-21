document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderList = document.getElementById("checkout-order-list");

  if (!orderList) return;

  if (cart.length === 0) {
    orderList.innerHTML = `<p class="text-muted">No products in cart.</p>`;
    return;
  }

  cart.forEach(item => {
    const itemHTML = `
      <div class="d-flex align-items-center mb-4 pb-3 border-bottom">
        <img src="${item.image}" class="rounded me-3" style="width: 60px;" />
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <p class="text-muted small mb-2">Color: ${item.color || "Default"}</p>
          <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary btn-sm px-2 py-1" disabled>-</button>
            <span class="mx-2 small">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm px-2 py-1" disabled>+</button>
          </div>
        </div>
        <div class="fw-semibold">$${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</div>
      </div>
    `;
    orderList.innerHTML += itemHTML;
  });

  const total = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace("$", "")) * item.quantity;
  }, 0);

  document.querySelectorAll(".subtotal-amount, .total-amount").forEach(el => {
    el.textContent = `$${total.toFixed(2)}`;
  });
});
