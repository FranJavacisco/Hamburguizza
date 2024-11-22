"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Clase para manejar la carga dinámica de productos
 */
var ProductLoader =
/*#__PURE__*/
function () {
  function ProductLoader() {
    _classCallCheck(this, ProductLoader);

    // Base de datos de productos
    this.products = {
      pizzas: [{
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
      }, {
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
      }, {
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
      }, {
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
      }],
      burgers: [// Aquí irían las hamburguesas con la misma estructura
      ]
    };
    this.init();
  }
  /**
   * Inicializa la carga de productos
   */


  _createClass(ProductLoader, [{
    key: "init",
    value: function init() {
      this.loadProducts('pizzas', 'pizzasGrid');
      this.loadProducts('burgers', 'burgersGrid');
    }
    /**
     * Carga los productos en el grid especificado
     */

  }, {
    key: "loadProducts",
    value: function loadProducts(category, gridId) {
      var _this = this;

      var grid = document.getElementById(gridId);
      if (!grid) return;
      var products = this.products[category];
      grid.innerHTML = products.map(function (product) {
        return _this.createProductCard(product);
      }).join(''); // Inicializar eventos después de cargar los productos

      this.initializeProductEvents();
    }
    /**
     * Crea el HTML para una tarjeta de producto
     */

  }, {
    key: "createProductCard",
    value: function createProductCard(product) {
      return "\n            <div class=\"product-card\" data-id=\"".concat(product.id, "\" data-category=\"").concat(product.category, "\">\n                ").concat(this.createBadges(product.badges), "\n                <img src=\"").concat(product.image, "\" alt=\"").concat(product.name, "\" class=\"product-image\">\n                <div class=\"product-info\">\n                    <h3>").concat(product.name, "</h3>\n                    <div class=\"product-tags\">\n                        ").concat(this.createTags(product.tags), "\n                    </div>\n                    <p>").concat(product.description, "</p>\n                    <div class=\"product-meta\">\n                        ").concat(this.createRating(product.rating, product.reviews), "\n                        <div class=\"price\">$").concat(product.price.toFixed(2), "</div>\n                    </div>\n                    <button class=\"add-to-cart\" data-product-id=\"").concat(product.id, "\">\n                        Agregar al Carrito\n                    </button>\n                </div>\n            </div>\n        ");
    }
    /**
     * Crea los badges del producto
     */

  }, {
    key: "createBadges",
    value: function createBadges(badges) {
      if (!badges || !badges.length) return '';
      return badges.map(function (badge) {
        return "\n            <div class=\"badge ".concat(badge.toLowerCase(), "\">").concat(badge, "</div>\n        ");
      }).join('');
    }
    /**
     * Crea las etiquetas del producto
     */

  }, {
    key: "createTags",
    value: function createTags(tags) {
      if (!tags || !tags.length) return '';
      return tags.map(function (tag) {
        return "\n            <span class=\"tag ".concat(tag.toLowerCase(), "\">").concat(tag, "</span>\n        ");
      }).join('');
    }
    /**
     * Crea el sistema de calificación
     */

  }, {
    key: "createRating",
    value: function createRating(rating, reviews) {
      var stars = '⭐'.repeat(Math.floor(rating));
      return "\n            <div class=\"rating\" data-rating=\"".concat(rating, "\">\n                <div class=\"stars\">").concat(stars, "</div>\n                <span class=\"rating-count\">(").concat(reviews, ")</span>\n            </div>\n        ");
    }
    /**
     * Inicializa los eventos de los productos
     */

  }, {
    key: "initializeProductEvents",
    value: function initializeProductEvents() {
      var _this2 = this;

      // Eventos para agregar al carrito
      document.querySelectorAll('.add-to-cart').forEach(function (button) {
        button.addEventListener('click', function (e) {
          var productId = e.target.dataset.productId;

          _this2.handleAddToCart(productId);
        });
      }); // Eventos para las imágenes

      document.querySelectorAll('.product-image').forEach(function (image) {
        image.addEventListener('click', function (e) {
          var productId = e.target.closest('.product-card').dataset.id;

          _this2.showProductDetail(productId);
        });
      });
    }
    /**
     * Maneja la adición de productos al carrito
     */

  }, {
    key: "handleAddToCart",
    value: function handleAddToCart(productId) {
      var product = this.findProduct(productId);

      if (product && typeof cart !== 'undefined') {
        cart.addItem(product);
        this.showNotification("".concat(product.name, " agregado al carrito"));
      }
    }
    /**
     * Encuentra un producto por su ID
     */

  }, {
    key: "findProduct",
    value: function findProduct(productId) {
      for (var category in this.products) {
        var product = this.products[category].find(function (p) {
          return p.id === productId;
        });
        if (product) return product;
      }

      return null;
    }
    /**
     * Muestra el detalle de un producto
     */

  }, {
    key: "showProductDetail",
    value: function showProductDetail(productId) {
      var _this3 = this;

      var product = this.findProduct(productId);
      if (!product) return; // Crear y mostrar modal con detalles del producto

      var modal = document.createElement('div');
      modal.className = 'product-modal';
      modal.innerHTML = "\n            <div class=\"product-modal-content\">\n                <button class=\"close-modal\">\u2715</button>\n                <div class=\"product-detail\">\n                    <img src=\"".concat(product.image, "\" alt=\"").concat(product.name, "\">\n                    <div class=\"product-info\">\n                        <h2>").concat(product.name, "</h2>\n                        <p>").concat(product.description, "</p>\n                        <div class=\"product-tags\">\n                            ").concat(this.createTags(product.tags), "\n                        </div>\n                        <div class=\"product-meta\">\n                            ").concat(this.createRating(product.rating, product.reviews), "\n                            <div class=\"price\">$").concat(product.price.toFixed(2), "</div>\n                        </div>\n                        <button class=\"add-to-cart\" data-product-id=\"").concat(product.id, "\">\n                            Agregar al Carrito\n                        </button>\n                    </div>\n                </div>\n            </div>\n        ");
      document.body.appendChild(modal);
      setTimeout(function () {
        return modal.classList.add('active');
      }, 100); // Event listeners del modal

      modal.querySelector('.close-modal').addEventListener('click', function () {
        modal.classList.remove('active');
        setTimeout(function () {
          return modal.remove();
        }, 300);
      });
      modal.querySelector('.add-to-cart').addEventListener('click', function () {
        _this3.handleAddToCart(product.id);
      });
    }
    /**
     * Muestra una notificación
     */

  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var notification = document.createElement('div');
      notification.className = 'product-notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(function () {
        return notification.classList.add('show');
      }, 100);
      setTimeout(function () {
        notification.classList.remove('show');
        setTimeout(function () {
          return notification.remove();
        }, 300);
      }, 3000);
    }
  }]);

  return ProductLoader;
}(); // Inicializar el cargador de productos


document.addEventListener('DOMContentLoaded', function () {
  var productLoader = new ProductLoader();
});
//# sourceMappingURL=productos.dev.js.map
