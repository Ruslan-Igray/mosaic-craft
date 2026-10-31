/* Create one reproducible release. Changed content requires a new visible version. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../dist'),version=process.argv[2];
if(!/^\d+\.\d+\.\d+$/.test(version))throw Error('Use a version such as 1.1.0');
const read=name=>fs.readFileSync(path.join(base,name),'utf8');
const hash=text=>crypto.createHash('sha256').update(text).digest('hex').slice(0,10);
const scripts=['app.js','storage.js','updates.js','layout.js'],assetTag=version+'-'+hash(scripts.map(read).join('')+read('app.css')+read('screen.css'));
let html=read('index.html').replace(/\b(src|href)="\.\/(app\.css|screen\.css|app\.js|storage\.js|updates\.js|version\.js|layout\.js)(\?[^"]*)?"/g,
  (_,attribute,file)=>attribute+'="./'+file+'?v='+assetTag+'"');
let worker=read('sw.js');
const build=hash(scripts.map(read).join('')+read('app.css')+read('screen.css')+html+read('manifest.webmanifest')+worker.replace(/^const RELEASE = .*;$/m,'const RELEASE = null;'));
const release={version,build,assetTag};
const previousPath=path.join(base,'version.json');
if(fs.existsSync(previousPath)){
 const previous=JSON.parse(fs.readFileSync(previousPath,'utf8'));
 if(previous.version===version&&previous.build!==build&&!process.argv.includes('--draft'))throw Error('Content changed: increase the release version first (or use --draft before publication).');
}
worker=worker.replace(/^const RELEASE = .*;$/m,'const RELEASE = '+JSON.stringify(release)+';');
fs.writeFileSync(path.join(base,'index.html'),html);
fs.writeFileSync(path.join(base,'sw.js'),worker);
fs.writeFileSync(path.join(base,'version.js'),"'use strict';\nglobalThis.MOSAIC_RELEASE=Object.freeze("+JSON.stringify(release)+");\n");
fs.writeFileSync(previousPath,JSON.stringify(release,null,2)+'\n');
fs.writeFileSync(path.join(base,'.nojekyll'),'');
console.log('Release '+version+' / '+build);
