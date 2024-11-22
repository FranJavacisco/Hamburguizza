/**
 * Clase para manejar la funcionalidad del menú
 */
class MenuManager {
    constructor() {
        // Referencias DOM
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.productCards = document.querySelectorAll('.product-card');
        this.menuSection = document.querySelector('.menu-section');
        
        // Estado
        this.currentFilter = 'all';
        this.isAnimating = false;
        
        // Configuración de animación
        this.animationDuration = 300; // ms

        this.init();
    }

    /**
     * Inicializa el menú
     */
    init() {
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupRatingSystem();
        this.updateProductAvailability();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Event listeners para los botones de filtro
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Event listener para ordenar productos
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleSort(e));
        });

        // Event listener para búsqueda
        const searchInput = document.querySelector('.menu-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
    }

    /**
     * Maneja el filtrado de productos
     */
    async handleFilter(e) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Actualizar estado de botones
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Obtener categoría seleccionada
        const category = e.target.dataset.filter;
        this.currentFilter = category;

        // Aplicar filtro con animación
        await this.animateFilterChange(category);

        this.isAnimating = false;
    }

    /**
     * Anima el cambio de filtro
     */
    async animateFilterChange(category) {
        // Fade out
        await this.animateProducts('fade-out');

        // Filtrar productos
        this.productCards.forEach(card => {
            const shouldShow = category === 'all' || card.dataset.category.includes(category);
            card.classList.toggle('hidden', !shouldShow);
        });

        // Fade in
        await this.animateProducts('fade-in');
    }

    /**
     * Anima los productos
     */
    animateProducts(animation) {
        return new Promise(resolve => {
            const visibleCards = Array.from(this.productCards).filter(card => !card.classList.contains('hidden'));
            
            visibleCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add(animation);
                }, index * 100);
            });

            setTimeout(() => {
                visibleCards.forEach(card => card.classList.remove(animation));
                resolve();
            }, visibleCards.length * 100 + this.animationDuration);
        });
    }

    /**
     * Configura lazy loading para imágenes
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('.product-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Configura el sistema de calificaciones
     */
    setupRatingSystem() {
        const ratingContainers = document.querySelectorAll('.rating');
        
        ratingContainers.forEach(container => {
            const rating = parseFloat(container.dataset.rating);
            const stars = '⭐'.repeat(Math.floor(rating));
            container.querySelector('.stars').innerHTML = stars;
        });
    }

    /**
     * Actualiza la disponibilidad de productos
     */
    updateProductAvailability() {
        this.productCards.forEach(card => {
            const isAvailable = Math.random() > 0.1; // Simulación de disponibilidad
            if (!isAvailable) {
                card.classList.add('sold-out');
                const button = card.querySelector('.add-to-cart');
                button.disabled = true;
                button.textContent = 'Agotado';
            }
        });
    }

    /**
     * Maneja la ordenación de productos
     */
    handleSort(e) {
        const sortType = e.target.dataset.sort;
        const cards = Array.from(this.productCards);

        cards.sort((a, b) => {
            switch (sortType) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'rating':
                    return this.getRating(b) - this.getRating(a);
                case 'popularity':
                    return this.getPopularity(b) - this.getPopularity(a);
                default:
                    return 0;
            }
        });

        // Reubicar elementos ordenados
        const container = this.productCards[0].parentNode;
        cards.forEach(card => container.appendChild(card));
    }

    /**
     * Obtiene el precio de un producto
     */
    getPrice(card) {
        return parseFloat(card.querySelector('.price').textContent.replace('$', ''));
    }

    /**
     * Obtiene la calificación de un producto
     */
    getRating(card) {
        return parseFloat(card.querySelector('.rating').dataset.rating);
    }

    /**
     * Obtiene la popularidad de un producto
     */
    getPopularity(card) {
        return parseInt(card.querySelector('.rating-count').textContent.replace(/[()]/g, ''));
    }

    /**
     * Maneja la búsqueda de productos
     */
    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        this.productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase());

            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) ||
                          tags.some(tag => tag.includes(searchTerm));

            card.classList.toggle('hidden', !matches);
        });
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `menu-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }

    /**
     * Actualiza los contadores de categoría
     */
    updateCategoryCounts() {
        const categories = {};
        
        this.productCards.forEach(card => {
            const cardCategories = card.dataset.category.split(',');
            cardCategories.forEach(category => {
                categories[category] = (categories[category] || 0) + 1;
            });
        });

        this.filterButtons.forEach(button => {
            const category = button.dataset.filter;
            const count = category === 'all' ? this.productCards.length : (categories[category] || 0);
            const countSpan = button.querySelector('.category-count') || document.createElement('span');
            countSpan.className = 'category-count';
            countSpan.textContent = `(${count})`;
            if (!button.querySelector('.category-count')) {
                button.appendChild(countSpan);
            }
        });
    }
}

// Inicializar el menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const menu = new MenuManager();
});