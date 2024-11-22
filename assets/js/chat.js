/**
 * Clase para manejar la funcionalidad del chat en vivo
 */
class LiveChat {
    constructor() {
        // Estado del chat
        this.isOpen = false;
        this.isStarted = false;
        this.isTyping = false;
        this.messageQueue = [];
        this.typingTimeout = null;
        this.visitorInfo = null;

        // Referencias DOM
        this.chatWidget = document.getElementById('chatWidget');
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = null;
        this.typingIndicator = null;

        // Respuestas predefinidas
        this.responses = {
            greeting: [
                "¡Hola! ¿En qué puedo ayudarte hoy?",
                "¡Bienvenido! ¿Cómo puedo asistirte?",
                "¡Hola! Estoy aquí para ayudarte."
            ],
            menu: [
                "Puedes ver nuestro menú completo en la sección 'Menú'. ¿Te gustaría que te recomiende algo en particular?",
                "Tenemos una gran variedad de pizzas y hamburguesas. ¿Qué tipo de comida prefieres?"
            ],
            horario: [
                "Estamos abiertos todos los días de 11:00 AM a 11:00 PM.",
                "Nuestro horario de atención es de 11:00 AM a 11:00 PM, los 7 días de la semana."
            ],
            delivery: [
                "Sí, hacemos entregas a domicilio. El tiempo estimado de entrega es de 30-45 minutos dependiendo de tu ubicación.",
                "¡Claro! Realizamos entregas a domicilio. ¿Te gustaría hacer un pedido?"
            ],
            default: [
                "Gracias por tu mensaje. ¿Hay algo más en lo que pueda ayudarte?",
                "Entiendo. ¿Necesitas información adicional sobre algo en particular?",
                "¿Hay algo más que te gustaría saber?"
            ]
        };

        // Quick replies predefinidas
        this.quickReplies = [
            { text: "Ver menú", action: "menu" },
            { text: "Horarios", action: "horario" },
            { text: "Delivery", action: "delivery" },
            { text: "Hacer reserva", action: "reserva" }
        ];

        this.init();
    }

    /**
     * Inicializa el chat
     */
    init() {
        this.createChatWindow();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    /**
     * Crea la ventana del chat
     */
    createChatWindow() {
        this.chatWindow.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <span>Chat en vivo</span>
                    <div class="agent-status">
                        <span class="status-dot"></span>
                        <span>Agente en línea</span>
                    </div>
                </div>
                <button class="close-chat" id="closeChat">✕</button>
            </div>

            <div class="chat-welcome" id="chatWelcome">
                <h3>¡Bienvenido a nuestro chat!</h3>
                <form class="start-chat-form" id="startChatForm">
                    <input type="text" class="welcome-input" placeholder="Tu nombre" required id="visitorName">
                    <input type="email" class="welcome-input" placeholder="Tu email" required id="visitorEmail">
                    <button type="submit" class="start-chat-button">Iniciar Chat</button>
                </form>
            </div>

            <div class="chat-messages" id="chatMessages"></div>
            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>

            <div class="quick-replies" id="quickReplies"></div>

            <div class="chat-input-container">
                <form class="chat-form" id="chatForm">
                    <input type="text" class="chat-input" placeholder="Escribe tu mensaje..." id="chatInput">
                    <button type="submit" class="send-button">➤</button>
                </form>
            </div>
        `;

        // Actualizar referencias después de crear la ventana
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.renderQuickReplies();
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Toggle del chat
        this.chatButton.addEventListener('click', () => this.toggleChat());
        document.getElementById('closeChat').addEventListener('click', () => this.toggleChat());

        // Formulario de inicio
        document.getElementById('startChatForm').addEventListener('submit', (e) => this.handleStartChat(e));

        // Formulario de mensajes
        document.getElementById('chatForm').addEventListener('submit', (e) => this.handleSubmit(e));

        // Input handling
        const chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('input', () => this.handleTyping());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                document.getElementById('chatForm').dispatchEvent(new Event('submit'));
            }
        });

        // Cerrar chat al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.chatWindow.contains(e.target) && 
                !this.chatButton.contains(e.target) && 
                this.isOpen) {
                this.toggleChat();
            }
        });
    }

    /**
     * Maneja el inicio del chat
     */
    handleStartChat(e) {
        e.preventDefault();
        const name = document.getElementById('visitorName').value;
        const email = document.getElementById('visitorEmail').value;
        
        this.visitorInfo = { name, email };
        this.isStarted = true;
        
        document.getElementById('chatWelcome').style.display = 'none';
        this.chatMessages.style.display = 'flex';
        
        // Mensaje de bienvenida
        this.addMessage(
            `¡Hola ${name}! ¿En qué puedo ayudarte hoy?`,
            'agent'
        );

        this.saveChatHistory();
    }

    /**
     * Maneja el envío de mensajes
     */
    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (message && this.isStarted) {
            this.addMessage(message, 'user');
            input.value = '';
            this.processMessage(message);
        }
    }

    /**
     * Procesa el mensaje y genera una respuesta
     */
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response;

        // Simular tiempo de respuesta
        this.showTypingIndicator();

        setTimeout(() => {
            if (lowerMessage.includes('menú') || lowerMessage.includes('carta')) {
                response = this.getRandomResponse('menu');
            } else if (lowerMessage.includes('horario') || lowerMessage.includes('abierto')) {
                response = this.getRandomResponse('horario');
            } else if (lowerMessage.includes('delivery') || lowerMessage.includes('domicilio')) {
                response = this.getRandomResponse('delivery');
            } else if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días')) {
                response = this.getRandomResponse('greeting');
            } else {
                response = this.getRandomResponse('default');
            }

            this.hideTypingIndicator();
            this.addMessage(response, 'agent');
        }, 1000 + Math.random() * 1000);
    }

    /**
     * Agrega un mensaje al chat
     */
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const messageText = document.createElement('div');
        messageText.textContent = text;
        
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('message-time');
        timeDiv.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(messageText);
        messageDiv.appendChild(timeDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        this.saveChatHistory();
    }

    /**
     * Maneja el indicador de escritura
     */
    handleTyping() {
        clearTimeout(this.typingTimeout);
        this.isTyping = true;
        
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
        }, 1000);
    }

    /**
     * Muestra el indicador de escritura
     */
    showTypingIndicator() {
        this.typingIndicator.classList.add('active');
        this.scrollToBottom();
    }

    /**
     * Oculta el indicador de escritura
     */
    hideTypingIndicator() {
        this.typingIndicator.classList.remove('active');
    }

    /**
     * Renderiza las quick replies
     */
    renderQuickReplies() {
        const container = document.getElementById('quickReplies');
        container.innerHTML = this.quickReplies.map(reply => `
            <button class="quick-reply" data-action="${reply.action}">
                ${reply.text}
            </button>
        `).join('');

        container.querySelectorAll('.quick-reply').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const message = button.textContent.trim();
                document.getElementById('chatInput').value = message;
                document.getElementById('chatForm').dispatchEvent(new Event('submit'));
            });
        });
    }

    /**
     * Obtiene una respuesta aleatoria del tipo especificado
     */
    getRandomResponse(type) {
        const responses = this.responses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Obtiene la hora actual formateada
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    /**
     * Hace scroll hasta el último mensaje
     */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    /**
     * Guarda el historial del chat
     */
    saveChatHistory() {
        const chatHistory = {
            visitorInfo: this.visitorInfo,
            messages: Array.from(this.chatMessages.children).map(msg => ({
                text: msg.firstChild.textContent,
                sender: msg.classList.contains('user') ? 'user' : 'agent',
                time: msg.lastChild.textContent
            }))
        };
        
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    /**
     * Carga el historial del chat
     */
    loadChatHistory() {
        const savedChat = localStorage.getItem('chatHistory');
        if (savedChat) {
            const chatHistory = JSON.parse(savedChat);
            this.visitorInfo = chatHistory.visitorInfo;
            
            if (this.visitorInfo) {
                this.isStarted = true;
                document.getElementById('chatWelcome').style.display = 'none';
                this.chatMessages.style.display = 'flex';
                
                chatHistory.messages.forEach(msg => {
                    this.addMessage(msg.text, msg.sender);
                });
            }
        }
    }

    /**
     * Alterna la visibilidad del chat
     */
    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('active');
        
        if (this.isOpen && !this.isStarted) {
            document.getElementById('chatWelcome').style.display = 'block';
            this.chatMessages.style.display = 'none';
        }
    }
}

// Inicializar el chat
const chat = new LiveChat();