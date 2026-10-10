'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const report={version:'9.1.1-w8r2a-p1',generatedAt:new Date().toISOString(),runtime:'jsdom (DOM and interaction checks; no visual acceptance)',groups:[],routes:[],coverage:{},networkCalls:0,errors:[]};
const read=p=>fs.readFileSync(path.join(dist,p),'utf8');
function make(hash='#/web/DASH-001'){
 const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(read('index.html'),{url:'https://prototype.test/'+hash,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window;
 w.fetch=()=>{report.networkCalls++;throw Error('Prototype must not call a real API');};
 w.XMLHttpRequest=function(){report.networkCalls++;throw Error('Prototype must not call a real API');};
 for(const file of ['data/requirements.js','ui/page-registry.js','prototype-map.js','prototype-extensions.js','app-restored.js'])vm.runInContext(read(file),dom.getInternalVMContext(),{filename:file});
 return {dom,w,errors};
}
let current;
const $=s=>current.w.document.querySelector(s),all=s=>[...current.w.document.querySelectorAll(s)];
function goto(hash){current.w.history.replaceState(null,'',hash);current.w.dispatchEvent(new current.w.Event('hashchange'));assert.equal(current.errors.length,0,current.errors.join('\n'));}
function scene(mode,id,params={}){goto(current.w.QNPrototype.route(mode,id,params));}
function click(selector){const x=$(selector);assert(x,'Missing '+selector);assert(!x.disabled,'Disabled '+selector);x.click();}
function input(selector,value,event='input'){const x=$(selector);assert(x,'Missing '+selector);x.value=value;x.dispatchEvent(new current.w.Event(event,{bubbles:true}));}
async function settle(predicate){for(let i=0;i<130;i++){if(predicate())return;await new Promise(r=>setTimeout(r,5));}assert(predicate(),'Interaction did not settle');}
async function group(name,run){current=make();try{await run();assert.equal(current.errors.length,0,current.errors.join('\n'));report.groups.push({name,result:'PASS'});}catch(e){report.groups.push({name,result:'FAIL',message:e.message});report.errors.push({name,stack:e.stack});}finally{current.w.close();}}
(async()=>{
 await group('原 145 NAS / 20 PC 设计记录与字段、按钮身份不丢失',()=>{
  const raw=JSON.parse(read('data/requirements.json')),q=current.w.QNPrototype,r=current.w.QN_REQUIREMENTS;
  assert.equal(raw.pages.length,145);assert.equal(raw.pcPages.length,20);assert.equal(q.originalWeb.length,145);assert.equal(q.originalPc.length,20);
  assert.equal(r.pages.length,158);assert.equal(r.pcPages.length,23);
  let fields=0,buttons=0;
  for(const p of raw.pages){const restored=r.pages.find(x=>x.id===p.id);assert(restored,p.id);assert.deepEqual([...restored.fields.map(f=>f.FieldID)],p.fields.map(f=>f.FieldID));assert.deepEqual([...restored.buttons.map(b=>b.ButtonID)],p.buttons.map(b=>b.ButtonID));fields+=p.fields.length;buttons+=p.buttons.length;}
  report.coverage={originalNas:145,originalPc:20,totalNas:158,totalPc:23,originalFields:fields,originalButtons:buttons};
  for(const p of raw.pcPages)assert(r.pcPages.some(x=>x.id===p.id));
 });
 await group('NAS 19 模块 / 四组菜单，全 158 场景在主导航可达',()=>{
  assert.equal(all('[data-module]').length,19);assert.equal(all('[data-nav]').length,158);assert.equal(all('.nav-section').length,4);
  assert.deepEqual(all('.nav-section-title').map(x=>x.textContent),['今日经营','商品供给','销售履约','运行支撑']);
  for(const module of ['PLT','ACC','STR','SUP','SRC','PRD','CHN','JD','ORD','PUR','LOGI','AS','FIN','TSK','RTE','MED','STD','SYS'])assert($(`[data-module="${module}"]`));
  click('[data-module="DASH"]');assert.equal($('[data-module="DASH"]').getAttribute('aria-expanded'),'false');assert($('[data-module="DASH"]+div').hidden);
  assert(read('restored.css').includes('.nav-pages[hidden]{display:none!important}'));
 });
 await group('PC 七组 / 全 23 场景，原浏览器、采集、履约与诊断均可达',()=>{
  goto('#/pc/PC-002');assert.equal(all('[data-pc-nav]').length,23);assert.equal(all('.nav-section-title').length,7);
  const text=$('nav').textContent;for(const x of ['BrowserProfile','BrowserSession','RouteSnapshot','Adapter','Fixture','商品探查','正式采集','媒体','登录','草稿','对账','订单','采购','物流','售后','诊断'])assert(text.includes(x),x);
 });
 await group('全部 181 场景渲染，原 2030 字段及 437 按钮实际落位',()=>{
  click('[data-toggle-review]');
  const r=current.w.QN_REQUIREMENTS,q=current.w.QNPrototype;let renderedFields=0,renderedButtons=0;
  for(const p of r.pages){scene('web',p.id,{entityId:p.module+'-20260920-001',version:'1',storeScope:'ALL'});assert($('h1'),p.id);assert(!$('.context-resolver'),p.id+' unexpected resolver');assert.equal($('.page-head').dataset.sceneId,p.id);assert($('main').textContent.length>150,p.id);assert(!$('main').textContent.includes('字段基线占位'),p.id);
   if(q.originalWeb.includes(p.id)){for(const f of p.fields){assert($(`[data-field-id="${f.FieldID}"]`),p.id+' missing field '+f.FieldID);renderedFields++;}for(const b of p.buttons){assert($(`[data-button-id="${b.ButtonID}"]`),p.id+' missing button '+b.ButtonID);renderedButtons++;}}
   report.routes.push({surface:'web',scene:p.id,currentId:q.sceneTargets.get('web:'+p.id),result:'PASS'});
  }
  for(const p of r.pcPages){scene('pc',p.id);assert($('h1'),p.id);assert.equal($('.page-head').dataset.sceneId,p.id);assert($('main').textContent.length>150,p.id);report.routes.push({surface:'pc',scene:p.id,currentId:q.sceneTargets.get('pc:'+p.id),result:'PASS'});}
  assert.equal(renderedFields,2030);assert.equal(renderedButtons,437);Object.assign(report.coverage,{renderedFields,renderedButtons});
 });
 await group('当前 61 逻辑页面保留编号与标题；PC 首次配对无旧编号歧义',()=>{
  for(const p of current.w.QNPages.pages){goto(p.route);assert.equal($('h1').textContent,p.name,p.id);assert.equal($('.page-head').dataset.pageId,p.id);}
  goto('#/pc/PC-001');assert.equal($('h1').textContent,'首次配对');assert($('[data-pc-action="pair"]'));
  goto('#/v39/pc/PC-001');assert.equal($('h1').textContent,'PC Worker 首页');
  report.coverage.currentLogicalRoutes=61;
 });
 await group('无效路由、混用场景、跨端编号被阻断',()=>{
  for(const route of ['#/web/DOES-NOT-EXIST','#/pc/DASH-001','#/web/PC-003','#/web/JD-001?view=CUR-JD-005','#/pc/PC-003?view=PC-014']){goto(route);assert($('main').textContent.includes('页面不存在'),route);}
 });
 await group('全页搜索可搜原场景和当前编号，不再只返回前 80 条',()=>{
  click('[data-open-palette]');assert.equal(all('[data-palette-go]').length,181);
  input('#palette-input','Fixture');assert.equal(all('[data-palette-go]').length,1);assert.equal($('[data-palette-go]').dataset.paletteGo,'PC:PC-008');
  input('#palette-input','JD-005');assert(all('[data-palette-go]').some(x=>x.dataset.paletteGo==='WEB:CUR-JD-005'));
 });
 await group('固定本人操作，原视觉系统与品牌资产保持原样',()=>{
  assert($('.role-control').textContent.includes('本人'));assert.equal(all('[data-open-role]').length,0);
  assert(!$('.topbar').textContent.includes('运营成员'));assert(read('index.html').includes('./styles.css'));
  const frozen=JSON.parse(fs.readFileSync(path.join(root,'qa','restoration-source.json'),'utf8')).frozenHashes;for(const [file,expected] of Object.entries(frozen))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dist,file))).digest('hex'),expected,file);
 });
 await group('上下文页直达必须选择对象；对象信息及返回列表上下文保持',async()=>{
  scene('web','SUP-033');assert($('.context-resolver'));assert(all('[data-button-id]').every(x=>x.disabled));
  scene('web','PRD-050');input('[data-filter-id="FLD-PRD-050-02"]','亚麻');const filterId='FLD-PRD-050-02';input('[data-page-size]','50','change');click('[data-sort-field]');
  const hash=current.w.location.hash;assert(hash.includes('size=50'));assert(hash.includes('filters='));
  current.w.history.replaceState(null,'',hash);current.w.dispatchEvent(new current.w.Event('hashchange'));assert.equal($(`[data-filter-id="${filterId}"]`).value,'亚麻');assert.equal($('[data-page-size]').value,'50');
  click('[data-open-row]');await settle(()=>$('.page-head').dataset.sceneId==='PRD-051');assert(current.w.location.hash.includes('sourcePage=PRD-050'));assert(current.w.location.hash.includes('version='));assert(current.w.location.hash.includes('entityId='));click('[data-return-context]');await settle(()=>$('.page-head').dataset.sceneId==='PRD-050');assert.equal($(`[data-filter-id="${filterId}"]`).value,'亚麻');assert.equal($('[data-page-size]').value,'50');
 });
 await group('分页为 20 / 50；错误、离线、空数据状态可恢复并保留输入',async()=>{
  scene('web','PRD-050');assert.deepEqual(all('[data-page-size] option').map(x=>x.value),['20','50']);click('[data-toggle-review]');input('[data-filter-id="FLD-PRD-050-02"]','亚麻');
  for(let i=0;i<3;i++)click('[data-cycle-ui-state]');assert($('main').textContent.includes('加载失败'));assert($('[data-filter-id="FLD-PRD-050-02"]').value==='亚麻');click('[data-retry-page]');await settle(()=>$('.data-table'));assert.equal($('[data-filter-id="FLD-PRD-050-02"]').value,'亚麻');
 });
 await group('搜索 → 探查结果 → 候选确认 → 正式采集任务',async()=>{
  goto('#/web/SRC-001');input('#source-keyword','');click('[data-design-action="GAP-UI-001"]');assert($('#toast-root').textContent.includes('不能为空'));
  input('#source-keyword','棉袜');click('[data-design-action="GAP-UI-001"]');await settle(()=>$('.page-head').dataset.sceneId==='SRC-043');
  const row=$('[data-row-select]');row.checked=true;row.dispatchEvent(new current.w.Event('change',{bubbles:true}));click('[data-design-action="GAP-UI-002"]');await settle(()=>$('.page-head').dataset.sceneId==='SRC-044');
  const candidate=$('[data-row-select]');candidate.checked=true;candidate.dispatchEvent(new current.w.Event('change',{bubbles:true}));click('[data-confirm-candidates]');await settle(()=>$('.page-head').dataset.sceneId==='SRC-045');
  click('[data-button-id="BTN-SRC-045-01"]');if($('[data-confirm-proceed]'))click('[data-confirm-proceed]');await settle(()=>$('.page-head').dataset.sceneId==='SRC-046');assert($('main table'));
 });
 await group('商品列表 → 详情 → 编辑 → 店铺草稿预览 → 同步任务',async()=>{
  scene('web','PRD-050');click('[data-open-row]');await settle(()=>$('.page-head').dataset.sceneId==='PRD-051');click('[data-design-action="GAP-UI-003"]');await settle(()=>$('.page-head').dataset.sceneId==='PRD-052');assert(all('[data-form-field]').length>0);click('[data-design-action="GAP-UI-004"]');await settle(()=>$('.page-head').dataset.sceneId==='CHN-070');assert($('.channel-preview')||$('main').textContent.includes('预览'));click('[data-button-id="BTN-CHN-070-04"]');if($('[data-confirm-proceed]'))click('[data-confirm-proceed]');await settle(()=>$('.page-head').dataset.sceneId==='CHN-071');
 });
 await group('采购价格变化阻断确认，正常采购须本人二次确认',()=>{
  scene('web','PUR-085',{entityId:'PUR-20260920-003',version:'3',sourcePage:'PUR-082'});click('[data-button-id="BTN-PUR-085-01"]');if($('[data-confirm-proceed]'))click('[data-confirm-proceed]');assert($('#toast-root').textContent.includes('PRICE_CHANGED'));
  scene('web','PUR-085',{entityId:'PUR-20260920-001',version:'1',sourcePage:'PUR-082'});click('[data-button-id="BTN-PUR-085-01"]');assert($('[data-confirm-proceed]'));click('[data-confirm-proceed]');assert($('#toast-root').textContent.includes('采购已确认'));
 });
 await group('京东独立能力未核验阻断草稿写入，本人确认审核与再次发布',async()=>{
  goto('#/web/JD-003');assert($('[data-current-action="sync-draft"]').disabled);const cap=$('[data-current-check]');cap.checked=true;cap.dispatchEvent(new current.w.Event('change',{bubbles:true}));click('[data-current-action="sync-draft"]');assert($('main').textContent.includes('READBACK_MATCHED'));
  goto('#/web/JD-004');click('[data-current-action="review-confirm"]');assert($('[role="dialog"]'));click('[data-current-action="close-current"]');assert(!$('[role="dialog"]'));click('[data-current-action="review-confirm"]');click('[data-current-action="confirm-current"]');assert($('main').textContent.includes('SUBMIT_REQUESTED'));
  click('[data-current-action="review-read"]');assert($('main').textContent.includes('IN_REVIEW'));assert($('[data-current-action="publish-confirm"]').disabled);click('[data-current-action="review-read"]');assert($('main').textContent.includes('APPROVED'));click('[data-current-action="publish-confirm"]');click('[data-current-action="confirm-current"]');assert($('main').textContent.includes('PUBLISH_REQUESTED'));click('[data-current-action="review-read"]');assert($('main').textContent.includes('ON_SALE'));
 });
 await group('京东 UNKNOWN 保持原锁，只读观察、证据及返回不恢复写按钮',()=>{
  goto('#/web/JD-004');click('[data-current-action="unknown"]');assert($('[data-current-action="review-confirm"]').disabled);click('[data-current-action="review-read"]');assert($('#toast-root').textContent.includes('原锁保持'));
  goto('#/web/JD-005');click('[data-current-action="read-reconcile"]');click('[data-current-action="send-evidence"]');assert($('main').textContent.includes('保持锁定'));goto('#/web/JD-003');const cap=$('[data-current-check]');cap.checked=true;cap.dispatchEvent(new current.w.Event('change',{bubbles:true}));assert($('[data-current-action="sync-draft"]').disabled);
 });
 await group('PC UNKNOWN 跨菜单仍锁定，原任务身份不匹配不允许领取或恢复',()=>{
  scene('pc','PC-014',{taskId:'shared-task',writeLocked:'true',platform:'JD_SHOP',store:'店铺甲',account:'账号甲'});assert($('main').textContent.includes('UNKNOWN 写锁保持'));assert(!$('[data-pc-action="claim"]'));assert(!$('[data-pc-action="start"]'));
  scene('pc','PC-001');scene('pc','PC-014',{taskId:'shared-task',platform:'JD_SHOP',store:'店铺甲',account:'账号甲',writeLocked:'false'});assert($('main').textContent.includes('UNKNOWN 写锁保持'));assert(!$('[data-pc-action="claim"]'));
  scene('pc','PC-014',{taskId:'shared-task',platform:'XHS',store:'店铺乙',account:'账号乙'});assert($('main').textContent.includes('身份或执行场景不匹配'));assert(!$('[data-pc-action="start"]'));
 });
 await group('PC 任务进度与证据跨菜单保留，不会每次回到 READY',()=>{
  scene('pc','PC-010',{taskId:'collect-same',platform:'1688',account:'本人'});click('[data-pc-action="claim"]');click('[data-pc-action="start"]');click('[data-pc-action="progress"]');const text=$('main').textContent;assert(text.includes('检查点 2'));scene('pc','PC-001');scene('pc','PC-010',{taskId:'collect-same',platform:'1688',account:'本人'});assert($('main').textContent.includes('检查点 2'));assert($('[data-pc-action="progress"]'));
 });
 await group('PC RouteSnapshot、Adapter、Fixture 等查看入口有对象记录',()=>{
  scene('pc','PC-008');const view=all('button').find(x=>x.textContent==='查看');assert(view);view.click();assert($('[role="dialog"]'));assert($('[role="dialog"]').textContent.includes('字段 1'));
 });
 await group('售后按两条商品行关联不同采购单，两侧金额独立核对并保持本人输入',()=>{
  goto('#/web/AS-002');assert.equal($('[data-current-field="purchaseLink1"]').value,'PUR-DEMO-01');assert.equal($('[data-current-field="purchaseLink2"]').value,'PUR-DEMO-02');
  input('[data-current-field="purchaseLink1"]','PUR-DEMO-02','change');input('[data-current-field="purchaseLink2"]','PUR-DEMO-01','change');input('[data-current-field="shopRefund1"]','31.00');click('[data-current-action="save-allocation"]');assert($('#toast-root').textContent.includes('分配未保存'));assert.equal($('[data-current-field="shopRefund1"]').value,'31.00');
  input('[data-current-field="shopRefund1"]','20.00');input('[data-current-field="sourceRefund1"]','19.00');click('[data-current-action="save-allocation"]');assert(!($('main').textContent.includes('本人已保存演示分配')));
  input('[data-current-field="sourceRefund1"]','12.00');click('[data-current-action="save-allocation"]');assert($('main').textContent.includes('本人已保存演示分配'));assert.equal($('[data-current-field="purchaseLink1"]').value,'PUR-DEMO-02');assert.equal($('[data-current-field="purchaseLink2"]').value,'PUR-DEMO-01');assert.equal($('[data-current-field="shopRefund2"]').value,'10.00');
 });
 await group('新增安装、批量链接、包装 OCR、登录与物流均有可操作场景',()=>{
  goto('#/web/SRC-006');input('[data-current-field="links"]','bad-url\nhttps://detail.1688.com/offer/12345.html\nhttps://detail.1688.com/offer/12345.html');click('[data-current-action="check-links"]');assert($('#toast-root').textContent.includes('有效格式 1 条'));
  goto('#/web/PKG-001');assert($('[data-current-action="ocr-confirm"]').disabled);click('[data-current-action="ocr"]');click('[data-current-action="ocr-confirm"]');
  goto('#/web/INST-001');click('[data-current-action="installation-check"]');assert($('main').textContent.includes('待目标 PostgreSQL'));
  goto('#/pc/PC-003');assert.equal(all('[data-current-action^="login:"]').length,4);click('[data-current-action="login:京东"]');assert($('#toast-root').textContent.includes('尚未完成真实身份核验'));
  goto('#/web/LOG-002');click('[data-current-action="shipment-confirm"]');assert($('[role="dialog"]'));click('[data-current-action="confirm-current"]');assert($('[data-current-field="shipmentState"]').value.includes('等待可信回读'));
 });
 report.passed=report.groups.filter(x=>x.result==='PASS').length;report.failed=report.groups.filter(x=>x.result==='FAIL').length;report.total=report.groups.length;
 fs.writeFileSync(path.join(root,'qa','restoration-regression.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({passed:report.passed,failed:report.failed,total:report.total,coverage:report.coverage,sceneRoutes:report.routes.length,networkCalls:report.networkCalls,failures:report.groups.filter(x=>x.result==='FAIL')},null,2));
 if(report.failed||report.networkCalls)process.exitCode=1;
})();
