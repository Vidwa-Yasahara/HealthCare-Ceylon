// Create an empty list to store the medicines
let medicines = [];

fetch('pharmacy.json')
    .then(response => response.json())
    .then(data => {
        medicines = data;
        displayMedicines();
    })
    .catch(error => console.error("Error loading medicines:", error));


function displayMedicines() {
    const medicineSection = document.getElementById('medicine-section');
    medicineSection.innerHTML = '';

    medicines.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'medicine-category';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.category || 'Uncategorized';
        categoryDiv.appendChild(categoryTitle);

        const medicineList = document.createElement('div');
        medicineList.className = 'medicine-list';

        category.medicines.forEach(medicine => {
            const medicineItem = document.createElement('div');
            medicineItem.className = 'medicine-item';

            const img = document.createElement('img');
            img.src = medicine.image || 'placeholder.png'; // Fallback if no image
            img.alt = medicine.name;
            medicineItem.appendChild(img);

            const name = document.createElement('p');
            name.textContent = medicine.name;
            medicineItem.appendChild(name);

            const price = document.createElement('p');
            price.textContent = `Price: $${medicine.price.toFixed(2)}`; // Round price
            medicineItem.appendChild(price);

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '0';
            quantityInput.value = '0';
            quantityInput.className = 'quantity-input';
            medicineItem.appendChild(quantityInput);

            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Cart';
            addButton.onclick = () => addToCart(medicine, parseInt(quantityInput.value), category.category);
            medicineItem.appendChild(addButton);

            medicineList.appendChild(medicineItem);
        });

        categoryDiv.appendChild(medicineList);
        medicineSection.appendChild(categoryDiv);
    });
}

// Retrieve cart from localStorage or initialize it
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Function to add a medicine to the cart
function addToCart(medicine, quantity, category) {
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity!');
        return;
    }

    const existingItem = cart.find(item => item.name === medicine.name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Include category in the cart
        cart.push({ ...medicine, quantity, category });
    }

    // Save the cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTable();
}

// Function to update the cart table
function updateCartTable() {
    const cartTable = document.getElementById('cart-table');
    const tableBody = cartTable.querySelector('tbody');
    tableBody.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const categoryCell = document.createElement('td');
        categoryCell.textContent = item.category || 'Uncategorized';
        row.appendChild(categoryCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${item.price.toFixed(2)}`; // Round price
        row.appendChild(priceCell);

        const totalCell = document.createElement('td');
        const itemTotal = (item.price * item.quantity).toFixed(2); // Round total
        totalCell.textContent = `$${itemTotal}`;
        row.appendChild(totalCell);

        // Adding a delete button in the Actions column of the table
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);

        total += parseFloat(itemTotal); // Accumulate rounded totals
    });

    // Display grand total rounded to 2 decimal places
    document.getElementById('grand-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Save current cart as favorites
function saveToFavorites() {
    localStorage.setItem('favoriteCart', JSON.stringify(cart));
    alert('Favorites saved!');
}

// Apply saved favorites to the cart
function applyFavorites() {
    const favoriteCart = localStorage.getItem('favoriteCart');
    if (favoriteCart) {
        cart = JSON.parse(favoriteCart);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTable();
        alert('Favorites applied!');
    } else {
        alert('No favorites saved!');
    }
}

// Clear the cart
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTable();
}

// Function to proceed to purchase page
function proceedToPurchase() {
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Cart saved! Redirecting to the purchase page.');
    window.location.href = 'purchase.html';
}

// Attach button functions to events
document.getElementById('add-to-favorites').onclick = saveToFavorites;
document.getElementById('apply-favorites').onclick = applyFavorites;
document.getElementById('clear-cart').onclick = clearCart;
document.getElementById('proceed-to-purchase').onclick = proceedToPurchase;