// E-commerce App JavaScript for Mwas Car Dealers
// Complete functionality for all pages

class MwasCarDealers {
    constructor() {
        this.products = this.loadProducts();
        this.cart = this.loadCart();
        this.orders = this.loadOrders();
        this.nextProductId = this.getNextProductId();
        this.nextOrderId = this.getNextOrderId();
        this.init();
    }

    // Initialize the app
    init() {
        this.updateCartCount();
        this.setupEventListeners();
        
        // Load content based on current page
        if (document.getElementById('featured-products-container')) {
            this.loadFeaturedProducts();
        }
        
        if (document.querySelector('.admin-panel')) {
            this.setupAdminPanel();
        }
        
        if (document.getElementById('products-container')) {
            this.loadAllProducts();
        }
        
        if (document.getElementById('cart-items')) {
            this.loadCartPage();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                alert(`Thank you for subscribing with ${email}!`);
                e.target.reset();
            });
        }
    }

    // Data Management - Load default products
    loadProducts() {
        const defaultProducts = [
            {
                id: 1,
                name: "Toyota Camry 2023",
                price: 3500000,
                category: "Toyota",
                image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
                description: "A reliable and fuel-efficient sedan perfect for daily commuting and long drives.",
                featured: true
            },
            {
                id: 2,
                name: "BMW X5 2023",
                price: 7500000,
                category: "BMW",
                image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
                description: "Luxury SUV with premium features, advanced technology and exceptional performance.",
                featured: true
            },
            {
                id: 3,
                name: "Mazda CX-5 2023",
                price: 4200000,
                category: "Mazda",
                image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop",
                description: "Stylish crossover SUV with advanced safety features and modern design.",
                featured: false
            },
            {
                id: 4,
                name: "Toyota Prius 2023",
                price: 2800000,
                category: "Toyota",
                image: "https://images.unsplash.com/photo-1549399480-2c85bc74d67b?w=400&h=300&fit=crop",
                description: "Eco-friendly hybrid vehicle with excellent fuel economy.",
                featured: false
            },
            {
                id: 5,
                name: "BMW 3 Series",
                price: 5200000,
                category: "BMW",
                image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
                description: "Sporty sedan with dynamic performance and luxury interior.",
                featured: true
            }
        ];
        
        const stored = localStorage.getItem('mwas_products');
        return stored ? JSON.parse(stored) : defaultProducts;
    }

    saveProducts() {
        localStorage.setItem('mwas_products', JSON.stringify(this.products));
    }

    loadCart() {
        const stored = localStorage.getItem('mwas_cart');
        return stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem('mwas_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    loadOrders() {
        const stored = localStorage.getItem('mwas_orders');
        return stored ? JSON.parse(stored) : [];
    }

    saveOrders() {
        localStorage.setItem('mwas_orders', JSON.stringify(this.orders));
    }

    getNextProductId() {
        return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    }

    getNextOrderId() {
        return this.orders.length > 0 ? Math.max(...this.orders.map(o => o.id)) + 1 : 1000;
    }

    // Featured Products for Home Page
    loadFeaturedProducts() {
        const container = document.getElementById('featured-products-container');
        if (!container) return;

        const featuredProducts = this.products.filter(product => product.featured);
        
        if (featuredProducts.length === 0) {
            container.innerHTML = '<p class="no-products">No featured products available.</p>';
            return;
        }

        container.innerHTML = featuredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">Ksh ${product.price.toLocaleString()}</p>
                    <p class="description">${product.description}</p>
                    <button class="btn add-to-cart-btn" onclick="app.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Load all products for resources page
    loadAllProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (this.products.length === 0) {
            container.innerHTML = '<p class="no-products">No products available.</p>';
            return;
        }

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="price">Ksh ${product.price.toLocaleString()}</p>
                    <p class="description">${product.description}</p>
                    ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    <button class="btn add-to-cart-btn" onclick="app.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Cart Management
    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === parseInt(productId));
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== parseInt(productId));
        this.saveCart();
        if (document.getElementById('cart-items')) {
            this.loadCartPage();
        }
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === parseInt(productId));
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = parseInt(quantity);
                this.saveCart();
                if (document.getElementById('cart-items')) {
                    this.loadCartPage();
                }
            }
        }
    }

    updateCartCount() {
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Cart Page
    loadCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <a href="resources.html" class="btn">Continue Shopping</a>
                </div>
            `;
            if (cartTotalElement) cartTotalElement.textContent = 'Ksh 0';
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">Ksh ${item.price.toLocaleString()}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-total">
                    Ksh ${(item.price * item.quantity).toLocaleString()}
                </div>
                <button class="remove-btn" onclick="app.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        if (cartTotalElement) {
            cartTotalElement.textContent = `Ksh ${this.getCartTotal().toLocaleString()}`;
        }
    }

    // Checkout
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const order = {
            id: this.nextOrderId++,
            items: [...this.cart],
            total: this.getCartTotal(),
            date: new Date().toISOString(),
            status: 'Pending',
            customer: 'Guest Customer'
        };

        this.orders.push(order);
        this.cart = [];
        this.saveOrders();
        this.saveCart();
        
        alert(`Order placed successfully! Order ID: ${order.id}`);
        this.loadCartPage();
    }

    // Admin Panel Functions
    setupAdminPanel() {
        this.setupAdminTabs();
        this.setupAddProductForm();
        this.loadProductsTable();
        this.loadOrdersTable();
    }

    setupAdminTabs() {
        const tabLinks = document.querySelectorAll('.admin-nav a');
        const tabContents = document.querySelectorAll('.admin-tab');

        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs and links
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Show corresponding tab content
                const tabId = link.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
                
                // Load data for specific tabs
                if (tabId === 'manage-products') {
                    this.loadProductsTable();
                } else if (tabId === 'orders') {
                    this.loadOrdersTable();
                }
            });
        });
    }

    setupAddProductForm() {
        const form = document.getElementById('add-product-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const product = {
                id: this.nextProductId++,
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                image: formData.get('image') || 'https://via.placeholder.com/400x300?text=No+Image',
                description: formData.get('description'),
                featured: formData.get('featured') === 'true'
            };

            this.products.push(product);
            this.saveProducts();
            
            form.reset();
            alert('Product added successfully!');
            this.loadProductsTable();
        });
    }

    loadProductsTable() {
        const tbody = document.getElementById('products-table-body');
        if (!tbody) return;

        if (this.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No products available</td></tr>';
            return;
        }

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'"></td>
                <td>${product.name}</td>
                <td>Ksh ${product.price.toLocaleString()}</td>
                <td>${product.category}</td>
                <td>${product.featured ? 'Yes' : 'No'}</td>
                <td>
                    <button class="btn-small btn-danger" onclick="app.deleteProduct(${product.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== parseInt(productId));
            this.saveProducts();
            this.loadProductsTable();
            
            // Update featured products if on home page
            if (document.getElementById('featured-products-container')) {
                this.loadFeaturedProducts();
            }
        }
    }

    loadOrdersTable() {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        if (this.orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No orders yet</td></tr>';
            return;
        }

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td>Ksh ${order.total.toLocaleString()}</td>
                <td>
                    <select onchange="app.updateOrderStatus(${order.id}, this.value)">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="btn-small" onclick="app.viewOrderDetails(${order.id})">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === parseInt(orderId));
        if (order) {
            order.status = newStatus;
            this.saveOrders();
            alert('Order status updated successfully!');
        }
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === parseInt(orderId));
        if (order) {
            const details = `
Order ID: #${order.id}
Customer: ${order.customer}
Date: ${new Date(order.date).toLocaleString()}
Status: ${order.status}
Total: Ksh ${order.total.toLocaleString()}

Items:
${order.items.map(item => `- ${item.name} x${item.quantity} = Ksh ${(item.price * item.quantity).toLocaleString()}`).join('\n')}
            `;
            alert(details);
        }
    }

    // Utility Functions
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Filter products by category (for resources page)
    filterProducts(category = '') {
        const container = document.getElementById('products-container');
        if (!container) return;

        let filteredProducts = this.products;
        if (category && category !== 'All Categories') {
            filteredProducts = this.products.filter(product => product.category === category);
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = '<p class="no-products">No products found in this category.</p>';
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category}</p>
                    <p class="price">Ksh ${product.price.toLocaleString()}</p>
                    <p class="description">${product.description}</p>
                    ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
                    <button class="btn add-to-cart-btn" onclick="app.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MwasCarDealers();
});

// Add some CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .no-products {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 18px;
    }
    
    .featured-badge {
        background: #ff6b35;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    
    .btn-small {
        padding: 5px 10px;
        font-size: 12px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        background: #007bff;
        color: white;
    }
    
    .btn-danger {
        background: #dc3545;
    }
    
    .empty-cart {
        text-align: center;
        padding: 60px 20px;
    }
    
    .empty-cart i {
        font-size: 64px;
        color: #ccc;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(style);