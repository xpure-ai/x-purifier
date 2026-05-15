(function () {
    'use strict';
    let config = null;
    let settings = null;
    let styleElement = null;

    // 动态注入完整的 CSS 选择器
    const injectCSS = (selectorsArray) => {
        if (!selectorsArray || selectorsArray.length === 0) return;

        if (!styleElement) {
            styleElement = document.createElement('style');
            document.head.appendChild(styleElement);
        }

        const selectors = selectorsArray.join(', ');
        styleElement.textContent = `${selectors} { display: none !important; }`;
    };

    const isInsideSidebar = (element) => {
        if (!config || !config.sidebarColumnSelector) return true; // fallback to true if selector is missing
        return !!element.closest(config.sidebarColumnSelector);
    };

    const isTweetToHide = (element) => {
        if (!config || !settings) return false;
        if (!element.closest(config.primaryColumnSelector)) return false;

        // 在推文详情页一律不屏蔽推文
        if (window.location.pathname.includes('/status/')) {
            return false;
        }

        const adSpans = element.querySelectorAll(config.adSpanSelector);
        const textArray = Array.from(adSpans).map(span => span.textContent.trim().toLowerCase());

        let adKeywords = [];
        let promotedKeywords = [];
        let paidKeywords = [];
        let aiKeywords = [];

        if (config.keywords) {
            if (Array.isArray(config.keywords)) {
                // 兼容旧版基于数组的配置，将所有自定义关键字视为广告
                adKeywords = config.keywords.map(k => k.toLowerCase());
            } else {
                if (Array.isArray(config.keywords.ads)) adKeywords = config.keywords.ads.map(k => k.toLowerCase());
                if (Array.isArray(config.keywords.promoted)) promotedKeywords = config.keywords.promoted.map(k => k.toLowerCase());
                if (Array.isArray(config.keywords.paid)) paidKeywords = config.keywords.paid.map(k => k.toLowerCase());
                if (Array.isArray(config.keywords.aiGenerated)) aiKeywords = config.keywords.aiGenerated.map(k => k.toLowerCase());
            }
        }

        if (settings.blockAds && adKeywords.length > 0 && textArray.some(t => adKeywords.includes(t))) {
            return true;
        }
        if (settings.blockPromoted && promotedKeywords.length > 0 && textArray.some(t => promotedKeywords.includes(t))) {
            return true;
        }
        if (settings.blockPaid && paidKeywords.length > 0 && textArray.some(t => paidKeywords.includes(t))) {
            return true;
        }

        const isHomePage = window.location.pathname === '/home' || window.location.pathname === '/';
        if (settings.blockAIGenerated && isHomePage && aiKeywords.length > 0 && textArray.some(t => aiKeywords.includes(t))) {
            return true;
        }

        return false;
    };

    // process tweet
    const processTweet = (element) => {
        if (!element || !element.dataset || element.dataset.testid !== 'tweet') return;

        const shouldHide = isTweetToHide(element);

        if (shouldHide) {
            if (element.style.display !== 'none') {
                element.dataset.xPurifierHiddenAd = "true";
                element.style.display = 'none';
            }
        } else if (element.dataset.xPurifierHiddenAd === "true") {
            element.style.display = '';
            delete element.dataset.xPurifierHiddenAd;
        }
    };

    const hideSectionIfMatch = (el, role, settingKey, keywordKey) => {
        if (!config || !settings) return;
        if (!el || !el.getAttribute || el.getAttribute('role') !== role) return;

        // 只处理 sidebarColumn 中的组件
        if (!isInsideSidebar(el)) return;

        // const text = (el.textContent || '').toLowerCase();
        // let keywords = [];

        // if (config.keywords && !Array.isArray(config.keywords)) {
        //     if (Array.isArray(config.keywords[keywordKey])) {
        //         keywords = config.keywords[keywordKey].map(k => k.toLowerCase());
        //     }
        // }

        // const matchesKeyword = keywords.length > 0 && keywords.some(k => text.includes(k));
        const shouldHide = settings[settingKey];

        // 参考 Premium 逻辑，隐藏向上两级的父组件
        const targetEl = el.parentElement ? el.parentElement : el;

        if (shouldHide) {
            if (targetEl.style.display !== 'none') {
                targetEl.dataset.xPurifierHiddenSection = settingKey;
                targetEl.style.display = 'none';
            }
        } else {
            targetEl.style.display = '';
            delete targetEl.dataset.xPurifierHiddenSection;
        }
    };

    const hideComplementaryIfMatch = (el) => {
        if (!config || !settings) return;
        if (!el || !el.getAttribute) return;
        if (el.getAttribute('role') !== 'complementary') return;

        // 只处理 sidebarColumn 中的组件
        if (!isInsideSidebar(el)) return;

        const text = (el.textContent || '').toLowerCase();
        let shouldHide = false;

        let premiumKeywords = [];
        let recommendedKeywords = [];

        if (config.keywords && !Array.isArray(config.keywords)) {
            if (Array.isArray(config.keywords.premium)) premiumKeywords = config.keywords.premium.map(k => k.toLowerCase());
            if (Array.isArray(config.keywords.recommended)) recommendedKeywords = config.keywords.recommended.map(k => k.toLowerCase());
        }

        if (settings.blockPremium && premiumKeywords.length > 0 && premiumKeywords.some(k => text.includes(k))) {
            shouldHide = true;
        }
        if (settings.blockRecommended && recommendedKeywords.length > 0 && recommendedKeywords.some(k => text.includes(k))) {
            shouldHide = true;
        }

        const targetEl = el.parentElement && el.parentElement.parentElement ? el.parentElement.parentElement : el;

        if (shouldHide) {
            if (targetEl.style.display !== 'none') {
                targetEl.dataset.xPurifierHiddenComp = "true";
                targetEl.style.display = 'none';
            }
        } else {
            targetEl.style.display = '';
            delete targetEl.dataset.xPurifierHiddenComp;
        }
    };

    const applySettingsToDOM = () => {
        if (!config || !settings) return;

        // 恢复所有被隐藏的区块（如果对应设置已关闭）
        if (!settings.blockTrends) {
            document.querySelectorAll('[data-x-purifier-hidden-section="blockTrends"]').forEach(el => {
                el.style.display = '';
                delete el.dataset.xPurifierHiddenSection;
            });
        }
        if (!settings.blockFooter) {
            document.querySelectorAll('[data-x-purifier-hidden-section="blockFooter"]').forEach(el => {
                el.style.display = '';
                delete el.dataset.xPurifierHiddenSection;
            });
        }
        if (!settings.blockPremium && !settings.blockRecommended) {
            document.querySelectorAll('[data-x-purifier-hidden-comp="true"]').forEach(el => {
                el.style.display = '';
                delete el.dataset.xPurifierHiddenComp;
            });
        }


        document.querySelectorAll('[data-testid="tweet"]').forEach(processTweet);

        document.querySelectorAll('[role="complementary"]').forEach(hideComplementaryIfMatch);

        document.querySelectorAll('section[role="region"]').forEach(el => hideSectionIfMatch(el, 'region', 'blockTrends', 'trends'));

        document.querySelectorAll('nav[role="navigation"]').forEach(el => hideSectionIfMatch(el, 'navigation', 'blockFooter', 'footer'));
    };

    const initObserver = () => {
        const rootmatch = document.evaluate('//div[@id="react-root"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const rootnode = rootmatch.singleNodeValue;

        // Ensure react-root is present, otherwise retry
        if (!rootnode) {
            setTimeout(initObserver, 500);
            return;
        }

        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                // 处理新增的节点
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.dataset && node.dataset.testid === 'tweet') {
                                processTweet(node);
                            } else {
                                node.querySelectorAll('[data-testid="tweet"]').forEach(processTweet);
                            }

                            if (node.getAttribute && node.getAttribute('role') === 'complementary') {
                                hideComplementaryIfMatch(node);
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('[role="complementary"]').forEach(hideComplementaryIfMatch);
                            }

                            if (node.getAttribute && node.getAttribute('role') === 'region') {
                                hideSectionIfMatch(node, 'region', 'blockTrends', 'trends');
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('section[role="region"]').forEach(el => hideSectionIfMatch(el, 'region', 'blockTrends', 'trends'));
                            }

                            if (node.getAttribute && node.getAttribute('role') === 'navigation') {
                                hideSectionIfMatch(node, 'navigation', 'blockFooter', 'footer');
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('nav[role="navigation"]').forEach(el => hideSectionIfMatch(el, 'navigation', 'blockFooter', 'footer'));
                            }
                        }
                    });
                }

                // 处理 target 本身的变化（比如内容更新）
                const target = mutation.target;
                if (target.nodeType === Node.ELEMENT_NODE) {
                    if (target.dataset && target.dataset.testid === 'tweet') {
                        processTweet(target);
                    }
                    if (target.getAttribute && target.getAttribute('role') === 'complementary') {
                        hideComplementaryIfMatch(target);
                    }
                    if (target.getAttribute && target.getAttribute('role') === 'region') {
                        hideSectionIfMatch(target, 'region', 'blockTrends', 'trends');
                    }
                    if (target.getAttribute && target.getAttribute('role') === 'navigation') {
                        hideSectionIfMatch(target, 'navigation', 'blockFooter', 'footer');
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        // start observe
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });

        console.log("X Purifier Extension: Observer started with config", config, settings);

        // 初始扫描
        applySettingsToDOM();
    };

    // 从 storage 加载配置
    chrome.storage.local.get(['xPurifierConfig', 'xPurifierSettings'], (result) => {
        if (result.xPurifierConfig) {
            config = result.xPurifierConfig;
        }
        if (result.xPurifierSettings) {
            settings = result.xPurifierSettings;
        }

        if (config && config.wtfSspAdSelector) {
            // 注入云端获取到的 CSS 规则
            injectCSS(config.wtfSspAdSelector);
        }

        // 启动 DOM 观察者
        initObserver();
    });

    // 监听后台配置更新，实现页面无需刷新的热更新！
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (changes.xPurifierConfig) {
                config = changes.xPurifierConfig.newValue;
                if (config && config.wtfSspAdSelector) injectCSS(config.wtfSspAdSelector);
                console.log("X Purifier Extension: Config live updated:", config);
            }
            if (changes.xPurifierSettings) {
                settings = changes.xPurifierSettings.newValue;
                console.log("X Purifier Extension: Settings live updated:", settings);
            }
            if (changes.xPurifierConfig || changes.xPurifierSettings) {
                applySettingsToDOM(); // Re-apply based on new settings
            }
        }
    });

})();
