# 青鸟家庭电商中台 V3.9-FROZEN 交互原型

本仓库是依据“青鸟标识 A 款封版”与 V3.9-FROZEN 需求制作的桌面端管理系统和 PC Worker 可交互原型。本轮已按《青鸟 V3.9-FROZEN 原型内部评审报告 R1.0》完成整改。

- 在线原型：<https://fanyufeiabc.github.io/qingniao-v39-prototype/#/web/DASH-001>
- 整改报告：[REMEDIATION_REPORT.md](./REMEDIATION_REPORT.md)
- 自动化回归结果：[qa/qa-result-v2.json](./qa/qa-result-v2.json)

## 本轮完成范围

- 145 个管理端页面和 20 个 PC Worker 页面均有独立 PageID、页面规格、路由和场景内容。
- 2030 个冻结字段、437 个冻结按钮、308 个 API 引用和 437 个 TestID 保持可追踪。
- 列表支持受控查询、重置、排序、分页、行选择、批量入口及 loading/empty/error/offline/no-permission/conflict/long-content 状态。
- 跨页携带 `entityId/version/sourcePage/filters/page/size/sort/tab/storeScope`，返回时恢复 QueryContext。
- 个人/家庭无货源主链路可交互演示：搜索探查 → 候选选择 → 正式采集 → 落库商品 → 查看/编辑 → 店铺草稿 → 订单回流 → 人工采购确认 → 货源物流回流与店铺同步。
- OWNER、OPS、HUMAN、AUDITOR、PC_WORKER 角色边界，以及 StoreScope/ObjectScope 均有原型级校验。
- PC Worker 仅执行 NAS Server 下发的不可变 ExecutionContext，并回传 Progress、ResultDTO、Evidence；不直接写业务数据库或裁决业务状态。

## 关键业务边界

- NAS Server 是唯一业务真源。
- 采集只有在标题、外部商品 ID、价格、平台必填 SKU、至少 1 张主图、SourceSnapshot、MediaManifest 和 Evidence 齐备并经 Server 校验后才算完成；PARTIAL 不伪装为 FULL。
- 商品编辑后同步目标默认是“电商店铺草稿”，不会自动上架。
- 外部写结果必须有外部对象 ID、PayloadHash 和 Evidence；UNKNOWN 先只读对账，禁止盲目重放。
- 采购必须由授权家庭成员明确确认；价格、库存或 SKU 变化时停止执行并转人工。
- 物流必须关联 Order 与 Purchase，校验承运商、运单号、状态和 Evidence；不得伪造已发货或已签收。

## 文件结构

- `dist/index.html`：GitHub Pages 入口。
- `dist/app-v2.js`：本轮整改后的交互与页面规格实现。
- `dist/styles.css`：青鸟 A 款桌面管理系统样式。
- `dist/data/requirements.js`：V3.9-FROZEN 浏览器端需求台账。
- `dist/data/requirements.json`：冻结需求结构化原始数据。

## 说明

这是开发/测试评审用高保真交互原型。平台 API、NAS 数据库和 PC Worker 的真实网络调用均以可验证的模拟状态呈现，不代表生产集成已经完成。冻结基线中发现的 API 动词、返回目标和“发布/店铺草稿”边界冲突没有被静默篡改，详见整改报告中的“需求基线待关闭事项”。
