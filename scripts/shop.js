// Category and Price filter
document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("categoryFilter");
    const priceSelect = document.getElementById("priceFilter");
    const products = document.querySelectorAll("#productContainer > div");

    function filterProducts() {
        const selectedCategory = categorySelect.value;
        const selectedPrice = priceSelect.value;

        products.forEach(product => {
            const productCategory = product.dataset.category;
            const productPrice = parseFloat(product.dataset.price);

            let showByCategory = selectedCategory === "All" || productCategory === selectedCategory;
            let showByPrice = true;

            switch (selectedPrice) {
                case "$0.00 - $99.99":
                    showByPrice = productPrice >= 0 && productPrice <= 99.99;
                    break;
                case "$100.00 - $199.99":
                    showByPrice = productPrice >= 100 && productPrice <= 199.99;
                    break;
                case "$200.00 - $299.99":
                    showByPrice = productPrice >= 200 && productPrice <= 299.99;
                    break;
                case "$300.00 - $399.99":
                    showByPrice = productPrice >= 300 && productPrice <= 399.99;
                    break;
                case "$400.00+":
                    showByPrice = productPrice >= 400;
                    break;
            }

            if (showByCategory && showByPrice) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    categorySelect.addEventListener("change", filterProducts);
    priceSelect.addEventListener("change", filterProducts);
});

// Sort by Name and Price
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("productContainer");
    const sortLinks = document.querySelectorAll("[data-sort]");

    const getPrice = (card) => parseFloat(card.querySelector(".fw-bold").textContent.replace("$", ""));
    const getName = (card) => card.querySelector(".card-title").textContent.trim().toLowerCase();

    sortLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const sortType = link.dataset.sort;
            const cards = Array.from(container.querySelectorAll(".col-12"));

            cards.sort((a, b) => {
                switch (sortType) {
                    case "price-asc": return getPrice(a) - getPrice(b);
                    case "price-desc": return getPrice(b) - getPrice(a);
                    case "name-asc": return getName(a).localeCompare(getName(b));
                    case "name-desc": return getName(b).localeCompare(getName(a));
                    default: return 0;
                }
            });

            cards.forEach(card => container.appendChild(card));
        });
    });
});

// The way of view products
document.addEventListener("DOMContentLoaded", function () {
    const viewButtons = document.querySelectorAll(".view-btn");
    const productContainer = document.getElementById("productContainer");
    viewButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            viewButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            productContainer.classList.remove("view-grid-4", "view-grid-2", "view-column", "view-list");
            const viewClass = this.getAttribute("data-view");
            productContainer.classList.add(viewClass);
        });
    });
});

