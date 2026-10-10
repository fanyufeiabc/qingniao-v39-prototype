#!/usr/bin/env python3
"""Apply deterministic P2 hooks after rebuilding the frozen P1 restoration."""
from pathlib import Path
import hashlib, json, re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
path = DIST / 'app-restored.js'
app = path.read_text()

def replace(old, new, count=1):
    global app
    if app.count(old) != count:
        raise ValueError(f'P2 hook count mismatch: {old[:100]}')
    app = app.replace(old, new)

replace("modules: ['PLT', 'ACC', 'STR', 'SUP', 'SRC', 'PRD']", "modules: ['SRC', 'PRD', 'SUP']")
replace("modules: ['TSK', 'RTE', 'MED', 'STD', 'SYS']", "modules: ['PLT', 'ACC', 'STR', 'TSK', 'RTE', 'MED', 'STD', 'SYS']")
replace("prototype.bind({ toast: showToast, render, close: closeOverlays, overlay: renderOverlay, navigatePc });", """prototype.bind({ toast: showToast, render, close: closeOverlays, overlay: renderOverlay, navigatePc, domain,
      context: () => ({ mode: state.mode, params: { ...state.routeParams }, storeScope: state.storeScope, reviewMode: state.reviewMode, pcTask: state.pcTask }),
      nasDecision(task) { const pc = state.pcTasks.get(task.id); if (pc) { pc.locked = task.lock; pc.status = task.state; } },
      replaceContext(params) {
        if (storeScopes.some(s => s.id === params.storeScope)) state.storeScope = params.storeScope;
        history.replaceState(null, '', prototype.route(state.mode, state.mode === 'pc' ? state.activePc : state.activeWeb, params));
        parseHash();
      }
    });""")
replace("    if (page.id.startsWith('CUR-')) return prototype.renderCurrent", "    const improved = prototype.renderBusiness(page, { header: state.mode === 'pc' ? renderPcHeader : renderPageHeader });\n    if (improved !== undefined) return improved;\n    if (page.id.startsWith('CUR-')) return prototype.renderCurrent", 2)
replace("    annotateLocalControls(app, page?.id || 'UNKNOWN');", "    annotateLocalControls(app, page?.id || 'UNKNOWN');\n    prototype.afterRender(app, page);")
replace("    annotateLocalControls(overlayRoot, activeId || 'OVERLAY');", "    annotateLocalControls(overlayRoot, activeId || 'OVERLAY');\n    prototype.afterOverlay(overlayRoot);")
start = app.index('  function renderAuditTrail(page) {')
end = app.index('  function renderPreviewPage(', start)
app = app[:start]+"  function renderAuditTrail(page) { return prototype.auditSummary(page); }\n\n"+app[end:]
replace("    const { page, button } = found;\n    if (!canUseButton", "    const { page, button } = found;\n    if (prototype.handleLegacyButton(page, button)) return;\n    if (!canUseButton")
replace("    const pc = state.pcTask;\n    if ((pc.locked", "    const pc = state.pcTask;\n    if (prototype.pcGate(action)) return;\n    if (action === 'resume' && !window.QNP2.state.login.verified) return showToast('身份待重新核验', '本人登录后仍须核验原卖家身份。', 'warn');\n    if ((pc.locked")
app = app.replace('W8R2A-P1', 'W8R2A-P2')
app = app.replace('禁止自动外部下单', '本人确认后建单，不执行支付')
app = app.replace('电商平台 API → NAS Server', '受控接入与观察回流')
path.write_text(app)
index = (DIST/'index.html').read_text().replace('w8r2a-p1b','w8r2a-p2').replace('w8r2a-p1','w8r2a-p2').replace('W8R2A-P1','W8R2A-P2')
index = index.replace('./prototype-extensions.js?', './prototype-p2.js?').replace('</head>', '  <link rel="stylesheet" href="./p2.css?v=w8r2a-p2-visual2">\n</head>')
index = index.replace('  <script src="./prototype-p2.js', '  <script src="./data/p2-assets.js?v=w8r2a-p2"></script>\n  <script src="./prototype-p2.js')
index = index.replace('./prototype-p2.js?v=w8r2a-p2', './prototype-p2.js?v=w8r2a-p2-visual2')
(DIST/'index.html').write_text(index)
assets={name:hashlib.sha256((DIST/'assets'/('p2-'+name+'.svg')).read_bytes()).hexdigest() for name in ['product','package']}
(DIST/'data/p2-assets.js').write_text('window.QNP2Assets=Object.freeze('+json.dumps(assets)+');\n')
mapping = (DIST/'prototype-map.js').read_text().replace('w8r2a-p1','w8r2a-p2').replace('W8R2A-P1','W8R2A-P2')
(DIST/'prototype-map.js').write_text(mapping)

regfile=DIST/'ui/page-registry.js'
reg = json.loads(regfile.read_text().split('const data=',1)[1].split(';if(typeof module',1)[0])
reg['version']='9.1.1-w8r2a-p2'
reg['counts'].update(menuEntries=19,nasScenes=158,pcScenes=23,totalScenes=181,logicalPages=61)
if 'actualUiMenuBaseline' not in reg:reg['actualUiMenuBaseline']=reg['menus']
menu_groups=[('今日经营',[('DASH','工作台','DASH-001')]),('商品供给',[('SRC','货源与采集','SRC-001'),('PRD','商品中心','PRD-001'),('SUP','供应商','SYS-002')]),('销售履约',[('CHN','店铺商品与草稿','STORE-002'),('JD','京东小店','JD-001'),('ORD','订单中心','ORD-001'),('PUR','采购中心','PUR-001'),('LOGI','物流中心','LOG-001'),('AS','售后中心','AS-001'),('FIN','财务与利润','FIN-001')]),('运行支撑',[('PLT','平台管理','SYS-001'),('ACC','账号管理','SYS-002'),('STR','店铺管理','STORE-001'),('TSK','任务中心','SYS-009'),('RTE','执行节点','SYS-003'),('MED','媒体存储','MED-001'),('STD','标准数据','CAT-001'),('SYS','系统管理','SYS-011')])]
reg['menus']=[{'group':group,'moduleId':module,'name':name,'pageId':page,'pages':[page],'scope':'PROTOTYPE_MODULE_WITH_RETAINED_SCENES'} for group,items in menu_groups for module,name,page in items]
reqs={
 'DASH':[5,18,20,25,27], 'SRC':[6,7,8,27], 'PRD':[8,9,10,11,12,13,14,15,27,28],
 'STORE':[1,2,3,15,16,17,27], 'ORD':[18,19,20,27], 'PUR':[19,20,21,22,27],
 'LOG':[18,23,27], 'AS':[24,25,27], 'FIN':[20,25,27], 'MED':[10,11,27,28], 'PKG':[12,27],
 'CAT':[14,15,27], 'PC':[2,3,4,5,26,28,29], 'SYS':[1,2,3,4,5,14,15,26,28,29],
 'JD':[1,2,3,15,16,17,18,19,32], 'INST':[26,29]
}
default = dict(re.findall(r"'([A-Z][A-Z0-9-]+)':'([A-Z][A-Z0-9-]+)'",mapping.split('const defaultViews={',1)[1].split('};',1)[0]))
overrides = dict(re.findall(r"'([A-Z][A-Z0-9-]+)':'([A-Z][A-Z0-9-]+)'",mapping.split('const overrides={',1)[1].split('};',1)[0]))
scene_targets={x['surface']+':'+x['oldId']:x['targetId'] for x in reg['legacy']}
scene_targets.update({('pc:' if k.startswith('PC-') else 'web:')+v:k for k,v in default.items()})
scene_targets.update({'web:'+k:v for k,v in overrides.items()})
for x in reg['legacy']:x['targetId']=scene_targets[x['surface']+':'+x['oldId']]
direct_fields={
 'PRD-002':{'商品标题':'product.title','销售价格':'product.price','销售库存':'product.stock','颜色':'product.color','尺码':'product.size','售价':'product.price','文本内容':'product.description'},
 'PRD-005':{'类目':'product.category','属性':'product.material'},
 'JD-001':{'业务对象':'product.title'}, 'JD-002':{'操作条件':'product.category'},
 'SRC-006':{'原始链接':'batch.text'},
 'LOG-002':{'承运商':'shipment.carrier','运单号':'shipment.waybill','数量':'shipment.qty.0'},
 'PUR-002':{'当前单价':'purchase.unitPrice','预估运费':'purchase.freight'},
 'PC-001':{'服务端地址':'config.nasUrl','设备名称':'config.device','一次性配对码':'config.pairCode'},
 'PC-003':{'登录状态':'login.scenario'}, 'PC-006':{'Server':'config.nasUrl'},
 'SYS-005':{'UTP Host':'utp.host'}, 'SYS-008':{'模型':'aiConfig.model','每日预算':'aiConfig.budget'},
 'FIN-001':{'已归属销售收入':'income','已归属商品毛利':'profit','待分配费用':'pending'},
}
for p in reg['pages']:
    p['requirementIds']=[f'REQ-911-{n:03d}' for n in reqs[p['id'].split('-')[0]]]
    p['prototypeStatus']='P2_LOCAL_PROTOTYPE_ONLY'
    p['externalAcceptance']='PENDING_UNIFIED_SIT'
    p['actualUiAcceptance']='PENDING_W8R2B_TO_W8R2D'
    # Field aliases reference real controls or composite read-model cards, never coverage chips.
    for f in p['fields']:
        f['binding']={'pageId':p['id'],'readModel':'prototype.'+p['renderer'] if p.get('renderer') else 'prototype.'+p['id'],
                      'semantic':f['label'],'scope':'COMPOSITE_DISPLAY_OR_CONTROL','fieldIdentity':f['id'],
                      'source':'P2 prototype contract; actual UI acceptance remains separate'}
    if not p['fields']:
        keys=['业务对象','原店铺账号','原版本','操作条件','完整回读与差异'] if p['id']!='INST-001' else ['NAS部署','PC安装与配对','协议版本','统一SIT状态']
        p['fields']=[{'id':p['id']+'-P2-CONTRACT-'+str(i+1),'label':label,'binding':{'pageId':p['id'],'readModel':'prototype.'+p['id'],'semantic':label,'scope':'COMPOSITE_DISPLAY_OR_CONTROL','fieldIdentity':p['id']+'-P2-CONTRACT-'+str(i+1),'source':'P2 local business scene'}} for i,label in enumerate(keys)]
        p['fieldIds']=[f['id'] for f in p['fields']]
    for f in p['fields']:
        key=direct_fields.get(p['id'],{}).get(f['label'])
        f['binding']['targetSelector']='[data-p2-field="'+key+'"]' if key and key not in ['income','profit','pending'] else '.p2-business .p2-card .card-body, main .card-body, main .card'
        f['binding']['type']='CONTROL' if key and key not in ['income','profit','pending'] else 'COMPOSITE_READ_MODEL'
        f['binding']['selector']='[data-current-field-ids~="'+f['id']+'"]'
reg['decisions']['P2_TRACE']='Runtime scene targets are authoritative; legacy targets synchronized. Field identities bind to business read-model panels; frozen coverage chips are history only. Actual interface and real platform acceptance remain separate.'
regfile.write_text('(()=>{const data='+json.dumps(reg,ensure_ascii=False,separators=(',',':'))+';if(typeof module!=="undefined"&&module.exports)module.exports=data;else window.QNPages=data;})();\n')
contract={'version':reg['version'],'sourceHead':'4aec42b1a4a9a42adf0a7cb816839c3cb17a7919','counts':reg['counts'],
 'sceneTargets':scene_targets,'pages':[{'id':p['id'],'requirements':p['requirementIds'],'fields':p['fields'],'actualUiAcceptance':p['actualUiAcceptance'],'externalAcceptance':p['externalAcceptance']} for p in reg['pages']]}
(DIST/'data/p2-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'version':reg['version'],'sceneTargets':len(scene_targets),'logicalPages':len(reg['pages']),'legacyTargetsSynchronized':len(reg['legacy']),'fields':sum(len(p['fields']) for p in reg['pages'])},ensure_ascii=False))
