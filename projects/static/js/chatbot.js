// Enhanced Floating Chatbot for M-Erits
class MEritsChatbot {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createChatbot();
        this.bindEvents();
    }

    createChatbot() {
        // Create floating button
        this.chatBtn = document.createElement("div");
        this.chatBtn.innerHTML = "💬";
        this.chatBtn.id = "merits-chatbot-btn";
        this.chatBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #d71a1a, #000000);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(215, 26, 26, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
            animation: float 3s ease-in-out infinite;
        `;

        // Create chat window
        this.chatBox = document.createElement("div");
        this.chatBox.id = "merits-chatbot-box";
        this.chatBox.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 450px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: none;
            flex-direction: column;
            border: 2px solid #d71a1a;
            overflow: hidden;
        `;

        this.chatBox.innerHTML = `
            <div id="merits-chat-header" style="
                background: linear-gradient(135deg, #d71a1a, #000000);
                color: white;
                padding: 15px 20px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>M-Erits Assistant</span>
                <button id="merits-chat-close" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                ">×</button>
            </div>
            <div id="merits-chat-messages" style="
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8f8f8;
            "></div>
            <div style="padding: 15px; border-top: 1px solid #e5e5e5;">
                <input id="merits-chat-input" type="text" placeholder="Type your message..." style="
                    width: 100%;
                    padding: 12px 15px;
                    border: 2px solid #e5e5e5;
                    border-radius: 25px;
                    outline: none;
                ">
            </div>
        `;

        document.body.appendChild(this.chatBtn);
        document.body.appendChild(this.chatBox);

        // Add initial bot message
        this.addBotMessage("Hello! I'm your M-Erits assistant. How can I help you with tax filings today?");
    }

    bindEvents() {
        this.chatBtn.addEventListener('click', () => this.toggleChat());
        this.chatBox.querySelector('#merits-chat-close').addEventListener('click', () => this.toggleChat());
        
        const input = this.chatBox.querySelector('#merits-chat-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage(input.value);
                input.value = '';
            }
        });

        // Add hover effects
        this.chatBtn.addEventListener('mouseenter', () => {
            this.chatBtn.style.transform = 'scale(1.1)';
            this.chatBtn.style.boxShadow = '0 8px 25px rgba(215, 26, 26, 0.6)';
        });

        this.chatBtn.addEventListener('mouseleave', () => {
            this.chatBtn.style.transform = 'scale(1)';
            this.chatBtn.style.boxShadow = '0 5px 20px rgba(215, 26, 26, 0.4)';
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatBox.style.display = this.isOpen ? 'flex' : 'none';
        this.chatBtn.innerHTML = this.isOpen ? '✕' : '💬';
        
        if (this.isOpen) {
            this.chatBox.querySelector('#merits-chat-input').focus();
        }
    }

    addBotMessage(text) {
        const messages = this.chatBox.querySelector('#merits-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        messageDiv.innerHTML = text;
        messageDiv.style.cssText = `
            background: linear-gradient(135deg, #d71a1a, #b91c1c);
            color: white;
            padding: 10px 15px;
            border-radius: 15px;
            margin-bottom: 10px;
            max-width: 80%;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
            animation: messageSlide 0.3s ease;
        `;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    addUserMessage(text) {
        const messages = this.chatBox.querySelector('#merits-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = text;
        messageDiv.style.cssText = `
            background: #000000;
            color: white;
            padding: 10px 15px;
            border-radius: 15px;
            margin-bottom: 10px;
            max-width: 80%;
            align-self: flex-end;
            margin-left: auto;
            border-bottom-right-radius: 5px;
            animation: messageSlide 0.3s ease;
        `;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    sendMessage(text) {
        if (text.trim() === '') return;

        this.addUserMessage(text);
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "I can help you generate PRN numbers for your tax filings.",
                "For WHT-Rental, make sure you have all landlord details ready.",
                "You can request an SDK push after generating your PRN.",
                "Check your filing history to track previous submissions.",
                "Need help with specific tax rates? I can guide you through the process."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addBotMessage(randomResponse);
        }, 1000);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MEritsChatbot();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }
    
    @keyframes messageSlide {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .bot-message, .user-message {
        animation: messageSlide 0.3s ease !important;
    }
`;
document.head.appendChild(style);