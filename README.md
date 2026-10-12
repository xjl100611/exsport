# exsport · 哪里痛，练什么

面向运动爱好者与「想动还没动」人群的运动科普站点。首页是一具可以旋转、可以点的 **3D 解剖人体**，
点身体上的发光热点，能看到这个部位为什么痛、哪些运动对它有帮助，再顺着进到运动详情页。

## 功能

- **3D 解剖人体首页**：肌肉（半透明）叠骨骼双层模型，可拖拽旋转、滚轮缩放、一键聚焦手指关节；
  痛点朝向镜头时显示，转到背面自动淡出。
- **34 个伤痛点**：每个部位包含常见成因、有帮助的运动、日常预防、就医红旗征、
  中医辨证与穴位参考（含禁忌）、现代医学十个维度（解剖 / 生理 / 病理 / 生化 / 药理 / 免疫 /
  微生物 / 诊断 / 内科 / 外科）。
- **20 项运动**：跑步、篮球、足球、羽毛球、乒乓球、网球、排球、游泳、健身、跳绳、拳击、
  瑜伽、普拉提、太极、骑行、徒步登山、滑雪、攀岩、滑板、飞盘。每项含规则、入门五步、
  装备清单、训练要点与常见错误。
- **智能客服**：接入 Dify 聊天应用，知识库由本项目内容导出。
- **收藏**：保存在浏览器本地（演示版不接账号）。

## 目录结构

```text
exsport/
  docs/               项目简报、页面蓝图
  app/                React 站点
    public/models/    npm 运行时加载的 3D 模型（meshopt 压缩后约 7.4MB）
    src/pages/        首页 / 分类 / 详情 / 关于
    src/components/   3D 人体、2D 人体、痛点面板、卡片等
    src/data/         sports.js（20 项运动）、injuries.js（34 痛点基础内容）、
                      tcm.js（中医）、med.js（现代医学）、anchors.json（痛点坐标）
    scripts/          模型转换、坐标生成、文档与知识库导出脚本
  知识库/             导出给 Dify 知识库的 Markdown（每个部位一个文件 + 索引）
```

## 快速开始

```bash
cd app
npm install
cp .env.example .env     # 填入自己的 Dify token 与地址
npm run dev              # 开发模式 http://localhost:5173
npm run build            # 生产构建到 dist/
npm run serve            # 用内置静态服务启动构建产物
npm run lint             # 代码检查
```

### 配置说明

聊天机器人通过环境变量注入，仓库里不含任何凭证：

| 变量 | 说明 |
|---|---|
| `VITE_DIFY_TOKEN` | Dify 聊天应用的 token（应用「嵌入网站」页可见） |
| `VITE_DIFY_BASE_URL` | Dify 服务地址，必须带端口，如 `http://localhost:8080` |

不配置也能正常运行，只是右下角的客服气泡不会出现。

## 数据与脚本

内容集中在三份数据文件里，按部位 `id` 对齐，新增部位时三处都要补：

```bash
cd app
node scripts/build-anchors.mjs          # 按解剖结构重算痛点坐标 → src/data/anchors.json
node scripts/obj-to-glb.mjs in.obj out.glb   # OBJ → GLB 转换（如需替换模型）
node scripts/export-injuries-docx.mjs   # 生成《伤痛知识手册》文档部件
node scripts/export-sports-docx.mjs     # 生成《运动资料》文档部件
node scripts/export-knowledge-base.mjs  # 生成 knowledge base 用的 Markdown
```

**痛点定位原理**：脚本读取模型网格的解剖学命名（例如 `right patella`、`occipital bone`、
`proximal phalanx of right index finger`），计算包围盒中心并沿体表方向外推，
因此新增痛点只需在脚本里加一条关键词规则，不需要手工标坐标。

### 未随仓库提供的源文件

`app/source-models/`（约 35MB 未压缩模型）未提交，需要时可自行获取：

- `anatomy.glb`（肌肉）、`skeleton.glb`（骨骼）：来自
  [BodyExplorer](https://github.com/JohanBellander/BodyExplorer) 的 `public/` 目录；
- `makehuman-base.obj`：来自
  [MakeHuman](https://github.com/makehumancommunity/makehuman) 的 `makehuman/data/3dobjs/base.obj`。

## 素材与许可

| 内容 | 来源与许可 |
|---|---|
| 3D 人体解剖数据 | [BodyExplorer](https://github.com/JohanBellander/BodyExplorer)，原始数据为 BodyParts3D（CC BY-SA 2.1 JP）与 Z-Anatomy（CC BY-SA 4.0），按 **CC BY-SA** 使用，需署名并以相同方式共享 |
| MakeHuman 基础网格 | CC0 1.0，可自由使用 |
| 站点代码 | 未附许可证，默认保留所有权利（如需他人复用，可自行添加 MIT 等许可证） |
| 文字内容 | 由 AI 生成底稿，参考公开医学教材与传统中医文献整理 |

## 免责声明

本站内容整理自公开医学教材与传统文献，仅供了解参考，**不构成诊断或用药建议**。
药物部分只说明类别与作用机制，不含剂量与用法。如有持续疼痛、症状加重或外伤，请及时就医。
正式对外发布前建议请专业医师审校内容。

## 已知限制

- 3D 模型约 7.4MB，移动网络首次加载偏慢；低性能设备会自动降级为 2D 人体图。
- 知识库内容即 `知识库/` 中的 Markdown，更新后需重新同步到 Dify。
- 演示版没有后端：收藏存本地，注册与评论为占位。
