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

    // function handleSendMessage() {
    //     const messageText = chatInput.value.trim();
    //     if (messageText) {
    //         // 添加用户消息
    //         addMessage('user', messageText);
    //         chatInput.value = '';
            
    //         // 显示思考中状态
    //         const thinkingDiv = document.createElement('div');
    //         thinkingDiv.className = 'chat-message mao thinking';
    //         thinkingDiv.innerHTML = `
    //             <div class="flex items-start">
    //                 <div class="mao-avatar mr-2 flex-shrink-0">
    //                     <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
    //                         <span class="text-lg font-bold">毛</span>
    //                     </div>
    //                 </div>
    //                 <div class="message-bubble">
    //                     <p>思考中<span class="thinking-dots">...</span></p>
    //                 </div>
    //             </div>`;
    //         chatMessages.appendChild(thinkingDiv);
    //         chatMessages.scrollTop = chatMessages.scrollHeight;
            
    //         // 模拟AI思考和回复延迟
    //         setTimeout(() => {
    //             // 移除思考中状态
    //             chatMessages.removeChild(thinkingDiv);
                
    //             // 获取毛主席回复
    //             const maoReply = maoAI.getMaoResponse(messageText);
                
    //             // 使用打字机效果添加回复
    //             addMessage('mao', maoReply, true);
    //         }, 1000 + Math.random() * 1000);
    //     }
    // }

    // if (sendMessageBtn && chatInput) {
    //     sendMessageBtn.addEventListener('click', handleSendMessage);
    //     chatInput.addEventListener('keypress', (e) => {
    //         if (e.key === 'Enter') {
    //             handleSendMessage();
    //         }
    //     });
    // }

    // presetQuestionBtns.forEach(btn => {
    //     btn.addEventListener('click', () => {
    //         const question = btn.textContent;
    //         // 添加用户消息
    //         addMessage('user', question);
            
    //         // 显示思考中状态
    //         const thinkingDiv = document.createElement('div');
    //         thinkingDiv.className = 'chat-message mao thinking';
    //         thinkingDiv.innerHTML = `
    //             <div class="flex items-start">
    //                 <div class="mao-avatar mr-2 flex-shrink-0">
    //                     <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
    //                         <span class="text-lg font-bold">毛</span>
    //                     </div>
    //                 </div>
    //                 <div class="message-bubble">
    //                     <p>思考中<span class="thinking-dots">...</span></p>
    //                 </div>
    //             </div>`;
    //         chatMessages.appendChild(thinkingDiv);
    //         chatMessages.scrollTop = chatMessages.scrollHeight;
            
    //         // 模拟AI思考和回复延迟
    //         setTimeout(() => {
    //             // 移除思考中状态
    //             chatMessages.removeChild(thinkingDiv);
                
    //             // 获取毛主席回复
    //             const maoReply = maoAI.getMaoResponse(question);
                
    //             // 使用打字机效果添加回复
    //             addMessage('mao', maoReply, true);
    //         }, 1000 + Math.random() * 1000);
    //     });
    // });

    // 提取公共逻辑到一个新函数
    function sendMessageAndGetResponse(message) {
        // 添加用户消息
        addMessage('user', message);
        
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
            const maoReply = maoAI.getMaoResponse(message);
            
            // 使用打字机效果添加回复
            addMessage('mao', maoReply, true);
        }, 1000 + Math.random() * 1000);
    }

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            chatInput.value = '';
            sendMessageAndGetResponse(messageText);
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
            sendMessageAndGetResponse(question);
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
