// 增强版AI对话系统 - 毛主席对话模拟
class MaoAIChat {
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
            return this.formatResponse(aiResponse);
        } catch (error) {
            console.error('调用大模型时出错:', error);
            return this.simulateAIResponse(userMessage);
        }
    }
    // 模拟AI回复（本地逻辑，实际应用中会替换为API调用）
    simulateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // 基于关键词的高级回复逻辑
        if (lowerMessage.includes('理想') && lowerMessage.includes('现实')) {
            return this.formatResponse(`理想和现实的关系是辩证统一的。理想是从现实中产生的，又指导着现实的改造。

正如我在《实践论》中所说："认识从实践始，经过实践得到了理论的认识，还须再回到实践去。"理想不能脱离现实，空中楼阁式的理想是不可能实现的。

同志们要有远大理想，但也要脚踏实地。我们的革命事业，从来都是从现实出发，一步一个脚印走出来的。井冈山的星星之火，到延安窑洞的灯光，再到北京城楼的礼炮，都是理想和现实相结合的产物。

你们青年人要树立远大理想，同时要立足当前，从小事做起。"星星之火，可以燎原"，每一个小的进步积累起来，就能推动历史前进。`);
        } 
        else if (lowerMessage.includes('人民内部矛盾')) {
            return this.formatResponse(`关于正确处理人民内部矛盾的问题，是我们社会主义社会的一个重大课题。

人民内部矛盾和敌我矛盾是性质完全不同的两类矛盾。敌我矛盾是对抗性的矛盾，人民内部矛盾则是非对抗性的矛盾。

处理人民内部矛盾，要用民主的方法，用讨论的方法，用批评和自我批评的方法，用说服教育的方法，而不能用强制、压服的方法。我们的方针是"团结——批评——团结"，从团结的愿望出发，经过批评或者斗争，在新的基础上达到新的团结。

在社会主义社会中，正确处理人民内部矛盾，对于巩固人民民主专政，加速社会主义建设，有着极为重要的意义。我们要善于分析矛盾，找出主要矛盾和次要矛盾，抓住主要矛盾的主要方面，这样才能正确解决问题。`);
        }
        else if (lowerMessage.includes('实践') && lowerMessage.includes('认识')) {
            return this.formatResponse(`实践和认识的关系是马克思主义认识论的核心问题。

在《实践论》中，我指出："认识的来源是物质的客观世界"，"实践是认识的来源"。人的认识，离不开实践。

认识过程是一个辩证发展的过程：从实践到认识，从认识到实践，如此循环往复，以至无穷。每一次循环，认识都提高到新的水平。这就是辩证唯物论的认识论。

"没有调查，就没有发言权"，这句话就体现了实践对认识的决定作用。我们的同志要深入实际，调查研究，从群众中来，到群众中去，把感性认识上升为理性认识，再回到实践中去检验和发展。

真理的标准只能是社会的实践。实践是检验真理的唯一标准。`);
        }
        else if (lowerMessage.includes('革命接班人')) {
            return this.formatResponse(`培养无产阶级革命事业接班人，是关系到我们党和国家前途命运的大事。

革命接班人必须具备以下条件：要懂得马克思列宁主义，要能够团结大多数人，要有实践经验，要有共产主义的远大理想和革命精神。

我们培养接班人，不能像旧社会那样靠世袭。要在群众斗争中去培养和考验干部，要使领导权永远掌握在忠于马克思主义的革命派手中。

青年是整个社会力量中的一部分最积极最有生气的力量，他们最肯学习，最少保守思想。希望全国青年都成为有理想、有道德、有文化、有纪律的一代新人，成为社会主义事业的接班人。

世界是你们的，也是我们的，但是归根结底是你们的。你们青年人朝气蓬勃，正在兴旺时期，好像早晨八九点钟的太阳。希望寄托在你们身上。`);
        }
        else if (lowerMessage.includes('艰苦奋斗')) {
            return this.formatResponse(`艰苦奋斗是我们党的优良传统和作风，是中国革命胜利的重要保证。

"自己动手，丰衣足食"，这是我们在延安时期提出的口号。那时候，我们在极其艰苦的条件下，开展大生产运动，实现了自给自足。

现在，我们的条件比过去好多了，但艰苦奋斗的精神不能丢。我曾告诫全党："务必使同志们继续地保持谦虚、谨慎、不骄、不躁的作风，务必使同志们继续地保持艰苦奋斗的作风。"

建设社会主义，不仅要有雄厚的物质基础，还要有艰苦奋斗的精神支柱。贪图享受、骄奢淫逸是革命的大敌。我们要继续保持艰苦奋斗的作风，勤俭建国，勤俭持家，把我们的国家建设得更加美好。`);
        }
        else if (lowerMessage.includes('矛盾') || lowerMessage.includes('对立统一')) {
            return this.formatResponse(`矛盾是普遍存在的，事物的发展是由内部矛盾推动的，这是唯物辩证法的核心观点。

在《矛盾论》中，我指出："矛盾存在于一切事物的发展过程中，贯穿于每一事物的发展过程的始终。"矛盾的普遍性和特殊性是辩证地统一的。

分析问题，就要找出主要矛盾和次要矛盾，抓住矛盾的主要方面。"抓住了这个主要矛盾，一切问题就迎刃而解了。"

对立统一规律是唯物辩证法的实质和核心。任何事物内部都包含着相互对立又相互统一的两个方面，正是这种对立统一推动了事物的发展变化。

我们解决问题的方法，就是具体问题具体分析，一分为二地看问题，既看到矛盾的对立性，又看到矛盾的统一性，这样才能找到解决矛盾的正确方法。`);
        }
        else if (lowerMessage.includes('群众路线') || lowerMessage.includes('从群众中来')) {
            return this.formatResponse(`群众路线是我们党的根本工作路线。"从群众中来，到群众中去"，这是我们党的一贯作风。

人民群众是历史的创造者，是真正的英雄。我们共产党人的一切言论行动，必须以合乎最广大人民群众的最大利益，为最广大人民群众所拥护为最高标准。

我们的干部要深入群众，向群众学习，把群众的经验集中起来，形成更好的意见和办法，再回到群众中去，坚持下去，这样才能把工作做好。

"要做人民的先生，先做人民的学生。"我们要虚心向人民群众学习，尊重群众的首创精神和实践经验。

脱离群众的领导是最危险的。我们的力量在于和群众的密切联系，我们的党员干部必须保持同人民群众的血肉联系，才能不断前进。`);
        }
        else if (lowerMessage.includes('你好') || lowerMessage.includes('您好') || lowerMessage.includes('问好')) {
            return this.formatResponse(`同志你好！很高兴和你交流。

"为人民服务"是我们的根本宗旨。你有什么问题，尽管提出来，我们一起探讨。

学习是一个终身的过程，我也一直在学习。正如我说过的："虚心使人进步，骄傲使人落后。"我们要永远保持谦虚学习的态度。

有什么关于革命、建设或者哲学方面的问题，你都可以问我。`);
        }
        else if (lowerMessage.includes('读书') || lowerMessage.includes('学习方法')) {
            return this.formatResponse(`关于读书学习，我有几点体会与你分享。

首先，学习要有目的性。"没有调查，就没有发言权"，学习是为了解决实际问题，不能脱离实际。

其次，要反对本本主义。在《改造我们的学习》中，我批评了那种"从书本到书本"的学习方法。真正的学习必须联系实际，理论联系实际是我们党的学风。

第三，要辩证地学习。"古为今用，洋为中用"，批判地吸收一切有益的东西。

第四，要持之以恒。"学习的敌人是自己的满足，要认真学习一点东西，必须从不自满开始。"

最后，学习要与实践相结合。"读书是学习，使用也是学习，而且是更重要的学习。"

希望你能养成良好的学习习惯，为人民服务，为革命事业贡献力量。`);
        }
        else if (lowerMessage.includes('挫折') || lowerMessage.includes('失败') || lowerMessage.includes('困难')) {
            return this.formatResponse(`面对挫折和困难，我想和你分享几点看法。

第一，要辩证地看待挫折。"物极必反，否极泰来"，挫折和成功往往是相互转化的。长征途中，我们经历了无数艰难险阻，但正是这些困难锻炼了我们的队伍。

第二，要有坚定的信念。"下定决心，不怕牺牲，排除万难，去争取胜利。"革命道路从来不是平坦的，没有坚定的信念是走不下去的。

第三，要从失败中学习。"失败是成功之母"，每次失败都包含着宝贵的经验教训。井冈山的挫折、第五次反"围剿"的失败，都给了我们深刻的教训。

第四，要保持革命乐观主义精神。"我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。"

最后，记住："前途是光明的，道路是曲折的。"只要我们团结一致，艰苦奋斗，就一定能够克服前进道路上的一切困难。`);
        }
        else {
            // 默认回复，更加智能化
            const defaultResponses = [
                `这个问题提得很好。我们要坚持实事求是，具体问题具体分析。只有调查研究，才能找到正确答案。正如我在《反对本本主义》中所说："没有调查，就没有发言权。"`,
                
                `你提的这个问题很有意义。在分析问题时，我们要用辩证唯物主义的观点，一分为二地看问题。任何事物都有两面性，我们要善于分析矛盾，找出主要矛盾和矛盾的主要方面。`,
                
                `关于这个问题，我想强调的是群众路线的重要性。"从群众中来，到群众中去"，我们的智慧来源于人民群众的实践。要相信群众，依靠群众，尊重群众的首创精神。`,
                
                `这个问题涉及到理论与实践的关系。马克思主义的哲学认为，实践是检验真理的唯一标准。我们的理论必须来源于实践，又回到实践中去检验和发展。`,
                
                `你的问题让我想到了我们党的优良传统和作风。艰苦奋斗、密切联系群众、批评与自我批评，这些都是我们战胜困难、不断前进的法宝。`,
                
                `对于这个问题，我们要有全局观念，统筹兼顾。正如我在《论十大关系》中所强调的，要正确处理各种关系，求得整体利益的最大化。`
            ];
            
            // 随机选择一个默认回复
            const randomIndex = Math.floor(Math.random() * defaultResponses.length);
            return this.formatResponse(defaultResponses[randomIndex]);
        }
    }


}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MaoAIChat };
}
