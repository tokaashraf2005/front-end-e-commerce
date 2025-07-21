document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const imagesContainer = document.getElementById("order-images");
  const totalEl = document.querySelector(".total-amount");
  const dateEl = document.getElementById("order-date");

  if (!cart.length || !imagesContainer || !totalEl || !dateEl) return;

  // Clear existing images
  imagesContainer.innerHTML = "";

  // Render product images
  cart.forEach(item => {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.style.width = "60px";
    img.classList.add("rounded");
    imagesContainer.appendChild(img);
  });

  // Calculate and update total
  const total = cart.reduce((sum, item) => {
    return sum + parseFloat(item.price.replace("$", "")) * item.quantity;
  }, 0);

  totalEl.textContent = `$${total.toFixed(2)}`;

  // Set today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});
