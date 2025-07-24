document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const imagesContainer = document.getElementById("order-images");
  const totalEl = document.querySelector(".total-amount");
  const dateEl = document.getElementById("order-date");
  const codeEl = document.getElementById("order-code");

  if (!cart.length || !imagesContainer || !totalEl || !dateEl || !codeEl) return;

  //  Generate and show random order code 
  codeEl.textContent = generateOrderCode();

  // Render product images
  imagesContainer.innerHTML = "";
  cart.forEach(item => {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.style.width = "60px";
    img.classList.add("rounded");
    imagesContainer.appendChild(img);
  });

  // Calculate total
  let total = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price.replace("$", ""));
    return sum + price * quantity;
  }, 0);

  // Apply discount if available
  const discountPercent = parseFloat(localStorage.getItem("discountPercent"));
  if (!isNaN(discountPercent) && discountPercent > 0) {
    total = total * (1 - discountPercent / 100);
  }

  const savedTotal = localStorage.getItem("finalTotal");
if (savedTotal) {
  totalEl.textContent = `$${savedTotal}`;
} else {
  totalEl.textContent = `$${total.toFixed(2)}`;
}


  // Show today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  dateEl.textContent = formattedDate;
});

// Generates a random order code like #AB12_X9TZ
function generateOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomPart = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `#${randomPart()}_${randomPart()}`;
}
// Clear cart and discount AFTER showing the order
setTimeout(() => {
  localStorage.removeItem("cart");
  localStorage.removeItem("discountPercent");
}, 1000);


