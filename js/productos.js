/**
 * Clase para manejar la carga dinámica de productos
 */
class ProductLoader {
    constructor() {
        // Base de datos de productos
        this.products = {
            pizzas: [
                {
                    id: 'p1',
                    name: 'Pizza Margherita',
                    description: 'Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva extra virgen',
                    price: 12.99,
                    image: '/api/placeholder/250/200',
                    category: 'pizzas',
                    tags: ['vegetariana', 'clásica'],
                    rating: 4.8,
                    reviews: 128,
                    badges: ['Popular'],
                    isSpicy: false,
                    isVegetarian: true
                },
                {
                    id: 'p2',
                    name: 'Pizza Pepperoni',
                    description: 'Salsa de tomate, mozzarella, pepperoni premium y orégano',
                    price: 14.99,
                    image: '/api/placeholder/250/200',
                    category: 'pizzas',
                    tags: ['clásica', 'picante'],
                    rating: 4.6,
                    reviews: 96,
                    badges: ['Bestseller'],
                    isSpicy: true,
                    isVegetarian: false
                },
                {
                    id: 'p3',
                    name: 'Pizza 4 Quesos',
                    description: 'Mozzarella, gorgonzola, parmesano y queso de cabra',
                    price: 15.99,
                    image: '/api/placeholder/250/200',
                    category: 'pizzas',
                    tags: ['premium', 'vegetariana'],
                    rating: 4.7,
                    reviews: 156,
                    badges: ['Premium'],
                    isSpicy: false,
                    isVegetarian: true
                },
                {
                    id: 'p4',
                    name: 'Pizza Vegetariana',
                    description: 'Pimientos, champiñones, aceitunas, cebolla y tomate',
                    price: 13.99,
                    image: '/api/placeholder/250/200',
                    category: 'pizzas',
                    tags: ['vegetariana', 'saludable'],
                    rating: 4.5,
                    reviews: 92,
                    badges: ['Veggie'],
                    isSpicy: false,
                    isVegetarian: true
                }
            ],
            burgers: [
                // Aquí irían las hamburguesas con la misma estructura
            ]
        };

        this.init();
    }

    /**
     * Inicializa la carga de productos
     */
    init() {
        this.loadProducts('pizzas', 'pizzasGrid');
        this.loadProducts('burgers', 'burgersGrid');
    }

    /**
     * Carga los productos en el grid especificado
     */
    loadProducts(category, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        const products = this.products[category];
        grid.innerHTML = products.map(product => this.createProductCard(product)).join('');

        // Inicializar eventos después de cargar los productos
        this.initializeProductEvents();
    }

    /**
     * Crea el HTML para una tarjeta de producto
     */
    createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                ${this.createBadges(product.badges)}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-tags">
                        ${this.createTags(product.tags)}
                    </div>
                    <p>${product.description}</p>
                    <div class="product-meta">
                        ${this.createRating(product.rating, product.reviews)}
                        <div class="price">$${product.price.toFixed(2)}</div>
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Crea los badges del producto
     */
    createBadges(badges) {
        if (!badges || !badges.length) return '';
        return badges.map(badge => `
            <div class="badge ${badge.toLowerCase()}">${badge}</div>
        `).join('');
    }

    /**
     * Crea las etiquetas del producto
     */
    createTags(tags) {
        if (!tags || !tags.length) return '';
        return tags.map(tag => `
            <span class="tag ${tag.toLowerCase()}">${tag}</span>
        `).join('');
    }

    /**
     * Crea el sistema de calificación
     */
    createRating(rating, reviews) {
        const stars = '⭐'.repeat(Math.floor(rating));
        return `
            <div class="rating" data-rating="${rating}">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${reviews})</span>
            </div>
        `;
    }

    /**
     * Inicializa los eventos de los productos
     */
    initializeProductEvents() {
        // Eventos para agregar al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                this.handleAddToCart(productId);
            });
        });

        // Eventos para las imágenes
        document.querySelectorAll('.product-image').forEach(image => {
            image.addEventListener('click', (e) => {
                const productId = e.target.closest('.product-card').dataset.id;
                this.showProductDetail(productId);
            });
        });
    }

    /**
     * Maneja la adición de productos al carrito
     */
    handleAddToCart(productId) {
        const product = this.findProduct(productId);
        if (product && typeof cart !== 'undefined') {
            cart.addItem(product);
            this.showNotification(`${product.name} agregado al carrito`);
        }
    }

    /**
     * Encuentra un producto por su ID
     */
    findProduct(productId) {
        for (const category in this.products) {
            const product = this.products[category].find(p => p.id === productId);
            if (product) return product;
        }
        return null;
    }

    /**
     * Muestra el detalle de un producto
     */
    showProductDetail(productId) {
        const product = this.findProduct(productId);
        if (!product) return;

        // Crear y mostrar modal con detalles del producto
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="product-modal-content">
                <button class="close-modal">✕</button>
                <div class="product-detail">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <div class="product-tags">
                            ${this.createTags(product.tags)}
                        </div>
                        <div class="product-meta">
                            ${this.createRating(product.rating, product.reviews)}
                            <div class="price">$${product.price.toFixed(2)}</div>
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 100);

        // Event listeners del modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });

        modal.querySelector('.add-to-cart').addEventListener('click', () => {
            this.handleAddToCart(product.id);
        });
    }

    /**
     * Muestra una notificación
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'product-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar el cargador de productos
document.addEventListener('DOMContentLoaded', () => {
    const productLoader = new ProductLoader();
});