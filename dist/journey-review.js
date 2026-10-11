(()=>{'use strict';const Q=window.QNPrototype;const flows={
 SRC:['找货与采集','选择货源账号和能力通道，搜索或填链接；核对商品编号、SKU、分页及来源后采集落库。','1688 商品编号和分页已有只读 POC；数量、价格及库存语义和当前环境待 SIT。'],
 PRD:['商品加工','编辑并保存回读；旧版本提交阻断；包装字段先人工核对；AI/OCR建议不能直接覆盖本人确认。','图片来源、授权、质量、材质、尺寸、类目及包装证据不足时阻断上架。'],
 PKG:['包装核对','查看原图与 OCR 证据，逐字段本人核对，再保存商品版本。','AI/OCR识别结果不等于平台属性或本人批准。'],
 STR:['店铺草稿与发布','绑定本人店铺；创建投影、同步草稿并回读；本人确认后提交审核或发布。','回执、审核中、审核驳回、在售状态分别显示；写入结果未知时只对账，不重发。'],
 ORD:['订单回流','按当前店铺读取列表和详情，核对订单、商品明细与包裹身份，去重落库。','小红书只读归属已有 POC；同订单多商品、多包裹及增量语义缺样本待验证。'],
 PUR:['订单采购','销售明细关联货源 SKU，核对数量、价格与地址，生成采购草稿；本人确认建单并回读。','采购支付由本人在外部平台完成；1688订单编号回读有证据，建单整链待实样验证。'],
 LOG:['物流履约','回读采购包裹，按销售商品明细关联，核对承运商及运单，确认同步店铺，再回读。','多采购单、多包裹、部分发货和平台物流写入缺实样；未知结果保留锁。'],
 AFT:['售后与退款核对','本人按商品明细关联多张采购单；分别核对店铺及货源售后，手工分配退款。','售后决策与退款不自动执行；两侧费用不能直接相抵或推断已退款。'],
 FIN:['费用与利润','缺费用标记待补或估算，整单费用和退款由本人分配后核对。','币种、金额单位、税费及退款归属均需证据，不把估算显示为已结算。'],
 TSK:['人工处理与对账','登录、验证码、风控与身份异常停下等待本人；关键操作重新核对当前版本。','写入开始后出现异常进入结果未知，保留原确认及锁，只允许只读对账和提交证据。']};
 flows.LOGI=flows.LOG;flows.AS=flows.AFT;
 const previous=Q.afterRender;Q.afterRender=(root,page)=>{previous(root,page);if(!page)return;const pc=page.module==='PC';if(!pc&&!flows[page.module])return;const wrap=root.querySelector('.page-wrap');if(!wrap)return;const d=root.ownerDocument,box=d.createElement('details');box.className='card v920-journey';const summary=d.createElement('summary');summary.textContent=pc?'PC 连接与登录要求':'本页操作顺序与验证范围';box.append(summary);const parts=pc?['设备配对、Windows解锁、平台会话、身份核对及业务适配是不同状态。','扫码和账号密码在本人固定PC的平台网页完成；Cookie留在该账号独立档案，可在本机控制台导入。验证码/风控由本人处理，处理后重新核对身份。','1688 UTP授权独立于网页Cookie；扫码不自动代表linked=true。此原型不连接PC或真实平台，不能上传真实Cookie、密码或验证码。']:flows[page.module];for(const text of parts){const p=d.createElement('p');p.textContent=text;box.append(p)}wrap.prepend(box);};
})();
