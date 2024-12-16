// Retrieve the cart from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to update the order summary table with cart items
function updateOrderSummary() {
    const orderTableBody = document.getElementById('order-table').querySelector('tbody');
    orderTableBody.innerHTML = ''; // Clear existing rows in the table
    let total = 0;

    // Loop through each item in the cart
    cart.forEach(item => {
        const row = document.createElement('tr');

        // Create and display the medicine name in the order summary
        const nameCell = document.createElement('td');  
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Create and display the quantity in the order summary
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        // Create and display the price of the medicine
        const priceCell = document.createElement('td');
        priceCell.textContent = `$${item.price}`;
        row.appendChild(priceCell);

        // Create and display the total price for the medicine (price * quantity)
        const totalCell = document.createElement('td');
        totalCell.textContent = `$${item.price * item.quantity}`;
        row.appendChild(totalCell);

        orderTableBody.appendChild(row);

        // Accumulate the total price for all items
        total += item.price * item.quantity;
    });

    // Update the grand total displayed on the page
    document.getElementById('Total').textContent = `Total: $${total.toFixed(2)}`;
}

// Event listener for selecting the payment method
const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
paymentMethods.forEach(method => {
    method.addEventListener('change', function () {
        const cardForm = document.getElementById('card-form');
        // Show card payment form if 'card' is selected, otherwise hide it
        if (this.value === 'card') {
            cardForm.style.display = 'block';
        } else {
            cardForm.style.display = 'none';
        }
    });
});

// Function to validate the user details form
function validateUserDetails() {
    const userName = document.getElementById('user-name').value.trim();
    const userEmail = document.getElementById('user-email').value.trim();
    const userPhone = document.getElementById('user-phone').value.trim();
    const userAddress = document.getElementById('user-address').value.trim();

    if (!userName || !userEmail || !userPhone || !userAddress) {
        alert('Please fill in all required user details before proceeding.');
        return false;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Basic phone number validation (e.g., 10 digits)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(userPhone)) {
        alert('Please enter a valid 10-digit phone number.');
        return false;
    }

    return true;
}

// Event listener for confirming the payment
document.getElementById('confirm-payment').addEventListener('click', function () {
    // Validate the user details form
    if (!validateUserDetails()) {
        return;
    }

    const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
    
    // Check if a payment method has been selected
    if (!selectedPaymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    // If card payment is selected, validate the card details
    if (selectedPaymentMethod.value === 'card') {
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Ensure all card details are provided
        if (!cardNumber || !expiryDate || !cvv) {
            alert('Please fill in all card details.');
            return;
        }
        alert(`Your payment has been made and your order has been accepted, thank you!`);
    } else {
        // If another payment method is selected, confirm the order
        alert(`Your order has been accepted, thank you!`);
    }

    // Clear the cart from localStorage and reset the cart array
    localStorage.removeItem('cart');
    cart = [];
    updateOrderSummary(); // Update the order summary to reflect an empty cart
});

// Initialize the page by updating the order summary with current cart data
updateOrderSummary();
