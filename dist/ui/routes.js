(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.QNRoutes=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const aliases={dashboard:'DASH-001',todo:'DASH-002',exceptions:'DASH-003',source:'SRC-001',product:'PRD-001',orders:'ORD-001',purchases:'PUR-001',fulfillment:'LOG-001',tasks:'SYS-009',finance:'FIN-003',aftersale:'AS-001',setup:'SYS-002',jd:'JD-001',jdOrderDetail:'JD-006'};
 const keys=['storeId','accountId','profileId','taskId','objectId','objectVersion','workItemId','platform','kind','priority','sort','page','size','returnTo','sourcePage','baseline'];
 function parse(hash,registry,surface='web'){
  const raw=String(hash||'').replace(/^#/,'');const [path,search='']=raw.split('?');let parts=path.split('/').filter(Boolean),id=parts[1]||aliases[parts[0]]||parts[0]|| (surface==='pc'?'PC-001':'DASH-001');
  if(parts.length===1&&aliases[id])id=aliases[id];const query={};
  for(const [k,v] of new URLSearchParams(search))if(keys.includes(k)&&v.length<=2048)query[k]=v;
  if(parts[0]==='v39'||query.baseline==='V3.9-FROZEN'){
   const old=registry.legacy.find(x=>x.surface===(parts[1]==='pc'?'pc':surface)&&x.oldId===(parts[2]||id));
   if(old){id=old.targetId;query.baseline='V3.9-FROZEN';}
  }
  const page=registry.pages.find(p=>p.id===id&&p.surface===surface);
  return {pageId:page?id:null,query,error:page?null:'PAGE_NOT_FOUND'};
 }
 function hash(pageId,query={},surface='web'){
  const params=new URLSearchParams();for(const k of keys)if(query[k]!==undefined&&query[k]!==null&&query[k]!=='')params.set(k,String(query[k]));
  return '#/'+surface+'/'+pageId+(params.size?'?'+params:'');
 }
 function safeReturn(value){return typeof value==='string'&&value.length<=2048&&/^#\/(web|pc)\/[A-Z0-9-]+(?:\?[^#]*)?$/.test(value)?value:null;}
 return {aliases,parse,hash,safeReturn};
});
