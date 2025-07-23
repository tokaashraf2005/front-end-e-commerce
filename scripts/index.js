document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (path, containerId, callback) =>
    fetch(path)
      .then(res => res.text())
      .then(html => {
        document.getElementById(containerId).innerHTML = html;
        if (typeof callback === "function") setTimeout(callback, 50);
      })
      .catch(console.error);

  loadComponent("../components/navbar.html", "navbar-container", () => {
    initializeBootstrapComponents();
    initializeNavbarFunctionality();
  });

  loadComponent("../components/newsletter.html", "newsletter-container");
  loadComponent("../components/footer.html", "footer-container");
});

// ------------------- INIT FUNCTIONS -------------------
function initializeNavbarFunctionality() {
  console.log("Initializing navbar...");
  [
    initializeDiscountBar,
    initializeSearchBox,
    initializeCartBadge,
    initializeActiveLinks,
    initializeSmoothScrolling,
    initializeCartFunctionality
  ].forEach(fn => fn?.());
  console.log("Navbar initialized");
}

function initializeBootstrapComponents() {
  const components = [
    { selector: '[data-bs-toggle="tooltip"]', method: bootstrap.Tooltip },
    { selector: '.dropdown-toggle', method: bootstrap.Dropdown }
  ];

  components.forEach(({ selector, method }) => {
    document.querySelectorAll(selector).forEach(el => {
      try {
        method.getOrCreateInstance(el);
      } catch (err) {
        console.error(`${method.name} init error:`, err);
      }
    });
  });

  console.log("Bootstrap components initialized");
}

// ------------------- NAVBAR FEATURES  -------------------
function initializeDiscountBar() {
  document.getElementById("close")?.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("discount-bar")?.classList.add("d-none");
  });
}

function initializeSearchBox() {
  const toggle = document.getElementById("search-toggle");
  const box = document.getElementById("search-box");

  if (!toggle || !box) return;

  toggle.addEventListener("click", e => {
    e.preventDefault();
    box.classList.toggle("d-none");
  });

  document.addEventListener("click", e => {
    if (!toggle.contains(e.target) && !box.contains(e.target)) {
      box.classList.add("d-none");
    }
  });
}

function initializeCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartBadge(totalItems);
}

function updateCartBadge(count) {
  localStorage.setItem("cartCount", count);
  document.querySelectorAll(".cart-badge").forEach(badge => {
    badge.textContent = count;
    badge.style.display = "block";
  });
}
window.updateCartBadge = updateCartBadge;

function initializeActiveLinks() {
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    const href = link.getAttribute("href")?.split("/").pop();
    const isActive = href === current;

    link.classList.toggle("active", isActive);
    link.classList.toggle("fw-bolder", isActive);
    link.classList.toggle("text-dark", isActive);
    link.classList.toggle("text-secondary", !isActive);
    link.classList.toggle("fw-medium", !isActive);
  });
}

function initializeSmoothScrolling() {
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

// ------------------- CART FUNCTIONALITY -------------------
function initializeCartFunctionality() {
  const cartSidebar = document.querySelector("#cartSidebar .offcanvas-body");
  const emptyMsg = cartSidebar?.querySelector(".empty-msg");
  const subtotalEl = cartSidebar?.querySelector(".subtotal span:last-child");
  const totalEl = cartSidebar?.querySelector(".total strong:last-child");
  const addButtons = document.querySelectorAll(".add-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const saveAndUpdate = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartSidebarUI();
    updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  const updateCartSidebarUI = () => {
    cartSidebar?.querySelectorAll(".cart-item").forEach(el => el.remove());

    if (cart.length > 0 && emptyMsg) emptyMsg.style.display = "none";

    let subtotal = 0;

    cart.forEach((product, i) => {
      const price = parseFloat(product.price.replace("$", ""));
      subtotal += price * product.quantity;

      const item = document.createElement("div");
      item.className = "cart-item d-flex align-items-center justify-content-between mb-3";
      item.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${product.image}" alt="${product.name}" class="me-2" style="width: 50px; height: 50px; object-fit: cover;">
          <div>
            <div class="fw-bold">${product.name}</div>
            <div class="text-muted">${product.price}</div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-dark me-1 decrease" data-index="${i}">−</button>
          <span>${product.quantity}</span>
          <button class="btn btn-sm btn-outline-dark ms-1 increase" data-index="${i}">+</button>
        </div>
      `;
      cartSidebar?.insertBefore(item, cartSidebar.querySelector(".cart-summary"));
    });

    subtotalEl.textContent = totalEl.textContent = `$${subtotal.toFixed(2)}`;

    cartSidebar.querySelectorAll(".increase").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = +btn.dataset.index;
        cart[i].quantity++;
        saveAndUpdate();
      })
    );

    cartSidebar.querySelectorAll(".decrease").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = +btn.dataset.index;
        cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
        saveAndUpdate();
      })
    );
  };

  const handleAddToCart = button => {
    const card = button.closest(".category-card");
    if (!card) return;

    const name = card.querySelector(".product-name")?.textContent || "Unknown Product";
    const price = card.querySelector(".price")?.childNodes[0]?.textContent.trim() || "$0.00";
    const image = card.querySelector("img")?.src || "";

    const existing = cart.find(p => p.name === name);
    if (existing) {
      existing.quantity++;
      alert(`Added another ${name} to cart.`);
    } else {
      cart.push({ name, price, image, quantity: 1 });
      alert(`${name} added to cart!`);
    }

    saveAndUpdate();
  };

  addButtons.forEach(button => button.addEventListener("click", () => handleAddToCart(button)));

  updateCartSidebarUI();
  updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));
}
