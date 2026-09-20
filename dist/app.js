(() => {
  'use strict';

  const requirements = window.QN_REQUIREMENTS;
  const app = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');
  const loading = document.getElementById('loading');

  if (!requirements || !Array.isArray(requirements.pages)) {
    app.innerHTML = '<main class="empty-state"><strong>冻结需求台账未能载入</strong><span>请检查原型数据文件。</span></main>';
    loading?.classList.add('is-hidden');
    return;
  }

  const moduleMeta = {
    DASH: { label: '经营总览', icon: 'home', description: '经营指标、待办、异常与系统健康' },
    PLT: { label: '平台与路由', icon: 'layers', description: '平台、Endpoint、能力与版本' },
    ACC: { label: '账号授权', icon: 'key', description: '账号、凭据引用、登录与健康状态' },
    STR: { label: '店铺管理', icon: 'store', description: '店铺、账号绑定与工作台路由' },
    SUP: { label: '供应商', icon: 'users', description: '供应商与采购来源记录' },
    SRC: { label: '货源与采集', icon: 'search', description: '探查、候选、预览、采集与来源资产' },
    PRD: { label: '商品中心', icon: 'box', description: '商品草稿、版本、SKU、媒体与 AI 辅助' },
    CHN: { label: '渠道发布', icon: 'send', description: '渠道映射、预览、发布与回执对账' },
    ORD: { label: '订单中心', icon: 'receipt', description: '订单同步、匹配与履约跟踪' },
    PUR: { label: '采购中心', icon: 'basket', description: '采购建议、人工确认与执行结果' },
    LOGI: { label: '物流中心', icon: 'truck', description: '物流、发货记录与轨迹' },
    AS: { label: '售后中心', icon: 'rotate', description: '售后协查、决策与平台动作' },
    FIN: { label: '财务与利润', icon: 'wallet', description: '财务流水与利润汇总' },
    TSK: { label: '任务中心', icon: 'activity', description: '任务、日志、租约、调度与人工任务' },
    STD: { label: '标准数据', icon: 'tree', description: '标准分类、属性、码值与数据字典' },
    MED: { label: '媒体存储', icon: 'image', description: '媒体、存储策略、健康与迁移' },
    SYS: { label: '系统管理', icon: 'settings', description: '权限、安全、日志、备份与系统设置' },
    RTE: { label: '执行节点', icon: 'monitor', description: 'Worker、BrowserSession 与 RouteSnapshot' }
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
    HUMAN: { name: '人工处理员', brief: '登录、验证码和异常接管', initial: '人' },
    AUDITOR: { name: '审计查看员', brief: '只读查看业务和审计证据', initial: '审' },
    PC_WORKER: { name: 'PC Worker', brief: '仅执行授权浏览器任务', initial: 'W' }
  };

  const pageMap = new Map(requirements.pages.map(page => [page.id, page]));
  const pcPageMap = new Map(requirements.pcPages.map(page => [page.id, page]));
  const buttonMap = new Map();
  requirements.pages.forEach(page => page.buttons.forEach(button => buttonMap.set(button.ButtonID, { page, button })));

  const state = {
    mode: 'web',
    activeWeb: 'DASH-001',
    activePc: 'PC-001',
    expandedModule: 'DASH',
    role: 'OWNER',
    previousRole: 'OWNER',
    storeScope: '全部店铺',
    paletteOpen: false,
    paletteQuery: '',
    traceOpen: false,
    roleMenuOpen: false,
    confirmAction: null,
    detailDrawer: null,
    activeProductTab: '基础信息',
    busy: false,
    pcTask: {
      status: 'READY',
      step: 0,
      evidence: [
        { time: '14:28:10', text: 'Server 已签发不可变 ExecutionContext' },
        { time: '14:28:12', text: 'RouteSnapshot 与 Adapter 版本校验通过' }
      ]
    }
  };

  const storeScopes = ['全部店铺', '小红书 · 青鸟生活馆', '微信小店 · 青鸟优选'];

  const svgPaths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    key: '<circle cx="8" cy="15" r="5"/><path d="m12 11 8-8"/><path d="m17 6 2 2"/><path d="m15 8 2 2"/>',
    store: '<path d="M3 10h18"/><path d="M5 10v10h14V10"/><path d="M4 4h16l1 6H3l1-6Z"/><path d="M9 14h6v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
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
    command: '<path d="M18 9a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12Z"/>',
    trace: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7.7 7.1 3.2 8.2M16.3 7.1l-3.2 8.2M8 6h8"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 4v7h-7"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    pause: '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
    external: '<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>'
  };

  function icon(name, size = 18) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgPaths[name] || svgPaths.box}</svg>`;
  }

  function safe(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return;
    const [mode, id] = raw.split('/');
    if (mode === 'web' && pageMap.has(id)) {
      state.mode = 'web';
      state.activeWeb = id;
      state.expandedModule = id.split('-')[0];
      if (state.role === 'PC_WORKER') state.role = state.previousRole || 'OWNER';
    }
    if (mode === 'pc' && pcPageMap.has(id)) {
      state.mode = 'pc';
      state.activePc = id;
      if (state.role !== 'PC_WORKER') state.previousRole = state.role;
      state.role = 'PC_WORKER';
    }
  }

  function setHash(mode, id) {
    const next = `#/${mode}/${id}`;
    if (location.hash === next) {
      render();
    } else {
      location.hash = next;
    }
  }

  function navigateWeb(id) {
    if (!pageMap.has(id)) return;
    state.mode = 'web';
    state.activeWeb = id;
    state.expandedModule = id.split('-')[0];
    if (state.role === 'PC_WORKER') state.role = state.previousRole || 'OWNER';
    closeOverlays();
    setHash('web', id);
  }

  function navigatePc(id) {
    if (!pcPageMap.has(id)) return;
    state.mode = 'pc';
    state.activePc = id;
    if (state.role !== 'PC_WORKER') state.previousRole = state.role;
    state.role = 'PC_WORKER';
    state.pcTask = {
      status: 'READY',
      step: 0,
      evidence: [
        { time: '14:28:10', text: 'Server 已签发不可变 ExecutionContext' },
        { time: '14:28:12', text: 'RouteSnapshot 与 Adapter 版本校验通过' }
      ]
    };
    closeOverlays();
    setHash('pc', id);
  }

  function closeOverlays() {
    state.paletteOpen = false;
    state.traceOpen = false;
    state.roleMenuOpen = false;
    state.confirmAction = null;
    state.detailDrawer = null;
  }

  function canViewPage(page) {
    if (state.role === 'OWNER' || state.role === 'AUDITOR') return true;
    if (state.role === 'OPS') return page.module !== 'SYS';
    if (state.role === 'HUMAN') {
      return ['DASH-002', 'DASH-003', 'TSK-145', 'ACC-019', 'ACC-023', 'CHN-073', 'SRC-049', 'AS-095', 'AS-144'].includes(page.id);
    }
    return false;
  }

  function canUseButton(page, button) {
    if (!canViewPage(page)) return false;
    if (state.role === 'OWNER') return true;
    const permission = button['权限'];
    if (state.role === 'AUDITOR') return permission === 'READ';
    if (state.role === 'OPS') {
      if (page.module === 'SYS') return false;
      if (page.id === 'SYS-116' || permission === 'DELETE') return false;
      return true;
    }
    if (state.role === 'HUMAN') {
      return ['READ', 'EXECUTE', 'UPDATE'].includes(permission);
    }
    return false;
  }

  function render() {
    const isPc = state.mode === 'pc';
    const page = isPc ? pcPageMap.get(state.activePc) : pageMap.get(state.activeWeb);
    document.title = `${page?.name || '青鸟'} · 青鸟 V3.9`;
    app.innerHTML = `
      <div class="app-shell ${isPc ? 'pc-shell' : ''}">
        ${renderSidebar()}
        ${renderTopbar(page)}
        <main class="main">
          <div class="page-wrap">
            ${isPc ? renderPcPage(page) : renderWebPage(page)}
          </div>
        </main>
      </div>
    `;
    renderOverlay();
    loading?.classList.add('is-hidden');
  }

  function renderSidebar() {
    const isPc = state.mode === 'pc';
    return `
      <aside class="sidebar" aria-label="${isPc ? 'PC Worker 导航' : '管理端导航'}">
        <div class="brand-lockup">
          <img src="./assets/${isPc ? 'qingniao-A-inverse.svg' : 'qingniao-A-ink.svg'}" alt="青鸟">
          <div class="brand-word"><strong>青鸟</strong><span>${isPc ? 'PC WORKER' : '家庭经营工作台'}</span></div>
        </div>
        <div class="mode-switch" aria-label="原型端切换">
          <button class="${!isPc ? 'active' : ''}" data-mode="web">管理端</button>
          <button class="${isPc ? 'active' : ''}" data-mode="pc">PC Worker</button>
        </div>
        <div class="workspace-chip">
          <div class="workspace-avatar">${isPc ? 'W' : '青'}</div>
          <div><strong>${isPc ? 'WKR-HOME-01' : '青鸟家庭工作室'}</strong><small>${isPc ? 'Windows 11 · Edge' : '单一家庭工作空间'}</small></div>
          <span class="muted">⌄</span>
        </div>
        <nav class="nav-scroll">
          ${isPc ? renderPcNavigation() : renderWebNavigation()}
        </nav>
        <div class="sidebar-footer">
          <div class="server-mini"><span class="dot"></span><div><strong>${isPc ? '已连接 NAS Server' : 'NAS Server 正常'}</strong><small>${isPc ? '心跳 3 秒前' : '唯一业务真源'}</small></div><span class="muted">${isPc ? '15s' : '在线'}</span></div>
        </div>
      </aside>
    `;
  }

  function renderWebNavigation() {
    return navGroups.map(group => `
      <section class="nav-section">
        <div class="nav-section-title">${safe(group.label)}</div>
        ${group.modules.map(module => {
          const meta = moduleMeta[module];
          const pages = requirements.pages.filter(page => page.module === module);
          const active = state.expandedModule === module;
          return `
            <button class="nav-module-button ${active ? 'active' : ''}" data-module="${module}">
              <span class="nav-icon">${icon(meta.icon)}</span>
              <span>${safe(meta.label)}</span>
              <span class="nav-count">${pages.length}</span>
            </button>
            ${active ? `<div class="nav-pages">${pages.map(page => `
              <button class="nav-page-button ${state.activeWeb === page.id ? 'active' : ''}" data-nav="${page.id}">
                <span>${safe(page.name)}</span><code>${safe(page.id.split('-')[1])}</code>
              </button>`).join('')}</div>` : ''}
          `;
        }).join('')}
      </section>
    `).join('');
  }

  function pcGroupLabel(id) {
    const n = Number(id.split('-')[1]);
    if (n <= 3) return '节点基础';
    if (n <= 8) return '浏览与适配';
    if (n <= 12) return '货源采集';
    if (n <= 15) return '登录与发布';
    if (n <= 19) return '履约协查';
    return '诊断';
  }

  function renderPcNavigation() {
    const groups = ['节点基础', '浏览与适配', '货源采集', '登录与发布', '履约协查', '诊断'];
    return groups.map(label => `
      <section class="nav-section">
        <div class="nav-section-title">${label}</div>
        ${requirements.pcPages.filter(page => pcGroupLabel(page.id) === label).map(page => `
          <button class="pc-nav-button ${state.activePc === page.id ? 'active' : ''}" data-pc-nav="${page.id}">
            <span>${safe(page.name)}</span><code>${safe(page.id)}</code>
          </button>`).join('')}
      </section>
    `).join('');
  }

  function renderTopbar(page) {
    const isPc = state.mode === 'pc';
    return `
      <header class="topbar">
        <div class="topbar-left">
          <div class="breadcrumb">
            <span>${isPc ? 'PC Worker' : safe(moduleMeta[page?.module]?.label || '执行工作台')}</span>
            <span class="slash">/</span>
            <strong>${safe(page?.name || '')}</strong>
            <code>${safe(page?.id || '')}</code>
          </div>
        </div>
        <div class="topbar-right">
          <button class="command-button" data-open-palette aria-label="搜索全部页面">
            ${icon('search', 16)}<span>页面台账</span><kbd>Ctrl K</kbd>
          </button>
          ${!isPc ? `<button class="top-control store-scope" data-store-scope>${icon('store', 15)}<span>${safe(state.storeScope)}</span></button>` : ''}
          <span class="freeze-pill">V3.9 冻结</span>
          ${!isPc ? `<button class="top-control role-control" data-open-role><span class="role-avatar">${roleInfo[state.role].initial}</span><strong>${roleInfo[state.role].name}</strong><span>⌄</span></button>` :
            `<button class="top-control" data-mode="web"><span class="role-avatar">W</span><strong>PC_WORKER</strong></button>`}
        </div>
      </header>
    `;
  }

  function renderWebPage(page) {
    if (!page) return renderNotFound();
    if (!canViewPage(page)) return renderPermissionDenied(page);
    if (page.id === 'DASH-001') return renderDashboard(page);
    if (page.id === 'PRD-052') return renderProductEditor(page);
    if (page.id === 'SRC-127') return renderPreviewPage(page, 'collection');
    if (page.id === 'CHN-070') return renderPreviewPage(page, 'channel');
    if (page.id === 'TSK-145') return renderHumanTaskCenter(page);
    if (page.layout.includes('分组表单')) return renderFormPage(page);
    if (page.layout.includes('分组详情')) return renderDetailPage(page);
    if (page.layout.includes('主预览区')) return renderPreviewPage(page, page.module === 'RTE' ? 'route' : 'generic');
    if (page.layout.includes('任务表格')) return renderTaskPage(page);
    return renderListPage(page);
  }

  function renderNotFound() {
    return `<div class="empty-state">${icon('alert', 38)}<strong>页面不存在</strong><span>请从页面台账重新选择。</span><button class="button" data-open-palette>打开页面台账</button></div>`;
  }

  function renderPermissionDenied(page) {
    return `
      ${renderPageHeader(page)}
      <section class="card empty-state">
        ${icon('shield', 42)}
        <strong>当前岗位无权访问此页面</strong>
        <span>${safe(roleInfo[state.role].name)}按 V3.9 的 Role、PermissionCode、Page 与 Button 共同校验。</span>
        <button class="button" data-open-role>切换评审角色</button>
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function renderPageHeader(page, actions = '') {
    const meta = moduleMeta[page.module];
    return `
      <div class="page-head">
        <div class="page-title-block">
          <div class="eyebrow"><span>${safe(meta?.label || page.module)}</span><span>·</span><code>${safe(page.id)}</code><span class="meta-tag">演示数据</span></div>
          <h1>${safe(page.name)}</h1>
          <p class="page-subtitle">${safe(meta?.description || page.scenario)}</p>
        </div>
        <div class="page-actions">
          ${actions}
          <button class="button" data-open-trace>${icon('trace', 15)}冻结追踪</button>
        </div>
      </div>
    `;
  }

  function renderDashboard(page) {
    const pageActions = page.buttons
      .filter(button => canUseButton(page, button))
      .map(button => renderActionButton(page, button, false))
      .join('');
    const flow = [
      ['01', '货源探查', '待确认 3', 'SRC-042'],
      ['02', '正式采集', '执行中 2', 'SRC-046'],
      ['03', '商品整理', '草稿 6', 'PRD-052'],
      ['04', '渠道发布', '待发布 4', 'CHN-071'],
      ['05', '订单履约', '今日 38', 'ORD-074'],
      ['06', '售后财务', '待处理 2', 'AS-093']
    ];
    return `
      ${renderPageHeader(page, pageActions)}
      <section class="metrics-grid" aria-label="今日经营指标">
        ${[
          ['待人工处理', '5', '较昨日', '2 项新增'],
          ['执行中任务', '12', 'Worker', '3 台在线'],
          ['结果待确认', '2', '必须先', '对账再处理'],
          ['今日订单', '38', '同步成功', '100%']
        ].map((item, index) => `
          <article class="card metric-card">
            <div class="metric-label"><span>${item[0]}</span><span>${index < 2 ? '实时' : '截至 14:32'}</span></div>
            <div class="metric-value">${item[1]}</div>
            <div class="metric-meta">${item[2]} · <strong>${item[3]}</strong></div>
          </article>`).join('')}
      </section>
      <section class="dashboard-grid">
        <article class="card workflow-board">
          <div class="workflow-title"><div><h2>今日经营链路</h2><span class="muted">从货源发现到订单履约，状态由 NAS Server 统一裁决</span></div><span class="status-tag ok">链路正常</span></div>
          <div class="workflow-lane">
            ${flow.map(item => `<button class="workflow-step" data-go="${item[3]}"><span class="workflow-index">${item[0]}</span><span class="workflow-count">${item[2]}</span><strong>${item[1]}</strong><small>进入处理</small></button>`).join('')}
          </div>
        </article>
        <article class="card">
          <div class="card-head"><div><h2>执行环境</h2><small>Server 与 PC Worker</small></div><button class="button small" data-go="RTE-123">管理节点</button></div>
          <div class="card-body health-stack">
            <div class="health-row"><div class="health-icon">${icon('shield')}</div><div><strong>NAS Server</strong><small>唯一业务真源 · 最近备份 14:15</small></div><span class="status-tag ok">正常</span></div>
            <div class="health-row"><div class="health-icon">${icon('monitor')}</div><div><strong>WKR-HOME-01</strong><small>Edge 138 · 心跳 3 秒前</small></div><span class="status-tag running">执行中</span></div>
            <div class="health-row"><div class="health-icon">${icon('monitor')}</div><div><strong>WKR-HOME-02</strong><small>Chrome 137 · 心跳 8 秒前</small></div><span class="status-tag ok">空闲</span></div>
            <div><div class="metric-label"><span>任务队列容量</span><span>76 / 500</span></div><div class="progress-track"><span style="width:15.2%"></span></div></div>
          </div>
        </article>
      </section>
      <section class="dashboard-grid equal">
        <article class="card">
          <div class="card-head"><div><h2>需要人工介入</h2><small>登录、验证码、风险控制和结果对账</small></div><button class="button small" data-go="TSK-145">全部待办</button></div>
          <div class="task-list">
            ${[
              ['danger', '小红书发布需要扫码确认', '发布任务 · 青鸟生活馆 · 3 分钟前', '处理', 'TSK-145'],
              ['', '1688 采集触发验证码', '正式采集 · 来源商品 88341 · 8 分钟前', '处理', 'TSK-145'],
              ['', '外部发布结果待对账', '微信小店 · PublishTask 240918-016', '去对账', 'CHN-141']
            ].map(item => `<div class="task-item"><span class="task-severity ${item[0]}"></span><div><div class="task-title"><strong>${item[1]}</strong>${item[0] === 'danger' ? '<span class="status-tag danger">高优先</span>' : ''}</div><div class="task-detail">${item[2]}</div></div><button class="button small" data-go="${item[4]}">${item[3]}</button></div>`).join('')}
          </div>
        </article>
        <article class="card">
          <div class="card-head"><div><h2>经营提醒</h2><small>不替代最终业务确认</small></div><button class="button small" data-go="DASH-003">异常中心</button></div>
          <div class="card-body health-stack">
            <div class="notice warn">${icon('alert')}<div><strong>2 条关键路由将在 7 天内到期</strong><p>发布、订单等关键路由需在 30 天周期内完成验证。</p></div></div>
            <div class="notice">${icon('info')}<div><strong>6 个商品草稿尚未生成版本</strong><p>草稿保存不会替代 ProductVersion，发布前需人工确认。</p></div></div>
            <div class="notice success">${icon('check')}<div><strong>今日订单同步已完成</strong><p>38 笔订单已进入统一订单视图，无待确认冲突。</p></div></div>
          </div>
        </article>
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function queryFields(page) {
    return page.fields.filter(field => field['角色'].includes('QUERY'));
  }

  function contentFields(page) {
    const fields = page.fields.filter(field => !field['角色'].includes('QUERY'));
    return fields.length ? fields : page.fields;
  }

  function filterButtons(page) {
    return page.buttons.filter(button => /查询|重置|刷新/.test(button['按钮']));
  }

  function actionButtons(page) {
    const filters = new Set(filterButtons(page).map(button => button.ButtonID));
    return page.buttons.filter(button => !filters.has(button.ButtonID));
  }

  function renderFilters(page) {
    const fields = queryFields(page).slice(0, 4);
    const buttons = filterButtons(page).filter(button => canUseButton(page, button));
    if (!fields.length && !buttons.length) return '';
    return `
      <section class="card filter-card">
        <div class="filter-grid">
          ${fields.map(field => renderQueryField(field)).join('')}
          <div class="filter-actions">${buttons.map(button => renderActionButton(page, button)).join('')}</div>
        </div>
      </section>
    `;
  }

  function renderQueryField(field) {
    const name = field['中文名称'];
    const codeSet = field.CodeSet;
    if (codeSet && codeSet !== 'NONE' && requirements.codeSets[codeSet]) {
      return `<div class="field"><label>${safe(name)}</label><select class="select"><option value="">全部</option>${requirements.codeSets[codeSet].map(item => `<option value="${safe(item.code)}">${safe(item.name)}</option>`).join('')}</select></div>`;
    }
    const placeholder = name.includes('时间') ? '开始时间 — 结束时间' : `请输入${name.replace('关键字', '')}`;
    return `<div class="field"><label>${safe(name)}</label><input class="input" placeholder="${safe(placeholder)}" aria-label="${safe(name)}"></div>`;
  }

  function renderActionButton(page, button, small = true) {
    if (!canUseButton(page, button)) return '';
    const label = button['按钮'];
    const style = /删除|停用|取消|撤销|拒绝/.test(label) ? 'danger' : /创建|确认|保存|提交|执行|认领|发布|生成|新增|开始|应用/.test(label) ? 'primary' : '';
    return `<button class="button ${style} ${small ? 'small' : ''}" data-button-id="${safe(button.ButtonID)}" title="${safe(button.ButtonID)}">${safe(label)}</button>`;
  }

  function renderToolbar(page) {
    const actions = actionButtons(page);
    const allowed = actions.filter(button => canUseButton(page, button));
    const hidden = actions.length - allowed.length;
    return `
      <div class="toolbar">
        <div class="toolbar-left">${allowed.map(button => renderActionButton(page, button)).join('') || '<span class="toolbar-note">当前页面无可执行写操作</span>'}</div>
        <div class="toolbar-right">
          ${hidden ? `<span class="toolbar-note">${hidden} 项操作按当前岗位隐藏</span>` : ''}
          <span class="toolbar-note">共 23 条演示记录</span>
        </div>
      </div>
    `;
  }

  function fieldValue(field, row = 0) {
    const name = field['中文名称'];
    const values = {
      '平台': ['1688', '小红书', '微信小店'],
      '平台名称': ['1688', '小红书', '微信小店'],
      '店铺名称': ['青鸟生活馆', '青鸟优选', '青鸟日用'],
      '账号名称': ['采购账号·3286', '运营账号·1082', '店主账号·7613'],
      '商品名称': ['亚麻通勤手提包', '轻量折叠收纳箱', '原木桌面置物架'],
      '供应商名称': ['宁波青禾日用', '义乌简物供应', '广州轻织工坊'],
      '物流商名称': ['中通快递', '圆通速递', '申通快递'],
      '指标名称': ['待人工任务', '执行中任务', '今日订单'],
      '指标中文值': ['5', '12', '38'],
      '任务类型中文': ['渠道发布', '正式采集', '订单同步'],
      '业务类型中文': ['商品发布', '来源采集', '订单履约']
    };
    if (values[name]) return values[name][row % values[name].length];
    if (name.includes('状态')) return ['待执行', '执行中', '等待人工处理'][row % 3];
    if (name.includes('时间') || name.endsWith('At')) return ['2026-09-18 14:32', '2026-09-18 13:48', '2026-09-18 11:06'][row % 3];
    if (/金额|价格|成本|利润|收入|费用/.test(name)) return ['¥ 128.00', '¥ 76.50', '¥ 219.00'][row % 3];
    if (/数量|库存|件数|异常数量|待处理数量/.test(name)) return ['12', '5', '38'][row % 3];
    if (/URL|地址/.test(name)) return ['https://s.1688.com/', 'https://ark.xiaohongshu.com', 'https://channels.weixin.qq.com/shop'][row % 3];
    if (/TraceID/.test(name)) return ['tr_9f8a…12d3', 'tr_472b…8ae1', 'tr_a124…ef07'][row % 3];
    if (/版本/.test(name)) return ['v3.9.18', 'v3.9.17', 'v3.9.16'][row % 3];
    if (/SKU/.test(name)) return ['米白 / M', '深青 / L', '原木色 / 标准'][row % 3];
    if (/ID|编号|编码/.test(name)) {
      const prefix = name.replace(/[^\u4e00-\u9fa5A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'ID';
      return `${prefix}-${String(240918 + row).padStart(6, '0')}`;
    }
    if (/名称|标题/.test(name)) return ['青鸟生活馆', '秋季日用选品', '家庭经营任务'][row % 3];
    if (/类型|方式/.test(name)) return ['扫码登录', '正式采集', '渠道发布'][row % 3];
    if (/是否|启用/.test(name)) return row % 2 ? '否' : '是';
    return ['—', '已配置', '正常'][row % 3];
  }

  function statusClass(value) {
    if (/成功|正常|有效|完整|完成/.test(value)) return 'ok';
    if (/执行中|检查中|已认领/.test(value)) return 'running';
    if (/等待|待执行|待确认|警告|即将/.test(value)) return 'warn';
    if (/失败|失效|阻断|取消/.test(value)) return 'danger';
    return 'neutral';
  }

  function renderDataTable(page, rowCount = 6) {
    const fields = contentFields(page).slice(0, 7);
    return `
      <div class="table-scroll">
        <table>
          <thead><tr>${fields.map(field => `<th>${safe(field['中文名称'])}</th>`).join('')}<th>操作</th></tr></thead>
          <tbody>
            ${Array.from({ length: rowCount }, (_, row) => {
              return `<tr>${fields.map((field, index) => {
                const value = fieldValue(field, row);
                if (field['中文名称'].includes('状态')) return `<td><span class="status-tag ${statusClass(value)}">${safe(value)}</span></td>`;
                if (index === 0) return `<td><button class="row-link" data-row-detail="${row}">${safe(value)}</button></td>`;
                return `<td class="${/ID|编号|Trace/.test(field['中文名称']) ? 'mono' : ''}"><span class="ellipsis" title="${safe(value)}">${safe(value)}</span></td>`;
              }).join('')}<td><button class="button small ghost" data-row-detail="${row}">查看</button></td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div class="pagination"><span>第 1–6 条，共 23 条</span><div class="pagination-controls"><button class="page-number">‹</button><button class="page-number active">1</button><button class="page-number">2</button><button class="page-number">3</button><button class="page-number">›</button></div></div>
    `;
  }

  function renderListPage(page) {
    return `
      ${renderPageHeader(page)}
      ${renderFilters(page)}
      <section class="card table-card">
        ${renderToolbar(page)}
        ${state.busy ? '<div class="empty-state"><strong>正在查询</strong><span>请求已进入 NAS Server，返回后更新列表。</span></div>' : renderDataTable(page)}
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function renderInputForField(field, index = 0) {
    const name = field['中文名称'];
    const editable = field['可编辑'] === '是';
    const required = field['必填'] === '是';
    const codeSet = field.CodeSet;
    const full = /说明|备注|描述|内容|地址|规则/.test(name);
    if (codeSet && codeSet !== 'NONE' && requirements.codeSets[codeSet]) {
      return `<div class="field ${full ? 'full' : ''}"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><select class="select" ${editable ? '' : 'disabled'}>${requirements.codeSets[codeSet].map(item => `<option>${safe(item.name)}</option>`).join('')}</select><span class="field-help">${editable ? '保存时由 Server 校验' : '由 Server / CodeSet 提供'}</span></div>`;
    }
    const value = fieldValue(field, index);
    if (full) {
      return `<div class="field full"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><textarea class="textarea" ${editable ? '' : 'readonly'}>${safe(value === '—' ? '' : value)}</textarea><span class="field-help">${safe(field['校验/展示'])}</span></div>`;
    }
    return `<div class="field"><label>${safe(name)}${required ? '<span class="required">*</span>' : ''}</label><input class="input" value="${safe(value === '—' ? '' : value)}" ${editable ? '' : 'readonly'}><span class="field-help">${editable ? '可编辑 · Server 校验' : '只读 · ' + safe(field['来源'])}</span></div>`;
  }

  function renderFormPage(page) {
    const fields = contentFields(page);
    const footerButtons = page.buttons.filter(button => canUseButton(page, button));
    const sensitiveNotice = page.module === 'ACC' || page.id === 'SYS-116'
      ? `<div class="notice warn">${icon('shield')}<div><strong>凭据只保存 SecretRef</strong><p>密码、Cookie、Token 不回显，不进入业务字段、普通日志或 Evidence 文本。</p></div></div>`
      : '';
    return `
      ${renderPageHeader(page)}
      <div class="form-layout">
        <section class="card">
          <div class="card-head"><div><h2>${safe(page.name)}</h2><small>带 * 为冻结必填字段</small></div><span class="status-tag neutral">编辑中</span></div>
          <div class="card-body">
            ${sensitiveNotice}
            <div class="form-section" style="${sensitiveNotice ? 'margin-top:16px' : ''}">
              <div class="form-grid">${fields.map((field, index) => renderInputForField(field, index)).join('')}</div>
            </div>
          </div>
          <div class="form-footer">${footerButtons.map(button => renderActionButton(page, button, false)).join('')}</div>
        </section>
        <aside class="card sticky-card">
          <div class="card-head"><h3>业务上下文</h3><span class="meta-tag">Server</span></div>
          <div class="card-body context-list">
            <div class="context-row"><span>业务对象</span><strong>${safe(page.businessObject)}</strong></div>
            <div class="context-row"><span>页面标识</span><strong class="mono">${safe(page.id)}</strong></div>
            <div class="context-row"><span>版本令牌</span><strong class="mono">rv_000018</strong></div>
            <div class="context-row"><span>店铺范围</span><strong>${safe(state.storeScope)}</strong></div>
            <div class="context-row"><span>状态裁决</span><strong>NAS Server</strong></div>
            <div class="context-row"><span>最后更新</span><strong>2026-09-18 14:32</strong></div>
          </div>
        </aside>
      </div>
      ${renderSpecStrip(page)}
    `;
  }

  function renderProductEditor(page) {
    const tabs = [
      ['基础信息', 'PRD-052'],
      ['SKU', 'PRD-053'],
      ['媒体', 'PRD-056'],
      ['分类属性', 'PRD-057'],
      ['成本利润', 'PRD-058'],
      ['AI 辅助', 'PRD-059']
    ];
    const fields = contentFields(page);
    return `
      ${renderPageHeader(page)}
      <div class="notice warn" style="margin-bottom:14px">${icon('info')}<div><strong>当前为商品草稿 rev.18</strong><p>保存草稿不会覆盖 ProductVersion；AI 只生成建议，人工接受、拒绝或修改后才能应用。</p></div></div>
      <div class="form-layout">
        <section class="card">
          <div class="tabs">${tabs.map(tab => `<button class="tab-button ${tab[0] === state.activeProductTab ? 'active' : ''}" data-product-tab="${safe(tab[0])}" data-tab-target="${tab[1]}">${safe(tab[0])}</button>`).join('')}</div>
          <div class="card-body">
            <div class="form-grid">${fields.map((field, index) => renderInputForField(field, index)).join('')}</div>
          </div>
          <div class="form-footer">${page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('')}</div>
        </section>
        <aside class="card sticky-card">
          <div class="card-head"><h3>版本与来源</h3><span class="status-tag warn">草稿</span></div>
          <div class="card-body context-list">
            <div class="context-row"><span>商品</span><strong>亚麻通勤手提包</strong></div>
            <div class="context-row"><span>关联来源</span><strong>SRC-240918-031 · 1688</strong></div>
            <div class="context-row"><span>当前正式版本</span><strong>ProductVersion v7</strong></div>
            <div class="context-row"><span>草稿修订</span><strong>DraftRevision 18</strong></div>
            <div class="context-row"><span>并发令牌</span><strong class="mono">ct_8bd2…91a0</strong></div>
          </div>
          <div class="card-body" style="border-top:1px solid var(--line)"><button class="button" style="width:100%" data-go="PRD-126">编辑后预览</button></div>
        </aside>
      </div>
      ${renderSpecStrip(page)}
    `;
  }

  function renderDetailPage(page) {
    const fields = contentFields(page);
    const actions = page.buttons.filter(button => canUseButton(page, button)).map(button => renderActionButton(page, button, false)).join('');
    return `
      ${renderPageHeader(page, actions)}
      <section class="card detail-hero">
        <div class="detail-key"><small>${safe(page.businessObject)}</small><strong>${safe(fieldValue(fields[1] || fields[0], 0))}</strong><span class="mono">${safe(fieldValue(fields[0], 0))}</span></div>
        <span class="status-tag ok">正常</span>
      </section>
      <section class="detail-grid">
        ${fields.map((field, index) => `<div class="detail-cell"><span>${safe(field['中文名称'])}</span><strong class="${/ID|编号|Trace/.test(field['中文名称']) ? 'mono' : ''}">${safe(fieldValue(field, index % 3))}</strong></div>`).join('')}
      </section>
      <section class="card" style="margin-top:14px">
        <div class="card-head"><div><h2>关联记录与操作留痕</h2><small>写操作由 Server 记录 Before / After / TraceID</small></div><span class="meta-tag">只读</span></div>
        <div class="task-list">
          <div class="task-item"><span class="task-severity" style="background:var(--qn-ok)"></span><div><div class="task-title"><strong>资料已更新</strong></div><div class="task-detail">家庭管理员 · 2026-09-18 14:32 · Trace tr_9f8a…12d3</div></div><span class="status-tag ok">已记录</span></div>
          <div class="task-item"><span class="task-severity" style="background:var(--qn-lapis)"></span><div><div class="task-title"><strong>业务对象已创建</strong></div><div class="task-detail">运营成员 · 2026-09-17 10:21 · Trace tr_472b…8ae1</div></div><span class="status-tag neutral">历史</span></div>
        </div>
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function renderPreviewPage(page, kind) {
    if (kind === 'route') return renderRoutePreview(page);
    const channel = kind === 'channel' || page.module === 'CHN';
    const source = kind === 'collection' || page.module === 'SRC';
    const contexts = channel
      ? [['销售平台', '小红书'], ['执行账号', '运营账号 · 1082'], ['目标店铺', '青鸟生活馆'], ['工作台路由', 'ark.xiaohongshu.com · v12']]
      : source
        ? [['货源平台', '1688'], ['执行账号', '采购账号 · 3286'], ['来源商品', '883412790106'], ['采集路由', '商品详情 · v18']]
        : [['业务对象', page.businessObject], ['当前版本', 'rev.18'], ['校验状态', '有效'], ['更新时间', '14:32']];
    const actions = page.buttons.filter(button => canUseButton(page, button));
    return `
      ${renderPageHeader(page)}
      <section class="card preview-context">${contexts.map(item => `<div class="preview-context-item"><span>${item[0]}</span><strong>${item[1]}</strong></div>`).join('')}</section>
      <div class="preview-main">
        <section class="card product-preview">
          <div class="product-preview-head">
            <div class="product-image-placeholder">${icon('image', 36)}<span>主图 1 / 6</span></div>
            <div>
              <span class="meta-tag">${source ? '来源事实只读' : channel ? '渠道呈现' : '内部商品'}</span>
              <h2>亚麻通勤手提包 · 轻量大容量</h2>
              <p class="muted">${source ? '来源标题与快照保持可追溯，不在采集预览中改写。' : '发布快照已绑定 ProductVersion v7，修改需重新生成预览。'}</p>
              <div class="price-line">¥ 128.00</div>
              <div class="sku-row"><span class="sku-chip active">米白 / M</span><span class="sku-chip">深青 / M</span><span class="sku-chip">米白 / L</span></div>
            </div>
          </div>
          <div style="margin-top:22px">
            <h3>${source ? '采集范围' : '商品详情摘要'}</h3>
            <div class="detail-grid" style="grid-template-columns:repeat(3,1fr)">
              <div class="detail-cell"><span>SKU</span><strong>3 个</strong></div>
              <div class="detail-cell"><span>媒体</span><strong>${source ? '6 / 9 项' : '6 张图片'}</strong></div>
              <div class="detail-cell"><span>${source ? '完整度' : '库存'}</span><strong>${source ? '部分完整' : '126'}</strong></div>
            </div>
          </div>
        </section>
        <aside class="card">
          <div class="card-head"><div><h2>校验与差异</h2><small>确认前必须清零阻断项</small></div><span class="status-tag ${source ? 'warn' : 'ok'}">${source ? '有警告' : '有效'}</span></div>
          <div class="card-body validation-list">
            <div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>主体与版本已锁定</strong><small>${channel ? 'ProductVersion v7 · PayloadHash 已生成' : 'Candidate 与 RouteSnapshot 未过期'}</small></div></div>
            <div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>${channel ? '平台 / 账号 / 店铺已确认' : '标题、价格、SKU、主图完整'}</strong><small>执行上下文将随任务固化</small></div></div>
            <div class="validation-item ${source ? 'warn' : 'ok'}"><span class="validation-mark">${source ? '!' : '✓'}</span><div><strong>${source ? '详情媒体缺少 3 项' : '渠道映射校验通过'}</strong><small>${source ? '允许以“部分完整”落库，不得标记为完整' : '类目、属性与 SKU 无阻断差异'}</small></div></div>
            <div class="notice warn">${icon('alert')}<div><strong>外部平台仍保留人工确认</strong><p>验证码、风控、最终发布与结果未知均不得自动绕过。</p></div></div>
          </div>
          <div class="form-footer">${actions.map(button => renderActionButton(page, button, false)).join('')}</div>
        </aside>
      </div>
      ${renderSpecStrip(page)}
    `;
  }

  function renderRoutePreview(page) {
    const actions = page.buttons.filter(button => canUseButton(page, button));
    return `
      ${renderPageHeader(page)}
      <section class="card preview-context">
        ${[['平台', '小红书'], ['账号', '运营账号 · 1082'], ['店铺', '青鸟生活馆'], ['能力', '商品发布']].map(item => `<div class="preview-context-item"><span>${item[0]}</span><strong>${item[1]}</strong></div>`).join('')}
      </section>
      <div class="preview-main">
        <section class="card">
          <div class="card-head"><div><h2>解析结果</h2><small>RouteSnapshot 在任务创建时固化</small></div><span class="status-tag ok">验证通过</span></div>
          <div class="card-body context-list">
            <div class="context-row"><span>EndpointType</span><strong>工作台</strong></div>
            <div class="context-row"><span>目标地址</span><strong>https://ark.xiaohongshu.com</strong></div>
            <div class="context-row"><span>RouteSnapshot</span><strong class="mono">rte_7f2d…19a4 · v12</strong></div>
            <div class="context-row"><span>Adapter / Fixture</span><strong>adapter-xhs 3.9.18 / fixture 2026.09.18</strong></div>
            <div class="context-row"><span>浏览器基线</span><strong>Windows 11 · Edge 138 · Profile acc_1082</strong></div>
          </div>
        </section>
        <aside class="card">
          <div class="card-head"><h2>路由校验</h2><span class="status-tag ok">30 天内</span></div>
          <div class="card-body validation-list">
            <div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>URL 模式匹配</strong><small>不保存敏感查询参数</small></div></div>
            <div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>页面签名一致</strong><small>Adapter 与 Fixture 版本可追溯</small></div></div>
            <div class="validation-item ok"><span class="validation-mark">✓</span><div><strong>Profile 独占可用</strong><small>无有效写租约冲突</small></div></div>
          </div>
          <div class="form-footer">${actions.map(button => renderActionButton(page, button, false)).join('')}</div>
        </aside>
      </div>
      ${renderSpecStrip(page)}
    `;
  }

  function renderTaskPage(page) {
    return `
      ${renderPageHeader(page)}
      <section class="task-summary-grid">
        ${[['待执行', '8', 'warn'], ['执行中', '12', 'running'], ['等待人工处理', '5', 'warn'], ['结果待确认', '2', 'danger'], ['今日成功', '64', 'ok']].map(item => `<article class="card task-summary"><span>${item[0]}</span><strong>${item[1]}</strong><span class="status-tag ${item[2]}">${item[0]}</span></article>`).join('')}
      </section>
      ${renderFilters(page)}
      <section class="card table-card">
        ${renderToolbar(page)}
        ${renderTaskTable(page)}
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function renderTaskTable(page) {
    const states = [
      ['TK-240918-023', '渠道发布', '等待人工处理', 'WKR-HOME-01', '需要扫码确认', '3 分钟前'],
      ['TK-240918-021', '正式采集', '执行中', 'WKR-HOME-02', '正在提取 SKU', '5 分钟前'],
      ['TK-240918-016', '发布对账', '结果待确认', 'WKR-HOME-01', '等待只读对账', '12 分钟前'],
      ['TK-240918-011', '订单同步', '成功', 'WKR-HOME-03', '38 笔已入库', '28 分钟前'],
      ['TK-240918-008', '媒体上传', '等待重试', 'WKR-HOME-02', '网络中断 · 30 秒后', '33 分钟前']
    ];
    return `
      <div class="table-scroll"><table><thead><tr><th>任务ID</th><th>任务类型</th><th>状态</th><th>执行节点</th><th>当前步骤</th><th>更新时间</th><th>操作</th></tr></thead>
      <tbody>${states.map((row, index) => `<tr><td><button class="row-link mono" data-row-detail="${index}">${row[0]}</button></td><td class="cell-primary">${row[1]}</td><td><span class="status-tag ${statusClass(row[2])}">${row[2]}</span></td><td>${row[3]}</td><td>${row[4]}</td><td class="muted">${row[5]}</td><td><button class="button small ghost" data-row-detail="${index}">详情</button></td></tr>`).join('')}</tbody></table></div>
      <div class="pagination"><span>第 1–5 条，共 27 条</span><div class="pagination-controls"><button class="page-number active">1</button><button class="page-number">2</button><button class="page-number">3</button></div></div>
    `;
  }

  function renderHumanTaskCenter(page) {
    return `
      ${renderPageHeader(page)}
      <div class="notice warn" style="margin-bottom:14px">${icon('shield')}<div><strong>人工接管不改变跨端职责边界</strong><p>人工在原 BrowserProfile 中处理；PC 回传 Result 与 Evidence，最终状态仍由 NAS Server 校验和裁决。</p></div></div>
      <section class="task-summary-grid">
        ${[['待认领', '3', 'warn'], ['处理中', '2', 'running'], ['登录失效', '1', 'danger'], ['验证码 / 扫码', '2', 'warn'], ['结果待确认', '1', 'danger']].map(item => `<article class="card task-summary"><span>${item[0]}</span><strong>${item[1]}</strong><span class="status-tag ${item[2]}">${item[0]}</span></article>`).join('')}
      </section>
      ${renderFilters(page)}
      <section class="card table-card">
        ${renderToolbar(page)}
        ${renderTaskTable(page)}
      </section>
      ${renderSpecStrip(page)}
    `;
  }

  function renderSpecStrip(page) {
    return `<div class="spec-strip"><span>冻结事实：${page.fields.length} 个字段 · ${page.buttons.length} 个按钮 · ${page.apiIds.length} 个页面关联 API · 状态由 NAS Server 裁决</span><button data-open-trace>查看 Page / Field / Button / API / Test 全链路 →</button></div>`;
  }

  function renderPcPage(page) {
    if (!page) return renderNotFound();
    if (page.id === 'PC-001') return renderPcHome(page);
    if (page.id === 'PC-002') return renderPcPairing(page);
    return renderPcExecution(page);
  }

  function renderPcHeader(page) {
    return `
      <div class="page-head">
        <div class="page-title-block">
          <div class="eyebrow"><span>${safe(page.category)}</span><span>·</span><code>${safe(page.id)}</code><span class="meta-tag">本地执行端</span></div>
          <h1>${safe(page.name)}</h1>
          <p class="page-subtitle">PC Worker 只执行 Server 下发的不可变上下文，不写业务数据库、不自行裁决状态。</p>
        </div>
        <div class="page-actions"><button class="button" data-open-trace>${icon('trace', 15)}冻结契约</button></div>
      </div>
    `;
  }

  function renderWorkerHero() {
    return `
      <section class="card worker-hero">
        <div class="worker-id"><div class="worker-icon">${icon('monitor', 24)}</div><div><strong>WKR-HOME-01</strong><small>已与 NAS Server 配对 · TLS 1.3</small></div></div>
        <div class="worker-stats">
          <div class="worker-stat"><span>状态</span><strong>在线</strong></div>
          <div class="worker-stat"><span>最近心跳</span><strong>3 秒前</strong></div>
          <div class="worker-stat"><span>版本</span><strong>3.9.18</strong></div>
        </div>
      </section>
    `;
  }

  function renderPcHome(page) {
    return `
      ${renderPcHeader(page)}
      ${renderWorkerHero()}
      <section class="metrics-grid">
        ${[['待领取任务', '4', 'Server 队列'], ['执行中', '1', 'Profile 独占'], ['等待人工', '1', '原会话接管'], ['今日完成', '26', 'Evidence 完整']].map(item => `<article class="card metric-card"><div class="metric-label"><span>${item[0]}</span><span>${item[2]}</span></div><div class="metric-value">${item[1]}</div><div class="metric-meta">状态由 <strong>Server 裁决</strong></div></article>`).join('')}
      </section>
      <div class="dashboard-grid">
        <section class="card table-card">
          <div class="card-head"><div><h2>可领取任务</h2><small>能力、版本和 Profile 匹配后才可 Claim</small></div><button class="button small" data-pc-action="refresh">${icon('refresh', 14)}刷新</button></div>
          <div class="task-list">
            ${[
              ['正式采集', '1688 · 商品 883412790106', 'PC-010'],
              ['渠道发布', '小红书 · 青鸟生活馆', 'PC-014'],
              ['订单同步', '微信小店 · 游标 20260918-14', 'PC-016'],
              ['发布对账', '结果待确认 · PublishTask 016', 'PC-015']
            ].map((item, index) => `<div class="task-item"><span class="task-severity ${index === 3 ? 'danger' : ''}"></span><div><div class="task-title"><strong>${item[0]}</strong><span class="status-tag ${index === 3 ? 'danger' : 'warn'}">${index === 3 ? '结果待确认' : '待执行'}</span></div><div class="task-detail">${item[1]}</div></div><button class="button small ${index === 0 ? 'primary' : ''}" data-go-pc="${item[2]}">打开</button></div>`).join('')}
          </div>
        </section>
        <aside class="card">
          <div class="card-head"><h2>本机环境</h2><span class="status-tag ok">可执行</span></div>
          <div class="card-body context-list">
            <div class="context-row"><span>操作系统</span><strong>Windows 11 23H2 x64</strong></div>
            <div class="context-row"><span>浏览器</span><strong>Edge 138 · Chrome 137</strong></div>
            <div class="context-row"><span>BrowserProfile</span><strong>3 个 · 2 个可用</strong></div>
            <div class="context-row"><span>Adapter / Fixture</span><strong>全部通过自检</strong></div>
            <div class="context-row"><span>本地业务数据</span><strong>无 · 仅缓存执行上下文</strong></div>
          </div>
          <div class="card-body" style="border-top:1px solid var(--line)"><button class="button" style="width:100%" data-go-pc="PC-020">运行诊断</button></div>
        </aside>
      </div>
    `;
  }

  function renderPcPairing(page) {
    return `
      ${renderPcHeader(page)}
      ${renderWorkerHero()}
      <div class="form-layout">
        <section class="card">
          <div class="card-head"><div><h2>配对此设备</h2><small>配对码由 OWNER 在管理端生成</small></div><span class="status-tag warn">待确认</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="field full"><label>NAS Server 地址<span class="required">*</span></label><input class="input" value="https://qingniao-nas.local"><span class="field-help">必须使用 HTTPS</span></div>
              <div class="field"><label>设备名称<span class="required">*</span></label><input class="input" value="家庭主电脑"></div>
              <div class="field"><label>配对码<span class="required">*</span></label><input class="input mono" value="QN-842-761"></div>
            </div>
            <div class="notice" style="margin-top:16px">${icon('info')}<div><strong>配对不会复制业务数据库</strong><p>本机只保存 WorkerToken 引用与运行配置，业务事实仍由 NAS Server 管理。</p></div></div>
          </div>
          <div class="form-footer"><button class="button primary" data-pc-action="pair">验证并配对</button></div>
        </section>
        <aside class="card sticky-card">
          <div class="card-head"><h3>冻结输出</h3><span class="meta-tag">${safe(page.id)}</span></div>
          <div class="card-body context-list">
            ${page.output.split('、').map(item => `<div class="context-row"><span>Server 确认后返回</span><strong>${safe(item)}</strong></div>`).join('')}
          </div>
        </aside>
      </div>
    `;
  }

  function pcStatusName(code) {
    const names = { READY: '待执行', CLAIMED: '已认领', RUNNING: '执行中', WAIT_HUMAN: '等待人工处理', SUCCESS: '成功', FAILED: '失败', CANCELLED: '已取消', UNKNOWN: '结果待确认' };
    return names[code] || code;
  }

  function renderPcExecution(page) {
    const steps = page.steps.split('→').map(step => step.trim()).filter(Boolean);
    const pc = state.pcTask;
    const contextLines = page.input.split('、').map((item, index) => `${item}: ${pcContextValue(item, index)}`);
    return `
      ${renderPcHeader(page)}
      ${renderWorkerHero()}
      <div class="execution-grid">
        <aside class="card execution-context">
          <div class="card-head"><div><h3>不可变执行上下文</h3><small>仅展示，不允许本地改写</small></div><span class="status-tag ${statusClass(pcStatusName(pc.status))}">${pcStatusName(pc.status)}</span></div>
          <div class="card-body">
            <div class="context-code">${contextLines.map(line => `${safe(line)}<br>`).join('')}RouteSnapshotID: rte_7f2d…19a4<br>AttemptID: att_240918_01<br>LeaseToken: ••••••••<br>AdapterVersion: 3.9.18</div>
            <div class="notice warn" style="margin-top:12px">${icon('shield')}<div><strong>禁止本地猜测</strong><p>账号、店铺、URL、Profile、Adapter 均来自 Server。</p></div></div>
          </div>
        </aside>
        <section class="card">
          <div class="card-head"><div><h2>执行步骤</h2><small>Heartbeat 15 秒 · 失联 45 秒 · Lease 60 秒</small></div><span class="meta-tag">${safe(page.category)}</span></div>
          <div class="card-body">
            <div class="stepper">
              ${steps.map((step, index) => `<div class="step-row ${index < pc.step ? 'done' : index === pc.step && pc.status !== 'READY' ? 'active' : ''}"><span class="step-dot">${index < pc.step ? '✓' : index + 1}</span><strong>${safe(step)}</strong><small>${index < pc.step ? '已完成并记录检查点' : index === pc.step && pc.status !== 'READY' ? '当前步骤 · 持续上报 Progress' : '等待前置步骤'}</small></div>`).join('')}
            </div>
            ${pc.status === 'WAIT_HUMAN' ? `<div class="notice danger">${icon('alert')}<div><strong>检测到验证码 / 二次验证</strong><p>任务已暂停并上报 CAPTCHA_REQUIRED。只能由 HUMAN 或 OWNER 在原 BrowserProfile 中处理，禁止识别、破解或绕过。</p></div></div>` : ''}
            <div class="execution-controls">${renderPcControls(steps.length)}</div>
          </div>
        </section>
        <aside class="card">
          <div class="card-head"><div><h3>Evidence 与输出</h3><small>脱敏后回传 Server 校验</small></div><span class="meta-tag">${pc.evidence.length} 条</span></div>
          <div class="card-body">
            <div class="evidence-box">
              ${pc.evidence.map(item => `<div class="evidence-item"><time>${safe(item.time)}</time>${safe(item.text)}</div>`).join('')}
            </div>
            <div class="trace-section"><h3>冻结输出</h3><div class="context-list">${page.output.split('、').map(item => `<div class="context-row"><span>ResultDTO</span><strong>${safe(item)}</strong></div>`).join('')}</div></div>
            ${page.humanTakeover !== '无' ? `<div class="notice warn" style="margin-top:14px">${icon('info')}<div><strong>人工接管规则</strong><p>${safe(page.humanTakeover)}</p></div></div>` : ''}
          </div>
        </aside>
      </div>
    `;
  }

  function pcContextValue(name, index) {
    if (/TaskID|任务ID|ID/.test(name)) return `tsk_${240918 + index}_a${index + 1}`;
    if (/ExecutionContext/.test(name)) return 'ctx_8b21…91d0';
    if (/Store/.test(name)) return '青鸟生活馆';
    if (/Account/.test(name)) return '运营账号 · 1082';
    if (/Platform/.test(name)) return '小红书';
    if (/URL/.test(name)) return 'Server 下发的脱敏地址';
    if (/Cursor/.test(name)) return '20260918-1400';
    return '已由 Server 固化';
  }

  function renderPcControls(stepCount) {
    const pc = state.pcTask;
    if (pc.status === 'READY') return `<button class="button primary" data-pc-action="claim">${icon('play', 15)}领取任务</button>`;
    if (pc.status === 'CLAIMED') return `<button class="button primary" data-pc-action="start">${icon('play', 15)}开始执行</button><button class="button danger" data-pc-action="cancel">取消</button>`;
    if (pc.status === 'RUNNING') {
      const atEnd = pc.step >= stepCount - 1;
      return `<button class="button" data-pc-action="progress">${icon('refresh', 15)}上报进度</button><button class="button" data-pc-action="human">模拟需要人工</button><button class="button primary" data-pc-action="submit" ${atEnd ? '' : 'disabled'}>提交结果</button>`;
    }
    if (pc.status === 'WAIT_HUMAN') return `<button class="button primary" data-pc-action="resume">人工已完成，恢复</button><button class="button danger" data-pc-action="cancel">取消任务</button>`;
    if (pc.status === 'SUCCESS') return `<span class="status-tag ok">结果已提交，等待 Server 最终确认</span><button class="button" data-go-pc="PC-001">返回首页</button>`;
    return `<button class="button" data-go-pc="PC-001">返回首页</button>`;
  }

  function renderOverlay() {
    const blocks = [];
    if (state.paletteOpen) blocks.push(renderPalette());
    if (state.traceOpen) blocks.push(renderTraceDrawer());
    if (state.roleMenuOpen) blocks.push(renderRoleMenu());
    if (state.confirmAction) blocks.push(renderConfirmModal());
    if (state.detailDrawer) blocks.push(renderDetailDrawer());
    overlayRoot.innerHTML = blocks.join('');
    if (state.paletteOpen) setTimeout(() => document.getElementById('palette-input')?.focus(), 0);
  }

  function searchItems() {
    const query = state.paletteQuery.trim().toLowerCase();
    const web = requirements.pages.map(page => ({
      type: 'WEB',
      id: page.id,
      name: page.name,
      detail: `${moduleMeta[page.module]?.label || page.module} · ${page.businessObject}`,
      search: [
        page.id, page.name, page.businessObject, page.scenario,
        ...page.fields.map(field => `${field.FieldID} ${field['中文名称']}`),
        ...page.buttons.map(button => `${button.ButtonID} ${button['按钮']} ${button['API契约']}`)
      ].join(' ').toLowerCase()
    }));
    const pc = requirements.pcPages.map(page => ({
      type: 'PC',
      id: page.id,
      name: page.name,
      detail: `${page.category} · ${page.output}`,
      search: `${page.id} ${page.name} ${page.category} ${page.input} ${page.steps} ${page.output}`.toLowerCase()
    }));
    const all = [...web, ...pc];
    if (!query) return all;
    const tokens = query.split(/\s+/);
    return all.filter(item => tokens.every(token => item.search.includes(token)));
  }

  function renderPalette() {
    const items = searchItems();
    return `
      <div class="modal-backdrop" data-close-overlay>
        <section class="palette" role="dialog" aria-modal="true" aria-label="页面台账" data-stop-close>
          <div class="palette-search">${icon('search', 20)}<input id="palette-input" value="${safe(state.paletteQuery)}" placeholder="搜索 PageID、页面、FieldID、ButtonID 或 API…" autocomplete="off"><kbd>ESC</kbd></div>
          <div class="palette-meta"><span>V3.9-FROZEN 权威页面台账</span><span>${items.length} / ${requirements.meta.counts.webPages + requirements.meta.counts.pcPages} 页</span></div>
          <div class="palette-results">
            ${items.length ? items.map(item => `<button class="palette-item" data-palette-go="${item.type}:${item.id}"><span class="palette-type ${item.type === 'PC' ? 'pc' : ''}">${item.type}</span><span><strong>${safe(item.name)}</strong><small>${safe(item.detail)}</small></span><code>${safe(item.id)}</code></button>`).join('') : '<div class="empty-state"><strong>没有匹配页面</strong><span>可使用中文名称、稳定 ID 或 API 路径继续搜索。</span></div>'}
          </div>
        </section>
      </div>
    `;
  }

  function renderTraceDrawer() {
    const isPc = state.mode === 'pc';
    const page = isPc ? pcPageMap.get(state.activePc) : pageMap.get(state.activeWeb);
    const counts = requirements.meta.counts;
    const perf = !isPc ? requirements.performanceBindings.filter(item => item['Page/API范围'].includes(page.id)) : [];
    return `
      <div class="drawer-backdrop" data-close-overlay></div>
      <aside class="drawer wide" role="dialog" aria-modal="true" aria-label="冻结追踪">
        <div class="drawer-head"><div><div class="eyebrow"><code>${safe(page.id)}</code><span>· ${isPc ? 'PC Contract' : 'Page Freeze Card'}</span></div><h2>${safe(page.name)} · 冻结追踪</h2></div><button class="icon-button" data-close-overlay aria-label="关闭">${icon('close')}</button></div>
        <div class="drawer-body">
          <div class="trace-summary">
            <div class="trace-count"><strong>${counts.webPages}/145</strong><span>Web 页面</span></div>
            <div class="trace-count"><strong>${counts.pcPages}/20</strong><span>PC 页面</span></div>
            <div class="trace-count"><strong>${counts.fields}/2030</strong><span>字段</span></div>
            <div class="trace-count"><strong>${counts.buttons}/437</strong><span>按钮闭环</span></div>
          </div>
          <div class="notice success">${icon('check')}<div><strong>V3.9 封版门禁通过</strong><p>308 个 API、437 条功能追踪、TBD=0；本抽屉为原型评审工具，不计入产品页面。</p></div></div>
          ${isPc ? renderPcTrace(page) : renderWebTrace(page, perf)}
        </div>
        <div class="drawer-footer"><button class="button" data-open-palette>打开全量页面台账</button><button class="button primary" data-close-overlay>完成核对</button></div>
      </aside>
    `;
  }

  function renderWebTrace(page, perf) {
    return `
      <section class="trace-section">
        <h3>页面事实</h3>
        <div class="trace-card"><dl>
          <dt>BusinessObject</dt><dd>${safe(page.businessObject)}</dd>
          <dt>Layout</dt><dd>${safe(page.layout)}</dd>
          <dt>Permission</dt><dd>${safe(page.permission)}</dd>
          <dt>Server / PC</dt><dd>${safe(page.serverPc)}</dd>
          <dt>Audit</dt><dd>${safe(page.audit)}</dd>
        </dl></div>
      </section>
      <section class="trace-section">
        <h3>字段事实 · ${page.fields.length}</h3>
        ${page.fields.map(field => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(field['中文名称'])}</strong><code>${safe(field.FieldID)}</code></div><dl><dt>类型 / 角色</dt><dd>${safe(field['类型'])} · ${safe(field['角色'])}</dd><dt>必填 / 可编辑</dt><dd>${safe(field['必填'])} / ${safe(field['可编辑'])}</dd><dt>校验 / 展示</dt><dd>${safe(field['校验/展示'])}</dd></dl></div>`).join('')}
      </section>
      <section class="trace-section">
        <h3>按钮闭环 · ${page.buttons.length}</h3>
        ${page.buttons.map(button => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(button['按钮'])}</strong><code>${safe(button.ButtonID)}</code></div><dl><dt>权限</dt><dd>${safe(button['权限'])} · ${safe(button['可见/启用'])}</dd><dt>API</dt><dd>${safe(button['API契约'])}</dd><dt>状态</dt><dd>${safe(button.CurrentState)} → ${safe(button.SuccessState)}</dd><dt>目标页</dt><dd>${safe(button.TargetPageID)}</dd><dt>TestID</dt><dd>${safe(button.TestID)}</dd></dl></div>`).join('')}
      </section>
      ${perf.length ? `<section class="trace-section"><h3>性能验收绑定</h3>${perf.map(item => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(item['对象'])}</strong><code>${safe(item['需求ID'])}</code></div><dl><dt>目标</dt><dd>${safe(item['目标'])}</dd><dt>SLI 边界</dt><dd>${safe(item['SLI边界'])}</dd><dt>TestID</dt><dd>${safe(item['TestID'])}</dd></dl></div>`).join('')}</section>` : ''}
    `;
  }

  function renderPcTrace(page) {
    return `
      <section class="trace-section">
        <h3>PC 页面执行契约</h3>
        <div class="trace-card"><dl>
          <dt>类别</dt><dd>${safe(page.category)}</dd>
          <dt>输入</dt><dd>${safe(page.input)}</dd>
          <dt>执行步骤</dt><dd>${safe(page.steps)}</dd>
          <dt>人工接管</dt><dd>${safe(page.humanTakeover)}</dd>
          <dt>输出</dt><dd>${safe(page.output)}</dd>
          <dt>跨端边界</dt><dd>${safe(page.boundary)}</dd>
        </dl></div>
      </section>
      <section class="trace-section">
        <h3>统一通信约束</h3>
        <div class="trace-card"><dl><dt>Claim</dt><dd>Server 校验能力、版本、Profile 与 Lease 后签发</dd><dt>Heartbeat</dt><dd>每 15 秒；45 秒失联；60 秒 Lease 到期</dd><dt>Progress</dt><dd>按检查点回传，不作为最终业务状态</dd><dt>Result</dt><dd>ResultDTO + Evidence 由 Server 校验后裁决</dd></dl></div>
      </section>
      <div class="notice danger">${icon('shield')}<div><strong>禁止越界</strong><p>PC 不直写业务数据库，不猜测路由或身份，不绕过验证码与风险控制，不把 UNKNOWN 当成功。</p></div></div>
    `;
  }

  function renderRoleMenu() {
    return `
      <div class="role-menu" style="top:58px;right:24px">
        ${Object.entries(roleInfo).filter(([code]) => code !== 'PC_WORKER').map(([code, info]) => `<button class="role-option ${state.role === code ? 'active' : ''}" data-role="${code}"><span class="role-avatar">${info.initial}</span><span><strong>${safe(info.name)}</strong><small>${safe(info.brief)}</small></span><span class="role-check">${state.role === code ? '✓' : ''}</span></button>`).join('')}
      </div>
    `;
  }

  function renderConfirmModal() {
    const { page, button } = state.confirmAction;
    return `
      <div class="modal-backdrop" data-close-overlay>
        <section class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" data-stop-close>
          <div class="modal-head"><div><div class="eyebrow"><code>${safe(button.ButtonID)}</code><span>· 高风险操作确认</span></div><h2 id="confirm-title">确认${safe(button['按钮'])}？</h2></div><button class="icon-button" data-close-overlay aria-label="关闭">${icon('close')}</button></div>
          <div class="modal-body">
            <p>对象：<strong>${safe(page.name)} · ${safe(page.businessObject)}</strong></p>
            <div class="impact-box"><strong>不可逆影响</strong><div>${safe(button['二次确认'])}</div></div>
            <div class="trace-card" style="margin-top:12px"><dl><dt>目标状态</dt><dd>${safe(button.SuccessState)}</dd><dt>目标页面</dt><dd>${safe(button.TargetPageID)}</dd><dt>审计</dt><dd>${safe(button.Audit)}</dd></dl></div>
          </div>
          <div class="modal-footer"><button class="button" data-close-overlay>返回检查</button><button class="button primary" data-confirm-proceed>确认并提交 Server</button></div>
        </section>
      </div>
    `;
  }

  function renderDetailDrawer() {
    const page = pageMap.get(state.activeWeb);
    const row = state.detailDrawer.row || 0;
    const fields = contentFields(page).slice(0, 12);
    return `
      <div class="drawer-backdrop" data-close-overlay></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="记录详情">
        <div class="drawer-head"><div><div class="eyebrow"><code>${safe(page.id)}</code><span>· 查询上下文已保留</span></div><h2>${safe(page.name)}详情</h2></div><button class="icon-button" data-close-overlay>${icon('close')}</button></div>
        <div class="drawer-body">
          <div class="notice">${icon('info')}<div><strong>业务状态由 Server 返回</strong><p>当前抽屉只展示记录，不在前端自行推断或改写状态。</p></div></div>
          <div class="trace-section">${fields.map(field => `<div class="trace-card"><div class="trace-card-head"><strong>${safe(field['中文名称'])}</strong><span>${safe(fieldValue(field, row))}</span></div><code>${safe(field.FieldID)}</code></div>`).join('')}</div>
        </div>
        <div class="drawer-footer"><button class="button" data-close-overlay>关闭</button>${page.buttons.some(button => button['按钮'].includes('查看详情') && canUseButton(page, button)) ? `<button class="button primary" data-drawer-navigate>打开完整页面</button>` : ''}</div>
      </aside>
    `;
  }

  function executeButton(page, button) {
    state.confirmAction = null;
    const label = button['按钮'];
    if (/查询|刷新/.test(label)) {
      state.busy = true;
      render();
      setTimeout(() => {
        state.busy = false;
        render();
        showToast('查询完成', '已按当前条件返回演示记录。', 'success');
      }, 520);
      return;
    }
    if (label.includes('重置')) {
      render();
      showToast('已重置', '查询条件已恢复默认值。', 'success');
      return;
    }
    showToast('操作已受理', `${label}已提交 NAS Server；最终状态由 Server 校验后裁决。`, 'success');
    const target = button.TargetPageID;
    if (target && target !== page.id && pageMap.has(target)) setTimeout(() => navigateWeb(target), 260);
    else renderOverlay();
  }

  function handleFrozenButton(id) {
    const found = buttonMap.get(id);
    if (!found) return;
    const { page, button } = found;
    if (!canUseButton(page, button)) {
      showToast('无权执行', '当前岗位未获得此 Button 的 PermissionCode。', 'error');
      return;
    }
    if (String(button['二次确认']).startsWith('是')) {
      state.confirmAction = { page, button };
      state.traceOpen = false;
      renderOverlay();
      return;
    }
    executeButton(page, button);
  }

  function handlePcAction(action) {
    const page = pcPageMap.get(state.activePc);
    const task = state.pcTask;
    const now = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    if (action === 'refresh') return showToast('队列已刷新', '任务仍由 Server 按能力与租约调度。', 'success');
    if (action === 'pair') return showToast('配对申请已提交', '等待 Server 确认设备指纹与 Worker 身份。', 'success');
    if (action === 'claim') {
      task.status = 'CLAIMED';
      task.evidence.push({ time: now, text: 'Claim 成功，Server 已签发 LeaseToken' });
    } else if (action === 'start') {
      task.status = 'RUNNING';
      task.step = 0;
      task.evidence.push({ time: now, text: 'Attempt 已开始，Heartbeat 每 15 秒上报' });
    } else if (action === 'progress') {
      const steps = page.steps.split('→').filter(Boolean);
      task.step = Math.min(task.step + 1, steps.length - 1);
      task.evidence.push({ time: now, text: `Progress 已确认，检查点 ${task.step + 1}/${steps.length}` });
    } else if (action === 'human') {
      task.status = 'WAIT_HUMAN';
      task.evidence.push({ time: now, text: 'CAPTCHA_REQUIRED 已上报，执行暂停' });
    } else if (action === 'resume') {
      task.status = 'RUNNING';
      task.evidence.push({ time: now, text: 'HumanTaskResult 已回传，Server 允许恢复' });
    } else if (action === 'submit') {
      task.status = 'SUCCESS';
      task.evidence.push({ time: now, text: 'ResultDTO 与 Evidence 已提交 Server 校验' });
    } else if (action === 'cancel') {
      task.status = 'CANCELLED';
      task.evidence.push({ time: now, text: '取消请求已提交，由 Server 裁决' });
    }
    render();
  }

  function showToast(title, detail, type = 'success') {
    const root = document.getElementById('toast-root');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon(type === 'success' ? 'check' : type === 'warn' ? 'alert' : 'close', 18)}</span><div><strong>${safe(title)}</strong><small>${safe(detail)}</small></div>`;
    root.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 220);
    }, 3300);
  }

  function registerWebMcp() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = tool => {
      try {
        Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
      } catch (_) {}
    };
    register({
      name: 'navigate_qingniao_page',
      title: '打开青鸟需求页面',
      description: '按冻结 PageID 打开青鸟管理端或 PC Worker 原型页面。',
      inputSchema: {
        type: 'object',
        properties: { pageId: { type: 'string' } },
        required: ['pageId'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        const id = String(input?.pageId || '').toUpperCase();
        if (pageMap.has(id)) navigateWeb(id);
        else if (pcPageMap.has(id)) navigatePc(id);
        else throw new Error('未知 PageID');
        return { pageId: id, opened: true };
      }
    });
    register({
      name: 'switch_qingniao_role',
      title: '切换青鸟评审角色',
      description: '切换管理端原型中的冻结技术角色并刷新页面和按钮权限。',
      inputSchema: {
        type: 'object',
        properties: { role: { type: 'string', enum: ['OWNER', 'OPS', 'HUMAN', 'AUDITOR'] } },
        required: ['role'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!['OWNER', 'OPS', 'HUMAN', 'AUDITOR'].includes(input?.role)) throw new Error('角色无效');
        state.role = input.role;
        state.previousRole = input.role;
        render();
        return { role: input.role, applied: true };
      }
    });
    register({
      name: 'advance_pc_worker_demo',
      title: '推进 PC Worker 演示任务',
      description: '在当前 PC Worker 原型页推进 Claim、Start、Progress、HumanTakeover、Resume 或 Submit 演示状态。',
      inputSchema: {
        type: 'object',
        properties: { action: { type: 'string', enum: ['claim', 'start', 'progress', 'human', 'resume', 'submit', 'cancel'] } },
        required: ['action'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (state.mode !== 'pc') throw new Error('请先打开 PC Worker 页面');
        handlePcAction(input.action);
        return { action: input.action, state: state.pcTask.status };
      }
    });
  }

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
      const first = requirements.pages.find(page => page.module === target.dataset.module);
      if (first) navigateWeb(first.id);
      return;
    }
    if (target.dataset.mode) {
      if (target.dataset.mode === 'pc') navigatePc(state.activePc || 'PC-001');
      else navigateWeb(state.activeWeb || 'DASH-001');
      return;
    }
    if (target.hasAttribute('data-open-palette')) {
      state.paletteOpen = true;
      state.traceOpen = false;
      state.roleMenuOpen = false;
      renderOverlay();
      return;
    }
    if (target.hasAttribute('data-open-trace')) {
      state.traceOpen = true;
      state.paletteOpen = false;
      state.roleMenuOpen = false;
      renderOverlay();
      return;
    }
    if (target.hasAttribute('data-open-role')) {
      state.roleMenuOpen = !state.roleMenuOpen;
      renderOverlay();
      return;
    }
    if (target.dataset.role) {
      state.role = target.dataset.role;
      state.previousRole = state.role;
      state.roleMenuOpen = false;
      if (state.role === 'HUMAN' && !canViewPage(pageMap.get(state.activeWeb))) state.activeWeb = 'DASH-002';
      if (state.role === 'OPS' && pageMap.get(state.activeWeb)?.module === 'SYS') state.activeWeb = 'DASH-001';
      setHash('web', state.activeWeb);
      showToast('岗位已切换', `当前按${roleInfo[state.role].name}展示页面和按钮权限。`, 'success');
      return;
    }
    if (target.hasAttribute('data-store-scope')) {
      const index = storeScopes.indexOf(state.storeScope);
      state.storeScope = storeScopes[(index + 1) % storeScopes.length];
      render();
      showToast('店铺数据范围已切换', state.storeScope, 'success');
      return;
    }
    if (target.dataset.buttonId) return handleFrozenButton(target.dataset.buttonId);
    if (target.hasAttribute('data-confirm-proceed')) {
      const action = state.confirmAction;
      if (action) executeButton(action.page, action.button);
      return;
    }
    if (target.dataset.paletteGo) {
      const [type, id] = target.dataset.paletteGo.split(':');
      return type === 'PC' ? navigatePc(id) : navigateWeb(id);
    }
    if (target.dataset.rowDetail !== undefined) {
      state.detailDrawer = { row: Number(target.dataset.rowDetail) || 0 };
      renderOverlay();
      return;
    }
    if (target.hasAttribute('data-drawer-navigate')) {
      const page = pageMap.get(state.activeWeb);
      const detail = page.buttons.find(button => button['按钮'].includes('查看详情'));
      state.detailDrawer = null;
      if (detail) executeButton(page, detail);
      return;
    }
    if (target.dataset.productTab) {
      state.activeProductTab = target.dataset.productTab;
      if (target.dataset.tabTarget === 'PRD-052') render();
      else navigateWeb(target.dataset.tabTarget);
      return;
    }
    if (target.dataset.pcAction) return handlePcAction(target.dataset.pcAction);
    if (target.hasAttribute('data-close-overlay')) {
      closeOverlays();
      renderOverlay();
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'palette-input') {
      state.paletteQuery = event.target.value;
      const cursor = event.target.selectionStart;
      renderOverlay();
      const input = document.getElementById('palette-input');
      if (input) {
        input.focus();
        input.setSelectionRange(cursor, cursor);
      }
    }
  });

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      state.paletteOpen = true;
      state.traceOpen = false;
      renderOverlay();
    }
    if (event.key === 'Escape') {
      closeOverlays();
      renderOverlay();
    }
  });

  window.addEventListener('hashchange', () => {
    parseHash();
    render();
  });

  parseHash();
  if (!location.hash) history.replaceState(null, '', '#/web/DASH-001');
  render();
  registerWebMcp();
})();
