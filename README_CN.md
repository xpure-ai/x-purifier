<div align="center">
  <img src="extension/img/logo_128.png" alt="X Purifier Logo" width="128">
</div>

# X Purifier

> 还你一个纯净的 X

[English](README.md)

一款轻量级 Chrome 扩展，帮你屏蔽 X (Twitter) 上的广告、推广和各种干扰元素，还你一个纯净的时间线。

---

## ✨ 功能特性

### 🧹 推文净化

| 功能 | 说明 |
|---|---|
| **广告推文** | 屏蔽带有"广告"、"Ad"、"推荐"标记的推文 |
| **已推广** | 屏蔽"已推广"、"Promoted"和"Boosted"推文 |
| **付费合作** | 屏蔽"付费合作"推文 |
| **AI 生成** | 屏蔽首页中"由 AI 生成"的内容 |

### 🧱 右侧栏净化

| 功能 | 说明 |
|---|---|
| **订阅 Premium** | 隐藏 Premium 订阅推广卡片 |
| **推荐关注** | 隐藏"推荐关注"区块 |
| **Trends** | 隐藏热门趋势区块 |
| **页脚** | 隐藏右侧栏底部的页脚导航 |

### ⚡ 技术亮点

- **自定义屏蔽** — 你的时间线你做主，用户可以自由选择开启或关闭特定内容的屏蔽
- **实时生效** — 修改设置后无需刷新页面，即时应用
- **MutationObserver** — 基于 DOM 观察者，高效拦截动态加载的内容
- **云端配置热更新** — 支持从 GitHub 远程拉取最新屏蔽规则，无需更新扩展
- **本地配置兜底** — 离线时自动使用本地内置配置
- **多语言关键词匹配** — 同时支持中英文关键词检测

---

## 📦 安装

### 从源码安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/xpure-ai/x-purifier.git
   ```

2. 打开 Chrome，进入扩展管理页面：
   ```
   chrome://extensions/
   ```

3. 开启右上角的 **开发者模式**。

4. 点击 **加载已解压的扩展程序**。

5. 选择项目中的 `extension` 文件夹。

---

## 🎛️ 使用方法

1. 点击浏览器工具栏中的 **X Purifier** 图标。
2. 在弹出菜单中，通过开关控制各项屏蔽功能。
3. 设置会自动保存并即时生效。

---

## 🏗️ 项目结构

```
x-purifier/
└── extension/
    ├── manifest.json    # 扩展配置 (MV3)
    ├── background.js    # 后台服务
    ├── content.js       # 内容脚本
    ├── popup.html       # 弹出界面
    ├── popup.js         # 弹出逻辑
    ├── config.json      # 默认屏蔽配置
    └── img/             # 扩展图标目录
```

---

## 🔧 配置说明

屏蔽规则定义在 `config.json` 中，包括：

- **`wtfSspAdSelector`** — 通过 CSS 选择器直接屏蔽的 SSP 广告元素
- **`keywords`** — 按分类的关键词列表（ads, promoted, paid, aiGenerated）
- **`primaryColumnSelector`** — 主时间线容器选择器
- **`sidebarColumnSelector`** — 右侧栏容器选择器
- **`adSpanSelector`** — 广告标签 span 选择器（排除推文正文内的内容）

扩展启动时会尝试从 GitHub 拉取最新配置，失败则使用本地配置。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

如果你发现有未被屏蔽的广告类型，可以：

1. 提交 Issue 描述该广告的特征。
2. 直接修改 `config.json` 添加新的屏蔽规则并提交 PR。

---

## 📄 许可证

MIT License

---

## 🔗 链接

- **GitHub**: [https://github.com/xpure-ai/x-purifier](https://github.com/xpure-ai/x-purifier)
