# 反应速度测试游戏

一个基于浏览器的反应速度测试游戏，用于测量用户的视觉反应速度。

## 项目结构

```
.
├── src/                    # 源代码目录
│   ├── interfaces/         # 核心接口定义
│   │   ├── GameController.ts
│   │   ├── TimerService.ts
│   │   ├── StateManager.ts
│   │   ├── UIRenderer.ts
│   │   └── index.ts
│   └── types/              # 数据模型定义
│       ├── GameState.ts
│       ├── GameRound.ts
│       ├── PerformanceRating.ts
│       ├── GameConfig.ts
│       └── index.ts
├── tests/                  # 测试目录
│   └── setup.ts
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目配置
└── vitest.config.ts        # 测试框架配置
```

## 安装依赖

```bash
npm install
```

## 开发命令

- `npm run build` - 编译 TypeScript 代码
- `npm test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 运行测试并生成覆盖率报告

## 技术栈

- TypeScript - 类型安全的 JavaScript
- Vitest - 快速的单元测试框架
- fast-check - 基于属性的测试库
