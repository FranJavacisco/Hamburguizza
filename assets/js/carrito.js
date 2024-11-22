/**
 * Clase para manejar la funcionalidad del carrito de compras
 */
class ShoppingCart {
    constructor() {
        // Inicialización de propiedades
        this.items = [];
        this.total = 0;
        this.shipping = 5.00;
        this.discount = 0;
        this.coupons = {
            'WELCOME10': { discount: 10, type: 'percentage' },
            'FREESHIP': { discount: 5, type: 'fixed', applyTo: 'shipping' },
            '20OFF': { discount: 20, type: 'percentage', minPurchase: 50 }
        };

        // Referencias DOM
        this.cartIcon = document.getElementById('cartIcon');
        this.cartCount = document.querySelector('.cart-count');
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        this.deleteModal = document.getElementById('deleteModal');
        this.checkoutModal = document.getElementById('checkoutModal');

        // Inicialización
        this.init();
    }

    /**
     * Inicializa el carrito
     */
    init() {
        // Cargar carrito guardado
        this.loadCart();
        
        // Event listeners
        this.setupEventListeners();
        
        // Actualizar UI
        this.updateUI();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Carrito
        this.cartIcon.addEventListener('click', () => this.toggleCart());
        
        // Botones de añadir al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
        });

        // Botón de checkout
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Cerrar carrito al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.cartModal.contains(e.target) && 
                !this.cartIcon.contains(e.target) && 
                this.cartModal.classList.contains('active')) {
                this.toggleCart();
            }
        });

        // Cupones
        const couponForm = document.getElementById('couponForm');
        if (couponForm) {
            couponForm.addEventListener('submit', (e) => this.applyCoupon(e));
        }

        // Opciones de envío
        document.querySelectorAll('input[name="shipping"]').forEach(input => {
            input.addEventListener('change', (e) => this.updateShipping(e));
        });
    }

    /**
     * Maneja la adición de productos al carrito
     */
    handleAddToCart(e) {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.dataset.id || Math.random().toString(36).substr(2, 9),
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
            image: card.querySelector('img').src,
            quantity: 1
        };

        this.addItem(product);
        this.showNotification(`${product.name} agregado al carrito`);
    }

    /**
     * Añade un item al carrito
     */
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.updateCart();
    }

    /**
     * Actualiza la cantidad de un item
     */
    updateQuantity(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.updateCart();
            }
        }
    }

    /**
     * Elimina un item del carrito
     */
    removeItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            this.showConfirmationModal(
                '¿Estás seguro de que deseas eliminar este producto?',
                () => {
                    this.items = this.items.filter(item => item.id !== id);
                    this.updateCart();
                    this.showNotification('Producto eliminado del carrito');
                }
            );
        }
    }

    /**
     * Actualiza el carrito y la UI
     */
    updateCart() {
        this.calculateTotal();
        this.updateUI();
        this.saveCart();
    }

    /**
     * Calcula el total del carrito
     */
    calculateTotal() {
        // Subtotal
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Aplicar descuento si existe
        if (this.discount > 0) {
            this.total = this.total * (1 - this.discount / 100);
        }

        // Añadir envío
        this.total += this.shipping;
    }

    /**
     * Actualiza la interfaz del carrito
     */
    updateUI() {
        // Actualizar contador
        this.cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);

        // Actualizar lista de items
        if (this.cartItems) {
            this.cartItems.innerHTML = this.items.length ? this.renderItems() : this.renderEmptyCart();
        }

        // Actualizar total
        if (this.cartTotal) {
            this.cartTotal.textContent = `$${this.total.toFixed(2)}`;
        }

        // Actualizar botón de checkout
        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = this.items.length === 0;
        }
    }

    /**
     * Renderiza los items del carrito
     */
    renderItems() {
        return this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">✕</button>
            </div>
        `).join('');
    }

    /**
     * Renderiza el mensaje de carrito vacío
     */
    renderEmptyCart() {
        return `
            <div class="empty-cart">
                <img src="/api/placeholder/200/200" alt="Carrito vacío" class="empty-cart-image">
                <h3>Tu carrito está vacío</h3>
                <p>¡Añade algunos productos deliciosos!</p>
                <a href="#menu" class="cta-button">Ver Menú</a>
            </div>
        `;
    }

    /**
     * Aplica un cupón de descuento
     */
    applyCoupon(e) {
        e.preventDefault();
        const code = document.getElementById('couponCode').value.toUpperCase();
        const coupon = this.coupons[code];
        
        if (coupon) {
            if (coupon.minPurchase && this.total < coupon.minPurchase) {
                this.showNotification('El monto mínimo para usar este cupón es $' + coupon.minPurchase, 'error');
                return;
            }

            if (coupon.type === 'percentage') {
                this.discount = coupon.discount;
            } else if (coupon.applyTo === 'shipping') {
                this.shipping = 0;
            }

            this.updateCart();
            this.showNotification('Cupón aplicado con éxito');
        } else {
            this.showNotification('Cupón inválido', 'error');
        }
    }

    /**
     * Actualiza el método de envío
     */
    updateShipping(e) {
        this.shipping = e.target.value === 'delivery' ? 5.00 : 0;
        this.updateCart();
    }

    /**
     * Maneja el proceso de checkout
     */
    handleCheckout() {
        if (this.items.length === 0) {
            this.showNotification('El carrito está vacío', 'error');
            return;
        }

        // Mostrar modal de checkout
        this.checkoutModal.classList.add('active');

        // Manejar envío del formulario de checkout
        const checkoutForm = document.getElementById('checkoutForm');
        checkoutForm.addEventListener('submit', (e) => this.processCheckout(e));
    }

    /**
     * Procesa el checkout
     */
    processCheckout(e) {
        e.preventDefault();
        // Aquí iría la lógica de procesamiento del pago
        
        this.showNotification('¡Gracias por tu compra!');
        this.items = [];
        this.updateCart();
        this.checkoutModal.classList.remove('active');
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Muestra un modal de confirmación
     */
    showConfirmationModal(message, onConfirm) {
        this.deleteModal.classList.add('active');
        this.deleteModal.querySelector('p').textContent = message;

        const confirmBtn = this.deleteModal.querySelector('#confirmDelete');
        const cancelBtn = this.deleteModal.querySelector('#cancelDelete');

        confirmBtn.onclick = () => {
            onConfirm();
            this.deleteModal.classList.remove('active');
        };

        cancelBtn.onclick = () => {
            this.deleteModal.classList.remove('active');
        };
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveCart() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            discount: this.discount,
            shipping: this.shipping
        }));
    }

    /**
     * Carga el carrito desde localStorage
     */
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            this.items = cart.items;
            this.discount = cart.discount;
            this.shipping = cart.shipping;
        }
    }

    /**
     * Alterna la visibilidad del carrito
     */
    toggleCart() {
        this.cartModal.classList.toggle('active');
    }
}

// Inicializar el carrito
const cart = new ShoppingCart();