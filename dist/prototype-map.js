/* Full prototype navigation; production page IDs remain unchanged. */
(()=>{
 'use strict';
 const registry=window.QNPages,requirements=window.QN_REQUIREMENTS;
 const defaultViews={
  'DASH-001':'DASH-001','DASH-002':'DASH-002','DASH-003':'DASH-003',
  'SRC-001':'SRC-042','SRC-002':'SRC-044','SRC-003':'SRC-046','SRC-004':'SRC-047','SRC-005':'SRC-037','SRC-006':'CUR-SRC-006',
  'PRD-001':'PRD-050','PRD-002':'PRD-052','PRD-003':'PRD-059','PRD-004':'PRD-054','PRD-005':'PRD-061',
  'STORE-001':'STR-025','STORE-002':'CHN-064','STORE-003':'CHN-071','STORE-004':'CHN-070',
  'ORD-001':'ORD-074','ORD-001-D':'ORD-075','ORD-002':'ORD-077',
  'PUR-001':'PUR-082','PUR-002':'PUR-085','PUR-003':'PUR-083','LOG-001':'LOGI-089','LOG-002':'CUR-LOG-002',
  'AS-001':'AS-093','AS-002':'AS-094','FIN-001':'FIN-097','FIN-002':'ORD-081','FIN-003':'FIN-096',
  'SYS-001':'PLT-009','SYS-002':'ACC-017','SYS-003':'RTE-123','SYS-004':'CUR-SYS-004','SYS-005':'CUR-SYS-005',
  'SYS-006':'MED-109','SYS-007':'CHN-066','SYS-008':'CUR-SYS-008','SYS-009':'TSK-098','SYS-010':'SYS-117','SYS-011':'SYS-122','SYS-012':'SYS-120',
  'MED-001':'MED-111','MED-002':'PRD-056','PKG-001':'CUR-PKG-001','CAT-001':'STD-103',
  'JD-001':'CUR-JD-001','JD-002':'CUR-JD-002','JD-003':'CUR-JD-003','JD-004':'CUR-JD-004','JD-005':'CUR-JD-005','JD-006':'CUR-JD-006','INST-001':'CUR-INST-001',
  'PC-001':'PC-002','PC-002':'PC-001','PC-003':'CUR-PC-LOGIN','PC-004':'PC-011','PC-005':'CUR-PC-MONITOR','PC-006':'CUR-PC-SETTINGS','PC-007':'PC-004'
 };
 const titles={
  'SYS-114':'本人账号与操作范围','SYS-115':'操作权限与确认边界','SYS-131':'本人账号资料','SYS-132':'本人账号编辑','SYS-133':'操作权限说明',
  'AS-095':'售后双侧关联与退款核对','ACC-019':'1688 账号登录与核验','ACC-023':'店铺账号登录与核验',
  'PC-009':'商品探查执行','PC-014':'店铺草稿同步执行','PC-017':'1688 采购建单与回读','PC-019':'售后只读协查'
 };
 const byId=new Map(registry.pages.map(p=>[p.id,p])),sceneTargets=new Map();
 for(const x of registry.legacy)sceneTargets.set(x.surface+':'+x.oldId,x.targetId);
 for(const [id,scene] of Object.entries(defaultViews))sceneTargets.set((id.startsWith('PC-')?'pc':'web')+':'+scene,id);
 const overrides={
  'SRC-038':'SRC-005','SRC-039':'SRC-005','SRC-040':'SRC-005','SRC-041':'SRC-005','SRC-043':'SRC-001','SRC-045':'SRC-002','SRC-048':'SRC-006','SRC-049':'SRC-004','SRC-127':'SRC-005','SRC-128':'SRC-005',
  'PRD-051':'PRD-001','PRD-053':'PRD-002','PRD-055':'PRD-004','PRD-056':'MED-002','PRD-060':'PRD-003','PRD-126':'PRD-002','PRD-142':'PRD-002',
  'CHN-066':'SYS-007','CHN-067':'PRD-005','CHN-068':'PRD-005','CHN-069':'PRD-005','CHN-072':'STORE-004','CHN-073':'STORE-004','CHN-141':'STORE-004',
  'ORD-075':'ORD-001-D','ORD-076':'ORD-001-D','ORD-078':'ORD-001','ORD-079':'PUR-001','ORD-080':'LOG-001','ORD-143':'ORD-001',
  'PUR-084':'PUR-003','PUR-086':'PUR-003','PUR-087':'PUR-003','PUR-088':'PUR-003','LOGI-090':'LOG-001','LOGI-091':'LOG-002',
  'AS-095':'AS-002','AS-144':'AS-002','SYS-114':'SYS-010','SYS-115':'SYS-010','SYS-116':'SYS-010','SYS-118':'SYS-011','SYS-119':'SYS-010','SYS-120':'SYS-012','SYS-129':'SYS-011','SYS-131':'SYS-010','SYS-132':'SYS-010','SYS-133':'SYS-010','SYS-140':'SYS-012',
  'STD-107':'SYS-007','STD-108':'SYS-007','STD-139':'SYS-007','MED-110':'SYS-006','MED-112':'MED-001','MED-113':'MED-001','MED-137':'SYS-006','MED-138':'SYS-006'
 };
 for(const [scene,id] of Object.entries(overrides))sceneTargets.set('web:'+scene,id);
 const originalWeb=requirements.pages.map(p=>p.id),originalPc=requirements.pcPages.map(p=>p.id);
 for(const p of requirements.pages){
  p.permission='本人操作；按店铺、对象、版本和确认条件核验；设计演示不授予实际平台权限';
  if(titles[p.id])p.name=titles[p.id];
  p.fields.forEach(f=>{if(f['中文名称']==='角色ID')f['中文名称']='操作范围';if(f['中文名称']==='角色名称')f['中文名称']='本人操作说明';});
 }
 for(const p of requirements.pcPages)if(titles[p.id])p.name=titles[p.id];
 requirements.meta.currentVersion='V9.1.1 / W8R2A-P1';
 const modules={JD:'JD',PKG:'PRD',INST:'SYS','SYS-004':'RTE','SYS-005':'RTE','SYS-008':'SYS','SRC-006':'SRC','LOG-002':'LOGI'};
 const customIds=Object.keys(defaultViews).filter(id=>defaultViews[id].startsWith('CUR-'));
 for(const id of customIds){
  const current=byId.get(id),scene=defaultViews[id],pc=current.surface==='pc';
  const basic={id:scene,name:current.name,currentId:id,category:'当前业务设计',input:'本人已选择的设备、账号、店铺与原任务上下文（演示）',steps:'核对上下文→检查独立能力→本人确认或只读观察→回传证据',humanTakeover:'登录、验证码与风险原因交由本人处理',output:'演示结果；不连接真实平台',boundary:'NAS 为业务真源；PC 不作业务状态裁决'};
  if(pc){requirements.pcPages.push(basic);continue;}
  const module=modules[id]||modules[id.split('-')[0]]||'SYS';
  requirements.pages.push({...basic,module,businessObject:current.name,purpose:current.name+'的完整设计演示；真实平台仍待统一 SIT',entry:'菜单或带原对象的业务跳转',permission:'本人操作',layout:'分组表单 + 查询列表 + 原对象上下文',query:'店铺、平台、状态',apiIds:[],testIds:[],audit:'演示本地事件；实际写入须本人确认',serverPc:'NAS 为唯一业务真源',codeSetRule:'业务状态使用中文',success:'仅变更演示状态',failure:'保留输入与原确认',
   fields:current.fields.map(f=>({FieldID:f.id,'中文名称':f.label,'角色':'CONTENT','类型':'string','必填':'否','可编辑':'否','来源':'当前设计基线','校验/展示':'演示值或待实样核验'})),buttons:[]});
 }
 const scenes=new Map([...requirements.pages.map(p=>['web:'+p.id,p]),...requirements.pcPages.map(p=>['pc:'+p.id,p])]);
 function queryString(params){return new URLSearchParams(Object.entries(params).filter(([k,v])=>!k.startsWith('__')&&k!=='view'&&v!==''&&v!=null)).toString();}
 function route(mode,sceneId,params={}){
  const target=sceneTargets.get(mode+':'+sceneId);if(!target||!scenes.has(mode+':'+sceneId))throw Error('Unknown prototype scene '+mode+':'+sceneId);
  const query=queryString({...params,view:undefined});
  const view='view='+encodeURIComponent(sceneId);
  return '#/'+mode+'/'+target+'?'+view+(query?'&'+query:'');
 }
 function resolve(hash){
  const raw=(hash||'#/web/DASH-001').replace(/^#\/?/,'');let [path,query='']=raw.split('?');let parts=path.split('/'),legacy=parts[0]==='v39';if(legacy)parts.shift();
  const mode=parts[0]==='pc'?'pc':'web',id=parts[1]||'DASH-001',params=Object.fromEntries(new URLSearchParams(query));
  let scene,current=byId.get(id);
  if(legacy)scene=id;else if(params.view)scene=params.view;else if(current&&current.surface===mode)scene=defaultViews[id];else scene=id;
  const found=scenes.get(mode+':'+scene),target=sceneTargets.get(mode+':'+scene);
  if(!found||(!legacy&&params.view&&target!==id))return {mode,id:'NOT-FOUND',params:{},invalid:true};
  const explicit=legacy||Boolean(params.view)||!current;
  return {mode,id:scene,params:{...params,__currentId:target,__currentTitle:explicit?'':current.name,__scene:scene},currentId:target};
 }
 function title(page,params){return params.__currentTitle||page.name;}
 function badge(mode,sceneId,params){
  const id=params.__currentId||sceneTargets.get(mode+':'+sceneId),p=byId.get(id);
  const text=p?.frontend==='LOCAL_DATA'?'对应系统已接本地数据':'设计保留 · 系统界面继续收口';
  return '<div class="prototype-status" role="note"><span class="prototype-label">交互原型 · 演示数据</span><span>'+text+'</span><span>真实平台待统一 SIT</span><button class="button small ghost" data-open-trace>页面设计记录</button></div>';
 }
 const pcGroups=[
  {label:'设备与连接',ids:['PC-001','PC-002','PC-003','CUR-PC-SETTINGS']},
  {label:'账号与浏览器',ids:['CUR-PC-LOGIN','PC-004','PC-005','PC-013']},
  {label:'任务与人工接管',ids:['CUR-PC-MONITOR','PC-011']},
  {label:'货源与媒体',ids:['PC-009','PC-010','PC-012']},
  {label:'店铺草稿与发布',ids:['PC-014','PC-015']},
  {label:'订单与履约',ids:['PC-016','PC-017','PC-018','PC-019']},
  {label:'适配与诊断',ids:['PC-006','PC-007','PC-008','PC-020']}
 ];
 window.QNPrototype={version:'9.1.1-w8r2a-p1',defaultViews,sceneTargets,scenes,route,resolve,title,badge,pcGroups,byId,originalWeb,originalPc,
  canonicalRoute(id,params={}){const p=byId.get(id);if(!p)throw Error('Unknown current page');const q=queryString(params);return '#/'+p.surface+'/'+id+(q?'?'+q:'');}};
})();
