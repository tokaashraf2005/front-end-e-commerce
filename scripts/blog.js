const viewIcons = document.querySelectorAll(".view-icon");
const blogGrid = document.getElementById("blogGrid");

viewIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    viewIcons.forEach(i => i.classList.remove("active"));
    icon.classList.add("active");

    const view = icon.getAttribute("data-view");
    const posts = blogGrid.querySelectorAll(".col-12");

    // Reset all post columns
    posts.forEach(post => {
      post.className = "col-12"; // reset
    });

    // Reset blogGrid classes
    blogGrid.classList.remove("columns-view", "horizontal-view", "grid-2");

    switch (view) {
      case "grid-3":
        posts.forEach(post => post.classList.add("col-sm-6", "col-md-4", "col-lg-3"));
        break;


      case "grid-2":
        blogGrid.classList.add("grid-2");
        posts.forEach(post => post.classList.add("col-md-4"));
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
