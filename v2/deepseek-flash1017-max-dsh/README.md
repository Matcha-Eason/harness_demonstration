# Harness 工程概念演示 · DeepSeek Flash 1017 Max + DeepSeek Harness（dsh）

本目录为 DeepSeek Harness（dsh）制作的 v2 结果；同模型的 OpenCode 结果存放在相邻的 [deepseek-flash1017-max-opencode](../deepseek-flash1017-max-opencode/README.md) 目录。

## 打开方式

- [index.html](index.html)：分文件版，需要同目录的 `styles.css`、`app.js` 和 `origin-web.jpg`。适合网页发布和维护。
- [harness-demo.html](harness-demo.html)：单文件版，已内嵌样式、脚本和展示用原图，可以单独复制后用浏览器打开。
- `origin.jpg`：完整原始参考图，已与 v2 原图逐字节核对一致。
- `origin-web.jpg`：分文件版弹窗使用的展示图片。

两种入口均为静态页面，无需安装依赖；外部资料链接需要联网访问。

## 内容与操作

七个场景以 LLM 输入输出动画为中心：裸模型、发散、输出夹具、多轮递归、学习信号、生产化 Agent、收束。

支持自动演示、播放暂停、前后场景、数字键 1–7、方向键与 PageUp / PageDown 导航、F 全屏、N 概念注记，以及触屏左右滑动。概念注记中可查看原始手稿。

动画路径、噪声与输出效果属于教学示意，页面不调用真实模型或训练服务。

## 记录

本次新增成品未附耗时、tokens 和费用记录；现有 OpenCode 版本的用量统计不适用于本目录。
