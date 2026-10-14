# Harness Engineering 概念演示

直接用现代浏览器打开 `index.html`。CSS、JavaScript 与图解均内置，无须安装依赖或联网。`origin.jpg` 为用户提供的手稿，放在同一目录可在演示中查看。

演示共 7 章：核心直觉、输出发散、系统结构、多轮纠偏、训练与运行、生产任务、约束尺度。支持章节导航、方向键、PageUp / PageDown、Home / End，以及 F 全屏。浏览器打印可输出全部章节。

交互包括：Harness 开关、三种发散原因、四部分系统高亮、多轮路径推进、两种任务模拟和约束尺度调整。任务执行与曲线是教学示意，不调用模型、不运行真实任务、不代表实测性能。

## 对手稿的理解

保留黑色模型与行动、蓝色工程约束、红色潜在偏差。把“夹住输出”的图形比喻展开为输入、工具、验证、状态组成的工作闭环。强化学习的奖励优化与运行时 harness 分开解释；后者通常不更新模型参数。多轮偏差可能累积，也可以通过可信反馈改善。

## 核对资料

- [OpenAI — Harness engineering](https://openai.com/index/harness-engineering/)
- [Anthropic — Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI — Learning to reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/)

检索日期：2026-10-13。具体依据与概念补充也可在页面“理解与出处”中查看。
