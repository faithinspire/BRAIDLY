// BRAIDLY SUPER INTELLIGENT CHATBOT - CONTEXT-AWARE, PERSONALIZED

(function() {
    'use strict';

    // Conversation context & memory
    let conversationHistory = [];
    let userContext = {
        role: null,
        name: null,
        lastTopic: null,
        preferences: {}
    };

    // Initialize user context from auth
    function initUserContext() {
        try {
            const user = JSON.parse(localStorage.getItem('BRAIDLY_USER') || '{}');
            if (user.id) {
                userContext.role = user.role || 'customer';
                userContext.name = user.fullName || user.email?.split('@')[0] || 'there';
            }
        } catch (e) {
            console.log('No user context available');
        }
    }

    // Create chatbot HTML
    const chatbotHTML = `
        <div id="braidly-chatbot" style="position: fixed; bottom: 90px; right: 20px; z-index: 9998;">
            <button id="chatbot-toggle" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
                💬
            </button>
            <div id="chatbot-window" style="display: none; position: absolute; bottom: 70px; right: 0; width: 350px; height: 500px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); flex-direction: column;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; font-size: 16px;">Braidly AI Assistant</h4>
                        <small id="chatbot-status">🟢 Online & Learning</small>
                    </div>
                    <button id="chatbot-close" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px;">✕</button>
                </div>
                <div id="chatbot-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #f7fafc;">
                    <div style="background: white; padding: 12px; border-radius: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div id="chatbot-greeting">Hello! I'm your intelligent Braidly assistant. How can I help you today?</div>
                    </div>
                </div>
                <div style="padding: 16px; background: white; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
                    <div id="chatbot-suggestions" style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; display: none;"></div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="chatbot-input" placeholder="Ask me anything..." style="flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 24px; outline: none; font-size: 14px;">
                        <button id="chatbot-send" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; cursor: pointer; font-size: 18px; transition: transform 0.2s;">➤</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add chatbot to page
    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        initUserContext();

        const toggle = document.getElementById('chatbot-toggle');
        const close = document.getElementById('chatbot-close');
        const chatWindow = document.getElementById('chatbot-window');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        const messages = document.getElementById('chatbot-messages');
        const greeting = document.getElementById('chatbot-greeting');
        const suggestions = document.getElementById('chatbot-suggestions');

        // Personalized greeting
        if (userContext.name) {
            greeting.textContent = `Hello ${userContext.name}! 👋 I'm your intelligent Braidly assistant. How can I help you today?`;
        }

        // Toggle chatbot with animation
        toggle.addEventListener('click', function() {
            const isHidden = chatWindow.style.display === 'none';
            chatWindow.style.display = isHidden ? 'flex' : 'none';
            toggle.style.transform = isHidden ? 'scale(0.9)' : 'scale(1)';
            if (isHidden) showSmartSuggestions();
        });

        // Close chatbot
        close.addEventListener('click', function() {
            chatWindow.style.display = 'none';
            toggle.style.transform = 'scale(1)';
        });

        // Show smart suggestions based on context
        function showSmartSuggestions() {
            const suggestionsList = getSuggestions();
            if (suggestionsList.length === 0) return;
            
            suggestions.innerHTML = '';
            suggestionsList.forEach(function(text) {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.cssText = 'padding: 6px 12px; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 16px; font-size: 12px; cursor: pointer; transition: all 0.2s;';
                btn.onmouseover = function() { this.style.background = '#edf2f7'; };
                btn.onmouseout = function() { this.style.background = '#f7fafc'; };
                btn.onclick = function() {
                    input.value = text;
                    sendMessage();
                };
                suggestions.appendChild(btn);
            });
            suggestions.style.display = 'flex';
        }

        function getSuggestions() {
            if (userContext.role === 'braider') {
                return ['How to get more bookings?', 'Pricing tips', 'Manage schedule'];
            } else if (userContext.role === 'customer') {
                return ['Book appointment', 'Popular styles', 'Find braiders'];
            }
            return ['Book appointment', 'Become a braider', 'Popular styles'];
        }

        // Send message with typing indicator
        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;

            // Add user message
            const userMsg = document.createElement('div');
            userMsg.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border-radius: 12px; margin-bottom: 12px; text-align: right; margin-left: 40px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); animation: slideIn 0.3s;';
            userMsg.textContent = text;
            messages.appendChild(userMsg);

            // Store in history
            conversationHistory.push({ role: 'user', text: text });

            input.value = '';
            suggestions.style.display = 'none';

            // Typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.id = 'typing-indicator';
            typingMsg.style.cssText = 'background: white; padding: 12px; border-radius: 12px; margin-bottom: 12px; margin-right: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);';
            typingMsg.innerHTML = '<span style="opacity: 0.5;">Thinking...</span>';
            messages.appendChild(typingMsg);
            messages.scrollTop = messages.scrollHeight;

            // Add bot response with delay
            setTimeout(function() {
                typingMsg.remove();
                const response = getIntelligentResponse(text);
                const botMsg = document.createElement('div');
                botMsg.style.cssText = 'background: white; padding: 12px; border-radius: 12px; margin-bottom: 12px; margin-right: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); animation: slideIn 0.3s; white-space: pre-line;';
                botMsg.textContent = response;
                messages.appendChild(botMsg);
                
                // Store in history
                conversationHistory.push({ role: 'bot', text: response });
                
                messages.scrollTop = messages.scrollHeight;
                showSmartSuggestions();
            }, 800);
        }

        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });

        // SUPER INTELLIGENT RESPONSE ENGINE
        function getIntelligentResponse(text) {
            const lowerText = text.toLowerCase();
            
            // Context-aware responses
            const hasContext = conversationHistory.length > 1;
            const lastBotMessage = hasContext ? conversationHistory[conversationHistory.length - 2]?.text : '';
            
            // Update last topic
            userContext.lastTopic = detectTopic(lowerText);
            
            // Multi-turn conversation handling
            if (hasContext && (lowerText.includes('yes') || lowerText.includes('yeah') || lowerText.includes('sure'))) {
                return handleFollowUp(lastBotMessage, true);
            }
            if (hasContext && (lowerText.includes('no') || lowerText.includes('nope') || lowerText.includes('not really'))) {
                return handleFollowUp(lastBotMessage, false);
            }
            if (lowerText.includes('more') || lowerText.includes('tell me more') || lowerText.includes('details')) {
                return getDetailedInfo(userContext.lastTopic);
            }
            
            // Greetings
            if (/^(hi|hello|hey|good morning|good afternoon)/.test(text)) {
                return "Hello! 👋 I'm your Braidly AI assistant. I can help you with:\n\n📅 Booking appointments\n💳 Payment & pricing\n💼 Becoming a braider\n💇‍♀️ Braiding styles\n🛡️ Safety & verification\n📍 Finding braiders\n\nWhat would you like to know?";
            }
            
            // Thank you
            if (/thank|thanks/.test(text)) {
                return "You're welcome! 😊 Anything else I can help with? I'm here 24/7!";
            }
            
            // Booking
            if (text.includes('book') || text.includes('appointment') || text.includes('schedule')) {
                return "📅 Booking is easy!\n\n1️⃣ Search braiders in your area\n2️⃣ Browse portfolios & reviews\n3️⃣ Select style & time\n4️⃣ Pay securely (escrow)\n5️⃣ Get confirmation\n\n💡 Your payment is protected until service completion!";
            }
            
            // Payment
            if (text.includes('pay') || text.includes('price') || text.includes('cost') || text.includes('money')) {
                return "💳 Secure Escrow Payments:\n\n✅ Payment held safely\n✅ Released after service\n✅ Full refund if issues\n✅ No hidden fees\n✅ All cards accepted\n\nPrices: $80-$250 depending on style & length";
            }
            
            // Become braider
            if (text.includes('braider') || text.includes('join') || text.includes('earn') || text.includes('work')) {
                return "💼 Join as a Braider!\n\n✨ Set your own prices\n✨ Flexible schedule\n✨ Reach more clients\n✨ Secure payments\n✨ Build your brand\n\n📝 Sign up → Get verified → Start earning!\nAverage: $2,000-$5,000/month";
            }
            
            // Styles
            if (text.includes('style') || text.includes('braid') || text.includes('knotless') || text.includes('box') || text.includes('cornrow')) {
                return "💇‍♀️ Popular Styles:\n\n🌟 Box Braids - Classic\n✨ Knotless - Gentle on edges\n💫 Cornrows - Sleek\n🌀 Twists - Protective\n👧 Kids Braids\n🎨 Custom styles\n\nBrowse our gallery for inspiration!";
            }
            
            // Safety
            if (text.includes('safe') || text.includes('verify') || text.includes('trust') || text.includes('secure')) {
                return "🛡️ Your Safety First!\n\n✅ ID Verification required\n✅ Background checks available\n✅ Real verified reviews\n✅ Escrow protection\n✅ 24/7 support\n✅ Dispute resolution\n\n50,000+ safe appointments!";
            }
            
            // Location
            if (text.includes('location') || text.includes('near') || text.includes('find') || text.includes('where')) {
                return "📍 Find Braiders Near You:\n\n1️⃣ Use search bar\n2️⃣ Enter city/ZIP\n3️⃣ Or enable GPS\n4️⃣ See results by distance\n5️⃣ Filter by style\n\nDefault radius: 25 miles";
            }
            
            // Time/Duration
            if (text.includes('long') || text.includes('time') || text.includes('hour') || text.includes('duration')) {
                return "⏰ Typical Times:\n\n• Box Braids: 4-8 hrs\n• Knotless: 5-9 hrs\n• Cornrows: 2-4 hrs\n• Twists: 3-6 hrs\n• Kids: 2-4 hrs\n\nVaries by hair length & thickness";
            }
            
            // Mobile service
            if (text.includes('mobile') || text.includes('come to me') || text.includes('home') || text.includes('visit')) {
                return "🚗 Mobile Service:\n\nMany braiders come to you!\n✅ At your home\n✅ All supplies included\n✅ Usually $20-50 extra\n✅ Great for groups\n\nFilter by 'Mobile Available'";
            }
            
            // Cancel/Refund
            if (text.includes('cancel') || text.includes('refund') || text.includes('reschedule')) {
                return "🔄 Cancellation:\n\n• 24+ hrs before: Full refund\n• Within 24 hrs: 50% refund\n• No-show: No refund\n• Reschedule anytime\n\nGo to My Bookings → Cancel";
            }
            
            // Help/Support
            if (text.includes('help') || text.includes('support') || text.includes('contact')) {
                return "💬 24/7 Support:\n\n📧 support@braidly.com\n📱 1-800-BRAIDLY\n💬 Live chat (here!)\n🎫 Submit ticket\n\n⚡ Response: Under 2 hours";
            }
            
            // Default
            return "I'd love to help! 🤔 I can assist with:\n\n📅 Booking appointments\n💳 Payment & pricing\n💼 Becoming a braider\n💇‍♀️ Braiding styles\n🛡️ Safety & verification\n📍 Finding braiders\n⏰ Appointment times\n🚗 Mobile service\n\nWhat would you like to know?";
        }
    });

})();
