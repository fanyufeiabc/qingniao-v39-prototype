/* Current additions use local demonstration state, never real platform calls. */
(()=>{
 'use strict';
 const Q=window.QNPrototype;
 let core=null,modal=null,detail=null;
 const model={checked:false,draft:'LOCAL_DRAFT',publication:'NOT_SUBMITTED',lock:true,readback:false,ocr:false,allocation:false,shipment:false,pair:false,
  fields:{title:'纯棉中筒袜 · 三双装',sku:'黑色 / 35–39',price:'19.90',stock:'50',category:'待本店实样核验',brand:'无品牌（演示）',material:'棉 80%（演示）',leadDays:'3',freight:'店铺运费模板（演示）',nasUrl:'https://nas.example',device:'家庭主电脑',shopRefund1:'20.00',shopRefund2:'10.00',sourceRefund1:'12.00',sourceRefund2:'6.00',purchaseLink1:'PUR-DEMO-01',purchaseLink2:'PUR-DEMO-02'}};
 const shops=[['1688','本人采购账号','采购独立档案'],['小红书','小红书示例店','小红书独立档案'],['微信小店','微信示例店','微信独立档案'],['京东','京东棉品示例店','京东独立档案']];
 const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
 const button=(action,label,primary=false,disabled=false)=>`<button class="button ${primary?'primary':''}" data-current-action="${action}" ${disabled?'disabled':''}>${label}</button>`;
 const go=(id,label)=>`<button class="button" data-current-go="${id}">${label}</button>`;
 function field(label,key,value,readonly=false,type='text'){return `<div class="field"><label>${label}</label><input class="input" type="${type}" data-current-field="${key}" value="${escape(model.fields[key]??value??'')}" ${readonly?'readonly':''}><span class="field-help">${readonly?'来源或核验状态':'本人核对；仅保存演示输入'}</span></div>`;}
 const card=(title,body,actions='')=>`<section class="card"><div class="card-head"><h2>${title}</h2><span class="meta-tag">设计演示</span></div><div class="card-body">${body}</div>${actions?`<div class="form-footer">${actions}</div>`:''}</section>`;
 const notice=text=>`<div class="notice warn page-notice"><div><strong>业务边界</strong><p>${text}</p></div></div>`;
 function table(headers,rows){return `<div class="table-scroll"><table><thead><tr>${headers.map(v=>`<th>${v}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
 function jdTabs(id){return `<div class="scenario-tabs">${['JD-001','JD-002','JD-003','JD-004','JD-005','JD-006'].map(p=>`<button class="button ${id===p?'active':''}" data-current-go="${p}">${escape(Q.byId.get(p).name)}</button>`).join('')}</div>`;}
 function jd(page,id){
  const product=()=>`<div class="form-grid current-form">${field('商品标题','title')}${field('销售规格','sku')}${field('售价（元）','price',null,false,'number')}${field('销售库存','stock',null,false,'number')}${field('发货天数','leadDays',null,false,'number')}${field('运费模板','freight')}</div>`;
  const summary=()=>table(['商品','店铺','版本','状态'],[[escape(model.fields.title),'京东棉品示例店','演示版本 1',escape(model.publication==='NOT_SUBMITTED'?model.draft:model.publication)]]);
  if(id==='JD-001')return jdTabs(id)+`<div class="current-grid">${card('商品资料与销售包装',product()+`<div class="field"><label>商品描述</label><textarea class="textarea" data-current-field="description">${escape(model.fields.description||'棉质袜品；成分、尺寸及包装须本人核对。')}</textarea></div>`,button('save-product','保存本地商品资料',true)+go('JD-002','核对类目属性'))}${card('店铺与媒体准备',`<div class="context-list"><div class="context-row"><span>店铺</span><strong>京东棉品示例店</strong></div><div class="context-row"><span>货源</span><strong>1688 来源快照（演示）</strong></div><div class="context-row"><span>内衣类型</span><strong>本人选择具体类型后核对类目</strong></div><div class="context-row"><span>图片授权</span><strong>待本人核对；原图与处理图分别记录</strong></div></div>`,go('MED-001','查看媒体清单')+go('PKG-001','包装 OCR 核对'))}</div>`;
  if(id==='JD-002')return jdTabs(id)+card('类目与必填属性核对',`<div class="form-grid current-form">${field('平台叶子类目','category',null,true)}${field('品牌','brand')}${field('材质成分','material')}${field('包装单位','unit','三双 / 包')}${field('具体内衣类型','underwearType','待本人选择')}${field('核验依据','categoryEvidence','真实店铺样本待统一 SIT',true)}</div>`+notice('袜子、内衣商品提示不能代替京东真实类目与必填属性。保存本地资料不能自动开启平台写入。'),button('save-category','保存属性资料',true)+go('JD-003','进入草稿同步与回读'));
  if(id==='JD-003')return jdTabs(id)+card('草稿同步与唯一完整回读',summary()+`<div class="current-checks"><label><input type="checkbox" data-current-check="capability" ${model.checked?'checked':''}>模拟已完成独立能力核验（演示场景；不代表真实平台通过）</label></div>`+table(['核对项','要求','本次结果'],[['独立平台草稿能力','按本店实际能力支持或保留本地草稿',model.checked?'演示：支持':'待实样'],['完整回读','唯一商品、标题、SKU、金额、媒体、类目一致',model.draft==='READBACK_MATCHED'?'演示：完整匹配':'未观察'],['写后回执丢失','保持原确认；只读对账恢复','不会重复写入']]),button('sync-draft','模拟同步并完整回读',true,!model.checked||model.lock&&model.publication==='UNKNOWN')+go('JD-004','审核与发布确认')+go('JD-005','查看 UNKNOWN 对账'));
  if(id==='JD-004'){const snapshot=model.snapshot||model.fields;return jdTabs(id)+card('本人确认提交审核与发布',summary()+table(['核对项','演示值'],[['标题',escape(snapshot.title)],['销售规格',escape(snapshot.sku)],['售价 / 库存',escape(snapshot.price)+' 元 / '+escape(snapshot.stock)],['原草稿版本','演示版本 1'],['审核及在售状态',escape(model.publication)]])+notice('提交回执只表示请求已接收。完整回读 IN_REVIEW 才表示已提交审核，完整回读 ON_SALE 才表示已上架。'),button('review-confirm','核对并本人确认提交审核',true,model.draft!=='READBACK_MATCHED'||model.publication!=='NOT_SUBMITTED')+button('unknown','模拟写后回执丢失')+button('review-read','模拟读取审核与在售状态')+button('publish-confirm','本人再次确认发布',false,model.publication!=='APPROVED')+go('JD-005','原快照只读对账'));}
  if(id==='JD-005')return jdTabs(id)+card('原确认与 UNKNOWN 写入锁',table(['原对象','原确认','写锁','允许动作'],[['演示发布任务 JD-PUB-001','原商品版本、店铺、账号与内容摘要保留','保持锁定','查看与只读对账']])+table(['回读项','当前观察'],[['外部候选',model.readback?'演示：唯一候选完整匹配':'尚未取得可信回读'],['审核及在售状态',model.readback?'演示：IN_REVIEW；未宣称已上架':'待核验'],['恢复裁决','提交证据给 NAS；PC 不能自行解锁']])+notice('UNKNOWN 禁止重复提交、重新发布或清除原锁。当前按钮仅模拟只读观察，锁保持。'),button('read-reconcile','运行只读对账（演示）',true)+button('send-evidence','提交回读证据（演示）',false,!model.readback)+`<button class="button danger" disabled>重复提交已阻断</button>`+go('JD-004','返回审核记录'));
  return jdTabs(id)+card('京东订单详情与商品明细',table(['原平台订单','店铺','观察状态','来源版本'],[['JD-DEMO-ORDER-001','京东棉品示例店','演示订单；本店实样待读取','演示版本 1']])+table(['商品明细','规格','数量','售价','采购与包裹'],[['棉袜三双装','黑色 / 35–39','1','19.90 元','待本人关联 1688 货源'],['棉袜三双装','灰色 / 40–44','2','19.90 元','独立商品行，保留原身份']]),go('PUR-001','按商品生成采购建议')+go('LOG-001','核对履约包裹')+go('AS-001','查看售后'));
 }
 function configuration(page,id){
  const configs={
   'SYS-004':['浏览器与独立档案',[['浏览器程序路径','browser','C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'],['档案别名','profile','本人采购独立档案'],['绑定设备','device','家庭主电脑'],['核验状态','identity','真实身份待核验']], '目录存在不能证明已登录；每平台、账号、设备及档案独立核验。'],
   'SYS-005':['1688 UTP 能力配置',[['UTP 程序位置','utp','本人固定 PC 的 UTP 程序'],['采购账号','utpAccount','本人采购账号'],['设备与独立档案','utpProfile','固定设备 / 1688 独立档案'],['能力合同','utpContract','建单、回读、物流和售后分别待核验']], '默认以 UTP 和受控浏览器连接外部平台；保存配置不能代替各操作能力的实样核验。'],
   'SYS-008':['AI CLEAN / INSPECT 配置',[['模型服务地址','aiUrl','本人部署的模型服务地址'],['清洗模型','cleanModel','待配置'],['检测模型','inspectModel','待配置'],['媒体使用策略','aiMedia','原图、处理图、来源与授权独立保留']], '清洗与检测是本期设计范围。失败保留原图与草稿；真实模型与 OCR 环境待统一 SIT。'],
   'PC-006':['连接与设置',[['NAS HTTPS 地址','nasUrl'],['设备名称','device'],['浏览器程序路径','browser','固定 Windows PC 的实际程序'],['UTP 程序路径','utp','本人配置的 UTP 程序']], '保存和启停均由本人操作。NAS 与 PC 发行版本一致才能启动；令牌不写入公开原型或配置示例。']
  };
  const [title,fields,boundary]=configs[id];
  return card(title,`<div class="form-grid current-form">${fields.map(([label,key,value])=>field(label,key,value)).join('')}</div>`+notice(boundary),button('check-config','检查格式与连接条件（演示）')+button('save-config','保存配置（演示）',true)+go(id==='PC-006'?'PC-001':'SYS-003',id==='PC-006'?'首次配对':'查看执行节点'));
 }
 function packageOcr(){return card('包装 OCR 与本人核对',`<div class="form-grid current-form">${field('包装图片','packImage','示例包装图（原图授权待核对）',true)}${field('销售包装单位','packUnit','三双 / 包')}${field('每包装件数','packCount','3',false,'number')}${field('商品成分','packMaterial',model.ocr?'棉 80%（演示识别）':'尚未识别')}${field('尺寸与适用范围','packSize','35–39')}${field('识别依据','ocrEvidence',model.ocr?'演示 OCR 字段；待本人核对':'待识别与实样核验',true)}</div>`+notice('OCR 结果作为待核对资料；本人确认后才进入商品版本。缺失、低置信度或与 SKU 冲突时保留原值。'),button('ocr','模拟 OCR 识别')+button('ocr-confirm','本人核对并采纳（演示）',true,!model.ocr)+go('PRD-002','返回商品编辑'));}
 function links(){return card('批量商品链接与逐项采集',`<div class="field"><label>1688 商品链接（每行一条）</label><textarea class="textarea" data-current-field="links" placeholder="粘贴本人要采集的商品链接">${escape(model.fields.links||'')}</textarea><span class="field-help">仅形成演示批次；重复、无效与失败项分别记录。</span></div>`+table(['批次项','处理规则','恢复方式'],[['有效商品链接','本人选择后创建采集任务','只处理失败项；不重复成功项'],['重复或无效链接','提示并保留原输入','本人修正后重新核对'],['登录或验证码','原档案暂停','本人接管后重新核验']]),button('check-links','核对链接',true)+go('SRC-002','查看候选')+go('SRC-003','查看采集任务'));}
 function install(){return card('NAS 安装与运行管理',table(['步骤','本人操作','当前演示状态'],[['数据库连接','填写连接并检查空库或账本','待目标 PostgreSQL'],['初始化与候选迁移','独立开发库审阅后执行','本批未执行目标迁移'],['备份与恢复','数据库及私有媒体分别处理','恢复演练待统一 SIT'],['业务服务','本人明确启动或停止','当前仅原型演示']])+notice('管理服务与业务服务、平台能力分别核验。安装成功不表示平台已登录或外部链路已验收。'),button('installation-check','演示安装前检查',true)+go('SYS-012','备份与维护')+go('SYS-011','系统诊断'));}
 function logistics(){return card('逐商品分配与本人确认物流回填',table(['店铺包裹','采购包裹','商品行','本次回填数量'],[['XHS-DEMO-PKG-001','1688-DEMO-PKG-01','棉袜黑色 / 35–39','1'],['XHS-DEMO-PKG-001','1688-DEMO-PKG-02','棉袜灰色 / 40–44','2']])+`<div class="form-grid current-form">${field('承运商','carrier','中通快递（演示）')}${field('运单号','waybill','DEMO-TRACK-001')}${field('包裹来源版本','shipmentVersion','演示版本 1',true)}${field('状态','shipmentState',model.shipment?'本人已确认（演示）；等待可信回读':'待本人确认',true)}</div>`+notice('仅回填本人核对的这批商品与数量。UNKNOWN 包裹保留原确认和锁；可信完整回读后才能接受结果。'),button('shipment-confirm','核对并本人确认回填（演示）',true)+go('LOG-001','返回物流中心'));}
 function login(){return card('独立平台登录与身份核验',table(['平台','本人账号 / 店铺','独立档案','状态','操作'],shops.map(([platform,account,profile])=>[platform,account,profile,'待真实身份核验',button('login:'+platform,'准备登录窗口（演示）')]))+notice('本人处理扫码、验证码或风控后，仍须核验平台身份、账号、店铺、设备与档案。登录不能解除原 UNKNOWN 锁。'),go('PC-007','管理账号档案')+go('PC-004','查看人工接管'));}
 const tasks=[['采集','1688','商品及媒体','READY','PC-010','demo-collect'],['草稿同步','小红书','原商品版本','READY','PC-014','demo-draft'],['发布对账','京东','原发布确认','UNKNOWN','PC-015','demo-publish-locked'],['订单回流','微信小店','订单分页游标','READY','PC-016','demo-orders'],['采购建单','1688','本人采购确认','READY','PC-017','demo-purchase'],['物流回填','京东','本人包裹确认','READY','PC-018','demo-shipment']];
 function monitor(){return card('任务监控与执行上下文',table(['任务','平台','原对象','状态','操作'],tasks.map(([type,platform,object,status,scene,task])=>[type,platform,object,status==='UNKNOWN'?'UNKNOWN · 保留锁':'待执行（演示）',`<button class="button small" data-current-task="${scene}" data-current-task-id="${task}">查看执行与证据</button>`]))+notice('写后结果不明的原任务保持锁定。只读观察与证据回传不会自动触发再次发布、建单或物流回填。'),button('refresh-tasks','刷新演示任务'));
 }
 function purchaseSelect(key){return `<select class="input" data-current-field="${key}">${[['PUR-DEMO-01','1688 商家甲'],['PUR-DEMO-02','1688 商家乙']].map(([id,label])=>`<option value="${id}" ${model.fields[key]===id?'selected':''}>${id} · ${label}</option>`).join('')}</select>`;}
 function allocation(){return card('售后双侧关联与费用、退款核对',table(['店铺商品明细','本人选择采购单','店铺侧退款','1688 侧退款'],[
  ['棉袜黑色 / 35–39',purchaseSelect('purchaseLink1'),`<input class="input" type="number" data-current-field="shopRefund1" value="${escape(model.fields.shopRefund1)}">`,`<input class="input" type="number" data-current-field="sourceRefund1" value="${escape(model.fields.sourceRefund1)}">`],
  ['棉袜灰色 / 40–44',purchaseSelect('purchaseLink2'),`<input class="input" type="number" data-current-field="shopRefund2" value="${escape(model.fields.shopRefund2)}">`,`<input class="input" type="number" data-current-field="sourceRefund2" value="${escape(model.fields.sourceRefund2)}">`]
 ])+`<p class="design-note">演示限额：店铺侧 30.00 元，1688 侧 18.00 元；两侧分别核对。${model.allocation?'本人已保存演示分配。':'待本人手工分配。'}</p>`+notice('一笔店铺售后可以按商品关联多张采购单；退款金额由本人手工分配。本原型不发起支付、退款或平台售后裁决。'),button('save-allocation','保存本人关联与分配（演示）',true)+go('FIN-003','查看待分配核算'));}
 Q.renderCurrent=function(page,helpers){const id=page.currentId;let body='';if(id.startsWith('JD-'))body=jd(page,id);else if(['SYS-004','SYS-005','SYS-008','PC-006'].includes(id))body=configuration(page,id);else if(id==='PKG-001')body=packageOcr();else if(id==='SRC-006')body=links();else if(id==='INST-001')body=install();else if(id==='LOG-002')body=logistics();else if(id==='PC-003')body=login();else if(id==='PC-005')body=monitor();return helpers.header(page)+body;};
 Q.extraBusiness=function(sceneId,currentId){return ['AS-094','AS-095','AS-144'].includes(sceneId)||currentId==='AS-002'?allocation():'';};
 Q.overlay=function(){
  if(detail)return `<div class="drawer-backdrop" data-current-action="close-current"></div><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head"><h2>${escape(detail.title)}</h2>${button('close-current','关闭')}</div><div class="drawer-body"><p class="design-note">所选对象的演示记录；真实结果需独立核验。</p>${table(['字段','当前演示值'],detail.rows)}</div></aside>`;
  if(!modal)return '';
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="本人确认"><div class="modal-head"><div><h2>${escape(modal.title)}</h2><p>仅提交演示确认；原对象与版本已冻结</p></div></div><div class="modal-body">${table(['核对项','本次内容'],[['本人','本人'],['对象','演示任务；原店铺、账号与商品明细'],['版本','演示版本 1'],['范围',escape(modal.description)]])}${notice('支付与平台售后决定仍由本人处理；UNKNOWN 必须只读对账，不能重复写。')}</div><div class="modal-footer">${button('close-current','返回检查')}${button('confirm-current','本人确认（演示）',true)}</div></section></div>`;
 };
 Q.bind=function(api){core=api;};
 Q.closeCurrent=function(){modal=null;detail=null;};
 function toast(title,message,type='success'){core?.toast(title,message,type);}
 function rerender(){core?.render();}
 function cents(value){if(!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(String(value)))return null;const [a,b='']=String(value).split('.');return BigInt(a)*100n+BigInt((b+'00').slice(0,2));}
 document.addEventListener('input',event=>{if(event.target.dataset.currentField)model.fields[event.target.dataset.currentField]=event.target.value;});
 document.addEventListener('change',event=>{if(event.target.dataset.currentField)model.fields[event.target.dataset.currentField]=event.target.value;if(event.target.dataset.currentCheck==='capability'){model.checked=event.target.checked;rerender();}});
 document.addEventListener('click',event=>{
  const b=event.target.closest('button,[data-current-action]');if(!b||b.disabled)return;
  if(b.dataset.currentGo){core?.close();location.hash=Q.canonicalRoute(b.dataset.currentGo);return;}
  if(b.dataset.currentTask){core?.navigatePc(b.dataset.currentTask,{taskId:b.dataset.currentTaskId,writeLocked:b.dataset.currentTaskId.endsWith('locked')?'true':'false'});return;}
  const a=b.dataset.currentAction;if(!a)return;
  if(a==='close-current'){modal=null;detail=null;core?.overlay();return;}
  if(a.startsWith('login:')){toast('登录窗口准备（演示）',a.slice(6)+' · 使用原独立档案；尚未完成真实身份核验。');return;}
  if(a==='sync-draft'){if(model.publication==='UNKNOWN')return toast('原锁保持','禁止重复写入。','warn');if(!model.checked)return toast('能力未核验','须先选择演示核验场景。','warn');model.draft='READBACK_MATCHED';model.snapshot=Object.freeze({...model.fields});toast('演示草稿回读匹配','仅演示唯一完整草稿回读；未发布。');}
  else if(a==='unknown'){model.publication='UNKNOWN';model.lock=true;toast('演示：结果不明','原确认与写锁保留；请进入只读对账。','warn');}
  else if(a==='review-read'){if(model.publication==='UNKNOWN')return toast('原锁保持','UNKNOWN 只能在原快照中只读对账。','warn');model.publication=({SUBMIT_REQUESTED:'IN_REVIEW',IN_REVIEW:'APPROVED',PUBLISH_REQUESTED:'ON_SALE'})[model.publication]||model.publication;toast('审核及在售状态观察（演示）',model.publication);}
  else if(a==='read-reconcile'){model.readback=true;toast('只读回读完成（演示）','已取得演示匹配证据；原锁仍保留。');}
  else if(a==='send-evidence'){toast('证据提交（演示）','等待 NAS 核验和裁决；PC 不解锁。');}
  else if(['review-confirm','publish-confirm','shipment-confirm'].includes(a)){if(model.publication==='UNKNOWN'&&a!=='shipment-confirm')return toast('重复写入已阻断','原确认与锁保留。','warn');modal={action:a,title:a==='review-confirm'?'本人确认提交审核':a==='publish-confirm'?'本人确认发布':'本人确认物流回填',description:a==='shipment-confirm'?'所选包裹、商品行、数量、承运商和运单号':model.fields.title+' / '+model.fields.sku+' / '+model.fields.price+' 元'};core?.overlay();return;}
  else if(a==='confirm-current'){if(!modal)return;const action=modal.action;modal=null;if(model.publication==='UNKNOWN'&&action!=='shipment-confirm')return toast('原锁保持','禁止重复写入。','warn');if(action==='review-confirm')model.publication='SUBMIT_REQUESTED';else if(action==='publish-confirm')model.publication='PUBLISH_REQUESTED';else model.shipment=true;toast('本人确认已记录（演示）','请求已记录；未据此宣称已审核或已上架，结果须完整回读。');}
  else if(a==='ocr'){model.ocr=true;model.fields.packMaterial='棉 80%（演示识别）';toast('演示 OCR 已生成','本人核对后才能采纳；未运行实际 OCR。');}
  else if(a==='ocr-confirm'){toast('本人已采纳演示字段','原图、识别结果和本人修订分别保留。');}
  else if(a==='save-allocation'){const v=['shopRefund1','shopRefund2','sourceRefund1','sourceRefund2'].map(k=>cents(model.fields[k]));if(v.some(x=>x===null)||v[0]+v[1]>3000n||v[2]+v[3]>1800n)return toast('分配未保存','金额须非负、最多两位小数，且两侧分别不超过可分配金额。','error');model.allocation=true;toast('本人演示分配已保存','逐商品关联多采购单；两侧金额分别核对，无平台退款动作。');}
  else if(a==='check-links'){const values=(model.fields.links||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!values.length)return toast('请填写商品链接','输入保留，尚未创建任务。','warn');const valid=values.filter(x=>/^https:\/\/detail\.1688\.com\/offer\/\d+\.html(?:\?.*)?$/.test(x));toast('链接格式核对（演示）',`输入 ${values.length} 条，有效格式 ${new Set(valid).size} 条；实际商品身份尚未核验。`);}
  else if(a==='save-product'){if(cents(model.fields.price)===null||!/^(?:0|[1-9]\d*)$/.test(model.fields.stock)||!model.fields.title.trim())return toast('商品资料未保存','核对标题、售价和整数库存。','error');toast('本地资料已保存（演示）','没有触发店铺写入。');}
  else if(a==='check-config'){if(model.fields.nasUrl&&!model.fields.nasUrl.startsWith('https://'))return toast('地址格式不通过','NAS 须使用 HTTPS；原输入保留。','error');toast('演示格式检查通过','实际 TLS、版本、设备绑定和能力仍待部署核验。');}
  else toast('演示操作已记录','本次只更新原型；不会连接 NAS、UTP 或真实店铺。');
  rerender();
 });
 Q.genericPcAction=function(button,page){
  const label=button.textContent.trim();
  if(label==='查看'||label==='请求人工接管'||label==='请求取消'||label==='标记不匹配'||label==='提交对账证据'){
   const row=button.closest('tr');detail={title:label==='查看'?'所选记录详情':label,rows:row?Array.from(row.cells).slice(0,-1).map((c,i)=>['字段 '+(i+1),escape(c.textContent)]):[['原任务',escape(page.name)],['处理范围','演示观察和证据；原锁保持']]};core?.overlay();return true;
  }
  if(['新增 Profile','检查登录健康','刷新版本','执行验证','导出诊断包'].includes(label)){toast(label+'（演示）','操作入口已保留；真实设备、档案和样本尚未核验。');return true;}
  if(button.classList.contains('session-item')){toast('会话已选择（演示）',label+' · 原档案与检查点保持。');return true;}
  return false;
 };
})();
