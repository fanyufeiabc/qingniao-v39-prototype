#!/usr/bin/env python3
"""Rebuild P1 from the retained, byte-identical V3.9 interaction source."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
source = (DIST / 'app-v2.js').read_text()
app = source
changes = []
ORIGINAL_HASHES = {
  "styles.css": "d13085a0ce66a624d5765725bd85556240e728d5ff7fb2cdfd2b23cdc0c9dce7",
  "app-v2.js": "9305afa310641f58bb4e61c9270061525e328ab2336848c1f6e9f4e70a9e8773",
  "data/requirements.js": "9708a3509df8b0716db4b63f5e6cb289d0b031d14d33409c01d99b45147ce355",
  "data/requirements.json": "34722c659cb2a0aab084cae17d1c8e7334c6be29fa03aebc1321cc90b6caa5d9",
  "assets/qingniao-A-ink.svg": "47c508426fbb4d41e07f5e071ba3c1d7024d68cd7f71c66e4f5086971d100ec4",
  "assets/qingniao-A-inverse.svg": "b71cde051336353caf12abee23d9944d0d998e576cc48287322fac41e4470aff"
}
for frozen_file, expected in ORIGINAL_HASHES.items():
    if hashlib.sha256((DIST/frozen_file).read_bytes()).hexdigest() != expected:
        raise ValueError('Immutable original source changed: '+frozen_file)


def replace(old, new, count=1):
    global app
    actual = app.count(old)
    if actual != count:
        raise ValueError(f'Expected {count}, found {actual}: {old[:100]}')
    app = app.replace(old, new)
    changes.append(old[:80])


def function(name, following, body):
    global app
    start = app.index('  function ' + name + '(')
    end = app.index('  function ' + following + '(', start)
    app = app[:start] + body.strip() + '\n\n' + app[end:]
    changes.append('function ' + name)


replace('  const requirements = window.QN_REQUIREMENTS;', '  const requirements = window.QN_REQUIREMENTS;\n  const prototype = window.QNPrototype;')
replace("description: '采购建议、家庭成员确认与货源平台执行'", "description: '采购建议、本人确认与 1688 建单回读'")
replace("description: '成员、权限、安全、日志、备份与系统设置'", "description: '本人账户、安全、操作日志、备份与系统设置'")
replace("    RTE: { label:", "    JD: { label: '京东小店', icon: 'store', description: '商品投影、类目属性、草稿回读、审核发布与订单详情' },\n    RTE: { label:")
replace("modules: ['CHN', 'ORD', 'PUR', 'LOGI', 'AS', 'FIN']", "modules: ['CHN', 'JD', 'ORD', 'PUR', 'LOGI', 'AS', 'FIN']")
replace("OWNER: { name: '家庭管理员', brief: '全量配置与最终确认', initial: '管' }", "OWNER: { name: '本人', brief: '本人操作与最终确认', initial: '我' }")
replace("{ id: 'STORE-WX-001', label: '微信小店 · 青鸟优选' }", "{ id: 'STORE-WX-001', label: '微信小店 · 青鸟优选' },\n    { id: 'STORE-JD-001', label: '京东 · 棉品示例店' }")
replace("    pcTask: { status:", "    pcTasks: new Map(), pcConflict: false,\n    pcTask: { status:")
replace('filters: {}, page: 1, size: 5,', 'filters: {}, page: 1, size: 20,')

function('parseHash', 'contextParams', r'''
  function parseHash() {
    const route = prototype.resolve(location.hash);
    state.routeParams = route.params;
    state.mode = route.mode;
    if (route.mode === 'pc') {
      state.activePc = route.id;
      state.role = 'PC_WORKER';
      hydratePcTask(route.id, route.params);
    } else {
      state.activeWeb = route.id;
      state.expandedModule = pageMap.get(route.id)?.module || '';
      state.role = 'OWNER';
      const owner = pageMap.has(route.params.sourcePage) ? route.params.sourcePage : route.id;
      if (pageMap.has(owner)) {
        const ps = pageState(owner);
        if (route.params.filters) {
          try {
            const value = JSON.parse(route.params.filters);
            if (value && !Array.isArray(value) && typeof value === 'object') {
              const fieldIds = new Set(pageMap.get(owner).fields.map(f => f.FieldID));
              ps.filters = Object.fromEntries(Object.entries(value).filter(([key, v]) => fieldIds.has(key) && typeof v === 'string'));
            }
          } catch (_) { /* Preserve safe existing filters on malformed links. */ }
        }
        if (route.params.page) ps.page = Math.max(1, Math.min(10000, Number.parseInt(route.params.page, 10) || 1));
        if (route.params.size) ps.size = [20, 50].includes(Number(route.params.size)) ? Number(route.params.size) : 20;
        if (route.params.sort) {
          const [field, dir] = route.params.sort.split(':');
          if (pageMap.get(owner).fields.some(f => f.FieldID === field || f['中文名称'] === field)) {
            ps.sortField = field; ps.sortDir = dir === 'desc' ? 'desc' : 'asc';
          }
        }
      }
      if (storeScopes.some(s => s.id === route.params.storeScope)) state.storeScope = route.params.storeScope;
    }
  }

  function hydratePcTask(sceneId, params) {
    state.pcConflict = false;
    const taskId = params.taskId || (sceneId === 'PC-015' ? 'demo-publish-locked' : 'demo-' + sceneId);
    const lock = sceneId === 'PC-015' || taskId === 'demo-publish-locked' || params.writeLocked === 'true';
    const identity = { taskId, sceneId, platform: params.platform || '演示平台', store: params.store || '原店铺（演示）', account: params.account || '本人原账号（演示）', profile: params.profile || '原独立档案（演示）', device: params.device || '固定 Windows PC（演示）' };
    if (!state.pcTasks.has(taskId)) state.pcTasks.set(taskId, {
      status: lock ? 'UNKNOWN' : 'READY', locked: lock, step: 0, identity,
      evidence: [{ time: '14:28:10', text: '演示：NAS 原任务、原确认与执行上下文保留' }, { time: '14:28:12', text: '真实设备与能力未核验；未连接平台' }]
    });
    const task = state.pcTasks.get(taskId);
    if (lock) { task.locked = true; task.status = 'UNKNOWN'; }
    const identityMismatch = ['platform', 'store', 'account', 'profile', 'device'].some(key => params[key] && params[key] !== task.identity[key]);
    const sceneMismatch = task.identity.sceneId !== sceneId && !['PC-011', 'PC-013', 'PC-015', 'CUR-PC-MONITOR'].includes(sceneId);
    state.pcConflict = identityMismatch || sceneMismatch;
    state.pcTask = task;
  }

  function persistListContext() {
    const page = pageMap.get(state.activeWeb);
    if (!page || isContextPage(page)) return;
    const ps = pageState(page.id);
    const params = { ...state.routeParams, filters: JSON.stringify(ps.filters), page: ps.page, size: ps.size, sort: ps.sortField ? ps.sortField + ':' + ps.sortDir : '', storeScope: state.storeScope };
    delete params.sourcePage;
    history.replaceState(null, '', prototype.route('web', page.id, params));
    state.routeParams = prototype.resolve(location.hash).params;
  }
''')
function('setRoute', 'navigateWeb', r'''
  function setRoute(mode, id, params = {}) {
    const next = prototype.route(mode, id, params);
    if (location.hash === next) { parseHash(); render(); } else location.hash = next;
  }
''')
function('navigatePc', 'closeOverlays', r'''
  function navigatePc(id, params = {}) {
    if (!pcPageMap.has(id)) return;
    closeOverlays();
    setRoute('pc', id, params);
  }
''')
replace("    state.paletteOpen = false; state.traceOpen = false; state.roleMenuOpen = false; state.confirmAction = null; state.detailDrawer = null; state.issueDrawer = false;", "    prototype.closeCurrent?.();\n    state.paletteOpen = false; state.traceOpen = false; state.roleMenuOpen = false; state.confirmAction = null; state.detailDrawer = null; state.issueDrawer = false;")

function('render', 'renderSidebar', r'''
  function render() {
    const isPc = state.mode === 'pc';
    const original = isPc ? pcPageMap.get(state.activePc) : pageMap.get(state.activeWeb);
    const page = original ? { ...original, name: prototype.title(original, state.routeParams) } : null;
    document.title = `${page?.name || '青鸟'} · 青鸟 V9.1.1 W8R2A-P1`;
    prototype.bind({ toast: showToast, render, close: closeOverlays, overlay: renderOverlay, navigatePc });
    const badge = original ? prototype.badge(state.mode, original.id, state.routeParams) : '';
    const content = isPc ? renderPcPage(page) : renderWebPage(page);
    const extra = original && !isPc ? prototype.extraBusiness(original.id, state.routeParams.__currentId) : '';
    app.innerHTML = `<div class="app-shell ${isPc ? 'pc-shell' : ''}">${renderSidebar()}${renderTopbar(page)}<main class="main"><div class="page-wrap">${badge}${content}${extra}<footer class="prototype-footer"><span>V9.1.1 · W8R2A-P1</span><span>设计演示 · 本人操作 · NAS 业务真源 · 开发与实平台验收分别标记</span></footer></div></main></div>`;
    renderOverlay();
    annotateLocalControls(app, page?.id || 'UNKNOWN');
    loading?.classList.add('is-hidden');
  }
''')
replace("${isPc ? '已连接 NAS Server' : 'NAS Server 正常'}", "${isPc ? '固定 PC 执行端' : 'NAS 业务真源'}")
replace("${isPc ? '心跳 3 秒前' : '唯一业务真源'}", "${isPc ? '连接与环境待统一 SIT' : '环境部署待统一 SIT'}")
replace("${isPc ? '15s' : '在线'}", "设计")

function('renderWebNavigation', 'pcGroupLabel', r'''
  function renderWebNavigation() {
    return navGroups.map(group => `<section class="nav-section"><div class="nav-section-title">${safe(group.label)}</div>${group.modules.map(module => {
      const meta = moduleMeta[module], all = requirements.pages.filter(p => p.module === module);
      const entries = all.filter(p => !isContextPage(p)), contexts = all.filter(isContextPage);
      const active = state.expandedModule === module;
      const renderItem = p => `<button class="nav-page-button ${state.activeWeb === p.id ? 'active' : ''}" data-nav="${p.id}"><span>${safe(p.name)}</span>${state.reviewMode ? `<code>${safe(p.id)}</code>` : ''}</button>`;
      return `<button class="nav-module-button ${active ? 'active' : ''}" data-module="${module}" aria-expanded="${active}"><span class="nav-icon">${icon(meta.icon)}</span><span>${safe(meta.label)}</span><span class="nav-count">${all.length}</span><span class="module-chevron">›</span></button><div class="nav-pages" ${active ? '' : 'hidden'}>${entries.map(renderItem).join('')}${contexts.length ? `<details class="nav-more" ${state.reviewMode || contexts.some(p => p.id === state.activeWeb) ? 'open' : ''}><summary>详情、编辑与处理场景 · ${contexts.length}</summary>${contexts.map(renderItem).join('')}</details>` : ''}</div>`;
    }).join('')}</section>`).join('');
  }
''')
function('renderPcNavigation', 'renderTopbar', r'''
  function renderPcNavigation() {
    const icons = ['monitor', 'key', 'activity', 'search', 'send', 'truck', 'settings'];
    return prototype.pcGroups.map((group, index) => `<section class="nav-section"><div class="nav-section-title">${safe(group.label)}</div>${group.ids.map(id => {
      const p = pcPageMap.get(id);
      return `<button class="pc-nav-button ${state.activePc === id ? 'active' : ''}" data-pc-nav="${id}" title="${safe(p.name)}" aria-label="${safe(p.name)}"><span class="nav-icon">${icon(icons[index], 16)}</span><span>${safe(p.name)}</span>${state.reviewMode ? `<code>${safe(prototype.sceneTargets.get('pc:' + id))}</code>` : ''}</button>`;
    }).join('')}</section>`).join('');
  }
''')
function('renderTopbar', 'renderPageHeader', r'''
  function renderTopbar(page) {
    const isPc = state.mode === 'pc';
    const context = page && !isPc && isContextPage(page);
    return `<header class="topbar"><div class="topbar-left"><div class="breadcrumb"><span>${isPc ? 'PC 执行端' : safe(moduleMeta[page?.module]?.label || '经营工作台')}</span><span class="slash">/</span>${context && state.routeParams.sourcePage ? `<button class="breadcrumb-link" data-return-context>${safe(pageMap.get(state.routeParams.sourcePage)?.name || state.routeParams.sourcePage)}</button><span class="slash">/</span>` : ''}<strong>${safe(page?.name || '页面不存在')}</strong>${reviewToolsVisible() ? `<code>${safe(state.routeParams.__currentId || '')}</code>` : ''}</div></div><div class="topbar-right"><button class="command-button" data-open-palette aria-label="搜索全部页面">${icon('search',16)}<span>查找页面</span><kbd>Ctrl K</kbd></button>${!isPc ? `<button class="top-control store-scope" data-store-scope>${icon('store',15)}<span>${safe(currentScope().label)}</span></button><button class="top-control" data-toggle-review title="切换字段、按钮及历史设计追踪显示">${icon('trace',15)}<span>${state.reviewMode ? '设计评审' : '业务视图'}</span></button>` : ''}<span class="freeze-pill">W8R2A-P1</span><span class="top-control role-control"><span class="role-avatar">我</span><strong>本人</strong></span></div></header>`;
  }
''')
replace('data-page-id="${safe(page.id)}"', 'data-page-id="${safe(state.routeParams.__currentId || page.id)}" data-scene-id="${safe(page.id)}"')
replace('      if (!control.title) control.title = `LocalAction: ${control.dataset.localAction}`;', '      if (state.reviewMode && !control.title) control.title = `LocalAction: ${control.dataset.localAction}`;')
replace('title="${safe(button.ButtonID)} · ${safe(button[\'可见/启用\'])}"', 'title="${state.reviewMode ? safe(button.ButtonID) + \' · \' + safe(button[\'可见/启用\']) : safe(label)}"')
replace("'真实业务演示'", "'设计演示'")
replace('API 能力优先；浏览器任务按能力显式选用，禁止透明切换', '1688 UTP + 受控浏览器；每项能力独立核验，本人确认后执行')
replace("'API 优先，Worker 补位'", "'UTP 与受控浏览器'")
replace("    if (!page) return renderNotFound();", "    if (!page) return renderNotFound();\n    if (page.id.startsWith('CUR-')) return prototype.renderCurrent(page, { header: state.mode === 'pc' ? renderPcHeader : renderPageHeader });", count=2)
function('renderDashboard', 'renderSourceSearch', r'''
  function renderDashboard(page) {
    const metrics = [
      ['候选待确认',domain.candidates.filter(x=>x.__state==='READY').length,'本人选择采集商品','SRC-044'],
      ['商品草稿',domain.products.filter(x=>x.__state==='DRAFT').length,'编辑、SKU、媒体与包装','PRD-050'],
      ['订单待采购',domain.orders.filter(x=>x.__state==='PAID').length,'采购草稿与本人确认','ORD-074'],
      ['物流待对账',domain.shipments.filter(x=>x.__state==='UNKNOWN').length,'原包裹与只读观察','LOGI-089'],
      ['PC 任务队列',6,'查看执行端演示队列','CUR-PC-MONITOR'],
      ['发布待对账',1,'UNKNOWN 原确认保留','CUR-JD-005']
    ];
    const metric = item => `<button class="card metric-card" ${item[3].startsWith('CUR-PC')?'data-go-pc':'data-go'}="${item[3]}"><div class="metric-label"><span>${item[0]}</span><span>示例</span></div><div class="metric-value">${item[1]}</div><div class="metric-meta">${item[2]}</div></button>`;
    const actions = page.buttons.map(b=>renderActionButton(page,b,false)).join('');
    return `${renderPageHeader(page,actions)}${renderWorkflowStrip(page.id)}${renderFilters(page)}<section class="metrics-grid metrics-six" aria-label="经营指标示例">${metrics.map(metric).join('')}</section><section class="dashboard-grid"><article class="card"><div class="card-head"><div><h2>今日经营链路</h2><small>从货源、商品与店铺草稿到订单履约的完整设计</small></div><span class="status-tag neutral">设计演示</span></div><div class="pipeline-list">${[
      ['货源搜索与采集','探查、候选、批量链接、采集记录与失败处理','SRC-044'],['商品编辑与店铺草稿','SKU、主图、包装、类目、版本与完整回读','CHN-070'],['订单、采购与物流','采购明细与本人确认；包裹按商品分配','ORD-074'],['售后与费用退款','按商品关联多采购单；本人分配两侧退款','AS-095']
    ].map((x,i)=>`<button class="pipeline-row" data-go="${x[2]}"><span class="pipeline-index">${i+1}</span><span><strong>${x[0]}</strong><small>${x[1]}</small></span>${icon('chevron',16)}</button>`).join('')}</div></article><aside class="card"><div class="card-head"><div><h2>平台与环境</h2><small>开发状态与真实能力分别核验</small></div><button class="button small" data-go="PLT-012">能力矩阵</button></div><div class="card-body health-stack">${[['1688 → 小红书','第一业务链：商品、采购、物流及售后'],['微信小店','商品投影、订单、采购和履约设计'],['京东小店','袜子、内衣类目；草稿、审核发布与履约']].map(x=>`<div class="health-row"><div class="health-icon">${icon('store')}</div><div><strong>${x[0]}</strong><small>${x[1]}</small></div><span class="status-tag warn">待 SIT</span></div>`).join('')}<div class="notice"><div><strong>NAS 与固定 Windows PC</strong><p>NAS 是业务真源；UTP、浏览器、数据库、AI/OCR 和实平台验证统一安排。</p></div></div></div></aside></section><section class="dashboard-grid equal"><article class="card"><div class="card-head"><div><h2>需要本人处理</h2><small>示例待办：价格冲突、登录与结果未知</small></div><button class="button small" data-go="TSK-145">全部待办</button></div><div class="task-list">${[['采购价格发生变化','先核对商品、数量和价格，再生成新确认','PUR-085'],['1688 需要登录或验证码','本人在原独立档案处理后重新核验','ACC-019'],['发布写后结果不明','保留原确认与锁；只读取得可信证据','CUR-JD-005']].map(x=>`<div class="task-item"><span class="task-severity"></span><div><div class="task-title"><strong>${x[0]}</strong></div><div class="task-detail">${x[1]}</div></div><button class="button small" data-go="${x[2]}">处理</button></div>`).join('')}</div></article><article class="card"><div class="card-head"><div><h2>完整设计与当前开发</h2><small>菜单保留全部业务场景，页面状态单独标记</small></div><button class="button small" data-open-palette>查找全部页面</button></div><div class="card-body validation-list">${[['NAS 19 个模块','原有 145 页设计保留，增加京东、安装和配置等 13 页'],['PC 23 个设计场景','原有 20 页恢复，补充登录、监控与设置'],['本人确认与 UNKNOWN 边界','演示不能代表真实外部写入或整系统验收']].map(x=>`<div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>${x[0]}</strong><small>${x[1]}</small></div></div>`).join('')}</div></article></section>${renderFieldCoverage(page)}${renderSpecStrip(page)}`;
  }
''')
replace('按平台能力选择官方 API 或 PC Worker；执行方式不可透明切换', '1688 首链使用 UTP 与受控浏览器；操作能力分别核验')
replace('<span class="status-tag ok">能力已验证</span>', '<span class="status-tag warn">实能力待核验</span>')
replace('<option>商品搜索 API（优先）</option><option>浏览器探查任务</option>', '<option>1688 UTP / 受控浏览器</option><option>独立核验的其他只读能力</option>')
replace('search-api v3 · 2026-09-18 已验证', '演示路由 · 实际版本与能力待核验')
replace('冻结页没有“创建探查任务”ButtonID/API 契约；本操作作为显式设计补充演示，必须经变更控制后进入开发。', '本操作演示商品探查。历史设计记录与当前接口契约分别追踪，能力实样待统一 SIT。')
replace('design.title || page.name', 'state.routeParams.__currentTitle || design.title || page.name')
replace('<div class="page-head"><div class="page-title-block">', '<div class="page-head" data-page-id="${safe(state.routeParams.__currentId || page.id)}" data-scene-id="${safe(page.id)}"><div class="page-title-block">')
function('renderWorkerHero', 'renderPcHome', r'''
  function renderWorkerHero(status = '演示在线') {
    const identity = state.pcTask.identity || {};
    return `<section class="card worker-hero"><div class="worker-id"><div class="worker-icon">${icon('monitor',24)}</div><div><strong>固定 Windows PC · 演示</strong><small>实际配对、HTTPS、设备与能力待统一 SIT</small></div></div><div class="worker-stats"><div class="worker-stat"><span>演示状态</span><strong>${safe(status)}</strong></div><div class="worker-stat"><span>最近心跳</span><strong>示例 3 秒前</strong></div><div class="worker-stat"><span>发行版本</span><strong>9.1.1</strong></div></div></section>${state.pcConflict ? '<div class="notice danger page-notice"><strong>任务身份或执行场景不匹配，执行已阻断；原任务与原锁保持。</strong></div>' : ''}${identity.taskId ? `<details class="card pc-contract"><summary>原任务上下文 · ${safe(identity.taskId)}${state.pcTask.locked ? ' · UNKNOWN 写锁保持' : ''}</summary><div class="contract-grid">${['platform','store','account','profile','device'].map(k=>`<div><span>${k}</span><strong>${safe(identity[k])}</strong></div>`).join('')}</div></details>` : ''}`;
  }
''')
replace('全部通过自检', '演示清单；真实自检待执行')
replace('<span class="status-tag ok">可执行</span>', '<span class="status-tag warn">实环境待核验</span>')
replace('TPM / 系统密钥库', '待核验实际 Windows 安全存储')
replace('冻结执行契约', '设计执行场景')
replace("SUCCESS: '成功'", "SUCCESS: '回传完成（演示）'")
replace('    const pc = state.pcTask;\n    if (pc.status', "    const pc = state.pcTask;\n    if (pc.locked || state.pcConflict) return '<span class=\"status-tag danger\">原锁保持 · 仅只读观察</span><button class=\"button\" data-go-pc=\"PC-015\">只读对账</button>';\n    if (pc.status")
replace('    overlayRoot.innerHTML = blocks.join(\'\');', "    blocks.push(prototype.overlay());\n    overlayRoot.innerHTML = blocks.join('');")
replace(".slice(0, 80);", ';')
replace('${item.id} ${item.name} ${item.detail}', "${item.id} ${item.name} ${item.detail} ${prototype.sceneTargets.get((item.type === 'PC' ? 'pc' : 'web') + ':' + item.id)} ${prototype.byId.get(prototype.sceneTargets.get((item.type === 'PC' ? 'pc' : 'web') + ':' + item.id))?.name || ''}")
replace('搜索 145 个管理端页面和 20 个 PC 页面', '搜索 ${requirements.pages.length} 个 NAS 场景和 ${requirements.pcPages.length} 个 PC 场景')
replace('<strong>20/20</strong>', '<strong>${requirements.pcPages.length}/${requirements.pcPages.length}</strong>')
replace('PC 页面执行契约', 'PC 设计执行场景')
replace('冻结需求全链路', '页面设计与历史追踪')
replace('${safe(page.purpose)}</dd>', '${safe(page.originalPurpose || page.purpose)}</dd>')
replace('<span>关联 API</span>', '<span>历史 API 记录</span>')
replace('<div class="trace-section"><h3>页面规格</h3>', '<p class="design-note">原有字段、ButtonID 与历史 API 设计保留用于追踪；实际接口以当前系统版本为准，演示不调用这些地址。</p><div class="trace-section"><h3>页面规格</h3>')
replace('偏差与补丁基线建议', 'V3.9 历史设计问题记录')
replace('原始 ButtonID/API/Target 仍可在“冻结追踪”中查看；业务演示使用安全设计，并等待产品、后端、测试共同关闭。', '以下为 V3.9 历史设计记录，不表示当前接口仍有相同问题。原字段与按钮保留用于版本追踪；当前开发和验收状态独立标记。')
replace('    const label = button[\'按钮\'];\n    const ps = pageState(page.id);', "    const label = button['按钮'];\n    const row = selectedRow(page);\n    if ((row?.__state === 'UNKNOWN' || state.routeParams.writeLocked === 'true') && !/查看|查询|刷新|返回|对账|日志/.test(label)) { showToast('原锁保持', 'UNKNOWN 仅只读对账，禁止重复外部写入。', 'warn'); renderOverlay(); return; }\n    const ps = pageState(page.id);")
replace('Server 已生成 CollectionTask 与 IdempotencyKey；原冻结 GET 契约已标记待整改。', '演示创建采集任务；未调用外部平台。原字段和按钮保留用于设计追踪。')
replace("if (String(button['二次确认']).startsWith('是'))", "if (String(button['二次确认']).startsWith('是') || ['BTN-PUR-085-01','BTN-CHN-070-04'].includes(button.ButtonID))")
replace('ps.size = Number(state.routeParams.size || 5);', 'ps.size = [20, 50].includes(Number(state.routeParams.size)) ? Number(state.routeParams.size) : 20;')
replace('      navigateWeb(sourceId);', "      navigateWeb(sourceId, { filters: JSON.stringify(ps.filters), page: ps.page, size: ps.size, sort: ps.sortField ? ps.sortField + ':' + ps.sortDir : '', storeScope: state.storeScope });")
replace('    const target = button.TargetPageID;', "    const target = page.id === 'LOGI-092' && /查看详情/.test(label) ? 'LOGI-090' : button.TargetPageID;")
replace('设计补充 ${id} · API 模式', '设计演示 ${id} · UTP / 受控浏览器')
replace('    const now = new Date().toLocaleTimeString', "    if ((pc.locked || state.pcConflict) && !['refresh','pair'].includes(action)) return showToast('执行已阻断', 'UNKNOWN 或原任务身份不匹配；只允许原上下文只读对账。', 'warn');\n    const now = new Date().toLocaleTimeString")
replace('    if (!target) return;', '    if (!target || target.disabled) return;')
replace('      state.expandedModule = target.dataset.module;', "      if (state.expandedModule === target.dataset.module) { state.expandedModule = ''; render(); return; }\n      state.expandedModule = target.dataset.module;")
replace('菜单只保留可直接使用的业务入口页。', '菜单保留全部场景，详情与编辑位于模块的场景展开项。')
replace("ps.page = Number(target.dataset.page); render();", "ps.page = Number(target.dataset.page); persistListContext(); render();")
replace("ps.sortField = key; ps.page = 1; render();", "ps.sortField = key; ps.page = 1; persistListContext(); render();")
replace("    if (target.hasAttribute('data-close-overlay'))", "    if (state.mode === 'pc' && prototype.genericPcAction(target, pcPageMap.get(state.activePc))) return;\n    if (target.hasAttribute('data-close-overlay'))")
replace('ps.filters[event.target.dataset.filterId] = event.target.value; ps.page = 1; return;', 'ps.filters[event.target.dataset.filterId] = event.target.value; ps.page = 1; persistListContext(); return;', count=2)
replace('ps.size = Number(event.target.value); ps.page = 1; render();', 'ps.size = [20,50].includes(Number(event.target.value)) ? Number(event.target.value) : 20; ps.page = 1; persistListContext(); render();')
replace('<option ${ps.size === 5 ? \'selected\' : \'\'}>5</option><option ${ps.size === 10 ? \'selected\' : \'\'}>10</option><option ${ps.size === 20 ? \'selected\' : \'\'}>20</option>', '<option ${ps.size === 20 ? \'selected\' : \'\'}>20</option><option ${ps.size === 50 ? \'selected\' : \'\'}>50</option>')
replace("if (pageMap.has(id)) navigateWeb(id); else if (pcPageMap.has(id)) navigatePc(id);", "if (prototype.byId.has(id)) location.hash = prototype.canonicalRoute(id); else if (pageMap.has(id)) navigateWeb(id); else if (pcPageMap.has(id)) navigatePc(id);")

# Display wording adapts to a personal operator; immutable IDs remain unchanged.
app = app.replace('家庭成员', '本人').replace('家庭管理员', '本人').replace('家庭确认', '本人确认').replace('数据已被其他成员更新', '数据版本已经变化')
app = app.replace('使用 OWNER 生成', '使用本人生成').replace('由 OWNER 现场核对', '由本人现场核对').replace('待 OWNER 确认', '待本人确认').replace('等待 OWNER 核对', '等待本人核对')
app = app.replace('已授权</span>', '演示授权</span>').replace('今日完成', '示例完成')
(DIST / 'app-restored.js').write_text('/* W8R2A-P1: generated from retained app-v2.js; rebuild with scripts/build-prototype-restoration.py */\n' + app)
(DIST / 'index.html').write_text('''<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="qingniao-build" content="9.1.1-w8r2a-p1">
  <title>青鸟 · V9.1.1 W8R2A-P1 完整双端原型</title>
  <meta name="description" content="青鸟完整 NAS 与 PC 交互原型；保留原有设计场景、本人确认和 UNKNOWN 只读恢复。">
  <link rel="icon" href="./assets/qingniao-A-marque.svg">
  <link rel="stylesheet" href="./styles.css?v=w8r2a-p1b">
  <link rel="stylesheet" href="./restored.css?v=w8r2a-p1b">
</head>
<body>
  <div id="loading" class="loading-screen">正在加载完整原型…</div>
  <div id="app"></div><div id="overlay-root"></div><div id="toast-root" aria-live="polite"></div>
  <script src="./data/requirements.js?v=w8r2a-p1b"></script>
  <script src="./ui/page-registry.js?v=w8r2a-p1b"></script>
  <script src="./prototype-map.js?v=w8r2a-p1b"></script>
  <script src="./prototype-extensions.js?v=w8r2a-p1b"></script>
  <script src="./app-restored.js?v=w8r2a-p1b"></script>
</body>
</html>
''')
audit = {'version':'9.1.1-w8r2a-p1','originalNasScenes':145,'originalPcScenes':20,'logicalPageIds':61,'generatedFrom':'dist/app-v2.js','sourceSha256':hashlib.sha256(source.encode()).hexdigest(),'stylesSha256':hashlib.sha256((DIST/'styles.css').read_bytes()).hexdigest(),'transformations':changes,'originalCommit':'9bfdd6f6d76af88f3a1156bbf6eb0e62a4648ff3','frozenHashes':ORIGINAL_HASHES,'scope':'Prototype restoration only; no backend or real platform acceptance claim'}
(ROOT / 'qa').mkdir(exist_ok=True)
(ROOT / 'qa' / 'restoration-source.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2)+'\n')
print(f'Built {audit["version"]}: {len(changes)} explicit transformations')
