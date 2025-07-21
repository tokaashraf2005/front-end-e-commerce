document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (path, containerId, callback) => {
    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        return res.text();
      })
      .then(html => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = html;
          console.log(`${containerId} loaded!`);
          if (typeof callback === "function") callback(); // Run callback after loading
        }
      })
      .catch(err => console.error(err));
  };

  // Load navbar and attach event listeners after it loads
  loadComponent("../components/navbar.html", "navbar-container", () => {
    // Search box toggle
    const searchToggle = document.getElementById("search-toggle");
    const searchBox = document.getElementById("search-box");
    if (searchToggle && searchBox) {
      searchToggle.addEventListener("click", (e) => {
        e.preventDefault();
        searchBox.classList.toggle("d-none");
      });
    }
  });

  // Load newsletter and footer
  loadComponent("../components/newsletter.html", "newsletter-container");
  loadComponent("../components/footer.html", "footer-container");
});
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-btn");
  const cartSidebarBody = document.querySelector("#cartSidebar .offcanvas-body");
  const emptyMsg = cartSidebarBody.querySelector(".empty-msg");
  const subtotalEl = cartSidebarBody.querySelector(".subtotal span:last-child");
  const totalEl = cartSidebarBody.querySelector(".total strong:last-child");


  // Helper: Update cart sidebar UI
  function updateCartSidebarUI(cart) {
    // Clear existing items (except the cart-summary)
    const oldItems = cartSidebarBody.querySelectorAll(".cart-item");
    oldItems.forEach(item => item.remove());

    // Remove "No Products In Cart" message if items exist
    if (cart.length > 0) {
      emptyMsg.style.display = "none";
    }

    let subtotal = 0;

    cart.forEach(product => {
      // Add product price to subtotal
      subtotal += parseFloat(product.price.replace("$", ""));

      const item = document.createElement("div");
      item.classList.add("cart-item", "d-flex", "align-items-center", "mb-3");
      item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
        <div>
          <div class="fw-bold">${product.name}</div>
          <div class="text-muted">${product.price}</div>
        </div>
      `;
      cartSidebarBody.insertBefore(item, cartSidebarBody.querySelector(".cart-summary"));
    });

    // Update subtotal and total
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Initial sidebar update (on load)
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartSidebarUI(initialCart);
    updateCartBadge(initialCart.length);
  

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".category-card");

      const product = {
        name: card.querySelector(".product-name").textContent,
        price: card.querySelector(".price").childNodes[0].textContent.trim(),
        oldPrice: card.querySelector(".old-price")?.textContent || null,
        image: card.querySelector("img").src,
      };

      // Get cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      // Prevent duplicates
      const exists = cart.find(item => item.name === product.name);
      if (!exists) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartSidebarUI(cart); // Update the sidebar!
        alert(`${product.name} added to cart!`);
      } else {
        alert(`${product.name} is already in the cart.`);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();

  const highlightActiveLink = (selector) => {
    const navLinks = document.querySelectorAll(selector);

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      const linkPage = href.split("/").pop();

      if (linkPage === currentPage) {
        link.classList.add("active", "fw-bolder", "text-dark");
        link.classList.remove("text-secondary", "fw-medium");
      } else {
        link.classList.remove("active", "fw-bolder", "text-dark");
        link.classList.add("text-secondary", "fw-medium");
      }
    });
  };

  // Apply to both main and mobile nav links
  highlightActiveLink(".navbar-nav .nav-link");
});

// Fixed cart badge update function
function updateCartBadge(count) {
  // Update localStorage
  localStorage.setItem("cartCount", count);
  
  // Update all cart badge elements (both desktop and mobile)
  const cartBadges = document.querySelectorAll(".cart-badge");
  cartBadges.forEach(badge => {
    badge.textContent = count;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCount = parseInt(localStorage.getItem("cartCount")) || 0;
  updateCartBadge(savedCount);

  // Example for incrementing
  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => {
      const newCount = parseInt(localStorage.getItem("cartCount")) + 1;
      updateCartBadge(newCount);
    });
  });
});

/*   //DISCOUNT BAR CLOSE BTN
    document.querySelector(".close-btn").addEventListener("click", function () {
      document.querySelector(".discount-bar").style.display = "none";
    }); */