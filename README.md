# TailorAI - 邓总智能高级定制

一个基于AI的智能服装定制设计应用，集成豆包Seedream-4.5模型，支持完整的服装设计流程和自动定价计算。

## 功能特性

- **6步骤设计流程**：面料 → 款式 → 尺寸 → 量体 → 版型 → 生成
- **AI图像生成**：使用豆包Seedream-4.5生成高质量的服装设计图
- **自动定价**：根据面料、尺寸、版型、身材自动计算服装定价
- **实时预览**：生成后支持图片预览功能
- **响应式设计**：完美适配桌面和移动设备

## 技术栈

- **前端框架**：React 19 + TypeScript
- **样式框架**：Tailwind CSS
- **AI服务**：豆包在线推理（Seedream-4.5）
- **构建工具**：Vite

## 快速开始

### 前置条件

- Node.js 16+
- 豆包API密钥

### 安装和运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置环境变量，创建 `.env.local` 文件：
   ```
   DOUBAO_API_KEY=your_api_key_here
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 在浏览器中打开 `http://localhost:5173`

## 项目结构

```
src/
├── components/       # React组件
├── services/        # API服务
├── types.ts        # TypeScript类型定义
├── constants.ts    # 常量定义
├── App.tsx         # 主应用组件
└── main.tsx        # 入口文件
```

## 环境变量配置

在 `.env.local` 文件中设置：

```
DOUBAO_API_KEY=你的豆包API密钥
```

## 许可证

MIT
