// 商品数据
const products = [
    {
        id: 1,
        title: "iPhone 15 Pro Max",
        price: 9999,
        originalPrice: 10999,
        category: "electronics",
        image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=iPhone+15",
        rating: 4.8,
        reviews: 1250
    },
    {
        id: 2,
        title: "无线蓝牙耳机",
        price: 299,
        originalPrice: 399,
        category: "electronics",
        image: "https://via.placeholder.com/300x200/50C878/FFFFFF?text=蓝牙耳机",
        rating: 4.6,
        reviews: 890
    },
    {
        id: 3,
        title: "时尚休闲外套",
        price: 199,
        originalPrice: 299,
        category: "clothing",
        image: "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=休闲外套",
        rating: 4.5,
        reviews: 456
    },
    {
        id: 4,
        title: "智能手表",
        price: 1299,
        originalPrice: 1599,
        category: "electronics",
        image: "https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=智能手表",
        rating: 4.7,
        reviews: 678
    },
    {
        id: 5,
        title: "舒适沙发",
        price: 2499,
        originalPrice: 3299,
        category: "home",
        image: "https://via.placeholder.com/300x200/E67E22/FFFFFF?text=舒适沙发",
        rating: 4.9,
        reviews: 234
    },
    {
        id: 6,
        title: "编程入门书籍",
        price: 89,
        originalPrice: 129,
        category: "books",
        image: "https://via.placeholder.com/300x200/34495E/FFFFFF?text=编程书籍",
        rating: 4.4,
        reviews: 567
    },
    {
        id: 7,
        title: "运动鞋",
        price: 599,
        originalPrice: 799,
        category: "sports",
        image: "https://via.placeholder.com/300x200/1ABC9C/FFFFFF?text=运动鞋",
        rating: 4.6,
        reviews: 789
    },
    {
        id: 8,
        title: "咖啡机",
        price: 899,
        originalPrice: 1199,
        category: "home",
        image: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=咖啡机",
        rating: 4.3,
        reviews: 345
    }
];

// 购物车数据
let cart = [];
let currentCategory = 'all';
let currentView = 'grid';

// DOM元素
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
});

// 渲染商品
function renderProducts() {
    const filteredProducts = filterProducts();
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// 过滤商品
function filterProducts() {
    let filtered = products;
    
    // 按分类过滤
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    
    // 按搜索关键词过滤
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

// 创建商品卡片
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                <span class="price">¥${product.price}</span>
                <span class="original-price">¥${product.originalPrice}</span>
            </div>
            <div class="product-rating">
                <span class="stars">${getStars(product.rating)}</span>
                <span class="rating-text">${product.rating} (${product.reviews})</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> 加入购物车
            </button>
        </div>
    `;
    return card;
}

// 获取星级评分HTML
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// 添加到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showCartNotification();
}

// 从购物车移除
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// 更新购物车数量
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// 更新购物车总价
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total.toFixed(2)}`;
}

// 渲染购物车
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">购物车为空</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="setQuantity(${item.id}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    updateCartTotal();
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
}

// 设置商品数量
function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        updateCartCount();
        renderCart();
    }
}

// 显示购物车
function showCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('show');
    renderCart();
}

// 隐藏购物车
function hideCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('show');
}

// 显示购物车通知
function showCartNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> 商品已添加到购物车';
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 设置事件监听器
function setupEventListeners() {
    // 购物车图标点击事件
    document.querySelector('.cart-icon').addEventListener('click', showCart);
    
    // 关闭购物车事件
    document.getElementById('closeCart').addEventListener('click', hideCart);
    overlay.addEventListener('click', hideCart);
    
    // 分类导航事件
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderProducts();
        });
    });
    
    // 视图切换事件
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateProductView();
        });
    });
    
    // 搜索事件
    searchInput.addEventListener('input', function() {
        renderProducts();
    });
    
    // 搜索按钮事件
    document.querySelector('.search-btn').addEventListener('click', function() {
        renderProducts();
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            renderProducts();
        }
    });
}

// 更新商品视图
function updateProductView() {
    if (currentView === 'list') {
        productsGrid.style.gridTemplateColumns = '1fr';
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.querySelector('.product-image').style.width = '150px';
            card.querySelector('.product-image').style.height = '150px';
        });
    } else {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = 'block';
            card.querySelector('.product-image').style.width = '100%';
            card.querySelector('.product-image').style.height = '200px';
        });
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);