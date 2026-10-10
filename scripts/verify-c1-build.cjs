const fs=require('node:fs'),path=require('node:path');
const r=path.join(__dirname,'../dist'),html=fs.readFileSync(path.join(r,'index.html'),'utf8');
for(const n of ['index.html','configuration-patch.js','ui/configuration-ui.js','configuration.css','data/requirements.json','legacy/frozen-data/requirements.js'])if(!fs.existsSync(path.join(r,n)))throw Error(n);
if(!html.includes('9.1.2-w8r2b-c1'))throw Error('version');
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1].replace(/^\.\//,'').split('?')[0]);
for(const n of scripts)if(!fs.existsSync(path.join(r,n)))throw Error('missing script '+n);
let previous=-1;for(const n of ['prototype-p2.js','ui/configuration-ui.js','configuration-patch.js','app-restored.js']){const i=scripts.indexOf(n);if(i<=previous)throw Error('configuration entry order '+n);previous=i;}
console.log('C1 static assets and HTML configuration entry verified');
