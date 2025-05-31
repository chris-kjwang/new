// 集成增强版AI对话系统到主应用
document.addEventListener('DOMContentLoaded', () => {
    // 导入MaoAIChat类（如果在浏览器环境中，假设已经加载）
    let maoAI;
    
    try {
        // 尝试初始化MaoAIChat
        if (typeof MaoAIChat !== 'undefined') {
            maoAI = new MaoAIChat();
        } else if (typeof window.MaoAIChat !== 'undefined') {
            maoAI = new window.MaoAIChat();
        } else {
            console.warn('MaoAIChat未找到，将使用基础对话系统');
            // 使用基础对话系统的逻辑保持不变
        }
    } catch (error) {
        console.error('初始化MaoAIChat失败:', error);
    }

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const presetQuestionBtns = document.querySelectorAll('.preset-question');

    // 打字机效果函数
    function typewriterEffect(element, text, speed = 30) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // 打字完成后移除打字机效果类
                element.classList.remove('typewriter');
            }
        }
        
        element.classList.add('typewriter');
        type();
    }

    function addMessage(sender, text, useTypewriter = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        if (sender === 'mao') {
            const messageBubbleHTML = `
                <div class="flex items-start">
                    <div class="mao-avatar mr-2 flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <span class="text-lg font-bold">毛</span>
                        </div>
                    </div>
                    <div class="message-bubble">
                        <p id="latest-mao-message">${useTypewriter ? '' : text}</p>
                    </div>
                </div>`;
            
            messageDiv.innerHTML = messageBubbleHTML;
            chatMessages.appendChild(messageDiv);
            
            if (useTypewriter) {
                const messageElement = messageDiv.querySelector('#latest-mao-message');
                // 移除ID以避免重复
                messageElement.removeAttribute('id');
                // 应用打字机效果
                typewriterEffect(messageElement, text, 30);
            }
        } else { // sender === 'user'
            messageDiv.innerHTML = `
                <div class="flex items-start justify-end">
                    <div class="message-bubble user"><p>${text}</p></div>
                    <div class="user-avatar ml-2 flex-shrink-0">
                         <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <span class="text-lg font-bold">您</span>
                        </div>
                    </div>
                </div>`;
            chatMessages.appendChild(messageDiv);
        }
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getMaoResponse(userMessage) {
        // 如果增强版AI可用，使用增强版
        if (maoAI) {
            maoAI.addUserMessage(userMessage);
            const response = maoAI.generateResponse(userMessage);
            maoAI.addAIResponse(response);
            return response;
        }
        
        // 否则使用基础版回复逻辑（从app.js复制）
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('矛盾')) {
            return "矛盾是普遍存在的，要区分敌我矛盾和人民内部矛盾。对于人民内部矛盾，要用民主的方法，说服教育的方法，'团结—批评—团结'的方法去解决。";
        } else if (lowerMessage.includes('实践') || lowerMessage.includes('认识')) {
            return "实践、认识、再实践、再认识，这种形式，循环往复以至无穷，而实践和认识之每一循环的内容，都比较地进到了高一级的程度。这就是辩证唯物论的全部认识论。";
        } else if (lowerMessage.includes('学习')) {
            return "情况是在不断地变化，要使自己的思想适应新的情况，就得学习。学习的敌人是自己的满足，要认真学习一点东西，必须从不自满开始。";
        } else if (lowerMessage.includes('困难') || lowerMessage.includes('失败')) {
            return "我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。前途是光明的，道路是曲折的。下定决心，不怕牺牲，排除万难，去争取胜利。";
        } else if (lowerMessage.includes('青年') || lowerMessage.includes('年轻人')) {
            return "世界是你们的，也是我们的，但是归根结底是你们的。你们青年人朝气蓬勃，正在兴旺时期，好像早晨八九点钟的太阳。希望寄托在你们身上。";
        } else if (lowerMessage.includes('你好') || lowerMessage.includes('您好')) {
            return "同志你好！有什么问题可以问我。";
        } else {
            return "这个问题提得很好。我们要具体问题具体分析，要调查研究，才能找到正确的答案。";
        }
    }

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            // 添加用户消息
            addMessage('user', messageText);
            chatInput.value = '';
            
            // 显示思考中状态
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'chat-message mao thinking';
            thinkingDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="mao-avatar mr-2 flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <span class="text-lg font-bold">毛</span>
                        </div>
                    </div>
                    <div class="message-bubble">
                        <p>思考中<span class="thinking-dots">...</span></p>
                    </div>
                </div>`;
            chatMessages.appendChild(thinkingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // 模拟AI思考和回复延迟
            setTimeout(() => {
                // 移除思考中状态
                chatMessages.removeChild(thinkingDiv);
                
                // 获取毛主席回复
                const maoReply = getMaoResponse(messageText);
                
                // 使用打字机效果添加回复
                addMessage('mao', maoReply, true);
            }, 1000 + Math.random() * 1000);
        }
    }

    if (sendMessageBtn && chatInput) {
        sendMessageBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    presetQuestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.textContent;
            // 添加用户消息
            addMessage('user', question);
            
            // 显示思考中状态
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'chat-message mao thinking';
            thinkingDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="mao-avatar mr-2 flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <span class="text-lg font-bold">毛</span>
                        </div>
                    </div>
                    <div class="message-bubble">
                        <p>思考中<span class="thinking-dots">...</span></p>
                    </div>
                </div>`;
            chatMessages.appendChild(thinkingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // 模拟AI思考和回复延迟
            setTimeout(() => {
                // 移除思考中状态
                chatMessages.removeChild(thinkingDiv);
                
                // 获取毛主席回复
                const maoReply = getMaoResponse(question);
                
                // 使用打字机效果添加回复
                addMessage('mao', maoReply, true);
            }, 1000 + Math.random() * 1000);
        });
    });

    // 添加思考动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes thinking {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
        }
        
        .thinking-dots {
            animation: thinking 1.4s infinite;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
});
