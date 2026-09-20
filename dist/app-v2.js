(() => {
  'use strict';

  const requirements = window.QN_REQUIREMENTS;
  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');
  const loading = document.getElementById('loading');

  if (!requirements || !Array.isArray(requirements.pages) || !Array.isArray(requirements.pcPages)) {
    app.innerHTML = '<main class="empty-state"><strong>冻结需求台账未能载入</strong><span>请检查 data/requirements.js。</span></main>';
    loading?.classList.add('is-hidden');
    return;
  }

  const moduleMeta = {
    DASH: { label: '经营总览', icon: 'home', description: '经营指标、待办、异常与系统健康' },
    PLT: { label: '平台与路由', icon: 'layers', description: '货源/销售平台、API 与浏览器能力、版本和路由' },
    ACC: { label: '账号授权', icon: 'key', description: '账号、SecretRef、登录会话和健康状态' },
    STR: { label: '店铺管理', icon: 'store', description: '店铺、账号绑定、能力与数据范围' },
    SUP: { label: '供应商', icon: 'users', description: '供应商、来源商品与采购历史' },
    SRC: { label: '货源与采集', icon: 'search', description: '搜索探查、候选选择、正式采集与来源资产' },
    PRD: { label: '商品中心', icon: 'box', description: '落库商品、草稿编辑、版本、SKU、媒体与利润' },
    CHN: { label: '店铺草稿', icon: 'send', description: '渠道映射、店铺草稿、发布任务与回执对账' },
    ORD: { label: '订单中心', icon: 'receipt', description: '订单回流、幂等入库、SKU 匹配与履约跟踪' },
    PUR: { label: '采购中心', icon: 'basket', description: '采购建议、家庭成员确认与货源平台执行' },
    LOGI: { label: '物流中心', icon: 'truck', description: '货源物流回流、轨迹与店铺发货同步' },
    AS: { label: '售后中心', icon: 'rotate', description: '售后协查、人工决策、平台动作与财务关联' },
    FIN: { label: '财务与利润', icon: 'wallet', description: '收入、成本、费用、退款与可复算利润' },
    TSK: { label: '任务中心', icon: 'activity', description: '任务、租约、调度、日志、Evidence 与人工任务' },
    STD: { label: '标准数据', icon: 'tree', description: '标准分类、属性、码值和数据字典' },
    MED: { label: '媒体存储', icon: 'image', description: '媒体、存储策略、完整性、恢复与迁移' },
    SYS: { label: '系统管理', icon: 'settings', description: '成员、权限、安全、日志、备份与系统设置' },
    RTE: { label: '执行节点', icon: 'monitor', description: 'Worker、BrowserSession、RouteSnapshot 与适配器' }
  };

  const navGroups = [
    { label: '今日经营', modules: ['DASH'] },
    { label: '商品供给', modules: ['PLT', 'ACC', 'STR', 'SUP', 'SRC', 'PRD'] },
    { label: '销售履约', modules: ['CHN', 'ORD', 'PUR', 'LOGI', 'AS', 'FIN'] },
    { label: '运行支撑', modules: ['TSK', 'RTE', 'MED', 'STD', 'SYS'] }
  ];

  const roleInfo = {
    OWNER: { name: '家庭管理员', brief: '全量配置与最终确认', initial: '管' },
    OPS: { name: '运营成员', brief: '按业务域和店铺范围操作', initial: '运' },
    HUMAN: { name: '人工处理员', brief: '仅处理分配的登录与异常任务', initial: '人' },
    AUDITOR: { name: '审计查看员', brief: '按店铺范围只读查看', initial: '审' },
    PC_WORKER: { name: 'PC Worker', brief: '仅执行不可变 ExecutionContext', initial: 'W' }
  };

  const pageMap = new Map(requirements.pages.map(page => [page.id, page]));
  const pcPageMap = new Map(requirements.pcPages.map(page => [page.id, page]));
  const buttonMap = new Map();
  requirements.pages.forEach(page => page.buttons.forEach(button => buttonMap.set(button.ButtonID, { page, button })));

  const svgPaths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    key: '<circle cx="8" cy="15" r="5"/><path d="m12 11 8-8"/><path d="m17 6 2 2"/><path d="m15 8 2 2"/>',
    store: '<path d="M3 10h18"/><path d="M5 10v10h14V10"/><path d="M4 4h16l1 6H3l1-6Z"/><path d="M9 14h6v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    box: '<path d="m21 8-9 5-9-5 9-5 9 5Z"/><path d="m3 8 9 5 9-5v10l-9 5-9-5V8Z"/><path d="M12 13v10"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
    receipt: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    basket: '<path d="m5 10 2 10h10l2-10H5Z"/><path d="M9 10 12 3l3 7"/><path d="M3 10h18"/>',
    truck: '<path d="M3 6h11v11H3V6Z"/><path d="M14 10h4l3 3v4h-7v-7Z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
    rotate: '<path d="M3 12a9 9 0 0 1 15-6l3 3"/><path d="M21 3v6h-6"/><path d="M21 12a9 9 0 0 1-15 6l-3-3"/><path d="M3 21v-6h6"/>',
    wallet: '<path d="M3 6h16v14H3V6Z"/><path d="M3 8V5a2 2 0 0 1 2-2h12"/><path d="M15 11h6v5h-6a2.5 2.5 0 0 1 0-5Z"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    tree: '<path d="M12 3v6"/><path d="M5 21v-5h14v5"/><path d="M5 16v-4h14v4"/><path d="M12 9v3"/><rect x="9" y="2" width="6" height="4" rx="1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.18.36.42.7.6 1 .22.34.57.55 1 .6h.1v4H21a1.7 1.7 0 0 0-1.6.4Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 10h2l2-3 2 6 2-3h2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    trace: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7.7 7.1 3.2 8.2M16.3 7.1l-3.2 8.2M8 6h8"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 4v7h-7"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>'
  };

  const icon = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.box}</svg>`;
  const safe = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const nowText = () => new Date().toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' }).replaceAll('/', '-');
  const traceId = () => `tr_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-5)}`;

  const storeScopes = [
    { id: 'ALL', label: '全部店铺' },
    { id: 'STORE-XHS-001', label: '小红书 · 青鸟生活馆' },
    { id: 'STORE-WX-001', label: '微信小店 · 青鸟优选' }
  ];

  const contextPattern = /新增|编辑|详情|预览|差异|对比|确认|登录|失败|异常|冲突|回执|执行日志|关联|明细|上传\/恢复/;
  const entryOverrides = new Set(['DASH-002', 'DASH-003', 'ACC-019', 'ACC-023', 'SRC-049', 'CHN-073', 'AS-095', 'AS-144', 'TSK-145']);
  const isContextPage = page => contextPattern.test(page.name) && !entryOverrides.has(page.id);

  function inferKind(page) {
    if (page.id === 'DASH-001') return 'dashboard';
    if (page.layout.includes('分组表单')) return 'form';
    if (page.layout.includes('分组详情')) return 'detail';
    if (page.layout.includes('主预览区')) return 'preview';
    if (page.layout.includes('任务表格')) return 'task';
    if (/树/.test(page.name)) return 'tree';
    if (/矩阵/.test(page.name)) return 'matrix';
    if (/设置|参数/.test(page.name)) return 'settings';
    return 'list';
  }

  const pageSpecs = new Map(requirements.pages.map(page => {
    const query = page.fields.filter(field => field['角色'].includes('QUERY'));
    const content = page.fields.filter(field => !field['角色'].includes('QUERY'));
    return [page.id, {
      pageId: page.id,
      kind: inferKind(page),
      contextOnly: isContextPage(page),
      queryFieldIds: query.map(field => field.FieldID),
      contentFieldIds: (content.length ? content : page.fields).map(field => field.FieldID),
      sections: [`${page.businessObject}上下文`, `${page.name}主操作区`, '状态/异常与审计'],
      routeContract: ['TargetPageID', 'entityId', 'version', 'sourcePage', 'filters', 'page', 'size', 'sort', 'tab', 'storeScope'],
      specKey: `${page.id}:${page.businessObject}:${page.layout}`
    }];
  }));

  const productNames = ['亚麻通勤手提包', '轻量折叠收纳箱', '原木桌面置物架', '可水洗棉麻围裙', '旅行分装收纳袋', '桌面理线收纳盒', '轻便保温午餐包', '防滑浴室地垫', '折叠脏衣篮', '极简陶瓷马克杯', '多功能衣架套装', '便携化妆收纳包'];
  const suppliers = ['宁波青禾日用', '义乌简物供应', '广州轻织工坊'];
  const stores = ['STORE-XHS-001', 'STORE-WX-001'];

  const domain = {
    candidates: productNames.map((name, i) => ({
      __id: `SRC-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 1, __storeId: stores[i % 2], __state: i % 5 === 1 ? 'WARN' : 'READY',
      来源商品ID: `SRC-20260920-${String(i + 1).padStart(3, '0')}`, 外部商品ID: `1688-${883412790106 + i}`, 商品名称: name,
      '来源SKU ID': `SSKU-${String(3401 + i)}`, 平台ID: 'PLT-1688', 平台名称: '1688', 账号ID: 'ACC-SRC-001', 账号名称: '家庭采购账号',
      供应商ID: `SUP-${String((i % 3) + 1).padStart(3, '0')}`, 供应商名称: suppliers[i % 3], 采集任务ID: i < 3 ? `COL-20260920-00${i + 1}` : '—',
      完整度中文: i % 5 === 1 ? '有警告' : '完整', 采集结果中文: i < 3 ? '已生成候选' : '等待确认',
      来源URL: `https://detail.1688.example/offer/${883412790106 + i}.html`, 更新时间: `2026-09-20 ${String(14 - Math.floor(i / 2)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`
    })),
    products: productNames.map((name, i) => ({
      __id: `PRD-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 3, __storeId: stores[i % 2], __state: i % 4 === 0 ? 'DRAFT' : 'READY',
      商品ID: `PRD-20260920-${String(i + 1).padStart(3, '0')}`, 商品编码: `QN-${String(10001 + i)}`, 商品名称: name, 草稿ID: `DRAFT-${String(8801 + i)}`,
      当前版本ID: `PV-${String(i + 3).padStart(3, '0')}`, 商品状态中文: i % 4 === 0 ? '草稿' : '待发布', 品牌: '青鸟精选', 标准分类ID: `CAT-${String((i % 4) + 1).padStart(3, '0')}`,
      标准分类名称: ['箱包', '家居收纳', '桌面用品', '日用纺织'][i % 4], SKU数: String((i % 4) + 2), 媒体数: String((i % 5) + 5),
      来源商品ID: `SRC-20260920-${String(i + 1).padStart(3, '0')}`, 成本: (38 + i * 2.6).toFixed(2), 建议售价: (88 + i * 6.8).toFixed(2), 更新时间: `2026-09-20 ${String(15 - Math.floor(i / 3)).padStart(2, '0')}:20:00`
    })),
    channels: productNames.slice(0, 10).map((name, i) => ({
      __id: `CHP-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 2, __storeId: stores[i % 2], __state: i % 3 === 0 ? 'VALID' : 'DRAFT',
      渠道商品ID: `CHP-20260920-${String(i + 1).padStart(3, '0')}`, 商品ID: `PRD-20260920-${String(i + 1).padStart(3, '0')}`, 商品名称: name,
      商品版本ID: `PV-${String(i + 3).padStart(3, '0')}`, 平台ID: i % 2 ? 'PLT-WX' : 'PLT-XHS', 平台名称: i % 2 ? '微信小店' : '小红书',
      账号ID: i % 2 ? 'ACC-WX-001' : 'ACC-XHS-001', 账号名称: '家庭运营账号', 店铺ID: stores[i % 2], 店铺名称: i % 2 ? '青鸟优选' : '青鸟生活馆',
      映射版本ID: `MAP-v${i + 7}`, 渠道预览状态中文: i % 3 === 0 ? '有效' : '生成中', 发布状态中文: i % 3 === 0 ? '店铺草稿已同步' : '待同步', 更新时间: `2026-09-20 1${i % 6}:30:00`
    })),
    orders: productNames.slice(0, 11).map((name, i) => ({
      __id: `ORD-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 1, __storeId: stores[i % 2], __state: i % 4 === 3 ? 'EXCEPTION' : 'PAID',
      订单ID: `ORD-20260920-${String(i + 1).padStart(3, '0')}`, 外部订单号: `EXT-${202609200001 + i}`, 平台ID: i % 2 ? 'PLT-WX' : 'PLT-XHS', 平台名称: i % 2 ? '微信小店' : '小红书',
      店铺ID: stores[i % 2], 店铺名称: i % 2 ? '青鸟优选' : '青鸟生活馆', 订单状态中文: i % 4 === 3 ? '待人工处理' : '待采购', 支付状态中文: '已支付',
      发货状态中文: '待发货', 售后状态中文: '无售后', 同步状态中文: i % 4 === 3 ? '部分失败' : '已同步', 异常状态中文: i % 4 === 3 ? 'SKU 未匹配' : '正常',
      订单金额: (118 + i * 17.5).toFixed(2), 商品数量: String((i % 3) + 1), 下单时间: `2026-09-20 ${String(9 + (i % 6)).padStart(2, '0')}:12:00`, 支付时间: `2026-09-20 ${String(9 + (i % 6)).padStart(2, '0')}:14:00`, 最后同步时间: `2026-09-20 15:${String(i * 4).padStart(2, '0')}:00`
    })),
    purchases: productNames.slice(0, 9).map((name, i) => ({
      __id: `PUR-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 1, __storeId: stores[i % 2], __state: i % 4 === 2 ? 'PRICE_CHANGED' : 'WAIT_CONFIRM',
      采购单ID: `PUR-20260920-${String(i + 1).padStart(3, '0')}`, 采购建议ID: `PSG-${String(7101 + i)}`, 订单ID: `ORD-20260920-${String(i + 1).padStart(3, '0')}`,
      供应商ID: `SUP-${String((i % 3) + 1).padStart(3, '0')}`, 供应商名称: suppliers[i % 3], 采购状态中文: i % 4 === 2 ? '价格变化待处理' : '待确认',
      确认状态中文: i % 4 === 2 ? '不可确认' : '等待家庭成员确认', 采购金额: (42 + i * 3.2).toFixed(2), 商品数量: String((i % 3) + 1), 外部采购号: i > 5 ? `PO-1688-${6600 + i}` : '—',
      异常状态中文: i % 4 === 2 ? '价格上涨 6.8%' : '正常', 创建时间: `2026-09-20 1${i % 5}:00:00`, 更新时间: `2026-09-20 1${i % 5}:18:00`, 商品名称: name
    })),
    shipments: productNames.slice(0, 8).map((name, i) => ({
      __id: `SHP-20260920-${String(i + 1).padStart(3, '0')}`, __version: i + 1, __storeId: stores[i % 2], __state: i % 4 === 2 ? 'UNKNOWN' : 'IN_TRANSIT',
      物流ID: `SHP-20260920-${String(i + 1).padStart(3, '0')}`, 订单ID: `ORD-20260920-${String(i + 1).padStart(3, '0')}`, 采购单ID: `PUR-20260920-${String(i + 1).padStart(3, '0')}`,
      物流商名称: ['中通快递', '圆通速递', '申通快递'][i % 3], 外部物流状态中文: i % 4 === 2 ? '结果待确认' : '运输中', 青鸟物流状态中文: i % 4 === 2 ? '待对账' : '运输中',
      物流单号: `YT${202609200000 + i}`, 异常类型中文: i % 4 === 2 ? '货源状态与店铺状态冲突' : '正常', 最后轨迹时间: `2026-09-20 1${i % 6}:40:00`, 签收时间: '—', 更新时间: `2026-09-20 1${i % 6}:42:00`, 商品名称: name
    }))
  };

  const workflowSteps = [
    ['01', '配置接口', 'PLT-009', '平台能力与授权'], ['02', '商品搜索', 'SRC-042', 'API 优先，Worker 补位'], ['03', '候选选择', 'SRC-044', '批量勾选与确认'],
    ['04', '采集落库', 'SRC-046', '快照、SKU、媒体、Evidence'], ['05', '商品编辑', 'PRD-050', '草稿、版本与人工确认'], ['06', '店铺草稿', 'CHN-070', '映射校验后同步'],
    ['07', '订单回流', 'ORD-077', '幂等入库与水位'], ['08', '采购确认', 'PUR-085', '禁止自动外部下单'], ['09', '物流同步', 'LOGI-092', '货源→Server→店铺']
  ];

  const state = {
    mode: 'web', activeWeb: 'DASH-001', activePc: 'PC-001', expandedModule: 'DASH', role: 'OWNER', previousRole: 'OWNER',
    storeScope: 'ALL', reviewMode: false, routeParams: {}, paletteOpen: false, paletteQuery: '', traceOpen: false, roleMenuOpen: false,
    confirmAction: null, detailDrawer: null, issueDrawer: false, pageStates: new Map(), formDrafts: new Map(), busyPage: null,
    uiState: new Map(), workflow: { searchCreated: false, selectedCandidates: [], collectionTask: 'READY', productRevision: 18, channelStatus: '待同步', orderSyncBatch: '待启动', purchaseStatus: '待确认', logisticsStatus: '待同步' },
    pcTask: { status: 'READY', step: 0, evidence: [{ time: '14:28:10', text: 'Server 已签发不可变 ExecutionContext' }, { time: '14:28:12', text: 'RouteSnapshot / Adapter / Fixture 校验通过' }] }
  };

  function pageState(pageId) {
    if (!state.pageStates.has(pageId)) state.pageStates.set(pageId, { filters: {}, page: 1, size: 5, sortField: '', sortDir: 'asc', selected: new Set() });
    return state.pageStates.get(pageId);
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '') || 'web/DASH-001';
    const [path, query = ''] = raw.split('?');
    const [mode, id] = path.split('/');
    const params = Object.fromEntries(new URLSearchParams(query));
    state.routeParams = params;
    if (mode === 'pc' && pcPageMap.has(id)) {
      state.mode = 'pc'; state.activePc = id;
      if (state.role !== 'PC_WORKER') state.previousRole = state.role;
      state.role = 'PC_WORKER';
    } else if (pageMap.has(id)) {
      state.mode = 'web'; state.activeWeb = id; state.expandedModule = id.split('-')[0];
      if (state.role === 'PC_WORKER') state.role = state.previousRole || 'OWNER';
    }
  }

  function contextParams(sourcePage, row = null, extra = {}) {
    const ps = pageState(sourcePage.id);
    return {
      entityId: row?.__id || state.routeParams.entityId || '', version: row?.__version || state.routeParams.version || '1', sourcePage: sourcePage.id,
      filters: JSON.stringify(ps.filters), page: String(ps.page), size: String(ps.size), sort: ps.sortField ? `${ps.sortField}:${ps.sortDir}` : '', tab: extra.tab || '', storeScope: state.storeScope,
      ...extra
    };
  }

  function setRoute(mode, id, params = {}) {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== '' && value != null)).toString();
    const next = `#/${mode}/${id}${query ? `?${query}` : ''}`;
    if (location.hash === next) { parseHash(); render(); } else location.hash = next;
  }

  function navigateWeb(id, params = {}) {
    if (!pageMap.has(id)) return;
    closeOverlays();
    setRoute('web', id, params);
  }

  function navigatePc(id) {
    if (!pcPageMap.has(id)) return;
    closeOverlays();
    state.pcTask = { status: 'READY', step: 0, evidence: [{ time: '14:28:10', text: 'Server 已签发不可变 ExecutionContext' }, { time: '14:28:12', text: 'RouteSnapshot / Adapter / Fixture 校验通过' }] };
    setRoute('pc', id);
  }

  function closeOverlays() {
    state.paletteOpen = false; state.traceOpen = false; state.roleMenuOpen = false; state.confirmAction = null; state.detailDrawer = null; state.issueDrawer = false;
  }

  function canViewPage(page) {
    if (state.role === 'OWNER' || state.role === 'AUDITOR') return true;
    if (state.role === 'OPS') return page.module !== 'SYS' || ['SYS-117', 'SYS-118', 'SYS-135', 'SYS-136'].includes(page.id);
    if (state.role === 'HUMAN') return ['DASH-002', 'DASH-003', 'ACC-019', 'ACC-023', 'SRC-049', 'CHN-073', 'AS-095', 'AS-144', 'TSK-145'].includes(page.id);
    return false;
  }

  function canUseButton(page, button) {
    if (!canViewPage(page)) return false;
    if (state.role === 'OWNER') return true;
    if (state.role === 'AUDITOR') return button['权限'] === 'READ';
    if (state.role === 'HUMAN') return ['READ', 'EXECUTE', 'UPDATE'].includes(button['权限']) && ['DASH', 'ACC', 'SRC', 'CHN', 'AS', 'TSK'].includes(page.module);
    if (state.role === 'OPS') return page.module !== 'SYS' && button['权限'] !== 'DELETE';
    return false;
  }

  function currentScope() { return storeScopes.find(item => item.id === state.storeScope) || storeScopes[0]; }
  function statusClass(value) {
    if (/成功|正常|有效|完整|完成|已同步|已支付|运输中/.test(value)) return 'ok';
    if (/执行中|检查中|已认领|生成中/.test(value)) return 'running';
    if (/等待|待执行|待确认|警告|草稿|待同步|待采购/.test(value)) return 'warn';
    if (/失败|失效|阻断|取消|异常|冲突|不可|未知/.test(value)) return 'danger';
    return 'neutral';
  }

  function reviewToolsVisible() {
    return state.reviewMode || state.role === 'AUDITOR';
  }

  function annotateLocalControls(root, pageId) {
    if (!root) return;
    const controls = root.querySelectorAll('button, input, select, textarea, summary');
    controls.forEach((control, index) => {
      if (control.dataset.buttonId) return;
      const fieldHost = control.closest('[data-field-id]');
      if (fieldHost && !control.matches('[data-row-select], [data-select-all], [data-page-size]')) return;
      const datasetKey = Object.keys(control.dataset).find(key => !['testId', 'fieldId'].includes(key));
      const action = control.dataset.designAction || (datasetKey ? datasetKey.replace(/[A-Z]/g, char => `_${char}`).toUpperCase() : control.tagName);
      const localId = `LOCAL-${pageId}-${action}-${String(index + 1).padStart(2, '0')}`;
      control.dataset.localAction ||= localId;
      control.dataset.testId ||= `TEST-${localId}`;
      if (!control.title) control.title = `LocalAction: ${control.dataset.localAction}`;
    });
  }

  function render() {
    const isPc = state.mode === 'pc';
    const page = isPc ? pcPageMap.get(state.activePc) : pageMap.get(state.activeWeb);
    document.title = `${page?.name || '青鸟'} · 青鸟 V3.9`;
    app.innerHTML = `<div class="app-shell ${isPc ? 'pc-shell' : ''}">${renderSidebar()}${renderTopbar(page)}<main class="main"><div class="page-wrap">${isPc ? renderPcPage(page) : renderWebPage(page)}</div></main></div>`;
    renderOverlay();
    annotateLocalControls(app, page?.id || 'UNKNOWN');
    loading?.classList.add('is-hidden');
  }

  function renderSidebar() {
    const isPc = state.mode === 'pc';
    return `<aside class="sidebar" aria-label="${isPc ? 'PC Worker 导航' : '管理端导航'}">
      <div class="brand-lockup"><img src="./assets/${isPc ? 'qingniao-A-inverse.svg' : 'qingniao-A-ink.svg'}" alt="青鸟"><div class="brand-word"><strong>青鸟</strong><span>${isPc ? 'PC WORKER' : '家庭经营工作台'}</span></div></div>
      <div class="mode-switch" aria-label="系统端切换"><button class="${!isPc ? 'active' : ''}" data-mode="web">管理端</button><button class="${isPc ? 'active' : ''}" data-mode="pc">PC Worker</button></div>
      <div class="workspace-chip"><div class="workspace-avatar">${isPc ? 'W' : '青'}</div><div><strong>${isPc ? 'WKR-HOME-01' : '青鸟家庭工作室'}</strong><small>${isPc ? 'Windows 11 · Edge' : '个人/家庭工作空间'}</small></div><span class="muted">⌄</span></div>
      <nav class="nav-scroll">${isPc ? renderPcNavigation() : renderWebNavigation()}</nav>
      <div class="sidebar-footer"><div class="server-mini"><span class="dot"></span><div><strong>${isPc ? '已连接 NAS Server' : 'NAS Server 正常'}</strong><small>${isPc ? '心跳 3 秒前' : '唯一业务真源'}</small></div><span class="muted">${isPc ? '15s' : '在线'}</span></div></div>
    </aside>`;
  }

  function renderWebNavigation() {
    return navGroups.map(group => `<section class="nav-section"><div class="nav-section-title">${safe(group.label)}</div>${group.modules.map(module => {
      const meta = moduleMeta[module];
      const allPages = requirements.pages.filter(page => page.module === module);
      const menuPages = state.reviewMode ? allPages : allPages.filter(page => !isContextPage(page));
      const active = state.expandedModule === module;
      const activePage = pageMap.get(state.activeWeb);
      const activeContext = activePage?.module === module && isContextPage(activePage) && !menuPages.some(page => page.id === activePage.id) ? activePage : null;
      return `<button class="nav-module-button ${active ? 'active' : ''}" data-module="${module}"><span class="nav-icon">${icon(meta.icon)}</span><span>${safe(meta.label)}</span><span class="nav-count">${menuPages.length}/${allPages.length}</span></button>
        ${active ? `<div class="nav-pages">${menuPages.map(page => `<button class="nav-page-button ${state.activeWeb === page.id ? 'active' : ''}" data-nav="${page.id}"><span>${safe(page.name)}</span><code>${safe(page.id.split('-')[1])}</code></button>`).join('')}${activeContext ? `<button class="nav-page-button active context-nav" data-nav="${activeContext.id}"><span>↳ ${safe(activeContext.name)}</span><code>上下文</code></button>` : ''}</div>` : ''}`;
    }).join('')}</section>`).join('');
  }

  function pcGroupLabel(id) {
    const n = Number(id.split('-')[1]);
    if (n <= 3) return '节点基础';
    if (n <= 8) return '浏览与适配';
    if (n <= 12) return '货源采集';
    if (n <= 15) return '登录与店铺草稿';
    if (n <= 19) return '订单履约';
    return '诊断';
  }

  function renderPcNavigation() {
    return ['节点基础', '浏览与适配', '货源采集', '登录与店铺草稿', '订单履约', '诊断'].map(label => `<section class="nav-section"><div class="nav-section-title">${label}</div>${requirements.pcPages.filter(page => pcGroupLabel(page.id) === label).map(page => `<button class="pc-nav-button ${state.activePc === page.id ? 'active' : ''}" data-pc-nav="${page.id}"><span>${safe(page.name)}</span><code>${safe(page.id)}</code></button>`).join('')}</section>`).join('');
  }

  function renderTopbar(page) {
    const isPc = state.mode === 'pc';
    const context = !isPc && isContextPage(page);
    return `<header class="topbar"><div class="topbar-left"><div class="breadcrumb"><span>${isPc ? 'PC Worker' : safe(moduleMeta[page?.module]?.label || '执行工作台')}</span><span class="slash">/</span>${context && state.routeParams.sourcePage ? `<button class="breadcrumb-link" data-return-context>${safe(pageMap.get(state.routeParams.sourcePage)?.name || state.routeParams.sourcePage)}</button><span class="slash">/</span>` : ''}<strong>${safe(page?.name || '')}</strong>${isPc || reviewToolsVisible() ? `<code>${safe(page?.id || '')}</code>` : ''}</div></div>
      <div class="topbar-right"><button class="command-button" data-open-palette aria-label="搜索全部页面">${icon('search', 16)}<span>页面台账</span><kbd>Ctrl K</kbd></button>
      ${!isPc ? `<button class="top-control store-scope" data-store-scope>${icon('store', 15)}<span>${safe(currentScope().label)}</span></button><button class="top-control" data-toggle-review title="业务模式隐藏上下文页，评审模式展示全部页面">${icon('trace', 15)}<span>${state.reviewMode ? '评审模式' : '业务模式'}</span></button>` : ''}
      <span class="freeze-pill">V3.9-FROZEN</span>${!isPc ? `<button class="top-control role-control" data-open-role><span class="role-avatar">${roleInfo[state.role].initial}</span><strong>${roleInfo[state.role].name}</strong><span>⌄</span></button>` : `<button class="top-control" data-mode="web"><span class="role-avatar">W</span><strong>PC_WORKER</strong></button>`}</div></header>`;
  }

  function renderPageHeader(page, actions = '') {
    const meta = moduleMeta[page.module];
    const hasSource = isContextPage(page) && state.routeParams.sourcePage;
    const reviewActions = reviewToolsVisible() ? `<button class="button" data-open-issues>${icon('alert', 15)}需求核验</button><button class="button" data-open-trace>${icon('trace', 15)}冻结追踪</button>` : '';
    return `<div class="page-head" data-page-id="${safe(page.id)}"><div class="page-title-block"><div class="eyebrow"><span>${safe(meta?.label || page.module)}</span>${reviewToolsVisible() ? `<span>·</span><code>${safe(page.id)}</code>` : ''}<span class="meta-tag">${state.reviewMode ? '评审追踪' : '真实业务演示'}</span></div><h1>${safe(page.name)}</h1><p class="page-subtitle">${safe(page.purpose || meta?.description || page.scenario)}</p></div>
      <div class="page-actions">${hasSource ? `<button class="button" data-return-context>← 返回并恢复列表</button>` : ''}${actions}${reviewActions}</div></div>`;
  }

  function renderWorkflowStrip(activeId) {
    return `<section class="card business-flow"><div class="business-flow-head"><div><strong>无货源经营主流程</strong><small>API 能力优先；浏览器任务按能力显式选用，禁止透明切换</small></div><span class="status-tag ok">Server 裁决</span></div><div class="business-flow-scroll">${workflowSteps.map(([index, label, id, desc]) => `<button class="business-flow-step ${activeId === id ? 'active' : ''}" data-go="${id}"><span>${index}</span><strong>${label}</strong><small>${desc}</small></button>`).join('')}</div></section>`;
  }

  function renderNotFound() {
    return `<div class="empty-state">${icon('alert', 38)}<strong>页面不存在</strong><span>请从页面台账重新选择。</span><button class="button" data-open-palette>打开页面台账</button></div>`;
  }

  function renderPermissionDenied(page, objectDenied = false) {
    return `${renderPageHeader(page)}<section class="card empty-state">${icon('shield', 42)}<strong>${objectDenied ? '对象不在当前店铺数据范围内' : '当前岗位无权访问此页面'}</strong><span>${objectDenied ? '已阻止通过直达 URL 越权访问对象；请切换店铺范围或安全返回。' : `${safe(roleInfo[state.role].name)}按 Role + PermissionCode + Page + StoreScope + ObjectScope + Assignment + CurrentState 校验。`}</span><button class="button" data-return-context>${state.routeParams.sourcePage ? '返回来源页' : '返回工作台'}</button></section>${renderSpecStrip(page)}`;
  }

  function queryFields(page) { return page.fields.filter(field => field['角色'].includes('QUERY') && field['中文名称'] !== '无独立查询项'); }
  function contentFields(page) { const fields = page.fields.filter(field => !field['角色'].includes('QUERY')); return fields.length ? fields : page.fields; }
  function filterButtons(page) { return page.buttons.filter(button => /查询|重置|刷新/.test(button['按钮'])); }
  function actionButtons(page) { const ids = new Set(filterButtons(page).map(button => button.ButtonID)); return page.buttons.filter(button => !ids.has(button.ButtonID)); }

  function fieldValue(field, row = 0, page = null) {
    const name = field['中文名称'];
    const p = page || pageMap.get(state.activeWeb);
    const source = rowsForModule(p?.module || 'GEN')[row % Math.max(rowsForModule(p?.module || 'GEN').length, 1)] || {};
    if (source[name] != null) return source[name];
    const mappings = {
      平台名称: ['1688', '小红书', '微信小店'], 店铺名称: ['青鸟生活馆', '青鸟优选'], 账号名称: ['家庭采购账号', '家庭运营账号'],
      商品名称: productNames, 供应商名称: suppliers, 物流商名称: ['中通快递', '圆通速递', '申通快递'], 任务类型中文: ['商品探查', '正式采集', '店铺草稿同步'],
      业务类型中文: ['来源商品', '商品草稿', '订单履约'], 当前步骤: ['等待领取', '提取 SKU', '回传 Evidence']
    };
    if (mappings[name]) return mappings[name][row % mappings[name].length];
    if (name.includes('状态')) return ['待执行', '执行中', '等待人工处理'][row % 3];
    if (name.includes('时间') || name.endsWith('At')) return `2026-09-20 ${String(14 - (row % 5)).padStart(2, '0')}:${String((row * 7) % 60).padStart(2, '0')}:00`;
    if (/金额|价格|成本|利润|收入|费用/.test(name)) return (68 + row * 12.5).toFixed(2);
    if (/数量|库存|件数|异常数量|待处理数量|次数|SKU数|媒体数/.test(name)) return String((row % 8) + 1);
    if (/URL|地址/.test(name)) return ['https://api.1688.example/v1', 'https://ark.xiaohongshu.example', 'https://channels.weixin.example/shop'][row % 3];
    if (/TraceID/.test(name)) return `tr_${String(90210 + row)}…${String(1200 + row)}`;
    if (/版本/.test(name)) return `v${3 + row}.9.${20 - row}`;
    if (/SKU/.test(name)) return ['米白 / M', '深青 / L', '原木色 / 标准'][row % 3];
    if (/ID|编号|编码/.test(name)) return `${p?.module || 'OBJ'}-${String(2026092001 + row)}`;
    if (/名称|标题/.test(name)) return ['青鸟生活馆', '家庭经营对象', '秋季日用选品'][row % 3];
    if (/类型|方式/.test(name)) return ['官方 API', '浏览器执行', '人工协查'][row % 3];
    if (/是否|启用/.test(name)) return row % 2 ? '否' : '是';
    return ['—', '已配置', '正常'][row % 3];
  }

  function rowsForModule(module) {
    if (module === 'SRC') return domain.candidates;
    if (module === 'PRD') return domain.products;
    if (module === 'CHN') return domain.channels;
    if (module === 'ORD') return domain.orders;
    if (module === 'PUR') return domain.purchases;
    if (module === 'LOGI') return domain.shipments;
    return [];
  }

  function genericRows(page) {
    const base = rowsForModule(page.module);
    if (base.length) return base;
    return Array.from({ length: 17 }, (_, row) => {
      const item = { __id: `${page.module}-${String(2026092001 + row)}`, __version: row + 1, __storeId: stores[row % 2], __state: row % 5 === 4 ? 'WARN' : 'ACTIVE' };
      contentFields(page).forEach(field => { item[field['中文名称']] = fieldValueFallback(field, row, page); });
      return item;
    });
  }

  function fieldValueFallback(field, row, page) {
    const name = field['中文名称'];
    if (name.includes('状态')) return ['正常', '待执行', '执行中', '等待人工处理'][row % 4];
    if (name.includes('时间')) return `2026-09-20 ${String(15 - row % 6).padStart(2, '0')}:${String(row * 3).padStart(2, '0')}:00`;
    if (/金额|价格|成本|利润|收入|费用/.test(name)) return (60 + row * 8.2).toFixed(2);
    if (/数量|库存|次数/.test(name)) return String((row % 9) + 1);
    if (/URL|地址/.test(name)) return `https://example.local/${page.module.toLowerCase()}/${row + 1}`;
    if (/版本/.test(name)) return `v${row + 1}`;
    if (/ID|编号|编码/.test(name)) return `${page.module}-${String(2026092001 + row)}`;
    if (/名称|标题/.test(name)) return `${moduleMeta[page.module]?.label || page.module}示例 ${row + 1}`;
    if (/是否|启用/.test(name)) return row % 2 ? '否' : '是';
    return ['正常', '已配置', '—'][row % 3];
  }

  function rowsForPage(page) {
    const ps = pageState(page.id);
    let rows = genericRows(page).filter(row => state.storeScope === 'ALL' || row.__storeId === state.storeScope);
    Object.entries(ps.filters).forEach(([fieldId, value]) => {
      if (!String(value).trim()) return;
      const field = page.fields.find(item => item.FieldID === fieldId);
      if (!field) return;
      const key = field['中文名称'].replace('范围', '');
      const needle = String(value).trim().toLowerCase();
      rows = rows.filter(row => String(row[key] ?? Object.values(row).join(' ')).toLowerCase().includes(needle));
    });
    if (ps.sortField) rows.sort((a, b) => String(a[ps.sortField] ?? '').localeCompare(String(b[ps.sortField] ?? ''), 'zh-CN', { numeric: true }) * (ps.sortDir === 'desc' ? -1 : 1));
    return rows;
  }

  function selectedRow(page) {
    const ps = pageState(page.id);
    const id = [...ps.selected][0] || state.routeParams.entityId;
    return genericRows(page).find(row => row.__id === id) || genericRows(page)[0];
  }

  function renderWebPage(page) {
    if (!page) return renderNotFound();
    if (!canViewPage(page)) return renderPermissionDenied(page);
    const object = state.routeParams.entityId ? genericRows(page).find(row => row.__id === state.routeParams.entityId) : null;
    if (object && state.storeScope !== 'ALL' && object.__storeId !== state.storeScope) return renderPermissionDenied(page, true);
    const dedicated = {
      'DASH-001': renderDashboard,
      'SRC-042': renderSourceSearch,
      'SRC-043': renderDiscoveryResults,
      'SRC-044': renderCandidateList,
      'SRC-045': renderCandidateConfirm,
      'SRC-046': renderCollectionTasks,
      'SRC-047': renderCollectionRecords,
      'PRD-050': renderProductList,
      'PRD-051': renderProductDetail,
      'PRD-052': renderProductEditor,
      'PRD-126': renderProductPreview,
      'CHN-070': renderChannelPreview,
      'CHN-071': renderPublishTasks,
      'ORD-074': renderOrderList,
      'ORD-077': renderOrderSync,
      'PUR-085': renderPurchaseConfirm,
      'LOGI-092': renderLogisticsTimeline,
      'TSK-145': renderHumanTaskCenter
    }[page.id];
    if (dedicated) return dedicated(page);
    const spec = pageSpecs.get(page.id);
    if (spec.contextOnly && !state.routeParams.entityId) return renderContextResolver(page);
    if (spec.kind === 'form') return renderFormPage(page);
    if (spec.kind === 'detail') return renderDetailPage(page);
    if (spec.kind === 'preview') return renderPreviewPage(page);
    if (spec.kind === 'task') return renderTaskPage(page);
    if (spec.kind === 'tree') return renderTreePage(page);
    if (spec.kind === 'matrix') return renderMatrixPage(page);
    if (spec.kind === 'settings') return renderFormPage(page);
    return renderListPage(page);
  }

  function renderContextResolver(page) {
    const source = requirements.pages.find(item => item.module === page.module && !isContextPage(item)) || pageMap.get('DASH-001');
    const frozenButtons = page.buttons.filter(button => canUseButton(page, button)).map(button => `<button class="button small" data-button-id="${safe(button.ButtonID)}" disabled title="选择对象后启用 · ${safe(button['可见/启用'])}">${safe(button['按钮'])}</button>`).join('');
    return `${renderPageHeader(page)}<section class="card empty-state context-resolver">${icon('info', 42)}<strong>请选择业务对象后进入</strong><span>${safe(page.name)}需要 entityId、version 和来源 QueryContext。直接访问不会展示固定演示对象。</span><div class="resolver-actions"><button class="button primary" data-go="${source.id}">前往${safe(source.name)}</button><button class="button" data-open-palette>查找其他入口</button></div>${frozenButtons ? `<div class="disabled-contract-actions"><span>对象未选择，冻结业务按钮保持禁用：</span>${frozenButtons}</div>` : ''}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderActionButton(page, button, small = true) {
    if (!canUseButton(page, button)) return '';
    const label = button['按钮'];
    const destructive = /删除|停用|取消|撤销|拒绝|驳回|解除/.test(label);
    const primary = /创建|确认|保存|提交|执行|认领|发布|生成|新增|开始|应用|同步/.test(label);
    const ps = pageState(page.id);
    const needsObject = /EXISTS|匹配|选中/.test(button.CurrentState || '') || /查看详情|排除候选|确认匹配|解除匹配/.test(label);
    const disabled = needsObject && !ps.selected.size && !state.routeParams.entityId && ['list', 'task'].includes(pageSpecs.get(page.id)?.kind);
    return `<button class="button ${destructive ? 'danger' : primary ? 'primary' : ''} ${small ? 'small' : ''}" data-button-id="${safe(button.ButtonID)}" title="${safe(button.ButtonID)} · ${safe(button['可见/启用'])}" ${disabled ? 'disabled aria-disabled="true"' : ''}>${safe(label)}</button>`;
  }

  function renderDesignAction(id, label, kind = 'primary', note = '待纳入补丁基线') {
    return `<button class="button ${kind}" data-design-action="${safe(id)}" title="设计补充 ${safe(id)}：${safe(note)}">${safe(label)}<span class="design-badge">设计补充</span></button>`;
  }

  function renderQueryField(page, field) {
    const ps = pageState(page.id);
    const value = ps.filters[field.FieldID] || '';
    const codeSet = field.CodeSet;
    if (codeSet && codeSet !== 'NONE' && requirements.codeSets[codeSet]) {
      return `<div class="field" data-field-id="${field.FieldID}"><label>${safe(field['中文名称'])}</label><select class="select" data-filter-id="${field.FieldID}"><option value="">全部</option>${requirements.codeSets[codeSet].map(item => `<option value="${safe(item.name)}" ${value === item.name ? 'selected' : ''}>${safe(item.name)}</option>`).join('')}</select></div>`;
    }
    const type = field['类型'].includes('DateTime') ? 'text' : 'search';
    const placeholder = field['中文名称'].includes('时间') ? 'YYYY-MM-DD HH:mm:ss' : `请输入${field['中文名称']}`;
    return `<div class="field" data-field-id="${field.FieldID}"><label>${safe(field['中文名称'])}</label><input class="input" type="${type}" value="${safe(value)}" placeholder="${safe(placeholder)}" data-filter-id="${field.FieldID}"></div>`;
  }

  function renderFilters(page) {
    const fields = queryFields(page);
    const buttons = filterButtons(page).filter(button => canUseButton(page, button));
    if (!fields.length && !buttons.length) return '';
    const primary = fields.slice(0, 4);
    const rest = fields.slice(4);
    return `<section class="card filter-card" aria-label="${safe(page.name)}查询条件"><div class="filter-grid">${primary.map(field => renderQueryField(page, field)).join('')}<div class="filter-actions">${buttons.map(button => renderActionButton(page, button)).join('')}</div></div>
      ${rest.length ? `<details class="advanced-filters"><summary>更多条件（${rest.length}）</summary><div class="filter-grid expanded">${rest.map(field => renderQueryField(page, field)).join('')}</div></details>` : ''}</section>`;
  }

  function renderToolbar(page, supplemental = '') {
    const ps = pageState(page.id);
    const actions = actionButtons(page);
    const allowed = actions.filter(button => canUseButton(page, button));
    const hidden = actions.length - allowed.length;
    return `<div class="toolbar"><div class="toolbar-left">${supplemental}${allowed.map(button => renderActionButton(page, button)).join('') || '<span class="toolbar-note">当前状态无可执行写操作</span>'}</div><div class="toolbar-right">${ps.selected.size ? `<span class="selection-summary">已选 ${ps.selected.size} 项</span>` : ''}${hidden ? `<span class="toolbar-note">${hidden} 项按岗位隐藏</span>` : ''}${reviewToolsVisible() ? `<button class="button small ghost" data-cycle-ui-state title="评审 default/loading/empty/error/offline/permission/conflict/long-content 状态">页面状态：${safe(state.uiState.get(page.id) || 'default')}</button>` : ''}</div></div>`;
  }

  function renderCell(field, value) {
    const name = field['中文名称'];
    if (name.includes('状态') || /完整度|采集结果/.test(name)) return `<span class="status-tag ${statusClass(String(value))}">${safe(value)}</span>`;
    if (/金额|价格|成本|利润|收入|费用/.test(name) && value !== '—') return `<span class="money">¥ ${safe(value)}</span>`;
    return `<span class="${/ID|编号|Trace|版本/.test(name) ? 'mono ' : ''}ellipsis" title="${safe(value)}">${safe(value)}</span>`;
  }

  function renderTableState(page, rows) {
    const mode = state.busyPage === page.id ? 'loading' : (state.uiState.get(page.id) || 'default');
    if (mode === 'loading') return `<div class="empty-state"><span class="spinner"></span><strong>正在加载</strong><span>300 ms 内展示加载态；列表 P95 ≤ 2 秒。</span></div>`;
    if (mode === 'error' || mode === 'offline') return `<div class="empty-state">${icon('alert', 36)}<strong>${mode === 'offline' ? '网络已断开' : '加载失败'}</strong><span>${mode === 'offline' ? 'NETWORK_ERROR · 已保留查询条件，可恢复后重试。' : 'INTERNAL_ERROR · TraceID ' + traceId()}</span><button class="button" data-retry-page>重试</button></div>`;
    if (mode === 'permission') return `<div class="empty-state">${icon('shield', 36)}<strong>无权限</strong><span>PERMISSION_DENIED · 可返回工作台或切换合法岗位。</span></div>`;
    if (mode === 'conflict') return `<div class="empty-state">${icon('alert', 36)}<strong>数据已被其他成员更新</strong><span>VERSION_CONFLICT / IDEMPOTENCY_CONFLICT · 原输入与原状态保持，请刷新差异后再决定。</span><button class="button" data-retry-page>刷新并查看差异</button></div>`;
    if (mode === 'long') return `<div class="long-content-demo"><strong>长文本与溢出验证</strong><p>这是用于验证业务标题、外部错误详情和平台回执在超长内容下仍可换行、查看完整值并保持表格可横向滚动的状态示例。abcdefghijklmnopqrstuvwxyz-0123456789-abcdefghijklmnopqrstuvwxyz-0123456789-abcdefghijklmnopqrstuvwxyz-0123456789</p></div>`;
    if (mode === 'empty' || !rows.length) return `<div class="empty-state">${icon('search', 36)}<strong>${Object.values(pageState(page.id).filters).some(Boolean) ? '没有符合条件的数据' : '暂无数据'}</strong><span>查询条件与分页上下文已保留。</span><button class="button" data-reset-page>清空条件</button></div>`;
    return '';
  }

  function renderDataTable(page, options = {}) {
    const ps = pageState(page.id);
    const allRows = rowsForPage(page);
    const pageCount = Math.max(1, Math.ceil(allRows.length / ps.size));
    if (ps.page > pageCount) ps.page = pageCount;
    const rows = allRows.slice((ps.page - 1) * ps.size, ps.page * ps.size);
    const special = renderTableState(page, rows);
    if (special) return special;
    const fields = options.fields || contentFields(page);
    const detailButton = page.buttons.find(button => /查看详情|查看执行结果|查看快照/.test(button['按钮']));
    return `<div class="table-scroll"><table class="data-table"><thead><tr><th class="select-col"><input type="checkbox" data-select-all aria-label="全选本页" ${rows.every(row => ps.selected.has(row.__id)) ? 'checked' : ''}></th>${fields.map(field => `<th data-field-id="${field.FieldID}"><button class="sort-button" data-sort-field="${safe(field['中文名称'])}">${safe(field['中文名称'])}${ps.sortField === field['中文名称'] ? `<span>${ps.sortDir === 'asc' ? '↑' : '↓'}</span>` : ''}</button></th>`).join('')}<th class="action-col">操作</th></tr></thead><tbody>${rows.map(row => `<tr class="${ps.selected.has(row.__id) ? 'selected' : ''}" data-entity-id="${safe(row.__id)}"><td class="select-col"><input type="checkbox" data-row-select="${safe(row.__id)}" ${ps.selected.has(row.__id) ? 'checked' : ''} aria-label="选择 ${safe(row.__id)}"></td>${fields.map((field, index) => { const value = row[field['中文名称']] ?? fieldValue(field, allRows.indexOf(row), page); return `<td data-field-id="${field.FieldID}">${index === 0 ? `<button class="row-link" data-row-detail="${safe(row.__id)}">${renderCell(field, value)}</button>` : renderCell(field, value)}</td>`; }).join('')}<td class="action-col"><button class="button small ghost" data-row-detail="${safe(row.__id)}" title="LocalAction: ROW_QUICK_VIEW">快速查看</button>${detailButton && canUseButton(page, detailButton) ? `<button class="button small" data-open-row="${safe(row.__id)}" data-target="${safe(detailButton.TargetPageID)}">完整页面</button>` : ''}</td></tr>`).join('')}</tbody></table></div>
      <div class="pagination"><span>第 ${allRows.length ? (ps.page - 1) * ps.size + 1 : 0}–${Math.min(ps.page * ps.size, allRows.length)} 条，共 ${allRows.length} 条 · 每页 <select data-page-size><option ${ps.size === 5 ? 'selected' : ''}>5</option><option ${ps.size === 10 ? 'selected' : ''}>10</option><option ${ps.size === 20 ? 'selected' : ''}>20</option></select></span><div class="pagination-controls"><button class="page-number" data-page="${Math.max(1, ps.page - 1)}" ${ps.page === 1 ? 'disabled' : ''}>‹</button>${Array.from({ length: pageCount }, (_, i) => i + 1).slice(Math.max(0, ps.page - 3), Math.max(5, ps.page + 2)).map(no => `<button class="page-number ${no === ps.page ? 'active' : ''}" data-page="${no}">${no}</button>`).join('')}<button class="page-number" data-page="${Math.min(pageCount, ps.page + 1)}" ${ps.page === pageCount ? 'disabled' : ''}>›</button></div></div>`;
  }

  function renderListPage(page, supplemental = '') {
    return `${renderPageHeader(page)}${['SRC', 'PRD', 'CHN', 'ORD', 'PUR', 'LOGI'].includes(page.module) ? renderWorkflowStrip(page.id) : ''}${renderFilters(page)}<section class="card table-card">${renderToolbar(page, supplemental)}${renderDataTable(page)}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderFieldCoverage(page) {
    if (!reviewToolsVisible()) return '';
    const query = queryFields(page);
    const content = contentFields(page);
    return `<details class="card field-coverage" ${state.reviewMode ? 'open' : ''}><summary><strong>字段落位（${page.fields.length}/${page.fields.length}）</strong><span>查询区 ${query.length} · 表格/详情 ${content.length} · 无静默省略</span></summary><div class="field-chip-grid">${page.fields.map(field => `<span class="field-chip" data-field-id="${field.FieldID}"><code>${safe(field.FieldID)}</code>${safe(field['中文名称'])}<small>${safe(field['角色'])}</small></span>`).join('')}</div></details>`;
  }

  function renderInputForField(page, field, index = 0) {
    const editable = field['可编辑'] === '是';
    const required = field['必填'] === '是';
    const name = field['中文名称'];
    const draft = state.formDrafts.get(page.id) || {};
    const value = draft[field.FieldID] ?? selectedRow(page)?.[name] ?? fieldValue(field, index, page);
    const full = /说明|备注|描述|内容|地址|规则/.test(name);
    const codeSet = field.CodeSet;
    if (codeSet && codeSet !== 'NONE' && requirements.codeSets[codeSet]) return `<div class="field ${full ? 'full' : ''}" data-field-id="${field.FieldID}"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><select class="select" data-form-field="${field.FieldID}" ${editable ? '' : 'disabled'}>${requirements.codeSets[codeSet].map(item => `<option ${value === item.name ? 'selected' : ''}>${safe(item.name)}</option>`).join('')}</select><span class="field-help">${editable ? '保存时由 Server 校验' : '只读 · CodeSet'}</span></div>`;
    if (full) return `<div class="field full" data-field-id="${field.FieldID}"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><textarea class="textarea" data-form-field="${field.FieldID}" ${editable ? '' : 'readonly'}>${safe(value === '—' ? '' : value)}</textarea><span class="field-help">${safe(field['校验/展示'])}</span></div>`;
    return `<div class="field" data-field-id="${field.FieldID}"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><input class="input ${required && !String(value || '').trim() ? 'invalid' : ''}" value="${safe(value === '—' ? '' : value)}" data-form-field="${field.FieldID}" ${editable ? '' : 'readonly'}><span class="field-help">${editable ? '可编辑 · Server 校验 · 离开前检查未保存修改' : `只读 · ${safe(field['来源'])}`}</span></div>`;
  }

  function renderFormPage(page) {
    const fields = contentFields(page);
    const row = selectedRow(page);
    const sensitive = page.module === 'ACC' || page.id === 'SYS-116';
    return `${renderPageHeader(page)}${sensitive ? `<div class="notice warn page-notice">${icon('shield')}<div><strong>仅保存 SecretRef</strong><p>密码、Cookie、Token 不回显，不进入普通日志或 Evidence 文本。</p></div></div>` : ''}<div class="form-layout"><section class="card"><div class="card-head"><div><h2>${safe(page.name)}</h2><small>带 * 为冻结必填字段；失败保留输入</small></div><span class="status-tag warn">编辑中</span></div><div class="card-body"><div class="form-grid">${fields.map((field, index) => renderInputForField(page, field, index)).join('')}</div></div><div class="form-footer">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('')}</div></section>${renderContextCard(page, row)}</div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderContextCard(page, row) {
    return `<aside class="card sticky-card"><div class="card-head"><h3>业务上下文</h3><span class="meta-tag">NAS Server</span></div><div class="card-body context-list"><div class="context-row"><span>业务对象</span><strong>${safe(page.businessObject)}</strong></div><div class="context-row"><span>对象 ID</span><strong class="mono">${safe(row?.__id || state.routeParams.entityId || '新建对象')}</strong></div><div class="context-row"><span>版本令牌</span><strong class="mono">rv_${safe(row?.__version || state.routeParams.version || 'new')}</strong></div><div class="context-row"><span>店铺范围</span><strong>${safe(currentScope().label)}</strong></div><div class="context-row"><span>状态裁决</span><strong>NAS Server</strong></div><div class="context-row"><span>最近 TraceID</span><strong class="mono">${traceId()}</strong></div></div></aside>`;
  }

  function renderDetailPage(page) {
    const row = selectedRow(page);
    const fields = contentFields(page);
    const actions = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    return `${renderPageHeader(page, actions)}<section class="card detail-hero"><div class="detail-key"><small>${safe(page.businessObject)}</small><strong>${safe(row?.商品名称 || row?.店铺名称 || row?.供应商名称 || page.name)}</strong><span class="mono">${safe(row?.__id || state.routeParams.entityId)}</span></div><span class="status-tag ${statusClass(row?.商品状态中文 || row?.订单状态中文 || row?.__state || '正常')}">${safe(row?.商品状态中文 || row?.订单状态中文 || row?.__state || '正常')}</span></section><section class="detail-grid">${fields.map((field, index) => `<div class="detail-cell" data-field-id="${field.FieldID}"><span>${safe(field['中文名称'])}</span><strong class="${/ID|编号|Trace|版本/.test(field['中文名称']) ? 'mono' : ''}">${safe(row?.[field['中文名称']] ?? fieldValue(field, index, page))}</strong></div>`).join('')}</section>${renderAuditTrail(page)}${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderAuditTrail(page) {
    return `<section class="card audit-card"><div class="card-head"><div><h2>关联记录与操作留痕</h2><small>Actor / ButtonID / APIID / Before / After / TraceID / IdempotencyKey</small></div><span class="meta-tag">只读</span></div><div class="task-list"><div class="task-item"><span class="task-severity" style="background:var(--qn-ok)"></span><div><div class="task-title"><strong>资料已更新</strong></div><div class="task-detail">家庭管理员 · ${nowText()} · Trace ${traceId()}</div></div><span class="status-tag ok">已记录</span></div><div class="task-item"><span class="task-severity" style="background:var(--qn-lapis)"></span><div><div class="task-title"><strong>业务对象已创建</strong></div><div class="task-detail">运营成员 · IdempotencyKey idem_${page.id.toLowerCase()}_001</div></div><span class="status-tag neutral">历史</span></div></div></section>`;
  }

  function renderPreviewPage(page) {
    const row = selectedRow(page);
    const actions = page.buttons.filter(button => canUseButton(page, button));
    return `${renderPageHeader(page)}<section class="card preview-context"><div class="preview-context-item"><span>对象</span><strong>${safe(row?.__id || state.routeParams.entityId)}</strong></div><div class="preview-context-item"><span>版本</span><strong>v${safe(row?.__version || state.routeParams.version || 1)}</strong></div><div class="preview-context-item"><span>状态</span><strong>有效</strong></div><div class="preview-context-item"><span>店铺范围</span><strong>${safe(currentScope().label)}</strong></div></section><div class="preview-main"><section class="card product-preview">${renderProductPreviewContent(row, page.module === 'SRC')}</section><aside class="card"><div class="card-head"><div><h2>校验与差异</h2><small>阻断项清零后才可继续</small></div><span class="status-tag ok">有效</span></div><div class="card-body validation-list">${renderValidationItems(page.module === 'SRC')}</div><div class="form-footer">${actions.map(button => renderActionButton(page, button, false)).join('')}</div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderProductPreviewContent(row = {}, source = false) {
    return `<div class="product-preview-head"><div class="product-image-placeholder">${icon('image', 36)}<span>主图 1 / 6</span></div><div><span class="meta-tag">${source ? '来源事实只读' : '渠道呈现'}</span><h2>${safe(row.商品名称 || '亚麻通勤手提包 · 轻量大容量')}</h2><p class="muted">${source ? '来源快照保持可追溯，不在采集预览中改写。' : '当前预览绑定 ProductVersion 与 MappingVersion；修改后必须重新生成。'}</p><div class="price-line">¥ ${safe(row.建议售价 || '128.00')}</div><div class="sku-row"><span class="sku-chip active">米白 / M</span><span class="sku-chip">深青 / M</span><span class="sku-chip">米白 / L</span></div></div></div><div class="preview-detail"><h3>${source ? '采集范围' : '商品详情摘要'}</h3><div class="detail-grid"><div class="detail-cell"><span>SKU</span><strong>3 个</strong></div><div class="detail-cell"><span>媒体</span><strong>6 张</strong></div><div class="detail-cell"><span>${source ? '完整度' : '库存'}</span><strong>${source ? '完整' : '126'}</strong></div></div></div>`;
  }

  function renderValidationItems(source = false) {
    return `<div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>对象与版本已锁定</strong><small>执行上下文将在创建任务时固化</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>${source ? '标题、价格、SKU、主图完整' : '类目、属性与 SKU 映射通过'}</strong><small>PayloadHash 与 Evidence 要求已生成</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>无阻断差异</strong><small>结果未知时进入 UNKNOWN，不自动重放外部写</small></div></div><div class="notice warn">${icon('shield')}<div><strong>保留人工边界</strong><p>验证码、风控、采购、店铺草稿确认和售后决策不得绕过。</p></div></div>`;
  }

  function renderDashboard(page) {
    const metrics = [
      ['候选待确认', domain.candidates.filter(item => item.__state === 'READY').length, '进入商品采集列表'],
      ['落库商品草稿', domain.products.filter(item => item.__state === 'DRAFT').length, '需要编辑或补全'],
      ['订单待采购', domain.orders.filter(item => item.__state === 'PAID').length, '禁止自动外部下单'],
      ['物流待对账', domain.shipments.filter(item => item.__state === 'UNKNOWN').length, '未知状态不可伪装完成']
    ];
    const frozenActions = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    const dashboardFields = page.fields.filter(field => !field['角色'].includes('QUERY'));
    return `${renderPageHeader(page, frozenActions)}${renderWorkflowStrip(page.id)}${renderFilters(page)}<section class="card dashboard-dimension-bar" aria-label="经营指标口径">${dashboardFields.map((field, index) => `<div data-field-id="${field.FieldID}"><span>${safe(field['中文名称'])}</span><strong>${safe(index === 0 ? '今日' : index === 1 ? '全部平台' : index === 2 ? currentScope().label : index === 3 ? '商品/订单/履约' : index === 4 ? '26' : index === 5 ? '4' : index === 6 ? '7' : nowText())}</strong></div>`).join('')}</section><section class="metrics-grid" aria-label="经营指标">${metrics.map((item, i) => `<article class="card metric-card"><div class="metric-label"><span>${item[0]}</span><span>实时</span></div><div class="metric-value">${item[1]}</div><div class="metric-meta">${safe(item[2])}</div></article>`).join('')}</section>
      <section class="dashboard-grid"><article class="card"><div class="card-head"><div><h2>今日经营链路</h2><small>从货源搜索到物流双向同步的业务状态</small></div><span class="status-tag ok">链路可用</span></div><div class="pipeline-list">${[
        ['货源搜索与候选', '12 个候选 · 2 个有警告', 'SRC-044', 'running'], ['正式采集与落库', '2 个任务执行中 · 1 个等待人工', 'SRC-046', 'warn'],
        ['商品草稿与店铺草稿', '4 个商品待同步 · 2 个预览有效', 'CHN-070', 'warn'], ['订单、采购与物流', '11 笔订单 · 7 条采购建议 · 2 条物流待对账', 'ORD-074', 'running']
      ].map((item, i) => `<button class="pipeline-row" data-go="${item[2]}"><span class="pipeline-index">${i + 1}</span><span><strong>${item[0]}</strong><small>${item[1]}</small></span><span class="status-tag ${item[3]}">${i === 0 ? '处理中' : i === 1 ? '需关注' : '待处理'}</span></button>`).join('')}</div></article>
      <aside class="card"><div class="card-head"><div><h2>执行与接口健康</h2><small>每项能力明确 API 或 Browser Worker</small></div><button class="button small" data-go="PLT-012">平台能力</button></div><div class="card-body health-stack"><div class="health-row"><div class="health-icon">${icon('shield')}</div><div><strong>NAS Server</strong><small>唯一业务真源 · 数据库正常</small></div><span class="status-tag ok">正常</span></div><div class="health-row"><div class="health-icon">API</div><div><strong>销售平台 API</strong><small>订单/物流 · Token 8 天后轮换</small></div><span class="status-tag ok">可用</span></div><div class="health-row"><div class="health-icon">${icon('monitor')}</div><div><strong>PC Worker</strong><small>货源详情采集 · 心跳 3 秒前</small></div><span class="status-tag running">执行中</span></div><div class="notice warn">${icon('info')}<div><strong>不会透明切换执行通道</strong><p>API 失败不会自动改用浏览器写操作；必须由 Server 重新建任务并保留审计。</p></div></div></div></aside></section>
      <section class="dashboard-grid equal"><article class="card"><div class="card-head"><div><h2>需要家庭成员处理</h2><small>采购、登录、结果未知与异常匹配</small></div><button class="button small" data-go="TSK-145">全部待办</button></div><div class="task-list"><div class="task-item"><span class="task-severity danger"></span><div><div class="task-title"><strong>采购价格上涨 6.8%</strong></div><div class="task-detail">PUR-20260920-003 · 必须人工确认或驳回</div></div><button class="button small" data-go="PUR-085">处理</button></div><div class="task-item"><span class="task-severity"></span><div><div class="task-title"><strong>1688 采集需要验证码</strong></div><div class="task-detail">原 BrowserProfile 暂停，等待人工接管</div></div><button class="button small" data-go="TSK-145">接管</button></div><div class="task-item"><span class="task-severity danger"></span><div><div class="task-title"><strong>物流结果待确认</strong></div><div class="task-detail">货源平台与店铺状态不一致，禁止自动标记已发货</div></div><button class="button small" data-go="LOGI-092">对账</button></div></div></article>
      <article class="card"><div class="card-head"><div><h2>需求与设计核验</h2><small>发现的冻结冲突不会被原型静默掩盖</small></div><button class="button small" data-open-issues>查看 8 项</button></div><div class="card-body validation-list"><div class="validation-item warn"><span class="validation-mark">!</span><div><strong>3 个命令被绑定为 GET</strong><small>采集确认、创建发布任务、采购确认需进入补丁基线</small></div></div><div class="validation-item warn"><span class="validation-mark">!</span><div><strong>3 个 TargetPageID 语义冲突</strong><small>原型使用 NavigationContext 安全返回并保留冻结证据</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>业务边界保持不变</strong><small>Server 真源、人工采购确认、UNKNOWN 先对账</small></div></div></div></article></section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderSourceSearch(page) {
    const frozen = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    return `${renderPageHeader(page, frozen)}${renderWorkflowStrip(page.id)}<div class="form-layout"><section class="card"><div class="card-head"><div><h2>新建商品探查</h2><small>按平台能力选择官方 API 或 PC Worker；执行方式不可透明切换</small></div><span class="status-tag ok">能力已验证</span></div><div class="card-body"><div class="form-grid"><div class="field"><label>货源平台<span class="required">*</span></label><select class="select" id="source-platform"><option>1688</option><option>其他已配置货源平台</option></select></div><div class="field"><label>执行能力<span class="required">*</span></label><select class="select" id="source-capability"><option>商品搜索 API（优先）</option><option>浏览器探查任务</option></select></div><div class="field full"><label>搜索关键词或商品链接<span class="required">*</span></label><input class="input" id="source-keyword" value="亚麻 通勤 手提包" placeholder="关键词、外部商品 ID 或完整 URL"><span class="field-help">关键词搜索与指定链接采集必须形成不同的请求摘要和 IdempotencyKey。</span></div><div class="field"><label>采购账号<span class="required">*</span></label><select class="select"><option>家庭采购账号 · 有效</option></select></div><div class="field"><label>候选上限</label><select class="select"><option>20</option><option>50</option><option>100</option></select></div></div><div class="notice page-notice">${icon('info')}<div><strong>设计核验 GAP-UI-001</strong><p>冻结页没有“创建探查任务”ButtonID/API 契约；本操作作为显式设计补充演示，必须经变更控制后进入开发。</p></div></div></div><div class="form-footer">${renderDesignAction('GAP-UI-001', '创建探查任务')}</div></section>
      <aside class="card sticky-card"><div class="card-head"><h3>接口与执行边界</h3><span class="meta-tag">能力路由</span></div><div class="card-body context-list"><div class="context-row"><span>API 模式</span><strong>Server 调用平台接口；Token 使用 SecretRef</strong></div><div class="context-row"><span>浏览器模式</span><strong>Server 创建任务，PC Worker 执行并回传 Evidence</strong></div><div class="context-row"><span>失败处理</span><strong>读操作有限重试；外部写结果不确定进入 UNKNOWN</strong></div><div class="context-row"><span>当前路由</span><strong>search-api v3 · 2026-09-18 已验证</strong></div></div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderDiscoveryResults(page) {
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="notice page-notice">${icon('info')}<div><strong>探查结果只形成候选，不直接落库为正式商品</strong><p>选择结果后进入候选商品，再由家庭成员确认采集范围。</p></div></div>${renderFilters(page)}<section class="card table-card">${renderToolbar(page, renderDesignAction('GAP-UI-002', '加入候选', 'primary', '冻结页缺少批量加入候选 ButtonID'))}${renderDataTable(page)}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderCandidateList(page) {
    const selected = pageState(page.id).selected.size;
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="notice page-notice">${icon('info')}<div><strong>请选择需要正式采集的商品</strong><p>勾选记录后进入候选确认；未选商品不会创建采集任务。</p></div></div>${renderFilters(page)}<section class="card table-card">${renderToolbar(page, selected ? `<button class="button primary" data-confirm-candidates>确认所选 ${selected} 项</button>` : '')}${renderDataTable(page)}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderCandidateConfirm(page) {
    const ids = (state.routeParams.entityId || '').split(',').filter(Boolean);
    const candidates = ids.length ? domain.candidates.filter(item => ids.includes(item.__id)) : domain.candidates.slice(0, 2);
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="confirm-layout"><section class="card"><div class="card-head"><div><h2>采集对象（${candidates.length}）</h2><small>确认后为每个对象创建可追踪 CollectionTask</small></div><span class="status-tag warn">待确认</span></div><div class="selection-cards">${candidates.map(item => `<article class="selection-card"><div class="selection-thumb">${icon('image', 24)}</div><div><strong>${safe(item.商品名称)}</strong><small>${safe(item.平台名称)} · ${safe(item.供应商名称)} · ${safe(item.外部商品ID)}</small><span class="status-tag ${statusClass(item.完整度中文)}">${safe(item.完整度中文)}</span></div></article>`).join('')}</div></section><aside class="card"><div class="card-head"><h2>落库验收条件</h2><span class="meta-tag">ACC-COL-001</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>标题与外部商品 ID</strong><small>必填且可追溯</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>价格、SKU、至少 1 张主图</strong><small>平台必填 SKU 不得缺失</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>SourceSnapshot / MediaManifest / Evidence</strong><small>由 Server 校验后裁决 COMPLETED</small></div></div><div class="notice warn">${icon('alert')}<div><strong>PARTIAL 可落 SourceProduct</strong><p>但不得按完整采集验收，也不得伪装为 FULL。</p></div></div></div><div class="form-footer">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('')}</div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function taskRows(page) {
    const labels = page.module === 'SRC' ? ['正式采集', '媒体采集', '来源快照'] : page.module === 'CHN' ? ['店铺草稿同步', '映射校验', '回执对账'] : page.module === 'ORD' ? ['订单增量同步', '订单全量校验', '失败项重放'] : ['业务任务', '状态校验', '证据回传'];
    return Array.from({ length: 9 }, (_, i) => ({ id: `TSK-${page.module}-${String(2026092001 + i)}`, type: labels[i % labels.length], state: ['待执行', '执行中', '等待人工处理', '成功', '结果待确认'][i % 5], businessId: genericRows(page)[i % genericRows(page).length]?.__id || `OBJ-${i + 1}`, priority: ['普通', '高', '普通'][i % 3], retry: i % 3, lease: i % 5 === 1 ? 'WKR-HOME-01 / 42s' : '—', attempt: `ATT-${i + 1}`, error: i % 5 === 2 ? 'CAPTCHA_REQUIRED' : i % 5 === 4 ? 'EXTERNAL_RESULT_UNKNOWN' : '—', trace: `tr_${page.module.toLowerCase()}_${i + 1}`, started: `2026-09-20 1${i % 6}:12:00`, ended: i % 5 === 3 ? `2026-09-20 1${i % 6}:16:00` : '—' }));
  }

  function renderTaskPage(page) {
    return `${renderPageHeader(page)}${['SRC', 'CHN', 'ORD', 'TSK'].includes(page.module) ? renderWorkflowStrip(page.id) : ''}<section class="task-summary-grid">${[['待执行', 8, 'warn'], ['执行中', 3, 'running'], ['等待人工处理', 2, 'warn'], ['结果待确认', 1, 'danger'], ['今日成功', 26, 'ok']].map(item => `<article class="card task-summary"><span>${item[0]}</span><strong>${item[1]}</strong><span class="status-tag ${item[2]}">${item[0]}</span></article>`).join('')}</section>${renderFilters(page)}<section class="card table-card">${renderToolbar(page)}${renderTaskTable(page)}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderTaskTable(page) {
    const rows = taskRows(page);
    return `<div class="table-scroll"><table><thead><tr><th>任务 ID</th><th>业务类型</th><th>业务 ID</th><th>状态</th><th>优先级</th><th>RetryCount</th><th>LeaseOwner / TTL</th><th>AttemptID</th><th>ErrorCode</th><th>TraceID</th><th>开始/结束</th><th>操作</th></tr></thead><tbody>${rows.map(row => `<tr><td><button class="row-link mono" data-task-detail="${row.id}">${row.id}</button></td><td>${row.type}</td><td class="mono">${row.businessId}</td><td><span class="status-tag ${statusClass(row.state)}">${row.state}</span></td><td>${row.priority}</td><td>${row.retry}</td><td>${row.lease}</td><td class="mono">${row.attempt}</td><td class="mono">${row.error}</td><td class="mono">${row.trace}</td><td>${row.started}<br><span class="muted">${row.ended}</span></td><td><button class="button small ghost" data-task-detail="${row.id}" title="LocalAction: TASK_DRAWER">详情</button></td></tr>`).join('')}</tbody></table></div>`;
  }

  function renderCollectionTasks(page) {
    return renderTaskPage(page);
  }

  function renderCollectionRecords(page) {
    return renderListPage(page, `<button class="button" data-go="PRD-050">查看已落库商品</button>`);
  }

  function renderProductList(page) {
    return renderListPage(page, `<span class="toolbar-note">采集完成后由 Server 创建 SourceProduct；通过验收后生成 ProductDraft</span>`);
  }

  function renderProductDetail(page) {
    const row = domain.products.find(item => item.__id === state.routeParams.entityId) || domain.products[0];
    const frozenActions = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    const actions = `${frozenActions}${renderDesignAction('GAP-UI-003', '编辑商品', 'primary', '冻结详情页缺少明确“编辑商品”ButtonID')}`;
    return `${renderPageHeader(page, actions)}${renderWorkflowStrip(page.id)}<section class="card detail-hero"><div class="detail-key"><small>落库商品</small><strong>${safe(row.商品名称)}</strong><span class="mono">${row.商品ID} · ${row.商品编码}</span></div><span class="status-tag warn">${row.商品状态中文}</span></section><div class="detail-tabs"><section class="card"><div class="tabs"><button class="tab-button active">基础信息</button><button class="tab-button" data-go="PRD-053">SKU</button><button class="tab-button" data-go="PRD-056">媒体</button><button class="tab-button" data-go="PRD-057">分类属性</button><button class="tab-button" data-go="PRD-058">成本利润</button></div><div class="detail-grid">${contentFields(page).map(field => `<div class="detail-cell" data-field-id="${field.FieldID}"><span>${field['中文名称']}</span><strong>${safe(row[field['中文名称']] ?? fieldValue(field, 0, page))}</strong></div>`).join('')}</div></section><aside class="card"><div class="card-head"><h3>来源与版本</h3><span class="meta-tag">可追溯</span></div><div class="card-body context-list"><div class="context-row"><span>来源商品</span><strong class="mono">${row.来源商品ID}</strong></div><div class="context-row"><span>当前版本</span><strong>${row.当前版本ID}</strong></div><div class="context-row"><span>草稿</span><strong>${row.草稿ID}</strong></div><div class="context-row"><span>店铺草稿</span><strong>尚未同步</strong></div></div></aside></div>${renderAuditTrail(page)}${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderProductEditor(page) {
    const row = domain.products.find(item => item.__id === state.routeParams.entityId) || domain.products[0];
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="notice warn page-notice">${icon('info')}<div><strong>当前为商品草稿 rev.${state.workflow.productRevision}</strong><p>保存草稿只增加 DraftRevision；不会覆盖已发布 ProductVersion。预览有效后才能进入店铺草稿同步。</p></div></div><div class="form-layout"><section class="card"><div class="tabs"><button class="tab-button active">基础信息</button><button class="tab-button" data-go="PRD-053">SKU</button><button class="tab-button" data-go="PRD-056">媒体</button><button class="tab-button" data-go="PRD-057">分类属性</button><button class="tab-button" data-go="PRD-058">成本利润</button><button class="tab-button" data-go="PRD-059">AI 辅助</button></div><div class="card-body"><div class="form-grid">${contentFields(page).map((field, index) => renderInputForField(page, field, index)).join('')}</div></div><div class="form-footer">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('')}${renderDesignAction('GAP-UI-004', '保存并进入店铺草稿', 'primary', '跨域编排需明确 ButtonID/API')}</div></section>${renderContextCard(page, row)}</div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderProductPreview(page) {
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}${renderPreviewPage(page).replace(renderPageHeader(page), '').replace(renderFieldCoverage(page), '').replace(renderSpecStrip(page), '')}${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderChannelPreview(page) {
    const product = domain.products.find(item => item.__id === state.routeParams.entityId) || domain.products[0];
    const channel = domain.channels[0];
    const actions = page.buttons.filter(button => canUseButton(page, button));
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<section class="card preview-context"><div class="preview-context-item"><span>内部商品</span><strong>${product.商品ID}</strong></div><div class="preview-context-item"><span>目标店铺</span><strong>小红书 · 青鸟生活馆</strong></div><div class="preview-context-item"><span>商品/映射版本</span><strong>${product.当前版本ID} / ${channel.映射版本ID}</strong></div><div class="preview-context-item"><span>目标结果</span><strong>店铺草稿（不会自动上架）</strong></div></section><div class="preview-main"><section class="card product-preview">${renderProductPreviewContent(product, false)}</section><aside class="card"><div class="card-head"><div><h2>同步前校验</h2><small>PayloadHash qn-payload-9af21</small></div><span class="status-tag ok">有效</span></div><div class="card-body validation-list">${renderValidationItems(false)}<div class="notice">${icon('info')}<div><strong>本轮目标是店铺草稿</strong><p>“确认发布”在本原型中创建 PublishTask 并写入/更新平台草稿；是否上架仍需单独的人工确认契约。</p></div></div></div><div class="form-footer">${actions.map(button => renderActionButton(page, button, false)).join('')}</div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderPublishTasks(page) {
    return `${renderTaskPage(page).replace(renderPageHeader(page), renderPageHeader(page))}<div class="notice success floating-summary">${icon('check')}<div><strong>任务目标：平台店铺草稿</strong><p>只有 ExternalResultStatus=SUCCESS、外部草稿 ID、PayloadHash 与 Evidence 均通过 Server 校验后才标记成功。</p></div></div>`;
  }

  function renderOrderList(page) {
    return renderListPage(page, `<button class="button" data-go="ORD-077">订单回流任务</button>`);
  }

  function renderOrderSync(page) {
    const results = [['新增', 6, 'ok'], ['更新', 3, 'running'], ['未变化', 18, 'neutral'], ['跳过', 1, 'warn'], ['失败', 1, 'danger']];
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="sync-console"><section class="card"><div class="card-head"><div><h2>订单增量回流</h2><small>电商平台 API → NAS Server；外部订单号幂等</small></div><span class="status-tag ${state.workflow.orderSyncBatch === '待启动' ? 'warn' : 'running'}">${state.workflow.orderSyncBatch}</span></div><div class="card-body"><div class="form-grid"><div class="field"><label>目标店铺</label><select class="select"><option>小红书 · 青鸟生活馆</option><option>微信小店 · 青鸟优选</option></select></div><div class="field"><label>同步方式</label><select class="select"><option>增量游标</option><option>指定时间范围</option></select></div><div class="field"><label>起始水位</label><input class="input mono" value="cursor_20260920_1400" readonly></div><div class="field"><label>每批数量</label><input class="input" value="500"></div></div><div class="notice page-notice">${icon('info')}<div><strong>逐条结果与游标同批提交</strong><p>失败项可重放，但不得重复建单；游标保存失败时整批不得伪装成功。</p></div></div></div><div class="form-footer">${renderDesignAction('GAP-UI-005', '开始订单同步')}</div></section><aside class="card"><div class="card-head"><h2>最近批次结果</h2><span class="meta-tag">ACC-ORD-001</span></div><div class="card-body"><div class="result-grid">${results.map(item => `<div class="result-tile"><span>${item[0]}</span><strong>${item[1]}</strong><i class="${item[2]}"></i></div>`).join('')}</div><div class="context-list sync-meta"><div class="context-row"><span>批次</span><strong class="mono">BATCH-ORD-20260920-015</strong></div><div class="context-row"><span>保存水位</span><strong class="mono">cursor_20260920_1530</strong></div><div class="context-row"><span>幂等键</span><strong class="mono">store+externalOrderId</strong></div><div class="context-row"><span>TraceID</span><strong class="mono">tr_ord_sync_015</strong></div></div></div></aside></div>${renderTaskPage(page).replace(renderPageHeader(page), '').replace(renderWorkflowStrip(page.id), '').replace(renderFieldCoverage(page), '').replace(renderSpecStrip(page), '')}${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderPurchaseConfirm(page) {
    const purchase = domain.purchases.find(item => item.__id === state.routeParams.entityId) || domain.purchases[2];
    const blocked = purchase.__state === 'PRICE_CHANGED';
    return `${renderPageHeader(page)}${renderWorkflowStrip(page.id)}<div class="confirm-layout"><section class="card"><div class="card-head"><div><h2>采购确认</h2><small>${purchase.采购单ID} · 关联 ${purchase.订单ID}</small></div><span class="status-tag ${blocked ? 'danger' : 'warn'}">${purchase.采购状态中文}</span></div><div class="card-body"><div class="order-product"><div class="selection-thumb">${icon('box', 28)}</div><div><strong>${safe(purchase.商品名称)}</strong><small>${safe(purchase.供应商名称)} · 数量 ${purchase.商品数量}</small></div><strong class="money">¥ ${purchase.采购金额}</strong></div><div class="compare-grid"><div><span>建议生成时价格</span><strong>¥ 48.00</strong></div><div><span>货源平台当前价格</span><strong class="${blocked ? 'danger-text' : ''}">¥ ${purchase.采购金额}</strong></div><div><span>库存/SKU</span><strong>${blocked ? '价格变化，需重新确认' : '有货 · 已匹配'}</strong></div></div>${blocked ? `<div class="notice danger page-notice">${icon('alert')}<div><strong>价格发生变化，禁止确认采购</strong><p>必须刷新建议或由家庭成员明确接受新价格；系统不得自动外部下单。</p></div></div>` : ''}</div><div class="form-footer">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('')}</div></section><aside class="card"><div class="card-head"><h2>采购边界</h2><span class="meta-tag">ACC-PUR-001</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>授权家庭成员明确确认</strong><small>PC Worker 不能代替采购确认</small></div></div><div class="validation-item ${blocked ? 'warn' : 'ok'}"><span class="validation-mark">${blocked ? '!' : '✓'}</span><div><strong>价格、库存与 SKU 二次校验</strong><small>${blocked ? '当前存在阻断差异' : '校验通过'}</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>货源平台执行回执</strong><small>外部采购号与 Evidence 验证后入库</small></div></div></div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderLogisticsTimeline(page) {
    const shipment = domain.shipments.find(item => item.__id === state.routeParams.entityId) || domain.shipments[2];
    const unknown = shipment.__state === 'UNKNOWN';
    const events = [
      ['2026-09-20 10:02', '货源平台', '供应商已发货', '货源平台回传运单号与承运商'],
      ['2026-09-20 10:03', 'NAS Server', '物流对象已创建', '关联 Order + Purchase；校验 TrackingNo 与 Evidence'],
      ['2026-09-20 10:04', '电商店铺', unknown ? '同步待确认' : '发货信息同步成功', unknown ? '平台未返回确定回执，进入 UNKNOWN' : '店铺订单已更新为已发货'],
      ['2026-09-20 14:42', '承运商', '运输中', '杭州转运中心已发出']
    ];
    const frozenActions = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    return `${renderPageHeader(page, frozenActions)}${renderWorkflowStrip(page.id)}<section class="card preview-context"><div class="preview-context-item"><span>物流 ID</span><strong>${shipment.物流ID}</strong></div><div class="preview-context-item"><span>订单 / 采购</span><strong>${shipment.订单ID} / ${shipment.采购单ID}</strong></div><div class="preview-context-item"><span>物流单号</span><strong>${shipment.物流单号}</strong></div><div class="preview-context-item"><span>当前状态</span><strong>${shipment.青鸟物流状态中文}</strong></div></section><div class="timeline-layout"><section class="card"><div class="card-head"><div><h2>物流同步链路</h2><small>货源平台 → NAS Server → 电商店铺；每段独立记录结果</small></div><span class="status-tag ${unknown ? 'danger' : 'running'}">${shipment.青鸟物流状态中文}</span></div><div class="card-body event-timeline">${events.map((event, i) => `<div class="timeline-event ${i < 2 || !unknown ? 'done' : i === 2 ? 'blocked' : ''}"><span class="timeline-dot">${i < 2 || !unknown ? '✓' : i + 1}</span><div><time>${event[0]} · ${event[1]}</time><strong>${event[2]}</strong><p>${event[3]}</p></div></div>`).join('')}</div></section><aside class="card"><div class="card-head"><h2>一致性与对账</h2><span class="meta-tag">ACC-LOG-001</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>Order / Purchase 关联完整</strong><small>关联链可追踪</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>承运商与 TrackingNo 有效</strong><small>${shipment.物流商名称} · ${shipment.物流单号}</small></div></div><div class="validation-item ${unknown ? 'warn' : 'ok'}"><span class="validation-mark">${unknown ? '!' : '✓'}</span><div><strong>店铺同步结果</strong><small>${unknown ? 'UNKNOWN：只读对账或人工裁决，禁止自动重放' : '外部执行成功且 Evidence 已验证'}</small></div></div></div><div class="form-footer">${unknown ? renderDesignAction('GAP-UI-006', '执行只读对账') : '<span class="status-tag ok">同步完成</span>'}</div></aside></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderHumanTaskCenter(page) {
    return `${renderPageHeader(page)}<div class="notice warn page-notice">${icon('shield')}<div><strong>人工只处理原会话中的阻塞点</strong><p>HUMAN 不能绕过采购、发布或售后确认，也不能直接写业务状态；PC 回传结果后仍由 Server 裁决。</p></div></div><section class="task-summary-grid">${[['待认领', 3, 'warn'], ['处理中', 2, 'running'], ['登录失效', 1, 'danger'], ['验证码/扫码', 2, 'warn'], ['结果待确认', 1, 'danger']].map(item => `<article class="card task-summary"><span>${item[0]}</span><strong>${item[1]}</strong><span class="status-tag ${item[2]}">${item[0]}</span></article>`).join('')}</section>${renderFilters(page)}<section class="card table-card">${renderToolbar(page)}${renderTaskTable(page)}</section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderTreePage(page) {
    const fields = contentFields(page);
    return `${renderPageHeader(page)}<div class="tree-layout"><aside class="card tree-panel"><div class="card-head"><h2>分类树</h2><button class="button small">展开全部</button></div><div class="tree-list"><button class="tree-node active">▾ 家居日用</button><button class="tree-node child">▾ 收纳整理</button><button class="tree-node leaf">收纳箱</button><button class="tree-node leaf">收纳袋</button><button class="tree-node child">桌面用品</button><button class="tree-node">箱包服饰</button></div></aside><section class="card"><div class="card-head"><div><h2>${safe(page.name)}</h2><small>当前：家居日用 / 收纳整理</small></div>${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button)).join('')}</div><div class="detail-grid">${fields.map((field, i) => `<div class="detail-cell" data-field-id="${field.FieldID}"><span>${field['中文名称']}</span><strong>${safe(fieldValue(field, i, page))}</strong></div>`).join('')}</div></section></div>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderMatrixPage(page) {
    const roles = ['家庭管理员', '商品运营', '采购成员', '财务成员', '人工处理员', '观察成员'];
    const modules = ['商品供给', '店铺草稿', '订单中心', '采购中心', '财务与利润', '系统管理'];
    return `${renderPageHeader(page)}<section class="card table-card"><div class="toolbar"><div class="toolbar-left">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button)).join('')}</div><span class="toolbar-note">角色 + PermissionCode + StoreScope + ObjectScope</span></div><div class="table-scroll"><table><thead><tr><th>家庭岗位</th>${modules.map(item => `<th>${item}</th>`).join('')}</tr></thead><tbody>${roles.map((role, r) => `<tr><td class="cell-primary">${role}</td>${modules.map((_, c) => `<td><select class="select compact"><option>${r === 0 ? '管理' : (r + c) % 3 === 0 ? '无权' : (r + c) % 2 ? '只读' : '操作'}</option></select></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }

  function renderSpecStrip(page) {
    if (!reviewToolsVisible()) return '';
    const spec = pageSpecs.get(page.id);
    return `<div class="spec-strip"><span>逐页规格 ${safe(spec?.specKey || page.id)} · 字段 ${page.fields.length}/${page.fields.length} · 按钮 ${page.buttons.length}/${page.buttons.length} · API ${page.apiIds.length} · NavigationContext ${spec?.routeContract.length || 10} 项</span><button data-open-trace>查看 Page / Field / Button / API / Test →</button></div>`;
  }

  const pcDesigns = {
    'PC-003': { kind: 'status', title: 'Worker 运行状态', description: '节点心跳、能力、并发和当前租约' },
    'PC-004': { kind: 'profiles', title: 'BrowserProfile 管理', description: '账号隔离、写租约和登录健康；禁止透明切换 Profile' },
    'PC-005': { kind: 'sessions', title: 'BrowserSession', description: '运行会话、页面地址、检查点与人工接管入口' },
    'PC-006': { kind: 'versions', title: 'RouteSnapshot', description: '任务创建时固化的路由版本和页面签名' },
    'PC-007': { kind: 'versions', title: 'Adapter', description: '定位器、能力实现、版本、验证状态与已知问题' },
    'PC-008': { kind: 'versions', title: 'Fixture', description: '验证样本、断言和回归结果' },
    'PC-009': { kind: 'execute', title: '商品探查执行', description: '执行搜索、提取候选摘要并回传探查结果' },
    'PC-010': { kind: 'execute', title: '正式采集执行', description: '采集详情、SKU、媒体、快照与 Evidence' },
    'PC-011': { kind: 'human', title: '采集人工处理', description: '验证码、风控和页面改版的原会话接管' },
    'PC-012': { kind: 'transfer', title: '媒体下载/上传', description: 'Hash、断点、MediaManifest 与 NAS 存储回执' },
    'PC-013': { kind: 'human', title: '登录人工处理', description: '扫码、二次验证和 Cookie 失效处理' },
    'PC-014': { kind: 'execute', title: '店铺草稿同步执行', description: '按 PublishTask 快照创建或更新店铺草稿' },
    'PC-015': { kind: 'reconcile', title: '发布回执对账', description: '外部写结果未知时只读对账，不直接重放' },
    'PC-016': { kind: 'execute', title: '订单同步执行', description: '按游标抓取订单并逐条回传结果' },
    'PC-017': { kind: 'assist', title: '采购执行辅助', description: '只执行已由家庭成员确认的 PurchaseOrder' },
    'PC-018': { kind: 'execute', title: '物流同步执行', description: '读取货源物流并向店铺回写发货信息' },
    'PC-019': { kind: 'assist', title: '售后平台协查', description: '只读协查、证据采集与授权动作执行' },
    'PC-020': { kind: 'diagnostic', title: 'PC 诊断/日志', description: '环境、自检、网络、浏览器、适配器和脱敏日志' }
  };

  function renderPcPage(page) {
    if (!page) return renderNotFound();
    if (page.id === 'PC-001') return renderPcHome(page);
    if (page.id === 'PC-002') return renderPcPairing(page);
    const design = pcDesigns[page.id];
    if (!design) return renderPcContract(page, '未配置页面类型');
    if (design.kind === 'status') return renderPcStatus(page, design);
    if (design.kind === 'profiles') return renderPcProfiles(page, design);
    if (design.kind === 'sessions') return renderPcSessions(page, design);
    if (design.kind === 'versions') return renderPcVersions(page, design);
    if (design.kind === 'human') return renderPcHuman(page, design);
    if (design.kind === 'transfer') return renderPcTransfer(page, design);
    if (design.kind === 'reconcile') return renderPcReconcile(page, design);
    if (design.kind === 'assist') return renderPcAssist(page, design);
    if (design.kind === 'diagnostic') return renderPcDiagnostic(page, design);
    return renderPcExecution(page, design);
  }

  function renderPcHeader(page, design = {}) {
    return `<div class="page-head"><div class="page-title-block"><div class="eyebrow"><span>${safe(page.category)}</span><span>·</span><code>${safe(page.id)}</code><span class="meta-tag">独立页面规格</span></div><h1>${safe(design.title || page.name)}</h1><p class="page-subtitle">${safe(design.description || 'PC Worker 只执行 Server 下发的不可变上下文，不写业务数据库、不自行裁决状态。')}</p></div><div class="page-actions"><button class="button" data-open-trace>${icon('trace', 15)}冻结契约</button></div></div>`;
  }

  function renderWorkerHero(status = '在线') {
    return `<section class="card worker-hero"><div class="worker-id"><div class="worker-icon">${icon('monitor', 24)}</div><div><strong>WKR-HOME-01</strong><small>已与 NAS Server 配对 · TLS 1.3 · 设备指纹已验证</small></div></div><div class="worker-stats"><div class="worker-stat"><span>状态</span><strong>${status}</strong></div><div class="worker-stat"><span>最近心跳</span><strong>3 秒前</strong></div><div class="worker-stat"><span>版本</span><strong>3.9.20</strong></div></div></section>`;
  }

  function renderPcHome(page) {
    return `${renderPcHeader(page, { title: 'PC Worker 首页', description: '查看本机能力与 Server 分配的任务；业务事实仍由 NAS Server 管理。' })}${renderWorkerHero()}<section class="metrics-grid">${[['待领取任务', 4, 'Server 队列'], ['执行中', 1, 'Profile 独占'], ['等待人工', 1, '原会话接管'], ['今日完成', 26, 'Evidence 完整']].map(item => `<article class="card metric-card"><div class="metric-label"><span>${item[0]}</span><span>${item[2]}</span></div><div class="metric-value">${item[1]}</div><div class="metric-meta">状态由 <strong>Server 裁决</strong></div></article>`).join('')}</section><div class="dashboard-grid"><section class="card"><div class="card-head"><div><h2>可领取任务</h2><small>能力、版本和 Profile 匹配后才能 Claim</small></div><button class="button small" data-pc-action="refresh">${icon('refresh', 14)}刷新</button></div><div class="task-list">${[['正式采集', '1688 · 商品 883412790106', 'PC-010'], ['店铺草稿同步', '小红书 · 青鸟生活馆', 'PC-014'], ['订单同步', '微信小店 · cursor_1530', 'PC-016'], ['发布对账', '结果待确认 · PublishTask 016', 'PC-015']].map((item, i) => `<div class="task-item"><span class="task-severity ${i === 3 ? 'danger' : ''}"></span><div><div class="task-title"><strong>${item[0]}</strong><span class="status-tag ${i === 3 ? 'danger' : 'warn'}">${i === 3 ? '结果待确认' : '待执行'}</span></div><div class="task-detail">${item[1]}</div></div><button class="button small ${i === 0 ? 'primary' : ''}" data-go-pc="${item[2]}">打开</button></div>`).join('')}</div></section><aside class="card"><div class="card-head"><h2>本机环境</h2><span class="status-tag ok">可执行</span></div><div class="card-body context-list"><div class="context-row"><span>操作系统</span><strong>Windows 11 23H2 x64</strong></div><div class="context-row"><span>浏览器</span><strong>Edge 138 · Chrome 137</strong></div><div class="context-row"><span>BrowserProfile</span><strong>3 个 · 2 个可用</strong></div><div class="context-row"><span>Adapter / Fixture</span><strong>全部通过自检</strong></div><div class="context-row"><span>本地业务数据</span><strong>无 · 仅缓存 ExecutionContext</strong></div></div><div class="form-footer"><button class="button" data-go-pc="PC-020">运行诊断</button></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcPairing(page) {
    return `${renderPcHeader(page, { title: 'Worker 配对', description: '使用 OWNER 生成的一次性配对码建立受信执行节点。' })}${renderWorkerHero('未配对')}<div class="form-layout"><section class="card"><div class="card-head"><div><h2>配对此设备</h2><small>配对码使用后立即失效</small></div><span class="status-tag warn">待确认</span></div><div class="card-body"><div class="form-grid"><div class="field full"><label>NAS Server 地址<span class="required">*</span></label><input class="input" value="https://qingniao-nas.local"><span class="field-help">必须使用 HTTPS 并校验证书指纹</span></div><div class="field"><label>设备名称<span class="required">*</span></label><input class="input" value="家庭主电脑"></div><div class="field"><label>一次性配对码<span class="required">*</span></label><input class="input mono" value="QN-842-761"></div></div><div class="notice page-notice">${icon('info')}<div><strong>配对不复制业务数据库</strong><p>本机只保存 WorkerToken 引用、设备密钥和运行配置。</p></div></div></div><div class="form-footer"><button class="button primary" data-pc-action="pair">验证并配对</button></div></section><aside class="card sticky-card"><div class="card-head"><h3>安全校验</h3><span class="meta-tag">双向信任</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>设备指纹</strong><small>TPM / 系统密钥库</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>Server 证书</strong><small>指纹由 OWNER 现场核对</small></div></div><div class="validation-item warn"><span class="validation-mark">!</span><div><strong>待 OWNER 确认</strong><small>未确认前不能 Claim 任务</small></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcStatus(page, design) {
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<section class="metrics-grid">${[['CPU', '18%', '正常'], ['内存', '2.4 GB', '正常'], ['活动租约', '1', 'Profile 独占'], ['队列延迟', '1.2s', 'P95 < 5s']].map(item => `<article class="card metric-card"><div class="metric-label"><span>${item[0]}</span><span>${item[2]}</span></div><div class="metric-value small-value">${item[1]}</div></article>`).join('')}</section><div class="dashboard-grid"><section class="card"><div class="card-head"><h2>当前任务与租约</h2><span class="status-tag running">执行中</span></div><div class="card-body context-list"><div class="context-row"><span>Task / Attempt</span><strong class="mono">TSK-SRC-20260920-021 / ATT-02</strong></div><div class="context-row"><span>BrowserProfile</span><strong>采购账号 · Profile-01</strong></div><div class="context-row"><span>LeaseOwner / TTL</span><strong>WKR-HOME-01 / 42 秒</strong></div><div class="context-row"><span>Heartbeat</span><strong>每 15 秒 · 45 秒失联 · 60 秒租约</strong></div></div></section><aside class="card"><div class="card-head"><h2>能力清单</h2><span class="meta-tag">Server 匹配</span></div><div class="card-body capability-grid"><span>货源探查</span><span>正式采集</span><span>媒体传输</span><span>店铺草稿同步</span><span>订单同步</span><span>物流同步</span></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcProfiles(page, design) {
    const rows = [['PROF-SRC-01', '1688 家庭采购账号', 'Edge 138', '有效', '空闲', '2026-09-20 14:51'], ['PROF-XHS-01', '小红书运营账号', 'Edge 138', '需要登录', '人工占用', '2026-09-20 14:32'], ['PROF-WX-01', '微信小店运营账号', 'Chrome 137', '有效', '写租约 42s', '2026-09-20 14:50']];
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<section class="card table-card"><div class="toolbar"><div class="toolbar-left"><button class="button primary">新增 Profile</button><button class="button">检查登录健康</button></div><span class="toolbar-note">同一 Profile 同时只允许一个外部写任务</span></div><div class="table-scroll"><table><thead><tr><th>Profile ID</th><th>绑定账号</th><th>浏览器基线</th><th>登录健康</th><th>占用/租约</th><th>最后检查</th><th>操作</th></tr></thead><tbody>${rows.map(row => `<tr>${row.map((value, i) => `<td class="${i === 0 ? 'mono' : ''}">${i === 3 || i === 4 ? `<span class="status-tag ${statusClass(value)}">${value}</span>` : value}</td>`).join('')}<td><button class="button small">查看</button></td></tr>`).join('')}</tbody></table></div></section><div class="notice warn page-notice">${icon('shield')}<div><strong>禁止透明切换 BrowserProfile</strong><p>任务固化 Profile；登录失效时进入 WAIT_LOGIN，必须结束 Attempt 并重新授权。</p></div></div>${renderPcContract(page)}`;
  }

  function renderPcSessions(page, design) {
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="execution-grid"><aside class="card"><div class="card-head"><h3>会话列表</h3><span class="meta-tag">3</span></div><div class="session-list"><button class="session-item active"><strong>SES-20260920-021</strong><small>正式采集 · 执行中</small></button><button class="session-item"><strong>SES-20260920-016</strong><small>发布对账 · 只读</small></button><button class="session-item"><strong>SES-20260920-013</strong><small>等待人工 · 验证码</small></button></div></aside><section class="card"><div class="card-head"><div><h2>当前 BrowserSession</h2><small>原会话接管，不重新创建 Profile</small></div><span class="status-tag running">执行中</span></div><div class="card-body context-list"><div class="context-row"><span>Task / Attempt</span><strong class="mono">TSK-SRC-021 / ATT-02</strong></div><div class="context-row"><span>Profile</span><strong>PROF-SRC-01（独占）</strong></div><div class="context-row"><span>当前 URL</span><strong class="mono">https://detail.1688.example/offer/883412790106</strong></div><div class="context-row"><span>页面签名</span><strong class="mono">sha256:84ab…91d2</strong></div><div class="context-row"><span>最后检查点</span><strong>SKU 2/3 已提取</strong></div></div><div class="form-footer"><button class="button">请求人工接管</button><button class="button danger">请求取消</button></div></section><aside class="card"><div class="card-head"><h3>安全显示</h3></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>Cookie/Token 已掩码</strong><small>不进入 UI、日志、Evidence 文本</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>窗口归属明确</strong><small>Task + Attempt + Profile</small></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcVersions(page, design) {
    const noun = page.name;
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="dashboard-grid"><section class="card table-card"><div class="toolbar"><div class="toolbar-left"><button class="button">刷新版本</button><button class="button primary">执行验证</button></div><span class="toolbar-note">新版本不改变运行中任务</span></div><div class="table-scroll"><table><thead><tr><th>${noun} ID</th><th>版本</th><th>能力</th><th>验证状态</th><th>验证时间</th><th>到期时间</th><th>Evidence</th></tr></thead><tbody>${Array.from({ length: 5 }, (_, i) => `<tr><td class="mono">${page.id.replace('PC-', noun.slice(0, 3).toUpperCase())}-${i + 1}</td><td>v${12 - i}</td><td>${['商品采集', '店铺草稿', '订单同步'][i % 3]}</td><td><span class="status-tag ${i === 3 ? 'danger' : 'ok'}">${i === 3 ? '已阻断' : '已验证'}</span></td><td>2026-09-${18 - i}</td><td>2026-${i % 2 ? '12' : '10'}-${18 - i}</td><td><button class="button small ghost">查看</button></td></tr>`).join('')}</tbody></table></div></section><aside class="card"><div class="card-head"><h2>执行准入</h2><span class="meta-tag">ADAPT-001~008</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>状态必须为 VALIDATED</strong><small>且未超过 ExpiresAt</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>任务固化版本</strong><small>Adapter / Fixture / RouteSnapshot</small></div></div><div class="validation-item warn"><span class="validation-mark">!</span><div><strong>签名变化立即阻断</strong><small>ENDPOINT_CHANGED → 人工验证新版本</small></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcExecution(page, design) {
    const stepMap = {
      'PC-009': ['Claim 租约', '调用搜索/打开列表', '提取候选摘要', '去重与分页', '回传 DiscoveryResult'],
      'PC-010': ['Claim 租约', '打开商品详情', '提取标题/价格/SKU', '下载媒体并生成 Hash', '保存 SourceSnapshot', '回传 Result/Evidence'],
      'PC-014': ['Claim 租约', '校验 PublishSnapshot', '打开店铺工作台', '创建/更新店铺草稿', '读取外部草稿 ID', '回传 Result/Evidence'],
      'PC-016': ['Claim 租约', '读取同步水位', '拉取订单分页', '逐条标准化', '回传逐条结果', '保存游标'],
      'PC-018': ['Claim 租约', '读取货源物流', '校验运单与承运商', '回传 Shipment', '向店铺同步发货', '回传外部结果']
    };
    const steps = stepMap[page.id] || page.steps.split('→').map(item => item.trim()).filter(Boolean);
    const pc = state.pcTask;
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="execution-grid"><aside class="card execution-context"><div class="card-head"><div><h3>不可变执行上下文</h3><small>本地只读</small></div><span class="status-tag ${statusClass(pcStatusName(pc.status))}">${pcStatusName(pc.status)}</span></div><div class="card-body"><div class="context-code">ExecutionContextID: ctx_8b21…91d0<br>TaskID: TSK-${page.id}-021<br>AttemptID: ATT-02<br>Platform / Account / Store: Server 固化<br>BrowserProfile: PROF-01<br>RouteSnapshot: rte_7f2d…19a4 v12<br>Adapter / Fixture: 3.9.20 / 2026.09.18<br>LeaseToken: ••••••••</div><div class="notice warn page-notice">${icon('shield')}<div><strong>不得本地猜测或改写</strong><p>上下文变化必须结束 Attempt，由 Server 创建新任务。</p></div></div></div></aside><section class="card"><div class="card-head"><div><h2>执行步骤</h2><small>Heartbeat 15s · 失联 45s · Lease 60s</small></div><span class="meta-tag">${safe(page.category)}</span></div><div class="card-body"><div class="stepper">${steps.map((step, i) => `<div class="step-row ${i < pc.step ? 'done' : i === pc.step && pc.status !== 'READY' ? 'active' : ''}"><span class="step-dot">${i < pc.step ? '✓' : i + 1}</span><strong>${safe(step)}</strong><small>${i < pc.step ? '检查点已记录' : i === pc.step && pc.status !== 'READY' ? '当前步骤 · Progress 上报中' : '等待前置步骤'}</small></div>`).join('')}</div>${pc.status === 'WAIT_HUMAN' ? `<div class="notice danger">${icon('alert')}<div><strong>执行已暂停</strong><p>CAPTCHA_REQUIRED 已上报；只能由 HUMAN/OWNER 在原 Profile 处理。</p></div></div>` : ''}<div class="execution-controls">${renderPcControls(steps.length)}</div></div></section><aside class="card"><div class="card-head"><div><h3>Evidence 与输出</h3><small>脱敏后回传</small></div><span class="meta-tag">${pc.evidence.length} 条</span></div><div class="card-body"><div class="evidence-box">${pc.evidence.map(item => `<div class="evidence-item"><time>${safe(item.time)}</time>${safe(item.text)}</div>`).join('')}</div><div class="trace-section"><h3>ResultDTO</h3><p>${safe(page.output)}</p></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcHuman(page, design) {
    return `${renderPcHeader(page, design)}${renderWorkerHero('等待人工')}<div class="human-console"><section class="card"><div class="card-head"><div><h2>原会话人工接管</h2><small>HumanTask HT-20260920-003</small></div><span class="status-tag danger">CAPTCHA_REQUIRED</span></div><div class="browser-frame"><div class="browser-bar"><span></span><span></span><span></span><div>https://platform.example/login-or-captcha</div></div><div class="browser-body">${icon('shield', 48)}<strong>受控浏览器窗口</strong><p>原 BrowserProfile 保持暂停。这里只演示人工接管边界，不展示真实账号、Cookie 或验证码。</p><button class="button primary" data-pc-action="resume">我已在原窗口完成处理</button></div></div></section><aside class="card"><div class="card-head"><h2>处理规则</h2><span class="meta-tag">WAIT_HUMAN</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">1</span><div><strong>核对 Task/Attempt/Profile</strong><small>不得换号或换 Profile</small></div></div><div class="validation-item ok"><span class="validation-mark">2</span><div><strong>仅处理阻塞点</strong><small>不得手工继续后续业务步骤</small></div></div><div class="validation-item ok"><span class="validation-mark">3</span><div><strong>提交 HumanTaskResult</strong><small>由 Server 决定 Resume/Cancel/Rebuild</small></div></div><div class="notice warn">${icon('info')}<div><strong>敏感信息不回传</strong><p>Evidence 只记录页面、时间、处理结果和脱敏截图。</p></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcTransfer(page, design) {
    const items = [['IMG-001.jpg', '4.8 MB', 'sha256:81a4…7d2e', '已上传'], ['IMG-002.jpg', '3.2 MB', 'sha256:39c1…2f8a', '上传中 68%'], ['DETAIL-01.webp', '8.1 MB', 'sha256:77ab…09e1', '等待'], ['VIDEO-01.mp4', '31.4 MB', 'sha256:b10e…4a21', '等待']];
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="dashboard-grid"><section class="card table-card"><div class="toolbar"><div class="toolbar-left"><button class="button primary">继续传输</button><button class="button">校验 Hash</button></div><span class="toolbar-note">断点续传 · 目标 NAS 存储</span></div><div class="table-scroll"><table><thead><tr><th>文件</th><th>大小</th><th>Hash</th><th>状态</th></tr></thead><tbody>${items.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td class="mono">${row[2]}</td><td><span class="status-tag ${statusClass(row[3])}">${row[3]}</span></td></tr>`).join('')}</tbody></table></div></section><aside class="card"><div class="card-head"><h2>MediaManifest</h2><span class="status-tag running">3 / 6</span></div><div class="card-body context-list"><div class="context-row"><span>SourceProduct</span><strong class="mono">SRC-20260920-001</strong></div><div class="context-row"><span>总项数/已完成</span><strong>6 / 3</strong></div><div class="context-row"><span>总大小</span><strong>58.2 MB</strong></div><div class="context-row"><span>失败重试</span><strong>读/传输最多 3 次；5/30/120 秒</strong></div><div class="context-row"><span>存储写入</span><strong>Server 回执后才算完成</strong></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcReconcile(page, design) {
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="reconcile-layout"><section class="card"><div class="card-head"><div><h2>内部提交快照</h2><small>PublishTask PT-20260920-016</small></div><span class="status-tag danger">UNKNOWN</span></div><div class="card-body context-list"><div class="context-row"><span>PayloadHash</span><strong class="mono">sha256:9af2…0c18</strong></div><div class="context-row"><span>目标店铺</span><strong>小红书 · 青鸟生活馆</strong></div><div class="context-row"><span>商品版本</span><strong>PV-007</strong></div><div class="context-row"><span>请求时间</span><strong>2026-09-20 14:32:18</strong></div><div class="context-row"><span>回执</span><strong>连接中断，无确定结果</strong></div></div></section><section class="card"><div class="card-head"><div><h2>外部只读查询</h2><small>按草稿 ID / PayloadHash 特征检索</small></div><span class="status-tag warn">待对账</span></div><div class="card-body validation-list"><div class="validation-item warn"><span class="validation-mark">?</span><div><strong>找到疑似草稿 1 条</strong><small>标题与 SKU 一致，更新时间相近</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>未再次提交外部写</strong><small>避免重复创建草稿</small></div></div></div><div class="form-footer"><button class="button">标记不匹配</button><button class="button primary">提交对账证据</button></div></section></div><div class="notice warn page-notice">${icon('alert')}<div><strong>UNKNOWN 只允许对账或人工裁决</strong><p>禁止直接重试外部写；Server 验证外部草稿 ID、PayloadHash 和 Evidence 后才能裁决 SUCCESS。</p></div></div>${renderPcContract(page)}`;
  }

  function renderPcAssist(page, design) {
    const purchase = page.id === 'PC-017';
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<div class="confirm-layout"><section class="card"><div class="card-head"><div><h2>${purchase ? '已确认采购单' : '售后协查单'}</h2><small>Server 已签发只读或受限执行上下文</small></div><span class="status-tag ok">已授权</span></div><div class="card-body context-list"><div class="context-row"><span>业务对象</span><strong class="mono">${purchase ? 'PUR-20260920-001' : 'AS-20260920-004'}</strong></div><div class="context-row"><span>授权动作</span><strong>${purchase ? '创建货源采购单并读取外部采购号' : '查询平台售后状态与证据'}</strong></div><div class="context-row"><span>禁止动作</span><strong>${purchase ? '改价、换 SKU、增加数量、跳过家庭确认' : '未经 Server 决策直接退款/拒绝'}</strong></div><div class="context-row"><span>当前版本</span><strong class="mono">rv_004 · ctx_9e12…</strong></div></div><div class="form-footer"><button class="button primary" data-pc-action="claim">领取任务</button></div></section><aside class="card"><div class="card-head"><h2>执行前核对</h2><span class="meta-tag">不可变</span></div><div class="card-body validation-list"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>家庭成员确认已存在</strong><small>Actor 与审计记录完整</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>价格/SKU/数量快照已固化</strong><small>变化即停止并回传冲突</small></div></div><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>结果需 Server 二次校验</strong><small>PC 不裁决业务状态</small></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function renderPcDiagnostic(page, design) {
    const checks = [['Server TLS 与证书', '通过', 'ok'], ['Heartbeat 延迟', '38 ms', 'ok'], ['Edge 138 启动', '通过', 'ok'], ['Profile 写锁', '1 个活动租约', 'running'], ['Adapter 回归', '19/20 通过', 'warn'], ['磁盘可用空间', '128 GB', 'ok']];
    const logs = ['14:50:12 INFO heartbeat ack=38ms worker=WKR-HOME-01', '14:50:16 INFO claim rejected reason=LEASE_CONFLICT profile=PROF-WX-01', '14:50:19 WARN adapter validation 19/20 route=product-edit', '14:50:21 INFO evidence stored trace=tr_diag_8a21 secret=[REDACTED]', '14:50:24 INFO server connection healthy tls=1.3'].join('\n');
    return `${renderPcHeader(page, design)}${renderWorkerHero()}<section class="metrics-grid diagnostic-grid">${checks.map(item => `<article class="card diagnostic-tile"><span>${item[0]}</span><strong>${item[1]}</strong><i class="${item[2]}"></i></article>`).join('')}</section><div class="dashboard-grid"><section class="card"><div class="card-head"><div><h2>脱敏运行日志</h2><small>包含 TraceID，不包含 Secret/Cookie/Token</small></div><button class="button small">导出诊断包</button></div><pre class="log-console">${safe(logs)}</pre></section><aside class="card"><div class="card-head"><h2>建议动作</h2><span class="status-tag warn">1 项</span></div><div class="card-body"><div class="notice warn">${icon('alert')}<div><strong>product-edit 路由需复验</strong><p>页面签名变化；受影响 Adapter 已标记 VALIDATING，不再分配新任务。</p></div></div><div class="validation-list trace-section"><div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>其余关键能力可执行</strong><small>登录、采集、订单、物流</small></div></div></div></div></aside></div>${renderPcContract(page)}`;
  }

  function pcStatusName(code) { return ({ READY: '待执行', CLAIMED: '已认领', RUNNING: '执行中', WAIT_HUMAN: '等待人工处理', SUCCESS: '成功', FAILED: '失败', CANCELLED: '已取消', UNKNOWN: '结果待确认' })[code] || code; }

  function renderPcControls(stepCount) {
    const pc = state.pcTask;
    if (pc.status === 'READY') return `<button class="button primary" data-pc-action="claim">${icon('play', 15)}领取任务</button>`;
    if (pc.status === 'CLAIMED') return `<button class="button primary" data-pc-action="start">${icon('play', 15)}开始执行</button><button class="button danger" data-pc-action="cancel">请求取消</button>`;
    if (pc.status === 'RUNNING') return `<button class="button" data-pc-action="progress">${icon('refresh', 15)}上报进度</button><button class="button" data-pc-action="human">需要人工</button><button class="button primary" data-pc-action="submit" ${pc.step >= stepCount - 1 ? '' : 'disabled'}>提交 Result/Evidence</button>`;
    if (pc.status === 'WAIT_HUMAN') return `<button class="button primary" data-pc-action="resume">人工已完成，申请恢复</button><button class="button danger" data-pc-action="cancel">请求取消</button>`;
    return `<span class="status-tag ${statusClass(pcStatusName(pc.status))}">${pcStatusName(pc.status)}</span><button class="button" data-go-pc="PC-001">返回首页</button>`;
  }

  function renderPcContract(page, message = '') {
    return `<details class="card field-coverage pc-contract" ${state.reviewMode ? 'open' : ''}><summary><strong>${safe(page.id)} 冻结执行契约</strong><span>${safe(message || 'Input / Steps / HumanTakeover / Output / Boundary')}</span></summary><div class="contract-grid"><div><span>Input</span><strong>${safe(page.input)}</strong></div><div><span>Steps</span><strong>${safe(page.steps)}</strong></div><div><span>HumanTakeover</span><strong>${safe(page.humanTakeover)}</strong></div><div><span>Output</span><strong>${safe(page.output)}</strong></div><div><span>Boundary</span><strong>${safe(page.boundary)}</strong></div></div></details>`;
  }

  const requirementIssues = [
    { id: 'REQ-GAP-01', level: '阻塞开发契约', subject: 'SRC-045 确认采集', frozen: 'GET /api/v1/collections', finding: '确认采集是产生 CollectionTask 的命令，不应使用 GET。', proposal: '改为 POST /api/v1/collection-tasks 或等价命令；补充 IdempotencyKey、RequestHash 与审计。' },
    { id: 'REQ-GAP-02', level: '阻塞开发契约', subject: 'CHN-071 创建发布任务', frozen: 'GET /api/v1/channel-products', finding: '创建任务是写命令，且本轮业务目标为“同步店铺草稿”。', proposal: '明确 POST PublishTask；增加 targetMode=DRAFT，正式上架需另一项人工确认。' },
    { id: 'REQ-GAP-03', level: '阻塞开发契约', subject: 'PUR-085 确认采购', frozen: 'GET /api/v1/purchase-orders', finding: '采购确认必须是经授权家庭成员执行的写命令。', proposal: '改为 POST /purchase-orders/{id}:confirm；携带价格/SKU/库存快照及版本令牌。' },
    { id: 'REQ-GAP-04', level: '导航语义', subject: 'PRD-051 返回', frozen: 'TargetPageID=PRD-052', finding: '详情页“返回”被指向编辑页，不符合返回语义。', proposal: '返回以 NavigationContext.sourcePage 为准；“编辑商品”建立独立 ButtonID。' },
    { id: 'REQ-GAP-05', level: '导航语义', subject: 'SRC-045 返回探查', frozen: 'TargetPageID=SRC-046', finding: '按钮名称是返回探查，目标却是正式采集任务。', proposal: '返回恢复来源候选/探查页；采集确认成功后单独进入 SRC-046。' },
    { id: 'REQ-GAP-06', level: '导航语义', subject: 'LOGI-092 查看详情', frozen: 'TargetPageID=AS-093', finding: '物流轨迹查看详情跳入售后列表，业务对象不一致。', proposal: '应指向 LOGI-090，售后入口由异常规则单独触发。' },
    { id: 'REQ-GAP-07', level: '功能缺口', subject: '探查与订单同步创建动作', frozen: '页面只有刷新/查看/取消/重试', finding: '缺少创建探查任务、批量加入候选、启动订单同步等主流程入口。', proposal: '为 GAP-UI-001/002/005 建立正式 ButtonID、API、权限、状态和 TestID。' },
    { id: 'REQ-GAP-08', level: '边界需确认', subject: '“发布”与“店铺草稿”', frozen: '统一使用确认发布/发布成功', finding: '用户场景要求先同步到电商店铺草稿，未明确是否自动上架。', proposal: '默认安全边界为只创建/更新店铺草稿；正式上架必须另行人工确认并可审计。' }
  ];

  function renderOverlay() {
    const blocks = [];
    if (state.paletteOpen) blocks.push(renderPalette());
    if (state.traceOpen) blocks.push(renderTraceDrawer());
    if (state.issueDrawer) blocks.push(renderIssueDrawer());
    if (state.roleMenuOpen) blocks.push(renderRoleMenu());
    if (state.confirmAction) blocks.push(renderConfirmModal());
    if (state.detailDrawer) blocks.push(renderDetailDrawer());
    overlayRoot.innerHTML = blocks.join('');
    const activeId = state.mode === 'pc' ? state.activePc : state.activeWeb;
    annotateLocalControls(overlayRoot, activeId || 'OVERLAY');
    if (state.paletteOpen) setTimeout(() => document.getElementById('palette-input')?.focus(), 0);
  }

  function searchItems() {
    const q = state.paletteQuery.trim().toLowerCase();
    const web = requirements.pages.map(page => ({ type: 'WEB', id: page.id, name: page.name, detail: `${moduleMeta[page.module]?.label} · ${page.businessObject} · ${page.scenario}` }));
    const pc = requirements.pcPages.map(page => ({ type: 'PC', id: page.id, name: page.name, detail: `${page.category} · ${page.boundary}` }));
    return [...web, ...pc].filter(item => !q || `${item.id} ${item.name} ${item.detail}`.toLowerCase().includes(q)).slice(0, 80);
  }

  function renderPalette() {
    const items = searchItems();
    return `<div class="modal-backdrop" data-close-overlay><section class="palette" role="dialog" aria-modal="true" aria-label="页面台账" data-stop-close><div class="palette-search">${icon('search')}<input id="palette-input" value="${safe(state.paletteQuery)}" placeholder="搜索 145 个管理端页面和 20 个 PC 页面"><kbd>Esc</kbd></div><div class="palette-meta"><span>${items.length} 个匹配结果</span><span>上下文页直达时要求先选择对象</span></div><div class="palette-results">${items.map(item => `<button class="palette-item" data-palette-go="${item.type}:${item.id}"><span class="palette-type ${item.type === 'PC' ? 'pc' : ''}">${item.type}</span><span><strong>${safe(item.name)}</strong><small>${safe(item.detail)}</small></span><code>${item.id}</code></button>`).join('') || '<div class="empty-state"><strong>未找到页面</strong></div>'}</div></section></div>`;
  }

  function renderTraceDrawer() {
    if (state.mode === 'pc') {
      const page = pcPageMap.get(state.activePc);
      return `<div class="drawer-backdrop" data-close-overlay></div><aside class="drawer wide" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="eyebrow"><code>${page.id}</code><span>· V3.9-FROZEN</span></div><h2>PC 页面执行契约</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div><div class="drawer-body"><div class="trace-summary"><div class="trace-count"><strong>20/20</strong><span>独立页面规格</span></div><div class="trace-count"><strong>${page.category}</strong><span>页面类别</span></div><div class="trace-count"><strong>Server</strong><span>最终裁决</span></div><div class="trace-count"><strong>脱敏</strong><span>Evidence</span></div></div><div class="trace-section"><h3>Input</h3><div class="trace-card">${safe(page.input)}</div><h3>Steps</h3><div class="trace-card">${safe(page.steps)}</div><h3>HumanTakeover</h3><div class="trace-card">${safe(page.humanTakeover)}</div><h3>Output</h3><div class="trace-card">${safe(page.output)}</div><h3>Boundary</h3><div class="trace-card">${safe(page.boundary)}</div></div></div></aside>`;
    }
    const page = pageMap.get(state.activeWeb);
    return `<div class="drawer-backdrop" data-close-overlay></div><aside class="drawer wide" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="eyebrow"><code>${page.id}</code><span>· ${safe(page.businessObject)}</span></div><h2>冻结需求全链路</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div><div class="drawer-body"><div class="trace-summary"><div class="trace-count"><strong>${page.fields.length}</strong><span>字段全部落位</span></div><div class="trace-count"><strong>${page.buttons.length}</strong><span>冻结按钮</span></div><div class="trace-count"><strong>${page.apiIds.length}</strong><span>关联 API</span></div><div class="trace-count"><strong>${page.testIds.length}</strong><span>TestID</span></div></div><div class="trace-section"><h3>页面规格</h3><div class="trace-card"><dl><dt>Purpose</dt><dd>${safe(page.purpose)}</dd><dt>Layout</dt><dd>${safe(page.layout)}</dd><dt>Entry</dt><dd>${safe(page.entry)}</dd><dt>Permission</dt><dd>${safe(page.permission)}</dd><dt>Success</dt><dd>${safe(page.success)}</dd><dt>Failure</dt><dd>${safe(page.failure)}</dd></dl></div><h3>字段 ${page.fields.length}/${page.fields.length}</h3>${page.fields.map(field => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(field['中文名称'])}</strong><code>${field.FieldID}</code></div><dl><dt>角色</dt><dd>${safe(field['角色'])}</dd><dt>类型</dt><dd>${safe(field['类型'])}</dd><dt>校验/展示</dt><dd>${safe(field['校验/展示'])}</dd></dl></div>`).join('')}<h3>按钮与测试 ${page.buttons.length}/${page.buttons.length}</h3>${page.buttons.map(button => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(button['按钮'])}</strong><code>${button.ButtonID}</code></div><dl><dt>权限/状态</dt><dd>${safe(button['可见/启用'])}</dd><dt>API</dt><dd>${safe(button['API契约'])}</dd><dt>成功</dt><dd>${safe(button.SuccessState)}</dd><dt>失败</dt><dd>${safe(button.FailureState)}</dd><dt>目标/Test</dt><dd>${safe(button.TargetPageID)} · ${safe(button.TestID)}</dd></dl></div>`).join('')}</div></div></aside>`;
  }

  function renderIssueDrawer() {
    return `<div class="drawer-backdrop" data-close-overlay></div><aside class="drawer wide" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="eyebrow"><span>需求校验</span><span>·</span><code>V3.9-FROZEN</code></div><h2>偏差与补丁基线建议</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div><div class="drawer-body"><div class="notice warn">${icon('alert')}<div><strong>以下项目未被原型静默修改</strong><p>原始 ButtonID/API/Target 仍可在“冻结追踪”中查看；业务演示使用安全设计，并等待产品、后端、测试共同关闭。</p></div></div><div class="trace-section">${requirementIssues.map(issue => `<article class="issue-card"><div class="issue-head"><code>${issue.id}</code><span class="status-tag ${issue.level.includes('阻塞') ? 'danger' : 'warn'}">${issue.level}</span></div><h3>${safe(issue.subject)}</h3><dl><dt>冻结事实</dt><dd>${safe(issue.frozen)}</dd><dt>核验结论</dt><dd>${safe(issue.finding)}</dd><dt>整改建议</dt><dd>${safe(issue.proposal)}</dd></dl></article>`).join('')}</div></div></aside>`;
  }

  function renderRoleMenu() {
    return `<div class="role-menu" style="right:24px;top:58px">${Object.entries(roleInfo).filter(([id]) => id !== 'PC_WORKER').map(([id, info]) => `<button class="role-option ${state.role === id ? 'active' : ''}" data-role="${id}"><span class="role-avatar">${info.initial}</span><span><strong>${info.name}</strong><small>${info.brief}</small></span>${state.role === id ? `<span class="role-check">${icon('check', 15)}</span>` : ''}</button>`).join('')}</div>`;
  }

  function renderConfirmModal() {
    const { page, button } = state.confirmAction;
    const row = selectedRow(page);
    return `<div class="modal-backdrop" data-close-overlay><section class="modal" role="dialog" aria-modal="true" data-stop-close><div class="modal-head"><div><div class="eyebrow"><code>${button.ButtonID}</code><span>· 二次确认</span></div><h2>确认${safe(button['按钮'])}？</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div><div class="modal-body"><div class="context-list"><div class="context-row"><span>业务对象</span><strong>${safe(row?.__id || state.routeParams.entityId || page.businessObject)}</strong></div><div class="context-row"><span>当前状态</span><strong>${safe(button.CurrentState)}</strong></div><div class="context-row"><span>目标状态</span><strong>${safe(button.SuccessState)}</strong></div><div class="context-row"><span>API</span><strong class="mono">${safe(button['API契约'])}</strong></div></div><div class="impact-box"><strong>失败保持规则</strong><p>${safe(button.FailureState)}；保留未提交输入并显示中文提示、ErrorCode 与 TraceID。</p></div></div><div class="modal-footer"><button class="button" data-close-overlay>返回检查</button><button class="button ${/取消|删除|拒绝|驳回/.test(button['按钮']) ? 'danger' : 'primary'}" data-confirm-proceed>确认执行</button></div></section></div>`;
  }

  function renderDetailDrawer() {
    const page = pageMap.get(state.activeWeb);
    const row = genericRows(page).find(item => item.__id === state.detailDrawer.entityId) || genericRows(page)[0] || {};
    return `<div class="drawer-backdrop" data-close-overlay></div><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head"><div><div class="eyebrow"><code>${page.id}</code><span>· LocalAction: ROW_QUICK_VIEW</span></div><h2>${safe(page.name)}快速查看</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div><div class="drawer-body"><div class="notice">${icon('info')}<div><strong>查询上下文已保留</strong><p>完整页将携带 entityId、version、sourcePage、filters、page、size、sort、tab 与 storeScope。</p></div></div><div class="trace-section">${contentFields(page).map((field, index) => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(field['中文名称'])}</strong><span>${safe(row[field['中文名称']] ?? fieldValue(field, index, page))}</span></div><code>${field.FieldID}</code></div>`).join('')}</div></div><div class="drawer-footer"><button class="button" data-close-overlay>关闭</button>${page.buttons.some(button => /查看详情|查看执行结果|查看快照/.test(button['按钮'])) ? `<button class="button primary" data-drawer-navigate="${safe(row.__id)}">打开完整页面</button>` : ''}</div></aside>`;
  }

  function showToast(title, detail, type = 'success') {
    const root = document.getElementById('toast-root');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon(type === 'success' ? 'check' : type === 'warn' ? 'alert' : 'close', 18)}</span><div><strong>${safe(title)}</strong><small>${safe(detail)}</small></div>`;
    root.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(8px)'; setTimeout(() => toast.remove(), 220); }, 3600);
  }

  function apiIdFrom(button) { return String(button['API契约'] || '').split('|')[0].trim(); }

  function navigateByButton(page, button, row = null) {
    const label = button['按钮'];
    if (/返回/.test(label)) return returnToContext(page);
    const target = button.TargetPageID;
    if (!target || target === page.id || !pageMap.has(target)) return render();
    navigateWeb(target, contextParams(page, row || selectedRow(page)));
  }

  function executeButton(page, button) {
    state.confirmAction = null;
    const label = button['按钮'];
    const ps = pageState(page.id);
    if (/查询|刷新/.test(label)) {
      state.busyPage = page.id; render();
      setTimeout(() => { state.busyPage = null; render(); showToast('查询完成', `条件、分页和排序已保留 · TraceID ${traceId()}`, 'success'); }, 380);
      return;
    }
    if (label.includes('重置')) { ps.filters = {}; ps.page = 1; ps.sortField = ''; ps.selected.clear(); render(); showToast('已重置', '查询条件、页码、排序和选择状态已恢复。'); return; }
    if (button.ButtonID === 'BTN-SRC-045-01') {
      state.workflow.collectionTask = 'READY';
      showToast('采集任务已创建', 'Server 已生成 CollectionTask 与 IdempotencyKey；原冻结 GET 契约已标记待整改。', 'success');
      setTimeout(() => navigateWeb('SRC-046', contextParams(page, selectedRow(page), { taskId: 'COL-20260920-009' })), 250);
      return;
    }
    if (button.ButtonID === 'BTN-PRD-052-01') {
      const draft = state.formDrafts.get(page.id) || {};
      const requiredMissing = contentFields(page).filter(field => field['必填'] === '是' && field['可编辑'] === '是' && !String(draft[field.FieldID] ?? selectedRow(page)?.[field['中文名称']] ?? '').trim());
      if (requiredMissing.length) { showToast('保存失败', `VALIDATION_ERROR：请检查 ${requiredMissing.map(item => item['中文名称']).join('、')} · TraceID ${traceId()}`, 'error'); return; }
      state.workflow.productRevision += 1; state.formDrafts.delete(page.id); render(); showToast('商品草稿已保存', `DraftRevision=${state.workflow.productRevision}；审计与幂等记录已生成。`); return;
    }
    if (button.ButtonID === 'BTN-CHN-070-04') {
      state.workflow.channelStatus = '店铺草稿同步中';
      showToast('PublishTask 已创建', '目标为店铺草稿，不自动上架；外部结果需 Evidence 校验。');
      setTimeout(() => navigateWeb('CHN-071', contextParams(page, domain.channels[0], { targetMode: 'DRAFT' })), 250);
      return;
    }
    if (button.ButtonID === 'BTN-PUR-085-01') {
      const purchase = domain.purchases.find(item => item.__id === state.routeParams.entityId) || domain.purchases[2];
      if (purchase.__state === 'PRICE_CHANGED') { showToast('当前不可确认采购', `PRICE_CHANGED：价格、库存或 SKU 已变化，原状态保持 · TraceID ${traceId()}`, 'error'); return; }
      state.workflow.purchaseStatus = '已确认待执行'; render(); showToast('采购已确认', '已形成 PurchaseOrder；PC 只执行该不可变快照。'); return;
    }
    if (/取消/.test(label)) showToast('取消请求已受理', `Server 将校验 TaskState 与 Lease · ${apiIdFrom(button)} · TraceID ${traceId()}`, 'warn');
    else if (/重试/.test(label)) showToast('进入等待重试', `仅允许幂等或已对账动作 · RETRY_WAIT · TraceID ${traceId()}`);
    else showToast('操作已受理', `${label} · ${apiIdFrom(button) || 'LocalAction'} · 最终状态由 NAS Server 裁决。`);
    navigateByButton(page, button, selectedRow(page));
  }

  function handleFrozenButton(id) {
    const found = buttonMap.get(id);
    if (!found) return;
    const { page, button } = found;
    if (!canUseButton(page, button)) { showToast('无权执行', `PERMISSION_DENIED · 当前角色或店铺范围不满足 ${button['权限']} · TraceID ${traceId()}`, 'error'); return; }
    if (String(button['二次确认']).startsWith('是')) { state.confirmAction = { page, button }; closeOtherOverlays('confirm'); renderOverlay(); return; }
    executeButton(page, button);
  }

  function closeOtherOverlays(keep) {
    if (keep !== 'confirm') state.confirmAction = null;
    if (keep !== 'trace') state.traceOpen = false;
    if (keep !== 'issues') state.issueDrawer = false;
    if (keep !== 'palette') state.paletteOpen = false;
    if (keep !== 'role') state.roleMenuOpen = false;
    if (keep !== 'detail') state.detailDrawer = null;
  }

  function returnToContext(page) {
    const sourceId = state.routeParams.sourcePage;
    if (sourceId && pageMap.has(sourceId)) {
      const ps = pageState(sourceId);
      try { ps.filters = JSON.parse(state.routeParams.filters || '{}'); } catch (_) {}
      ps.page = Number(state.routeParams.page || 1); ps.size = Number(state.routeParams.size || 5);
      if (state.routeParams.sort) [ps.sortField, ps.sortDir] = state.routeParams.sort.split(':');
      navigateWeb(sourceId);
    } else navigateWeb(page.module === 'DASH' ? 'DASH-001' : (requirements.pages.find(item => item.module === page.module && !isContextPage(item))?.id || 'DASH-001'));
  }

  function handleDesignAction(id) {
    if (id === 'GAP-UI-001') { const keyword = document.getElementById('source-keyword')?.value.trim(); if (!keyword) return showToast('请输入搜索条件', 'VALIDATION_ERROR：关键词或商品链接不能为空。', 'error'); state.workflow.searchCreated = true; showToast('探查任务已创建', `设计补充 ${id} · API 模式 · TraceID ${traceId()}`); setTimeout(() => navigateWeb('SRC-043', { sourcePage: 'SRC-042', keyword }), 220); }
    else if (id === 'GAP-UI-002') { const ps = pageState('SRC-043'); if (!ps.selected.size) return showToast('请先选择商品', '至少选择一条探查结果后再加入候选。', 'warn'); showToast('已加入候选', `${ps.selected.size} 条结果已去重并进入候选列表。`); setTimeout(() => navigateWeb('SRC-044', { sourcePage: 'SRC-043' }), 220); }
    else if (id === 'GAP-UI-003') { const product = domain.products.find(item => item.__id === state.routeParams.entityId) || domain.products[0]; navigateWeb('PRD-052', contextParams(pageMap.get('PRD-051'), product)); }
    else if (id === 'GAP-UI-004') { state.workflow.productRevision += 1; const product = domain.products.find(item => item.__id === state.routeParams.entityId) || domain.products[0]; showToast('草稿已保存', '正在生成渠道预览；不会自动上架。'); setTimeout(() => navigateWeb('CHN-070', contextParams(pageMap.get('PRD-052'), product, { targetMode: 'DRAFT' })), 220); }
    else if (id === 'GAP-UI-005') { state.workflow.orderSyncBatch = '执行中'; render(); showToast('订单同步任务已启动', `Batch=BATCH-ORD-${Date.now()} · 每条记录返回分类结果。`); }
    else if (id === 'GAP-UI-006') { showToast('只读对账任务已创建', '不会重放外部写；结果仍由 Server 校验。'); }
  }

  function handlePcAction(action) {
    const pc = state.pcTask;
    const now = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    if (action === 'refresh') return showToast('队列已刷新', '任务仍由 Server 按能力、版本和租约调度。');
    if (action === 'pair') return showToast('配对申请已提交', '等待 OWNER 核对设备指纹并确认。');
    if (action === 'claim') { pc.status = 'CLAIMED'; pc.evidence.push({ time: now, text: 'Claim 成功，Server 已签发 LeaseToken' }); }
    if (action === 'start') { pc.status = 'RUNNING'; pc.step = 0; pc.evidence.push({ time: now, text: 'Attempt 已开始，Heartbeat 每 15 秒上报' }); }
    if (action === 'progress') { pc.step += 1; pc.evidence.push({ time: now, text: `Progress 已确认，检查点 ${pc.step + 1}` }); }
    if (action === 'human') { pc.status = 'WAIT_HUMAN'; pc.evidence.push({ time: now, text: 'CAPTCHA_REQUIRED 已上报，执行暂停' }); }
    if (action === 'resume') { pc.status = 'RUNNING'; pc.evidence.push({ time: now, text: 'HumanTaskResult 已回传，等待 Server 恢复裁决' }); }
    if (action === 'submit') { pc.status = 'SUCCESS'; pc.evidence.push({ time: now, text: 'ResultDTO 与 Evidence 已提交 Server 校验' }); }
    if (action === 'cancel') { pc.status = 'CANCELLED'; pc.evidence.push({ time: now, text: '取消请求已提交，等待 Server 裁决' }); }
    render();
  }

  function currentWebPage() { return pageMap.get(state.activeWeb); }

  document.addEventListener('click', event => {
    const buttonTarget = event.target.closest('button');
    const backdropTarget = event.target.matches?.('[data-close-overlay]') ? event.target : null;
    const target = buttonTarget || backdropTarget;
    if (!target) return;
    if (target.dataset.nav) return navigateWeb(target.dataset.nav);
    if (target.dataset.pcNav) return navigatePc(target.dataset.pcNav);
    if (target.dataset.go) return navigateWeb(target.dataset.go);
    if (target.dataset.goPc) return navigatePc(target.dataset.goPc);
    if (target.dataset.module) {
      state.expandedModule = target.dataset.module;
      const first = requirements.pages.find(page => page.module === target.dataset.module && (state.reviewMode || !isContextPage(page)));
      if (first) navigateWeb(first.id);
      return;
    }
    if (target.dataset.mode) return target.dataset.mode === 'pc' ? navigatePc(state.activePc || 'PC-001') : navigateWeb(state.activeWeb || 'DASH-001');
    if (target.hasAttribute('data-open-palette')) { closeOtherOverlays('palette'); state.paletteOpen = true; renderOverlay(); return; }
    if (target.hasAttribute('data-open-trace')) { closeOtherOverlays('trace'); state.traceOpen = true; renderOverlay(); return; }
    if (target.hasAttribute('data-open-issues')) { closeOtherOverlays('issues'); state.issueDrawer = true; renderOverlay(); return; }
    if (target.hasAttribute('data-open-role')) { closeOtherOverlays('role'); state.roleMenuOpen = !state.roleMenuOpen; renderOverlay(); return; }
    if (target.hasAttribute('data-toggle-review')) { state.reviewMode = !state.reviewMode; render(); showToast(state.reviewMode ? '已进入评审模式' : '已进入业务模式', state.reviewMode ? '菜单展示全部上下文页，字段追踪默认展开。' : '菜单只保留可直接使用的业务入口页。'); return; }
    if (target.dataset.role) {
      state.role = target.dataset.role; state.previousRole = state.role; state.roleMenuOpen = false;
      const page = currentWebPage();
      if (!canViewPage(page)) navigateWeb(state.role === 'HUMAN' ? 'TSK-145' : 'DASH-001'); else render();
      showToast('岗位已切换', `当前按${roleInfo[state.role].name}校验页面、按钮、店铺和对象范围。`);
      return;
    }
    if (target.hasAttribute('data-store-scope')) {
      const index = storeScopes.findIndex(item => item.id === state.storeScope);
      state.storeScope = storeScopes[(index + 1) % storeScopes.length].id;
      pageState(state.activeWeb).page = 1; render(); showToast('店铺数据范围已切换', currentScope().label); return;
    }
    if (target.dataset.buttonId) return handleFrozenButton(target.dataset.buttonId);
    if (target.dataset.designAction) return handleDesignAction(target.dataset.designAction);
    if (target.hasAttribute('data-confirm-proceed')) { const action = state.confirmAction; if (action) executeButton(action.page, action.button); return; }
    if (target.dataset.paletteGo) { const [type, id] = target.dataset.paletteGo.split(':'); return type === 'PC' ? navigatePc(id) : navigateWeb(id); }
    if (target.dataset.returnContext !== undefined || target.hasAttribute('data-return-context')) return returnToContext(currentWebPage());
    if (target.dataset.rowDetail) { closeOtherOverlays('detail'); state.detailDrawer = { entityId: target.dataset.rowDetail }; renderOverlay(); return; }
    if (target.dataset.openRow) {
      const page = currentWebPage();
      const row = genericRows(page).find(item => item.__id === target.dataset.openRow);
      return navigateWeb(target.dataset.target, contextParams(page, row));
    }
    if (target.dataset.drawerNavigate) {
      const page = currentWebPage(); const row = genericRows(page).find(item => item.__id === target.dataset.drawerNavigate);
      const detail = page.buttons.find(button => /查看详情|查看执行结果|查看快照/.test(button['按钮']));
      state.detailDrawer = null;
      if (detail?.TargetPageID && pageMap.has(detail.TargetPageID)) navigateWeb(detail.TargetPageID, contextParams(page, row));
      return;
    }
    if (target.hasAttribute('data-confirm-candidates')) {
      const ids = [...pageState('SRC-044').selected];
      if (!ids.length) return showToast('请先选择候选商品', '至少选择一项后才能进入采集确认。', 'warn');
      state.workflow.selectedCandidates = ids;
      return navigateWeb('SRC-045', contextParams(pageMap.get('SRC-044'), domain.candidates.find(row => row.__id === ids[0]), { entityId: ids.join(',') }));
    }
    if (target.dataset.page) { const ps = pageState(state.activeWeb); ps.page = Number(target.dataset.page); render(); return; }
    if (target.dataset.sortField) { const ps = pageState(state.activeWeb); const key = target.dataset.sortField; ps.sortDir = ps.sortField === key && ps.sortDir === 'asc' ? 'desc' : 'asc'; ps.sortField = key; ps.page = 1; render(); return; }
    if (target.hasAttribute('data-cycle-ui-state')) {
      const modes = ['default', 'loading', 'empty', 'error', 'offline', 'permission', 'conflict', 'long'];
      const pageId = state.activeWeb; const current = state.uiState.get(pageId) || 'default'; state.uiState.set(pageId, modes[(modes.indexOf(current) + 1) % modes.length]); render(); return;
    }
    if (target.hasAttribute('data-retry-page')) { state.uiState.set(state.activeWeb, 'default'); state.busyPage = state.activeWeb; render(); setTimeout(() => { state.busyPage = null; render(); }, 350); return; }
    if (target.hasAttribute('data-reset-page')) { const ps = pageState(state.activeWeb); ps.filters = {}; ps.page = 1; state.uiState.set(state.activeWeb, 'default'); render(); return; }
    if (target.dataset.taskDetail) { showToast('任务详情已打开', `${target.dataset.taskDetail} · Attempt / Lease / Error / Trace / Evidence 可追踪。`); return; }
    if (target.dataset.pcAction) return handlePcAction(target.dataset.pcAction);
    if (target.hasAttribute('data-close-overlay')) { closeOverlays(); renderOverlay(); return; }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'palette-input') {
      state.paletteQuery = event.target.value; const cursor = event.target.selectionStart; renderOverlay();
      const input = document.getElementById('palette-input'); if (input) { input.focus(); input.setSelectionRange(cursor, cursor); }
      return;
    }
    if (event.target.dataset.filterId) {
      const ps = pageState(state.activeWeb); ps.filters[event.target.dataset.filterId] = event.target.value; ps.page = 1; return;
    }
    if (event.target.dataset.formField) {
      const draft = state.formDrafts.get(state.activeWeb) || {}; draft[event.target.dataset.formField] = event.target.value; state.formDrafts.set(state.activeWeb, draft);
    }
  });

  document.addEventListener('change', event => {
    const page = currentWebPage();
    if (event.target.dataset.filterId) { const ps = pageState(page.id); ps.filters[event.target.dataset.filterId] = event.target.value; ps.page = 1; return; }
    if (event.target.dataset.formField) { const draft = state.formDrafts.get(page.id) || {}; draft[event.target.dataset.formField] = event.target.value; state.formDrafts.set(page.id, draft); return; }
    if (event.target.matches('[data-row-select]')) {
      const ps = pageState(page.id); event.target.checked ? ps.selected.add(event.target.dataset.rowSelect) : ps.selected.delete(event.target.dataset.rowSelect); render(); return;
    }
    if (event.target.matches('[data-select-all]')) {
      const ps = pageState(page.id); const rows = rowsForPage(page).slice((ps.page - 1) * ps.size, ps.page * ps.size);
      rows.forEach(row => event.target.checked ? ps.selected.add(row.__id) : ps.selected.delete(row.__id)); render(); return;
    }
    if (event.target.matches('[data-page-size]')) { const ps = pageState(page.id); ps.size = Number(event.target.value); ps.page = 1; render(); }
  });

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); closeOtherOverlays('palette'); state.paletteOpen = true; renderOverlay(); }
    if (event.key === 'Escape') { closeOverlays(); renderOverlay(); }
  });

  window.addEventListener('hashchange', () => { parseHash(); render(); });
  window.addEventListener('beforeunload', event => { if (state.formDrafts.size) { event.preventDefault(); event.returnValue = ''; } });

  function registerWebMcp() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    const register = tool => { try { Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {}); } catch (_) {} };
    register({ name: 'navigate_qingniao_page', title: '打开青鸟页面', description: '按 PageID 打开管理端或 PC Worker 页面。', inputSchema: { type: 'object', properties: { pageId: { type: 'string' } }, required: ['pageId'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute(input) { const id = String(input?.pageId || '').toUpperCase(); if (pageMap.has(id)) navigateWeb(id); else if (pcPageMap.has(id)) navigatePc(id); else throw new Error('未知 PageID'); return { pageId: id, opened: true }; } });
    register({ name: 'inspect_qingniao_requirement_gaps', title: '查看需求核验问题', description: '打开 V3.9 冻结需求的语义冲突和补丁建议。', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute() { closeOtherOverlays('issues'); state.issueDrawer = true; renderOverlay(); return { issueCount: requirementIssues.length }; } });
  }

  parseHash();
  if (!location.hash) history.replaceState(null, '', '#/web/DASH-001');
  render();
  registerWebMcp();
})();
