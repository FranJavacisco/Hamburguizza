/**
 * Clase para manejar la funcionalidad del formulario de contacto
 */
class ContactForm {
    constructor() {
        // Referencias del formulario
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('contactSuccess');
        
        // Campos del formulario y sus validaciones
        this.fields = {
            name: {
                element: document.getElementById('name'),
                error: document.getElementById('nameError'),
                validate: (value) => {
                    if (!value) return 'El nombre es requerido';
                    if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
                    return '';
                }
            },
            email: {
                element: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => {
                    if (!value) return 'El correo electrónico es requerido';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
                    return '';
                }
            },
            phone: {
                element: document.getElementById('phone'),
                error: document.getElementById('phoneError'),
                validate: (value) => {
                    if (value && !/^[0-9+\s-]{8,}$/.test(value)) return 'Ingresa un número de teléfono válido';
                    return '';
                }
            },
            subject: {
                element: document.getElementById('subject'),
                error: document.getElementById('subjectError'),
                validate: (value) => {
                    if (!value) return 'Selecciona un asunto';
                    return '';
                }
            },
            message: {
                element: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: (value) => {
                    if (!value) return 'El mensaje es requerido';
                    if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
                    return '';
                }
            },
            privacy: {
                element: document.getElementById('privacy'),
                error: document.getElementById('privacyError'),
                validate: (value) => {
                    if (!value) return 'Debes aceptar la política de privacidad';
                    return '';
                }
            }
        };

        this.init();
    }

    /**
     * Inicializa el formulario
     */
    init() {
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.setupFloatingLabels();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Validación en tiempo real
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            
            // Validar al escribir
            field.element.addEventListener('input', () => {
                this.validateField(fieldName);
                this.updateSubmitButton();
            });

            // Validar al perder el foco
            field.element.addEventListener('blur', () => {
                this.validateField(fieldName);
                this.updateSubmitButton();
            });
        });

        // Envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    /**
     * Configura el contador de caracteres para el mensaje
     */
    setupCharacterCounter() {
        const messageField = this.fields.message.element;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        messageField.parentNode.appendChild(counterDiv);

        messageField.addEventListener('input', () => {
            const remaining = 1000 - messageField.value.length;
            counterDiv.textContent = `${remaining} caracteres restantes`;
            counterDiv.style.color = remaining < 50 ? '#dc3545' : '#666';
        });
    }

    /**
     * Configura las etiquetas flotantes
     */
    setupFloatingLabels() {
        Object.values(this.fields).forEach(field => {
            const input = field.element;
            const label = input.previousElementSibling;
            
            if (label && label.tagName === 'LABEL') {
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                });

                if (input.value) {
                    label.classList.add('active');
                }
            }
        });
    }

    /**
     * Valida un campo específico
     */
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = this.getFieldValue(field.element);
        const error = field.validate(value);

        if (error) {
            this.showError(field, error);
            return false;
        } else {
            this.hideError(field);
            return true;
        }
    }

    /**
     * Obtiene el valor de un campo
     */
    getFieldValue(element) {
        if (element.type === 'checkbox') {
            return element.checked;
        }
        return element.value.trim();
    }

    /**
     * Muestra un mensaje de error
     */
    showError(field, message) {
        field.element.classList.add('error');
        field.error.textContent = message;
        field.error.style.display = 'block';

        // Animación de shake
        field.element.classList.add('shake');
        setTimeout(() => {
            field.element.classList.remove('shake');
        }, 500);
    }

    /**
     * Oculta un mensaje de error
     */
    hideError(field) {
        field.element.classList.remove('error');
        field.error.style.display = 'none';
    }

    /**
     * Valida todo el formulario
     */
    validateForm() {
        let isValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    /**
     * Actualiza el estado del botón de envío
     */
    updateSubmitButton() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const isValid = this.validateForm();
        submitButton.disabled = !isValid;
    }

    /**
     * Envía el formulario
     */
    submitForm() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Deshabilitar el formulario
        this.toggleFormState(true);
        submitButton.textContent = 'Enviando...';

        // Recopilar datos del formulario
        const formData = this.getFormData();

        // Simular envío al servidor
        setTimeout(() => {
            this.handleSubmitSuccess();
            submitButton.textContent = originalText;
            this.toggleFormState(false);
        }, 2000);
    }

    /**
     * Recopila los datos del formulario
     */
    getFormData() {
        const formData = {};
        Object.keys(this.fields).forEach(fieldName => {
            formData[fieldName] = this.getFieldValue(this.fields[fieldName].element);
        });
        return formData;
    }

    /**
     * Maneja el éxito del envío
     */
    handleSubmitSuccess() {
        // Mostrar mensaje de éxito
        this.form.reset();
        this.successMessage.style.display = 'block';
        this.successMessage.classList.add('fade-in');

        // Scroll hacia el mensaje
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Ocultar mensaje después de un tiempo
        setTimeout(() => {
            this.successMessage.classList.remove('fade-in');
            this.successMessage.classList.add('fade-out');
            setTimeout(() => {
                this.successMessage.style.display = 'none';
                this.successMessage.classList.remove('fade-out');
            }, 500);
        }, 5000);
    }

    /**
     * Alterna el estado del formulario
     */
    toggleFormState(disabled) {
        Object.values(this.fields).forEach(field => {
            field.element.disabled = disabled;
        });
        this.form.querySelector('button[type="submit"]').disabled = disabled;
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Eliminar después de un tiempo
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Limpia el formulario
     */
    resetForm() {
        this.form.reset();
        Object.values(this.fields).forEach(field => {
            this.hideError(field);
        });
        this.updateSubmitButton();
    }
}

// Inicializar el formulario de contacto
const contactForm = new ContactForm();