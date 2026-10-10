#!/usr/bin/env python3
"""Add review corrections without mutating frozen source fields/buttons/styles."""
from pathlib import Path
r=Path(__file__).resolve().parents[1];p=r/'dist/app-restored.js';s=p.read_text()
old='const fields = queryFields(page);\n    const buttons = filterButtons(page)'
new="""const fields = queryFields(page).slice().sort((a,b)=>{const rank=f=>/名称|关键词|状态|时间/.test(f['中文名称'])?0:1;return rank(a)-rank(b);});
    const buttons = filterButtons(page)"""
if old in s:s=s.replace(old,new,1)
else:assert new in s,'review hook not found'
old_primary='const primary = fields.slice(0, 4);\n    const rest = fields.slice(4);'
new_primary="const business = fields.filter(f=>/名称|关键词|状态|时间/.test(f['中文名称']));\n    const primary = page.module==='PRD'&&business.length ? business.slice(0,4) : fields.slice(0,4);\n    const rest = fields.filter(f=>!primary.includes(f));"
if old_primary in s:s=s.replace(old_primary,new_primary,1)
else:assert new_primary in s,'primary review hook not found'
p.write_text(s)
p=r/'dist/index.html' ;s=p.read_text()
link='<link rel="stylesheet" href="./w8r2b-review.css?v=w8r2b-review1">'
if link not in s:s=s.replace('</head>',link+'\n</head>')
s=s.replace('<title>青鸟 · V9.1.1 W8R2A-P2 完整双端原型</title>', '<title>青鸟 · V9.1.1 W8R2B 原型复核版</title>')
s=s.replace('./app-restored.js?v=w8r2a-p2', './app-restored.js?v=w8r2b-review1')
if 'name="qingniao-review"' not in s:
    s=s.replace('</head>', '<meta name="qingniao-review" content="w8r2b-review1">\n</head>')
p.write_text(s)
