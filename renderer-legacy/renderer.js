const { ipcRenderer } = require('electron');

// --- NAVIGATION CONTROLS ---

function goHome() {
    hideAllPages();
    document.getElementById('home-page-view').style.display = 'block';
}

function openInventory() {
    hideAllPages();
    document.getElementById('inventory-page-view').style.display = 'block';
    loadProducts(); // Load products everytime you open inventory
}

function openBilling() {
    hideAllPages();
    document.getElementById('billing-page-view').style.display = 'block';
}

function openReturns() {
    hideAllPages();
    document.getElementById('returns-page-view').style.display = 'block';
}

function syncCloud() {
    alert("Syncing with Cloud... (Coming Soon!)");
}

function hideAllPages() {
    document.getElementById('home-page-view').style.display = 'none';
    document.getElementById('inventory-page-view').style.display = 'none';
    document.getElementById('billing-page-view').style.display = 'none';
    document.getElementById('returns-page-view').style.display = 'none';
}

// Also buttons inside inventory form should have navigation

document.getElementById('back-to-home-btn').addEventListener('click', goHome);
document.getElementById('add-product-btn').addEventListener('click', function() {
    document.getElementById('inventory-list-view').style.display = 'none';
    document.getElementById('product-form-view').style.display = 'block';
    document.getElementById('product-form').reset();
    delete document.getElementById('product-form').dataset.editingId;
    document.getElementById('submit-btn').textContent = "Add Product";
});

document.getElementById('back-to-inventory-btn').addEventListener('click', function() {
    document.getElementById('product-form-view').style.display = 'none';
    document.getElementById('inventory-list-view').style.display = 'block';
});


// --- PRODUCT FORM LOGIC ---

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const product = {
        name: document.getElementById('name').value,
        specifics: document.getElementById('specifics').value,
        purchase_date: document.getElementById('purchase_date').value,
        quantity: parseInt(document.getElementById('quantity').value),
        purchase_price: parseFloat(document.getElementById('purchase_price').value),
        discount: parseFloat(document.getElementById('discount').value),
        mrp: parseFloat(document.getElementById('mrp').value),
        expiry_date: document.getElementById('expiry_date').value,
    };

    const editingId = document.getElementById('product-form').dataset.editingId;

    if (editingId) {
        // Update Mode
        const result = await ipcRenderer.invoke('update-product', { id: editingId, ...product });
        if (result.success) {
            alert('Product Updated Successfully!');
        } else {
            alert('Error Updating Product');
        }
    } else {
        // Add Mode
        const result = await ipcRenderer.invoke('add-product', product);
        if (result.success) {
            alert('Product Added Successfully!');
        } else {
            alert('Error Adding Product');
        }
    }

    // After Submit
    document.getElementById('product-form').reset();
    document.getElementById('submit-btn').textContent = "Add Product";
    delete document.getElementById('product-form').dataset.editingId;

    document.getElementById('product-form-view').style.display = 'none';
    document.getElementById('inventory-list-view').style.display = 'block';
    loadProducts();
});

// --- PRODUCTS DISPLAY LOGIC ---

async function loadProducts() {
    const products = await ipcRenderer.invoke('get-products');
    const tbody = document.getElementById('inventory-table').querySelector('tbody');
    tbody.innerHTML = '';

    const today = new Date();

    products.forEach(product => {
        const expiryDate = new Date(product.expiry_date);
        const timeDiff = expiryDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const tr = document.createElement('tr');
        if (daysLeft <= 30) {
            tr.classList.add('expiring-soon');
        }

        tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.specifics}</td>
            <td>${product.quantity}</td>
            <td>${product.expiry_date}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach listeners
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => editProduct(e.target.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
    });
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const result = await ipcRenderer.invoke('delete-product', id);
        if (result.success) {
            alert('Product Deleted Successfully!');
            loadProducts();
        } else {
            alert('Error Deleting Product!');
        }
    }
}

async function editProduct(id) {
    const product = await ipcRenderer.invoke('get-product-by-id', id);

    if (product) {
        document.getElementById('name').value = product.name;
        document.getElementById('specifics').value = product.specifics;
        document.getElementById('purchase_date').value = product.purchase_date;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('purchase_price').value = product.purchase_price;
        document.getElementById('discount').value = product.discount;
        document.getElementById('mrp').value = product.mrp;
        document.getElementById('expiry_date').value = product.expiry_date;

        document.getElementById('submit-btn').textContent = "Update Product";
        document.getElementById('product-form').dataset.editingId = id;

        document.getElementById('inventory-list-view').style.display = 'none';
        document.getElementById('product-form-view').style.display = 'block';
    }
}

// Initially load products if already on Inventory
if (document.getElementById('inventory-page-view').style.display !== 'none') {
    loadProducts();
}
