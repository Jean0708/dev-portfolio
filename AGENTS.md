# Jean Portfolio Project

## Project

- 这是 Jean Zhou 的体验设计作品集网站。
- 中文界面使用黑体字；英文可使用现有展示字体。
- 视觉基调是温暖、治愈、纸张与复古桌面窗口。
- 优先延续现有组件和样式，不重新设计无关区域。

## Key files

- 首页结构与交互：`app/PortfolioHome.tsx`
- 首页和全局样式：`app/globals.css`
- 案例数据：`app/caseData.ts`
- 案例详情：`app/work/[slug]/page.tsx`
- 案例页样式：`app/work/[slug]/case.css`
- 文件展示窗口：`app/work/[slug]/ResizableDocumentWindow.tsx`
- 首页素材：`public/assets/`
- 案例封面：`public/cases/`
- 案例 PDF：`public/documents/`
- 交互稿与设计参考：`design/`

## Confirmed behavior

- 首页动画小窗口可拖动、最小化、放大播放、跳过并淡出。
- 视频画面贴合窗口内容区，不保留内侧留白。
- 案例窗口通过标题栏移动，通过右下角手柄缩放。
- 案例窗口的移动和缩放不能互相抢手势。
- 案例详情保持深色页面背景。

## Working rules

- 小修改只读取目标组件和直接相关样式。
- 未明确要求时，不扫描或重构整个网站。
- 不读取 `node_modules/`、`.next/`、`.vinext/`、`dist/`。
- 不改变无关页面、文案、路由和素材。
- 复用现有 Phosphor 图标，不手绘替代图标。
- 不删除原始案例素材。
- 新增案例优先修改 `app/caseData.ts` 并复用现有详情页结构。

## Validation

完成代码修改后运行：

```bash
npm run build
npm run lint
```

Lint 中现有的 `<img>` 优化提示可以记录为 warning，但不能忽略 error。

## Token-efficient task format

后续任务优先写清：

```text
目标：
范围：
保留：
不要修改：
参考文件：
验证：
```

一个任务只处理一个页面区域。已确认版本及时提交 Git，后续修改从最近提交继续。
