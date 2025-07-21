const viewIcons = document.querySelectorAll(".view-icon");
const blogGrid = document.getElementById("blogGrid");

viewIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    viewIcons.forEach(i => i.classList.remove("active"));
    icon.classList.add("active");

    const view = icon.getAttribute("data-view");
    const posts = blogGrid.querySelectorAll(".col-12");

    posts.forEach(post => {
      post.className = "col-12"; // reset
    });

    blogGrid.className = "row g-4"; // reset
    blogGrid.classList.remove("columns-view", "horizontal-view");

    switch (view) {
      case "grid-3":
        posts.forEach(post => post.classList.add("col-md-4"));
        break;
      case "grid-2":
        posts.forEach(post => post.classList.add("col-md-6"));
        break;
      case "columns":
  blogGrid.classList.add("columns-view");
  posts.forEach(post => post.classList.add("col-md-6", "d-flex"));
  break;

      case "horizontal":
        blogGrid.classList.add("horizontal-view");
        posts.forEach(post => post.classList.add("col-12"));
        break;
    }
  });
});