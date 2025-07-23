document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (path, containerId, callback) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        document.getElementById(containerId).innerHTML = html;
        if (typeof callback === "function") setTimeout(callback, 50);
      })
      .catch(console.error);
  };

  // Load components
  loadComponent("../components/navbar.html", "navbar-container", () => {
    initializeBootstrapComponents();
    initializeNavbarFunctionality();
  });
  loadComponent("../components/newsletter.html", "newsletter-container");
  loadComponent("../components/footer.html", "footer-container");
});

// ------------------- INIT FUNCTION -------------------
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
  console.log("Navbar initialized ✅");
}

// ------------------- BOOTSTRAP -------------------
function initializeBootstrapComponents() {
  const initializers = [
    { selector: '.offcanvas', method: bootstrap.Offcanvas },
    { selector: '[data-bs-toggle="tooltip"]', method: bootstrap.Tooltip },
    { selector: '.dropdown-toggle', method: bootstrap.Dropdown }
  ];

  initializers.forEach(({ selector, method }) =>
    document.querySelectorAll(selector).forEach(el => {
      try {
        method.getOrCreateInstance(el);
      } catch (err) {
        console.error(`${method.name} init error:`, err);
      }
    })
  );

  console.log("Bootstrap components initialized");
}

// ------------------- DISCOUNT BAR -------------------
function initializeDiscountBar() {
  const closeBtn = document.getElementById("close");
  const bar = document.getElementById("discount-bar");
  closeBtn?.addEventListener("click", e => {
    e.preventDefault();
    bar?.classList.add("d-none");
  });
}

// ------------------- SEARCH BOX -------------------
function initializeSearchBox() {
  const toggle = document.getElementById("search-toggle");
  const box = document.getElementById("search-box");

  if (toggle && box) {
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
}

// ------------------- CART BADGE -------------------
const updateCartBadge = count => {
  localStorage.setItem("cartCount", count);
  document.querySelectorAll(".cart-badge").forEach(badge => {
    badge.textContent = count;
    badge.style.display = "block";
  });
};
window.updateCartBadge = updateCartBadge;

function initializeCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartBadge(totalItems);
}

// ------------------- ACTIVE LINKS -------------------
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

// ------------------- SMOOTH SCROLLING -------------------
function initializeSmoothScrolling() {
  document.querySelectorAll("a[href^='#']").forEach(anchor =>
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );
}

// ------------------- CART FUNCTIONALITY -------------------
function initializeCartFunctionality() {
  const buttons = document.querySelectorAll(".add-btn");
  const cartSidebar = document.querySelector("#cartSidebar .offcanvas-body");
  const emptyMsg = cartSidebar?.querySelector(".empty-msg");
  const subtotalEl = cartSidebar?.querySelector(".subtotal span:last-child");
  const totalEl = cartSidebar?.querySelector(".total strong:last-child");

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

    cart.forEach((product, index) => {
      const priceNum = parseFloat(product.price.replace("$", ""));
      subtotal += priceNum * product.quantity;

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
          <button class="btn btn-sm btn-outline-dark me-1 decrease" data-index="${index}">−</button>
          <span>${product.quantity}</span>
          <button class="btn btn-sm btn-outline-dark ms-1 increase" data-index="${index}">+</button>
        </div>
      `;
      cartSidebar?.insertBefore(item, cartSidebar.querySelector(".cart-summary"));
    });

    subtotalEl.textContent = totalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Attach quantity button events
    cartSidebar.querySelectorAll(".increase").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index);
        cart[i].quantity += 1;
        saveAndUpdate();
      })
    );

    cartSidebar.querySelectorAll(".decrease").forEach(btn =>
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.index);
        if (cart[i].quantity > 1) {
          cart[i].quantity -= 1;
        } else {
          cart.splice(i, 1);
        }
        saveAndUpdate();
      })
    );
  };

  // Init cart UI
  updateCartSidebarUI();
  updateCartBadge(cart.reduce((sum, item) => sum + item.quantity, 0));

  // Add to cart handler
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".category-card");
      if (!card) return;

      const name = card.querySelector(".product-name")?.textContent || "Unknown Product";
      const price = card.querySelector(".price")?.childNodes[0]?.textContent?.trim() || "$0.00";
      const image = card.querySelector("img")?.src || "";

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
        alert(`Added another ${name} to cart.`);
      } else {
        cart.push({ name, price, image, quantity: 1 });
        alert(`${name} added to cart!`);
      }

      saveAndUpdate();
    });
  });
}
