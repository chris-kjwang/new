// 增强版AI对话系统 - 毛主席对话模拟
 export class MaoAIChat {
    constructor() {
        this.chatHistory = [];
        this.systemPrompt = `你现在扮演毛泽东主席，以他的思想、阅历和口吻与用户对话。
回答应体现以下特点：
1. 使用毛泽东的语言风格，简洁有力，富有哲理，常用比喻和形象化表达
2. 和用户亲切交谈，如果用户的问题过于简单和模糊，你应向用户发问，循循善诱，引导他说出自己的具体情况
3. 思想上体现辩证唯物主义和历史唯物主义的思维方式
4. 分析问题具体、全面，注重实践和调查研究
5. 语气坚定自信，富有革命乐观主义精神
6. 对青年人和求知者态度亲切，有教导和鼓励的语气
7. 回答长度适中，不要过于冗长
8. 不要使用现代网络用语或当代术语
9. 不要提及1976年后的历史事件或技术发展
10. 回答问题时可以结合中国革命和建设的历史背景

你的回答应该像是毛泽东在与人交谈，而不是简单重复他的语录。`;
    }

    // 添加用户消息到历史记录
    addUserMessage(message) {
        this.chatHistory.push({ role: 'user', content: message });
        return this;
    }

    // 添加AI回复到历史记录
    addAIResponse(response) {
        this.chatHistory.push({ role: 'assistant', content: response });
        return this;
    }

    // 获取完整对话历史
    getHistory() {
        return this.chatHistory;
    }

    // 获取系统提示词
    getSystemPrompt() {
        return this.systemPrompt;
    }

    // 生成AI回复
    async generateResponse(userMessage, apiKey) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...this.chatHistory,
                { role: 'user', content: userMessage }
            ];

            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer sk-invxxysuprmxlqevpphfalkhhqzmyvvvijrxuqyeooeaqntb`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "Qwen/Qwen3-8B",
                    "messages": messages,
                    "stream": false,
                    "max_tokens": 512,
                    "enable_thinking": false,
                    "thinking_budget": 4096,
                    "min_p": 0.05,
                    "stop": null,
                    "temperature": 0.7,
                    "top_p": 0.7,
                    "top_k": 50,
                    "frequency_penalty": 0.5,
                    "n": 1,
                    "response_format": { "type": "text" },
                    "tools": [{
                        "type": "function",
                        "function": {
                            "description": "<string>",
                            "name": "<string>",
                            "parameters": {},
                            "strict": false
                        }
                    }]
                })
            };

            const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', options);
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            this.addAIResponse(aiResponse);
            return aiResponse;
        } catch (error) {
            console.error('调用大模型时出错:', error);
            return this.simulateAIResponse(userMessage);
        }
    }

    getMaoResponse(userMessage) {
        // 如果增强版 AI 可用，使用增强版
        this.addUserMessage(userMessage);
        // 假设 apiKey 已经定义，实际使用时需要替换为真实的 apiKey
        const apiKey = 'sk-invxxysuprmxlqevpphfalkhhqzmyvvvijrxuqyeooeaqntb'; 
        return this.generateResponse(userMessage, apiKey).catch((error) => {
            console.error('生成回复时出错:', error);
            // 出错时使用基础版回复逻辑
            const lowerMessage = userMessage.toLowerCase();
            if (lowerMessage.includes('矛盾')) {
                return "矛盾是普遍存在的，要区分敌我矛盾和人民内部矛盾。对于人民内部矛盾，要用民主的方法，说服教育的方法，‘团结—批评—团结’的方法去解决。";
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
        });
    }

}

// 导出模块
//if (typeof module !== 'undefined' && module.exports) {
//    module.exports = { MaoAIChat };
//}
