document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            // Aquí iría la lógica para procesar la suscripción
            alert(`¡Gracias por suscribirte! Te enviaremos nuestras novedades a ${email}`);
            e.target.reset();
        });
    }


// Clase para manejar la funcionalidad del footer
class FooterManager {
    constructor() {
        this.newsletterForm = document.getElementById('newsletterForm');
        this.scrollButton = document.getElementById('scrollToTop');
        this.socialLinks = document.querySelectorAll('.social-link');
        this.appButtons = document.querySelectorAll('.app-button');
        this.currentYear = new Date().getFullYear();

        this.init();
    }

    /**
     * Inicializa todas las funcionalidades del footer
     */
    init() {
        this.setupNewsletterForm();
        this.setupScrollToTop();
        this.setupSocialLinks();
        this.setupAppButtons();
        this.updateCopyright();
        this.setupLazyLoading();
        this.setupCookieConsent();
    }

    /**
     * Configura el formulario del newsletter
     */
    setupNewsletterForm() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = e.target.querySelector('input[type="email"]');
                const email = emailInput.value;

                try {
                    await this.subscribeToNewsletter(email);
                    this.showNotification('¡Gracias por suscribirte!', 'success');
                    emailInput.value = '';
                } catch (error) {
                    this.showNotification('Hubo un error. Intenta nuevamente.', 'error');
                }
            });
        }
    }

    /**
     * Simula la suscripción al newsletter
     */
    async subscribeToNewsletter(email) {
        // Simular llamada a API
        return new Promise((resolve) => {
            setTimeout(() => {
                // Aquí iría la lógica real de suscripción
                localStorage.setItem('newsletter_subscribed', email);
                resolve(true);
            }, 1000);
        });
    }

    /**
     * Configura el botón de scroll to top
     */
    setupScrollToTop() {
        if (this.scrollButton) {
            // Mostrar/ocultar botón según scroll
            window.addEventListener('scroll', () => {
                this.toggleScrollButton();
            });

            // Scroll suave al hacer click
            this.scrollButton.addEventListener('click', () => {
                this.smoothScrollToTop();
            });
        }
    }

    /**
     * Alterna la visibilidad del botón de scroll
     */
    toggleScrollButton() {
        const scrolled = window.pageYOffset;
        const threshold = 300;

        if (scrolled > threshold) {
            this.scrollButton.classList.add('visible');
        } else {
            this.scrollButton.classList.remove('visible');
        }
    }

    /**
     * Realiza el scroll suave hacia arriba
     */
    smoothScrollToTop() {
        const currentPosition = window.pageYOffset;
        const duration = 600; // ms
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            window.scrollTo(0, currentPosition * (1 - this.easeOutCubic(progress)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Función de ease para animación suave
     */
    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    /**
     * Configura los enlaces sociales
     */
    setupSocialLinks() {
        this.socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-5px) rotate(5deg)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) rotate(0)';
            });
        });
    }

    /**
     * Configura los botones de las apps
     */
    setupAppButtons() {
        this.appButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.getAttribute('data-platform');
                this.handleAppDownload(platform);
            });
        });
    }

    /**
     * Maneja la descarga de la app
     */
    handleAppDownload(platform) {
        const links = {
            ios: 'https://apps.apple.com/app/...',
            android: 'https://play.google.com/store/apps/...'
        };

        // Aquí podrías redirigir o mostrar un modal
        this.showNotification(`Redirigiendo a ${platform}...`, 'info');
    }

    /**
     * Actualiza el año del copyright
     */
    updateCopyright() {
        const copyrightElement = document.querySelector('.copyright');
        if (copyrightElement) {
            copyrightElement.textContent = copyrightElement.textContent.replace('2024', this.currentYear);
        }
    }

    /**
     * Configura lazy loading para imágenes
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('.footer img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Configura el aviso de cookies
     */
    setupCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            this.showCookieConsent();
        }
    }

    /**
     * Muestra el aviso de cookies
     */
    showCookieConsent() {
        const cookieConsent = document.createElement('div');
        cookieConsent.className = 'cookie-consent';
        cookieConsent.innerHTML = `
            <div class="cookie-content">
                <p>Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra
                <a href="/privacy">política de cookies</a>.</p>
                <button class="cookie-accept">Aceptar</button>
            </div>
        `;

        document.body.appendChild(cookieConsent);

        cookieConsent.querySelector('.cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieConsent.remove();
        });
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `footer-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Remover después de un tiempo
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar el footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const footerManager = new FooterManager();
});
});
</script>