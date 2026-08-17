# Jean Portfolio

Jean 的体验设计作品集网站。项目以温暖、治愈的草地场景和复古桌面窗口为主要视觉语言，包含个人介绍、精选案例、能力结构、工作经历和案例详情页。

## 当前体验

- 首页 IP 动画窗口支持拖动、最小化、放大播放、跳过和淡出。
- 案例详情使用深色背景与可移动、可缩放的文件展示窗口。
- PDF 案例在窗口内阅读，图片案例直接展示。
- 桌面端与移动端均有响应式适配。

## 技术栈

- React 19
- Next.js 16
- Vinext
- TypeScript
- Phosphor Icons
- Cloudflare Vite Plugin

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000/
```

## 验证命令

```bash
npm run build
npm run lint
npm test
```

## 主要文件

```text
app/PortfolioHome.tsx                    首页内容与交互
app/globals.css                          首页与全局视觉样式
app/caseData.ts                          案例数据
app/work/[slug]/page.tsx                 案例详情页
app/work/[slug]/case.css                 案例页样式
app/work/[slug]/ResizableDocumentWindow.tsx
                                            可移动、可缩放案例窗口
public/assets/                           首页图片、纹理和网站可调用素材
public/assets/ip/                        已筛选、可被网站直接引用的 IP 图片和视频
public/cases/                            案例封面
public/documents/                        案例 PDF
design/                                  交互稿、参考文件与 IP 创意资源库
design/ip-library/                       IP 源文件、Markdown 设定、参考图和整理记录
```

## 修改建议

小范围修改时，请先查看根目录的 `AGENTS.md`。它记录了项目结构、已确认的设计约束和验证要求，可减少重复扫描项目与重复描述上下文。

## 仓库与上线

GitHub 用于源码存储、版本管理和后续协作。当前项目基于 Vinext 与 Cloudflare 工具链，如需公开访问，推荐在 GitHub 仓库连接完成后继续配置 Cloudflare 部署。
