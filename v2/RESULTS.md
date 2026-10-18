# v2 新增结果 · 2026-10-18

两份成品的 `prompt.txt`、`origin.jpg` 已与 v2 原文件逐字节核对一致。

## 成品

| 项目 | DeepSeek Flash 1017 Max + OpenCode | GPT-6 Astra + Codex |
| --- | --- | --- |
| 在线演示 | [打开](https://matcha-eason.github.io/harness_demonstration/v2/deepseek-flash1017-max-opencode/index.html) | [打开](https://matcha-eason.github.io/harness_demonstration/v2/gpt6-astra-ultra-codex/index.html) |
| 页面组织 | 七章：分布、噪声、夹具、多轮、学习、生产、原则 | 六幕：模型的起点、输出的发散、Harness 入场、多轮闭环、评价与学习、面向生产 |
| 主体 | 中央 SVG 输入输出动画，章节自动推进 | 中央 SVG 输入输出动画，章节与实验控件联动 |
| 交互 | 开始、播放暂停、前后章节、数字键导航、重播、全屏、原图与概念注记 | 约束滑杆、多轮推进、结果检查开关、运行时／训练切换、模拟交付、自动演示、速度调整、重置、全屏 |
| 本地资源 | `index.html` 与 `assets/origin.jpg` | 样式、脚本和原图缩略图内嵌于 `index.html` |
| 详细说明 | [README](deepseek-flash1017-max-opencode/README.md) | [README](gpt6-astra-ultra-codex/README.md) |

目录 `gpt6-astra-ultra-codex` 沿用现有名称；正式会话的 `turn_context` 记录模型为 `gpt-6-astra`、推理档位为 `xhigh`。本次统计和页面说明按实际记录标注。

## 耗时与用量

时区统一为 America/Los_Angeles。耗时为正式成品会话的观察时长，包含调研、实现、工具执行和检查。

| 指标 | DeepSeek Flash Max | GPT-6 Astra xhigh |
| --- | ---: | ---: |
| 开始 | 2026-10-18 00:54:42.898 | 2026-10-18 00:56:45.133 |
| 结束 | 2026-10-18 01:24:49.987 | 2026-10-18 01:25:27.039（会话中止） |
| 耗时 | 30 分 7 秒（1,807.089 秒） | 28 分 42 秒（1,721.906 秒） |
| 输入 tokens，含缓存 | 13,585,184 | 4,056,287 |
| 其中缓存输入 | 13,294,336 | 3,949,824 |
| 输出 tokens，含推理 | 197,318 | 36,948 |
| 其中推理输出 | 140,476 | 7,826 |
| 总 tokens | **13,782,502** | **4,093,235** |
| 输入缓存命中率 | 97.86% | 97.38% |
| 实际费用 | 未获取 | 未获取 |
| 原始字段与统计口径 | [run.json](deepseek-flash1017-max-opencode/run.json) | [run.json](gpt6-astra-ultra-codex/run.json) |

OpenCode 的未缓存输入、缓存读取、文本输出和推理分别记数；Codex 的输入已含缓存，输出已含推理。上表统一为同一口径，缓存和推理子项不再额外计入总数。缓存命中率 = 缓存输入 / 全部输入。

DeepSeek 用量由成品会话的 assistant 消息用量累计得到，含自动压缩与恢复过程。Astra 取最后一条累计 `token_count`，报告时刻为 01:25:16.480，距会话中止约 10.6 秒；独立的自动审批会话未纳入。早先的失败 CLI 试跑与本次仓库整理、发布均不计入上表。

这里的“一张图与一个提示词”指一次用户任务输入；正式会话仍包含工具循环和浏览器检查，不代表单次 API 响应。HTML 中的动画与模拟任务是教学示意，不是实测模型性能。

发布前使用 Chrome 检查两份最终 HTML：脚本语法、离线加载、章节切换和原图／说明弹窗通过；1440×1000 与 390×844 均未发现横向溢出、JavaScript 报错或缺失资源。成品 HTML 保持本次接收时的内容，预览图另行截取。

## 数据来源

- DeepSeek：OpenCode 会话 `ses_eb1fefe26ffeFPS7tloS3FBvL4`，记录版本 `1.19.1`，API 模型 `deepseek-official/deepseek-flash`，variant `max`。
- Astra：Codex 会话 `01a14e03-157f-7a83-91b3-b541165327ea`，CLI `0.163.0-alpha.10.2`，模型 `gpt-6-astra`，effort `xhigh`。
- 仅发布统计摘要；完整本地会话、认证信息和图片 Base64 不作为运行日志上传。
