function selectChair(element, colorName) {
      const allOptions = document.querySelectorAll('.chair-option');
      allOptions.forEach(option => option.classList.remove('selected'));
      element.classList.add('selected');
      document.getElementById('colorName').innerText = colorName;
    }

    const decreaseBtn = document.querySelector('.quantity button:first-child');
    const increaseBtn = document.querySelector('.quantity button:last-child');
    const quantityDisplay = document.querySelector('.quantity span');
    const addToCartBtn = document.querySelector('.add-to-cart');

    let quantity = 1;

    decreaseBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });

    increaseBtn.addEventListener('click', () => {
      quantity++;
      quantityDisplay.textContent = quantity;
    });

   document.querySelectorAll('.img-wrapper img').forEach(image => {
      image.addEventListener('click', () => {
        const wrapper = image.parentElement;
        const wishlist = wrapper.querySelector('.wishlist-icon');
        const btn = wrapper.querySelector('.add-btn');

        wishlist.style.display = wishlist.style.display === 'block' ? 'none' : 'block';
        btn.style.display = btn.style.display === 'block' ? 'none' : 'block';
      });
     });