# Harness 工程演示

本仓库收录 Gemini 网页版、Qwen 3.8 Max、Codex 和 Kimi K3 Workbuddy 根据同一张参考图制作的 Harness 工程 HTML 演示，供在线体验和对比。仓库同时保留参考图、提示词及用量记录。

## 在线演示

点击下方链接即可打开演示。链接指向 GitHub Pages，可直接分享给其他人。

### v1：概念阐释

第一轮要求根据参考图解释 Harness 工程，还原图片想表达的内容，并允许适当扩充和调研核对理解。

| 工具 | 在线演示 |
| --- | --- |
| Gemini 网页版 | [打开 Gemini v1](https://matcha-eason.github.io/harness_demonstration/v1/gemini4argon-web-chat/harness_engineering_demo.html) |
| Qwen 3.8 Max / OpenCode | [打开 Qwen v1](https://matcha-eason.github.io/harness_demonstration/v1/qwen38max-opencode/harness-engineering.html) |
| Codex | [打开 Codex v1](https://matcha-eason.github.io/harness_demonstration/v1/gpt6.1sol-codex/index.html) |
| Kimi K3 / Workbuddy | [打开 Kimi v1](https://matcha-eason.github.io/harness_demonstration/v1/kimi-k3-workbuddy/harness-engineering.html) |

### v2：以 LLM 输入输出图为中心的动画

第二轮在第一轮要求上，增加“整体以 LLM 输入输出图为中心的动画”，便于观察不同工具对同一要求的呈现方式。

| 工具 | 在线演示 |
| --- | --- |
| Gemini 网页版 | [打开 Gemini v2](https://matcha-eason.github.io/harness_demonstration/v2/gemini4argon-web-chat/harness_engineering.html) |
| Qwen 3.8 Max / OpenCode | [打开 Qwen v2](https://matcha-eason.github.io/harness_demonstration/v2/qwen38max-opencode/index.html) |
| Codex | [打开 Codex v2（dist 成品）](https://matcha-eason.github.io/harness_demonstration/v2/gpt6.1sol-codex/harness-demo/dist/) |
| Kimi K3 / Workbuddy | [打开 Kimi v2](https://matcha-eason.github.io/harness_demonstration/v2/kimi-k3-workbuddy/harness-engineering.html) |

## 本地查看与文件位置

下载或克隆仓库后，可用浏览器打开对应 HTML 文件。请保留演示目录内的图片等资源文件。

- `v1/`、`v2/`：两轮演示，按工具分目录存放。
- [v1 提示词](v1/prompt.txt)、[v2 提示词](v2/prompt.txt)：两轮原始要求。
- Codex v2 的可直接查看成品位于 `v2/gpt6.1sol-codex/harness-demo/dist/index.html`，同目录的 `origin.jpg` 为参考图资源。
- [usage.txt](usage.txt)：原始用量记录。

## 工具用量（估算）

| 工具 | 本次记录 |
| --- | --- |
| Gemini 网页版 | 两次，每次约 7–8 分钟；两次合计约占周限额 2%。网页版未显示准确耗时。 |
| Qwen 3.8 Max | 两次分别约 11、13 分钟；合计 1.26M tokens，缓存命中 88%，成本约 $0.91。 |
| Codex | 记录耗时约 14 分钟；第一次 1.41M tokens，缓存命中 95%，成本约 $0.54；第二次 1.56M tokens，缓存命中 95.1%，成本约 $0.50。另有一次模型容量不足提示。 |
| Kimi K3 Workbuddy | 首次约 10 分钟、70 积分；第二次约 350 积分，多次返工，手动定位解决。 |

耗时、费用及额度来自本次操作的近似记录，供参考。
