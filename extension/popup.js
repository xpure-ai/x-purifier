document.addEventListener('DOMContentLoaded', () => {
    // 国际化文本替换
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        const message = chrome.i18n.getMessage(messageKey);
        if (message) {
            element.textContent = message;
        }
    });

    const blockAds = document.getElementById('blockAds');
    const blockPromoted = document.getElementById('blockPromoted');
    const blockPaid = document.getElementById('blockPaid');
    const blockAIGenerated = document.getElementById('blockAIGenerated');
    const blockPremium = document.getElementById('blockPremium');
    const blockRecommended = document.getElementById('blockRecommended');
    const blockTrends = document.getElementById('blockTrends');
    const blockFooter = document.getElementById('blockFooter');

    // 加载当前设置
    chrome.storage.local.get(['xPurifierSettings'], (result) => {
        if (result.xPurifierSettings) {
            const settings = result.xPurifierSettings;
            blockAds.checked = !!settings.blockAds;
            blockPromoted.checked = !!settings.blockPromoted;
            blockPaid.checked = !!settings.blockPaid;
            blockAIGenerated.checked = !!settings.blockAIGenerated;
            blockPremium.checked = !!settings.blockPremium;
            blockRecommended.checked = !!settings.blockRecommended;
            blockTrends.checked = !!settings.blockTrends;
            blockFooter.checked = !!settings.blockFooter;
        }
    });

    // 监听开关变化
    const updateSettings = () => {
        const settings = {
            blockAds: blockAds.checked,
            blockPromoted: blockPromoted.checked,
            blockPaid: blockPaid.checked,
            blockAIGenerated: blockAIGenerated.checked,
            blockPremium: blockPremium.checked,
            blockRecommended: blockRecommended.checked,
            blockTrends: blockTrends.checked,
            blockFooter: blockFooter.checked
        };
        chrome.storage.local.set({ xPurifierSettings: settings });
    };

    blockAds.addEventListener('change', updateSettings);
    blockPromoted.addEventListener('change', updateSettings);
    blockPaid.addEventListener('change', updateSettings);
    blockAIGenerated.addEventListener('change', updateSettings);
    blockPremium.addEventListener('change', updateSettings);
    blockRecommended.addEventListener('change', updateSettings);
    blockTrends.addEventListener('change', updateSettings);
    blockFooter.addEventListener('change', updateSettings);
});
