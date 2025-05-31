document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const featureLinks = document.querySelectorAll('.feature-link');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // --- Navigation Logic ---
    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === `${pageId}-page`) {
                page.classList.add('active');
                page.classList.remove('hidden');
            } else {
                page.classList.remove('active');
                page.classList.add('hidden');
            }
        });

        // Update active state for nav links
        navLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        mobileNavLinks.forEach(link => {
            if (link.dataset.page === pageId) {
                link.classList.add('active');
                link.classList.add('text-red-700'); // Mobile active color
            } else {
                link.classList.remove('active');
                link.classList.remove('text-red-700');
            }
        });
        window.scrollTo(0, 0); // Scroll to top on page change
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            showPage(pageId);
        });
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Find the actual link element if SVG or span is clicked
            const targetLink = e.target.closest('.mobile-nav-link');
            if (targetLink) {
                const pageId = targetLink.dataset.page;
                showPage(pageId);
            }
        });
    });

    featureLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.dataset.page;
            showPage(pageId);
        });
    });

    // Mobile menu toggle (placeholder, as mobile nav is bottom bar)
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // If a top mobile menu were used, toggle logic would go here
            console.log('Mobile menu toggle clicked - using bottom nav');
        });
    }

    // --- 抽语录 (Draw Quotes) Logic ---
    const quoteText = document.getElementById('quote-text');
    const quoteSource = document.getElementById('quote-source');
    const quoteContext = document.getElementById('quote-context');
    const quoteYear = document.getElementById('quote-year');
    const newQuoteBtn = document.getElementById('new-quote');
    const flipQuoteBtn = document.getElementById('flip-quote');
    const quoteCard = document.querySelector('.quote-card');
    let currentQuote = null;
    let quotesData = [];

    async function fetchQuotes() {
        try {
            // In a real scenario, fetch from a JSON file or API
            // For now, using placeholder data
            quotesData = [
                { text: "革命不是请客吃饭，不是做文章，不是绘画绣花，不能那样雅致，那样从容不迫，文质彬彬，那样温良恭俭让。革命是暴动，是一个阶级推翻一个阶级的暴烈的行动。", source: "《湖南农民运动考察报告》", context: "强调革命的性质和手段", year: 1927 },
                { text: "星星之火，可以燎原。", source: "《星星之火，可以燎原》", context: "表达对革命前景的乐观信念", year: 1930 },
                { text: "没有调查，就没有发言权。", source: "《反对本本主义》", context: "强调调查研究的重要性", year: 1930 },
                { text: "兵民是胜利之本。", source: "《论持久战》", context: "强调人民战争思想", year: 1938 },
                { text: "我们的同志在困难的时候，要看到成绩，要看到光明，要提高我们的勇气。", source: "《为人民服务》", context: "鼓励同志们克服困难", year: 1944 },
                { text: "下定决心，不怕牺牲，排除万难，去争取胜利。", source: "《愚公移山》", context: "体现革命的决心和意志", year: 1945 },
                { text: "一切反动派都是纸老虎。", source: "和美国记者安那·路易斯·斯特朗的谈话", context: "藐视反动力量的战略思想", year: 1946 },
                { text: "务必使同志们继续地保持谦虚、谨慎、不骄、不躁的作风，务必使同志们继续地保持艰苦奋斗的作风。", source: "在中共七届二中全会上的报告", context: "告诫全党保持优良作风", year: 1949 },
                { text: "人民，只有人民，才是创造世界历史的动力。", source: "《论联合政府》", context: "阐述唯物史观基本观点", year: 1945 },
                { text: "世界上怕就怕‘认真’二字，共产党就最讲认真。", source: "在扩大的中央工作会议上的讲话", context: "强调做事要认真负责", year: 1962 },
                { text: "政策和策略是党的生命，各级领导同志务必充分注意，万万不可粗心大意。", source: "《关于情况的通报》", context: "强调政策和策略的重要性", year: 1948 },
                { text: "我们不但善于破坏一个旧世界，我们还将善于建设一个新世界。", source: "在中共七届二中全会上的报告", context: "表达建设新中国的信心", year: 1949 },
                { text: "实践是检验真理的唯一标准。", source: "《实践论》", context: "阐述马克思主义认识论核心观点", year: 1937 }, // Note: While this phrase became famous later, the idea is central to Shijian Lun.
                { text: "矛盾是普遍存在的，没有矛盾就没有世界。", source: "《矛盾论》", context: "阐述唯物辩证法核心观点", year: 1937 },
                { text: "战略上要藐视敌人，战术上要重视敌人。", source: "《中国革命战争的战略问题》", context: "阐述对敌斗争的战略战术原则", year: 1936 },
                { text: "自己动手，丰衣足食。", source: "为延安生产运动题词", context: "提倡自力更生、艰苦奋斗", year: 1939 },
                { text: "贪污和浪费是极大的犯罪。", source: "《关于<中华人民共和国宪法草案>》", context: "强调反腐倡廉的重要性", year: 1954 },
                { text: "好好学习，天天向上。", source: "为小学生题词", context: "鼓励青少年努力学习", year: 1951 },
                { text: "凡是敌人反对的，我们就要拥护；凡是敌人拥护的，我们就要反对。", source: "《和中央社、扫荡报、新民报三记者的谈话》", context: "表明鲜明的阶级立场", year: 1939 },
                { text: "团结、紧张、严肃、活泼。", source: "为抗大制定的校训", context: "对革命队伍作风的要求", year: 1937 },
                { text: "情况是在不断地变化，要使自己的思想适应新的情况，就得学习。", source: "《在中国共产党全国宣传工作会议上的讲话》", context: "强调学习的重要性", year: 1957 },
                { text: "世界是你们的，也是我们的，但是归根结底是你们的。你们青年人朝气蓬勃，正在兴旺时期，好像早晨八九点钟的太阳。希望寄托在你们身上。", source: "在莫斯科会见中国留学生时的讲话", context: "寄语青年一代", year: 1957 },
                { text: "我们应该谦虚，谨慎，戒骄，戒躁，全心全意地为中国人民服务。", source: "《两个中国之命运》", context: "对党员干部的基本要求", year: 1945 },
                { text: "榜样的力量是无穷的。", source: "《关于领导方法的若干问题》", context: "强调先进典型的示范作用", year: 1943 },
                { text: "没有正确的政治观点，就等于没有灵魂。", source: "《关于正确处理人民内部矛盾的问题》", context: "强调政治方向的重要性", year: 1957 },
                { text: "帝国主义亡我之心不死，要时刻提高警惕。", source: "多次讲话中提及", context: "提醒警惕外部威胁", year: "多次" },
                { text: "人不犯我，我不犯人；人若犯我，我必犯人。", source: "《目前形势和我们的任务》", context: "阐述自卫反击的原则", year: 1947 },
                { text: "学习的敌人是自己的满足，要认真学习一点东西，必须从不自满开始。", source: "《改造我们的学习》", context: "强调学习要谦虚", year: 1941 },
                { text: "要做人民的先生，先做人民的学生。", source: "《关于领导方法的若干问题》", context: "强调向群众学习", year: 1943 },
                { text: "中国的命运一经操在人民自己的手里，中国就将如太阳升起在东方那样，以自己的辉煌的光焰普照大地。", source: "《中国人民站起来了》", context: "宣告新中国的诞生和未来", year: 1949 },
                { text: "前途是光明的，道路是曲折的。", source: "《关于重庆谈判》", context: "辩证看待革命发展过程", year: 1945 }
            ];
            // Add more quotes as needed to reach at least 30
            console.log(`Loaded ${quotesData.length} quotes.`);
            displayRandomQuote();
        } catch (error) {
            console.error('Error fetching quotes:', error);
            quoteText.textContent = '加载语录失败，请稍后重试。';
        }
    }

    function displayRandomQuote() {
        if (quotesData.length === 0) return;
        const randomIndex = Math.floor(Math.random() * quotesData.length);
        currentQuote = quotesData[randomIndex];
        
        quoteText.textContent = currentQuote.text;
        quoteSource.textContent = `—— ${currentQuote.source}`;
        quoteContext.textContent = currentQuote.context || '暂无背景信息';
        quoteYear.textContent = currentQuote.year ? `(${currentQuote.year})` : '';

        // Reset flip state
        if (quoteCard.classList.contains('flipped')) {
            quoteCard.classList.remove('flipped');
        }
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', displayRandomQuote);
    }

    if (flipQuoteBtn && quoteCard) {
        flipQuoteBtn.addEventListener('click', () => {
            quoteCard.classList.toggle('flipped');
        });
    }

    // --- 学经典 (Learn Classics) Logic ---
    const articlesContainer = document.getElementById('articles-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const articleDetailPage = document.getElementById('article-detail-page');
    const articleTitle = document.getElementById('article-title');
    const articleYear = document.getElementById('article-year');
    const articleBackground = document.getElementById('article-background');
    const articleMainIdeas = document.getElementById('article-main-ideas');
    const articleSummary = document.getElementById('article-summary');
    const articleLinks = document.getElementById('article-links');
    const backToClassicsBtn = document.getElementById('back-to-classics');
    let articlesData = [];

    // Define categories for articles
    const articleCategories = {
        'shijian_lun': 'philosophy',
        'maodun_lun': 'philosophy',
        'fandui_benbenism': 'philosophy',
        'correct_ideas': 'philosophy',
        'class_analysis': 'revolution',
        'hunan_report': 'revolution',
        'xingxingzhihuo': 'revolution',
        'zhanlue_wenti': 'military',
        'lun_chijiuzhan': 'military',
        'war_strategy': 'military',
        'gaizao_xuexi': 'thought',
        'zhengdun_dangfeng': 'thought',
        'fandui_dangbagu': 'thought',
        'xinminzhuzhuyilun': 'politics',
        'lun_lianhe_zhengfu': 'politics',
        'lun_renmin_minzhu_zhuanzheng': 'politics',
        'lun_shida_guanxi': 'socialism',
        'renmin_neibu_maodun': 'socialism'
    };

    async function fetchArticles() {
        try {
            // In a real app, fetch a manifest file or use a build process
            const articleFiles = [
                'shijian_lun', 'maodun_lun', 'fandui_benbenism', 'correct_ideas',
                'class_analysis', 'hunan_report', 'xingxingzhihuo', 'zhanlue_wenti',
                'lun_chijiuzhan', 'war_strategy', 'gaizao_xuexi', 'zhengdun_dangfeng',
                'fandui_dangbagu', 'xinminzhuzhuyilun', 'lun_lianhe_zhengfu',
                'lun_renmin_minzhu_zhuanzheng', 'lun_shida_guanxi', 'renmin_neibu_maodun'
            ];

            // Placeholder: Simulate fetching data. In reality, you'd fetch and parse MD files.
            // For now, we'll just create basic article objects.
            articlesData = articleFiles.map(id => ({
                id: id,
                title: getTitleFromId(id), // Function to get title based on ID
                year: getYearFromId(id),   // Function to get year based on ID
                description: getDescriptionFromId(id), // Placeholder description
                category: articleCategories[id] || 'other',
                // In a real app, load content dynamically when clicked
                // background: '...', mainIdeas: '...', summary: '...', links: '...'
            }));

            displayArticles('all'); // Display all articles initially
        } catch (error) {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = '<p class="text-red-500">加载文章列表失败。</p>';
        }
    }

    // Helper functions (replace with actual data loading)
    function getTitleFromId(id) {
        const titles = {
            'shijian_lun': '实践论',
            'maodun_lun': '矛盾论',
            'fandui_benbenism': '反对本本主义',
            'correct_ideas': '人的正确思想是从哪里来的？',
            'class_analysis': '中国社会各阶级的分析',
            'hunan_report': '湖南农民运动考察报告',
            'xingxingzhihuo': '星星之火，可以燎原',
            'zhanlue_wenti': '中国革命战争的战略问题',
            'lun_chijiuzhan': '论持久战',
            'war_strategy': '战争和战略问题',
            'gaizao_xuexi': '改造我们的学习',
            'zhengdun_dangfeng': '整顿党的作风',
            'fandui_dangbagu': '反对党八股',
            'xinminzhuzhuyilun': '新民主主义论',
            'lun_lianhe_zhengfu': '论联合政府',
            'lun_renmin_minzhu_zhuanzheng': '论人民民主专政',
            'lun_shida_guanxi': '论十大关系',
            'renmin_neibu_maodun': '关于正确处理人民内部矛盾的问题'
        };
        return titles[id] || '未知文章';
    }

    function getYearFromId(id) {
        const years = {
            'shijian_lun': 1937, 'maodun_lun': 1937, 'fandui_benbenism': 1930, 'correct_ideas': 1963,
            'class_analysis': 1925, 'hunan_report': 1927, 'xingxingzhihuo': 1930, 'zhanlue_wenti': 1936,
            'lun_chijiuzhan': 1938, 'war_strategy': 1938, 'gaizao_xuexi': 1941, 'zhengdun_dangfeng': 1942,
            'fandui_dangbagu': 1942, 'xinminzhuzhuyilun': 1940, 'lun_lianhe_zhengfu': 1945,
            'lun_renmin_minzhu_zhuanzheng': 1949, 'lun_shida_guanxi': 1956, 'renmin_neibu_maodun': 1957
        };
        return years[id] || '';
    }

    function getDescriptionFromId(id) {
        const descriptions = {
            'shijian_lun': '阐述认识来源于实践并指导实践，强调理论与实践的统一。',  
            'maodun_lun': '分析矛盾的普遍性与特殊性，提出对立统一规律是唯物辩证法的核心。',  
            'fandui_benbenism': '批判教条主义，提出“没有调查，没有发言权”的著名论断。',  
            'correct_ideas': '指出正确思想源于社会实践，需经过实践检验。',  
            'class_analysis': '通过阶级划分明确革命敌友，奠定新民主主义革命理论基础。',  
            'hunan_report': '肯定农民运动的革命性，强调农民在革命中的重要作用。',  
            'xingxingzhihuo': '论证革命力量的壮大趋势，鼓舞农村包围城市的信心。',  
            'zhanlue_wenti': '总结红军作战经验，提出积极防御等军事原则。',  
            'lun_chijiuzhan': '预见抗日战争将经历三个阶段，最终胜利属于中国。',  
            'war_strategy': '强调武装斗争是中国革命的主要形式，提出“枪杆子里出政权”。',  
            'gaizao_xuexi': '反对主观主义学风，倡导理论联系实际的马克思主义态度。',  
            'zhengdun_dangfeng': '号召整顿党内教条主义和经验主义，树立实事求是的思想路线。',  
            'fandui_dangbagu': '批判形式主义的文风，提倡生动活泼、群众喜闻乐见的表达方式。',  
            'xinminzhuzhuyilun': '系统论述新民主主义革命的理论、路线和纲领。',  
            'lun_lianhe_zhengfu': '提出建立民主联合政府的主张，规划战后中国的政治蓝图。',  
            'lun_renmin_minzhu_zhuanzheng': '阐明人民民主专政的性质，强调工人阶级领导的政权建设。',  
            'lun_shida_guanxi': '初步探索中国社会主义建设道路，提出统筹兼顾的经济方针。',  
            'renmin_neibu_maodun': '区分两类不同性质的矛盾，提出正确处理人民内部矛盾的方法。'  
        };
        return descriptions[id] || '未知文章简介';
    }

    function displayArticles(category) {
        articlesContainer.innerHTML = ''; // Clear existing articles
        const filteredArticles = category === 'all' 
            ? articlesData 
            : articlesData.filter(article => article.category === category);

        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = '<p class="text-gray-500 col-span-full">该分类下暂无文章。</p>';
            return;
        }

        filteredArticles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer';
            card.dataset.articleId = article.id;
            card.innerHTML = `
                <div class="article-image bg-gray-200" style="background-image: url('placeholder.jpg')"></div> <!-- Placeholder image -->
                <div class="p-4">
                    <h3 class="text-lg font-bold mb-1 font-sans">${article.title}</h3>
                    <p class="text-sm text-gray-500 mb-2">(${article.year})</p>
                    <p class="text-sm text-gray-600">${article.description}</p>
                </div>
            `;
            card.addEventListener('click', () => showArticleDetail(article.id));
            articlesContainer.appendChild(card);
        });
    }

    async function showArticleDetail(articleId) {
        try {
            // In a real app, fetch the full markdown content here
            const response = await fetch(`../articles/${articleId}.md`);
            console.log("response: ", response,"articleid:",articleId);
            const markdownContent = await response.text();
            const sections = parseMarkdownContent(markdownContent);
            // Parse markdown and populate the detail page elements
            
            // Placeholder: Use existing basic data
            const article = articlesData.find(a => a.id === articleId);
            if (!article) return;

            articleTitle.textContent = article.title;
            articleYear.textContent = `(${article.year})`;
            
            // Simulate loading content (replace with actual MD parsing)
            articleBackground.innerHTML = sections.background || '暂无背景信息';
            articleMainIdeas.innerHTML = sections.mainideas || '暂无主要观点';
            articleSummary.innerHTML = sections.summary || '暂无总结信息';
            articleLinks.innerHTML = `<a href="#" class="text-red-600 hover:underline" target="_blank">查看原文 (示例链接)</a>`;

            showPage('article-detail');
        } catch (error) {
            console.error('Error loading article detail:', error);
            alert('加载文章详情失败。');
        }
    }

    // 解析markdown内容为各个部分
    function parseMarkdownContent(markdown) {
        const sections = {
            background: '',
            mainIdeas: '',
            summary: '',
            link: ''
        };
        
        try {
            console.log("开始解析markdown内容:", markdown.substring(0, 100) + "...");
            
            // 提取创作背景与目的
            const backgroundMatch = markdown.match(/## 创作背景与目的\s+([\s\S]*?)(?=##|$)/);
            if (backgroundMatch && backgroundMatch[1]) {
                sections.background = backgroundMatch[1].trim();
                console.log("成功提取创作背景");
            } else {
                console.log("未找到创作背景部分");
            }
            
            // 提取关键思想主旨 - 支持多种可能的标题格式
            let mainIdeasMatch = markdown.match(/## 关键思想主旨\s+([\s\S]*?)(?=##|$)/);
            if (!mainIdeasMatch) {
                mainIdeasMatch = markdown.match(/## 主要思想\s+([\s\S]*?)(?=##|$)/);
            }
            if (!mainIdeasMatch) {
                mainIdeasMatch = markdown.match(/## 核心思想\s+([\s\S]*?)(?=##|$)/);
            }
            if (mainIdeasMatch && mainIdeasMatch[1]) {
                sections.mainIdeas = mainIdeasMatch[1].trim();
                console.log("成功提取关键思想主旨");
            } else {
                console.log("未找到关键思想主旨部分");
            }
            
            // 提取内容摘要 - 支持多种可能的标题格式
            let summaryMatch = markdown.match(/## 内容摘要\s+([\s\S]*?)(?=##|$)/);
            if (!summaryMatch) {
                summaryMatch = markdown.match(/## 主要内容摘要\s+([\s\S]*?)(?=##|$)/);
            }
            if (!summaryMatch) {
                summaryMatch = markdown.match(/## 内容概要\s+([\s\S]*?)(?=##|$)/);
            }
            if (summaryMatch && summaryMatch[1]) {
                sections.summary = summaryMatch[1].trim();
                console.log("成功提取内容摘要");
            } else {
                console.log("未找到内容摘要部分");
            }
            
            // 提取原文链接
            const linkMatch = markdown.match(/\[.*?\]\((.*?)\)/);
            if (linkMatch && linkMatch[1]) {
                sections.link = linkMatch[1].trim();
                console.log("成功提取原文链接:", sections.link);
            } else {
                // 默认链接
                sections.link = 'https://www.marxists.org/chinese/maozedong/index.htm';
                console.log("使用默认原文链接");
            }
            
            // 如果没有找到主要思想，尝试从内容摘要中提取
            if (!sections.mainIdeas && sections.summary) {
                const firstParagraph = sections.summary.split('\n\n')[0];
                if (firstParagraph && firstParagraph.length > 50) {
                    sections.mainIdeas = firstParagraph;
                    console.log("从内容摘要中提取了主要思想");
                }
            }
            
            // 如果没有找到内容摘要，尝试从历史意义部分提取
            if (!sections.summary) {
                const historyMatch = markdown.match(/## 历史意义\s+([\s\S]*?)(?=##|$)/);
                if (historyMatch && historyMatch[1]) {
                    sections.summary = historyMatch[1].trim();
                    console.log("从历史意义部分提取了内容摘要");
                }
            }
            
            // 调试输出
            console.log("解析结果:", {
                background: sections.background ? sections.background.substring(0, 50) + "..." : "暂无",
                mainIdeas: sections.mainIdeas ? sections.mainIdeas.substring(0, 50) + "..." : "暂无",
                summary: sections.summary ? sections.summary.substring(0, 50) + "..." : "暂无",
                link: sections.link
            });
        } catch (e) {
            console.error('Error parsing markdown:', e);
        }
        
        return sections;
    }


    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            // Update active button style
            categoryBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            // Display articles for the selected category
            displayArticles(category);
        });
    });

    if (backToClassicsBtn) {
        backToClassicsBtn.addEventListener('click', () => {
            showPage('classics');
        });
    }

    // --- 问经验 (Ask Experience) Logic ---
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const presetQuestionBtns = document.querySelectorAll('.preset-question');

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        if (sender === 'mao') {
            messageDiv.innerHTML = `
                <div class="flex items-start">
                    <div class="mao-avatar mr-2 flex-shrink-0">
                        <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <span class="text-lg font-bold">毛</span>
                        </div>
                    </div>
                    <div class="message-bubble"><p>${text}</p></div>
                </div>`;
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
        }
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    function getMaoResponse(userMessage) {
        // Simple placeholder responses based on keywords
        // TODO: Replace with actual LLM call or more sophisticated logic
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
    }

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText) {
            addMessage('user', messageText);
            chatInput.value = '';
            
            // Simulate AI response delay
            setTimeout(() => {
                const maoReply = getMaoResponse(messageText);
                addMessage('mao', maoReply);
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
            addMessage('user', question);
            // Simulate AI response delay
            setTimeout(() => {
                const maoReply = getMaoResponse(question);
                addMessage('mao', maoReply);
            }, 1000 + Math.random() * 1000);
        });
    });

    // --- Initial Load ---
    fetchQuotes();
    fetchArticles();
    showPage('home'); // Show home page initially
});
