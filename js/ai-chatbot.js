// AI Chatbot for Braidly - Landing Page
class BraidlyChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.knowledgeBase = this.initKnowledgeBase();
        this.init();
    }

    initKnowledgeBase() {
        return {
            greeting: [
                "Hello! I'm your Braidly assistant. How can I help you today?",
                "Hi there! Welcome to Braidly. What would you like to know?",
                "Hey! I'm here to help you with anything about Braidly. What's on your mind?"
            ],
            booking: {
                keywords: ['book', 'appointment', 'schedule', 'reserve', 'booking'],
                response: "To book an appointment:\n\n1. Sign up or log in to your account\n2. Search for braiders in your area\n3. Browse their portfolios and reviews\n4. Select your desired style and time slot\n5. Complete secure payment through our escrow system\n\nWould you like me to guide you through the sign-up process?"
            },
            payment: {
                keywords: ['pay', 'payment', 'cost', 'price', 'escrow', 'money', 'fee'],
                response: "Braidly uses a secure escrow payment system:\n\n✓ Your payment is held safely until service completion\n✓ Funds are only released after you confirm satisfaction\n✓ We accept all major credit cards and digital wallets\n✓ No hidden fees - you see the full price upfront\n✓ Dispute resolution available if needed\n\nThis protects both customers and braiders!"
            },
            braider: {
                keywords: ['become braider', 'join', 'earn', 'braider signup', 'professional'],
                response: "Join Braidly as a professional braider:\n\n✓ Set your own prices and schedule\n✓ Reach more clients in your area\n✓ Secure payment processing\n✓ Build your portfolio and reputation\n✓ Mobile and salon options available\n\nReady to start earning? Click 'Become a Braider' in the menu or sign up now!"
            },
            styles: {
                keywords: ['style', 'braid type', 'knotless', 'box braids', 'cornrows', 'twists'],
                response: "We offer a wide variety of braiding styles:\n\n• Box Braids - Classic and versatile\n• Knotless Braids - Gentle on edges\n• Cornrows - Sleek and stylish\n• Twists - Natural and protective\n• Kids Braids - Age-appropriate styles\n• Custom Styles - Your imagination!\n\nBrowse our styles gallery or search for braiders specializing in your preferred style."
            },
            safety: {
                keywords: ['safe', 'verify', 'verification', 'trust', 'secure', 'background'],
                response: "Your safety is our priority:\n\n✓ All braiders undergo ID verification\n✓ Background checks available\n✓ Real reviews from verified customers\n✓ Secure escrow payment protection\n✓ 24/7 customer support\n✓ Dispute resolution system\n\nWe carefully vet all professionals on our platform!"
            },
            location: {
                keywords: ['location', 'area', 'near me', 'find', 'where'],
                response: "Finding braiders near you is easy:\n\n1. Enter your location in the search bar\n2. Browse verified braiders in your area\n3. Filter by style, price, and availability\n4. Check ratings and portfolios\n5. Book your appointment!\n\nWe're available in major cities across the country and expanding daily."
            },
            support: {
                keywords: ['help', 'support', 'contact', 'problem', 'issue'],
                response: "We're here to help 24/7:\n\n📧 Email: support@braidly.com\n📱 Phone: 1-800-BRAIDLY\n💬 Live Chat: Available on your dashboard\n🎫 Submit a ticket through your account\n\nOur average response time is under 2 hours!"
            },
            hours: {
                keywords: ['hours', 'time', 'when', 'available', 'open'],
                response: "Braidly operates 24/7:\n\n• Book appointments anytime\n• Braiders set their own schedules\n• Customer support available 24/7\n• Most braiders offer flexible hours including evenings and weekends\n\nFind a time that works for you!"
            },
            demo: {
                keywords: ['demo', 'test', 'try', 'trial'],
                response: "Want to explore Braidly?\n\nDemo Accounts Available:\n\n👤 Customer: customer@braidly.com / Customer123!\n💇 Braider: braider@braidly.com / Braider123!\n⚙️ Admin: admin@braidly.com / Admin123!\n\nClick 'Demo Access' in the menu to learn more!"
            }
        };
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="braidly-chatbot" class="chatbot-container">
                <!-- Chat Button -->
                <button id="chat-toggle-btn" class="chat-toggle-btn" aria-label="Open chat">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge">1</span>
                </button>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <img src="assets/images/WhatsApp Image 2026-02-25 at 3.18.01 AM.jpeg" alt="Braidly" class="chat-logo" style="background: white; filter: brightness(1.2) contrast(1.1);">
                            <div>
                                <h4>Braidly Assistant</h4>
                                <span class="chat-status"><i class="fas fa-circle"></i> Online</span>
                            </div>
                        </div>
                        <button id="chat-close-btn" class="chat-close-btn" aria-label="Close chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chat-quick-actions">
                        <button class="quick-action-btn" data-action="booking">📅 How to Book</button>
                        <button class="quick-action-btn" data-action="payment">💳 Payment Info</button>
                        <button class="quick-action-btn" data-action="braider">💼 Become a Braider</button>
                    </div>
                    
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" class="chat-input" placeholder="Ask me anything..." autocomplete="off">
                        <button id="chat-send-btn" class="chat-send-btn" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = chatHTML;
        document.body.appendChild(container.firstElementChild);

        this.addChatStyles();
    }

    addChatStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .chat-toggle-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                position: relative;
                animation: pulse 2s infinite;
            }

            .chat-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
            }

            .chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #F56565;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                font-size: 12px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
            }

            @keyframes pulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
                50% { box-shadow: 0 4px 30px rgba(102, 126, 234, 0.7); }
            }

            .chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .chat-window.active {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            .chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chat-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chat-logo {
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 50%;
                padding: 6px;
            }

            .chat-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .chat-status {
                font-size: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .chat-status i {
                font-size: 8px;
                color: #48BB78;
                animation: blink 2s infinite;
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }

            .chat-close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .chat-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                background: #F7FAFC;
            }

            .chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chat-messages::-webkit-scrollbar-thumb {
                background: #CBD5E0;
                border-radius: 3px;
            }

            .chat-message {
                margin-bottom: 16px;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message-bot {
                display: flex;
                gap: 8px;
            }

            .message-user {
                display: flex;
                justify-content: flex-end;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                flex-shrink: 0;
            }

            .message-content {
                max-width: 75%;
                padding: 12px 16px;
                border-radius: 16px;
                line-height: 1.5;
                font-size: 14px;
            }

            .message-bot .message-content {
                background: white;
                color: #2D3748;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .message-user .message-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-bottom-right-radius: 4px;
            }

            .message-time {
                font-size: 11px;
                color: #A0AEC0;
                margin-top: 4px;
                text-align: right;
            }

            .chat-quick-actions {
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #E2E8F0;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .quick-action-btn {
                padding: 8px 12px;
                background: #F7FAFC;
                border: 1px solid #E2E8F0;
                border-radius: 20px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }

            .quick-action-btn:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
                transform: translateY(-2px);
            }

            .chat-input-container {
                padding: 16px;
                background: white;
                border-radius: 0 0 16px 16px;
                display: flex;
                gap: 8px;
            }

            .chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #E2E8F0;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s ease;
            }

            .chat-input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .chat-send-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chat-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                width: fit-content;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .typing-dot {
                width: 8px;
                height: 8px;
                background: #CBD5E0;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            @media (max-width: 480px) {
                .chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                    bottom: 80px;
                    right: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        // Wait for DOM to be fully ready
        setTimeout(() => {
            const toggleBtn = document.getElementById('chat-toggle-btn');
            const navChatBtn = document.getElementById('ai-chat-toggle');
            const footerChatBtn = document.getElementById('footer-ai-chat-toggle');
            const closeBtn = document.getElementById('chat-close-btn');
            const sendBtn = document.getElementById('chat-send-btn');
            const input = document.getElementById('chat-input');
            const quickActions = document.querySelectorAll('.quick-action-btn');

            console.log('AI Chatbot: Attaching event listeners...');
            console.log('Floating button found:', !!toggleBtn);
            console.log('Navbar button found:', !!navChatBtn);
            console.log('Footer button found:', !!footerChatBtn);

            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Floating chat button clicked');
                    this.toggleChat();
                });
            }
            
            if (navChatBtn) {
                navChatBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Navbar chat button clicked');
                    this.toggleChat();
                });
            }

            if (footerChatBtn) {
                footerChatBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Footer chat button clicked');
                    this.toggleChat();
                });
            }
            
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleChat();
                });
            }
            
            if (sendBtn) {
                sendBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.sendMessage();
                });
            }
            
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
            }

            quickActions.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    this.handleQuickAction(action);
                });
            });

            console.log('AI Chatbot: Event listeners attached successfully');
        }, 500);
    }

    toggleChat() {
        console.log('toggleChat called, current state:', this.isOpen);
        const chatWindow = document.getElementById('chat-window');
        const badge = document.querySelector('.chat-badge');
        
        if (!chatWindow) {
            console.error('Chat window not found!');
            return;
        }
        
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('active');
        
        console.log('Chat window toggled, new state:', this.isOpen);
        
        if (this.isOpen && badge) {
            badge.style.display = 'none';
        }
    }

    addWelcomeMessage() {
        const greeting = this.knowledgeBase.greeting[Math.floor(Math.random() * this.knowledgeBase.greeting.length)];
        this.addBotMessage(greeting);
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateResponse(message);
                this.addBotMessage(response);
            }, 1000 + Math.random() * 1000);
        }, 300);
    }

    handleQuickAction(action) {
        const responses = {
            booking: this.knowledgeBase.booking.response,
            payment: this.knowledgeBase.payment.response,
            braider: this.knowledgeBase.braider.response
        };
        
        this.addBotMessage(responses[action] || "I can help you with that!");
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check each category in knowledge base
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (key === 'greeting') continue;
            
            if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return data.response;
            }
        }
        
        // Default response
        return "I'd be happy to help! Here are some things I can assist you with:\n\n• Booking appointments\n• Payment and pricing\n• Becoming a braider\n• Available styles\n• Safety and verification\n• Finding braiders near you\n\nWhat would you like to know more about?";
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message message-user';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(text)}
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message message-bot';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${this.formatMessage(text)}
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message message-bot';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    formatMessage(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BraidlyChatbot();
    });
} else {
    new BraidlyChatbot();
}
