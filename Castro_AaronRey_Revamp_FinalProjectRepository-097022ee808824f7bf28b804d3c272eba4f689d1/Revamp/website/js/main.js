const defaultCatalogProducts = [
    { 
        id: 'RV-001', 
        name: 'Reworked Graphic Tee', 
        subtitle: 'REWORKED DECONSTRUCTED TEE',
        taglineHeader: 'REWORKED TEE IDENTITY.',
        numericPrice: 850,
        price: '₱850', 
        category: 'Tops', 
        image: 'images/SHIRT.png',
        details: 'Reworked vintage graphic t-shirt with cut-and-sew panels',
        materials: 'Recycled cotton + blend fabrics',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-002', 
        name: 'Reworked Denim Jacket', 
        subtitle: 'REWORKED DENIM JACKET',
        taglineHeader: 'REWORKED DENIM IDENTITY.',
        numericPrice: 1850,
        price: '₱1,850', 
        category: 'Outerwear', 
        image: 'images/JACKET.png',
        details: 'Reworked vintage denim',
        materials: 'Recycled denim + fabric',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-003', 
        name: 'Patchwork Pants', 
        subtitle: 'REWORKED PATCHWORK PANTS',
        taglineHeader: 'REWORKED PANTS IDENTITY.',
        numericPrice: 1200,
        price: '₱1,200', 
        category: 'Bottoms', 
        image: 'images/PANTS.png',
        details: 'Multi-panel spliced cargo trousers',
        materials: 'Heavyweight cotton canvas + denim',
        sizes: ['S', 'M', 'L']
    },
    { 
        id: 'RV-004', 
        name: 'One-of-One Hoodie', 
        subtitle: 'REWORKED SPLIT HOODIE',
        taglineHeader: 'REWORKED HOODIE IDENTITY.',
        numericPrice: 1500,
        price: '₱1,500', 
        category: 'Outerwear', 
        image: 'images/HOODIE.png',
        details: 'Asymmetrical dual-tone custom hoodie',
        materials: 'Upcycled fleece cotton',
        sizes: ['S', 'M', 'L']
    }
];

const shippingOptionsMap = {
    standard: {
        name: 'Standard Courier Express (J&T / Flash)',
        fee: 100,
        eta: '3 to 5 business days'
    },
    express: {
        name: 'Same-Day / Priority Delivery (Grab / Lalamove)',
        fee: 250,
        eta: '1 to 2 days'
    },
    eco: {
        name: 'Eco-Conscious Green Shipping',
        fee: 80,
        eta: '5 to 7 days'
    }
};

/* --- PRODUCTS STORAGE & CRUD --- */
function getProducts() {
    const stored = localStorage.getItem('revamp_products');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
    }
    localStorage.setItem('revamp_products', JSON.stringify(defaultCatalogProducts));
    return defaultCatalogProducts;
}

function saveProducts(products) {
    localStorage.setItem('revamp_products', JSON.stringify(products));
}

/* --- AUTH & USERS STORAGE --- */
function getDefaultUsers() {
    return [
        {
            name: 'Revamp Admin',
            email: 'admin@revamp.ph',
            password: 'Admin123!',
            role: 'admin'
        },
        {
            name: 'Juan Cruz',
            email: 'customer@revamp.ph',
            password: 'User123!',
            role: 'customer'
        }
    ];
}

function getUsers() {
    const defaults = getDefaultUsers();
    const stored = localStorage.getItem('revamp_users');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const hasAdmin = parsed.some(u => u && u.email && u.email.toLowerCase() === 'admin@revamp.ph');
                return hasAdmin ? parsed : [...defaults, ...parsed];
            }
        } catch (e) {}
    }
    localStorage.setItem('revamp_users', JSON.stringify(defaults));
    return defaults;
}

function saveUsers(users) {
    localStorage.setItem('revamp_users', JSON.stringify(users));
}

function getCurrentUser() {
    const session = localStorage.getItem('revamp_current_user');
    return session ? JSON.parse(session) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('revamp_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('revamp_current_user');
    }
    updateAuthNav();
}

function updateAuthNav() {
    const user = getCurrentUser();
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'account.html') {
            link.textContent = user ? `Account (${user.name.split(' ')[0]})` : 'Account';
        }
    });

    const navList = document.querySelector('.nav-links');
    if (navList && !document.getElementById('adminNavLink')) {
        if (user && user.role === 'admin') {
            const li = document.createElement('li');
            li.id = 'adminNavLink';
            li.innerHTML = `<a href="admin.html">Admin</a>`;
            navList.appendChild(li);
        }
    }
}

/* --- GLOBAL SEARCH DRAWER --- */
function initGlobalSearch() {
    const searchTriggers = document.querySelectorAll('[data-search-trigger]');
    if (searchTriggers.length === 0) return;

    let drawer = document.getElementById('globalSearchDrawer');
    if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'globalSearchDrawer';
        drawer.className = 'search-bar-drawer';
        drawer.innerHTML = `
            <form class="search-bar-inner" id="globalSearchForm">
                <input type="text" id="globalSearchInput" placeholder="Search reworked tees, denim, outerwear, materials...">
                <button type="submit">[ SEARCH ]</button>
            </form>
        `;
        const header = document.querySelector('.site-header');
        if (header) {
            header.insertAdjacentElement('afterend', drawer);
        }
    }

    searchTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.toggle('open');
            const input = document.getElementById('globalSearchInput');
            if (drawer.classList.contains('open') && input) {
                input.focus();
            }
        });
    });

    const form = document.getElementById('globalSearchForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = document.getElementById('globalSearchInput').value.trim();
            window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
        });
    }
}

/* --- CART MANAGEMENT --- */
function getCart() {
    const cartData = localStorage.getItem('revamp_cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('revamp_cart', JSON.stringify(cart));
    updateCartCountNav();
}

function updateCartCountNav() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartNavs = document.querySelectorAll('.nav-links a');
    cartNavs.forEach(nav => {
        if (nav.textContent.toLowerCase().includes('cart')) {
            nav.textContent = `Cart (${totalQty})`;
            nav.href = 'cart.html';
        }
    });
}

function addToCart(productId, selectedSize) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.numericPrice),
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`${product.name} (Size: ${selectedSize}) added to cart!`);
}

function updateQuantity(productId, size, delta) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
        renderCartPage();
    }
}

/* --- ORDERS STORAGE --- */
function getOrders() {
    const stored = localStorage.getItem('revamp_orders');
    return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
    localStorage.setItem('revamp_orders', JSON.stringify(orders));
}

/* --- PRODUCT GRID RENDERING --- */
function renderProducts(productsToRender, targetElementId) {
    const grid = document.getElementById(targetElementId);
    if (!grid) return;

    if (productsToRender.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-family: var(--font-heading);">No products match your selection.</p>`;
        return;
    }

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="navigateToProduct('${product.id}')">
            <div class="product-image-wrap">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/SHIRT.png'">
            </div>
            <div class="card-category">${product.category}</div>
            <h3 class="card-title">${product.name}</h3>
            <div class="card-price">₱${Number(product.numericPrice).toLocaleString()}</div>
        </div>
    `).join('');
}

function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

/* --- PRODUCT DETAIL PAGE --- */
function initProductPage() {
    const detailContainer = document.getElementById('productDetailContainer');
    if (!detailContainer) return;

    const products = getProducts();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || (products[0] && products[0].id);

    const product = products.find(p => p.id === productId) || products[0];
    if (!product) return;

    const sizes = product.sizes && product.sizes.length ? product.sizes : ['S', 'M', 'L'];
    let selectedSize = sizes[0];

    detailContainer.innerHTML = `
        <div class="pdp-wrapper">
            <div class="pdp-image-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/SHIRT.png'">
            </div>

            <div class="pdp-info-column">
                <h1 class="pdp-hero-heading">${product.taglineHeader || product.name.toUpperCase()}</h1>
                <h2 class="pdp-subtitle">${product.subtitle || product.category.toUpperCase()}</h2>

                <div class="pdp-tag">ONE-OF-ONE</div>
                <div class="pdp-price">₱${Number(product.numericPrice).toLocaleString()}</div>

                <div class="pdp-section-label">SIZE</div>
                <div class="pdp-size-options">
                    ${sizes.map((size, index) => `
                        <button class="pdp-size-btn ${index === 0 ? 'active' : ''}" data-size="${size}">[ ${size} ]</button>
                    `).join('')}
                </div>

                <button class="pdp-add-btn" id="addToCartBtn">[ ADD TO CART ]</button>

                <div class="pdp-meta-group">
                    <div class="pdp-meta-item">
                        <strong>REVAMP ID:</strong> ${product.id}
                    </div>
                    <div class="pdp-meta-item">
                        <strong>PRODUCT DETAILS:</strong> ${product.details}
                    </div>
                    <div class="pdp-meta-item">
                        <strong>MATERIALS:</strong><br>${product.materials}
                    </div>
                </div>

                <div class="pdp-process-box">
                    <div class="pdp-process-title">THE REVAMP PROCESS</div>
                    <div class="pdp-process-flow">Original &rarr; Reworked &rarr; Finished Piece</div>
                </div>
            </div>
        </div>
    `;

    const sizeBtns = detailContainer.querySelectorAll('.pdp-size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedSize = e.target.getAttribute('data-size');
        });
    });

    document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product.id, selectedSize);
    });
}

/* --- CART PAGE --- */
function renderCartPage() {
    const cartList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    if (!cartList) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartList.innerHTML = `<div class="empty-cart-msg">Your cart is currently empty. <br><br><a href="shop.html" class="shop-btn">[ BROWSE CATALOG ]</a></div>`;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartSummary) cartSummary.style.display = 'flex';

    let subtotal = 0;

    cartList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/SHIRT.png'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
                    <div class="cart-quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', '${item.size}', -1)">[ - ]</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', '${item.size}', 1)">[ + ]</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) {
        subtotalEl.textContent = `SUBTOTAL: ₱${subtotal.toLocaleString()}`;
    }
}

/* --- SHIPPING PAGE --- */
function initShippingPage() {
    const shippingForm = document.getElementById('shippingForm');
    if (!shippingForm) return;

    const optionLabels = shippingForm.querySelectorAll('.shipping-option');
    optionLabels.forEach(label => {
        const radio = label.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', () => {
                optionLabels.forEach(l => l.classList.remove('active'));
                label.classList.add('active');
            });
        }
    });

    shippingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedRadio = shippingForm.querySelector('input[name="shipping"]:checked');
        const notesEl = document.getElementById('shippingNotes');
        const shippingCode = selectedRadio ? selectedRadio.value : 'standard';
        const notes = notesEl ? notesEl.value.trim() : '';

        localStorage.setItem('revamp_shipping', JSON.stringify({
            code: shippingCode,
            notes: notes
        }));

        window.location.href = `checkout.html?shipping=${encodeURIComponent(shippingCode)}`;
    });
}

/* --- CHECKOUT PAGE --- */
function initCheckoutPage() {
    const summaryList = document.getElementById('checkoutSummaryList');
    const shippingEl = document.getElementById('checkoutShipping');
    const totalEl = document.getElementById('checkoutTotal');
    const form = document.getElementById('checkoutForm');
    if (!summaryList) return;

    const cart = getCart();
    const urlParams = new URLSearchParams(window.location.search);
    const savedShipping = JSON.parse(localStorage.getItem('revamp_shipping') || '{}');
    const shippingCode = urlParams.get('shipping') || savedShipping.code || 'standard';
    const shippingInfo = shippingOptionsMap[shippingCode] || shippingOptionsMap.standard;
    const shippingFee = shippingInfo.fee;

    const currentUser = getCurrentUser();
    if (currentUser && form) {
        const emailInput = form.querySelector('input[type="email"]');
        const nameInput = form.querySelector('input[placeholder="Full Name"]');
        if (emailInput && !emailInput.value) emailInput.value = currentUser.email;
        if (nameInput && !nameInput.value) nameInput.value = currentUser.name;
    }

    if (cart.length === 0) {
        summaryList.innerHTML = `<p style="color: #888;">Your cart is empty.</p>`;
        if (shippingEl) shippingEl.textContent = '₱0';
        if (totalEl) totalEl.textContent = '₱0';
        return;
    }

    let subtotal = 0;

    summaryList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="summary-row">
                <span>${item.name} (${item.size}) ${item.quantity > 1 ? 'x' + item.quantity : ''}</span>
                <span>₱${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    const shippingMethodLabel = document.getElementById('checkoutShippingMethod');
    if (shippingMethodLabel) {
        shippingMethodLabel.textContent = `${shippingInfo.name} (${shippingInfo.eta})`;
    }

    const shippingNoteEl = document.getElementById('checkoutShippingNote');
    if (shippingNoteEl && savedShipping.notes) {
        shippingNoteEl.style.display = 'block';
        shippingNoteEl.textContent = `Delivery Note: ${savedShipping.notes}`;
    }

    if (shippingEl) {
        shippingEl.textContent = `₱${shippingFee.toLocaleString()}`;
    }

    const grandTotal = subtotal + shippingFee;
    if (totalEl) {
        totalEl.textContent = `₱${grandTotal.toLocaleString()}`;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value.trim();
            const fullName = form.querySelector('input[placeholder="Full Name"]').value.trim();
            const address = form.querySelector('input[placeholder="Address"]').value.trim();
            const city = form.querySelector('input[placeholder="City"]').value.trim();
            const postalCode = form.querySelector('input[placeholder="Postal Code"]').value.trim();
            const phone = form.querySelector('input[placeholder="Phone Number"]').value.trim();
            const paymentMethod = form.querySelector('input[name="payment"]:checked').value;

            const orderId = 'ORD-' + Date.now().toString().slice(-6);
            const newOrder = {
                orderId,
                customerName: fullName,
                email,
                address: `${address}, ${city} ${postalCode}`,
                phone,
                items: cart,
                shippingMethod: shippingInfo.name,
                shippingFee,
                paymentMethod,
                total: grandTotal,
                status: 'Processing',
                date: new Date().toLocaleDateString()
            };

            const orders = getOrders();
            orders.unshift(newOrder);
            saveOrders(orders);

            localStorage.removeItem('revamp_cart');
            localStorage.removeItem('revamp_shipping');
            updateCartCountNav();

            const checkoutGrid = document.querySelector('.checkout-grid');
            if (checkoutGrid) {
                checkoutGrid.innerHTML = `
                    <div class="order-confirmation-box" style="grid-column: 1 / -1;">
                        <h2>ORDER CONFIRMED — ${orderId}</h2>
                        <p>Thank you, <strong>${fullName}</strong>! Your payment via <strong>${paymentMethod}</strong> has been recorded.</p>
                        <p>Shipping Method: <strong>${shippingInfo.name}</strong> (Est. ${shippingInfo.eta})</p>
                        <p>Total Paid / Due: <strong>₱${grandTotal.toLocaleString()}</strong></p>
                        <br>
                        <a href="shop.html" class="shop-btn" style="border: 1px solid #555;">[ CONTINUE SHOPPING ]</a>
                    </div>
                `;
            }
        });
    }
}

/* --- SHOP PAGE (CATEGORY + SEARCH) --- */
function initShopPage() {
    const shopGrid = document.getElementById('shopGrid');
    if (!shopGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory = 'All';
    let currentQuery = (urlParams.get('q') || '').trim();

    const searchInput = document.getElementById('shopSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (searchInput && currentQuery) {
        searchInput.value = currentQuery;
    }

    function applyFilters() {
        const products = getProducts();
        const q = currentQuery.toLowerCase();

        const filtered = products.filter(p => {
            const matchesCat = currentCategory === 'All' || (p.category && p.category.toLowerCase() === currentCategory.toLowerCase());
            const matchesQuery = !q ||
                (p.id && String(p.id).toLowerCase().includes(q)) ||
                (p.name && String(p.name).toLowerCase().includes(q)) ||
                (p.category && String(p.category).toLowerCase().includes(q)) ||
                (p.details && String(p.details).toLowerCase().includes(q)) ||
                (p.materials && String(p.materials).toLowerCase().includes(q));
            return matchesCat && matchesQuery;
        });

        renderProducts(filtered, 'shopGrid');
    }

    applyFilters();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.getAttribute('data-category') || 'All';
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentQuery = e.target.value.trim();
            applyFilters();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            currentQuery = '';
            if (searchInput) searchInput.value = '';
            applyFilters();
        });
    }
}

/* --- HOME PAGE --- */
function initHomePage() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;

    const products = getProducts();
    renderProducts(products.slice(0, 4), 'featuredGrid');
}

/* --- ACCOUNT PAGE (AUTH & ROLE ACCESS) --- */
function initAccountPage() {
    const accountContainer = document.getElementById('accountMainContainer');
    if (!accountContainer) return;

    const currentUser = getCurrentUser();
    if (currentUser) {
        const orders = getOrders().filter(o => o.email.toLowerCase() === currentUser.email.toLowerCase());
        accountContainer.innerHTML = `
            <div class="auth-box" style="grid-column: 1 / -1;">
                <h2 class="auth-title">Member Profile</h2>
                <p style="margin-bottom: 8px;"><strong>Name:</strong> ${currentUser.name}</p>
                <p style="margin-bottom: 8px;"><strong>Email:</strong> ${currentUser.email}</p>
                <p style="margin-bottom: 16px;"><strong>Account Role:</strong> ${currentUser.role.toUpperCase()}</p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${currentUser.role === 'admin' ? `<a href="admin.html" class="shop-btn">[ OPEN ADMIN DASHBOARD ]</a>` : ''}
                    <button type="button" id="logoutBtn" class="btn-danger">[ SIGN OUT ]</button>
                </div>
            </div>
            <div class="auth-box" style="grid-column: 1 / -1;">
                <h2 class="auth-title">Your Order History (${orders.length})</h2>
                ${orders.length === 0 ? '<p style="font-size: 14px;">No orders placed under this account yet.</p>' : `
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(o => `
                                    <tr>
                                        <td>${o.orderId}</td>
                                        <td>${o.date}</td>
                                        <td>${o.paymentMethod}</td>
                                        <td>₱${Number(o.total).toLocaleString()}</td>
                                        <td><span class="badge-status">${o.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            setCurrentUser(null);
            window.location.reload();
        });
        return;
    }

    const forms = Array.from(accountContainer.querySelectorAll('form'));
    const loginForm = document.getElementById('loginForm') || forms[0];
    const registerForm = document.getElementById('registerForm') || forms[1];

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailEl = document.getElementById('loginEmail') || loginForm.querySelector('input[type="email"], input[name*="email" i]');
            const passEl = document.getElementById('loginPassword') || loginForm.querySelector('input[type="password"], input[name*="pass" i]');

            const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
            const password = passEl ? passEl.value : '';

            const users = getUsers();
            const matched = users.find(u => u.email.toLowerCase() === email && u.password === password);
            if (!matched) {
                alert('Invalid email or password. Use admin@revamp.ph / Admin123! or register a new account.');
                return;
            }

            setCurrentUser({ name: matched.name, email: matched.email, role: matched.role });
            if (matched.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.reload();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameEl = document.getElementById('regName') || registerForm.querySelector('input[name*="name" i], input[type="text"]');
            const emailEl = document.getElementById('regEmail') || registerForm.querySelector('input[type="email"], input[name*="email" i]');
            const passEl = document.getElementById('regPassword') || registerForm.querySelector('input[type="password"], input[name*="pass" i]');

            const name = nameEl ? nameEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
            const password = passEl ? passEl.value : '';

            if (!name || !email || password.length < 6) {
                alert('Please fill out all fields (password must be at least 6 characters).');
                return;
            }

            const users = getUsers();
            if (users.some(u => u.email.toLowerCase() === email)) {
                alert('An account with this email already exists.');
                return;
            }

            const newUser = { name, email, password, role: 'customer' };
            users.push(newUser);
            saveUsers(users);
            setCurrentUser({ name: newUser.name, email: newUser.email, role: newUser.role });
            alert('Account registered successfully!');
            window.location.reload();
        });
    }
}

/* --- ADMIN DASHBOARD PAGE --- */
function initAdminPage() {
    const adminRoot = document.getElementById('adminDashboardRoot');
    if (!adminRoot) return;

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
        adminRoot.innerHTML = `
            <div class="auth-box" style="max-width: 520px; margin: 40px auto; text-align: center;">
                <h2 class="auth-title">Restricted Admin Access</h2>
                <p style="margin-bottom: 18px; font-size: 14px;">Please sign in with an authorized administrator account to access site management controls.</p>
                <a href="account.html" class="shop-btn">[ GO TO ACCOUNT LOGIN ]</a>
            </div>
        `;
        return;
    }

    let activeTab = 'products';
    let editingProductId = null;

    function renderAdmin() {
        const products = getProducts();
        const orders = getOrders();
        const users = getUsers();

        adminRoot.innerHTML = `
            <div class="admin-header-bar">
                <h1>Site Management (Admin)</h1>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="font-size: 13px;">Signed in as <strong>${currentUser.name}</strong></span>
                    <button id="adminLogoutBtn" class="btn-danger">[ LOGOUT ]</button>
                </div>
            </div>

            <div class="admin-tabs">
                <button class="admin-tab-btn ${activeTab === 'products' ? 'active' : ''}" data-tab="products">[ Products (${products.length}) ]</button>
                <button class="admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">[ Orders (${orders.length}) ]</button>
                <button class="admin-tab-btn ${activeTab === 'users' ? 'active' : ''}" data-tab="users">[ Users (${users.length}) ]</button>
            </div>

            <div id="adminTabContent"></div>
        `;

        adminRoot.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeTab = btn.getAttribute('data-tab');
                editingProductId = null;
                renderAdmin();
            });
        });

        document.getElementById('adminLogoutBtn').addEventListener('click', () => {
            setCurrentUser(null);
            window.location.href = 'account.html';
        });

        const tabContent = document.getElementById('adminTabContent');

        if (activeTab === 'products') {
            const editProduct = editingProductId ? products.find(p => p.id === editingProductId) : null;
            tabContent.innerHTML = `
                <div class="admin-panel-grid">
                    <div class="admin-card">
                        <h2>${editProduct ? `Edit Product (${editProduct.id})` : 'Add New Product'}</h2>
                        <form id="adminProductForm">
                            <div class="auth-form-group">
                                <label>Product Name</label>
                                <input type="text" id="prodName" value="${editProduct ? editProduct.name : ''}" required placeholder="e.g. Upcycled Cargo Vest">
                            </div>
                            <div class="auth-form-group">
                                <label>Category</label>
                                <select id="prodCategory">
                                    <option value="Tops" ${editProduct && editProduct.category === 'Tops' ? 'selected' : ''}>Tops</option>
                                    <option value="Bottoms" ${editProduct && editProduct.category === 'Bottoms' ? 'selected' : ''}>Bottoms</option>
                                    <option value="Outerwear" ${editProduct && editProduct.category === 'Outerwear' ? 'selected' : ''}>Outerwear</option>
                                </select>
                            </div>
                            <div class="auth-form-group">
                                <label>Price (₱)</label>
                                <input type="number" id="prodPrice" min="1" value="${editProduct ? editProduct.numericPrice : ''}" required placeholder="1250">
                            </div>
                            <div class="auth-form-group">
                                <label>Image Path</label>
                                <select id="prodImage">
                                    <option value="images/SHIRT.png" ${editProduct && editProduct.image === 'images/SHIRT.png' ? 'selected' : ''}>images/SHIRT.png</option>
                                    <option value="images/JACKET.png" ${editProduct && editProduct.image === 'images/JACKET.png' ? 'selected' : ''}>images/JACKET.png</option>
                                    <option value="images/PANTS.png" ${editProduct && editProduct.image === 'images/PANTS.png' ? 'selected' : ''}>images/PANTS.png</option>
                                    <option value="images/HOODIE.png" ${editProduct && editProduct.image === 'images/HOODIE.png' ? 'selected' : ''}>images/HOODIE.png</option>
                                </select>
                            </div>
                            <div class="auth-form-group">
                                <label>Details</label>
                                <input type="text" id="prodDetails" value="${editProduct ? editProduct.details : ''}" required placeholder="Reworked vintage garment details">
                            </div>
                            <div class="auth-form-group">
                                <label>Materials</label>
                                <input type="text" id="prodMaterials" value="${editProduct ? editProduct.materials : ''}" required placeholder="Recycled cotton + denim">
                            </div>
                            <button type="submit" class="btn-action">${editProduct ? '[ SAVE CHANGES ]' : '[ ADD PRODUCT ]'}</button>
                            ${editProduct ? `<button type="button" id="cancelEditBtn" class="btn-secondary" style="width:100%; margin-top:8px;">[ CANCEL ]</button>` : ''}
                        </form>
                    </div>

                    <div class="admin-card">
                        <h2>Catalog Inventory</h2>
                        <div class="admin-table-wrap">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${products.map(p => `
                                        <tr>
                                            <td>${p.id}</td>
                                            <td>${p.name}</td>
                                            <td>${p.category}</td>
                                            <td>₱${Number(p.numericPrice).toLocaleString()}</td>
                                            <td style="display:flex; gap:6px;">
                                                <button class="btn-secondary" data-edit-id="${p.id}">Edit</button>
                                                <button class="btn-danger" data-delete-id="${p.id}">Delete</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('adminProductForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('prodName').value.trim();
                const category = document.getElementById('prodCategory').value;
                const numericPrice = Number(document.getElementById('prodPrice').value);
                const image = document.getElementById('prodImage').value;
                const details = document.getElementById('prodDetails').value.trim();
                const materials = document.getElementById('prodMaterials').value.trim();

                let updatedProducts = getProducts();
                if (editingProductId) {
                    updatedProducts = updatedProducts.map(p => p.id === editingProductId ? {
                        ...p,
                        name,
                        subtitle: name.toUpperCase(),
                        taglineHeader: `${name.toUpperCase()}.`,
                        category,
                        numericPrice,
                        price: `₱${numericPrice.toLocaleString()}`,
                        image,
                        details,
                        materials
                    } : p);
                    editingProductId = null;
                } else {
                    const nextNum = updatedProducts.length + 1;
                    const newId = 'RV-' + String(nextNum).padStart(3, '0') + '-' + Date.now().toString().slice(-2);
                    updatedProducts.push({
                        id: newId,
                        name,
                        subtitle: name.toUpperCase(),
                        taglineHeader: `${name.toUpperCase()}.`,
                        numericPrice,
                        price: `₱${numericPrice.toLocaleString()}`,
                        category,
                        image,
                        details,
                        materials,
                        sizes: ['S', 'M', 'L']
                    });
                }

                saveProducts(updatedProducts);
                renderAdmin();
            });

            const cancelBtn = document.getElementById('cancelEditBtn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    editingProductId = null;
                    renderAdmin();
                });
            }

            tabContent.querySelectorAll('[data-edit-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    editingProductId = btn.getAttribute('data-edit-id');
                    renderAdmin();
                });
            });

            tabContent.querySelectorAll('[data-delete-id]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const delId = btn.getAttribute('data-delete-id');
                    const filtered = getProducts().filter(p => p.id !== delId);
                    saveProducts(filtered);
                    renderAdmin();
                });
            });
        } else if (activeTab === 'orders') {
            tabContent.innerHTML = `
                <div class="admin-card">
                    <h2>Customer Orders</h2>
                    ${orders.length === 0 ? '<p style="font-size:14px;">No orders placed yet. Complete a checkout flow to test order tracking.</p>' : `
                        <div class="admin-table-wrap">
                            <table class="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Shipping & Payment</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orders.map(o => `
                                        <tr>
                                            <td><strong>${o.orderId}</strong><br><small>${o.date}</small></td>
                                            <td>${o.customerName}<br><small>${o.email}</small><br><small>${o.address}</small></td>
                                            <td>${o.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join('<br>')}</td>
                                            <td>${o.shippingMethod}<br><strong>${o.paymentMethod}</strong></td>
                                            <td>₱${Number(o.total).toLocaleString()}</td>
                                            <td>
                                                <select data-order-status="${o.orderId}" style="padding:6px; border-radius:4px;">
                                                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                                    <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            `;

            tabContent.querySelectorAll('[data-order-status]').forEach(select => {
                select.addEventListener('change', () => {
                    const oid = select.getAttribute('data-order-status');
                    const updatedOrders = getOrders().map(o => o.orderId === oid ? { ...o, status: select.value } : o);
                    saveOrders(updatedOrders);
                });
            });
        } else if (activeTab === 'users') {
            tabContent.innerHTML = `
                <div class="admin-card">
                    <h2>Registered Users</h2>
                    <div class="admin-table-wrap">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td>${u.name}</td>
                                        <td>${u.email}</td>
                                        <td><span class="badge-status">${u.role}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    }

    renderAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCountNav();
    updateAuthNav();
    initGlobalSearch();
    initHomePage();
    initShopPage();
    initProductPage();
    renderCartPage();
    initShippingPage();
    initCheckoutPage();
    initAccountPage();
    initAdminPage();
});