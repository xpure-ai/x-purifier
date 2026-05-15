const CLOUD_CONFIG_URL = 'https://raw.githubusercontent.com/xpure-ai/x-purifier/main/extension/config.json';

const DEFAULT_SETTINGS = {
    blockAds: true,
    blockPromoted: true,
    blockPaid: false,
    blockAIGenerated: false,
    blockPremium: true,
    blockRecommended: true,
    blockTrends: true,
    blockFooter: true
};

async function getLocalConfig() {
    try {
        const response = await fetch(chrome.runtime.getURL('config.json'));
        return await response.json();
    } catch (e) {
        console.error('Failed to load local config:', e);
        return null;
    }
}

// write default config
chrome.runtime.onInstalled.addListener(async () => {
    const localConfig = await getLocalConfig();
    chrome.storage.local.get(['xPurifierSettings'], (result) => {
        chrome.storage.local.set({
            xPurifierConfig: localConfig,
            xPurifierSettings: { ...DEFAULT_SETTINGS, ...(result.xPurifierSettings || {}) }
        });
    });
});

chrome.runtime.onStartup.addListener(() => {
    fetchConfig();
});


async function fetchConfig() {
    try {
        const response = await fetch(CLOUD_CONFIG_URL);
        const data = await response.json();

        if (data.wtfSspAdSelector || data.keywords) {
            chrome.storage.local.set({ xPurifierConfig: data });
            console.log("Config updated from cloud:", data);
        }
    } catch (error) {
        console.error("Failed to fetch cloud config, falling back to local storage.", error);
        chrome.storage.local.get(['xPurifierConfig', 'xPurifierSettings'], async (result) => {
            const updates = {};
            if (!result.xPurifierConfig) {
                updates.xPurifierConfig = await getLocalConfig();
            }
            if (!result.xPurifierSettings) {
                updates.xPurifierSettings = DEFAULT_SETTINGS;
            }
            if (Object.keys(updates).length > 0) {
                chrome.storage.local.set(updates);
            }
        });
    }
}
