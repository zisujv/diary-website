# Puppy Diary Web 项目规范文档

## 1. 项目目标

构建一个以"线条小狗、小狗信箱、手写信、温柔邮差"为主题的个人日记网站。

核心体验：
- 每篇日记是一封信
- 收件箱是信箱
- AI 是温柔的邮差
- 整体视觉风格温暖、治愈、手绘感

技术栈：
- React + TypeScript
- 本地存储（localStorage）
- 纯前端实现
- 后续支持 Obsidian Markdown 导入

## 2. 核心世界观

**信件隐喻体系：**
- 日记 = 写给自己的信
- 新建日记 = 写信
- 收件箱 = 信箱（暂存区）
- 主目录 = 已归档的信件
- AI 邮差 = 帮助整理、打标签、安慰的温柔助手

**情感基调：**
- 温暖、治愈、陪伴
- 线条小狗的可爱与简约
- 手写信的私密与真诚
- 邮差的可靠与温柔

## 3. 页面路由

| 路由 | 页面名称 | 功能描述 |
|------|---------|---------|
| `/` | 首页 | 欢迎页，显示"欢迎来到我的 Diary Web"，有"点击进入"按钮 |
| `/diary` | 目录页 | 显示所有主目录日记，按时间排序，可切换新→旧/旧→新 |
| `/diary/:id` | 单日日记页 | 显示单篇日记详情，包括附件、正文、标签、心情分数 |
| `/new` | 新建日记页 | 创建新日记，填写标题、正文、标签、心情分数、上传附件 |
| `/inbox` | 收件箱页 | 显示所有 status 为 inbox 的日记，可投递至主目录 |
| `/search` | 搜索页 | 搜索日记标题/正文，按标签筛选，结果排序 |

**全局悬浮按钮（所有主要页面右下角）：**
- 新建（跳转 `/new`）
- 收件箱（跳转 `/inbox`）
- 搜索（跳转 `/search`）

## 4. 数据结构

### 4.1 DiaryEntry（日记条目）

```typescript
interface DiaryEntry {
  id: string;                    // 唯一标识符，使用 UUID
  date: string;                  // ISO 8601 格式，例如 "2025-05-24"
  time: string;                  // 24小时制，例如 "14:30"
  dayOfWeek: string;             // 星期，例如 "星期六"
  title: string;                 // 标题，最多 25 字
  content: string;               // 正文内容
  tags: string[];                // 标签数组
  moodScore: number;             // 心情分数，1-100
  moodNote?: string;             // 心情备注，可选
  attachments: Attachment[];     // 附件数组
  status: 'inbox' | 'archived';  // 状态：收件箱 | 主目录
  aiSummary?: string;            // AI 生成的总结，可选
  aiComfort?: string;            // AI 生成的安慰，可选
  createdAt: string;             // 创建时间戳
  updatedAt: string;             // 更新时间戳
}
```

### 4.2 Attachment（附件）

```typescript
interface Attachment {
  id: string;                    // 附件唯一标识符
  type: 'image' | 'audio' | 'video' | 'file';  // 附件类型
  url: string;                   // 附件 URL（Base64 或本地路径）
  name: string;                  // 文件名
  size?: number;                 // 文件大小（字节）
}
```

### 4.3 状态管理

使用 localStorage 存储所有日记数据：

```typescript
// localStorage key
const STORAGE_KEY = 'puppy_diary_entries';

// 存储格式
{
  entries: DiaryEntry[];
  lastUpdated: string;
}
```

## 5. 标签体系

**固定标签列表（不允许随意新增）：**

```typescript
const FIXED_TAGS = [
  '日常',
  '家人',
  '朋友',
  '社交',
  '感情',
  '学业',
  '工作',
  '成长',
  '心灵',
  '情绪',
  '焦虑',
  '开心',
  '低落',
  '孤独',
  '回忆',
  '旅行',
  '身体',
  '目标',
  '反思',
  '灵感',
  '待整理'
] as const;
```

**标签使用规则：**
- 用户只能从固定标签中多选
- AI 邮差自动打标签时也只能从固定标签中选择
- 不允许创建新标签
- 每篇日记可以有 0 到多个标签

## 6. 文件结构

```
diary-website/
├── public/
│   └── index.html
├── src/
│   ├── types/
│   │   └── diary.ts              # DiaryEntry, Attachment 类型定义
│   ├── storage/
│   │   └── diaryStorage.ts       # localStorage 读写、CRUD、搜索逻辑
│   ├── data/
│   │   ├── tags.ts               # 固定标签列表和验证函数
│   │   └── mockEntries.ts        # Mock 初始数据
│   ├── ai/
│   │   ├── autoTag.ts            # AI 自动打标签（mock）
│   │   ├── generateSummary.ts    # AI 生成总结（mock）
│   │   ├── generateComfort.ts    # AI 生成安慰（mock）
│   │   └── postman.ts            # AI 邮差主逻辑
│   ├── obsidian/
│   │   └── importer.ts           # Obsidian Markdown 导入逻辑
│   ├── components/
│   │   ├── common/
│   │   │   ├── FloatingButtons.tsx   # 全局悬浮按钮
│   │   │   ├── TagSelector.tsx       # 标签选择器
│   │   │   └── DatePicker.tsx        # 日期选择器
│   │   ├── attachments/
│   │   │   ├── AttachmentGrid.tsx    # 附件网格展示
│   │   │   ├── ImagePreview.tsx      # 图片放大预览
│   │   │   ├── AudioPlayer.tsx       # 音频播放器
│   │   │   └── VideoPlayer.tsx       # 视频播放器
│   │   └── diary/
│   │       ├── DiaryCard.tsx         # 日记卡片（目录页）
│   │       └── DiaryDetail.tsx       # 日记详情组件
│   ├── pages/
│   │   ├── HomePage.tsx          # 首页
│   │   ├── CatalogPage.tsx       # 目录页
│   │   ├── EntryPage.tsx         # 单日日记页
│   │   ├── NewEntryPage.tsx      # 新建日记页
│   │   ├── InboxPage.tsx         # 收件箱页
│   │   └── SearchPage.tsx        # 搜索页
│   ├── styles/
│   │   ├── theme.ts              # 主题色彩、字体定义
│   │   └── global.css            # 全局样式
│   ├── App.tsx                   # 路由配置
│   └── index.tsx                 # 入口文件
├── package.json
├── tsconfig.json
└── PROJECT_SPEC.md               # 本文档
```

## 7. 组件命名规范

### 7.1 文件命名
- 组件文件：PascalCase，例如 `DiaryCard.tsx`
- 工具函数文件：camelCase，例如 `storage.ts`
- 类型定义文件：camelCase，例如 `diary.ts`

### 7.2 组件命名
- React 组件：PascalCase，例如 `DiaryCard`
- 函数/变量：camelCase，例如 `getDiaryById`
- 常量：UPPER_SNAKE_CASE，例如 `FIXED_TAGS`
- 类型/接口：PascalCase，例如 `DiaryEntry`

### 7.3 CSS 类名
- 使用 kebab-case，例如 `diary-card`
- 使用 BEM 命名法，例如 `diary-card__title`、`diary-card--archived`

### 7.4 函数命名约定
- 获取数据：`get*`，例如 `getDiaryById`
- 创建数据：`create*`，例如 `createDiary`
- 更新数据：`update*`，例如 `updateDiary`
- 删除数据：`delete*`，例如 `deleteDiary`
- 搜索/筛选：`search*` / `filter*`，例如 `searchDiaries`
- AI 功能：`generate*` / `auto*`，例如 `generateSummary`、`autoTag`

## 8. 各子 Agent 的职责边界

### 8.1 UI / 视觉风格 Agent

**负责：**
- 色彩方案（线条小狗主题色）
- 字体选择（手写感、温暖感）
- 卡片样式（圆角、阴影、边框）
- 按钮样式（圆润、可爱）
- 标签样式（胶囊形、颜色）
- 附件网格视觉效果
- 整体线条小狗信箱风格
- `src/styles/theme.ts` 和 `src/styles/global.css`

**不负责：**
- 任何业务逻辑
- 数据结构
- 路由配置
- 状态管理

**输出文件：**
- `src/styles/theme.ts`
- `src/styles/global.css`

---

### 8.2 数据结构 / 状态管理 Agent

**负责：**
- TypeScript 类型定义（`DiaryEntry`、`Attachment`）
- localStorage 读写函数
- 日记增删改查逻辑（CRUD）
- 状态流转（inbox ↔ archived）
- 搜索、筛选、排序函数
- 数据验证逻辑

**不负责：**
- UI 组件
- 页面路由
- AI 逻辑
- Obsidian 导入

**输出文件：**
- `src/types/diary.ts`
- `src/storage/diaryStorage.ts`
- `src/data/tags.ts`
- `src/data/mockEntries.ts`

---

### 8.3 页面路由 / 基础前端 Agent

**负责：**
- React 页面组件
- 路由配置（React Router）
- 基础 UI 组件（表单、列表、卡片）
- 目录页、详情页、收件箱页、搜索页
- 调用数据层函数
- 页面间导航逻辑

**不负责：**
- 复杂 AI 逻辑
- 附件排版细节
- Obsidian 导入
- 数据结构设计

**输出文件：**
- `src/App.tsx`
- `src/pages/*.tsx`
- `src/components/common/FloatingButtons.tsx`
- `src/components/common/TagSelector.tsx`
- `src/components/common/DatePicker.tsx`
- `src/components/diary/DiaryCard.tsx`
- `src/components/diary/DiaryDetail.tsx`

---

### 8.4 附件排版 / 图片预览 Agent

**负责：**
- 图片网格排版（参考苹果手记）
- 视频播放器组件
- 音频播放器组件
- 文件附件展示
- 图片放大预览功能
- 附件上传逻辑

**不负责：**
- 日记数据主逻辑
- 页面路由
- AI 功能
- 搜索功能

**输出文件：**
- `src/components/attachments/AttachmentGrid.tsx`
- `src/components/attachments/ImagePreview.tsx`
- `src/components/attachments/AudioPlayer.tsx`
- `src/components/attachments/VideoPlayer.tsx`

---

### 8.5 AI 邮差 Agent

**负责：**
- `autoTag(content: string): string[]` - 自动打标签
- `generateSummary(content: string): string` - 生成总结
- `generateComfort(content: string): string` - 生成安慰
- `postmanProcessEntry(entryId: string): void` - 处理单篇日记
- `postmanProcessAllInbox(): void` - 处理所有收件箱日记
- 第一版使用 mock 函数，不接真实 API

**不负责：**
- UI 组件
- 数据存储逻辑
- 页面路由
- Obsidian 导入

**输出文件：**
- `src/ai/autoTag.ts`
- `src/ai/generateSummary.ts`
- `src/ai/generateComfort.ts`
- `src/ai/postman.ts`

---

### 8.6 Obsidian 导入 Agent

**负责：**
- 解析 Obsidian Markdown 文件
- 提取日期（从文件名或正文）
- 提取标题、正文、附件
- 转换为 `DiaryEntry` 数据结构
- 处理 Markdown 图片、Obsidian 图片、音频、视频链接

**不负责：**
- 网站页面
- UI 组件
- AI 功能
- 数据存储（调用数据层函数）

**输出文件：**
- `src/obsidian/importer.ts`

---

### 8.7 总控 Agent（本 Agent）

**负责：**
- 维护 `PROJECT_SPEC.md`
- 检查文件结构是否一致
- 检查类型定义是否冲突
- 检查各子 Agent 是否越界
- 提供最终整合建议
- 协调各子 Agent 工作

**不负责：**
- 重新设计分工
- 直接大规模重写所有代码（除非明确要求）
- 替代其他子 Agent 的工作

**输出文件：**
- `PROJECT_SPEC.md`

## 9. 开发顺序

### 阶段 1：数据层 + 类型定义
**负责 Agent：** 数据结构 / 状态管理 Agent

**任务：**
1. 定义 `DiaryEntry` 和 `Attachment` 类型
2. 实现 localStorage 读写函数
3. 实现日记 CRUD 函数
4. 实现搜索、筛选、排序函数
5. 定义固定标签列表和验证函数
6. 提供 Mock 初始数据

**验收标准：**
- 所有类型定义完整且无冲突
- localStorage 读写正常
- CRUD 函数可以正常增删改查
- 搜索函数可以按标题、正文、标签筛选
- 固定标签列表完整
- Mock 数据可用于测试

---

### 阶段 2：UI 主题 + 视觉风格
**负责 Agent：** UI / 视觉风格 Agent

**任务：**
1. 定义色彩方案（线条小狗主题）
2. 定义字体（手写感、温暖感）
3. 定义卡片、按钮、标签样式
4. 定义全局样式

**验收标准：**
- `theme.ts` 包含完整色彩、字体定义
- `global.css` 包含全局样式
- 视觉风格符合"线条小狗信箱"主题

---

### 阶段 3：基础页面 + 路由
**负责 Agent：** 页面路由 / 基础前端 Agent

**任务：**
1. 配置 React Router
2. 实现首页、目录页、单日日记页
3. 实现新建日记页、收件箱页、搜索页
4. 实现全局悬浮按钮
5. 实现基础表单组件（日期选择器、标签选择器）

**验收标准：**
- 所有页面路由正常
- 目录页可以显示日记列表
- 单日日记页可以显示日记详情
- 新建日记页可以创建日记
- 收件箱页可以显示收件箱日记
- 搜索页可以搜索日记
- 全局悬浮按钮在所有主要页面显示

---

### 阶段 4：附件排版 + 图片预览
**负责 Agent：** 附件排版 / 图片预览 Agent

**任务：**
1. 实现附件网格排版（参考苹果手记）
2. 实现图片放大预览
3. 实现音频播放器
4. 实现视频播放器
5. 实现文件附件展示

**验收标准：**
- 附件网格排版美观
- 图片可以点击放大预览
- 音频、视频可以正常播放
- 文件附件可以正常展示

---

### 阶段 5：AI 邮差（Mock 版本）
**负责 Agent：** AI 邮差 Agent

**任务：**
1. 实现 `autoTag` mock 函数
2. 实现 `generateSummary` mock 函数
3. 实现 `generateComfort` mock 函数
4. 实现 `postmanProcessEntry` 函数
5. 实现 `postmanProcessAllInbox` 函数

**验收标准：**
- AI 邮差可以自动打标签（mock）
- AI 邮差可以生成总结（mock）
- AI 邮差可以生成安慰（mock）
- AI 邮差可以处理单篇日记
- AI 邮差可以一键处理所有收件箱日记

---

### 阶段 6：Obsidian 导入
**负责 Agent：** Obsidian 导入 Agent

**任务：**
1. 解析 Obsidian Markdown 文件
2. 提取日期、标题、正文、附件
3. 转换为 `DiaryEntry` 数据结构
4. 调用数据层函数保存

**验收标准：**
- 可以导入 Obsidian Markdown 文件
- 日期、标题、正文、附件提取正确
- 导入后数据结构符合 `DiaryEntry` 定义

---

### 阶段 7：总控检查 + 整合
**负责 Agent：** 总控 Agent

**任务：**
1. 检查文件结构是否一致
2. 检查类型定义是否冲突
3. 检查各子 Agent 是否越界
4. 提供最终整合建议

**验收标准：**
- 所有文件结构符合 `PROJECT_SPEC.md`
- 所有类型定义无冲突
- 所有子 Agent 未越界
- 项目可以正常运行

## 10. 禁止事项

### 10.1 分工相关
- ❌ 禁止重新设计子 Agent 分工
- ❌ 禁止随意调整开发顺序
- ❌ 禁止子 Agent 越界开发（例如数据层 Agent 不能写 UI 组件）
- ❌ 禁止总控 Agent 直接大规模重写所有代码（除非明确要求）

### 10.2 标签相关
- ❌ 禁止随意新增标签
- ❌ 禁止用户手动输入标签
- ❌ 禁止 AI 邮差生成不在固定标签列表中的标签

### 10.3 数据相关
- ❌ 禁止修改 `DiaryEntry` 和 `Attachment` 类型定义（除非经过总控 Agent 审核）
- ❌ 禁止直接操作 localStorage（必须通过数据层函数）
- ❌ 禁止在多个文件中重复定义相同类型

### 10.4 日期相关
- ❌ 禁止用户手动键入日期（必须通过日期选择器）
- ❌ 禁止用户手动键入星期（必须自动生成或从合法选项中选择）
- ❌ 禁止非法日期格式

### 10.5 标题相关
- ❌ 禁止标题超过 25 个字

### 10.6 AI 相关
- ❌ 第一版禁止接入真实 API（必须使用 mock 函数）
- ❌ 禁止 AI 邮差修改日记正文内容

### 10.7 代码规范相关
- ❌ 禁止使用 any 类型（必须明确类型）
- ❌ 禁止在组件中直接写业务逻辑（必须抽离到 service 层）
- ❌ 禁止硬编码（必须使用常量或配置文件）

## 11. 每个阶段的验收标准

### 阶段 1：数据层 + 类型定义

**必须完成：**
- [x] `src/types/diary.ts` 包含 `DiaryEntry` 和 `Attachment` 类型定义
- [x] `src/storage/diaryStorage.ts` 包含 localStorage 读写、CRUD、搜索函数
- [x] `src/data/tags.ts` 包含固定标签列表和验证函数
- [x] `src/data/mockEntries.ts` 包含 Mock 初始数据

**验收测试：**
- [x] 可以创建一篇日记并保存到 localStorage
- [x] 可以读取所有日记
- [x] 可以更新一篇日记
- [x] 可以删除一篇日记
- [x] 可以按标题搜索日记
- [x] 可以按标签筛选日记
- [x] 可以按时间排序日记
- [x] 固定标签列表完整（21 个标签）
- [x] Mock 数据包含多种场景（已归档、收件箱、多附件等）

**验收结果：✅ 通过**

**备注：**
- 数据 Agent 将 localStorage 相关函数统一放在 `src/storage/diaryStorage.ts`，比原规范更合理
- 增加了 `mimeType` 字段用于附件类型判断，属于合理扩展
- 搜索相关性算法：标题权重 × 2 + 正文权重 × 1
- PROJECT_SPEC.md 已更新以反映实际文件结构

---

### 阶段 2：UI 主题 + 视觉风格

**必须完成：**
- [ ] `src/styles/theme.ts` 包含色彩、字体定义
- [ ] `src/styles/global.css` 包含全局样式
- [ ] 定义卡片、按钮、标签样式

**验收测试：**
- [ ] 色彩方案符合"线条小狗信箱"主题
- [ ] 字体有手写感、温暖感
- [ ] 卡片、按钮、标签样式圆润可爱
- [ ] 整体视觉风格统一

---

### 阶段 3：基础页面 + 路由

**必须完成：**
- [ ] `src/App.tsx` 包含路由配置
- [ ] `src/pages/HomePage.tsx` 首页
- [ ] `src/pages/CatalogPage.tsx` 目录页
- [ ] `src/pages/EntryPage.tsx` 单日日记页
- [ ] `src/pages/NewEntryPage.tsx` 新建日记页
- [ ] `src/pages/InboxPage.tsx` 收件箱页
- [ ] `src/pages/SearchPage.tsx` 搜索页
- [ ] `src/components/common/FloatingButtons.tsx` 全局悬浮按钮
- [ ] `src/components/common/TagSelector.tsx` 标签选择器
- [ ] `src/components/common/DatePicker.tsx` 日期选择器

**验收测试：**
- [ ] 首页显示"欢迎来到我的 Diary Web"和"点击进入"按钮
- [ ] 点击"点击进入"跳转到目录页
- [ ] 目录页显示所有主目录日记，按时间排序
- [ ] 点击日记卡片跳转到单日日记页
- [ ] 单日日记页显示日期、标题、正文、标签、心情分数
- [ ] 单日日记页有上一篇和下一篇按钮
- [ ] 新建日记页可以填写标题、正文、标签、心情分数
- [ ] 新建日记页日期必须通过日期选择器选择
- [ ] 新建日记页标签必须从固定标签中多选
- [ ] 新建日记页提交后默认发送到收件箱
- [ ] 收件箱页显示所有 status 为 inbox 的日记
- [ ] 收件箱页有"一键发送"按钮
- [ ] 搜索页可以搜索日记标题或正文
- [ ] 搜索页可以按标签筛选
- [ ] 全局悬浮按钮在所有主要页面显示

---

### 阶段 4：附件排版 + 图片预览

**必须完成：**
- [ ] `src/components/attachments/AttachmentGrid.tsx` 附件网格
- [ ] `src/components/attachments/ImagePreview.tsx` 图片放大预览
- [ ] `src/components/attachments/AudioPlayer.tsx` 音频播放器
- [ ] `src/components/attachments/VideoPlayer.tsx` 视频播放器

**验收测试：**
- [ ] 附件以正方形或长方形方式拼接（参考苹果手记）
- [ ] 点击图片后可以进入放大预览
- [ ] 音频附件可以正常播放
- [ ] 视频附件可以正常播放
- [ ] 文件附件可以正常展示
- [ ] 新建日记页可以上传图片、音频、视频、文件附件

---

### 阶段 5：AI 邮差（Mock 版本）

**必须完成：**
- [ ] `src/ai/autoTag.ts` 自动打标签（mock）
- [ ] `src/ai/generateSummary.ts` 生成总结（mock）
- [ ] `src/ai/generateComfort.ts` 生成安慰（mock）
- [ ] `src/ai/postman.ts` AI 邮差主逻辑

**验收测试：**
- [ ] AI 邮差可以自动打标签（从固定标签中选择）
- [ ] AI 邮差可以生成一句总结
- [ ] AI 邮差可以生成一句温和安慰
- [ ] AI 邮差处理后的日记从收件箱进入主目录
- [ ] 收件箱页有"AI 邮差处理"按钮
- [ ] 可以一键让 AI 邮差处理所有收件箱日记

---

### 阶段 6：Obsidian 导入

**必须完成：**
- [ ] `src/obsidian/importer.ts` Obsidian Markdown 导入逻辑

**验收测试：**
- [ ] 可以导入 Obsidian Markdown 文件
- [ ] 可以从文件名提取日期（例如 2025-05-24.md）
- [ ] 可以从正文提取日期（例如"原始日期：2025年5月24日 星期六"）
- [ ] 可以提取标题、正文、附件
- [ ] 可以处理 Markdown 图片、Obsidian 图片、音频、视频链接
- [ ] 导入后数据结构符合 `DiaryEntry` 定义

---

### 阶段 7：总控检查 + 整合

**必须完成：**
- [ ] 检查所有文件结构符合 `PROJECT_SPEC.md`
- [ ] 检查所有类型定义无冲突
- [ ] 检查所有子 Agent 未越界
- [ ] 检查所有禁止事项未违反

**验收测试：**
- [ ] 项目可以正常运行
- [ ] 所有页面路由正常
- [ ] 所有功能正常
- [ ] 视觉风格统一
- [ ] 代码规范统一
- [ ] 无类型错误
- [ ] 无 console 错误

---

## 12. 总控 Agent 工作流程

### 12.1 接收任务
- 用户指定某个子 Agent 开始工作
- 总控 Agent 确认该子 Agent 的职责边界
- 总控 Agent 确认该子 Agent 的输出文件

### 12.2 监督开发
- 检查子 Agent 是否越界
- 检查子 Agent 是否违反禁止事项
- 检查子 Agent 输出文件是否符合规范

### 12.3 验收成果
- 根据该阶段的验收标准检查
- 检查类型定义是否冲突
- 检查文件结构是否一致

### 12.4 整合建议
- 如果发现问题，提供具体修改建议
- 如果通过验收，确认进入下一阶段

---

## 13. 附录：技术栈

- **前端框架：** React 18+
- **语言：** TypeScript 5+
- **路由：** React Router 6+
- **样式：** CSS Modules / Styled Components（待定）
- **状态管理：** localStorage（第一版）
- **构建工具：** Vite / Create React App（待定）
- **AI：** Mock 函数（第一版），后续接入真实 API

---

## 14. 附录：参考资料

- **视觉参考：** 苹果手记（附件排版）
- **主题参考：** 线条小狗、小狗信箱、手写信、温柔邮差
- **色彩参考：** 温暖、治愈、手绘感

---

**文档版本：** v1.0  
**最后更新：** 2026-05-16  
**维护者：** 总控 Agent
