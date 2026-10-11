# 青鸟 PRD V9.2.0

当前版由V9.1.2完整规范与以下V9.2.0修订共同组成。新旧同字段规则以V9.2.0为准；保留历史编号和未整改业务，不把待验证标作通过。

# 青鸟 V9.2.0 需求设计与整改

版本日期：2026-10-12（北京时间）。基线 V9.1.2-W8R2B-C1，原型基线提交4a29e46。本版纠正登录与会话入口、店铺后台地址及配置停用，核对完整业务链并保留已有业务功能。本章及当前合同覆盖旧同字段规则，其余历史规范继续有效。整链真实验证和其余界面收口尚未完成。

## R920-01 平台和账号分别管理

多个货源/销售平台、各平台多个账号；配置登记不开放适配。平台、账号和店铺均可新增、编辑及停用，身份历史不删。配置停用须先处理活动任务或UNKNOWN锁。

页面：SYS-001 SYS-002 STORE-001。实现：configuration-flow.js; V038; configuration-ui.js。

## R920-02 指定店铺后台地址

本人维护店铺managementUrl。登录请求优先店铺后台地址，其次明确配置的平台loginUrl；无地址则阻断，禁止推测平台官网。地址、方式、账号、店铺、档案和设备按当前版本冻结。

页面：STORE-001 PC-003。实现：configuration-flow.js; V038。

## R920-03 扫码和账号密码

本人在固定PC的独立平台网页扫码或输入账号密码。青鸟不采集密码或验证码。是否支持扫码由平台实际页面决定；不支持时本人改选支持方式。扫码完成仅为动作，成功需身份核对，不自动设linked=true。

页面：SYS-002 PC-003。实现：configuration-login.js; configuration-login UI。

## R920-04 本机Cookie登录状态

优先复用同账号独立浏览器档案的登录状态；高级导入仅在本机控制台选择64KB以内JSON，本人确认后校验平台域名、到期、格式与重复项，注入指定档案并回读页面。内容不传NAS、不写青鸟配置或日志；失效或串号需重登并核对。不同账号不共享档案。

页面：SYS-002 PC-003。实现：local-cookie-import.js; configuration-login.js; PC console。

## R920-05 区分UTP和浏览器授权

1688 UTP授权会话与PC浏览器Cookie分别管理。UTP session_status及能力合同决定UTP身份/可执行性，不能把网页登录或扫码当成UTP授权成功。历史linked=false时只读能力可用，不写死所有能力必须Login+Link；采购按独立买家身份与写合同核验。登录/Link关系仍待真实SIT。

页面：SYS-001 SYS-002 SRC-001 PUR-003 PC-003。实现：existing UTP adapters; operation-specific contracts。

## R920-06 PC连接状态

配对令牌一次展示且不落盘；每账号独立档案及目录，固定配对设备。设备配对、最近心跳、Windows交互会话、平台会话、本人身份核对与业务适配分别显示。NAS页面打开127.0.0.1控制台须在本人固定PC上访问。停Agent后登录，关闭登录浏览器再启动，不能同时占用档案。

页面：SYS-003 PC-001 PC-002 PC-003。实现：platform-setup.js; console.js; profiles.js; configuration-ui.js。

## R920-07 人工处理和恢复

登录、验证码、风控和身份异常等待本人；人工在固定PC完成处理，再观察身份并回NAS确认。身份确认不代替发布、采购或物流关键确认。任务等待人工与写入后结果未知分别恢复；结果未知保留锁、原确认和外部身份，只允许只读对账，不重放原写入。

页面：DASH-002 DASH-003 SYS-009 PC-003 PC-006。实现：existing service.js/sweeper/domain operations/executors。

## R920-08 商品全流程

搜索/链接/店铺采集→选择→落库→商品列表→编辑保存回读。原始证据、商品/SKU身份、分页去重、币种金额单位、价格/库存观察时间、媒体来源授权和质量均保留。包装字段先人工核对，旧版本阻断覆盖。AI CLEAN/INSPECT和OCR仅提供可追溯建议。袜子内衣的材质、成分、尺码、包装等不得由模型猜测。

页面：SRC-001 PRD-001 PRD-002 PKG-001 CAT-001。实现：source adapters/workspace/workbench/packaging OCR/category/media。

## R920-09 投影草稿及发布

每个商品版本向指定店铺投影；类目、SKU和媒体映射通过后同步草稿并回读。本人核对快照和当前版本后提交审核/发布。提交回执、审核中/驳回、在售分别回读，禁止把点击成功当成在售。

页面：STORE-002 STORE-003 STORE-004 JD-001 JD-005。实现：store-publication/jd-native-draft/jd-publication and existing executors。

## R920-10 订单回流及采购

店铺、订单、订单项、SKU和包裹身份分别保存，分页重叠去重并回读。销售明细按货源SKU映射生成采购草稿，本人核对价格、数量、地址和平台身份后建单，外部订单编号回读。支付本人在外部平台执行；缺明细不得推断采购数量。

页面：ORD-001 ORD-001-D PUR-001 PUR-002 PUR-003 JD-006。实现：store-order-sync/wechat-order-read/jd-order-read/purchase-workflow。

## R920-11 采购及店铺物流

采购包裹与销售订单项按明细关联，处理多采购单、多包裹、部分发货、拆合包。本人核对承运商、运单及配送身份，确认同步后回读；同承运商+运单不得重复发货，UNKNOWN先对账。缺真实多包裹样本标待验证。

页面：LOG-001 LOG-002。实现：fulfillment-workflow; platform origin/adapters。

## R920-12 售后费用及退款

一笔店铺售后涉及多采购单，由本人按商品明细分别关联，退款金额本人手工分配。两侧售后、费用、退款分别核对，缺失显示待补/估算/待分配；不自动支付退款或裁决。不把两侧退款抵销当成结算完成。

页面：AS-001 AS-002 FIN-003。实现：aftercare-workflow/aftersale/finance and platform origins。

## R920-13 证据与版本

设计支持、源码实现、本地模拟/HTTP回归、真实平台验证分别记录。保留原需求与字段按钮编号；V001–V037原SQL不改，仅加V038。空开发库用38迁移；现库先备份、账本及重复项检查，生产后置SIT。原型不包含真实Cookie、密码、订单个人信息。

页面：all。实现：release/audit/contract/tests/installation workflow。

## 新字段及保存规则

configurationEnabled为配置启停，与adapterEnabled业务适配开关分别管理。managementUrl可空，非空须HTTPS且不含凭据或敏感令牌；登录优先此地址。保存后GET核对同对象、全部可编辑字段及版本；重复409、旧版本412、非法字段422。编辑入口/方式/身份或停用时，旧核对失效，待登录请求取消；不删除业务历史或UNKNOWN锁。启用后重新核对。

## 本人确认及暂停边界

PC人工观察和NAS本人确认保留当前两步；这是身份核对，不是发布或采购授权。登录期间Agent停止，控制台保存/启动/退出阻断；关闭登录窗口后本人重新启动。已有采购、发布、物流的确认快照、版本、幂等和UNKNOWN恢复规则保留。没有远程控制或自动解决验证码、风控的承诺。

## 尚待验证

真实三种登录方式、Cookie跨重启复用、真实平台身份自动提取、UTP Login/Link关系、目标NAS/PostgreSQL、Windows实机安装运行、同订单多商品多包裹及物流售后费用样本、不同宽度与缩放继续SIT。历史实际界面与原型详细路由67项差异保留为待逐页收口，不能以本次配置整改关闭。


# 继承的完整规范与历史修订

本次修订 V9.1.2-W8R2B-C1 基础配置流程。原商品、采购、履约和售后要求保留，配置流程以文末修订章及本版接口合同为准。

青鸟逐页面功能规格

V9.1.2-W8R2B-C1  NAS 与 Windows PC 共 54 页完整 PRD

每页独立列出入口、作用域、查询项、展示字段、按钮显示与启用条件、跳转和异常恢复。字段稳定键为 FieldID；ReadModel 使用 fields[FieldID]，原 V9 候选属性为兼容别名，开发必须按本版稳定键实现与回归。

0 全页统一合同

查询默认 20 条、可选 50，稳定排序；列表未知值显示“待补／待验证”，显示观察时间。每页 GET /ui/readmodels/{pageId} 返回 54 个页面各自的精确 Fields/Query Schema；所有字段 FieldID 固定，null 与 valueStates 表达未观察。页面路由携带内部对象 ID、店铺与账号上下文；服务端不信任可见标签。操作者为本人，配置受本机主人身份保护。外部写需用户确认、账号/独立 Profile 与租约双端核验，UNKNOWN 只读回读。

01  DASH-001  工作台

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：工作台；路由 #/dashboard；关联需求 REQ-OPS-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/dashboard。ReadModel：GET /ui/readmodels/DASH-001；响应字段键固定为 PageReadModel.DASH-001.fields[FieldID]。

业务流程：聚合待办与统计只读显示；按业务对象保留深链，登录和人工确认任务不得在工作台直接越过门禁。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

DASH-001-F-001 | 待处理 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-001"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-002 | 今日新增订单 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-002"] | derived(qn.sales_order by 当前本人可操作的店铺范围 and local date)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-003 | 待采购 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-003"] | derived(qn.purchase_suggestion.state and qn.business_task)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-004 | 待回填物流 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-004"] | derived(qn.supplier_shipment and qn.store_shipment_task)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-005 | 1688货源 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-005"] | derived(qn.source_product and qn.source_product_snapshot)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-006 | 设备健康状态 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-006"] | derived(qn.browser_profile and Worker heartbeat):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-007 | 小红书 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-007"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-008 | 微信小店 / METRIC | PageReadModel.DASH-001.fields["DASH-001-F-008"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-009 | 小红书店铺需要重新验证登录 / STATUS_CHECK | PageReadModel.DASH-001.fields["DASH-001-F-009"] | derived(qn.browser_profile and Worker heartbeat):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-010 | 采购建议：供应商价格上涨 14.6% / STATUS_CHECK | PageReadModel.DASH-001.fields["DASH-001-F-010"] | derived(qn.purchase_suggestion.state and qn.business_task)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-011 | 3个商城订单已获得供应商运单 / STATUS_CHECK | PageReadModel.DASH-001.fields["DASH-001-F-011"] | derived(qn.sales_order by 当前本人可操作的店铺范围 and local date)；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-001-F-012 | 商品“夏季纯棉短袖”小红书类目待映射 / STATUS_CHECK | PageReadModel.DASH-001.fields["DASH-001-F-012"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /dashboard/summary; POST /work-items/{id}/open-context〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

DASH-001-C-001 刷新 | NAS_READ GET /dashboard/summary | 输入合法且账号/能力满足该项只读动作 | 输入合法且账号/能力满足该项只读动作；加载、空、失败有明确反馈；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；输入合法且账号/能力满足该项只读动作；加载、空、失败有明确反馈；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-001-C-002 去登录 | TASK_ACCEPT POST /work-items/{id}/open-context | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PC-003；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-001-C-003 去确认 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-001-C-004 去回填 | UI_LOCAL   | 当前店铺身份及能力有效、对象状态允许、写请求带幂等键 | 当前店铺身份及能力有效、对象状态允许、写请求带幂等键；UNKNOWN 先回读对账；LOG-002 物流回填确认（带销售订单与包裹上下文）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | LOG-002；当前店铺身份及能力有效、对象状态允许、写请求带幂等键；UNKNOWN 先回读对账；LOG-002 物流回填确认（带销售订单与包裹上下文）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-001-C-005 去适配 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PRD-005 平台适配；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PRD-005；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PRD-005 平台适配；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-001-C-006 查看全部 | UI_LOCAL   | 链接目标和当前对象身份已验证 | 链接目标和当前对象身份已验证；在受控上下文打开；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；链接目标和当前对象身份已验证；在受控上下文打开；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-DASH-001-C-001-P, T-C-DASH-001-C-002-P, T-C-DASH-001-C-003-P, T-C-DASH-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

02  DASH-002  待处理

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：工作台；路由 #/todo；关联需求 REQ-OPS-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/todo。ReadModel：GET /ui/readmodels/DASH-002；响应字段键固定为 PageReadModel.DASH-002.fields[FieldID]。

业务流程：按任务类型、紧急度和店铺过滤；每条待办绑定对象、原因、下一步及恢复状态，处理后刷新而非静默消失。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：全部待处理、按优先级；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

DASH-002-F-005 | 全部待处理 / QUERY_OR_INPUT | PageReadModel.DASH-002.query["DASH-002-F-005"] | 仅改本页 QueryContext；空值为默认授权范围，查询重新从第 1 页取数；输入按本项 type/enum 校验；未知枚举返回 422。

DASH-002-F-006 | 按优先级 / QUERY_OR_INPUT | PageReadModel.DASH-002.query["DASH-002-F-006"] | 仅改本页 QueryContext；空值为默认授权范围，查询重新从第 1 页取数；输入按本项 type/enum 校验；未知枚举返回 422。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

DASH-002-F-001 | 类型 / TABLE_COLUMN | PageReadModel.DASH-002.fields["DASH-002-F-001"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /work-items/todo〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-002-F-002 | 业务对象 / TABLE_COLUMN | PageReadModel.DASH-002.fields["DASH-002-F-002"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /work-items/todo〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-002-F-003 | 原因 / TABLE_COLUMN | PageReadModel.DASH-002.fields["DASH-002-F-003"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /work-items/todo〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-002-F-004 | 优先级 / TABLE_COLUMN | PageReadModel.DASH-002.fields["DASH-002-F-004"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /work-items/todo〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

DASH-002-C-001 去PC登录 | TASK_ACCEPT POST /work-items/{id}/open-context | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PC-003；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-002 去确认 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-003 去处理 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-004 去回填 | UI_LOCAL   | 当前店铺身份及能力有效、对象状态允许、写请求带幂等键 | 当前店铺身份及能力有效、对象状态允许、写请求带幂等键；UNKNOWN 先回读对账；LOG-002 物流回填确认（带销售订单与包裹上下文）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | LOG-002；当前店铺身份及能力有效、对象状态允许、写请求带幂等键；UNKNOWN 先回读对账；LOG-002 物流回填确认（带销售订单与包裹上下文）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-005 去处理 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-006 上一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-007 1 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-008 2 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-002-C-009 下一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-DASH-002-C-001-P, T-C-DASH-002-C-002-P, T-C-DASH-002-C-003-P, T-C-DASH-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

03  DASH-003  异常中心

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：工作台；路由 #/exceptions；关联需求 REQ-OPS-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/exceptions。ReadModel：GET /ui/readmodels/DASH-003；响应字段键固定为 PageReadModel.DASH-003.fields[FieldID]。

业务流程：异常展示任务、原因、发生时间、影响对象和可恢复动作；外部写 UNKNOWN 只允许对账，不开放盲重试。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

DASH-003-F-001 | 来源 / TABLE_COLUMN | PageReadModel.DASH-003.fields["DASH-003-F-001"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /exceptions〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-003-F-002 | 异常 / TABLE_COLUMN | PageReadModel.DASH-003.fields["DASH-003-F-002"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /exceptions〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-003-F-003 | 影响 / TABLE_COLUMN | PageReadModel.DASH-003.fields["DASH-003-F-003"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /exceptions〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-003-F-004 | 建议处理 / TABLE_COLUMN | PageReadModel.DASH-003.fields["DASH-003-F-004"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /exceptions〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

DASH-003-F-005 | 状态 / TABLE_COLUMN | PageReadModel.DASH-003.fields["DASH-003-F-005"] | derived(qn.business_task and qn.audit_event):本人可见的 business_task.state∈{NEEDS_HUMAN,UNKNOWN,FAILED} 与 external_write_lock 联合；按 task.id 去重，audit_event 取最近动作；GET /exceptions〔COMPUTED〕 | 按 derived(qn.business_task and qn.audit_event):WORK_ITEM_RULE_PENDING 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

DASH-003-C-001 导出诊断摘要 | TASK_ACCEPT POST /diagnostics/export | 有导出动作许可和店铺范围 | 有导出动作许可和店铺范围；生成脱敏文件并记录审计；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；有导出动作许可和店铺范围；生成脱敏文件并记录审计；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-002 去处理 | TASK_ACCEPT POST /exceptions/{id}/open-context | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-003 查看任务 | TASK_ACCEPT POST /exceptions/{id}/open-context | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-004 处理映射 | TASK_ACCEPT POST /exceptions/{id}/open-context | 页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效 | 页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效；写操作另需版本、动作权限和可执行状态，精确枚举待机器契约审定。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效；写操作另需版本、动作权限和可执行状态，精确枚举待机器契约审定。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-005 查看设备 | TASK_ACCEPT POST /exceptions/{id}/open-context | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-006 上一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-007 1 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-008 2 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

DASH-003-C-009 下一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-DASH-003-C-001-P, T-C-DASH-003-C-002-P, T-C-DASH-003-C-003-P, T-C-DASH-003-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

04  SRC-001  货源搜索

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：货源采集；路由 #/source-search；关联需求 REQ-COL-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员；目标 1688 账号有效，SourceAccountID 与 BrowserProfile/UTP 能力一致。。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：#/source-search。ReadModel：GET /ui/readmodels/SRC-001；响应字段键固定为 PageReadModel.SRC-001.fields[FieldID]。

业务流程：选择已绑定且身份有效的 1688 账号，校验关键词/商品 ID/链接及数值过滤，执行只读搜索；展示本次结果与时间。加入候选或正式采集是后续独立动作，搜索本身不生成正式货源商品。

查询语义：1688 · 默认采购账号、关键词、价格不限、起批量不限、库存不限；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

SRC-001-F-001 | 1688 · 默认采购账号 / 1688 · 默认采购账号 | PageReadModel.SRC-001.query["SRC-001-F-001"] | 从已绑定且可访问的账号列表选取；传内部账号 ID，Server 校验平台角色和实际观测身份。

SRC-001-F-002 | 关键词 / 关键词 | PageReadModel.SRC-001.query["SRC-001-F-002"] | 去首尾空白；空值不追加关键词条件。1688 商品 ID/链接作精确匹配，商品/标题文字按包含匹配；识别不了输入类型时明确提示，不猜测外部身份。

SRC-001-F-003 | 价格不限 / 价格不限 | PageReadModel.SRC-001.query["SRC-001-F-003"] | 页面显示不可用原因；非空条件不发外部搜索，服务端 422；不得静默忽略

SRC-001-F-004 | 起批量不限 / 起批量不限 | PageReadModel.SRC-001.query["SRC-001-F-004"] | 页面显示不可用原因；非空条件不发外部搜索，服务端 422；不得静默忽略

SRC-001-F-005 | 库存不限 / 库存不限 | PageReadModel.SRC-001.query["SRC-001-F-005"] | 页面显示不可用原因；非空条件不发外部搜索，服务端 422；不得静默忽略

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-001-F-006 | 搜索结果列 externalProductId / 搜索结果列 externalProductId / ['string', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-006"] | UTP body.products[].id → business_task.result_json.items[].externalProductId，按账号＋任务作用域〔PLATFORM_OBSERVATION〕 | 有 ID 才可加入候选；同账号同 ID 幂等，详情 ID 本次为候选连续。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-007 | 搜索结果列 title / 搜索结果列 title / ['string', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-007"] | UTP body.products[].title → business_task.result_json.items[].title〔PLATFORM_OBSERVATION〕 | 缺值显示“未获取”，不得借其他商品标题。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-008 | 搜索结果列 priceAndCurrency / 搜索结果列 priceAndCurrency / ['object', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-008"] | UTP body.products[].price_range.min/max.amount,currency → items[].priceRange；单位不在列表〔PLATFORM_OBSERVATION〕 | 显示 CNY 最低～最高及“计价单位待核”；不可当确认采购价或用于单位未明的价格筛选。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-009 | 搜索结果列 moq / 搜索结果列 moq / ['number', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-009"] | 搜索列表无 MOQ；选中详情 body.product.b2b_pricing.moq 为候选补采源〔PLATFORM_OBSERVATION〕 | 列表显示“待详情”；选中后按需取 MOQ；单位未明不按 MOQ 筛选。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-010 | 搜索结果列 stockObservation / 搜索结果列 stockObservation / ['object', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-010"] | 搜索列表无库存；选中详情 body.product.variants[].stock 为规格库存候选〔PLATFORM_OBSERVATION〕 | 列表显示“待详情”；规格库存独立展示，不求和为商品库存；库存筛选禁用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-011 | 搜索结果列 supplier / 搜索结果列 supplier / ['string', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-011"] | 搜索列表及本次详情无可确认供应商身份路径；originName 不等于供应商〔PHYSICAL_OR_JOIN〕 | 显示“未获取”；不以 originName 推断供应商。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-012 | 搜索结果列 skuPreview / 搜索结果列 skuPreview / ['array', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-012"] | 搜索列表 body.products[].variants 全部空；选中详情 body.product.variants[] 可按需补采〔PLATFORM_OBSERVATION〕 | 列表显示“详情可补采”，不显示“无规格”；查看详情后才展示规格。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-013 | 搜索结果列 candidateState / 搜索结果列 candidateState / ['string', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-013"] | 青鸟本地 source_candidate 按 sourceAccountId＋externalProductId 匹配〔COMPUTED〕 | 只按本地候选关系计算；缺 ID 为 UNKNOWN。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-001-F-014 | 搜索结果列 observedAt / 搜索结果列 observedAt / ['string', 'null'] | PageReadModel.SRC-001.fields["SRC-001-F-014"] | 青鸟 business_task 搜索响应观测时间〔PHYSICAL_OR_JOIN〕 | 显示本次服务端观测时间及统一时区；不得用当前页面时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-001-C-001 候选 (3) | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-002；打开 SRC-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-001-C-002 搜索 | TASK_ACCEPT POST /source-discovery/search | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 1688 账号有效且关键词合法；价格/MOQ/库存筛选禁用；只读搜索不生成 SourceProduct。 | SRC-001；回读本次 SearchTaskID、账号、时间、总数/游标和结果；空结果显示 EMPTY，不造候选。

SRC-001-C-003 查看 | NAS_READ GET /source-discovery/search-runs/{taskId}/items/{externalProductId} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | SRC-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

SRC-001-C-004 已在候选 | UI_LOCAL   | 候选已存在、采集中或采购单已创建时显示；其他状态隐藏。 | 只在服务端 ReadModel 明确标记对应状态时作为状态标签显示，始终禁用。 | 本页；无跳转、无写请求；状态变化由回读驱动。

SRC-001-C-005 查看采集 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-003；打开 SRC-003；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-001-C-006 已在候选 | UI_LOCAL   | 候选已存在、采集中或采购单已创建时显示；其他状态隐藏。 | 只在服务端 ReadModel 明确标记对应状态时作为状态标签显示，始终禁用。 | 本页；无跳转、无写请求；状态变化由回读驱动。

SRC-001-C-007 立即采集 | TASK_ACCEPT POST /collection-tasks | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 候选身份与账号一致；P0 校验后才产生正式 SourceProduct；失败保留任务证据。 | SRC-001；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-001-C-008 已在候选 | UI_LOCAL   | 候选已存在、采集中或采购单已创建时显示；其他状态隐藏。 | 只在服务端 ReadModel 明确标记对应状态时作为状态标签显示，始终禁用。 | 本页；无跳转、无写请求；状态变化由回读驱动。

SRC-001-C-009 立即采集 | TASK_ACCEPT POST /collection-tasks | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 候选身份与账号一致；P0 校验后才产生正式 SourceProduct；失败保留任务证据。 | SRC-001；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-001-C-010 加入候选 | NAS_WRITE POST /source-candidates:save | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同账号同外部商品幂等；候选非正式落库商品。 | SRC-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-001-C-011 立即采集 | TASK_ACCEPT POST /collection-tasks | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 候选身份与账号一致；P0 校验后才产生正式 SourceProduct；失败保留任务证据。 | SRC-001；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-001-C-012 加入候选 | NAS_WRITE POST /source-candidates:save | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同账号同外部商品幂等；候选非正式落库商品。 | SRC-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-001-C-013 立即采集 | TASK_ACCEPT POST /collection-tasks | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 候选身份与账号一致；P0 校验后才产生正式 SourceProduct；失败保留任务证据。 | SRC-001；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-001-C-014 加入候选 | NAS_WRITE POST /source-candidates:save | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同账号同外部商品幂等；候选非正式落库商品。 | SRC-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-001-C-015 采集中 | UI_LOCAL   | 候选已存在、采集中或采购单已创建时显示；其他状态隐藏。 | 只在服务端 ReadModel 明确标记对应状态时作为状态标签显示，始终禁用。 | 本页；无跳转、无写请求；状态变化由回读驱动。

SRC-001-C-016 加入候选 | NAS_WRITE POST /source-candidates:save | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同账号同外部商品幂等；候选非正式落库商品。 | SRC-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-001-C-017 批量正式采集 | TASK_ACCEPT POST /collection-tasks:batch | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 候选已选且每项身份唯一，无同对象运行中任务 | SRC-001；逐项任务与状态回读

SRC-001-C-018 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-001-C-019 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-001-C-020 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-001-C-021 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-SRC-001-C-001-P, T-C-SRC-001-C-002-P, T-C-SRC-001-C-003-P, T-C-SRC-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

05  SRC-002  候选商品

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：货源采集；路由 #/candidates；关联需求 REQ-COL-001/002；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员；目标 1688 账号有效，SourceAccountID 与 BrowserProfile/UTP 能力一致。。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：#/candidates。ReadModel：GET /ui/readmodels/SRC-002；响应字段键固定为 PageReadModel.SRC-002.fields[FieldID]。

业务流程：按账号和外部商品 ID 展示已保存候选；对所选未执行项提交批量采集任务，重复候选不重复保存，已运行项不重复创建任务。

查询语义：搜索候选商品；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

SRC-002-F-007 | 搜索候选商品 / 搜索候选商品 | PageReadModel.SRC-002.query["SRC-002-F-007"] | 去首尾空白；空值不追加关键词条件。1688 商品 ID/链接作精确匹配，商品/标题文字按包含匹配；识别不了输入类型时明确提示，不猜测外部身份。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-002-F-001 | 商品 / 商品 / string | PageReadModel.SRC-002.fields["SRC-002-F-001"] | source_candidate.title_observed〔PHYSICAL_OR_JOIN〕 | 按 source_candidate.title_observed 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-002-F-002 | 价格/起批 / 价格/起批 / object | PageReadModel.SRC-002.fields["SRC-002-F-002"] | source_candidate.price_min,moq〔PHYSICAL_OR_JOIN〕 | 按 source_candidate.price_min,moq 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-002-F-003 | SKU / SKU / array | PageReadModel.SRC-002.fields["SRC-002-F-003"] | derived(candidate.preview.skus):candidate〔COMPUTED〕 | 按 derived(candidate.preview.skus):candidate 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-002-F-004 | 供应商 / 供应商 / string | PageReadModel.SRC-002.fields["SRC-002-F-004"] | source_candidate.supplier_name〔PHYSICAL_OR_JOIN〕 | 按 source_candidate.supplier_name 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-002-F-005 | 库存 / 库存 / int | PageReadModel.SRC-002.fields["SRC-002-F-005"] | derived(candidate.preview.stock):candidate〔COMPUTED〕 | 按 derived(candidate.preview.stock):candidate 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-002-F-006 | 状态 / 状态 / enum | PageReadModel.SRC-002.fields["SRC-002-F-006"] | source_candidate.state〔PHYSICAL_OR_JOIN〕 | 按 source_candidate.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-002-C-001 继续搜索 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-001；打开 SRC-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-002-C-002 查看已采集 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-005；打开 SRC-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-002-C-003 查看 | NAS_READ GET /source-candidates/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | SRC-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

SRC-002-C-004 移出候选 | NAS_WRITE DELETE /source-candidates/{id} | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅候选未进入正式采集任务时可移除，保留采集审计。 | SRC-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-002-C-005 比较选中 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-002；打开 SRC-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-002-C-006 批量正式采集 | TASK_ACCEPT POST /collection-tasks:batch | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 逐候选同账号校验并返回逐项任务/错误；禁止整批伪成功。 | SRC-002；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-002-C-007 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-002-C-008 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-002-C-009 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-002-C-010 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-SRC-002-C-001-P, T-C-SRC-002-C-002-P, T-C-SRC-002-C-003-P, T-C-SRC-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

06  SRC-003  采集任务

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：货源采集；路由 #/collection-tasks；关联需求 REQ-COL-002/003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员；目标 1688 账号有效，SourceAccountID 与 BrowserProfile/UTP 能力一致。。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：#/collection-tasks。ReadModel：GET /ui/readmodels/SRC-003；响应字段键固定为 PageReadModel.SRC-003.fields[FieldID]。

业务流程：展示采集任务与 Attempt 进度；查看详情或仅对可恢复的只读失败重试；登录/验证码/风控/写结果不明交人工。

查询语义：全部状态、任务号 / 商品；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

SRC-003-F-006 | 全部状态 / 全部状态 | PageReadModel.SRC-003.query["SRC-003-F-006"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

SRC-003-F-007 | 任务号 / 任务号 / 商品 | PageReadModel.SRC-003.query["SRC-003-F-007"] | 查询输入映射 request.keyword（string）；空值为不限/沿用当前上下文，值的枚举或范围若无已审定来源须标“待验证”，服务端拒绝越权值。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-003-F-001 | 任务 / 任务 / uuid | PageReadModel.SRC-003.fields["SRC-003-F-001"] | business_task.id〔PHYSICAL_OR_JOIN〕 | 按 business_task.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-003-F-002 | 商品 / 商品 / string | PageReadModel.SRC-003.fields["SRC-003-F-002"] | derived(business_task.result_json.title)〔COMPUTED〕 | 按 derived(business_task.result_json.title) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-003-F-003 | 状态 / 状态 / enum | PageReadModel.SRC-003.fields["SRC-003-F-003"] | business_task.state〔PHYSICAL_OR_JOIN〕 | 按 business_task.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-003-F-004 | 当前阶段 / 当前阶段 / string | PageReadModel.SRC-003.fields["SRC-003-F-004"] | derived(business_task.result_json.phase)〔COMPUTED〕 | 按 derived(business_task.result_json.phase) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-003-F-005 | 进度 / 进度 / int | PageReadModel.SRC-003.fields["SRC-003-F-005"] | derived(business_task.result_json.progress)〔COMPUTED〕 | 按 derived(business_task.result_json.progress) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-003-C-001 新建采集 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-001；打开 SRC-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-003-C-002 查看 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-003-C-003 处理 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-003-C-004 查看 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-003-C-005 重试可恢复失败项 | TASK_ACCEPT POST /collection-tasks/{id}/retry | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅可恢复失败且无同对象运行任务；不得跨账号。 | SRC-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SRC-003-C-006 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-003-C-007 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-003-C-008 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-003-C-009 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-003-C-010 查看 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-SRC-003-C-001-P, T-C-SRC-003-C-002-P, T-C-SRC-003-C-003-P, T-C-SRC-003-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

07  SRC-004  采集详情

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：货源采集；路由 #/collection-detail；关联需求 REQ-COL-002/003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员；目标 1688 账号有效，SourceAccountID 与 BrowserProfile/UTP 能力一致。。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：#/collection-detail。ReadModel：GET /ui/readmodels/SRC-004；响应字段键固定为 PageReadModel.SRC-004.fields[FieldID]。

业务流程：读取采集快照与 P0/P1 缺失报告；P0 不齐不得落正式 SourceProduct，P1 缺失标 PARTIAL；人工补采只打开对应账号的来源页。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-004-F-001 | 采集任务 / 采集任务 / object | PageReadModel.SRC-004.fields["SRC-004-F-001"] | business_task.id,state〔PHYSICAL_OR_JOIN〕 | 按 business_task.id,state 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-002 | 采集结果 / 采集结果 / object | PageReadModel.SRC-004.fields["SRC-004-F-002"] | business_task.result_json〔PHYSICAL_OR_JOIN〕 | 按 business_task.result_json 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-003 | 落库 / 落库 / uuid | PageReadModel.SRC-004.fields["SRC-004-F-003"] | source_product.id〔PHYSICAL_OR_JOIN〕 | 按 source_product.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-004 | ProductDraft / ProductDraft / uuid | PageReadModel.SRC-004.fields["SRC-004-F-004"] | product.id〔PHYSICAL_OR_JOIN〕 | 按 product.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-005 | P0 必需字段 / P0 必需字段 / object | PageReadModel.SRC-004.fields["SRC-004-F-005"] | source_product_snapshot.completeness_json.P0〔PHYSICAL_OR_JOIN〕 | 按 source_product_snapshot.completeness_json.P0 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-006 | P1 重要字段 / P1 重要字段 / object | PageReadModel.SRC-004.fields["SRC-004-F-006"] | source_product_snapshot.completeness_json.P1〔PHYSICAL_OR_JOIN〕 | 按 source_product_snapshot.completeness_json.P1 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-007 | P2 增强字段 / P2 增强字段 / object | PageReadModel.SRC-004.fields["SRC-004-F-007"] | source_product_snapshot.completeness_json.P2〔PHYSICAL_OR_JOIN〕 | 按 source_product_snapshot.completeness_json.P2 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-008 | 主图原图身份 / DETAIL_FIELD | PageReadModel.SRC-004.fields["SRC-004-F-008"] | qn.media_asset.id / source_product_snapshot.id〔PHYSICAL_OR_JOIN〕 | 主图 P0；原图哈希、Provider 与采集快照一致，否则标阻断；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-004-F-009 | 主图采集状态 / STATUS_CHECK | PageReadModel.SRC-004.fields["SRC-004-F-009"] | qn.media_asset.state〔PHYSICAL_OR_JOIN〕 | AVAILABLE 才能进入草稿媒体选择；缺失不得伪装已采集；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-004-C-001 返回任务 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-003；打开 SRC-003；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-004-C-002 查看商品草稿 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-004-C-003 执行详情 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-004-C-004 打开浏览器人工补采 | TASK_ACCEPT POST /collection-tasks/{id}/open-browser-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只打开正确 1688 账号/Profile 的受控补采上下文；验证码人工处理。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-SRC-004-C-001-P, T-C-SRC-004-C-002-P, T-C-SRC-004-C-003-P, T-C-SRC-004-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

08  SRC-005  已采集货源

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：货源采集；路由 #/sources；关联需求 REQ-PRD-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员；目标 1688 账号有效，SourceAccountID 与 BrowserProfile/UTP 能力一致。。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：#/sources。ReadModel：GET /ui/readmodels/SRC-005；响应字段键固定为 PageReadModel.SRC-005.fields[FieldID]。

业务流程：按 1688 账号＋外部商品身份显示正式采集结果与最新快照；重采追加新快照，价格库存观察不改历史，也不当作采购时实时价。

查询语义：货源商品 / 供应商 / 1688商品ID、全部状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

SRC-005-F-008 | 货源商品 / 货源商品 / 供应商 / 1688商品ID | PageReadModel.SRC-005.query["SRC-005-F-008"] | 查询输入映射 request.keyword（string）；空值为不限/沿用当前上下文，值的枚举或范围若无已审定来源须标“待验证”，服务端拒绝越权值。

SRC-005-F-009 | 全部状态 / 全部状态 | PageReadModel.SRC-005.query["SRC-005-F-009"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-005-F-001 | 货源商品 / 货源商品 / object | PageReadModel.SRC-005.fields["SRC-005-F-001"] | source_product.id,source_product_snapshot.title〔PHYSICAL_OR_JOIN〕 | 按 source_product.id,source_product_snapshot.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-002 | 供应商 / 供应商 / object | PageReadModel.SRC-005.fields["SRC-005-F-002"] | supplier.id,name〔PHYSICAL_OR_JOIN〕 | 按 supplier.id,name 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-003 | 当前价格 / 当前价格 / money | PageReadModel.SRC-005.fields["SRC-005-F-003"] | source_sku.current_price〔PHYSICAL_OR_JOIN〕 | 按 source_sku.current_price 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-004 | MOQ / MOQ / int | PageReadModel.SRC-005.fields["SRC-005-F-004"] | derived(source_product_snapshot.completeness_json.moq)〔COMPUTED〕 | 按 derived(source_product_snapshot.completeness_json.moq) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-005 | SKU / SKU / array | PageReadModel.SRC-005.fields["SRC-005-F-005"] | source_sku.id,spec_text〔PHYSICAL_OR_JOIN〕 | 按 source_sku.id,spec_text 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-006 | 当前快照 / 当前快照 / uuid | PageReadModel.SRC-005.fields["SRC-005-F-006"] | source_product.current_snapshot_id〔PHYSICAL_OR_JOIN〕 | 按 source_product.current_snapshot_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-F-007 | 状态 / 状态 / enum | PageReadModel.SRC-005.fields["SRC-005-F-007"] | source_product.state〔PHYSICAL_OR_JOIN〕 | 按 source_product.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-X-F-001 | 仅已绑定 1688 SourceSKU 显示监测设置 / 仅已绑定 1688 SourceSKU 显示监测设置 | PageReadModel.SRC-005.fields["SRC-005-X-F-001"] | qn.source_watch_policy + qn.source_watch_observation（现有物理源；逐字段聚合与平台样本 SIT 待验证）〔COMPUTED〕 | 仅已绑定 1688 SourceSKU 显示监测设置；展示平台、货源账号、外部 SKU 与规格。 / object；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-X-F-002 | 当前与上次价格、币种、计价单位、观察时间、来源 / 当前与上次价格、币种、计价单位、观察时间、来源 | PageReadModel.SRC-005.fields["SRC-005-X-F-002"] | qn.source_watch_policy + qn.source_watch_observation（现有物理源；逐字段聚合与平台样本 SIT 待验证）〔COMPUTED〕 | 当前与上次价格、币种、计价单位、观察时间、来源；不可比显示“待核”。 / object；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-X-F-003 | 库存数/库存状态、观察时间与未知原因 / 库存数/库存状态、观察时间与未知原因 | PageReadModel.SRC-005.fields["SRC-005-X-F-003"] | qn.source_watch_policy + qn.source_watch_observation（现有物理源；逐字段聚合与平台样本 SIT 待验证）〔COMPUTED〕 | 库存数/库存状态、观察时间与未知原因；外部不提供时显示“未取得”。 / object；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-005-X-F-004 | 监测开关、周期策略、最近执行状态、变化提示和待核状态。 / 监测开关、周期策略、最近执行状态、变化提示和待核状态。 / object | PageReadModel.SRC-005.fields["SRC-005-X-F-004"] | qn.source_watch_policy + qn.source_watch_observation（现有物理源；逐字段聚合与平台样本 SIT 待验证）〔COMPUTED〕 | 监测开关、周期策略、最近执行状态、变化提示和待核状态。 / object；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-005-C-001 查看 | NAS_READ GET /source-products/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | SRC-005；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

SRC-005-C-002 快照对比 | NAS_READ GET /source-products/{id}/snapshots/diff | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 当前对象、权限和业务状态有效；响应与错误写入页面反馈和任务证据；缺失对象 ID 不启用。 | SRC-005；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

SRC-005-C-003 重新采集 | TASK_ACCEPT POST /source-products/{id}/recollect | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只新增快照，旧快照不可覆盖；P0/外部身份重验。 | SRC-005；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-005-C-004 重新采集 | TASK_ACCEPT POST /source-products/{id}/recollect | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只新增快照，旧快照不可覆盖；P0/外部身份重验。 | SRC-005；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-005-C-005 补充采集 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-004；打开 SRC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

SRC-005-C-006 重新采集选中项 | TASK_ACCEPT POST /source-products:recollect-batch | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 逐项同账号校验，逐项结果；不得把部分失败记整批成功。 | SRC-005；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SRC-005-C-007 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-005；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-005-C-008 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-005；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-005-C-009 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-005；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-005-C-010 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SRC-005；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SRC-005-X-C-001 开启/关闭监测：管理员或获授权操作员，身份绑定有效。 | NAS_WRITE PUT /source-products/{id}/watch-policy | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅授权用户；低频监测与人工提醒，不自动调价或改店铺库存。 | SRC-005；保存策略版本；关闭后取消后续计划任务，保留历史快照。

SRC-005-X-C-002 立即检查：已绑定 SKU、账号有效、无同对象运行中任务。 | TASK_ACCEPT POST /source-products/{id}/watch-check | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 已绑定 1688 SKU，账号有效，无并行检查 | SRC-005；只读观察，变化提醒

SRC-005-X-C-003 查看差异/确认提醒：仅有可比变化时显示。 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。；若改变业务决定，要求本次明确确认。 | SRC-005；打开 SRC-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-SRC-005-C-001-P, T-C-SRC-005-C-002-P, T-C-SRC-005-C-003-P, T-C-SRC-005-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

09  PRD-001  商品列表

端：NAS。波次：1688→XHS 首链。样本：INTERNAL_TEST_PENDING。入口和准入：入口：商品；路由 #/products；关联需求 REQ-PRD-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/products。ReadModel：GET /ui/readmodels/PRD-001；响应字段键固定为 PageReadModel.PRD-001.fields[FieldID]。

业务流程：只展示已正式采集并建立本地 Product/Draft 的对象；从来源关联打开编辑，显示版本、店铺适配状态与成本观察时间。

查询语义：搜索商品、全部状态、全部店铺；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

PRD-001-F-008 | 搜索商品 / 搜索商品 | PageReadModel.PRD-001.query["PRD-001-F-008"] | 去首尾空白；空值不追加关键词条件。当前领域对象的外部 ID作精确匹配，商品/标题文字按包含匹配；识别不了输入类型时明确提示，不猜测外部身份。

PRD-001-F-009 | 全部状态 / 全部状态 | PageReadModel.PRD-001.query["PRD-001-F-009"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

PRD-001-F-010 | 全部店铺 / 全部店铺 | PageReadModel.PRD-001.query["PRD-001-F-010"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PRD-001-F-001 | 商品 / 商品 / object | PageReadModel.PRD-001.fields["PRD-001-F-001"] | product.id,product_version.title〔PHYSICAL_OR_JOIN〕 | 按 product.id,product_version.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-002 | 售价 / 售价 / money | PageReadModel.PRD-001.fields["PRD-001-F-002"] | product_sku.sale_price〔PHYSICAL_OR_JOIN〕 | 按 product_sku.sale_price 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-003 | 最近采集成本 / 最近采集成本 / money | PageReadModel.PRD-001.fields["PRD-001-F-003"] | source_sku.current_price〔PHYSICAL_OR_JOIN〕 | 按 source_sku.current_price 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-004 | SKU / SKU / int | PageReadModel.PRD-001.fields["PRD-001-F-004"] | derived(count(product_sku.id))〔COMPUTED〕 | 按 derived(count(product_sku.id)) 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-005 | 店铺状态 / 店铺状态 / array | PageReadModel.PRD-001.fields["PRD-001-F-005"] | channel_projection.store_id,state〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.store_id,state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-006 | 检测 / 检测 / enum | PageReadModel.PRD-001.fields["PRD-001-F-006"] | derived(ai_review.state,rule_findings_json)〔COMPUTED〕 | 按 derived(ai_review.state,rule_findings_json) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-001-F-007 | 更新时间 / 更新时间 / time | PageReadModel.PRD-001.fields["PRD-001-F-007"] | derived(max(product_version.created_at))〔COMPUTED〕 | 按 derived(max(product_version.created_at)) 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PRD-001-C-001 去采集货源 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SRC-001；打开 SRC-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-001-C-002 编辑 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-001-C-003 查看 | NAS_READ GET /products/{id}/draft | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | PRD-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

PRD-001-C-004 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PRD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PRD-001-C-005 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PRD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PRD-001-C-006 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PRD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PRD-001-C-007 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PRD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-PRD-001-C-001-P, T-C-PRD-001-C-002-P, T-C-PRD-001-C-003-P, T-C-PRD-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

10  PRD-002  商品编辑

端：NAS。波次：1688→XHS 首链。样本：INTERNAL_TEST_PENDING。入口和准入：入口：商品；路由 #/product-edit；关联需求 REQ-PRD-001/REQ-AI-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/product-edit。ReadModel：GET /ui/readmodels/PRD-002；响应字段键固定为 PageReadModel.PRD-002.fields[FieldID]。

业务流程：按 ProductID 和草稿 revision 载入；编辑时保留 SourceSnapshot 引用，保存新 revision；AI 建议需要逐条人工采纳，冻结版本不直接编辑。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PRD-002-F-001 | 商品标题 / 商品标题 / string | PageReadModel.PRD-002.fields["PRD-002-F-001"] | product_version.title〔PHYSICAL_OR_JOIN〕 | 按 product_version.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-002 | 销售价格 / 销售价格 / money | PageReadModel.PRD-002.fields["PRD-002-F-002"] | product_sku.sale_price〔PHYSICAL_OR_JOIN〕 | 按 product_sku.sale_price 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-003 | 销售库存 / 销售库存 / int | PageReadModel.PRD-002.fields["PRD-002-F-003"] | product_sku.available_qty〔PHYSICAL_OR_JOIN〕 | 按 product_sku.available_qty 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-004 | 当前草稿 / 当前草稿 / int | PageReadModel.PRD-002.fields["PRD-002-F-004"] | product.current_version〔PHYSICAL_OR_JOIN〕 | 按 product.current_version 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-005 | AI检测 / AI检测 / enum | PageReadModel.PRD-002.fields["PRD-002-F-005"] | derived(ai_review.state)〔COMPUTED〕 | 按 derived(ai_review.state) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-006 | 小红书 / 小红书 / object | PageReadModel.PRD-002.fields["PRD-002-F-006"] | channel_projection.state where store.platform_code=XHS〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.state where store.platform_code=XHS 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-007 | 微信小店 / 微信小店 / object | PageReadModel.PRD-002.fields["PRD-002-F-007"] | derived(channel_projection by store):outside-XHS-scope〔COMPUTED〕 | 按 derived(channel_projection by store):outside-XHS-scope 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-008 | 颜色 / 颜色 / string | PageReadModel.PRD-002.fields["PRD-002-F-008"] | product_sku.spec_signature:size-color-component〔PHYSICAL_OR_JOIN〕 | 按 product_sku.spec_signature:size-color-component 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-009 | 尺码 / 尺码 / string | PageReadModel.PRD-002.fields["PRD-002-F-009"] | product_sku.spec_signature:size-component〔PHYSICAL_OR_JOIN〕 | 按 product_sku.spec_signature:size-component 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-010 | 售价 / 售价 / money | PageReadModel.PRD-002.fields["PRD-002-F-010"] | product_sku.sale_price〔PHYSICAL_OR_JOIN〕 | 按 product_sku.sale_price 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-011 | 来源绑定 / 来源绑定 / uuid | PageReadModel.PRD-002.fields["PRD-002-F-011"] | product_sku.source_sku_id〔PHYSICAL_OR_JOIN〕 | 按 product_sku.source_sku_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-012 | 状态 / 状态 / enum | PageReadModel.PRD-002.fields["PRD-002-F-012"] | product.state〔PHYSICAL_OR_JOIN〕 | 按 product.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-013 | 文本内容 / 文本内容 / string | PageReadModel.PRD-002.fields["PRD-002-F-013"] | product_version.description〔PHYSICAL_OR_JOIN〕 | 按 product_version.description 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-014 | 主图 SHA-256 / DETAIL_FIELD | PageReadModel.PRD-002.fields["PRD-002-F-014"] | qn.media_asset.original_sha256〔PHYSICAL_OR_JOIN〕 | 显示原图哈希及来源；不展示敏感 URL；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-015 | 原图来源与存储 / DETAIL_FIELD | PageReadModel.PRD-002.fields["PRD-002-F-015"] | qn.media_asset.source_url / provider_key / storage_key〔PHYSICAL_OR_JOIN〕 | 原始来源和 Provider 必填；存储键不得作为公开链接；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-002-F-016 | 媒体派生版本 / DETAIL_FIELD | PageReadModel.PRD-002.fields["PRD-002-F-016"] | qn.media_derivative.version〔PHYSICAL_OR_JOIN〕 | 显示派生状态与版本；失败允许重新派生但不覆盖原图；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PRD-002-C-001 保存草稿 | NAS_WRITE PUT /products/{id}/draft | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 乐观版本一致；保存本地草稿，不向任何店铺正式发布。 | PRD-002；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

PRD-002-C-002 保存并进入平台适配 | NAS_WRITE PUT /products/{id}/draft | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 乐观版本一致；保存本地草稿，不向任何店铺正式发布。 | PRD-002；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

PRD-002-C-003 AI清洗与检测 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-003；打开 PRD-003；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-002-C-004 TAB 基本信息 | UI_LOCAL   | 当前页签区显示；已选页签不重复触发。 | 当前页准入成功，所选页签存在。 | PRD-002；切换可见面板；保留同一对象与未提交编辑值。

PRD-002-C-005 TAB 媒体 | UI_LOCAL   | 当前页签区显示；已选页签不重复触发。 | 当前页准入成功，所选页签存在。 | PRD-002；切换可见面板；保留同一对象与未提交编辑值。

PRD-002-C-006 TAB SKU与价格 | UI_LOCAL   | 当前页签区显示；已选页签不重复触发。 | 当前页准入成功，所选页签存在。 | PRD-002；切换可见面板；保留同一对象与未提交编辑值。

PRD-002-C-007 TAB 商品详情 | UI_LOCAL   | 当前页签区显示；已选页签不重复触发。 | 当前页准入成功，所选页签存在。 | PRD-002；切换可见面板；保留同一对象与未提交编辑值。

PRD-002-C-008 管理图片 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-002-C-009 补采源主图 | TASK_ACCEPT POST /media-assets | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 乐观版本一致；保存本地草稿，不向任何店铺正式发布。 | PRD-002；任务失败保留原图事实，允许按新任务重采，不得推断草稿可同步

正向断言：T-C-PRD-002-C-001-P, T-C-PRD-002-C-002-P, T-C-PRD-002-C-003-P, T-C-PRD-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

11  PRD-003  AI清洗与检测

端：NAS。波次：1688→XHS 首链。样本：INTERNAL_TEST_PENDING。入口和准入：入口：商品；路由 #/ai-inspection；关联需求 REQ-AI-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/ai-inspection。ReadModel：GET /ui/readmodels/PRD-003；响应字段键固定为 PageReadModel.PRD-003.fields[FieldID]。

业务流程：CLEAN 产生可审阅的差异建议，INSPECT 将确定性规则与 AI Finding 分开；规则 BLOCK 不能被模型覆盖；接受/拒绝只改本地草稿。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PRD-003-F-001 | BLOCK / BLOCK / array | PageReadModel.PRD-003.fields["PRD-003-F-001"] | ai_review.rule_findings_json severity=BLOCK〔PHYSICAL_OR_JOIN〕 | 按 ai_review.rule_findings_json severity=BLOCK 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-002 | WARN / WARN / array | PageReadModel.PRD-003.fields["PRD-003-F-002"] | ai_review.rule_findings_json,ai_findings_json severity=WARN〔PHYSICAL_OR_JOIN〕 | 按 ai_review.rule_findings_json,ai_findings_json severity=WARN 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-003 | INFO / INFO / array | PageReadModel.PRD-003.fields["PRD-003-F-003"] | ai_review.rule_findings_json,ai_findings_json severity=INFO〔PHYSICAL_OR_JOIN〕 | 按 ai_review.rule_findings_json,ai_findings_json severity=INFO 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-004 | 标题 / 标题 / object | PageReadModel.PRD-003.fields["PRD-003-F-004"] | ai_review.suggestions_json field=title〔PHYSICAL_OR_JOIN〕 | 按 ai_review.suggestions_json field=title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-005 | 详情 / 详情 / object | PageReadModel.PRD-003.fields["PRD-003-F-005"] | ai_review.suggestions_json field=description〔PHYSICAL_OR_JOIN〕 | 按 ai_review.suggestions_json field=description 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-006 | 规格 / 规格 / object | PageReadModel.PRD-003.fields["PRD-003-F-006"] | ai_review.suggestions_json field=sku〔PHYSICAL_OR_JOIN〕 | 按 ai_review.suggestions_json field=sku 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-007 | 标题与部分SKU“修身版”描述存在语义冲突 / 标题与部分SKU“修身版”描述存在语义冲突 / object | PageReadModel.PRD-003.fields["PRD-003-F-007"] | derived(ai_review.ai_findings_json semantic_conflict)〔COMPUTED〕 | 按 derived(ai_review.ai_findings_json semantic_conflict) 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-008 | 主图3含较小供应商水印，建议替换 / 主图3含较小供应商水印，建议替换 / object | PageReadModel.PRD-003.fields["PRD-003-F-008"] | derived(ai_review.rule_findings_json watermark)〔COMPUTED〕 | 按 derived(ai_review.rule_findings_json watermark) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-009 | 未发现手机号、微信号或外链 / 未发现手机号、微信号或外链 / object | PageReadModel.PRD-003.fields["PRD-003-F-009"] | derived(ai_review.rule_findings_json sensitive)〔COMPUTED〕 | 按 derived(ai_review.rule_findings_json sensitive) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-003-F-010 | 价格与SKU范围一致 / 价格与SKU范围一致 / object | PageReadModel.PRD-003.fields["PRD-003-F-010"] | derived(ai_review.rule_findings_json price_sku)〔COMPUTED〕 | 按 derived(ai_review.rule_findings_json price_sku) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PRD-003-C-001 重新检测 | TASK_ACCEPT POST /products/{id}/ai-inspect | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 确定性规则 BLOCK 优先；模型结论不可解除 BLOCK。 | PRD-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PRD-003-C-002 采用建议 | NAS_WRITE POST /ai-suggestions/{id}/decision | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 建议需人工接受/拒绝；接受后新草稿版本，规则 BLOCK 不被解除。 | PRD-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PRD-003-C-003 查看差异 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-003；打开 PRD-003；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-003-C-004 返回编辑处理 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-PRD-003-C-001-P, T-C-PRD-003-C-002-P, T-C-PRD-003-C-003-P, T-C-PRD-003-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

12  PRD-004  商品版本

端：NAS。波次：1688→XHS 首链。样本：INTERNAL_TEST_PENDING。入口和准入：入口：商品；路由 #/versions；关联需求 REQ-PRD-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/versions。ReadModel：GET /ui/readmodels/PRD-004；响应字段键固定为 PageReadModel.PRD-004.fields[FieldID]。

业务流程：查看不可变 ProductVersion 与草稿差异及引用店铺；继续编辑创建新的 Draft revision，不覆写已引用历史。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PRD-004-F-001 | 对象 / 对象 / uuid | PageReadModel.PRD-004.fields["PRD-004-F-001"] | product.id〔PHYSICAL_OR_JOIN〕 | 按 product.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-004-F-002 | 状态 / 状态 / enum | PageReadModel.PRD-004.fields["PRD-004-F-002"] | product.state〔PHYSICAL_OR_JOIN〕 | 按 product.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-004-F-003 | 主要变化 / 主要变化 / string | PageReadModel.PRD-004.fields["PRD-004-F-003"] | derived(product_version.draft_json diff)〔COMPUTED〕 | 按 derived(product_version.draft_json diff) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-004-F-004 | AI检测 / AI检测 / object | PageReadModel.PRD-004.fields["PRD-004-F-004"] | ai_review.id,state〔PHYSICAL_OR_JOIN〕 | 按 ai_review.id,state 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-004-F-005 | 创建时间 / 创建时间 / time | PageReadModel.PRD-004.fields["PRD-004-F-005"] | product_version.created_at〔PHYSICAL_OR_JOIN〕 | 按 product_version.created_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PRD-004-C-001 继续编辑 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-004-C-002 查看 | NAS_READ GET /products/{id}/versions/{versionId} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | PRD-004；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

PRD-004-C-003 与当前草稿对比 | NAS_READ GET /products/{id}/versions/diff | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 当前对象、权限和业务状态有效；响应与错误写入页面反馈和任务证据；缺失对象 ID 不启用。 | PRD-004；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

正向断言：T-C-PRD-004-C-001-P, T-C-PRD-004-C-002-P, T-C-PRD-004-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

13  PRD-005  平台适配

端：NAS。波次：1688→XHS 首链。样本：INTERNAL_TEST_PENDING。入口和准入：入口：商品；路由 #/channel-adapt；关联需求 REQ-CHN-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/channel-adapt。ReadModel：GET /ui/readmodels/PRD-005；响应字段键固定为 PageReadModel.PRD-005.fields[FieldID]。

业务流程：针对每家目标店独立投影、检查类目/属性/SKU/图片/规则；仅对通过校验的投影提交店铺草稿任务，外部正式发布仍由用户处理。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PRD-005-F-001 | 类目 / 类目 / object | PageReadModel.PRD-005.fields["PRD-005-F-001"] | derived(channel_projection mapping category)〔COMPUTED〕 | 按 derived(channel_projection mapping category) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-005-F-002 | 属性 / 属性 / object | PageReadModel.PRD-005.fields["PRD-005-F-002"] | derived(channel_projection mapping attributes)〔COMPUTED〕 | 按 derived(channel_projection mapping attributes) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-005-F-003 | SKU / SKU / object | PageReadModel.PRD-005.fields["PRD-005-F-003"] | derived(channel_projection mapping SKU)〔COMPUTED〕 | 按 derived(channel_projection mapping SKU) 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-005-F-004 | 图片 / 图片 / object | PageReadModel.PRD-005.fields["PRD-005-F-004"] | derived(channel_projection mapping media)〔COMPUTED〕 | 按 derived(channel_projection mapping media) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-005-F-005 | 标题/详情 / 标题/详情 / object | PageReadModel.PRD-005.fields["PRD-005-F-005"] | derived(channel_projection mapping title,description)〔COMPUTED〕 | 按 derived(channel_projection mapping title,description) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PRD-005-F-006 | 店铺媒体映射 / STATUS_CHECK | PageReadModel.PRD-005.fields["PRD-005-F-006"] | qn.channel_projection_media / qn.media_asset / qn.media_derivative〔PHYSICAL_OR_JOIN〕 | 本店主图 AVAILABLE，派生版本与商品投影版本一致；不继承别店映射；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PRD-005-C-001 返回编辑 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-002；打开 PRD-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PRD-005-C-002 同步选中且已通过的店铺 | EXTERNAL_WRITE POST /store-sync-tasks:batch | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 选中店铺映射 READY、规则无 BLOCK、账号有效；用户在当前会话看过最终快照并再次确认，确认只针对该版本。 | PRD-005；只保存店铺草稿，不正式发布

PRD-005-C-003 去映射 | NAS_WRITE PATCH /channel-projections/{id}/mappings | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 映射类型和店铺类目校验；无规则 BLOCK 才转 READY。 | PRD-005；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PRD-005-C-004 设置店铺主图 | NAS_WRITE PUT /channel-projections/{id}/media-selection | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 映射类型和店铺类目校验；无规则 BLOCK 才转 READY。 | PRD-005；版本冲突 409，保留选择并重新加载投影

正向断言：T-C-PRD-005-C-001-P, T-C-PRD-005-C-002-P, T-C-PRD-005-C-003-P, T-C-PRD-005-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

14  STORE-001  店铺列表

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：店铺草稿；路由 #/web/STORE-001；关联需求 REQ-PLT-001/REQ-AUTH-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/web/STORE-001。ReadModel：GET /api/v1/configuration；响应字段键固定为 PageReadModel.STORE-001.fields[FieldID]。

业务流程：展示店铺与账号绑定、最近登录及能力状态；登录失效冻结对应写任务，去 PC 登录携带目标店和 Profile。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

STORE-001-F-001 | 执行通道 / 执行通道 / string | PageReadModel.STORE-001.fields["STORE-001-F-001"] | derived(store.platform_code,adapter capability)〔COMPUTED〕 | 按 derived(store.platform_code,adapter capability) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-001-F-002 | 绑定PC / 绑定PC / string | PageReadModel.STORE-001.fields["STORE-001-F-002"] | browser_profile.worker_ref〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.worker_ref 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-001-F-003 | Profile / Profile / uuid | PageReadModel.STORE-001.fields["STORE-001-F-003"] | browser_profile.id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-001-F-004 | 能力 / 能力 / array | PageReadModel.STORE-001.fields["STORE-001-F-004"] | derived(adapter capability snapshot):candidate〔COMPUTED〕 | 按 derived(adapter capability snapshot):candidate 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

STORE-001-C-001 检查全部登录状态 | TASK_ACCEPT POST /stores/auth-status:batch | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 逐店只读检查 Profile 登录状态，失败不触发重新授权。 | STORE-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

STORE-001-C-002 去PC登录 | TASK_ACCEPT POST /stores/{id}/open-login-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 正确店铺账号/Profile/Worker 受控打开登录，由人完成验证码和风控。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

STORE-001-C-003 检查状态 | NAS_READ GET /stores/{id}/auth-status | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 输入合法且账号/能力满足该项只读动作；加载、空、失败有明确反馈；缺失对象 ID 不启用。 | STORE-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

正向断言：T-C-STORE-001-C-001-P, T-C-STORE-001-C-002-P, T-C-STORE-001-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 412，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

15  STORE-002  渠道商品

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：店铺草稿；路由 #/channel-products；关联需求 REQ-CHN-001/REQ-SYNC-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/channel-products。ReadModel：GET /ui/readmodels/STORE-002；响应字段键固定为 PageReadModel.STORE-002.fields[FieldID]。

业务流程：展示本地投影与外部草稿身份、回读时间及差异；外部草稿保存成功不等于正式发布。

查询语义：商品 / 外部商品、全部店铺、全部外部状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

STORE-002-F-007 | 商品 / 商品 / 外部商品 | PageReadModel.STORE-002.query["STORE-002-F-007"] | 去首尾空白；空值不追加关键词条件。当前领域对象的外部 ID作精确匹配，商品/标题文字按包含匹配；识别不了输入类型时明确提示，不猜测外部身份。

STORE-002-F-008 | 全部店铺 / 全部店铺 | PageReadModel.STORE-002.query["STORE-002-F-008"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

STORE-002-F-009 | 全部外部状态 / 全部外部状态 | PageReadModel.STORE-002.query["STORE-002-F-009"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

STORE-002-F-001 | 商品 / 商品 / object | PageReadModel.STORE-002.fields["STORE-002-F-001"] | product.id,product_version.title〔PHYSICAL_OR_JOIN〕 | 按 product.id,product_version.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-002-F-002 | 店铺 / 店铺 / uuid | PageReadModel.STORE-002.fields["STORE-002-F-002"] | channel_projection.store_id〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-002-F-003 | 外部状态 / 外部状态 / enum | PageReadModel.STORE-002.fields["STORE-002-F-003"] | channel_projection.state〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-002-F-004 | 映射 / 映射 / enum | PageReadModel.STORE-002.fields["STORE-002-F-004"] | channel_projection.state〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.state 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-002-F-005 | 与当前版本 / 与当前版本 / object | PageReadModel.STORE-002.fields["STORE-002-F-005"] | derived(product.current_version - channel_projection.product_version)〔COMPUTED〕 | 按 derived(product.current_version - channel_projection.product_version) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-002-F-006 | 最近同步 / 最近同步 / time | PageReadModel.STORE-002.fields["STORE-002-F-006"] | channel_projection.last_readback_at〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.last_readback_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

STORE-002-C-001 查看差异 | NAS_READ GET /store-product-mappings/{id}/diff | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | STORE-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

STORE-002-C-002 打开店铺草稿 | TASK_ACCEPT POST /store-product-mappings/{id}/open-external | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅打开本店草稿；无正式发布动作。 | 本页；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

STORE-002-C-003 查看 | NAS_READ GET /store-product-mappings/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | STORE-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

STORE-002-C-004 去适配 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-005；打开 PRD-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

STORE-002-C-005 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-002-C-006 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-002-C-007 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-002-C-008 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-STORE-002-C-001-P, T-C-STORE-002-C-002-P, T-C-STORE-002-C-003-P, T-C-STORE-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

16  STORE-003  同步任务

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：店铺草稿；路由 #/store-sync；关联需求 REQ-SYNC-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/store-sync。ReadModel：GET /ui/readmodels/STORE-003；响应字段键固定为 PageReadModel.STORE-003.fields[FieldID]。

业务流程：按店铺、投影版本执行 CREATE_DRAFT 或 UPDATE_DRAFT；结果 UNKNOWN 先回读外部草稿身份并对账，再决定后续动作。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

STORE-003-F-001 | 店铺 / 店铺 / uuid | PageReadModel.STORE-003.fields["STORE-003-F-001"] | store_sync_task.store_id〔PHYSICAL_OR_JOIN〕 | 按 store_sync_task.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-002 | 适配检查 / 适配检查 / enum | PageReadModel.STORE-003.fields["STORE-003-F-002"] | channel_projection.state〔PHYSICAL_OR_JOIN〕 | 按 channel_projection.state 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-003 | 本次动作 / 本次动作 / enum | PageReadModel.STORE-003.fields["STORE-003-F-003"] | store_sync_task.action〔PHYSICAL_OR_JOIN〕 | 按 store_sync_task.action 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-004 | 执行通道 / 执行通道 / string | PageReadModel.STORE-003.fields["STORE-003-F-004"] | derived(browser_profile.worker_ref)〔COMPUTED〕 | 按 derived(browser_profile.worker_ref) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-005 | 状态 / 状态 / enum | PageReadModel.STORE-003.fields["STORE-003-F-005"] | store_sync_task.state〔PHYSICAL_OR_JOIN〕 | 按 store_sync_task.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-006 | 任务 / 任务 / uuid | PageReadModel.STORE-003.fields["STORE-003-F-006"] | store_sync_task.id〔PHYSICAL_OR_JOIN〕 | 按 store_sync_task.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-007 | 阶段 / 阶段 / string | PageReadModel.STORE-003.fields["STORE-003-F-007"] | derived(business_task.result_json.phase)〔COMPUTED〕 | 按 derived(business_task.result_json.phase) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-008 | 结果 / 结果 / object | PageReadModel.STORE-003.fields["STORE-003-F-008"] | business_task.result_json〔PHYSICAL_OR_JOIN〕 | 按 business_task.result_json 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-003-F-009 | 外部身份 / 外部身份 / string | PageReadModel.STORE-003.fields["STORE-003-F-009"] | store_sync_task.external_draft_id〔PHYSICAL_OR_JOIN〕 | 按 store_sync_task.external_draft_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

STORE-003-C-001 返回平台适配 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-005；打开 PRD-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

STORE-003-C-002 更新草稿 | EXTERNAL_WRITE POST /store-sync-tasks | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 店铺身份有效＋投影 READY＋版本一致＋无规则 BLOCK；用户在当前会话看过最终快照并再次确认，确认只针对该版本。 | STORE-003；只更新草稿并回读外部草稿 ID

STORE-003-C-003 去适配 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PRD-005；打开 PRD-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

STORE-003-C-004 执行详情 | NAS_READ GET /store-sync-tasks/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 当前对象、权限和业务状态有效；响应与错误写入页面反馈和任务证据；缺失对象 ID 不启用。 | STORE-003；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

STORE-003-C-005 打开店铺草稿 | TASK_ACCEPT POST /store-sync-tasks/{id}/open-external | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 任务与店铺身份一致才可打开草稿；不冒充人工接管。 | 本页；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

STORE-003-C-006 人工接管 | TASK_ACCEPT POST /store-sync-tasks/{id}/takeover-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅打开受控 PC 人工接管上下文；不把打开草稿当成接管完成。 | STORE-003；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

STORE-003-C-007 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-003-C-008 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-003-C-009 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

STORE-003-C-010 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | STORE-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-STORE-003-C-001-P, T-C-STORE-003-C-002-P, T-C-STORE-003-C-003-P, T-C-STORE-003-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

17  ORD-001  销售订单

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：订单；路由 #/orders；关联需求 REQ-ORD-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/orders。ReadModel：GET /ui/readmodels/ORD-001；响应字段键固定为 PageReadModel.ORD-001.fields[FieldID]。

业务流程：按店铺＋外部订单 ID 只读回流与去重；列表行进入当前订单详情，无法确认订单项/包裹归属时显示待核并阻断采购映射。

查询语义：订单号 / 商品、全部店铺、全部状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

ORD-001-F-008 | 订单号 / 订单号 / 商品 | PageReadModel.ORD-001.query["ORD-001-F-008"] | 去首尾空白；空值不追加关键词条件。店铺订单号作精确匹配，商品/标题文字按包含匹配；识别不了输入类型时明确提示，不猜测外部身份。

ORD-001-F-009 | 全部店铺 / 全部店铺 | PageReadModel.ORD-001.query["ORD-001-F-009"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

ORD-001-F-010 | 全部状态 / 全部状态 | PageReadModel.ORD-001.query["ORD-001-F-010"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

ORD-001-F-001 | 订单 / 订单 / object | PageReadModel.ORD-001.fields["ORD-001-F-001"] | sales_order.id,external_order_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.id,external_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-002 | 店铺 / 店铺 / uuid | PageReadModel.ORD-001.fields["ORD-001-F-002"] | sales_order.store_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-003 | 商品/数量 / 商品/数量 / array | PageReadModel.ORD-001.fields["ORD-001-F-003"] | sales_order_item.title,quantity〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.title,quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-004 | 实收 / 实收 / money | PageReadModel.ORD-001.fields["ORD-001-F-004"] | sales_order.paid_amount〔PHYSICAL_OR_JOIN〕 | 按 sales_order.paid_amount 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-005 | 状态 / 状态 / enum | PageReadModel.ORD-001.fields["ORD-001-F-005"] | sales_order.state〔PHYSICAL_OR_JOIN〕 | 按 sales_order.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-006 | 采购 / 采购 / enum | PageReadModel.ORD-001.fields["ORD-001-F-006"] | derived(procurement_order.state)〔COMPUTED〕 | 按 derived(procurement_order.state) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-F-007 | 物流 / 物流 / enum | PageReadModel.ORD-001.fields["ORD-001-F-007"] | derived(store_shipment_task.state)〔COMPUTED〕 | 按 derived(store_shipment_task.state) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

ORD-001-C-001 立即同步订单 | TASK_ACCEPT POST /order-sync-runs | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | XHS 已登录、store/account/profile 一致；列表→package_id 详情唯一链接；无法确定身份不落成可采购订单。 | ORD-001；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

ORD-001-C-002 查看 | NAS_READ GET /sales-orders/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | ORD-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

ORD-001-C-003 查看 | NAS_READ GET /sales-orders/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | ORD-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

ORD-001-C-004 查看 | NAS_READ GET /sales-orders/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | ORD-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

ORD-001-C-005 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-001-C-006 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-001-C-007 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-001-C-008 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-ORD-001-C-001-P, T-C-ORD-001-C-002-P, T-C-ORD-001-C-003-P, T-C-ORD-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

18  ORD-001-D  订单详情弹窗

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：沿用既有页面路由；具体入口待 UI 核对。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/orders。ReadModel：GET /ui/readmodels/ORD-001-D；响应字段键固定为 PageReadModel.ORD-001-D.fields[FieldID]。

业务流程：从被点击的当前行携带 StoreID＋SalesOrderID；先读本地详情，再按授权只读刷新平台。07C 证明一次列表包裹→详情关联；07D 两个包裹分别属于不同列表 orderId。当前仅两单各一商品、无可核验物流业务数据。

查询语义：本弹窗无独立模糊搜索；OrderID 来自所点行，详情返回时必须核对 Store＋ExternalOrderId。多项商品按 externalLineId 展开；切换订单应卸载前一订单内容并显示加载态。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

ORD-001-D-F-001 | 外部订单号 / 外部订单号 / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-001"] | sales_order.external_order_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.external_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-002 | 店铺及账号 / 店铺及账号 / object | PageReadModel.ORD-001-D.fields["ORD-001-D-F-002"] | sales_order.store_id,account_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.store_id,account_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-003 | 订单原始状态 / 订单原始状态 / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-003"] | sales_order.platform_state_raw〔PHYSICAL_OR_JOIN〕 | 按 sales_order.platform_state_raw 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-004 | 下单时间 / 下单时间 / time | PageReadModel.ORD-001-D.fields["ORD-001-D-F-004"] | sales_order.ordered_at〔PHYSICAL_OR_JOIN〕 | 按 sales_order.ordered_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-005 | 外部更新时间 / 外部更新时间 / time | PageReadModel.ORD-001-D.fields["ORD-001-D-F-005"] | sales_order.external_updated_at〔PHYSICAL_OR_JOIN〕 | 按 sales_order.external_updated_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-006 | 实收金额与币种 / 实收金额与币种 / object | PageReadModel.ORD-001-D.fields["ORD-001-D-F-006"] | sales_order.paid_amount,currency_code〔PHYSICAL_OR_JOIN〕 | 按 sales_order.paid_amount,currency_code 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-007 | 订单项外部 ID / 订单项外部 ID / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-007"] | sales_order_item.external_line_id:candidate〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.external_line_id:candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-008 | 店铺 SKU 身份 / 店铺 SKU 身份 / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-008"] | sales_order_item.external_sku_id:candidate〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.external_sku_id:candidate 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-009 | 购买数量 / 购买数量 / int | PageReadModel.ORD-001-D.fields["ORD-001-D-F-009"] | sales_order_item.quantity〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-010 | 商品标题 / 商品标题 / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-010"] | sales_order_item.title〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-011 | 项级金额与币种 / 项级金额与币种 / money | PageReadModel.ORD-001-D.fields["ORD-001-D-F-011"] | sales_order_item.gross_amount:candidate〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.gross_amount:candidate 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-012 | SKU 映射状态 / SKU 映射状态 / enum | PageReadModel.ORD-001-D.fields["ORD-001-D-F-012"] | sales_order_item.mapping_state〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.mapping_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-013 | 青鸟 ProductSKU / 青鸟 ProductSKU / uuid | PageReadModel.ORD-001-D.fields["ORD-001-D-F-013"] | sales_order_item.mapped_product_sku_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.mapped_product_sku_id 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-014 | 货源绑定 / 货源绑定 / uuid | PageReadModel.ORD-001-D.fields["ORD-001-D-F-014"] | sales_order_item.source_sku_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.source_sku_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-015 | 采购组与采购单 / 采购组与采购单 / object | PageReadModel.ORD-001-D.fields["ORD-001-D-F-015"] | purchase_suggestion.id,procurement_order.id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.id,procurement_order.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-016 | 物流包裹 / 物流包裹 / array | PageReadModel.ORD-001-D.fields["ORD-001-D-F-016"] | supplier_shipment.id,store_shipment_task.state〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.id,store_shipment_task.state 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-017 | 店铺与货源售后 / 店铺与货源售后 / array | PageReadModel.ORD-001-D.fields["ORD-001-D-F-017"] | after_sale_case.id,kind,store_state_raw〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.id,kind,store_state_raw 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-018 | 费用与退款状态 / 费用与退款状态 / enum | PageReadModel.ORD-001-D.fields["ORD-001-D-F-018"] | profit_snapshot.calculation_state〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.calculation_state 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-019 | 页面签名 / 页面签名 / string | PageReadModel.ORD-001-D.fields["ORD-001-D-F-019"] | derived(storeId,accountId,externalOrderId,externalPackageId,version)〔COMPUTED〕 | 按 derived(storeId,accountId,externalOrderId,externalPackageId,version) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-001-D-F-020 | 观察时间 / 观察时间 / time | PageReadModel.ORD-001-D.fields["ORD-001-D-F-020"] | sales_order.observed_at〔PHYSICAL_OR_JOIN〕 | 按 sales_order.observed_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

ORD-001-D-C-001 刷新平台详情 | TASK_ACCEPT POST /sales-orders/{id}/refresh | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读重新抓取同店同账号订单详情；package_id 唯一连续，错店或歧义不得合并。 | ORD-001-D；完成后重取详情；失败保留上次快照并注明时间

ORD-001-D-C-002 打开平台订单 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | ORD-001-D；打开 ORD-001-D；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-003 处理 SKU 映射 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SYS-007；打开 SYS-007；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-004 去采购 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PUR-001；打开 PUR-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-005 查看物流 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | LOG-001；打开 LOG-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-006 查看售后 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | AS-001；打开 AS-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-007 查看核算 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | FIN-002；打开 FIN-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

ORD-001-D-C-008 关闭详情 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | ORD-001；打开 ORD-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-ORD-001-D-C-001-P, T-C-ORD-001-D-C-002-P, T-C-ORD-001-D-C-003-P, T-C-ORD-001-D-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

19  ORD-002  订单同步任务

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：订单；路由 #/order-sync；关联需求 REQ-ORD-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/order-sync。ReadModel：GET /ui/readmodels/ORD-002；响应字段键固定为 PageReadModel.ORD-002.fields[FieldID]。

业务流程：按店铺建立订单只读同步任务，记录请求窗口、游标候选、批次和结果；重复运行不得增加同店同外部订单。增量水位未实测时回退到可复核窗口。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

ORD-002-F-001 | 同步批次 / 同步批次 / uuid | PageReadModel.ORD-002.fields["ORD-002-F-001"] | order_sync_run.id〔PHYSICAL_OR_JOIN〕 | 按 order_sync_run.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-002-F-002 | 店铺 / 店铺 / uuid | PageReadModel.ORD-002.fields["ORD-002-F-002"] | order_sync_run.store_id〔PHYSICAL_OR_JOIN〕 | 按 order_sync_run.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-002-F-003 | 范围 / 范围 / object | PageReadModel.ORD-002.fields["ORD-002-F-003"] | order_sync_run.cursor_before,cursor_after〔PHYSICAL_OR_JOIN〕 | 按 order_sync_run.cursor_before,cursor_after 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-002-F-004 | 结果 / 结果 / object | PageReadModel.ORD-002.fields["ORD-002-F-004"] | business_task.result_json〔PHYSICAL_OR_JOIN〕 | 按 business_task.result_json 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-002-F-005 | 处理方式 / 处理方式 / string | PageReadModel.ORD-002.fields["ORD-002-F-005"] | business_task.state〔PHYSICAL_OR_JOIN〕 | 按 business_task.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

ORD-002-F-006 | 耗时 / 耗时 / int | PageReadModel.ORD-002.fields["ORD-002-F-006"] | derived(business_task.updated_at-created_at)〔COMPUTED〕 | 按 derived(business_task.updated_at-created_at) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

ORD-002-C-001 新建同步 | TASK_ACCEPT POST /order-sync-runs | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | XHS 已登录、store/account/profile 一致；列表→package_id 详情唯一链接；无法确定身份不落成可采购订单。 | ORD-002；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

ORD-002-C-002 查看 | NAS_READ GET /order-sync-runs/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | ORD-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

ORD-002-C-003 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-002-C-004 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-002-C-005 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

ORD-002-C-006 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | ORD-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-ORD-002-C-001-P, T-C-ORD-002-C-002-P, T-C-ORD-002-C-003-P, T-C-ORD-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

20  PUR-001  采购建议

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：采购；路由 #/purchase-suggestions；关联需求 REQ-PUR-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/purchase-suggestions。ReadModel：GET /ui/readmodels/PUR-001；响应字段键固定为 PageReadModel.PUR-001.fields[FieldID]。

业务流程：只对唯一销售订单项↔SourceSKU 绑定且有未采购量的项生成建议，按供应商/1688 账号拆组；歧义进入人工映射，不能直接建采购单。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PUR-001-F-001 | 销售订单 / 销售订单 / uuid | PageReadModel.PUR-001.fields["PUR-001-F-001"] | purchase_suggestion.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-002 | 订单项/数量 / 订单项/数量 / array | PageReadModel.PUR-001.fields["PUR-001-F-002"] | purchase_suggestion_item.sales_order_item_id,quantity〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion_item.sales_order_item_id,quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-003 | 采购分组 / 采购分组 / object | PageReadModel.PUR-001.fields["PUR-001-F-003"] | purchase_suggestion.supplier_account_id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.supplier_account_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-004 | 货源映射 / 货源映射 / array | PageReadModel.PUR-001.fields["PUR-001-F-004"] | purchase_suggestion_item.source_sku_id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion_item.source_sku_id 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-005 | 采集价 / 采集价 / money | PageReadModel.PUR-001.fields["PUR-001-F-005"] | purchase_suggestion_item.price_at_collection〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion_item.price_at_collection 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-006 | 当前状态 / 当前状态 / enum | PageReadModel.PUR-001.fields["PUR-001-F-006"] | purchase_suggestion.state〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-001-F-007 | 建议 / 建议 / object | PageReadModel.PUR-001.fields["PUR-001-F-007"] | derived(purchase_suggestion_item quantity,source_sku.current_price)〔COMPUTED〕 | 按 derived(purchase_suggestion_item quantity,source_sku.current_price) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PUR-001-C-001 重新生成建议 | NAS_WRITE POST /purchase-suggestions:generate | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅已唯一映射的销售项和 SourceSKU；按供应商/货源账号分组，已采购量扣减防重。 | PUR-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PUR-001-C-002 进入采购确认 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。；若改变业务决定，要求本次明确确认。 | PUR-002；打开 PUR-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PUR-001-C-003 查看 | NAS_READ GET /purchase-suggestions/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | PUR-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

PUR-001-C-004 处理映射 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | SYS-007；打开 SYS-007；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PUR-001-C-005 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-001-C-006 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-001-C-007 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-001-C-008 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-PUR-001-C-001-P, T-C-PUR-001-C-002-P, T-C-PUR-001-C-003-P, T-C-PUR-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

21  PUR-002  采购确认

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：采购；路由 #/purchase-confirm；关联需求 REQ-PUR-002/003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/purchase-confirm。ReadModel：GET /ui/readmodels/PUR-002；响应字段键固定为 PageReadModel.PUR-002.fields[FieldID]。

业务流程：展示 Fresh 来源 SKU、数量、报价、MOQ、收货信息和版本；关键变化使确认失效。本次用户明确确认后仅在 1688 创建采购单并回读，支付留在 1688。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PUR-002-F-001 | 检查项 / 检查项 / string | PageReadModel.PUR-002.fields["PUR-002-F-001"] | derived(PurchaseContext.checks[].code)〔COMPUTED〕 | 按 derived(PurchaseContext.checks[].code) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-002 | 采集时 / 采集时 / string | PageReadModel.PUR-002.fields["PUR-002-F-002"] | derived(PurchaseContext.checks[].before)〔COMPUTED〕 | 按 derived(PurchaseContext.checks[].before) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-003 | 当前 / 当前 / string | PageReadModel.PUR-002.fields["PUR-002-F-003"] | derived(PurchaseContext.checks[].current)〔COMPUTED〕 | 按 derived(PurchaseContext.checks[].current) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-004 | 结果 / 结果 / enum | PageReadModel.PUR-002.fields["PUR-002-F-004"] | derived(PurchaseContext.checks[].result)〔COMPUTED〕 | 按 derived(PurchaseContext.checks[].result) 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-005 | 销售订单 / 销售订单 / uuid | PageReadModel.PUR-002.fields["PUR-002-F-005"] | purchase_suggestion.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-006 | 销售商品 / 销售商品 / object | PageReadModel.PUR-002.fields["PUR-002-F-006"] | sales_order_item.title〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.title 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-007 | 销售数量 / 销售数量 / int | PageReadModel.PUR-002.fields["PUR-002-F-007"] | sales_order_item.quantity〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-008 | 1688货源 / 1688货源 / object | PageReadModel.PUR-002.fields["PUR-002-F-008"] | source_product.id,external_product_id〔PHYSICAL_OR_JOIN〕 | 按 source_product.id,external_product_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-009 | 规格绑定 / 规格绑定 / object | PageReadModel.PUR-002.fields["PUR-002-F-009"] | source_sku.id,external_spec_id〔PHYSICAL_OR_JOIN〕 | 按 source_sku.id,external_spec_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-010 | 建议采购 / 建议采购 / int | PageReadModel.PUR-002.fields["PUR-002-F-010"] | purchase_suggestion_item.quantity〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion_item.quantity 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-011 | 当前单价 / 当前单价 / money | PageReadModel.PUR-002.fields["PUR-002-F-011"] | source_sku.current_price〔PHYSICAL_OR_JOIN〕 | 按 source_sku.current_price 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-012 | 商品金额 / 商品金额 / money | PageReadModel.PUR-002.fields["PUR-002-F-012"] | derived(sum(confirmation_snapshot.items[].unit_price * quantity) + confirmed_shipping + confirmed_adjustments); currency and unit must match; DECIMAL(18,4) then currency rounding once〔COMPUTED〕 | 按 derived(sum(source_sku.current_pricequantity)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；取确认快照项现价、数量、单位和币种，缺任一项则禁用采购确认；不得以采集旧价代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-013 | 预估运费 / 预估运费 / money | PageReadModel.PUR-002.fields["PUR-002-F-013"] | derived(PurchaseContext.freightEstimate):candidate〔COMPUTED〕 | 按 derived(PurchaseContext.freightEstimate):candidate 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-002-F-014 | 预计合计 / 预计合计 / money | PageReadModel.PUR-002.fields["PUR-002-F-014"] | derived(productAmount+freightEstimate):candidate〔COMPUTED〕 | 按 derived(productAmount+freightEstimate):candidate 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PUR-002-C-001 返回建议 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PUR-001；打开 PUR-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PUR-002-C-002 重新校验 | TASK_ACCEPT POST /purchase-suggestions/{id}/revalidate | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读 Fresh 重验价格、SKU、MOQ、数量、地址；不自动创建 1688 订单。 | PUR-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PUR-002-C-003 确认采购并创建1688订单 | EXTERNAL_WRITE POST /purchase-requests/{id}/confirm | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅账号/快照/SKU/单位/数量/金额/收货身份已核且用户当次确认后启用；UNKNOWN 不可再建单。 | PUR-002；先显示建单处理中；唯一完整回读才显示已创建待外部付款；回执未知转待核。

PUR-002-C-004 采购单已创建 | UI_LOCAL   | 候选已存在、采集中或采购单已创建时显示；其他状态隐藏。 | 仅 CREATED_UNPAID 且有唯一完整回读证据时显示禁用标签；处理中/UNKNOWN 不得显示已创建。 | 本页；无跳转、无写请求；状态变化由回读驱动。

正向断言：T-C-PUR-002-C-001-P, T-C-PUR-002-C-002-P, T-C-PUR-002-C-003-P, T-C-PUR-002-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

22  PUR-003  采购订单

端：NAS。波次：1688→XHS 首链。样本：POST_DEV_SIT_PENDING。入口和准入：入口：采购；路由 #/purchase-orders；关联需求 REQ-PUR-003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/purchase-orders。ReadModel：GET /ui/readmodels/PUR-003；响应字段键固定为 PageReadModel.PUR-003.fields[FieldID]。

业务流程：展示内部采购意图、1688 外部采购单身份、支付观察状态与更新时间；写结果不明先以同账号对账，不重复创建；用户自行到外部支付。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PUR-003-F-001 | 采购订单 / 采购订单 / object | PageReadModel.PUR-003.fields["PUR-003-F-001"] | procurement_order.id,external_order_id；readback 候选来自 business_task.result_json 证据，V003 无正式物理快照列〔PHYSICAL_OR_JOIN〕 | 只在同一来源账号下以返回对象原始 ID 本地严格等值并核项/数量/金额、完整分页且唯一后显示外部号；单条返回/无效 ID 返回原单不等于成功。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-002 | 对应销售订单 / 对应销售订单 / uuid | PageReadModel.PUR-003.fields["PUR-003-F-002"] | purchase_suggestion.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-003 | 供应商 / 供应商 / uuid | PageReadModel.PUR-003.fields["PUR-003-F-003"] | procurement_order.supplier_account_id〔PHYSICAL_OR_JOIN〕 | 按 procurement_order.supplier_account_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-004 | 金额 / 金额 / money | PageReadModel.PUR-003.fields["PUR-003-F-004"] | derived(PurchaseContext.estimatedAmount):candidate〔COMPUTED〕 | 按 derived(PurchaseContext.estimatedAmount):candidate 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-005 | 支付 / 支付 / enum | PageReadModel.PUR-003.fields["PUR-003-F-005"] | procurement_order.state；外部 orders[].status 为原码候选，付款映射未核〔PHYSICAL_OR_JOIN〕 | CREATED_UNPAID 仅表示采购单已建立待用户在 1688 付款；UNKNOWN/原码未映射显示待核，不从 UTP status 路径存在推断已付款。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-006 | 履约 / 履约 / enum | PageReadModel.PUR-003.fields["PUR-003-F-006"] | derived(supplier_shipment.state)〔COMPUTED〕 | 按 derived(supplier_shipment.state) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-007 | 最近同步 / 最近同步 / time | PageReadModel.PUR-003.fields["PUR-003-F-007"] | procurement_order.readback_at〔PHYSICAL_OR_JOIN〕 | 成功同步时间仅在同账号唯一且完整回读后更新；不完整分页和失败尝试只记任务观察时间，保留旧成功时间。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-008 | 回读路线 / DETAIL_FIELD | PageReadModel.PUR-003.fields["PUR-003-F-008"] | qn.procurement_readback_observation.route〔PHYSICAL_OR_JOIN〕 | UTP 完整分页本地严格等值或受控浏览器详情；后一条待实测；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-009 | 采购外部身份核对 / STATUS_CHECK | PageReadModel.PUR-003.fields["PUR-003-F-009"] | qn.procurement_readback_observation.verdict〔PHYSICAL_OR_JOIN〕 | 缺完整分页、唯一 ID 或账号一致性时 UNKNOWN；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-010 | 订单项与规格核对 / DETAIL_FIELD | PageReadModel.PUR-003.fields["PUR-003-F-010"] | qn.procurement_readback_item〔PHYSICAL_OR_JOIN〕 | 数量、规格、单位和身份逐项比较；同单多项待样本；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PUR-003-F-011 | 金额分项与币种核对 / DETAIL_FIELD | PageReadModel.PUR-003.fields["PUR-003-F-011"] | qn.procurement_readback_amount〔PHYSICAL_OR_JOIN〕 | 运费、折扣、总额分项及币种一致，未知为待补，不写零；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PUR-003-C-001 打开1688订单 | TASK_ACCEPT POST /procurement-orders/{id}/open-external | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只打开正确 1688 外部订单页，支付由用户自行完成；不发起支付。 | 本页；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

PUR-003-C-002 只读回读采购单 | TASK_ACCEPT POST /procurement-orders/{id}/readback | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 已绑定来源账号且有本地采购单时可发起只读同步；外部身份不明仍允许对账但不得判成功。 | PUR-003；页不全/歧义/回执不明保持 UNKNOWN，不自动重建采购单

PUR-003-C-003 查看物流 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | LOG-001；打开 LOG-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PUR-003-C-004 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-003-C-005 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-003-C-006 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

PUR-003-C-007 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | PUR-003；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-PUR-003-C-001-P, T-C-PUR-003-C-002-P, T-C-PUR-003-C-003-P, T-C-PUR-003-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

23  LOG-001  物流中心

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：物流；路由 #/logistics；关联需求 REQ-LOG-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/logistics。ReadModel：GET /ui/readmodels/LOG-001；响应字段键固定为 PageReadModel.LOG-001.fields[FieldID]。

业务流程：在当前无物流真实样本时显示未获取/待同步。货源物流只读获取；按店自动回填默认关闭，仅唯一包裹、数量、承运商、运单、账号和目标状态都可核时才可提交。

查询语义：全部店铺、全部状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

LOG-001-F-007 | 全部店铺 / 全部店铺 | PageReadModel.LOG-001.query["LOG-001-F-007"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

LOG-001-F-008 | 全部状态 / 全部状态 | PageReadModel.LOG-001.query["LOG-001-F-008"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

LOG-001-F-001 | 销售订单 / 销售订单 / uuid | PageReadModel.LOG-001.fields["LOG-001-F-001"] | store_shipment_task.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 store_shipment_task.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-002 | 采购订单/包裹 / 采购订单/包裹 / object | PageReadModel.LOG-001.fields["LOG-001-F-002"] | supplier_shipment.procurement_order_id,external_package_id〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.procurement_order_id,external_package_id 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-003 | 承运商/单号 / 承运商/单号 / object | PageReadModel.LOG-001.fields["LOG-001-F-003"] | supplier_shipment.carrier_code,tracking_number〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.carrier_code,tracking_number 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-004 | 映射 / 映射 / enum | PageReadModel.LOG-001.fields["LOG-001-F-004"] | derived(supplier_shipment_item unique order mapping)〔COMPUTED〕 | 按 derived(supplier_shipment_item unique order mapping) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-005 | 商城状态 / 商城状态 / enum | PageReadModel.LOG-001.fields["LOG-001-F-005"] | store_shipment_task.state〔PHYSICAL_OR_JOIN〕 | 按 store_shipment_task.state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-006 | 最近获取 / 最近获取 / time | PageReadModel.LOG-001.fields["LOG-001-F-006"] | supplier_shipment.observed_at〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.observed_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-009 | 供应商已发货 / 供应商已发货 / int | PageReadModel.LOG-001.fields["LOG-001-F-009"] | derived(count(supplier_shipment state))〔COMPUTED〕 | 按 derived(count(supplier_shipment state)) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-010 | 待回填商城 / 待回填商城 / int | PageReadModel.LOG-001.fields["LOG-001-F-010"] | derived(count(store_shipment_task PENDING))〔COMPUTED〕 | 按 derived(count(store_shipment_task PENDING)) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-001-F-011 | 需人工确认 / 需人工确认 / int | PageReadModel.LOG-001.fields["LOG-001-F-011"] | derived(count(store_shipment_task NEEDS_HUMAN,UNKNOWN))〔COMPUTED〕 | 按 derived(count(store_shipment_task NEEDS_HUMAN,UNKNOWN)) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

LOG-001-C-001 刷新供应商物流 | TASK_ACCEPT POST /supplier-logistics-sync-runs | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 1688 UTP 有经验证工具才使用；否则受控 Browser 只读 fallback；不可臆造运单。 | LOG-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

LOG-001-C-002 回填 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | LOG-002；打开 LOG-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

LOG-001-C-003 启用/关闭安全自动回填 | NAS_WRITE PUT /stores/{storeId}/shipment-auto-policy | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅本机主人或明确获得此项设置授权者；平台能力可用、配置值合法。仅配置本人；按店策略版本一致 | LOG-001；保存默认关闭/显式启用的策略版本

LOG-001-C-004 人工确认 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。；若改变业务决定，要求本次明确确认。 | LOG-002；打开 LOG-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

LOG-001-C-005 查看 | NAS_READ GET /supplier-shipments/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | LOG-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

LOG-001-C-006 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | LOG-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

LOG-001-C-007 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | LOG-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

LOG-001-C-008 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | LOG-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

LOG-001-C-009 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | LOG-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-LOG-001-C-001-P, T-C-LOG-001-C-002-P, T-C-LOG-001-C-003-P, T-C-LOG-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

24  LOG-002  物流回填确认

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：物流；路由 #/logistics-fill；关联需求 REQ-LOG-002；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/logistics-fill。ReadModel：GET /ui/readmodels/LOG-002；响应字段键固定为 PageReadModel.LOG-002.fields[FieldID]。

业务流程：以销售订单、供应商包裹和数量分配形成一次确认上下文；人工确认或已启用安全策略满足门禁后写店铺物流，成功以写后回读为准。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

LOG-002-F-001 | 供应商包裹 / 供应商包裹 / string | PageReadModel.LOG-002.fields["LOG-002-F-001"] | supplier_shipment.external_package_id〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.external_package_id 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-002 | 采购订单 / 采购订单 / uuid | PageReadModel.LOG-002.fields["LOG-002-F-002"] | supplier_shipment.procurement_order_id〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.procurement_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-003 | 销售订单项 / 销售订单项 / array | PageReadModel.LOG-002.fields["LOG-002-F-003"] | supplier_shipment_item.sales_order_item_id〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment_item.sales_order_item_id 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-004 | 数量 / 数量 / int | PageReadModel.LOG-002.fields["LOG-002-F-004"] | supplier_shipment.quantity〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-005 | 映射 / 映射 / object | PageReadModel.LOG-002.fields["LOG-002-F-005"] | derived(ShipmentContext.checks mapping)〔COMPUTED〕 | 按 derived(ShipmentContext.checks mapping) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-006 | 店铺 / 店铺 / uuid | PageReadModel.LOG-002.fields["LOG-002-F-006"] | store_shipment_task.store_id〔PHYSICAL_OR_JOIN〕 | 按 store_shipment_task.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-007 | 订单 / 订单 / uuid | PageReadModel.LOG-002.fields["LOG-002-F-007"] | store_shipment_task.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 store_shipment_task.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-008 | 承运商 / 承运商 / string | PageReadModel.LOG-002.fields["LOG-002-F-008"] | supplier_shipment.carrier_code〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.carrier_code 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-009 | 运单号 / 运单号 / string | PageReadModel.LOG-002.fields["LOG-002-F-009"] | supplier_shipment.tracking_number〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.tracking_number 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-010 | 本次发货 / 本次发货 / object | PageReadModel.LOG-002.fields["LOG-002-F-010"] | supplier_shipment.id,quantity〔PHYSICAL_OR_JOIN〕 | 按 supplier_shipment.id,quantity 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-011 | 订单身份明确 / 订单身份明确 / enum | PageReadModel.LOG-002.fields["LOG-002-F-011"] | derived(ShipmentContext.checks order_identity)〔COMPUTED〕 | 按 derived(ShipmentContext.checks order_identity) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-012 | 包裹与订单项数量一致 / 包裹与订单项数量一致 / enum | PageReadModel.LOG-002.fields["LOG-002-F-012"] | derived(ShipmentContext.checks quantity)〔COMPUTED〕 | 按 derived(ShipmentContext.checks quantity) 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-013 | 承运商已映射 / 承运商已映射 / enum | PageReadModel.LOG-002.fields["LOG-002-F-013"] | derived(ShipmentContext.checks carrier)〔COMPUTED〕 | 按 derived(ShipmentContext.checks carrier) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-014 | 店铺订单仍为待发货 / 店铺订单仍为待发货 / enum | PageReadModel.LOG-002.fields["LOG-002-F-014"] | derived(ShipmentContext.checks store_state)〔COMPUTED〕 | 按 derived(ShipmentContext.checks store_state) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-015 | 不存在不同运单冲突 / 不存在不同运单冲突 / enum | PageReadModel.LOG-002.fields["LOG-002-F-015"] | derived(ShipmentContext.checks tracking_conflict)〔COMPUTED〕 | 按 derived(ShipmentContext.checks tracking_conflict) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

LOG-002-F-016 | 当前绑定设备在线且目标店铺登录身份有效 / 当前绑定设备在线且目标店铺登录身份有效 / enum | PageReadModel.LOG-002.fields["LOG-002-F-016"] | derived(ShipmentContext.checks worker_auth)〔COMPUTED〕 | 按 derived(ShipmentContext.checks worker_auth) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

LOG-002-C-001 返回物流中心 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | LOG-001；打开 LOG-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

LOG-002-C-002 同步到店铺并验证 | EXTERNAL_WRITE POST /store-shipment-sync-tasks/{id}/confirm | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 店铺身份、订单/包裹/订单项唯一映射、数量、承运商、运单、可发货状态均 PASS，当前用户确认。 | LOG-002；提交一次并回读店铺发货状态

正向断言：T-C-LOG-002-C-001-P, T-C-LOG-002-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

25  AS-001  售后中心

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：售后；路由 #/aftersales；关联需求 REQ-AS-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/aftersales。ReadModel：GET /ui/readmodels/AS-001；响应字段键固定为 PageReadModel.AS-001.fields[FieldID]。

业务流程：聚合店铺和货源售后事件，保留双方原始类型/状态、金额与观察时间；未关联提示人工，不进行自动裁决或外部提交。

查询语义：售后单 / 店铺订单、全部类型、全部状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

AS-001-F-007 | 售后单 / 售后单 / 店铺订单 | PageReadModel.AS-001.query["AS-001-F-007"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

AS-001-F-008 | 全部类型 / 全部类型 | PageReadModel.AS-001.query["AS-001-F-008"] | 查询输入映射 request.type（enum）；空值为不限/沿用当前上下文，值的枚举或范围若无已审定来源须标“待验证”，服务端拒绝越权值。

AS-001-F-009 | 全部状态 / 全部状态 | PageReadModel.AS-001.query["AS-001-F-009"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

AS-001-F-001 | 售后 / 售后 / uuid | PageReadModel.AS-001.fields["AS-001-F-001"] | after_sale_case.id〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-001-F-002 | 店铺订单 / 店铺订单 / uuid | PageReadModel.AS-001.fields["AS-001-F-002"] | after_sale_case.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-001-F-003 | 类型 / 类型 / enum | PageReadModel.AS-001.fields["AS-001-F-003"] | after_sale_case.kind〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.kind 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-001-F-004 | 店铺侧 / 店铺侧 / string | PageReadModel.AS-001.fields["AS-001-F-004"] | after_sale_case.store_state_raw〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.store_state_raw 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-001-F-005 | 货源侧 / 货源侧 / string | PageReadModel.AS-001.fields["AS-001-F-005"] | after_sale_case.supplier_state_raw〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.supplier_state_raw 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-001-F-006 | 关联 / 关联 / enum | PageReadModel.AS-001.fields["AS-001-F-006"] | derived(case store/supplier identity)〔COMPUTED〕 | 按 derived(case store/supplier identity) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

AS-001-C-001 处理 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | AS-002；打开 AS-002；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

AS-001-C-002 查看 | NAS_READ GET /aftersale-cases/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | AS-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

AS-001-C-003 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | AS-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

AS-001-C-004 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | AS-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

AS-001-C-005 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | AS-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

AS-001-C-006 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | AS-001；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-AS-001-C-001-P, T-C-AS-001-C-002-P, T-C-AS-001-C-003-P, T-C-AS-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

26  AS-002  售后详情

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：POST_DEV_SIT_PENDING。入口和准入：入口：售后；路由 #/aftersale-detail；关联需求 REQ-AS-001；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；对象、店铺、平台账号与 BrowserProfile 的关系须在 Server 复核。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/aftersale-detail。ReadModel：GET /ui/readmodels/AS-002；响应字段键固定为 PageReadModel.AS-002.fields[FieldID]。

业务流程：查看两侧证据并保存青鸟本地决定；用户在外部平台自行处理，随后分别只读回查，不把本地决定标为平台处理完成。

查询语义：无独立查询；由入口对象 ID/店铺/版本加载。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

AS-002-F-001 | 处理决定（待保存） / 处理决定（待保存） / string | PageReadModel.AS-002.fields["AS-002-F-001"] | after_sale_local_decision.decision〔PHYSICAL_OR_JOIN〕 | 按 after_sale_local_decision.decision 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-002 | 平台 / 平台 / string | PageReadModel.AS-002.fields["AS-002-F-002"] | store.platform_code〔PHYSICAL_OR_JOIN〕 | 按 store.platform_code 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-003 | 订单 / 订单 / uuid | PageReadModel.AS-002.fields["AS-002-F-003"] | after_sale_case.sales_order_id〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.sales_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-004 | 类型 / 类型 / enum | PageReadModel.AS-002.fields["AS-002-F-004"] | after_sale_case.kind〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.kind 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-005 | 原因 / 原因 / string | PageReadModel.AS-002.fields["AS-002-F-005"] | after_sale_local_decision.reason:external reason candidate〔PHYSICAL_OR_JOIN〕 | 按 after_sale_local_decision.reason:external reason candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-006 | 状态 / 状态 / string | PageReadModel.AS-002.fields["AS-002-F-006"] | after_sale_case.store_state_raw〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.store_state_raw 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-007 | 1688采购单 / 1688采购单 / uuid | PageReadModel.AS-002.fields["AS-002-F-007"] | derived(procurement_order by sales_order)〔COMPUTED〕 | 按 derived(procurement_order by sales_order) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-008 | 货源商品 / 货源商品 / uuid | PageReadModel.AS-002.fields["AS-002-F-008"] | derived(source_product by order item)〔COMPUTED〕 | 按 derived(source_product by order item) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-009 | 采购数量 / 采购数量 / int | PageReadModel.AS-002.fields["AS-002-F-009"] | purchase_suggestion_item.quantity〔PHYSICAL_OR_JOIN〕 | 按 purchase_suggestion_item.quantity 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

AS-002-F-010 | 货源售后 / 货源售后 / object | PageReadModel.AS-002.fields["AS-002-F-010"] | after_sale_case.supplier_account_id,supplier_external_case_id,supplier_state_raw:candidate〔PHYSICAL_OR_JOIN〕 | 按 after_sale_case.supplier_account_id,supplier_external_case_id,supplier_state_raw:candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

AS-002-C-001 返回售后中心 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | AS-001；打开 AS-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

AS-002-C-002 打开当前店铺售后 | TASK_ACCEPT POST /aftersale-cases/{id}/open-external-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只打开正确侧的外部售后页；不提交同意/拒绝/退款。 | 本页；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

AS-002-C-003 刷新状态 | TASK_ACCEPT POST /aftersale-cases/{id}/refresh | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读回查双方状态、原码与观察时间，保持本地决定独立。 | AS-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

AS-002-C-004 打开1688售后 | TASK_ACCEPT POST /aftersale-cases/{id}/open-external-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只打开正确侧的外部售后页；不提交同意/拒绝/退款。 | 本页；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口

AS-002-C-005 刷新状态 | TASK_ACCEPT POST /aftersale-cases/{id}/refresh | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读回查双方状态、原码与观察时间，保持本地决定独立。 | AS-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

AS-002-C-006 保存决定 | NAS_WRITE POST /aftersale-cases/{id}/decisions | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 管理员或授权操作员＋本地案例版本一致 | AS-002；只保存本地决定，不调用平台售后处理

正向断言：T-C-AS-002-C-001-P, T-C-AS-002-C-002-P, T-C-AS-002-C-003-P, T-C-AS-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

27  SYS-001  平台与渠道

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/web/SYS-001；关联需求 REQ-PLT-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/web/SYS-001。ReadModel：GET /api/v1/configuration；响应字段键固定为 PageReadModel.SYS-001.fields[FieldID]。

业务流程：注册平台能力与 Endpoint/版本；只有已实现并验证的 Adapter 可启用该能力，未验证外部地址不能进入写通道。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-001-F-001 | 平台 / 平台 / string | PageReadModel.SYS-001.fields["SYS-001-F-001"] | derived(platform_account.platform_code)〔COMPUTED〕 | 按 derived(platform_account.platform_code) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-001-F-002 | 类型 / 类型 / string | PageReadModel.SYS-001.fields["SYS-001-F-002"] | derived(platform_account.platform_code source/store)〔COMPUTED〕 | 按 derived(platform_account.platform_code source/store) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-001-F-003 | 接入模式 / 接入模式 / string | PageReadModel.SYS-001.fields["SYS-001-F-003"] | derived(adapter capability binding)〔COMPUTED〕 | 按 derived(adapter capability binding) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-001-F-004 | Endpoint / Endpoint / string | PageReadModel.SYS-001.fields["SYS-001-F-004"] | derived(configured endpoint):candidate〔COMPUTED〕 | 按 derived(configured endpoint):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-001-F-005 | 能力 / 能力 / array | PageReadModel.SYS-001.fields["SYS-001-F-005"] | derived(adapter capability snapshot):candidate〔COMPUTED〕 | 按 derived(adapter capability snapshot):candidate 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-001-F-006 | 运行状态 / 运行状态 / enum | PageReadModel.SYS-001.fields["SYS-001-F-006"] | platform_account.auth_state〔PHYSICAL_OR_JOIN〕 | 按 platform_account.auth_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-001-C-001 启用已支持平台 | NAS_WRITE PATCH /platforms/{id} | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；已安装并验证 Adapter 后才能启用，不把平台码写死到通用 schema。 | SYS-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-001-C-002 配置 | NAS_WRITE PATCH /platforms/{id} | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；已安装并验证 Adapter 后才能启用，不把平台码写死到通用 schema。 | SYS-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-SYS-001-C-001-P, T-C-SYS-001-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 412，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

28  SYS-002  账号与店铺

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/web/SYS-002-stores；关联需求 REQ-AUTH-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/web/SYS-002-stores。ReadModel：GET /api/v1/configuration；响应字段键固定为 PageReadModel.SYS-002.fields[FieldID]。

业务流程：绑定平台账号、店铺、当前本人可操作的店铺范围 和 BrowserProfile；新增/修改前后校验平台角色与观测身份，不允许跨店复用错误身份。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-002-F-001 | 对象 / 对象 / object | PageReadModel.SYS-002.fields["SYS-002-F-001"] | platform_account.id,store.id〔PHYSICAL_OR_JOIN〕 | 按 platform_account.id,store.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-002-F-002 | 平台 / 平台 / string | PageReadModel.SYS-002.fields["SYS-002-F-002"] | platform_account.platform_code〔PHYSICAL_OR_JOIN〕 | 按 platform_account.platform_code 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-002-F-003 | 认证通道 / 认证通道 / string | PageReadModel.SYS-002.fields["SYS-002-F-003"] | derived(browser_profile/profile and UTP):candidate〔COMPUTED〕 | 按 derived(browser_profile/profile and UTP):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-002-F-004 | 执行绑定 / 执行绑定 / string | PageReadModel.SYS-002.fields["SYS-002-F-004"] | browser_profile.worker_ref〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.worker_ref 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-002-F-005 | 认证状态 / 认证状态 / enum | PageReadModel.SYS-002.fields["SYS-002-F-005"] | platform_account.auth_state〔PHYSICAL_OR_JOIN〕 | 按 platform_account.auth_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-002-C-001 新增账号/店铺 | NAS_WRITE POST /accounts | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；平台注册表中启用且 Adapter 已安装，账号标识不等于登录已通过。 | SYS-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-002-C-002 管理 | NAS_WRITE PATCH /accounts/{id} | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；版本锁，不通过此接口改写外部身份。 | SYS-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-002-C-003 去PC登录 | TASK_ACCEPT POST /stores/{id}/open-login-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 正确店铺账号/Profile/Worker 受控打开登录，由人完成验证码和风控。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-002-C-004 检查 | TASK_ACCEPT POST /stores/{id}/check-auth | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读检查当前 Profile 与店铺身份，不调用 reauthorize。 | SYS-002；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-002-C-005 上一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SYS-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SYS-002-C-006 1 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SYS-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SYS-002-C-007 2 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SYS-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

SYS-002-C-008 下一页 | UI_LOCAL   | 列表区显示；上一页在首页禁用，下一页在末页禁用；其他页号仅存在才显示。 | 本页列表已成功加载；目标页在有效范围内；当前页号码不可再点。 | SYS-002；仅更新 QueryContext 页号并读取目标页，保留筛选/排序；失败回退原页与页号。

正向断言：T-C-SYS-002-C-001-P, T-C-SYS-002-C-002-P, T-C-SYS-002-C-003-P, T-C-SYS-002-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 412，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

29  SYS-003  PC客户端

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/pc-devices；关联需求 REQ-PC-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/pc-devices。ReadModel：GET /ui/readmodels/SYS-003；响应字段键固定为 PageReadModel.SYS-003.fields[FieldID]。

业务流程：配对码一次性、限时使用；设备禁用撤销租约，不等于删除审计。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-003-F-001 | 设备 / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-001"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-003-F-002 | 连接 / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-002"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-003-F-003 | 客户端 / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-003"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-003-F-004 | Browser Worker / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-004"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-003-F-005 | Profiles / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-005"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-003-F-006 | 当前任务 / TABLE_COLUMN | PageReadModel.SYS-003.fields["SYS-003-F-006"] | derived(qn.browser_profile, qn.business_task and Worker registry):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /workers〔COMPUTED〕 | 按 derived(qn.browser_profile, qn.business_task and Worker registry):NEW_WORKER_CONTRACT 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-003-C-001 生成配对码 | TASK_ACCEPT POST /worker-pair-codes | 仅本机主人 | 仅本机主人；设备类型与 Server 地址已配置；签发短时、一次性配对码，旧码失效，审计且不明文长期保存。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；设备类型与 Server 地址已配置；签发短时、一次性配对码，旧码失效，审计且不明文长期保存。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-003-C-002 查看 | NAS_READ GET /workers/{id} | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-003-C-003 禁用 | TASK_ACCEPT POST /workers/{id}/revoke | 仅本机主人 | 仅本机主人；设备存在且版本未变；先停止其租约和新写任务，UNKNOWN 任务对账后再禁用凭据，审计保留。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；设备存在且版本未变；先停止其租约和新写任务，UNKNOWN 任务对账后再禁用凭据，审计保留。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-003-C-001-P, T-C-SYS-003-C-002-P, T-C-SYS-003-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

30  SYS-004  浏览器配置

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/browser-profiles；关联需求 REQ-AUTH-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/browser-profiles。ReadModel：GET /ui/readmodels/SYS-004；响应字段键固定为 PageReadModel.SYS-004.fields[FieldID]。

业务流程：只管理受控浏览器 Profile 的关联与最近身份观察，Cookie 留在 PC；身份变化冻结对应店铺外部写任务。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-004-F-001 | Profile / Profile / uuid | PageReadModel.SYS-004.fields["SYS-004-F-001"] | browser_profile.id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-004-F-002 | 设备 / 设备 / string | PageReadModel.SYS-004.fields["SYS-004-F-002"] | browser_profile.worker_ref〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.worker_ref 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-004-F-003 | 平台对象 / 平台对象 / uuid | PageReadModel.SYS-004.fields["SYS-004-F-003"] | browser_profile.platform_account_id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.platform_account_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-004-F-004 | 登录 / 登录 / enum | PageReadModel.SYS-004.fields["SYS-004-F-004"] | browser_profile.auth_state〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.auth_state 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-004-F-005 | 最近验证 / 最近验证 / time | PageReadModel.SYS-004.fields["SYS-004-F-005"] | browser_profile.last_verified_at〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.last_verified_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-004-F-006 | 占用 / 占用 / uuid | PageReadModel.SYS-004.fields["SYS-004-F-006"] | browser_profile.active_lock_task_id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.active_lock_task_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-004-C-001 检查全部登录 | TASK_ACCEPT POST /browser-profiles:check-login | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 逐 Profile 只读验证登录身份，不复用过期认证状态。 | SYS-004；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-004-C-002 打开浏览器 | TASK_ACCEPT POST /browser-profiles/{id}/open-login-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 受控 PC 浏览器打开正确账号登录页；验证码和风控保留人工。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-004-C-003 检查 | TASK_ACCEPT POST /browser-profiles/{id}/check-login | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 只读身份验证，Profile 与平台账号必须一致。 | SYS-004；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-004-C-004 重新登录 | TASK_ACCEPT POST /browser-profiles/{id}/open-login-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 受控 PC 浏览器打开正确账号登录页；验证码和风控保留人工。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-004-C-005 查看任务 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PC-005；打开 PC-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-SYS-004-C-001-P, T-C-SYS-004-C-002-P, T-C-SYS-004-C-003-P, T-C-SYS-004-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

31  SYS-005  UTP管理

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/utp；关联需求 REQ-PLT-001/REQ-AUTH-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/utp。ReadModel：GET /ui/readmodels/SYS-005；响应字段键固定为 PageReadModel.SYS-005.fields[FieldID]。

业务流程：分离 1688 平台主页与 UTP Host；Discover 仅登记发现的能力，授权范围、工具绑定和可执行性须逐项验证。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-005-F-001 | 能力 / 能力 / string | PageReadModel.SYS-005.fields["SYS-005-F-001"] | derived(UTP discover capability_code):candidate〔PLATFORM_OBSERVATION〕 | 按 derived(UTP discover capability_code):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-005-F-002 | 状态 / 状态 / enum | PageReadModel.SYS-005.fields["SYS-005-F-002"] | derived(UTP discover state):candidate〔PLATFORM_OBSERVATION〕 | 按 derived(UTP discover state):candidate 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-005-F-003 | 生产用途 / 生产用途 / string | PageReadModel.SYS-005.fields["SYS-005-F-003"] | derived(UTP capability binding):candidate〔PLATFORM_OBSERVATION〕 | 按 derived(UTP capability binding):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-005-F-004 | UTP Host / UTP Host / string | PageReadModel.SYS-005.fields["SYS-005-F-004"] | derived(UTP endpoint config):candidate〔PLATFORM_OBSERVATION〕 | 按 derived(UTP endpoint config):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-005-F-005 | 授权状态 / 授权状态 / enum | PageReadModel.SYS-005.fields["SYS-005-F-005"] | platform_account.auth_state〔PHYSICAL_OR_JOIN〕 | 按 platform_account.auth_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-005-F-006 | 能力 / 能力 / object | PageReadModel.SYS-005.fields["SYS-005-F-006"] | derived(UTP discover response):candidate〔PLATFORM_OBSERVATION〕 | 按 derived(UTP discover response):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-005-C-001 Discover能力 | TASK_ACCEPT POST /utp-capabilities/discover | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 当前 Host/账号/授权下 discover；条件能力按版本留证据，不当稳定工具。 | SYS-005；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-SYS-005-C-001-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

32  SYS-006  存储管理

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/storage；关联需求 REQ-STO-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/storage。ReadModel：GET /ui/readmodels/SYS-006；响应字段键固定为 PageReadModel.SYS-006.fields[FieldID]。

业务流程：保存存储配置须测试连接、限制路径和记录版本；不可明文展示凭据。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-006-F-001 | 数据类型 / TABLE_COLUMN | PageReadModel.SYS-006.fields["SYS-006-F-001"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 按 system_storage_setting / storage_usage:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-002 | 位置 / TABLE_COLUMN | PageReadModel.SYS-006.fields["SYS-006-F-002"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 按 system_storage_setting / storage_usage:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-003 | 保留 / TABLE_COLUMN | PageReadModel.SYS-006.fields["SYS-006-F-003"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 按 system_storage_setting / storage_usage:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-004 | 说明 / TABLE_COLUMN | PageReadModel.SYS-006.fields["SYS-006-F-004"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 按 system_storage_setting / storage_usage:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-005 | 类型 / FORM_FIELD | PageReadModel.SYS-006.fields["SYS-006-F-005"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-006 | 根路径 / FORM_FIELD | PageReadModel.SYS-006.fields["SYS-006-F-006"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-007 | 媒体目录 / FORM_FIELD | PageReadModel.SYS-006.fields["SYS-006-F-007"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-008 | Evidence目录 / FORM_FIELD | PageReadModel.SYS-006.fields["SYS-006-F-008"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-009 | 主存储 / METRIC | PageReadModel.SYS-006.fields["SYS-006-F-009"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-010 | 使用率 / METRIC | PageReadModel.SYS-006.fields["SYS-006-F-010"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-011 | 临时缓存 / METRIC | PageReadModel.SYS-006.fields["SYS-006-F-011"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-012 | 采集原图进入 MediaAsset / STATUS_CHECK | PageReadModel.SYS-006.fields["SYS-006-F-012"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-013 | 平台适配生成派生图 / STATUS_CHECK | PageReadModel.SYS-006.fields["SYS-006-F-013"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-006-F-014 | 内容去重 / STATUS_CHECK | PageReadModel.SYS-006.fields["SYS-006-F-014"] | qn.system_storage_setting + qn.storage_usage（V014 候选；容量/目录/扫描聚合）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-006-C-001 测试存储连接 | TASK_ACCEPT POST /storage-settings/test | 仅本机主人 | 仅本机主人；根路径在允许目录内、凭据只读安全引用；连接、读写权限和空间探针通过，测试不改当前配置。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；根路径在允许目录内、凭据只读安全引用；连接、读写权限和空间探针通过，测试不改当前配置。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-006-C-002 保存配置 | TASK_ACCEPT PATCH /storage-settings | 仅本机主人 | 仅本机主人；本次测试结果、路径、容量限制与配置版本仍有效；失败不覆盖原配置，密钥不回显。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；本次测试结果、路径、容量限制与配置版本仍有效；失败不覆盖原配置，密钥不回显。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-006-C-001-P, T-C-SYS-006-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

33  SYS-007  映射规则

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/mappings；关联需求 REQ-CHN-001/REQ-LOG-002；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/mappings。ReadModel：GET /ui/readmodels/SYS-007；响应字段键固定为 PageReadModel.SYS-007.fields[FieldID]。

业务流程：映射值保留平台原码和规则版本；歧义不能自动选择，确认后仅影响新投影。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-007-F-001 | 内部值 / TABLE_COLUMN | PageReadModel.SYS-007.fields["SYS-007-F-001"] | qn.platform_mapping_rule（V014 候选；平台/类型/版本）〔PHYSICAL_OR_JOIN〕 | 按 platform_mapping_rule:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-007-F-002 | 目标平台 / TABLE_COLUMN | PageReadModel.SYS-007.fields["SYS-007-F-002"] | qn.platform_mapping_rule（V014 候选；平台/类型/版本）〔PHYSICAL_OR_JOIN〕 | 按 platform_mapping_rule:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-007-F-003 | 外部值 / TABLE_COLUMN | PageReadModel.SYS-007.fields["SYS-007-F-003"] | qn.platform_mapping_rule（V014 候选；平台/类型/版本）〔PHYSICAL_OR_JOIN〕 | 按 platform_mapping_rule:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-007-F-004 | 状态 / TABLE_COLUMN | PageReadModel.SYS-007.fields["SYS-007-F-004"] | qn.platform_mapping_rule（V014 候选；平台/类型/版本）〔PHYSICAL_OR_JOIN〕 | 按 platform_mapping_rule:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-007-F-005 | 版本 / TABLE_COLUMN | PageReadModel.SYS-007.fields["SYS-007-F-005"] | qn.platform_mapping_rule（V014 候选；平台/类型/版本）〔PHYSICAL_OR_JOIN〕 | 按 platform_mapping_rule:NEW_DDL_REQUIRED 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-007-C-001 新增映射 | TASK_ACCEPT POST /mapping-rules | 仅本机主人 | 仅本机主人；目标平台已注册且规则类型、原码和目标值齐全；重复键返回已存在项或冲突。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；目标平台已注册且规则类型、原码和目标值齐全；重复键返回已存在项或冲突。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-002 查看 | NAS_READ GET /mapping-rules/{id} | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-003 确认 | TASK_ACCEPT PATCH /mapping-rules/{id} | 仅本机主人 | 仅本机主人；原码、目标平台、内部值、规则类型与版本唯一，歧义明确拒绝；确认只影响新投影，旧版本留痕。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；原码、目标平台、内部值、规则类型与版本唯一，歧义明确拒绝；确认只影响新投影，旧版本留痕。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-004 上一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-005 1 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-006 2 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-007 下一页 | UI_LOCAL   | 列表已加载且目标页存在 | 列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；列表已加载且目标页存在；首页/末页禁越界；仅改变 QueryContext。；只改变本页页号，保留筛选与排序；服务端重新取数。；更新当前列表页号，保留筛选排序；末页禁止下一页；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-008 TAB 类目 | UI_LOCAL   | 保留当前对象/筛选上下文 | 保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-009 TAB 属性 | UI_LOCAL   | 保留当前对象/筛选上下文 | 保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-010 TAB SKU | UI_LOCAL   | 保留当前对象/筛选上下文 | 保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-007-C-011 TAB 承运商 | UI_LOCAL   | 保留当前对象/筛选上下文 | 保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；保留当前对象/筛选上下文；切换视图后取对应 ReadModel；只切换当前表单分区，不保存或丢弃草稿。；切换局部区域并显示当前选中态，不修改业务对象；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-007-C-001-P, T-C-SYS-007-C-002-P, T-C-SYS-007-C-003-P, T-C-SYS-007-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

34  SYS-008  AI配置

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/ai-settings；关联需求 REQ-AI-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/ai-settings。ReadModel：GET /ui/readmodels/SYS-008；响应字段键固定为 PageReadModel.SYS-008.fields[FieldID]。

业务流程：配置本地或外部 AI 通道、预算、超时与白名单；外部默认关闭，图片单独开关；CLEAN/INSPECT 必须可用，连接测试不等于业务验收。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-008-F-001 | Provider / Provider / string | PageReadModel.SYS-008.fields["SYS-008-F-001"] | ai_policy.mode〔PHYSICAL_OR_JOIN〕 | 按 ai_policy.mode 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-002 | 模型 / 模型 / string | PageReadModel.SYS-008.fields["SYS-008-F-002"] | derived(ai_policy provider ref):candidate〔COMPUTED〕 | 按 derived(ai_policy provider ref):candidate 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。外部字段/派生语义：待真实样本验证；该值不得单独解锁外部写入。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-003 | API Secret / API Secret / string | PageReadModel.SYS-008.fields["SYS-008-F-003"] | ai_policy.provider_secret_ref masked〔PHYSICAL_OR_JOIN〕 | 按 ai_policy.provider_secret_ref masked 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-004 | 每日预算 / 每日预算 / money | PageReadModel.SYS-008.fields["SYS-008-F-004"] | ai_policy.daily_budget〔PHYSICAL_OR_JOIN〕 | 按 ai_policy.daily_budget 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-005 | AI CLEAN / AI CLEAN / bool | PageReadModel.SYS-008.fields["SYS-008-F-005"] | derived(ai_policy.mode != DISABLED)〔COMPUTED〕 | 按 derived(ai_policy.mode != DISABLED) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-006 | 规则引擎 / 规则引擎 / bool | PageReadModel.SYS-008.fields["SYS-008-F-006"] | derived(ai_review rule evaluation)〔COMPUTED〕 | 按 derived(ai_review rule evaluation) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-007 | 语义检测 / 语义检测 / bool | PageReadModel.SYS-008.fields["SYS-008-F-007"] | derived(ai_policy.mode != DISABLED)〔COMPUTED〕 | 按 derived(ai_policy.mode != DISABLED) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-F-008 | BLOCK策略 / BLOCK策略 / object | PageReadModel.SYS-008.fields["SYS-008-F-008"] | derived(ai_review.rule_findings_json)〔COMPUTED〕 | 按 derived(ai_review.rule_findings_json) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-X-F-001 | 通道类型、本地连接地址、外部提供方/模型代号、状态 / 通道类型、本地连接地址、外部提供方/模型代号、状态 | PageReadModel.SYS-008.fields["SYS-008-X-F-001"] | qn.ai_policy + qn.ai_review（现有物理源；连接测试运行态）〔COMPUTED〕 | 通道类型、本地连接地址、外部提供方/模型代号、状态；仅本机主人可见配置。 / object；本地推理地址仅由固定 Windows PC 当前用户会话的 Agent 访问，NAS 只保存路由和结果，不配置可直连 PC 的推理公网端口。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-X-F-002 | 外发字段白名单及商品图片单独开关。 / 外发字段白名单及商品图片单独开关。 / array | PageReadModel.SYS-008.fields["SYS-008-X-F-002"] | qn.ai_policy + qn.ai_review（现有物理源；连接测试运行态）〔COMPUTED〕 | 外发字段白名单及商品图片单独开关。 / array；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-008-X-F-003 | 预算、超时、最近连接测试、降级状态及配置版本。 / 预算、超时、最近连接测试、降级状态及配置版本。 / object | PageReadModel.SYS-008.fields["SYS-008-X-F-003"] | qn.ai_policy + qn.ai_review（现有物理源；连接测试运行态）〔COMPUTED〕 | 预算、超时、最近连接测试、降级状态及配置版本。 / object；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-008-C-001 测试连接 | TASK_ACCEPT POST /ai-settings/test | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；测试样例不得包含订单/买家/地址/凭据；外部未启用时不发送真实数据。 | SYS-008；展示最新 ReadModel、数量与时间；错误保留输入和上下文

SYS-008-C-002 保存配置 | NAS_WRITE PATCH /ai-settings | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；外部启用显式确认数据范围；禁用立即阻断后续外发；密钥单独安全引用。 | SYS-008；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步

SYS-008-X-C-001 测试连接：管理员、配置完整。 | TASK_ACCEPT POST /ai-settings/test | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅配置本人；测试样例不得包含订单/买家/地址/凭据；外部未启用时不发送真实数据。 | SYS-008；测试本地/外部通道可用性，不发送真实订单/买家资料。

SYS-008-X-C-002 保存并启用外部通道：管理员显式确认数据范围。 | NAS_WRITE PATCH /ai-settings | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 仅本机主人或明确获得此项设置授权者；平台能力可用、配置值合法。仅配置本人，外发白名单/图片开关显式确认；若改变业务决定，要求本次明确确认。 | SYS-008；配置版本审计，禁用后零外发

正向断言：T-C-SYS-008-C-001-P, T-C-SYS-008-C-002-P, T-C-SYS-008-X-C-001-P, T-C-SYS-008-X-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

35  SYS-009  任务与执行

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/tasks-settings；关联需求 REQ-OPS-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/tasks-settings。ReadModel：GET /ui/readmodels/SYS-009；响应字段键固定为 PageReadModel.SYS-009.fields[FieldID]。

业务流程：配置重试与并发不允许改变 UNKNOWN 外部写先对账原则；策略版本对新任务生效。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-009-F-001 | 单PC浏览器并发 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-001"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-002 | 同Profile并发 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-002"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-003 | 任务超时 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-003"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-004 | 写结果未知 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-004"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-005 | 店铺订单 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-005"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-006 | 供应商物流 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-006"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-007 | 商城物流回填 / FORM_FIELD | PageReadModel.SYS-009.fields["SYS-009-F-007"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-008 | 读取失败 / STATUS_CHECK | PageReadModel.SYS-009.fields["SYS-009-F-008"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-009 | 登录失效 / STATUS_CHECK | PageReadModel.SYS-009.fields["SYS-009-F-009"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-010 | 验证码/风控 / STATUS_CHECK | PageReadModel.SYS-009.fields["SYS-009-F-010"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-011 | 身份不一致 / STATUS_CHECK | PageReadModel.SYS-009.fields["SYS-009-F-011"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-009-F-012 | 页面未知版本 / STATUS_CHECK | PageReadModel.SYS-009.fields["SYS-009-F-012"] | qn.task_policy + qn.sync_schedule（V014 候选；任务策略/最近状态）〔COMPUTED〕 | 显示检查状态、原因与最近观察时间；BLOCK/WARN/INFO 与外部能力状态区分；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-009-C-001 保存策略 | TASK_ACCEPT PATCH /task-policies | 仅本机主人 | 仅本机主人；并发/超时/重试值有效且版本匹配；只影响新任务，UNKNOWN 外部写仍必须先对账。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；并发/超时/重试值有效且版本匹配；只影响新任务，UNKNOWN 外部写仍必须先对账。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；先校验、提交并防重复；成功刷新对象和关联待办，冲突/超时保留原值并显示下一步；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-009-C-001-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

36  SYS-010  安全与审计

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/security；关联需求 REQ-SEC-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/security。ReadModel：GET /ui/readmodels/SYS-010；响应字段键固定为 PageReadModel.SYS-010.fields[FieldID]。

业务流程：审计按时间、对象、用户检索，导出需独立权限；人类角色仅本机主人/操作员。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-010-F-001 | 时间 / TABLE_COLUMN | PageReadModel.SYS-010.fields["SYS-010-F-001"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 按 qn.audit_event / derived(permission and device credential policy) 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-002 | 操作者/设备 / TABLE_COLUMN | PageReadModel.SYS-010.fields["SYS-010-F-002"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 按 qn.audit_event / derived(permission and device credential policy) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-003 | 动作 / TABLE_COLUMN | PageReadModel.SYS-010.fields["SYS-010-F-003"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 按 qn.audit_event / derived(permission and device credential policy) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-004 | 业务对象 / TABLE_COLUMN | PageReadModel.SYS-010.fields["SYS-010-F-004"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 按 qn.audit_event / derived(permission and device credential policy) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-005 | 结果 / TABLE_COLUMN | PageReadModel.SYS-010.fields["SYS-010-F-005"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 按 qn.audit_event / derived(permission and device credential policy) 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-006 | 高风险写操作 / METRIC | PageReadModel.SYS-010.fields["SYS-010-F-006"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-007 | 敏感日志 / METRIC | PageReadModel.SYS-010.fields["SYS-010-F-007"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-010-F-008 | 设备凭据 / METRIC | PageReadModel.SYS-010.fields["SYS-010-F-008"] | qn.audit_event / derived(permission and device credential policy)；GET /audit-events + GET /secret-health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-010-C-001 导出审计记录 | TASK_ACCEPT POST /audit-events/export | 仅本机主人或具独立审计导出权限的操作员 | 仅本机主人或具独立审计导出权限的操作员；时间、当前本人可操作的店铺范围、动作范围有效；输出脱敏并写审计。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人或具独立审计导出权限的操作员；时间、当前本人可操作的店铺范围、动作范围有效；输出脱敏并写审计。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-010-C-001-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

37  SYS-011  系统诊断

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/diagnostics；关联需求 REQ-OPS-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/diagnostics。ReadModel：GET /ui/readmodels/SYS-011；响应字段键固定为 PageReadModel.SYS-011.fields[FieldID]。

业务流程：区分 Server/Worker/UTP/平台登录诊断；导出脱敏包不得包含 Cookie、密码或完整 Token。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-011-F-001 | Server / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-001"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-002 | 数据库 / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-002"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-003 | 存储 / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-003"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-004 | UTP / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-004"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-005 | 设备健康状态 / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-005"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-006 | Browser Worker / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-006"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-007 | 小红书Profile / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-007"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-008 | 微信小店Profile / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-008"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-011-F-009 | AI Service / METRIC | PageReadModel.SYS-011.fields["SYS-011-F-009"] | derived(Server, DB, UTP, Worker and AI health probes):实时健康探针：数据库 SELECT 1、PC 最近 45 秒心跳、UTP/本地 AI 探测；分别报告，不合并为成功；GET /health〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-011-C-001 刷新诊断 | NAS_READ GET /health | 只读探针且目标服务可达 | 只读探针且目标服务可达；分组件显示成功/失败和观察时间，不把一次健康检查当业务能力通过。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；只读探针且目标服务可达；分组件显示成功/失败和观察时间，不把一次健康检查当业务能力通过。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-011-C-002 打开PC登录中心 | TASK_ACCEPT POST /browser-profiles/{id}/open-login-context | 绑定当前失效账号和 Profile | 绑定当前失效账号和 Profile；仅打开正确平台登录中心，不代替用户处理验证码。；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PC-003；绑定当前失效账号和 Profile；仅打开正确平台登录中心，不代替用户处理验证码。；PC-003 登录中心（绑定当前平台账号和 Profile）；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-011-C-003 导出脱敏诊断包 | TASK_ACCEPT POST /diagnostics/export | 仅本机主人或具诊断导出权限 | 仅本机主人或具诊断导出权限；扫描包中 Cookie、密码、Token、买家资料后脱敏，不包含浏览器 Profile 原目录。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人或具诊断导出权限；扫描包中 Cookie、密码、Token、买家资料后脱敏，不包含浏览器 Profile 原目录。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-011-C-001-P, T-C-SYS-011-C-002-P, T-C-SYS-011-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

38  SYS-012  备份与维护

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：系统设置；路由 #/maintenance；关联需求 REQ-OPS-001/REQ-STO-001；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 管理员进入配置页；只读诊断可按明确授权开放给操作员。账号/设备/店铺绑定须在 Server 再验。。作用域：本人会话＋对象版本；系统配置限本机主人。路由：#/maintenance。ReadModel：GET /ui/readmodels/SYS-012；响应字段键固定为 PageReadModel.SYS-012.fields[FieldID]。

业务流程：备份数据库、媒体、配置并验证恢复，PC Cookie 不在普通 Server 备份范围。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SYS-012-F-001 | 数据库 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-001"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-002 | 商品媒体 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-002"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-003 | 系统配置 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-003"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-004 | BrowserProfile / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-004"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-005 | Server / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-005"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-006 | PC最低版本 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-006"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-007 | 协议 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-007"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-008 | 恢复演练 / FORM_FIELD | PageReadModel.SYS-012.fields["SYS-012-F-008"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-009 | 最近数据库备份 / METRIC | PageReadModel.SYS-012.fields["SYS-012-F-009"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-010 | 媒体增量备份 / METRIC | PageReadModel.SYS-012.fields["SYS-012-F-010"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SYS-012-F-011 | 最近恢复验证 / METRIC | PageReadModel.SYS-012.fields["SYS-012-F-011"] | qn.backup_record + qn.restore_verification（V014 候选；备份与演练）〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SYS-012-C-001 立即备份 | TASK_ACCEPT POST /backups | 仅本机主人 | 仅本机主人；存储路径/空间/加密引用/备份范围有效；数据库、媒体、配置的版本一致性记录，PC Cookie 不打包。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；存储路径/空间/加密引用/备份范围有效；数据库、媒体、配置的版本一致性记录，PC Cookie 不打包。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

SYS-012-C-002 验证最近备份可恢复 | TASK_ACCEPT POST /backups/{id}/verify | 仅本机主人 | 仅本机主人；最近备份存在且校验和可读；在隔离位置做恢复演练，不覆盖当前生产数据。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅本机主人；最近备份存在且校验和可读；在隔离位置做恢复演练，不覆盖当前生产数据。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-SYS-012-C-001-P, T-C-SYS-012-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

39  FIN-001  经营核算总览

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：核算；路由 #/finance；关联需求 BR-FIN-001~003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：本轮新增，待项目负责人按业务、设计、实现和测试四个视角核验。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；凭证调整另需动作权限和有效版本。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/finance。ReadModel：GET /ui/readmodels/FIN-001；响应字段键固定为 PageReadModel.FIN-001.fields[FieldID]。

业务流程：只汇总同期间、同店、同规则版本且状态可比的有效快照；待补、估算、待分配分列，不把未知计为零或已确认净利。

查询语义：期间、店铺、核算状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

FIN-001-F-001 | 期间 / 期间 | PageReadModel.FIN-001.query["FIN-001-F-001"] | 必有起止时间且起点早于终点，按 Asia/Shanghai 展示、API 使用带偏移时间；后端使用起点含、终点不含的范围。

FIN-001-F-002 | 店铺 / 店铺 | PageReadModel.FIN-001.query["FIN-001-F-002"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

FIN-001-F-003 | 核算状态 / 核算状态 | PageReadModel.FIN-001.query["FIN-001-F-003"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

FIN-001-F-004 | 已归属销售收入 / 已归属销售收入 / money | PageReadModel.FIN-001.fields["FIN-001-F-004"] | derived(sum(profit_snapshot.sales_amount))〔COMPUTED〕 | 按 derived(sum(profit_snapshot.sales_amount)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-005 | 已归属商品毛利 / 已归属商品毛利 / money | PageReadModel.FIN-001.fields["FIN-001-F-005"] | derived(sum(profit_snapshot.attributed_gross_profit))〔COMPUTED〕 | 按 derived(sum(profit_snapshot.attributed_gross_profit)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-006 | 待分配费用 / 待分配费用 / money | PageReadModel.FIN-001.fields["FIN-001-F-006"] | derived(finance_entry balance category=FEE)〔COMPUTED〕 | 按 derived(finance_entry balance category=FEE) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-007 | 待分配退款 / 待分配退款 / money | PageReadModel.FIN-001.fields["FIN-001-F-007"] | derived(finance_entry balance category=REFUND)〔COMPUTED〕 | 按 derived(finance_entry balance category=REFUND) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-008 | 订单号 / 订单号 / string | PageReadModel.FIN-001.fields["FIN-001-F-008"] | sales_order.external_order_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.external_order_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-009 | 店铺 / 店铺 / uuid | PageReadModel.FIN-001.fields["FIN-001-F-009"] | sales_order.store_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order.store_id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-010 | 订单项数 / 订单项数 / int | PageReadModel.FIN-001.fields["FIN-001-F-010"] | derived(count(sales_order_item))〔COMPUTED〕 | 按 derived(count(sales_order_item)) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-011 | 已归属金额 / 已归属金额 / money | PageReadModel.FIN-001.fields["FIN-001-F-011"] | derived(sum(finance_allocation amount signed))〔COMPUTED〕 | 按 derived(sum(finance_allocation amount signed)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-012 | 待补项数（金额未知） / 待补项数（金额未知） / int | PageReadModel.FIN-001.fields["FIN-001-F-012"] | derived(count(finance_entry state=PENDING))〔COMPUTED〕 | 按 derived(count(finance_entry state=PENDING)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-013 | 待分配金额 / 待分配金额 / money | PageReadModel.FIN-001.fields["FIN-001-F-013"] | derived(finance_entry amount - sum(active allocations))〔COMPUTED〕 | 按 derived(finance_entry amount - sum(active allocations)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-001-F-014 | 核算版本与状态 / 核算版本与状态 / object | PageReadModel.FIN-001.fields["FIN-001-F-014"] | profit_snapshot.version,calculation_state〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.version,calculation_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

FIN-001-C-001 查询 | NAS_READ GET /finance/summary | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 输入合法且账号/能力满足该项只读动作；加载、空、失败有明确反馈；缺失对象 ID 不启用。 | FIN-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-001-C-002 重置 | UI_LOCAL   | 本页筛选区显示；重置值与默认值相同时可禁用。 | 可进入本页且筛选区已初始化。 | FIN-001；清空筛选至页面默认值、页码置 1，再读列表；请求失败保留上次行集并显示错误。

FIN-001-C-003 查看订单项 | NAS_READ GET /finance/order-items/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | FIN-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-001-C-004 查看待处理 | NAS_READ GET /finance/pending | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | FIN-001；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-001-C-005 导出汇总 | TASK_ACCEPT POST /finance/exports | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同店授权导出，敏感字段脱敏；只生成文件，不改核算凭证。 | FIN-001；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-FIN-001-C-001-P, T-C-FIN-001-C-002-P, T-C-FIN-001-C-003-P, T-C-FIN-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

40  FIN-002  订单项核算明细

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：核算；路由 #/finance/items/{orderItemId}；关联需求 BR-FIN-001~003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：本轮新增，待项目负责人按业务、设计、实现和测试四个视角核验。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；凭证调整另需动作权限和有效版本。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/finance/items/{orderItemId}。ReadModel：GET /ui/readmodels/FIN-002；响应字段键固定为 PageReadModel.FIN-002.fields[FieldID]。

业务流程：以 SalesOrderItem 为核算单位，逐笔金额反查原始凭证、分配和快照；重算产生新快照，历史不可覆盖。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

FIN-002-F-001 | 销售订单项与商品SKU / 销售订单项与商品SKU / object | PageReadModel.FIN-002.fields["FIN-002-F-001"] | sales_order_item.id,mapped_product_sku_id〔PHYSICAL_OR_JOIN〕 | 按 sales_order_item.id,mapped_product_sku_id 取得；仅在本页已核对的对象/店铺范围内展示。保留明细归属与单位；缺失或身份不唯一时标待核，不以列表位置充当外部身份。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-002 | 销售商品金额 / 销售商品金额 / money | PageReadModel.FIN-002.fields["FIN-002-F-002"] | profit_snapshot.sales_amount〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.sales_amount 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-003 | 优惠分摊 / 优惠分摊 / money | PageReadModel.FIN-002.fields["FIN-002-F-003"] | profit_snapshot.discount_amount〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.discount_amount 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-004 | 确认退款 / 确认退款 / money | PageReadModel.FIN-002.fields["FIN-002-F-004"] | profit_snapshot.refund_amount〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.refund_amount 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-005 | 采购商品成本 / 采购商品成本 / money | PageReadModel.FIN-002.fields["FIN-002-F-005"] | profit_snapshot.purchase_cost〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.purchase_cost 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-006 | 采购运费 / 采购运费 / money | PageReadModel.FIN-002.fields["FIN-002-F-006"] | profit_snapshot.purchase_freight〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.purchase_freight 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-007 | 平台费用 / 平台费用 / money | PageReadModel.FIN-002.fields["FIN-002-F-007"] | profit_snapshot.platform_fee〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.platform_fee 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-008 | 履约费用 / 履约费用 / money | PageReadModel.FIN-002.fields["FIN-002-F-008"] | profit_snapshot.fulfillment_fee〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.fulfillment_fee 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-009 | 人工调整 / 人工调整 / money | PageReadModel.FIN-002.fields["FIN-002-F-009"] | derived(finance_allocation MANUAL)〔COMPUTED〕 | 按 derived(finance_allocation MANUAL) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-010 | 已归属毛利 / 已归属毛利 / money | PageReadModel.FIN-002.fields["FIN-002-F-010"] | profit_snapshot.attributed_gross_profit〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.attributed_gross_profit 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-011 | 经营净利状态 / 经营净利状态 / enum | PageReadModel.FIN-002.fields["FIN-002-F-011"] | profit_snapshot.calculation_state〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.calculation_state 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-012 | 凭证来源与观察时间 / 凭证来源与观察时间 / array | PageReadModel.FIN-002.fields["FIN-002-F-012"] | finance_entry.evidence_ref,observed_at〔PHYSICAL_OR_JOIN〕 | 按 finance_entry.evidence_ref,observed_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-002-F-013 | ProfitSnapshot版本 / ProfitSnapshot版本 / int | PageReadModel.FIN-002.fields["FIN-002-F-013"] | profit_snapshot.version〔PHYSICAL_OR_JOIN〕 | 按 profit_snapshot.version 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

FIN-002-C-001 返回总览 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | FIN-001；打开 FIN-001；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

FIN-002-C-002 查看原始凭证 | NAS_READ GET /finance/entries/{id} | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | FIN-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-002-C-003 查看历史版本 | NAS_READ GET /finance/order-items/{id}/snapshots | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | FIN-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-002-C-004 进入待补或分配 | NAS_READ GET /finance/pending | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 当前对象、权限和业务状态有效；响应与错误写入页面反馈和任务证据；缺失对象 ID 不启用。 | FIN-002；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

正向断言：T-C-FIN-002-C-001-P, T-C-FIN-002-C-002-P, T-C-FIN-002-C-003-P, T-C-FIN-002-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

41  FIN-003  待补与待分配处理

端：NAS。波次：XHS 首链／微信与快手分平台／京东后续。样本：INTERNAL_TEST_PENDING。入口和准入：入口：核算；路由 #/finance/pending；关联需求 BR-FIN-001~003；适用权限：管理员或获授权的操作员；限 当前本人可操作的店铺范围。来源：本轮新增，待项目负责人按业务、设计、实现和测试四个视角核验。 管理员或获授权操作员，限制 当前本人可操作的店铺范围；凭证调整另需动作权限和有效版本。。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：#/finance/pending。ReadModel：GET /ui/readmodels/FIN-003；响应字段键固定为 PageReadModel.FIN-003.fields[FieldID]。

业务流程：管理员或获授权操作员补凭证、手工分配整单费用/退款或冲正；金额、归属、币种和余额守恒通过后保存，保留历史。

查询语义：店铺、凭证类型、待补/估算/待分配状态；同类多选内部 OR、不同条件 AND；外部 ID 精确匹配，关键词包含匹配；查询重置页码到 1，清空筛选回默认列表。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

FIN-003-F-001 | 店铺 / 店铺 | PageReadModel.FIN-003.query["FIN-003-F-001"] | 空值仅表示当前授权店铺集合；选值传内部 StoreID，服务端拒绝不在 当前本人可操作的店铺范围 内的店铺。

FIN-003-F-002 | 凭证类型 / 凭证类型 | PageReadModel.FIN-003.query["FIN-003-F-002"] | 查询输入映射 request.category（enum）；空值为不限/沿用当前上下文，值的枚举或范围若无已审定来源须标“待验证”，服务端拒绝越权值。

FIN-003-F-003 | 待补/估算/待分配状态 / 待补/估算/待分配状态 | PageReadModel.FIN-003.query["FIN-003-F-003"] | 空值为全部授权状态；选择项使用系统状态码精确匹配，保留平台原码且未知码展示“待映射”。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

FIN-003-F-004 | 原始凭证与金额 / 原始凭证与金额 / object | PageReadModel.FIN-003.fields["FIN-003-F-004"] | finance_entry.evidence_ref,amount〔PHYSICAL_OR_JOIN〕 | 按 finance_entry.evidence_ref,amount 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-005 | 已归属金额 / 已归属金额 / money | PageReadModel.FIN-003.fields["FIN-003-F-005"] | derived(sum(finance_allocation ALLOCATE - REVERSE))〔COMPUTED〕 | 按 derived(sum(finance_allocation ALLOCATE - REVERSE)) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-006 | 待分配余额 / 待分配余额 / money | PageReadModel.FIN-003.fields["FIN-003-F-006"] | derived(finance_entry.amount - attributedAmount)〔COMPUTED〕 | 按 derived(finance_entry.amount - attributedAmount) 取得；仅在本页已核对的对象/店铺范围内展示。显示金额、币种与来源时间；NULL 为待补，估算显式标记，不以 0 表示未知；不同口径不相加。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-007 | 目标销售订单项 / 目标销售订单项 / uuid | PageReadModel.FIN-003.fields["FIN-003-F-007"] | request.salesOrderItemId〔REQUEST〕 | 必选：目标项必须属于该凭证的同店同订单，服务端复核 当前本人可操作的店铺范围、订单关系和项有效状态；不匹配时 422，不保存。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-008 | 本次分配金额 / 本次分配金额 / money | PageReadModel.FIN-003.fields["FIN-003-F-008"] | request.amount〔REQUEST〕 | 必填 Decimal，金额>0 且≤当前未分配余额，币种与原凭证一致；本次版本与余额服务端原子重验，超出时 409/422。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-009 | 分配依据 / 分配依据 / string | PageReadModel.FIN-003.fields["FIN-003-F-009"] | request.evidence〔REQUEST〕 | 必填可追溯依据引用或说明；不接受空白；保留来源，不记录收件人/凭据原文。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-010 | 备注 / 备注 / string | PageReadModel.FIN-003.fields["FIN-003-F-010"] | request.note〔REQUEST〕 | 可选；前后空白去除，不允许包含账号凭据和买家敏感资料；长度上限须在请求 DTO 中审定。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

FIN-003-F-011 | 历史分配与冲正 / 历史分配与冲正 / array | PageReadModel.FIN-003.fields["FIN-003-F-011"] | finance_allocation.id,direction,reversal_of_id〔PHYSICAL_OR_JOIN〕 | 按 finance_allocation.id,direction,reversal_of_id 取得；仅在本页已核对的对象/店铺范围内展示。按关联对象展开或汇总，NULL 与空集合分别呈现，不复制其他店铺明细。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

FIN-003-C-001 查询 | NAS_READ GET /finance/pending | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 输入合法且账号/能力满足该项只读动作；加载、空、失败有明确反馈；缺失对象 ID 不启用。 | FIN-003；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-003-C-002 录入缺失凭证 | NAS_WRITE POST /finance/entries | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 管理员或授权操作员；凭证追加不可覆写；无来源金额不确认；整单费用/退款待分配。 | FIN-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

FIN-003-C-003 保存手工分配 | NAS_WRITE POST /finance/allocations | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同店同订单项＋金额>0＋余额足够＋凭证版本一致 | FIN-003；追加分配，新建 ProfitSnapshot

FIN-003-C-004 冲正分配 | NAS_WRITE POST /finance/allocations/{id}/reverse | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 原分配有效且尚未冲正＋版本一致 | FIN-003；追加冲正，新建 ProfitSnapshot

FIN-003-C-005 查看核算重算结果 | NAS_READ GET /finance/order-items/{id}/snapshots | 对象可见且有查看权限时显示；未选定唯一对象时禁用。 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；缺失对象 ID 不启用。 | FIN-003；仅以成功回读替换当前对象/详情；失败保留上次值并显示观察时间。

FIN-003-C-006 导出待办 | TASK_ACCEPT POST /finance/exports | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 同店授权导出，敏感字段脱敏；只生成文件，不改核算凭证。 | FIN-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-FIN-003-C-001-P, T-C-FIN-003-C-002-P, T-C-FIN-003-C-003-P, T-C-FIN-003-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

42  SRC-006  1688 链接批量导入

端：NAS。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 SRC-001 进入，已选 1688 sourceAccountId；无 productId。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：/source/import。ReadModel：GET /ui/readmodels/SRC-006；响应字段键固定为 PageReadModel.SRC-006.fields[FieldID]。

业务流程：输入 1–50 条 URL → 规范化/去重 → 只读解析 → 独立逐条结果 → 可选择加入候选；不执行采购或平台写。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

SRC-006-Q-001 | 来源账号 / uuid | PageReadModel.SRC-006.query["SRC-006-Q-001"] | 必须 1688 SOURCE 且已绑定 PC Profile

SRC-006-Q-002 | 输入方式 / enum | PageReadModel.SRC-006.query["SRC-006-Q-002"] | SHOP_URL／PRODUCT_URLS；与关键词互斥

SRC-006-Q-003 | 批次状态 / enum | PageReadModel.SRC-006.query["SRC-006-Q-003"] | 可选 ALL／PENDING／FAILED／SUCCEEDED

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

SRC-006-F-001 | 输入序号 / integer | PageReadModel.SRC-006.fields["SRC-006-F-001"] | source_input_item.ordinal〔PHYSICAL_OR_JOIN〕 | 按输入保序；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-002 | 原始链接 / string(2048) | PageReadModel.SRC-006.fields["SRC-006-F-002"] | source_input_item.raw_url〔PHYSICAL_OR_JOIN〕 | 仅本人可见；显示截断但原文可复制；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-003 | 规范化链接 / string(2048) | PageReadModel.SRC-006.fields["SRC-006-F-003"] | source_input_item.normalized_url〔PHYSICAL_OR_JOIN〕 | 只接受 https 和 1688 allowlist；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-004 | 1688 商品 ID / string(128)? | PageReadModel.SRC-006.fields["SRC-006-F-004"] | source_input_item.external_product_id〔PHYSICAL_OR_JOIN〕 | 未解析标待验证；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-005 | 处理状态 / enum | PageReadModel.SRC-006.fields["SRC-006-F-005"] | source_input_item.state〔PHYSICAL_OR_JOIN〕 | 逐条独立；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-006 | 错误码 / string(64)? | PageReadModel.SRC-006.fields["SRC-006-F-006"] | source_input_item.error_code〔PHYSICAL_OR_JOIN〕 | 显示中文反显；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

SRC-006-F-007 | 来源观察时间 / datetime? | PageReadModel.SRC-006.fields["SRC-006-F-007"] | source_input_item.observed_at〔PHYSICAL_OR_JOIN〕 | 未观察不显示伪时间；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

SRC-006-C-001 解析预览 | NAS_WRITE POST /source-input-batches/preview | 已输入 1–50 个 URL | 域名/长度/格式校验通过 | SRC-006；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

SRC-006-C-002 提交只读采集 | TASK_ACCEPT POST /source-input-batches | 预览成功且有账号 | 去重后至少 1 个有效商品或店铺链接 | SRC-003；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

SRC-006-C-003 重试失败项 | TASK_ACCEPT POST /source-input-batches/{id}/retry-failed | 仅失败项存在 | 同一批次版本和账号仍有效 | SRC-003；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

SRC-006-C-004 打开候选 | NAS_READ GET /source-candidates/{id} | 有唯一候选内部 ID | 账号一致 | SRC-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-SRC-006-C-001-P, T-SRC-006-C-002-P, T-SRC-006-C-003-P, T-SRC-006-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

43  MED-001  媒体入库

端：NAS。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 PRD-002 进入，productId/sourceSnapshotId/version 有效。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：/products/{productId}/media。ReadModel：GET /ui/readmodels/MED-001；响应字段键固定为 PageReadModel.MED-001.fields[FieldID]。

业务流程：来源图下载或本地上传 → 内容校验与隔离 → 原件哈希与快照落库 → 质量评估 → 选择商品图或包装图。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

MED-001-Q-001 | 商品版本 / integer | PageReadModel.MED-001.query["MED-001-Q-001"] | 只读版本；写操作需 expectedVersion

MED-001-Q-002 | 媒体角色 / enum | PageReadModel.MED-001.query["MED-001-Q-002"] | MAIN/DETAIL/SKU/OTHER

MED-001-Q-003 | 状态 / enum | PageReadModel.MED-001.query["MED-001-Q-003"] | PENDING/AVAILABLE/FAILED/QUARANTINED

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

MED-001-F-001 | 原图预览 / asset | PageReadModel.MED-001.fields["MED-001-F-001"] | media_asset.storage_key〔PHYSICAL_OR_JOIN〕 | 仅经鉴权下载；不存在显示待补；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-002 | 角色 / enum | PageReadModel.MED-001.fields["MED-001-F-002"] | media_asset.role〔PHYSICAL_OR_JOIN〕 | 主图每快照唯一；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-003 | 图片类别 / enum | PageReadModel.MED-001.fields["MED-001-F-003"] | media_asset.asset_kind〔PHYSICAL_OR_JOIN〕 | PRODUCT/PACKAGING；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-004 | 原始尺寸 / dimensions? | PageReadModel.MED-001.fields["MED-001-F-004"] | media_asset.width,height〔PHYSICAL_OR_JOIN〕 | 不足平台要求标提示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-005 | 格式及大小 / mime/bytes | PageReadModel.MED-001.fields["MED-001-F-005"] | media_asset.mime_type,byte_length〔PHYSICAL_OR_JOIN〕 | 限制由平台能力版本决定；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-006 | 原图哈希 / char(64) | PageReadModel.MED-001.fields["MED-001-F-006"] | media_asset.original_sha256〔PHYSICAL_OR_JOIN〕 | 来源原件不可改；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-007 | 授权状态 / enum | PageReadModel.MED-001.fields["MED-001-F-007"] | media_asset.usage_right〔PHYSICAL_OR_JOIN〕 | 未确认不上传平台；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-008 | 来源快照 / uuid | PageReadModel.MED-001.fields["MED-001-F-008"] | media_asset.snapshot_id〔PHYSICAL_OR_JOIN〕 | 可深链；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-001-F-009 | 入库状态 / enum | PageReadModel.MED-001.fields["MED-001-F-009"] | media_asset.state〔PHYSICAL_OR_JOIN〕 | 下载失败可重试但原件不可覆盖；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

MED-001-C-001 下载原图 | TASK_ACCEPT POST /products/{id}/media-imports | 来源图片 URL 和快照存在 | URL 安全/文件许可/来源账号已验证 | MED-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-001-C-002 上传本地图 | NAS_WRITE POST /products/{id}/media-uploads | 操作者本地文件已选 | 文件嗅探/大小/像素/恶意内容校验 | MED-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-001-C-003 设角色 | NAS_WRITE PATCH /media-assets/{id}/role | 原图 AVAILABLE | 包装图只能 OTHER，主图唯一 | MED-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-001-C-004 图片工坊 | NAS_READ GET /media-assets/{id}/studio | assetKind=PRODUCT | 授权确认 | MED-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-001-C-005 包装扫描 | NAS_READ GET /media-assets/{id}/ocr | assetKind=PACKAGING | 原件 AVAILABLE | PKG-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-MED-001-C-001-P, T-MED-001-C-002-P, T-MED-001-C-003-P, T-MED-001-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

44  MED-002  图片工坊

端：NAS。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 MED-001 非包装图进入，原件 AVAILABLE。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：/media-assets/{id}/studio。ReadModel：GET /ui/readmodels/MED-002；响应字段键固定为 PageReadModel.MED-002.fields[FieldID]。

业务流程：原件 → 可复现处理链或 AI 候选 → 前后对照 → 人工采纳并产生新的商品媒体选择版本；包装图始终不得进入。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

MED-002-Q-001 | 审核状态 / enum | PageReadModel.MED-002.query["MED-002-Q-001"] | DRAFT/ACCEPTED/REJECTED

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

MED-002-F-001 | 原图哈希 / char(64) | PageReadModel.MED-002.fields["MED-002-F-001"] | media_asset.original_sha256〔PHYSICAL_OR_JOIN〕 | 原件始终可见且不可被替换；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-002 | 原图尺寸 / dimensions | PageReadModel.MED-002.fields["MED-002-F-002"] | media_asset.width,height〔PHYSICAL_OR_JOIN〕 | 不足清晰度显示警告；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-003 | 派生图 / asset | PageReadModel.MED-002.fields["MED-002-F-003"] | media_derivative.storage_key〔PHYSICAL_OR_JOIN〕 | 与原图并排对比；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-004 | 操作链 / json | PageReadModel.MED-002.fields["MED-002-F-004"] | media_derivative.operation_json〔PHYSICAL_OR_JOIN〕 | 裁切/旋转/调色/锐化/生成有序记录；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-005 | 模型版本 / string? | PageReadModel.MED-002.fields["MED-002-F-005"] | media_derivative.model_version〔PHYSICAL_OR_JOIN〕 | AI 生成必须留模型版本；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-006 | 质量判断 / enum | PageReadModel.MED-002.fields["MED-002-F-006"] | media_derivative.quality_state〔PHYSICAL_OR_JOIN〕 | 放大尺寸不等于原图清晰；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

MED-002-F-007 | 采纳记录 / audit | PageReadModel.MED-002.fields["MED-002-F-007"] | media_derivative.review_state,field_provenance〔PHYSICAL_OR_JOIN〕 | 仅人工采纳可投影；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

MED-002-C-001 确定性处理 | NAS_WRITE POST /media-assets/{id}/derivatives | 非包装图 | operation 在白名单且原件授权 | MED-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-002-C-002 AI 候选 | TASK_ACCEPT POST /media-assets/{id}/ai-derivatives | 非包装图且本地模型可用 | 策略允许且仅作为候选 | MED-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-002-C-003 采纳派生 | NAS_WRITE POST /media-derivatives/{id}/decision | 派生质量检查已完成 | expectedVersion 一致，人工接受 | PRD-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

MED-002-C-004 返回原图 | NAS_READ GET /media-assets/{id} | 原件仍可访问 | 无写 | MED-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-MED-002-C-001-P, T-MED-002-C-002-P, T-MED-002-C-003-P, T-MED-002-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

45  PKG-001  包装图扫描与回填

端：NAS。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 MED-001 包装图进入，assetKind=PACKAGING。作用域：1688 来源账号＋来源快照／商品；包装图单独只读 OCR。路由：/media-assets/{id}/package-ocr。ReadModel：GET /ui/readmodels/PKG-001；响应字段键固定为 PageReadModel.PKG-001.fields[FieldID]。

业务流程：包装原件只读 OCR → 文本框与候选结构化 → 冲突/低置信提示 → 本人逐项采纳/拒绝 → 回填商品新版本。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

PKG-001-Q-001 | 识别批次 / uuid | PageReadModel.PKG-001.query["PKG-001-Q-001"] | 最新优先但保留历史

PKG-001-Q-002 | 置信度下限 / decimal | PageReadModel.PKG-001.query["PKG-001-Q-002"] | 仅筛选，不改变原识别证据

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PKG-001-F-001 | 包装原图 / asset | PageReadModel.PKG-001.fields["PKG-001-F-001"] | media_asset.storage_key〔PHYSICAL_OR_JOIN〕 | 只读定位；禁止派生；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-002 | OCR 原文 / text | PageReadModel.PKG-001.fields["PKG-001-F-002"] | ocr_candidate.raw_text〔PHYSICAL_OR_JOIN〕 | 不得用模型推断填原文；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-003 | 文本框坐标 / json | PageReadModel.PKG-001.fields["PKG-001-F-003"] | ocr_candidate.bbox_json〔PHYSICAL_OR_JOIN〕 | 点击框在原图定位；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-004 | 字段候选 / canonical key | PageReadModel.PKG-001.fields["PKG-001-F-004"] | ocr_candidate.field_key〔PHYSICAL_OR_JOIN〕 | 品牌/规格/材质等候选；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-005 | 标准值 / text? | PageReadModel.PKG-001.fields["PKG-001-F-005"] | ocr_candidate.normalized_value〔PHYSICAL_OR_JOIN〕 | 无证据保持待补；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-006 | 置信度 / numeric(5,4) | PageReadModel.PKG-001.fields["PKG-001-F-006"] | ocr_candidate.confidence〔PHYSICAL_OR_JOIN〕 | 阈值只是提示，不自动采纳；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-007 | 冲突 / enum | PageReadModel.PKG-001.fields["PKG-001-F-007"] | ocr_candidate.conflict_state〔PHYSICAL_OR_JOIN〕 | 与已有商品信息冲突需手工核对；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PKG-001-F-008 | 人工决定 / enum | PageReadModel.PKG-001.fields["PKG-001-F-008"] | ocr_candidate.decision〔PHYSICAL_OR_JOIN〕 | ACCEPT/REJECT/PENDING；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PKG-001-C-001 启动识别 | TASK_ACCEPT POST /media-assets/{id}/ocr-runs | 包装原件 AVAILABLE | 本地 OCR 健康且人为启动 | PKG-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PKG-001-C-002 定位原文 | NAS_READ GET /ocr-candidates/{id}/evidence | 候选绑定原件 | 仅本人可见 | PKG-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PKG-001-C-003 采纳字段 | NAS_WRITE POST /ocr-candidates/{id}/decision | 有 OCR 文本框证据 | 人工确认且版本一致；新商品版本 | PRD-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PKG-001-C-004 拒绝字段 | NAS_WRITE POST /ocr-candidates/{id}/decision | 候选 PENDING | 记理由，原商品不变 | PKG-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-PKG-001-C-001-P, T-PKG-001-C-002-P, T-PKG-001-C-003-P, T-PKG-001-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

46  CAT-001  青鸟类目与平台映射

端：NAS。波次：首链设计，代码待开发。样本：INTERNAL_TEST_PENDING。入口和准入：从 PRD-002/PRD-005 进入，目标店铺明确。作用域：本人会话＋对象版本；系统配置限本机主人。路由：/categories。ReadModel：GET /ui/readmodels/CAT-001；响应字段键固定为 PageReadModel.CAT-001.fields[FieldID]。

业务流程：青鸟规范类目树 → AI 候选 → 本人选择 → 目标平台叶子类目/必填属性检查 → 冻结映射版本。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

CAT-001-Q-001 | 关键词 / string | PageReadModel.CAT-001.query["CAT-001-Q-001"] | 匹配中文名称/编码

CAT-001-Q-002 | 平台 / enum | PageReadModel.CAT-001.query["CAT-001-Q-002"] | 仅已配置目标店铺平台

CAT-001-Q-003 | 状态 / enum | PageReadModel.CAT-001.query["CAT-001-Q-003"] | VALID/PENDING/EXPIRED

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

CAT-001-F-001 | 青鸟类目编码 / string(64) | PageReadModel.CAT-001.fields["CAT-001-F-001"] | category_node.code〔PHYSICAL_OR_JOIN〕 | 同一版本唯一；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-002 | 中文名称 / string(200) | PageReadModel.CAT-001.fields["CAT-001-F-002"] | category_node.name_zh〔PHYSICAL_OR_JOIN〕 | 码值中文反显；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-003 | 父类目 / uuid? | PageReadModel.CAT-001.fields["CAT-001-F-003"] | category_node.parent_id〔PHYSICAL_OR_JOIN〕 | 树无环；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-004 | 店铺叶子类目 / string(128) | PageReadModel.CAT-001.fields["CAT-001-F-004"] | platform_category_map.external_category_id〔PHYSICAL_OR_JOIN〕 | 按平台/映射版本；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-005 | 必填属性 / json | PageReadModel.CAT-001.fields["CAT-001-F-005"] | platform_category_map.required_attrs_json〔PHYSICAL_OR_JOIN〕 | 未知不能草稿；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-006 | 映射状态 / enum | PageReadModel.CAT-001.fields["CAT-001-F-006"] | platform_category_map.state〔PHYSICAL_OR_JOIN〕 | 失效转 NEEDS_REVIEW；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

CAT-001-F-007 | 规则版本 / integer | PageReadModel.CAT-001.fields["CAT-001-F-007"] | platform_category_map.version〔PHYSICAL_OR_JOIN〕 | 上架任务冻结该版；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

CAT-001-C-001 AI 推荐 | NAS_WRITE POST /products/{id}/category-suggestions | 商品版本可读 | AI 建议带来源和置信度 | CAT-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

CAT-001-C-002 选规范类目 | NAS_WRITE POST /products/{id}/category-decisions | 有效叶子类目 | 人工采纳新版本 | PRD-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

CAT-001-C-003 保存平台映射 | NAS_WRITE POST /category-mappings | 目标店铺/类目存在 | 平台必填/规则版本已校验 | PRD-005；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

CAT-001-C-004 重验 | TASK_ACCEPT POST /category-mappings/{id}/revalidate | 映射已存在 | 登录平台后只读验证 | CAT-001；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-CAT-001-C-001-P, T-CAT-001-C-002-P, T-CAT-001-C-003-P, T-CAT-001-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

47  STORE-004  刊登预览与人工发布

端：NAS。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 STORE-002 已保存草稿进入，店铺账号/版本确认。作用域：本人会话＋店铺＋平台账号＋内部对象身份；外部身份只作观察值。路由：/channel-projections/{id}/preview。ReadModel：GET /ui/readmodels/STORE-004；响应字段键固定为 PageReadModel.STORE-004.fields[FieldID]。

业务流程：版本化渠道投影 → 媒体上传与店铺草稿 → 同账号只读回读 → 页面最终预览 → 本人确认发布 → 再回读证实外部身份。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

STORE-004-Q-001 | 店铺 / uuid | PageReadModel.STORE-004.query["STORE-004-Q-001"] | 仅已绑定店铺

STORE-004-Q-002 | 草稿状态 / enum | PageReadModel.STORE-004.query["STORE-004-Q-002"] | DRAFT/UNKNOWN/PUBLISHED_VERIFIED

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

STORE-004-F-001 | 最终标题 / string | PageReadModel.STORE-004.fields["STORE-004-F-001"] | channel_projection.payload_json.title〔PHYSICAL_OR_JOIN〕 | 与商品版本及映射版本对比；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-002 | 最终文案 / text | PageReadModel.STORE-004.fields["STORE-004-F-002"] | channel_projection.payload_json.description〔PHYSICAL_OR_JOIN〕 | AI 候选采纳后才出现；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-003 | 规格价格库存 / json | PageReadModel.STORE-004.fields["STORE-004-F-003"] | channel_projection.payload_json.skus〔PHYSICAL_OR_JOIN〕 | SKU 和价格均需确认；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-004 | 目标叶子类目 / string | PageReadModel.STORE-004.fields["STORE-004-F-004"] | platform_category_map.external_category_id〔PHYSICAL_OR_JOIN〕 | 映射版本可追溯；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-005 | 图片顺序 / uuid | PageReadModel.STORE-004.fields["STORE-004-F-005"] | channel_projection_media〔PHYSICAL_OR_JOIN〕 | 上传回执唯一；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-006 | 授权与质量 / enum | PageReadModel.STORE-004.fields["STORE-004-F-006"] | media_asset.usage_right,media_derivative.quality_state〔PHYSICAL_OR_JOIN〕 | 缺失阻断；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-007 | 草稿回读 / external identity | PageReadModel.STORE-004.fields["STORE-004-F-007"] | channel_projection.external_product_id〔PHYSICAL_OR_JOIN〕 | 未回读不得已同步；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

STORE-004-F-008 | 差异与缺项 / json | PageReadModel.STORE-004.fields["STORE-004-F-008"] | projection_diff_readmodel〔PHYSICAL_OR_JOIN〕 | 任何 BLOCK 禁发布；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

STORE-004-C-001 保存店铺草稿 | EXTERNAL_WRITE POST /channel-projections/{id}/draft-sync | 账号和媒体就绪 | 映射/属性/预览版本一致；先生成一次性确认 | STORE-003；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

STORE-004-C-002 只读草稿回读 | TASK_ACCEPT POST /channel-projections/{id}/readback | 草稿存在或 UNKNOWN | 同账号同店铺只读核对 | STORE-004；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

STORE-004-C-003 本人确认发布 | EXTERNAL_WRITE POST /channel-projections/{id}/publish | 草稿已证实 | 人工确认 previewHash；UNKNOWN 锁未开 | STORE-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

STORE-004-C-004 查看平台 | NAS_READ GET /channel-projections/{id}/external-link | 外部商品 ID 已证实 | 仅打开目标平台 | STORE-004；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-STORE-004-C-001-P, T-STORE-004-C-002-P, T-STORE-004-C-003-P, T-STORE-004-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

48  PC-001  首次配对

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/pair；关联需求 待映射；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/pair。ReadModel：GET /ui/readmodels/PC-001；响应字段键固定为 PageReadModel.PC-001.fields[FieldID]。

业务流程：配对只接受有效一次性码和指定 Server，重复或过期明确报错；设备凭据与用户凭据隔离。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-001-F-001 | 服务端地址 / FORM_FIELD | PageReadModel.PC-001.fields["PC-001-F-001"] | request.pairingContext / Worker pairing API:qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /server/handshake〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-001-F-002 | 设备名称 / FORM_FIELD | PageReadModel.PC-001.fields["PC-001-F-002"] | request.pairingContext / Worker pairing API:qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /server/handshake〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-001-F-003 | 一次性配对码 / FORM_FIELD | PageReadModel.PC-001.fields["PC-001-F-003"] | request.pairingContext / Worker pairing API:qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /server/handshake〔COMPUTED〕 | 载入版本；校验必填、字段类型和敏感项；未保存不改变原值。长度/枚举需与本页 DTO 一起定稿。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-001-C-001 测试连接 | NAS_READ GET /server/handshake | 只读握手且 Server 地址格式有效 | 只读握手且 Server 地址格式有效；失败不发送配对码或设备凭据。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；只读握手且 Server 地址格式有效；失败不发送配对码或设备凭据。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-001-C-002 连接并配对 | TASK_ACCEPT POST /workers/pair | Server 地址握手通过，设备名称有效，一次性配对码未用且未过期 | Server 地址握手通过，设备名称有效，一次性配对码未用且未过期；重复/过期/错 Server 明确拒绝。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；Server 地址握手通过，设备名称有效，一次性配对码未用且未过期；重复/过期/错 Server 明确拒绝。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-PC-001-C-001-P, T-C-PC-001-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

49  PC-002  设备首页

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/home；关联需求 待映射；适用权限：已配对的 PC 设备及当前用户。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/home。ReadModel：GET /ui/readmodels/PC-002；响应字段键固定为 PageReadModel.PC-002.fields[FieldID]。

业务流程：展示设备、任务和登录健康，跳转保持对应任务和 Profile 上下文。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-002-F-001 | Server连接 / METRIC | PageReadModel.PC-002.fields["PC-002-F-001"] | derived(Worker heartbeat, qn.browser_profile, qn.business_task):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/self/context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-002-F-002 | Browser Profiles / METRIC | PageReadModel.PC-002.fields["PC-002-F-002"] | derived(Worker heartbeat, qn.browser_profile, qn.business_task):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/self/context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-002-F-003 | 当前任务 / METRIC | PageReadModel.PC-002.fields["PC-002-F-003"] | derived(Worker heartbeat, qn.browser_profile, qn.business_task):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/self/context〔COMPUTED〕 | 同口径聚合；显示单位、数据时间和状态；缺凭证不得显示已确认金额；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-002-C-001 打开登录中心 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PC-003；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；PC-003 登录中心（绑定当前平台账号和 Profile）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-002-C-002 查看任务 | UI_LOCAL   | 对象 ID 与店铺范围有效 | 对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；对象 ID 与店铺范围有效；导航携带上下文，不从页面样例文本推断真实 ID；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-PC-002-C-001-P, T-C-PC-002-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

50  PC-003  登录中心

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/login；关联需求 待映射；适用权限：已配对的 PC 设备及当前用户。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/login。ReadModel：GET /ui/readmodels/PC-003；响应字段键固定为 PageReadModel.PC-003.fields[FieldID]。

业务流程：Worker 在 Server 签发的账号、平台、Endpoint、Profile 上打开登录；用户处理验证码/风控，完成后由 Worker 重新观察身份。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-003-F-001 | 对象 / 对象 / string | PageReadModel.PC-003.fields["PC-003-F-001"] | platform_account.account_label〔PHYSICAL_OR_JOIN〕 | 按 platform_account.account_label 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-003-F-002 | Profile / Profile / uuid | PageReadModel.PC-003.fields["PC-003-F-002"] | browser_profile.id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-003-F-003 | 登录状态 / 登录状态 / enum | PageReadModel.PC-003.fields["PC-003-F-003"] | browser_profile.auth_state〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.auth_state 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-003-F-004 | 最近验证 / 最近验证 / time | PageReadModel.PC-003.fields["PC-003-F-004"] | browser_profile.last_verified_at〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.last_verified_at 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-003-C-001 打开浏览器 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PC-003；打开 PC-003；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PC-003-C-002 重新验证 | TASK_ACCEPT POST /worker/browser-profiles/{id}/login-check | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | Worker 只读验证外部账号身份并回传 Server，不能只靠用户点击完成。 | PC-003；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PC-003-C-003 打开登录 | TASK_ACCEPT POST /worker/browser-profiles/{id}/open-login-context | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | PC 本地受控打开登录，账号/Profile/Worker 绑定，风控人工。 | 本页；展示最新 ReadModel、数量与时间；错误保留输入和上下文

正向断言：T-C-PC-003-C-001-P, T-C-PC-003-C-002-P, T-C-PC-003-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

51  PC-004  人工接管

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/takeover；关联需求 待映射；适用权限：已配对的 PC 设备及当前用户。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/takeover。ReadModel：GET /ui/readmodels/PC-004；响应字段键固定为 PageReadModel.PC-004.fields[FieldID]。

业务流程：锁定原任务、平台、账号、Profile 和挑战 ID；人工处理后点击继续只触发重新验证，身份一致才恢复任务。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 输入非法不发请求；同一筛选内多选 OR、不同筛选 AND，越权店铺在 Server 拒绝。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-004-F-001 | 业务任务 / 业务任务 / uuid | PageReadModel.PC-004.fields["PC-004-F-001"] | business_task.id〔PHYSICAL_OR_JOIN〕 | 按 business_task.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-004-F-002 | 平台 / 平台 / string | PageReadModel.PC-004.fields["PC-004-F-002"] | platform_account.platform_code〔PHYSICAL_OR_JOIN〕 | 按 platform_account.platform_code 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-004-F-003 | Profile / Profile / uuid | PageReadModel.PC-004.fields["PC-004-F-003"] | browser_profile.id〔PHYSICAL_OR_JOIN〕 | 按 browser_profile.id 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-004-F-004 | 原因 / 原因 / string | PageReadModel.PC-004.fields["PC-004-F-004"] | derived(business_task.result_json.reason)〔COMPUTED〕 | 按 derived(business_task.result_json.reason) 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-004-C-001 打开浏览器 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PC-004；打开 PC-004；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

PC-004-C-002 验证完成，继续 | TASK_ACCEPT POST /worker/verification-challenges/{id}/resolved | 动作适用且有许可时显示；前置项未满足时保留可见但禁用并列出缺项；涉及隐私或管理配置时无权限者隐藏。 | 点击完成后仍要只读确认平台身份；错账号保持 NEEDS_HUMAN。 | PC-004；展示最新 ReadModel、数量与时间；错误保留输入和上下文

PC-004-C-003 返回任务监控 | UI_LOCAL   | 只有对应行/状态提供该操作时显示；缺失内部对象 ID 时禁用并提示原因。 | 当前对象及来源页有效，目标对象属于 当前本人可操作的店铺范围；目标页准入再次校验。 | PC-005；打开 PC-005；带内部对象 ID、来源页面与 QueryContext；返回恢复筛选、排序、页码；失败留在来源页。

正向断言：T-C-PC-004-C-001-P, T-C-PC-004-C-002-P, T-C-PC-004-C-003-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

52  PC-005  任务监控

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/tasks；关联需求 待映射；适用权限：已配对的 PC 设备及当前用户。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/tasks。ReadModel：GET /ui/readmodels/PC-005；响应字段键固定为 PageReadModel.PC-005.fields[FieldID]。

业务流程：任务与证据对应 Attempt；写超时显示停止后对账，不提供无条件再次执行。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-005-F-001 | 任务 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-001"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-002 | 平台/Profile / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-002"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-003 | 阶段 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-003"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-004 | 状态 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-004"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-005 | 时间 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-005"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。保存带偏移时间，界面按 Asia/Shanghai 展示；缺失不以采集时间或更新时间代替。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-006 | 动作 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-006"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-007 | 结果 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-007"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。显示内部状态并保留平台原码/观察时间；原码未知或映射版本不明时标待映射，不推断下一动作可用。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-005-F-008 | 说明 / TABLE_COLUMN | PageReadModel.PC-005.fields["PC-005-F-008"] | qn.worker_attempt_observation + qn.worker_evidence_record（V014 候选；任务尝试与脱敏证据聚合）〔COMPUTED〕 | 按 derived(qn.business_task and Attempt/Evidence ledger):NEW_ATTEMPT_DTO 取得；仅在本页已核对的对象/店铺范围内展示。空值显示“未获取/待补”，保留上次成功观察时间；不得显示旧样例作为当前值。；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-005-C-001 查看浏览器 | UI_LOCAL   | 当前 Attempt 属于本设备与授权任务 | 当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；打开签发的正确平台、账号和 Profile；失败留原页及恢复入口；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-005-C-002 停止后对账 | UI_LOCAL   | 任务为 RUNNING/UNKNOWN 且属于本设备 | 任务为 RUNNING/UNKNOWN 且属于本设备；先停止后按业务意图只读回查，绝不盲重发外部写。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；任务为 RUNNING/UNKNOWN 且属于本设备；先停止后按业务意图只读回查，绝不盲重发外部写。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-005-C-003 人工接管 | UI_LOCAL   | 挑战或登录/风控等待人工，任务、账号、Profile 与挑战 ID 一致。 | 挑战或登录/风控等待人工，任务、账号、Profile 与挑战 ID 一致。；PC-004 人工接管（绑定当前任务与挑战）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | PC-004；挑战或登录/风控等待人工，任务、账号、Profile 与挑战 ID 一致。；PC-004 人工接管（绑定当前任务与挑战）；跳转或切换视图，保留来源对象与返回路径；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-005-C-004 查看Evidence | UI_LOCAL   | 当前 Attempt 属于本设备与授权任务 | 当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-005-C-005 查看 | UI_LOCAL   | 当前 Attempt 属于本设备与授权任务 | 当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；当前 Attempt 属于本设备与授权任务；Evidence 脱敏且不可修改原始执行结论。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-005-C-006 再次读取 | UI_LOCAL   | 仅确定性只读失败可重试 | 仅确定性只读失败可重试；外部写 UNKNOWN 状态禁止执行该按钮。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；仅确定性只读失败可重试；外部写 UNKNOWN 状态禁止执行该按钮。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-PC-005-C-001-P, T-C-PC-005-C-002-P, T-C-PC-005-C-003-P, T-C-PC-005-C-004-P 等，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

53  PC-006  连接与设置

端：PC。波次：跨端基础／各平台独立验收。样本：POST_DEV_SIT_PENDING。入口和准入：入口：PC 客户端；路由 #/settings；关联需求 待映射；适用权限：管理员。来源：V4.0 CANDIDATE 原型＋FRZ04 字段/控件矩阵；业务修订待评审。 已配对且有效的 Worker 设备上下文；人类敏感动作仍要求 Server 授权。。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：#/settings。ReadModel：GET /ui/readmodels/PC-006；响应字段键固定为 PageReadModel.PC-006.fields[FieldID]。

业务流程：连接和重配对经设备身份校验，未结写任务先停止和对账。 页面读取保持当前对象/设备/店铺上下文，业务操作按下表逐项执行；返回保留原页及筛选。

查询语义：本页无独立查询条件；由上页对象 ID、店铺和版本上下文加载，不凭可见文字猜测对象。 本地列表默认每页 20 条，可选 50/100，稳定排序；外部或设备状态只展示最近观察时间。

本页无独立查询项；从上页对象 ID、店铺、版本加载，来源查询上下文返回后恢复。

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-006-F-001 | Server / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-001"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-002 | 设备ID / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-002"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-003 | 连接 / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-003"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-004 | 最近心跳 / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-004"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-005 | PC UI / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-005"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-006 | Worker.Service / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-006"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-007 | Browser.Worker / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-007"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-008 | Chrome / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-008"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-006-F-009 | 协议版本 / DETAIL_FIELD | PageReadModel.PC-006.fields["PC-006-F-009"] | derived(Worker registry and handshake):qn.worker_device.last_seen_at＋qn.worker_device_profile＋qn.browser_profile_binding；当前登录会话与最近心跳窗口 45 秒；GET /worker/protocol-info + GET /worker/components〔COMPUTED〕 | 只读详情由当前对象身份读取；保留来源与时间，缺失显式展示；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-006-C-001 测试连接 | NAS_READ GET /server/handshake | 页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效 | 页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效；写操作另需版本、动作权限和可执行状态，精确枚举待机器契约审定。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；页面/当前对象访问权、设备或 当前本人可操作的店铺范围 归属有效；写操作另需版本、动作权限和可执行状态，精确枚举待机器契约审定。；只读读取该 URL 所指当前对象；服务端返回后更新本页或打开该对象详情。；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

PC-006-C-002 重新配对 | TASK_ACCEPT POST /workers/pair | 当前设备凭据和管理员授权均有效 | 当前设备凭据和管理员授权均有效；未结外部写任务先停止/对账，再废止旧凭据与配对。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账 | 本页；当前设备凭据和管理员授权均有效；未结外部写任务先停止/对账，再废止旧凭据与配对。；当前页本地视图；若为跨页入口，目标 PageID 尚须按该控件设计审定；按操作结果刷新本页 ReadModel 和观察时间；写操作不以 toast 作为成功证据。；服务端重验身份/版本/权限；401/403/409/422 解释并保留上下文，外部写 UNKNOWN 先对账

正向断言：T-C-PC-006-C-001-P, T-C-PC-006-C-002-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

54  PC-007  账号档案与登录核验

端：PC。波次：首链设计，代码待开发。样本：POST_DEV_SIT_PENDING。入口和准入：从 PC-002 或 PC-006 进入，固定设备已配对。作用域：固定设备＋账号＋独立 Profile；PC 本地目录仅在本机解析。路由：/pc/profiles。ReadModel：GET /ui/readmodels/PC-007；响应字段键固定为 PageReadModel.PC-007.fields[FieldID]。

业务流程：NAS 绑定账号/设备/Profile → PC 仅按别名启动对应档案 → 用户登录/风控处理 → PC 只读核验卖家身份 → NAS 更新 VERIFIED 状态。

查询语义：按已校验范围查询；稳定排序，默认每页 20 条；缺值明确显示待补／待验证。

查询项与准入

FieldID | 查询项/类型 | 入参/来源 | 查询/空值规则

PC-007-Q-001 | 平台 / enum | PageReadModel.PC-007.query["PC-007-Q-001"] | 1688/XHS/WX/KS/JD 按启用能力

PC-007-Q-002 | 账号 / uuid | PageReadModel.PC-007.query["PC-007-Q-002"] | 只展示此固定设备绑定账号

列表列与详情字段

FieldID | 字段/类型 | DTO 与 ReadModel | 数据库/计算/观察源 | 展示与缺值条件

PC-007-F-001 | 账号标签 / string | PageReadModel.PC-007.fields["PC-007-F-001"] | platform_account.account_label〔PHYSICAL_OR_JOIN〕 | 标签不等于平台身份；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-007-F-002 | Profile 别名 / string | PageReadModel.PC-007.fields["PC-007-F-002"] | browser_profile.profile_ref〔PHYSICAL_OR_JOIN〕 | 同一设备唯一目录别名；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-007-F-003 | 设备绑定 / uuid | PageReadModel.PC-007.fields["PC-007-F-003"] | worker_device_profile.device_id〔PHYSICAL_OR_JOIN〕 | NAS 回读绑定；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-007-F-004 | 会话状态 / enum | PageReadModel.PC-007.fields["PC-007-F-004"] | browser_profile.auth_state〔PHYSICAL_OR_JOIN〕 | 不能从目录存在推断已登录；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-007-F-005 | 卖家身份指纹 / hash? | PageReadModel.PC-007.fields["PC-007-F-005"] | browser_profile_binding.identity_fingerprint〔PHYSICAL_OR_JOIN〕 | 只存脱敏指纹；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

PC-007-F-006 | 最近核验 / datetime? | PageReadModel.PC-007.fields["PC-007-F-006"] | browser_profile.last_verified_at〔PHYSICAL_OR_JOIN〕 | 过期转待登录；平台未观察或尚无样本为 null，配合 valueState=MISSING/UNVERIFIED；不得写 0、空串或已通过

按钮、门禁与跳转

ControlID/动作 | 位置与 API | 显示条件 | 启用/服务端门禁 | 跳转与异常恢复

PC-007-C-001 选择档案 | UI_LOCAL POST /pc/profile-selection | 单一档案行 | 不更改 NAS 绑定 | PC-003；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PC-007-C-002 打开登录 | UI_LOCAL POST /pc/profiles/{id}/open-login | 有目录别名 | 使用独立持久 Profile，不共享全局目录 | PC-003；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PC-007-C-003 核验身份 | TASK_ACCEPT POST /worker/browser-profiles/{id}/login-check | 浏览器可见且用户已登录 | 卖家身份与平台账号一致再报 NAS | PC-007；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

PC-007-C-004 回 NAS 配置 | NAS_READ GET /accounts/{id} | NAS 可达 | 不暴露浏览器原始会话 | SYS-002；成功重读当前对象及目标页；输入校验失败保留表单；外部写 UNKNOWN 锁定并仅同账号只读回读。

正向断言：T-PC-007-C-001-P, T-PC-007-C-002-P, T-PC-007-C-003-P, T-PC-007-C-004-P，合法对象回读同一内部 ID 和版本。反向断言：跨账号/错店铺 403，旧版本 409，缺字段 422，需登录 428，外部 UNKNOWN 423；失败保留页面和观察时间。外部真实样本状态不得从本地演示推导。

基础配置流程本次修订

V9.1.2-W8R2B-C1。本章为现行配置规则，替换旧配置表单、接口和登录状态手工编辑描述；其余业务要求、版本和编号保留。

REQ-C1-001 统一入口与我的店铺

统一入口包含货源平台资料、我的货源账号、店铺平台资料、店铺账号、我的店铺五个页签。业务页面按平台和店铺筛选，京东不再单独作为一级履约菜单。

页面 SYS-001 SYS-002 STORE-001

REQ-C1-002 平台资料新增和编辑

填写平台标识、名称、用途、官网、登录网址及接入方式。创建后标识和用途固定。网址必须使用 HTTPS，不能带密码、令牌或片段。

页面 SYS-001

REQ-C1-003 平台可以扩展

新增平台只登记资料、账号及身份关系，enabled=false。登记不代表采集、建单、发布、物流或售后适配已实现。“拼多多批发”仅是举例，本轮没有增加该平台适配器。

页面 SYS-001

REQ-C1-004 账号新增和编辑

填写所属平台、本人识别用备注、登录方式、平台账号编号。所属平台创建后固定；选择网页手工登录、扫码或网页密码登录。身份编号可在登录后核对。

页面 SYS-002

REQ-C1-005 密码留在固定 PC

密码、扫码、验证码、Cookie 和登录存储只在固定 PC 的平台浏览器处理。NAS 和原型没有密码输入及存储字段；原型只保存演示资料。

页面 PC-003

REQ-C1-006 独立档案和固定设备

每个账号创建独立浏览器档案，再配对固定 PC。PC 配置档案编号与独立目录。登录前停止 Agent，避免同时占用同一档案。

页面 SYS-003 PC-003

REQ-C1-007 本人确认登录身份

NAS 发起登录请求，冻结平台、账号、店铺版本和设备、档案。PC 打开指定 HTTPS 登录网页，本人在平台登录并观察可见账号及店铺编号，回传本机证据编号。NAS 本人再次核对编号并勾选确认后，才更新身份状态。

页面 SYS-002 STORE-001 PC-003

REQ-C1-008 店铺新增编辑和绑定

填写店铺名称、销售平台、绑定账号及店铺外部编号。绑定账号必须来自同一销售平台。改绑或改外部编号后待重新核对；有历史订单或活跃任务及 UNKNOWN 锁时禁止改绑。

页面 STORE-001

REQ-C1-009 保存后回读完整字段

新增编辑保存后读取同一记录、实际版本和全部可编辑字段。回读失败或内容不一致不得显示保存核验成功，保留输入和原幂等键供核查。

页面 SYS-001 SYS-002 STORE-001

REQ-C1-010 重复配置与幂等

同用途平台名称、同平台账号备注、店铺名称和外部身份不得重复。重复配置返回 409；相同幂等键同一内容回放结果，改变内容阻断。

页面 全部配置页

REQ-C1-011 旧版本提交阻断

编辑和登录请求使用 expectedVersion。旧版本返回 412 VERSION_STALE，表单保留输入，不能自动覆盖新资料。取消编辑仅关闭表单，不提交数据。

页面 全部配置页

REQ-C1-012 登录过期处理

登录请求有效期 15 分钟；本人确认结果 30 分钟。到期后标记过期并阻断使用，不自动解除 UNKNOWN 锁。原来未登记 C1 有效期的 VERIFIED 账号保持旧授权规则，不伪造本轮确认时间。

页面 SYS-002 STORE-001 PC-003

REQ-C1-013 错账号店铺及设备阻断

观察身份与原绑定不一致记为 MISMATCH，不能确认；撤销设备、错档案、版本变化及超时请求不得回传或确认。平台页面身份解析本轮为人工观察，真实平台样本验收留待统一 SIT。

页面 SYS-002 STORE-001 PC-003

REQ-C1-014 原业务与锁保护

保留已验证的商品、草稿、订单、采购、物流、售后和费用功能。配置更新不能删除历史订单、采购关联、任务和外部写入锁。纯 API 只登记接入方式；平台专有授权扩展仍须各自开发与验收。

页面 全部配置页

REQ-C1-015 修正接口映射

旧原型将保存绑定到 GET、取消绑定到 POST 的映射纠正为当前 configuration POST 或 PATCH；取消编辑使用 NONE。所有旧 FieldID 与 ButtonID 保留，历史映射保存到 configurationRevision。

页面 PLT-010 PLT-014 ACC-018 ACC-022 STR-026

REQ-C1-016 原型和实际界面一致

原型与实际 NAS 共用 configuration-ui.js 和当前接口合同。原型模拟 PC 及设备，必须标注演示；新增配置在浏览器回读，不连接真实 NAS 或平台。61 个逻辑页面与 181 个设计场景继续保留。

页面 配置页

接口与数据库

本轮增加 12 条 configuration 接口和 V037 迁移。字段与数据库列逐项对照在 configuration-contract.json，正反向测试在源码 test 目录。取消编辑不提交请求；旧版本冲突 412。

V001–V036 原文不变。V037 新增平台显示资料、账号登录方式、唯一索引、登录请求、确认有效期和配置变更记录。现库升级须备份，重名或重复身份导致整笔回滚，不删除历史业务数据。

验收范围

本地功能、界面交互、HTTP 与原型回归按随包日志核验。原型为本浏览器模拟；真实平台登录及身份样本、目标 PostgreSQL、Windows 安装运行仍待统一 SIT。其余业务页面逐页收口继续推进，不能把本轮配置流程完成解释为整个 W8R2B 已完成。