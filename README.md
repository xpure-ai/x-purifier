<div align="center">
  <img src="extension/img/logo_128.png" alt="X Purifier Logo" width="128">
</div>

# X Purifier

> Pure X (Twitter) timeline. 

[中文文档](README_CN.md)

A lightweight Chrome extension that blocks ads, promotions and distracting elements on X (Twitter), giving you a clean and focused timeline.

---

## ✨ Features

### 🧹 Tweet Purification

| Feature | Description |
|---|---|
| **Ad Tweets** | Block tweets marked as "Ad" |
| **Promoted** | Block "Promoted" and "Boosted" tweets |
| **Paid Partnership** | Block "Paid Partnership" tweets |
| **AI Generated** | Block "Made with AI" content on the home timeline |

### 🧱 Sidebar Cleanup

| Feature | Description |
|---|---|
| **Premium Subscriptions** | Hide Premium subscription promotion card |
| **Who to Follow** | Hide "Who to Follow" recommendations |
| **Trends** | Hide trending topics section |
| **Footer** | Hide sidebar footer navigation |

### ⚡ Technical Highlights

- **Customizable Blocking** — You have full control. Freely toggle specific block rules on or off according to your preference.
- **Real-time Updates** — Changes apply instantly without page reload
- **MutationObserver** — Efficiently intercepts dynamically loaded content
- **Cloud Config Sync** — Cloud-synced blocking rules via GitHub, no extension update needed
- **Offline Fallback** — Falls back to local config when offline
- **Multilingual Support** — Supports both Chinese and English keyword detection

---

## 📦 Installation

### Install from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/xpure-ai/x-purifier.git
   ```

2. Open Chrome and navigate to extensions:
   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode** (top-right corner).

4. Click **Load unpacked**.

5. Select the `extension` folder from the project.

---

## 🎛️ Usage

1. Click the **X Purifier** icon in the browser toolbar.
2. Toggle blocking features on/off in the popup menu.
3. Settings are saved automatically and take effect immediately.

---

## 🏗️ Project Structure

```
x-purifier/
└── extension/
    ├── manifest.json    # Extension manifest (MV3)
    ├── background.js    # Service worker for config management
    ├── content.js       # Content script for DOM filtering
    ├── popup.html       # Popup UI
    ├── popup.js         # Popup logic
    ├── config.json      # Default blocking config
    └── img/             # Extension icons
```

---

## 🔧 Configuration

Blocking rules are defined in `config.json`, including:

- **`wtfSspAdSelector`** — CSS selectors for SSP ad elements.
- **`keywords`** — Categorized keyword lists (ads, promoted, paid, aiGenerated).
- **`primaryColumnSelector`** — Primary timeline container selector.
- **`sidebarColumnSelector`** — Sidebar container selector.
- **`adSpanSelector`** — Ad label span selector (excludes tweet body content).

The extension fetches the latest config from GitHub on startup, falling back to the local config on failure.

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

If you find unblocked ad types, you can:

1. Submit an Issue describing the ad characteristics.
2. Modify `config.json` to add new rules and submit a PR.

---

## 📄 License

MIT License

---

## 🔗 Links

- **GitHub**: [https://github.com/xpure-ai/x-purifier](https://github.com/xpure-ai/x-purifier)
