document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderList = document.getElementById("checkout-order-list");

  if (!orderList) return;

  if (cart.length === 0) {
    orderList.innerHTML = `<p class="text-muted">No products in cart.</p>`;
    return;
  }

  // Update totals
  const updateTotals = () => {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = updatedCart.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      const price = parseFloat(item.price.replace("$", ""));
      return sum + price * quantity;
    }, 0);

    document.querySelectorAll(".subtotal-amount, .total-amount").forEach(el => {
      el.textContent = `$${total.toFixed(2)}`;
    });
  };

  // Render cart items
  cart.forEach(item => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price.replace("$", ""));
    const totalPrice = (price * quantity).toFixed(2);

    const itemWrapper = document.createElement("div");
    itemWrapper.className = "d-flex align-items-center mb-4 pb-3 border-bottom";
    itemWrapper.innerHTML = `
      <img src="${item.image}" class="rounded me-3" style="width: 60px;" />
      <div class="flex-grow-1">
        <h6 class="mb-1">${item.name}</h6>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-secondary btn-sm px-2 py-1 btn-decrease" data-name="${item.name}">-</button>
          <span class="mx-2 small quantity">${quantity}</span>
          <button class="btn btn-outline-secondary btn-sm px-2 py-1 btn-increase" data-name="${item.name}">+</button>
        </div>
      </div>
      <div class="fw-semibold price" data-price="${price}">$${totalPrice}</div>
    `;

    orderList.appendChild(itemWrapper);
  });

  // Handle increase
  document.querySelectorAll(".btn-increase").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.forEach(item => {
        if (item.name === name) {
          item.quantity = (item.quantity || 1) + 1;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      const quantityEl = button.previousElementSibling;
      const newQuantity = parseInt(quantityEl.textContent) + 1;
      quantityEl.textContent = newQuantity;

      const priceEl = button.closest(".d-flex").nextElementSibling;
      const unitPrice = parseFloat(priceEl.getAttribute("data-price"));
      priceEl.textContent = `$${(unitPrice * newQuantity).toFixed(2)}`;

      updateTotals();
    });
  });

  // Handle decrease
  document.querySelectorAll(".btn-decrease").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.forEach(item => {
        if (item.name === name) {
          item.quantity = Math.max((item.quantity || 1) - 1, 1);
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      const quantityEl = button.nextElementSibling;
      const currentQuantity = parseInt(quantityEl.textContent);
      const newQuantity = Math.max(currentQuantity - 1, 1);
      quantityEl.textContent = newQuantity;

      const priceEl = button.closest(".d-flex").nextElementSibling;
      const unitPrice = parseFloat(priceEl.getAttribute("data-price"));
      priceEl.textContent = `$${(unitPrice * newQuantity).toFixed(2)}`;

      updateTotals();
    });
  });

  updateTotals(); 
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const placeOrderBtn = document.getElementById("place-order-btn");
  
  // Validation patterns
  const patterns = {
    name: /^[A-Za-z\s]{2,50}$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    address: /^.{5,100}$/,
    city: /^[A-Za-z\s\-]{2,50}$/,
    zipCode: /^[0-9A-Za-z\s\-]{3,10}$/,
    cardNumber: /^[0-9\s]{13,19}$/,
    expirationDate: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
    cvc: /^[0-9]{3,4}$/
  };

  // validation messages
  const validationMessages = {
    firstName: "First name must be 2-50 characters and contain only letters",
    lastName: "Last name must be 2-50 characters and contain only letters",
    phoneNumber: "Please enter a valid phone number (10-15 digits)",
    emailAddress: "Please enter a valid email address",
    streetAddress: "Street address must be 5-100 characters long",
    country: "Please select a country",
    city: "City must be 2-50 characters and contain only letters",
    state: "Please enter a valid state",
    zipCode: "Please enter a valid zip code",
    payment: "Please select a payment method",
    cardNumber: "Please enter a valid card number (13-19 digits)",
    expirationDate: "Please enter expiration date in MM/YY format",
    cvc: "Please enter a valid CVC (3-4 digits)"
  };

  // validation functions
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = "";

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = `${field.labels[0]?.textContent.replace('*', '').trim()} is required`;
    }
    // Validate specific field patterns
    else if (value) {
      switch (fieldName) {
        case 'firstName':
        case 'lastName':
          isValid = patterns.name.test(value);
          message = validationMessages[fieldName];
          break;
        case 'phoneNumber':
          isValid = patterns.phone.test(value);
          message = validationMessages[fieldName];
          break;
        case 'emailAddress':
          isValid = patterns.email.test(value);
          message = validationMessages[fieldName];
          break;
        case 'streetAddress':
          isValid = patterns.address.test(value);
          message = validationMessages[fieldName];
          break;
        case 'city':
          isValid = patterns.city.test(value);
          message = validationMessages[fieldName];
          break;
        case 'state':
          isValid = value.length >= 2 && value.length <= 50;
          message = validationMessages[fieldName];
          break;
        case 'zipCode':
          isValid = patterns.zipCode.test(value);
          message = validationMessages[fieldName];
          break;
        case 'cardNumber':
          // Remove spaces for validation
          const cardNum = value.replace(/\s/g, '');
          isValid = /^[0-9]{13,19}$/.test(cardNum) && isValidCardNumber(cardNum);
          message = validationMessages[fieldName];
          break;
        case 'expirationDate':
          isValid = patterns.expirationDate.test(value) && isValidExpirationDate(value);
          message = validationMessages[fieldName];
          break;
        case 'cvc':
          isValid = patterns.cvc.test(value);
          message = validationMessages[fieldName];
          break;
      }
    }

    // Update field 
    updateFieldValidation(field, isValid, message);
    return isValid;
  }

  // Update field validation 
  function updateFieldValidation(field, isValid, message) {
    const feedbackElement = field.parentNode.querySelector('.invalid-feedback');
    
    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (feedbackElement) {
        feedbackElement.style.display = 'none';
      }
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.style.display = 'block';
      }
    }
  }

  // Luhn algorithm for credit card validation
  function isValidCardNumber(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  }

  // Validate expiration date
  function isValidExpirationDate(dateString) {
    const [month, year] = dateString.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    currentDate.setDate(1); // Set to first day of current month
    
    return expDate >= currentDate;
  }

  // Format card number input
  function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    input.value = formattedValue;
  }

  // Format expiration date input
  function formatExpirationDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
  }

  const formFields = form.querySelectorAll('input[required], select[required]');
  formFields.forEach(field => {
    // Validate on blur
    field.addEventListener('blur', () => {
      validateField(field);
    });

    // Clear validation on focus
    field.addEventListener('focus', () => {
      field.classList.remove('is-invalid', 'is-valid');
    });

    // Special formatting for specific fields
    if (field.name === 'cardNumber') {
      field.addEventListener('input', () => {
        formatCardNumber(field);
      });
    }

    if (field.name === 'expirationDate') {
      field.addEventListener('input', () => {
        formatExpirationDate(field);
      });
    }

    // Only allow numbers for CVC
    if (field.name === 'cvc') {
      field.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    }

    // Only allow numbers for phone
    if (field.name === 'phoneNumber') {
      field.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '');
      });
    }
  });

  // Handle payment method change
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardDetails = document.getElementById('card-details');
  const cardFields = cardDetails.querySelectorAll('input');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'paypal') {
        cardDetails.style.display = 'none';
        cardFields.forEach(field => {
          field.removeAttribute('required');
          field.classList.remove('is-invalid', 'is-valid');
        });
      } else {
        cardDetails.style.display = 'block';
        cardFields.forEach(field => {
          field.setAttribute('required', '');
        });
      }
    });
  });

  // Validate entire form
  function validateForm() {
    let isFormValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
      // Skip card fields if PayPal is selected
      const paypalSelected = document.querySelector('input[name="payment"]:checked')?.value === 'paypal';
      if (paypalSelected && field.closest('#card-details')) {
        return;
      }
      
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    // Validate payment method selection
    const paymentSelected = document.querySelector('input[name="payment"]:checked');
    if (!paymentSelected) {
      isFormValid = false;
      const paymentContainer = document.querySelector('input[name="payment"]').closest('.mb-4');
      const feedbackElement = paymentContainer.querySelector('.invalid-feedback');
      if (feedbackElement) {
        feedbackElement.style.display = 'block';
      }
    }

    return isFormValid;
  }

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
      
      setTimeout(() => {
        alert('Order placed successfully!');
        
        // Reset button
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = 'Place order';

        // Redirect to order confirmation page
        window.location.href = '../pages/order.html';
      });
    } else {
      // Scroll to first invalid field
      const firstInvalidField = form.querySelector('.is-invalid');
      if (firstInvalidField) {
        firstInvalidField.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        firstInvalidField.focus();
      }
    }
  });

  // Coupon code validation
  const couponInput = document.getElementById('couponCode');
  const applyCouponBtn = document.getElementById('apply-coupon');
  
  applyCouponBtn.addEventListener('click', () => {
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
      showCouponMessage('Please enter a coupon code', 'error');
      return;
    }
    
    // coupon validation
    const validCoupons = ['SAVE10', 'WELCOME20', 'FIRST15'];
    const discounts = { 'SAVE10': 10, 'WELCOME20': 20, 'FIRST15': 15 };
    
    if (validCoupons.includes(couponCode)) {
      const discount = discounts[couponCode];
      showCouponMessage(`Coupon applied! ${discount}% discount`, 'success');
      applyCouponBtn.disabled = true;
      applyCouponBtn.textContent = 'Applied';
      localStorage.setItem("discountPercent", discount);
      // Apply discount to totals 
      updateTotalsWithDiscount(discount);
      localStorage.setItem("finalTotal", total.toFixed(2));
    } else {
      showCouponMessage('Invalid coupon code', 'error');
    }
  });

  function showCouponMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.coupon-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `coupon-message small mt-2 ${type === 'success' ? 'text-success' : 'text-danger'}`;
    messageDiv.textContent = message;
    
    couponInput.parentNode.insertAdjacentElement('afterend', messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 2000);
  }

  function updateTotalsWithDiscount(discountPercent) {
    const subtotalElements = document.querySelectorAll('.subtotal-amount');
    const totalElements = document.querySelectorAll('.total-amount');
    
    subtotalElements.forEach(el => {
      const currentAmount = parseFloat(el.textContent.replace('$', ''));
      const discountedAmount = currentAmount * (1 - discountPercent / 100);
      totalElements.forEach(totalEl => {
        totalEl.textContent = `$${discountedAmount.toFixed(2)}`;
      });
    });
  }

  document.querySelector('input[name="payment"][value="credit"]').checked = true;
});

