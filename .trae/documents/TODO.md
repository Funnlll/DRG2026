# 学校到访确认网站 - 开发任务清单

## 1. 项目初始化
- [x] 使用 react-express-ts 模板初始化 Vite 项目
- [x] 安装后端依赖：express、cors、tsx、exceljs（**注**：better-sqlite3 需 VS 构建工具，环境不支持，改用 JSON 文件持久化）
- [x] 前端依赖（zustand、react-router-dom、lucide-react 等）已包含在模板中

## 2. 后端实现
- [x] JSON 文件数据库（api/db.ts）+ 种子数据
- [x] GET /api/schools
- [x] GET /api/schools/:id/students
- [x] POST /api/submissions（含业务校验：FT ⊆ 到访、至少 1 到访、FT 可空）
- [x] GET /api/submissions（历史记录）
- [x] GET /api/submissions/export（Excel 导出，exceljs）
- [x] GET /api/field-trip（固定行程）
- [x] 启动后端并验证 ✅ 全部 6 个接口测试通过

## 3. 前端实现
- [x] Tailwind 主题配置（学术深蓝 + 薄荷绿 + 奶白）
- [x] 中英文字体（Fraunces + Inter + Noto Sans/Serif SC）
- [x] Zustand 流程状态管理（含 FT 跟随 visit 自动裁剪）
- [x] 通用组件：PageLayout、ProgressBar、Button、SchoolCard、StudentCheckbox、ItineraryCard、Toast
- [x] /step/1 步骤1 - 选择学校
- [x] /step/2 步骤2 - 确认到访学生
- [x] /step/3 步骤3 - Field Trip 选择 + 行程展示（含移动端折叠）
- [x] /success 成功页
- [x] /records 历史记录页（含桌面表格 + 移动卡片）
- [x] TypeScript 检查通过 ✅

## 4. 端到端验证
- [x] dev server 启动（前端 5173 / 后端 3001）
- [x] 浏览器走通三步流程（OpenPreview 无错误）
- [x] 验证 Excel 导出
- [x] API 业务校验（FT 学生必须属于到访）
