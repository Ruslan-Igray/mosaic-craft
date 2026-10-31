
    (async()=>{
      const root=document.getElementById('mosaic-full-prototype'),$=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
      const words={many:'Много',medium:'Средне',few:'Мало',none:'Нету'},filterKeys=['all','number','many','medium','few','none'];
      const seedColors=[['Белый','#f4f2e9'],['Кремовый','#e7d6b0'],['Жёлтый','#f1ce3c'],['Горчичный','#bb9228'],['Оранжевый','#ef963e'],['Красный','#cf483c'],['Бордовый','#8b3435'],['Коричневый','#7b4d30'],['Кофейный','#573d30'],['Чёрный','#292e34'],['Тёмно-серый','#5b6770'],['Серый','#919ba1'],['Светло-серый','#c9d0d3'],['Тёмно-синий','#254b77'],['Синий','#386eb5'],['Голубой','#65b9e9'],['Ледяной','#afe1f3'],['Бирюзовый','#3ebdbd'],['Тёмно-бирюзовый','#217a83'],['Зелёный','#4aa875'],['Тёмно-зелёный','#24674c'],['Салатовый','#91c75b'],['Лаймовый','#c1d853'],['Оливковый','#778438'],['Песочный','#c6a76a'],['Медный','#ad713f'],['Терракотовый','#c76b48'],['Хвойный','#3d7364'],['Лазурный','#3b9acc'],['Морская волна','#68b9aa']];
      function seedPalette(){return seedColors.map(([name,hex],i)=>({id:'C'+String(i+1).padStart(2,'0'),name,hex,mode:i%5===4?'number':'words',word:['many','medium','few','none'][i%5]||null,count:i%5===4?[120,250,40,80,200,0][Math.floor(i/5)]:null,accuracy:i%10===4?'approx':'exact'}));}
      const art={
        dog:{name:'Собака',colors:{'1':'#573d30','2':'#d6ad72','3':'#242a32','4':'#f2e6ce'},rows:['0000000000000000','0001100000011000','0001111111111000','0011222222221100','0012222222222100','0012232223222100','0012222222222100','0012222332222100','0001224444221000','0000122222210000','0000111111110000','0001122222211000','0011222222221100','0011122222211100','0001110000111000','0000000000000000']},
        rocket:{name:'Ракета',colors:{'1':'#254b77','2':'#f4f2e9','3':'#65b9e9','4':'#ef963e','5':'#f1ce3c'},rows:['0000000000000000','0000000110000000','0000001221000000','0000012222100000','0000012332100000','0000012332100000','0000012222100000','0000112222110000','0001122222211000','0011122222211100','0011122222211100','0000011111100000','0000004554000000','0000004554000000','0000000550000000','0000000000000000']},
        dino:{name:'Динозавр',colors:{'1':'#24674c','2':'#91c75b','3':'#242a32','4':'#f4f2e9'},rows:['0000000000000000','0000000111111000','0000001222222100','0000001222322100','0000001222222100','0000001224444400','0100001222110000','0110012221000000','0121122221110000','0122222221210000','0012222221000000','0001222210000000','0001122110000000','0001200120000000','0001110111000000','0000000000000000']},
        cat:{name:'Кот',colors:{'1':'#7b4d30','2':'#ef963e','3':'#242a32','4':'#f4f2e9'},rows:['0000000000000000','0001100000011000','0001210000121000','0001221111221000','0012222222222100','0012232223222100','0012222222222100','0012242332422100','0001224444221000','0000112222110000','0000011111000000','0000122222100000','0001222222210000','0001122222110000','0000110001100000','0000000000000000']}
      };
      Object.assign(art,{
        creeper:{name:'Крипер',colors:{'1':'#24674c','2':'#91c75b','3':'#29352e','4':'#4aa875'},rows:[
          '0001111111111000','0001222222421000','0001222422221000','0001233223321000',
          '0001233223321000','0001222332221000','0001223333221000','0001243333221000',
          '0001223223221000','0001111111111000','0000012442100000','0000012222100000',
          '0000012422100000','0001122222211000','0001232112321000','0001111001111000']},
        pickaxe:{name:'Кирка',colors:{'1':'#215862','2':'#65d2d9','3':'#d4f6ed','4':'#573d30','5':'#ad713f'},rows:[
          '0000000000000000','0000000111110000','0000011222221000','0000122332222100',
          '0000011111222100','0000000045122100','0000000454012100','0000004540001100',
          '0000045400000000','0000454000000000','0004540000000000','0045400000000000',
          '0044000000000000','0000000000000000','0000000000000000','0000000000000000']},
        diamond:{name:'Алмаз',colors:{'1':'#215862','2':'#65d2d9','3':'#d4f6ed','4':'#3b9acc'},rows:[
          '0000000000000000','0000000000000000','0000011111100000','0000122332210000',
          '0001222332221000','0011222332221100','0014444444444100','0001442222441000',
          '0000144224410000','0000014224100000','0000001441000000','0000000110000000',
          '0000000000000000','0000000000000000','0000000000000000','0000000000000000']}
      });
      const boards={square:{name:'Квадрат',short:'Квадрат',description:'14,5 × 14,5 см · 29 × 29 штырьков',type:'square',n:29,total:841},circle:{name:'Круг',short:'Круг',description:'Диаметр 15,2 см · 631 штырёк',type:'circle',total:631},hex:{name:'Шестиугольник',short:'Шести-\nугольник',description:'14,8 × 16,5 см · 631 штырёк',type:'hex',total:631},mini:{name:'Квадрат',short:'Квадрат',description:'28 × 28 см · 104 × 104 штырька',type:'square',n:104,total:10816}};
      const uploads=new Map(),sourceCache=new Map(),geometryCache=new Map(),workCache=new Map(),redoCache=new Map();
      let state={screen:'home',size:'5',board:'square',source:'dog',fit:'contain',rotation:0,removeWhite:true,k:8,colorMode:'all',provider:'yandex',query:'Собака',palettes:{'5':[],'2.6':[]},stockSelected:'C16',stockFilter:'all',stockPage:0,stockReturn:null,currentWork:null,works:[],draft:null,discoveries:[],creationCounter:0};
      let diamondTaps=0,creeperTaps=0,migrationNeeded=false;
      let revision=0,storeReady=false,saving=false,pendingSnapshot=null,savePromise=Promise.resolve(true),saveError=null,conflicted=false;
      let viewport={zoom:1,x:0,y:0},tool='view',paint=0,replacement={index:null,candidate:null},exportMode='picture';
      const stockLabel=c=>!c?'Неизвестно':c.mode==='words'?(words[c.word]||'Неизвестно'):(c.accuracy==='approx'?'≈ ':'')+c.count+' шт.';
      const compactStock=c=>c.mode==='words'?(words[c.word]||'?'):(c.accuracy==='approx'?'≈':'')+c.count;
      const isAvailable=c=>c&&((c.mode==='words'&&c.word&&c.word!=='none')||(c.mode==='number'&&Number(c.count)>0));
      const palette=()=>state.palettes[state.size];
      const availablePalette=()=>palette().filter(isAvailable);
      const current=()=>state.works.find(w=>w.id===state.currentWork);
      function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
      function button(text,cls,fn){const b=node('button',(cls||'')+' cursor-interaction',text);b.type='button';if(fn)b.addEventListener('click',fn);return b;}
      function bead(hex){const b=node('span','mf-bead');b.style.setProperty('--mf-pigment',hex);b.setAttribute('aria-hidden','true');return b;}
      function packColor(c){return[c.id,c.name,c.hex,c.mode,c.word,c.count,c.accuracy];}
      function unpackColor(a){return{id:a[0],name:a[1],hex:a[2],mode:a[3],word:a[4],count:a[5],accuracy:a[6]};}
      function packWork(w){return{id:w.id,name:w.name,source:w.source,size:w.size,board:w.board,fit:w.fit,rotation:w.rotation,removeWhite:w.removeWhite,palette:w.palette.map(c=>[c.id,c.name,c.hex]),baseLen:w.baseLen,base:w.base,actions:w.actions,generation:w.generation};}
      
function snapshot(){
        return {schema:'mosaic-craft-1',screen:state.screen,size:state.size,board:state.board,source:state.source,k:state.k,colorMode:state.colorMode,fit:state.fit,rotation:state.rotation,removeWhite:state.removeWhite,provider:state.provider,query:state.query,palettes:{'5':state.palettes['5'].map(packColor),'2.6':state.palettes['2.6'].map(packColor)},works:state.works.map(packWork),currentWork:state.currentWork,stockFilter:state.stockFilter,stockSelected:state.stockSelected,stockPage:state.stockPage,discoveries:state.discoveries,creationCounter:state.creationCounter};
      }
      function savedLabel(text,error=false){
        const el=$('#mc-save-status');el.textContent=text;el.dataset.error=String(error);if(error)message(text);
        $('#mf-result-saved').textContent=error?'Схема пока не сохранена. Скачай запасную копию.':saving?'Сохраняю схему…':'Сохранено в «Мои работы»';
      }
      function saveState(){
        if(!storeReady||conflicted)return Promise.resolve(false);
        pendingSnapshot=snapshot();
        if(saving)return savePromise;
        saving=true;savedLabel('Сохраняю на устройстве…');
        savePromise=(async()=>{
          try{
            while(pendingSnapshot){const next=pendingSnapshot;pendingSnapshot=null;revision=await MosaicStore.write(next,revision);}
            saveError=null;saving=false;savedLabel('Сохранено на этом устройстве');return true;
          }catch(error){
            pendingSnapshot=null;saveError=error;conflicted=error.name==='ConflictError';saving=false;
            savedLabel(error.name==='QuotaExceededError'?'Память заполнена. Скачай копию, чтобы сохранить крафт.':error.message||'Не удалось сохранить. Скачай запасную копию.',true);
            return false;
          }
        })();
        return savePromise;
      }
      function validateSnapshot(input){
        if(!input||input.schema!=='mosaic-craft-1')throw Error('Это не копия Мозаики.');
        const p=structuredClone(input),validHex=x=>typeof x==='string'&&/^#[0-9a-f]{6}$/i.test(x);
        const short=(v,n)=>typeof v==='string'&&v.length>0&&v.length<=n;
        if(!p.palettes||!Array.isArray(p.works)||p.works.length>500)throw Error('Повреждены данные копии.');
        for(const size of ['5','2.6']){
          const colors=p.palettes[size],ids=new Set();
          if(!Array.isArray(colors)||colors.length>64)throw Error('Повреждена палитра.');
          for(const c of colors){
            if(!Array.isArray(c)||!short(c[0],40)||!short(c[1],48)||!validHex(c[2])||ids.has(c[0]))throw Error('Повреждён цвет палитры.');
            ids.add(c[0]);
            if(c[3]==='words'){if(!Object.hasOwn(words,c[4]))throw Error('Неизвестный запас цвета.');}
            else if(c[3]==='number'){if(!Number.isInteger(c[5])||c[5]<0||c[5]>100000||!['exact','approx'].includes(c[6]))throw Error('Неверное количество деталей.');}
            else throw Error('Неизвестный способ подсчёта.');
          }
        }
        const workIds=new Set();
        for(const w of p.works){
          if(!short(w.id,80)||workIds.has(w.id)||!short(w.name,48)||!boards[w.board]||!['5','2.6'].includes(w.size)||(w.size==='2.6')!==(w.board==='mini'))throw Error('Повреждена схема.');
          workIds.add(w.id);
          if(!Array.isArray(w.palette)||!w.palette.length||w.palette.length>128||!Array.isArray(w.base)||w.base.length!==boards[w.board].total||!Array.isArray(w.actions)||w.actions.length>100000)throw Error('Повреждены детали схемы.');
          for(const c of w.palette)if(!Array.isArray(c)||!short(c[0],40)||!short(c[1],48)||!validHex(c[2]))throw Error('Повреждён цвет схемы.');
          const index=v=>Number.isInteger(v)&&v>=-1&&v<w.palette.length;
          if(!w.base.every(index))throw Error('Неизвестные детали в схеме.');
          for(const a of w.actions){
            if(!Array.isArray(a)||a.length!==3||(a[0]!==0&&a[0]!==1)||!Number.isInteger(a[1]))throw Error('Повреждены правки схемы.');
            if(a[0]===0? a[1]<0||a[1]>=w.base.length||!index(a[2]):a[1]<0||a[1]>=w.palette.length||!index(a[2])||a[2]<0)throw Error('Повреждены правки схемы.');
          }
          if(!short(w.source,80))throw Error('Неизвестная картинка.');
          const g=w.generation;
          if(g&&(!['all','limited'].includes(g.mode)||!Number.isInteger(g.available)||g.available<1||g.available>64||!Number.isInteger(g.limit)||g.limit<1||g.limit>g.available))delete w.generation;
        }
        p.size=p.size==='2.6'?'2.6':'5';p.board=p.size==='2.6'?'mini':p.board==='mini'||!boards[p.board]?'square':p.board;
        p.colorMode=p.colorMode==='limited'?'limited':'all';p.k=Math.max(1,Math.min(64,Number(p.k)||8));p.query=String(p.query||'Собака').slice(0,80);
        p.provider=p.provider==='google'?'google':'yandex';p.fit=p.fit==='cover'?'cover':'contain';p.rotation=[0,90,180,270].includes(p.rotation)?p.rotation:0;p.removeWhite=p.removeWhite!==false;
        p.stockFilter=filterKeys.includes(p.stockFilter)?p.stockFilter:'all';p.stockPage=Math.max(0,Math.floor(Number(p.stockPage)||0));p.stockSelected=String(p.stockSelected||'C01').slice(0,40);
        p.discoveries=Array.isArray(p.discoveries)?[...new Set(p.discoveries.filter(v=>['diamond','craft','creeper','stack'].includes(v)))]:[];
        let counter=Number.isSafeInteger(p.creationCounter)&&p.creationCounter>=0?p.creationCounter:0;
        for(const w of p.works){const match=/^Творение ([1-9][0-9]{0,8})$/.exec(w.name);if(match)counter=Math.max(counter,Number(match[1]));}
        for(const w of [...p.works].reverse())if(/^(?:[a-f0-9]{12,64}|[a-f0-9]{8}-[a-f0-9-]{27,})$/i.test(w.name.replace(/\.[a-z0-9]{2,5}$/i,'')))w.name='Творение '+(++counter);
        p.creationCounter=counter;
        p.screen=['more','home','search','setup','works','stock','result','materials','backup','help'].includes(p.screen)?p.screen:'home';
        delete p.images;
        if(!workIds.has(p.currentWork)){p.currentWork=p.works[0]?.id||null;if(['result','materials'].includes(p.screen))p.screen='home';}
        return p;
      }
      function restore(p){
        const originalNames=p.works?.map(w=>w.name).join('|'),originalCounter=p.creationCounter;
        p=validateSnapshot(p);
        migrationNeeded=originalNames!==p.works.map(w=>w.name).join('|')||originalCounter!==p.creationCounter;
        state={...state,...p,palettes:{'5':p.palettes['5'].map(unpackColor),'2.6':p.palettes['2.6'].map(unpackColor)},works:p.works.map(w=>({...w,palette:w.palette.map(a=>({id:a[0],name:a[1],hex:a[2]}))})),draft:null,stockReturn:null};
        if(!art[state.source]&&!uploads.has(state.source))state.source='dog';
        return true;
      }
      function imageFromBlob(blob){
        return new Promise((resolve,reject)=>{const url=URL.createObjectURL(blob),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Не удалось прочитать картинку.'));};img.src=url;});
      }
      function blobData(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);});}
      function dataBlob(data){
        if(typeof data!=='string'||!/^data:image\/png;base64,[a-z0-9+/=\r\n]+$/i.test(data)||data.length>8000000)throw Error('Повреждена картинка в копии.');
        const bytes=atob(data.slice(data.indexOf(',')+1)),a=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)a[i]=bytes.charCodeAt(i);return new Blob([a],{type:'image/png'});
      }
      function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
      function safeName(name){return String(name).replace(/[<>:"/\\|?*\u0000-\u001f]/g,'').slice(0,60)||'Мозаика';}
      async function storageInfo(){try{const e=await navigator.storage?.estimate();$('#mc-storage-info').textContent=e?'В сундуке занято примерно '+Math.max(1,Math.round(e.usage/1048576))+' МБ.':'';}catch{}}
      let restored=false;

      function message(text){$('#mf-global-message').hidden=!text;$('#mf-global-message').textContent=text||'';$('#mc-message-pop').hidden=!text;}
      function sourceName(id){return art[id]?.name||(uploads.has(id)?'Твоя картинка':'Моя картинка');}
      function nextCreationName(){state.creationCounter++;return 'Творение '+state.creationCounter;}
      function sourceCanvas(id){
        if(sourceCache.has(id))return sourceCache.get(id);
        const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
        if(art[id]){const a=art[id];for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=a.rows[y][x];if(v!=='0'){g.fillStyle=a.colors[v];g.fillRect(x*16,y*16,16,16);}}}else if(uploads.has(id)){const img=uploads.get(id).image;c.width=Math.max(1,Math.round(img.width*Math.min(1,1024/Math.max(img.width,img.height))));c.height=Math.max(1,Math.round(img.height*Math.min(1,1024/Math.max(img.width,img.height))));c.getContext('2d').drawImage(img,0,0,c.width,c.height);}else return null;
        sourceCache.set(id,c);return c;
      }
      function drawSource(canvas,id){const src=sourceCanvas(id),g=canvas.getContext('2d');g.clearRect(0,0,canvas.width,canvas.height);if(!src)return;const scale=Math.min(canvas.width/src.width,canvas.height/src.height)*.9,w=src.width*scale,h=src.height*scale;g.imageSmoothingEnabled=false;g.drawImage(src,(canvas.width-w)/2,(canvas.height-h)/2,w,h);}
      function tone(token){const n=node('span');n.style.color='var('+token+')';n.hidden=true;root.querySelector('.mf-app').append(n);const value=getComputedStyle(n).color;n.remove();return value;}
      function drawDiamondBlock(){const c=$('#mf-logo-art'),g=c.getContext('2d'),s=c.width/16;g.clearRect(0,0,c.width,c.height);const px=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x*s,y*s,w*s,h*s);};px(1,1,14,14,'#215862');px(2,2,12,12,'#4fb8bd');px(2,2,12,2,'#c5f0e9');px(2,4,2,9,'#9fe3df');px(12,4,2,10,'#328b9b');px(4,12,8,2,'#328b9b');px(5,5,6,6,'#7dd6d8');px(6,6,4,3,'#c5f0e9');px(3,10,2,2,'#65c9cb');px(10,3,2,2,'#65c9cb');}
      function award(key,title){if(state.discoveries.includes(key))return false;state.discoveries.push(key);$('#mf-achievement-title').textContent=title;drawSource($('#mf-achievement-art'),'diamond');$('#mf-achievement').hidden=false;saveState();return true;}
      function revealDiamond(){diamondTaps=0;award('diamond','Алмазы!');drawSource($('#mf-diamond-art'),'diamond');$('#mf-diamond-secret').hidden=false;$('#mf-home-secret-hint').textContent='Секрет найден. Алмазный блок откроет его снова.';$('#mf-secret-logo').setAttribute('aria-label','Открыть секретный шаблон алмаза');}
      function processedImage(config){
        const src=sourceCanvas(config.source);if(!src)throw Error('Для этой работы выбери картинку заново.');
        const rotated=document.createElement('canvas'),quarter=((config.rotation||0)/90)%2;rotated.width=quarter?src.height:src.width;rotated.height=quarter?src.width:src.height;const rg=rotated.getContext('2d');rg.translate(rotated.width/2,rotated.height/2);rg.rotate((config.rotation||0)*Math.PI/180);rg.drawImage(src,-src.width/2,-src.height/2);
        const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.imageSmoothingEnabled=!art[config.source];const factor=(config.fit==='cover'?Math.max(256/rotated.width,256/rotated.height):Math.min(256/rotated.width,256/rotated.height))*.9;const w=rotated.width*factor,h=rotated.height*factor;g.drawImage(rotated,(256-w)/2,(256-h)/2,w,h);const image=g.getImageData(0,0,256,256);
        if(config.removeWhite){const a=image.data,seen=new Uint8Array(65536),queue=new Int32Array(65536);let head=0,tail=0;const white=i=>{const p=i*4;return a[p+3]<127||(Math.min(a[p],a[p+1],a[p+2])>225&&Math.max(a[p],a[p+1],a[p+2])-Math.min(a[p],a[p+1],a[p+2])<28);};const push=i=>{if(!seen[i]&&white(i)){seen[i]=1;queue[tail++]=i;}};for(let i=0;i<256;i++){push(i);push(65280+i);push(i*256);push(i*256+255);}while(head<tail){const i=queue[head++];a[i*4+3]=0;const x=i%256,y=(i/256)|0;if(x)push(i-1);if(x<255)push(i+1);if(y)push(i-256);if(y<255)push(i+256);}}
        return image;
      }
      function points(board){
        if(geometryCache.has(board))return geometryCache.get(board);const b=boards[board],p=[];
        if(b.type==='square'){for(let y=0;y<b.n;y++)for(let x=0;x<b.n;x++)p.push({x:x/(b.n-1),y:y/(b.n-1)});}
        else if(b.type==='circle'){p.push({x:.5,y:.5});for(let r=1;r<=14;r++)for(let j=0;j<6*r;j++){const a=-Math.PI/2+2*Math.PI*j/(6*r);p.push({x:.5+r/28*Math.cos(a),y:.5+r/28*Math.sin(a)});}}
        else{for(let r=-14;r<=14;r++)for(let q=-14;q<=14;q++)if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=14)p.push({x:.5+q/28,y:.5+(r+q/2)/28});}
        geometryCache.set(board,p);return p;
      }
      function rgb(hex){return hex.slice(1).match(/../g).map(v=>parseInt(v,16));}
      function lab(r,g,b){const lin=x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;};r=lin(r);g=lin(g);b=lin(b);const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return[.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];}
      const dist=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;
      function quantize(config,all,k){
        if(!all.length)throw Error('Добавь хотя бы один цвет в наличии.');
        const image=processedImage(config),p=points(config.board),pixels=p.map(pt=>{const x=Math.max(0,Math.min(255,Math.round((.5+(pt.x-.5)*(boards[config.board].type==='hex'?Math.sqrt(3)/2:1))*255))),y=Math.max(0,Math.min(255,Math.round(pt.y*255))),i=(y*256+x)*4;if(image.data[i+3]<127)return null;return(image.data[i]<<16)|(image.data[i+1]<<8)|image.data[i+2];});
        const freqs=new Map();for(const key of pixels)if(key!==null)freqs.set(key,(freqs.get(key)||0)+1);
        const keys=[...freqs.keys()],weights=keys.map(k=>freqs.get(k)),labs=keys.map(n=>lab((n>>16)&255,(n>>8)&255,n&255)),paletteLabs=all.map(c=>lab(...rgb(c.hex)));
        const distances=paletteLabs.map(l=>labs.map(x=>dist(x,l))),best=keys.map(()=>Infinity),chosen=[];
        if(k>=all.length)chosen.push(...all.map((_,i)=>i));
        for(let step=0;chosen.length<all.length&&step<Math.min(Math.max(1,k),all.length);step++){let winner=-1,score=Infinity;for(let j=0;j<all.length;j++)if(!chosen.includes(j)){let s=0;for(let i=0;i<keys.length;i++)s+=Math.min(best[i],distances[j][i])*weights[i];if(s<score){score=s;winner=j;}}if(winner<0)break;chosen.push(winner);for(let i=0;i<keys.length;i++)best[i]=Math.min(best[i],distances[winner][i]);if(score===0)break;}
        if(!chosen.length)chosen.push(0);const selected=chosen.map(i=>({...all[i]})),assign=new Map();for(let i=0;i<keys.length;i++){let bi=0,bd=Infinity;for(let j=0;j<chosen.length;j++){const d=distances[chosen[j]][i];if(d<bd){bd=d;bi=j;}}assign.set(keys[i],bi);}return{palette:selected,base:pixels.map(key=>key===null?-1:assign.get(key)),pins:p};
      }
      function buildWork(w){
        let cache=workCache.get(w.id);if(!cache&&w.base){cache={pins:points(w.board),base:w.base};workCache.set(w.id,cache);}if(!cache){const raw=quantize(w,w.palette.slice(0,w.baseLen),w.baseLen);cache={pins:raw.pins,base:raw.base.map(i=>i<0?-1:w.palette.findIndex(c=>c.id===raw.palette[i].id))};workCache.set(w.id,cache);}
        const indices=cache.base.slice();for(const a of w.actions){if(a[0]===0){if(a[1]>=0&&a[1]<indices.length)indices[a[1]]=a[2];}else if(a[0]===1){for(let i=0;i<indices.length;i++)if(indices[i]===a[1])indices[i]=a[2];}}
        const counts=w.palette.map(()=>0);for(const i of indices)if(i>=0&&i<counts.length)counts[i]++;return{pins:cache.pins,indices,counts,total:counts.reduce((a,b)=>a+b,0)};
      }
      function makeWork(source,size,board,name){if(state.works.length>=500)throw Error('В сундуке уже 500 схем. Скачай копию и освободи место.');const config={source,size,board,name:name||sourceName(source),fit:state.fit,rotation:state.rotation,removeWhite:state.removeWhite};const available=state.palettes[size].filter(isAvailable),limit=state.colorMode==='limited'?Math.min(state.k,available.length):available.length;
        const q=quantize(config,available,limit);
        if(q.base.every(i=>i<0))throw Error('Картинка получилась пустой. Попробуй отключить удаление светлого фона или выбери другую картинку.');if(!name&&!art[source])config.name=nextCreationName();const w={...config,id:'W'+Date.now()+Math.random().toString(36).slice(2,6),palette:q.palette.map(c=>({id:c.id,name:c.name,hex:c.hex})),baseLen:q.palette.length,base:q.base,actions:[],generation:{mode:state.colorMode,available:available.length,limit}};workCache.set(w.id,{pins:q.pins,base:q.base});state.works.unshift(w);return w;}
      function drawWork(canvas,w,opts={}){
        const data=buildWork(w),g=canvas.getContext('2d'),size=canvas.width,holeColor=opts.background?'#ffffff':tone('--mf-bead-hole'),pegColor=tone('--mf-peg');g.clearRect(0,0,size,canvas.height);if(opts.background){g.fillStyle='#ffffff';g.fillRect(0,0,size,canvas.height);}const b=boards[w.board],span=size*.86,aspect=b.type==='hex'?Math.sqrt(3)/2:1,pitch=span/((b.n||29)-1),zoom=opts.zoom||1,panX=opts.panX||0,panY=opts.panY||0;g.save();g.translate(size/2+panX*size,size/2+panY*size);g.scale(zoom,zoom);const radius=pitch*.38;
        for(let i=0;i<data.pins.length;i++){const p=data.pins[i],x=(p.x-.5)*span*aspect,y=(p.y-.5)*span,index=data.indices[i];if(index<0){if(opts.pegs){g.fillStyle=pegColor;g.beginPath();g.arc(x,y,Math.max(.7,radius*.4),0,Math.PI*2);g.fill();}continue;}const mapped=opts.replace&&index===opts.replace.from?opts.replace.hex:w.palette[index]?.hex;if(!mapped)continue;g.fillStyle=mapped;g.beginPath();g.arc(x,y,radius,0,Math.PI*2);g.fill();if(opts.holes!==false){g.fillStyle=holeColor;g.beginPath();g.arc(x,y,radius*.28,0,Math.PI*2);g.fill();}}
        g.restore();return data;
      }
      function drawResult(){const w=current();if(!w)return;try{const d=drawWork($('#mf-result-canvas'),w,{pegs:true,zoom:viewport.zoom,panX:viewport.x,panY:viewport.y});$('#mf-result-name').textContent=w.name;$('#mc-work-name').value=w.name;$('#mf-result-info').textContent=(w.size==='5'?'5 мм':'2,6 мм')+' · '+boards[w.board].name+' · '+boards[w.board].total.toLocaleString('ru-RU')+' мест';$('#mf-result-count').textContent=d.total.toLocaleString('ru-RU')+' деталей · '+d.counts.filter(Boolean).length+' цветов';explainColors(w,d);$('#mf-zoom-label').textContent=viewport.zoom+'×';$('#mf-undo').disabled=!w.actions.length;$('#mf-redo').disabled=!(redoCache.get(w.id)||[]).length;}catch(e){message(e.message);go('works',false);}}
      function explainColors(w,data){
        const used=data.counts.filter(Boolean).length,g=w.generation,el=$('#mc-color-explanation');
        if(!g){el.textContent='Использованы цвета, сохранённые в этой схеме. Для нового подбора скрафти картинку заново.';return;}
        if(w.actions.length){el.textContent='Сейчас на схеме '+used+' цветов. При создании было доступно '+g.available+'.';return;}
        if(g.mode==='limited'&&g.limit<g.available){el.textContent='Доступно '+g.available+' цветов. Ты выбрал не больше '+g.limit+'. Для более подробной схемы выбери «Все доступные».';return;}
        el.textContent='Доступно '+g.available+' цветов · использовано '+used+'.'+(used<g.available?' Остальные оттенки не понадобились: выбираем ближайшие к картинке.':'');
      }
      function go(screen,remember=true){
        $('#mf-achievement').hidden=true;$('#mf-diamond-secret').hidden=true;
        if(['result','materials','replace','export'].includes(screen)&&!current())screen='works';state.screen=screen;root.querySelector('.mf-app').dataset.view=screen;
        $$('[data-mf-screen]').forEach(p=>p.hidden=p.dataset.mfScreen!==screen);
        const group=['stock','color','quantity'].includes(screen)?'stock':['works','result','materials','replace','export','backup'].includes(screen)?'works':'home';
        $$('[data-mf-nav]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfNav===group));$('#mf-top-size').textContent=(['result','materials','replace','export'].includes(screen)?current()?.size:state.size)==='2.6'?'2,6 мм':'5 мм';
        try{if(screen==='home')renderHome();if(screen==='search')renderSearch();if(screen==='setup')renderSetup();if(screen==='result'){drawResult();renderPaints();}if(screen==='materials')renderMaterials();if(screen==='replace')renderReplacement();if(screen==='works')renderWorks();if(screen==='stock'){renderStock();if(remember&&palette().some(c=>c.mode==='number'&&c.accuracy==='exact'&&c.count===64))award('stack','64 детали — целый стак!');}if(['color','quantity'].includes(screen))renderDraft();if(screen==='export')renderExport();}catch(e){message(e.message);}
        layout.show(screen);if(screen==='backup')storageInfo();if(remember)saveState();
      }
      function chooseSource(id){state.source=id;state.rotation=0;state.fit='contain';viewport={zoom:1,x:0,y:0};message('');go('setup');}
      function renderExamples(container,ids){container.replaceChildren();for(const id of ids){const b=button('', 'mf-example',()=>chooseSource(id)),c=node('canvas');c.width=c.height=128;c.setAttribute('aria-hidden','true');drawSource(c,id);b.append(c,node('span','',art[id].name));container.append(b);}}
      function renderHome(){$('#mc-onboarding').hidden=palette().length>0;drawSource($('#mf-home-art'),'creeper');renderExamples($('#mf-home-examples'),['creeper','pickaxe','dog']);if(state.discoveries.includes('diamond'))$('#mf-home-secret-hint').textContent='Секрет найден. Алмазный блок откроет его снова.';}
      function renderSearch(){ $('#mf-search').value=state.query;$$('[data-mf-provider]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfProvider===state.provider));}
      function renderSetup(){
        if(state.size==='2.6')state.board='mini';else if(state.board==='mini')state.board='square';const prepared=processedImage(state),thumb=document.createElement('canvas');thumb.width=thumb.height=256;thumb.getContext('2d').putImageData(prepared,0,0);const preview=$('#mf-source-preview').getContext('2d');preview.clearRect(0,0,128,128);preview.imageSmoothingEnabled=false;preview.drawImage(thumb,0,0,128,128);$('#mf-source-name').textContent=sourceName(state.source);$$('[data-mf-size]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfSize===state.size));$$('[data-mf-fit]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfFit===state.fit));$('#mf-white-bg').checked=state.removeWhite;
        const box=$('#mf-boards');box.replaceChildren();box.className=state.size==='5'?'mf-board-grid':'';
        for(const key of state.size==='5'?['square','circle','hex']:['mini']){const b=boards[key],shape=node('span','mf-shape'+(b.type==='circle'?' mf-circle':b.type==='hex'?' mf-hex':''));shape.setAttribute('aria-hidden','true');if(key==='mini'){const row=node('div','mf-one-board');row.append(shape,node('strong','','Квадрат 104 × 104'));box.append(row);}else{const item=button('', 'mf-board',()=>{state.board=key;renderSetup();saveState();});item.setAttribute('aria-label',b.name);item.setAttribute('aria-pressed',state.board===key);const name=node('span');if(key==='hex'){name.append(document.createTextNode('Шести-'),node('br'),document.createTextNode('угольник'));}else name.textContent=b.name;item.append(shape,name);box.append(item);}}
        $('#mf-board-description').textContent=boards[state.board].description;const active=availablePalette();$('#mf-setup-colors').replaceChildren();for(const c of active.slice(0,8)){const chip=node('span','mf-chip');chip.style.setProperty('--mf-pigment',c.hex);chip.setAttribute('aria-label',c.name);$('#mf-setup-colors').append(chip);}$('#mf-palette-count').textContent=active.length?'Доступно '+active.length+' из '+palette().length+' цветов':'Добавь свои цвета в наличии';
        $('#mf-color-limit').max=Math.max(1,active.length);$('#mf-color-limit').value=Math.min(state.k,Math.max(1,active.length));$('#mf-color-limit-label').textContent=$('#mf-color-limit').value;
        $$('[data-mc-color-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mcColorMode===state.colorMode));$('#mf-settings').hidden=state.colorMode!=='limited';
        $('#mc-color-choice-hint').textContent=state.colorMode==='all'?'Учтём все цвета в наличии. На схеме останутся подходящие к картинке.':'Можно сделать схему проще, уменьшив число цветов.';
        $('#mf-generate').disabled=!active.length;
      }
      function openWork(w){state.currentWork=w.id;viewport={zoom:1,x:0,y:0};tool='view';paint=0;message('');go('result');}
      function renderWorks(){const grid=$('#mf-works-grid');grid.replaceChildren();for(const w of state.works){const b=button('', 'mf-work',()=>openWork(w)),c=node('canvas');c.width=c.height=256;c.setAttribute('aria-hidden','true');let text='';try{const d=drawWork(c,w);text=d.total.toLocaleString('ru-RU')+' деталей';}catch{text='Выбери фото заново';}b.append(c,node('strong','',w.name),node('span','',(w.size==='5'?'5 мм':'2,6 мм')+' · '+boards[w.board].name),node('span','',text));grid.append(b);}if(!state.works.length)grid.append(node('p','mf-small','Здесь появятся твои схемы.'));}
      function renderPaints(){const w=current(),box=$('#mf-paints');box.replaceChildren();if(!w)return;w.palette.forEach((c,i)=>{const b=button('', '',()=>{paint=i;tool='paint';renderPaints();syncTools();});b.setAttribute('aria-label',c.name);b.setAttribute('aria-pressed',paint===i&&tool==='paint');const sw=node('span');sw.style.setProperty('--mf-pigment',c.hex);b.append(sw);box.append(b);});syncTools();}
      function syncTools(){$$('[data-mf-tool]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfTool===tool));}
      function needMessage(c,n){if(!c)return'Запас неизвестен. Нужно '+n+' деталей.';if(c.mode==='words')return c.word==='none'?'Этот цвет закончился.':'Есть: '+words[c.word]+'. Проверь, хватит ли '+n+' деталей.';if(c.accuracy==='approx')return c.count<n?'Нужно '+n+', есть ≈ '+c.count+'. Возможна нехватка.':'Нужно '+n+', есть ≈ '+c.count+'. По оценке должно хватить.';return c.count<n?'Нужно '+n+', есть '+c.count+'. Не хватает '+(n-c.count)+'.':'Нужно '+n+', есть '+c.count+'. Деталей хватает.';}
      function renderMaterials(){const w=current(),d=buildWork(w);$('#mf-materials-total').textContent='Всего '+d.total.toLocaleString('ru-RU')+' деталей';const box=$('#mf-materials-list');box.replaceChildren();d.counts.forEach((n,i)=>{if(!n)return;const c=w.palette[i],actual=state.palettes[w.size].find(x=>x.id===c.id),row=node('div','mf-material'),desc=node('div');desc.append(node('strong','',c.name+' · '+n+' шт.'),node('p','',actual?'Есть: '+stockLabel(actual):'Запас неизвестен'));if(!actual||!isAvailable(actual)||(actual.mode==='number'&&actual.count<n))desc.append(node('p','mf-error',needMessage(actual,n)));const replace=button('Заменить','',()=>{replacement={index:i,candidate:null};go('replace');});row.append(bead(c.hex),desc,replace);box.append(row);});}
      function replacementCandidates(){const w=current(),target=w.palette[replacement.index];if(!target)return[];const targetLab=lab(...rgb(target.hex));return state.palettes[w.size].filter(c=>isAvailable(c)&&c.id!==target.id).sort((a,b)=>dist(targetLab,lab(...rgb(a.hex)))-dist(targetLab,lab(...rgb(b.hex)))).slice(0,3);}
      function renderReplacement(){const w=current(),d=buildWork(w),target=w.palette[replacement.index];if(!target){go('materials');return;}const n=d.counts[replacement.index],actual=state.palettes[w.size].find(c=>c.id===target.id);$('#mf-replace-title').textContent=actual&&!isAvailable(actual)?target.name+' закончился':'Замени цвет';$('#mf-replace-info').textContent='В схеме '+n+' деталей этого цвета.';const candidates=replacementCandidates();if(!candidates.some(c=>c.id===replacement.candidate))replacement.candidate=candidates[0]?.id||null;const chosen=candidates.find(c=>c.id===replacement.candidate),box=$('#mf-replace-candidates');box.replaceChildren();drawWork($('#mf-replace-before'),w,{background:true});drawWork($('#mf-replace-after'),w,chosen?{background:true,replace:{from:replacement.index,hex:chosen.hex}}:{background:true});for(const c of candidates){const b=button('', 'mf-candidate',()=>{replacement.candidate=c.id;renderReplacement();}),desc=node('div');desc.append(node('strong','',c.name),node('p','',stockLabel(c)));b.setAttribute('aria-pressed',c.id===replacement.candidate);b.append(bead(c.hex),desc);box.append(b);}const old=chosen?w.palette.findIndex(c=>c.id===chosen.id):-1,needed=n+(old>=0?d.counts[old]:0);$('#mf-replace-warning').textContent=chosen?needMessage(chosen,needed):'Добавь цвет в наличии в разделе «Мои цвета».';$('#mf-replace-confirm').disabled=!chosen;}
      function filteredStock(){return palette().filter(c=>state.stockFilter==='all'||(state.stockFilter==='number'?c.mode==='number':state.stockFilter==='none'?!isAvailable(c):c.mode==='words'&&c.word===state.stockFilter));}
      function level(c,max){const meter=node('span','mf-level');meter.setAttribute('aria-hidden','true');if(c.mode==='number'){meter.classList.add('mf-number-level');const fill=node('i');fill.style.width=Math.min(100,c.count/max*100)+'%';meter.append(fill);}else{const n={many:3,medium:2,few:1,none:0}[c.word]||0;for(let i=0;i<3;i++)meter.append(node('i',i<n?'mf-full':''));}return meter;}
      function renderStock(){const pageSize=layout.stockSize(),a=filteredStock();state.stockPage=Math.min(Math.max(0,state.stockPage),Math.max(0,Math.ceil(a.length/pageSize)-1));const page=a.slice(state.stockPage*pageSize,state.stockPage*pageSize+pageSize);let selected=page.find(c=>c.id===state.stockSelected)||page[0];if(selected)state.stockSelected=selected.id;$('#mf-stock-summary').hidden=!selected;$('#mf-stock-empty').hidden=!!a.length;$('#mf-stock-empty').textContent=palette().length?'В этом отборе пока нет цветов.':'Пока нет цветов. Нажми + и подбери цвет своей детали.';if(selected){$('#mf-stock-bead').style.setProperty('--mf-pigment',selected.hex);$('#mf-stock-name').textContent=selected.name;$('#mf-stock-amount').textContent=stockLabel(selected);}$('#mf-stock-count').textContent=state.stockFilter==='all'?palette().length+' цветов':a.length+' из '+palette().length;$$('[data-mf-stock-size]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfStockSize===state.size));$$('[data-mf-filter]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfFilter===state.stockFilter));const grid=$('#mf-stock-grid');grid.replaceChildren();const max=Math.max(1,...palette().filter(c=>c.mode==='number').map(c=>c.count));for(const c of page){const b=button('', 'mf-stock-tile'+(isAvailable(c)?'':' mf-empty'),()=>{state.stockSelected=c.id;renderStock();saveState();});b.setAttribute('aria-label',c.name+': '+stockLabel(c));b.setAttribute('aria-pressed',c.id===state.stockSelected);b.append(bead(c.hex),node('small','',compactStock(c)),level(c,max));grid.append(b);}const pages=Math.max(1,Math.ceil(a.length/pageSize));$('#mf-stock-paging').hidden=pages<=1;$('#mf-stock-page').textContent=(state.stockPage+1)+' из '+pages;$('#mf-stock-prev').disabled=state.stockPage===0;$('#mf-stock-next').disabled=state.stockPage===pages-1;$('#mf-stock-size-toggle').textContent=state.size==='5'?'5 мм':'2,6 мм';}
      function hexOf(d){if(d.original&&!d.changed)return d.original;const s=d.s/100,l=d.l/100,a=s*Math.min(l,1-l),f=n=>{const k=(n+d.h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};return'#'+f(0)+f(8)+f(4);}
      function hslOf(hex){const v=rgb(hex).map(n=>n/255),max=Math.max(...v),min=Math.min(...v),d=max-min,l=(max+min)/2;let h=0,s=d===0?0:d/(1-Math.abs(2*l-1));if(d){if(max===v[0])h=60*(((v[1]-v[2])/d)%6);else if(max===v[1])h=60*((v[2]-v[0])/d+2);else h=60*((v[0]-v[1])/d+4);}return{h:Math.round((h+360)%360),s:Math.round(s*100),l:Math.round(l*100)};}
      function colorName(d){if(d.s<8)return d.l>88?'Белый':d.l<22?'Чёрный':'Серый';const h=d.h;if(h<18||h>=345)return'Красный';if(h<45)return d.l<45?'Коричневый':'Оранжевый';if(h<70)return'Жёлтый';if(h<160)return'Зелёный';if(h<195)return'Бирюзовый';if(h<255)return'Синий';if(h<295)return'Фиолетовый';return'Розовый';}
      function newColor(){message('');state.draft={h:205,s:70,l:65,mode:'words',word:null,count:'',accuracy:'exact',id:null,name:null,changed:true};$('#mf-quantity-error').textContent='';go('color');}
      function editColor(c){message('');state.draft={...hslOf(c.hex),mode:c.mode,word:c.word,count:c.count??'',accuracy:c.accuracy,id:c.id,name:c.name,original:c.hex,changed:false};$('#mf-quantity-error').textContent='';go('quantity');}
      function renderDraft(){if(!state.draft){newColor();return;}const d=state.draft,hex=hexOf(d);$('#mf-color-bead').style.setProperty('--mf-pigment',hex);$('#mf-quantity-bead').style.setProperty('--mf-pigment',hex);$('#mf-hue').value=d.h;$('#mf-light').value=d.l;$('#mf-saturation').value=d.s;$('#mf-light').style.setProperty('--mf-track',`linear-gradient(90deg,#101014,hsl(${d.h} ${d.s}% 50%),#fff)`);$('#mf-saturation').style.setProperty('--mf-track',`linear-gradient(90deg,hsl(${d.h} 0% ${d.l}%),hsl(${d.h} 100% ${d.l}%))`);$('#mf-quantity-name').textContent=d.name&&!d.changed?d.name:colorName(d);$$('[data-mf-quantity-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfQuantityMode===d.mode));$$('[data-mf-word]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfWord===d.word));$$('[data-mf-accuracy]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfAccuracy===d.accuracy));$('#mf-quantity-words').hidden=d.mode!=='words';$('#mf-quantity-number').hidden=d.mode!=='number';$('#mf-stock-number').value=d.count;}
      function renderExport(){const w=current(),d=buildWork(w),canvas=$('#mf-export-canvas');const image=document.createElement('canvas');image.width=image.height=960;drawWork(image,w,{background:true,holes:exportMode==='pattern',pegs:exportMode==='pattern'});const rows=d.counts.map((count,i)=>({count,c:w.palette[i]})).filter(r=>r.count);canvas.width=960;canvas.height=exportMode==='pattern'?1060+rows.length*42:960;const g=canvas.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,canvas.width,canvas.height);g.drawImage(image,0,0);if(exportMode==='pattern'){g.fillStyle='#20364a';g.font='bold 30px Arial';g.fillText(w.name+' · '+(w.size==='5'?'5 мм':'2,6 мм'),35,1005);g.font='24px Arial';rows.forEach((r,i)=>{g.fillStyle=r.c.hex;g.fillRect(35,1030+i*42,25,25);g.fillStyle='#20364a';g.fillText(r.c.name+' — '+r.count+' шт.',75,1052+i*42);});}$$('[data-mf-export]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mfExport===exportMode));}
      const layout=MosaicLayout.mount(root,{stockChanged:()=>{if(state.screen==='stock')renderStock();}});
      $('#mc-more').addEventListener('click',()=>go('more'));
      $('#mc-message-close').addEventListener('click',()=>message(''));
      $$('[data-mf-go]').forEach(b=>b.addEventListener('click',()=>{message('');go(b.dataset.mfGo);}));
      $$('[data-mf-nav]').forEach(b=>b.addEventListener('click',()=>{message('');state.stockReturn=null;go(b.dataset.mfNav);}));
      $('#mf-upload-home').addEventListener('click',()=>$('#mf-photo-file').click());$('#mf-search-upload').addEventListener('click',()=>$('#mf-photo-file').click());
      $('#mf-photo-file').addEventListener('change',async()=>{
        const file=$('#mf-photo-file').files[0];if(!file)return;
        const input=$('#mf-photo-file');input.value='';
        if(!['image/jpeg','image/png','image/webp'].includes(file.type)){message('Выбери JPEG, PNG или WebP.');return;}
        if(file.size>20*1024*1024){message('Картинка слишком большая. Выбери файл до 20 МБ.');return;}
        try{
          const original=await imageFromBlob(file);if(original.width*original.height>32000000)throw Error('Выбери картинку меньшего размера.');
          const c=document.createElement('canvas'),scale=Math.min(1,1024/Math.max(original.width,original.height));c.width=Math.max(1,Math.round(original.width*scale));c.height=Math.max(1,Math.round(original.height*scale));c.getContext('2d').drawImage(original,0,0,c.width,c.height);
          const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('Не удалось подготовить картинку.');
          const id='upload:'+crypto.randomUUID(),name=file.name.replace(/\.[^.]+$/,'').slice(0,48)||'Моя картинка',image=await imageFromBlob(blob);
          await MosaicStore.putImage({id,name,blob});uploads.set(id,{image,name});chooseSource(id);
        }catch(error){message(error.message||'Не удалось сохранить картинку.');}
      });
      $('#mf-search').addEventListener('input',()=>{state.query=$('#mf-search').value;});$('#mf-search').addEventListener('change',saveState);
      $$('[data-mf-provider]').forEach(b=>b.addEventListener('click',()=>{state.provider=b.dataset.mfProvider;renderSearch();saveState();}));
      $('#mf-search-button').addEventListener('click',()=>{
        state.query=$('#mf-search').value.trim()||'Собака';
        if(!navigator.onLine){message('Для поиска нужен интернет. Можно выбрать готовый рецепт или своё фото.');return;}
        const query=state.query+' простой цветной рисунок один персонаж целиком на белом фоне без текста';
        const url=state.provider==='google'?'https://www.google.com/search?tbm=isch&safe=active&q='+encodeURIComponent(query):'https://yandex.ru/images/search?family=2&text='+encodeURIComponent(query);
        const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.click();
        $('#mf-search-hint').textContent='Сохрани картинку из поиска. Вернись сюда и нажми «Выбрать скачанную картинку».';
        $('#mf-search-results').hidden=false;renderExamples($('#mf-search-examples'),['creeper','pickaxe','dog']);saveState();
      });
      function toggle(buttonId,panelId){const b=$(buttonId),p=$(panelId);p.hidden=!p.hidden;b.setAttribute('aria-expanded',!p.hidden);layout.refresh(p.hidden?b:p);}
      $('#mf-prepare-toggle').addEventListener('click',()=>toggle('#mf-prepare-toggle','#mf-image-options'));$('#mf-shade-toggle').addEventListener('click',()=>toggle('#mf-shade-toggle','#mf-shade-options'));$('#mf-edit-toggle').addEventListener('click',()=>toggle('#mf-edit-toggle','#mf-edit-tools'));
      $$('[data-mf-fit]').forEach(b=>b.addEventListener('click',()=>{state.fit=b.dataset.mfFit;renderSetup();saveState();}));$('#mf-rotate').addEventListener('click',()=>{state.rotation=(state.rotation+90)%360;renderSetup();saveState();});$('#mf-white-bg').addEventListener('change',()=>{state.removeWhite=$('#mf-white-bg').checked;renderSetup();saveState();});
      $$('[data-mf-size]').forEach(b=>b.addEventListener('click',()=>{state.size=b.dataset.mfSize;state.board=state.size==='2.6'?'mini':'square';$('#mf-top-size').textContent=state.size==='5'?'5 мм':'2,6 мм';renderSetup();saveState();}));
      $$('[data-mc-color-mode]').forEach(b=>b.addEventListener('click',()=>{state.colorMode=b.dataset.mcColorMode;renderSetup();saveState();}));
      $('#mf-color-limit').addEventListener('input',()=>{state.k=+$('#mf-color-limit').value;$('#mf-color-limit-label').textContent=state.k;});$('#mf-color-limit').addEventListener('change',saveState);
      $('#mf-setup-palette').addEventListener('click',()=>{state.stockReturn='setup';state.stockFilter='all';go('stock');});$('#mf-stock-back').addEventListener('click',()=>{const destination=state.stockReturn||'home';state.stockReturn=null;go(destination);});$('#mf-stock-size-toggle').addEventListener('click',()=>toggle('#mf-stock-size-toggle','#mf-stock-size-options'));
      $('#mf-generate').addEventListener('click',async()=>{const b=$('#mf-generate');b.disabled=true;b.textContent='Крафтим…';$('#mf-generate-error').textContent='';try{await new Promise(resolve=>setTimeout(resolve,35));const w=makeWork(state.source,state.size,state.board);openWork(w);award('craft','Макс, да будет крафт!');saveState();}catch(e){$('#mf-generate-error').textContent=e.message;}finally{b.textContent='Скрафтить схему';b.disabled=!availablePalette().length;}});
      $('#mf-open-materials').addEventListener('click',()=>go('materials'));$('#mf-export').addEventListener('click',()=>{exportMode='picture';go('export');});$$('[data-mf-export]').forEach(b=>b.addEventListener('click',()=>{exportMode=b.dataset.mfExport;renderExport();}));
      $('#mf-zoom-in').addEventListener('click',()=>{viewport.zoom=Math.min(8,viewport.zoom*2);drawResult();});$('#mf-zoom-out').addEventListener('click',()=>{viewport.zoom=Math.max(1,viewport.zoom/2);if(viewport.zoom===1){viewport.x=0;viewport.y=0;}drawResult();});
      $$('[data-mf-tool]').forEach(b=>b.addEventListener('click',()=>{tool=b.dataset.mfTool;renderPaints();}));
      let gesture=null;const resultCanvas=$('#mf-result-canvas');
      resultCanvas.addEventListener('pointerdown',e=>{gesture={x:e.clientX,y:e.clientY,panX:viewport.x,panY:viewport.y,moved:false};try{resultCanvas.setPointerCapture(e.pointerId);}catch{};});
      resultCanvas.addEventListener('pointermove',e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.abs(dx)+Math.abs(dy)>6)gesture.moved=true;if(tool==='view'&&gesture.moved&&viewport.zoom>1){const r=resultCanvas.getBoundingClientRect();viewport.x=Math.max(-3,Math.min(3,gesture.panX+dx/r.width));viewport.y=Math.max(-3,Math.min(3,gesture.panY+dy/r.height));drawResult();}});
      resultCanvas.addEventListener('pointercancel',()=>{gesture=null;});
      resultCanvas.addEventListener('pointerup',e=>{const g=gesture;gesture=null;if(!g||g.moved||tool==='view')return;const w=current();if(!w)return;const d=buildWork(w),r=resultCanvas.getBoundingClientRect(),cx=(e.clientX-r.left)/r.width*resultCanvas.width,cy=(e.clientY-r.top)/r.height*resultCanvas.height,size=resultCanvas.width,span=size*.86,b=boards[w.board],aspect=b.type==='hex'?Math.sqrt(3)/2:1;let best=-1,distance=Infinity;for(let i=0;i<d.pins.length;i++){const p=d.pins[i],x=size/2+viewport.x*size+(p.x-.5)*span*aspect*viewport.zoom,y=size/2+viewport.y*size+(p.y-.5)*span*viewport.zoom,delta=(x-cx)**2+(y-cy)**2;if(delta<distance){distance=delta;best=i;}}if(best<0||distance>(span/((b.n||29)-1)*viewport.zoom*.6)**2)return;w.actions.push([0,best,tool==='erase'?-1:paint]);redoCache.set(w.id,[]);drawResult();saveState();});
      $('#mf-undo').addEventListener('click',()=>{const w=current();if(w?.actions.length){const a=redoCache.get(w.id)||[];a.push(w.actions.pop());redoCache.set(w.id,a);drawResult();saveState();}});$('#mf-redo').addEventListener('click',()=>{const w=current(),a=redoCache.get(w?.id)||[];if(w&&a.length){w.actions.push(a.pop());drawResult();saveState();}});
      $('#mf-replace-confirm').addEventListener('click',()=>{const w=current(),c=replacementCandidates().find(c=>c.id===replacement.candidate);if(!w||!c)return;let to=w.palette.findIndex(p=>p.id===c.id&&p.hex===c.hex);if(to<0){to=w.palette.length;w.palette.push({id:c.id,name:c.name,hex:c.hex});}w.actions.push([1,replacement.index,to]);redoCache.set(w.id,[]);go('materials');message('Цвет заменён. Расход пересчитан.');saveState();});
      $$('[data-mf-stock-size]').forEach(b=>b.addEventListener('click',()=>{state.size=b.dataset.mfStockSize;$('#mf-stock-size-options').hidden=true;$('#mf-stock-size-toggle').setAttribute('aria-expanded','false');state.stockSelected='C01';state.stockFilter='all';state.stockPage=0;$('#mf-top-size').textContent=state.size==='5'?'5 мм':'2,6 мм';renderStock();saveState();}));
      $$('[data-mf-filter]').forEach(b=>b.addEventListener('click',()=>{const next=b.dataset.mfFilter;state.stockFilter=state.stockFilter===next?'all':next;state.stockPage=0;state.stockSelected=filteredStock()[0]?.id||state.stockSelected;renderStock();saveState();}));
      $('#mf-stock-prev').addEventListener('click',()=>{state.stockPage--;state.stockSelected=filteredStock()[state.stockPage*layout.stockSize()]?.id||state.stockSelected;renderStock();saveState();});$('#mf-stock-next').addEventListener('click',()=>{state.stockPage++;state.stockSelected=filteredStock()[state.stockPage*layout.stockSize()]?.id||state.stockSelected;renderStock();saveState();});
      $('#mf-add-color').addEventListener('click',newColor);$('#mf-stock-edit').addEventListener('click',()=>{const c=palette().find(c=>c.id===state.stockSelected);if(c)editColor(c);});
      $('#mf-hue').addEventListener('input',()=>{const d=state.draft;d.changed=true;d.h=+$('#mf-hue').value;if(d.s<8){d.s=70;d.l=65;}renderDraft();});$('#mf-light').addEventListener('input',()=>{state.draft.changed=true;state.draft.l=+$('#mf-light').value;renderDraft();});$('#mf-saturation').addEventListener('input',()=>{state.draft.changed=true;state.draft.s=+$('#mf-saturation').value;renderDraft();});
      $$('[data-mf-neutral]').forEach(b=>b.addEventListener('click',()=>{state.draft.changed=true;state.draft.s=0;state.draft.l={white:94,gray:55,black:12}[b.dataset.mfNeutral];renderDraft();}));$('#mf-color-next').addEventListener('click',()=>go('quantity'));
      $$('[data-mf-quantity-mode]').forEach(b=>b.addEventListener('click',()=>{state.draft.mode=b.dataset.mfQuantityMode;$('#mf-quantity-error').textContent='';renderDraft();}));$$('[data-mf-word]').forEach(b=>b.addEventListener('click',()=>{state.draft.word=b.dataset.mfWord;$('#mf-quantity-error').textContent='';renderDraft();}));$$('[data-mf-accuracy]').forEach(b=>b.addEventListener('click',()=>{state.draft.accuracy=b.dataset.mfAccuracy;renderDraft();}));$('#mf-stock-number').addEventListener('input',()=>{state.draft.count=$('#mf-stock-number').value;});
      $('#mf-save-color').addEventListener('click',async()=>{const d=state.draft,n=Number(d.count);if(d.mode==='words'&&!d.word){$('#mf-quantity-error').textContent='Выбери: много, средне, мало или нету.';return;}if(d.mode==='number'&&(d.count===''||!Number.isInteger(n)||n<0||n>100000)){$('#mf-quantity-error').textContent='Введи целое число от 0 до 100 000.';return;}if(!d.id&&palette().length>=64){$('#mf-quantity-error').textContent='В палитре уже 64 цвета.';return;}const c={id:d.id||'C'+String(Math.max(0,...palette().map(c=>Number(c.id.slice(1))||0))+1).padStart(2,'0'),name:d.name&&!d.changed?d.name:colorName(d),hex:hexOf(d),mode:d.mode,word:d.mode==='words'?d.word:null,count:d.mode==='number'?n:null,accuracy:d.accuracy};if(d.id){const i=palette().findIndex(c=>c.id===d.id);palette()[i]=c;}else palette().push(c);state.stockSelected=c.id;state.stockFilter='all';state.stockPage=Math.floor(palette().findIndex(p=>p.id===c.id)/layout.stockSize());go('stock');if(await saveState())message('Цвет и запас сохранены.');});
      $('#mf-backup-open').addEventListener('click',()=>go('backup'));
      
$('#mf-backup-create').addEventListener('click',async()=>{
        const b=$('#mf-backup-create');b.disabled=true;$('#mf-backup-status').textContent='Собираю запасной сундук…';
        try{
          await savePromise;const data=snapshot(),records=await MosaicStore.images();
          data.images=await Promise.all(records.map(async r=>({id:r.id,name:r.name,data:await blobData(r.blob)})));
          download(new Blob([JSON.stringify(data)],{type:'application/json'}),'Мозаика-копия-'+new Date().toISOString().slice(0,10)+'.json');
          $('#mf-backup-status').textContent='Копия готова. Сохрани скачанный файл в надёжном месте.';
        }catch(error){$('#mf-backup-status').textContent=error.message||'Не удалось сделать копию.';}finally{b.disabled=false;}
      });
      $('#mf-backup-import').addEventListener('click',()=>$('#mf-backup-file').click());
      $('#mf-backup-file').addEventListener('change',async()=>{
        const file=$('#mf-backup-file').files[0];$('#mf-backup-file').value='';if(!file)return;
        const status=$('#mf-backup-status');status.textContent='Проверяю запасной сундук…';
        try{
          if(file.size>64*1024*1024)throw Error('Копия слишком большая: максимум 64 МБ.');
          const parsed=JSON.parse(await file.text()),copy=validateSnapshot(parsed),rows=parsed.images;
          if(!Array.isArray(rows)||rows.length>1000)throw Error('В копии отсутствуют картинки.');
          const ids=new Set(),records=[],decoded=new Map();
          for(const r of rows){
            if(typeof r.id!=='string'||!r.id.startsWith('upload:')||r.id.length>80||ids.has(r.id)||typeof r.name!=='string'||r.name.length>48)throw Error('Повреждён список картинок.');
            ids.add(r.id);const blob=dataBlob(r.data),image=await imageFromBlob(blob);
            if(image.width>1024||image.height>1024)throw Error('Картинка в копии слишком большая.');
            records.push({id:r.id,name:r.name,blob});decoded.set(r.id,{name:r.name,image});
          }
          status.replaceChildren(node('span','','В копии '+copy.works.length+' схем. Она заменит текущие цвета, запасы и работы. Сначала скачай копию текущего сундука. '),button('Восстановить эту копию','mf-secondary',async()=>{
            try{
              await savePromise;if(conflicted)throw Error('Сначала обнови страницу: данные изменились в другой вкладке.');
              const stored={...copy};delete stored.images;
              revision=await MosaicStore.write(stored,revision,records);
              uploads.clear();for(const [id,value]of decoded)uploads.set(id,value);
              sourceCache.clear();workCache.clear();redoCache.clear();restore(stored);saveError=null;state.screen='works';go('works',false);savedLabel('Копия восстановлена и сохранена на устройстве');
              status.textContent='';if(migrationNeeded)await saveState();
            }catch(error){status.textContent=error.message||'Не удалось восстановить копию. Текущие данные сохранены.';}
          }));
        }catch(error){status.textContent=error instanceof SyntaxError?'Не удалось прочитать файл копии.':error.message||'Не удалось прочитать копию.';}
      });
      
      
      $('#mf-secret-logo').addEventListener('click',()=>{if(state.discoveries.includes('diamond')){revealDiamond();return;}diamondTaps++;$('#mf-creeper-quote').textContent=diamondTaps===1?'Тук… В блоке что-то спрятано.':'Тук-тук… Кажется, это алмаз!';if(diamondTaps>=3)revealDiamond();});
      $('#mf-creeper-pet').addEventListener('click',()=>{creeperTaps++;const lines=['С-с-с… Макс, пора крафтить!','Пиксель к пикселю — имба!','Тс-с-с… Крафт в процессе.','Крипер одобряет, Макс!'];$('#mf-creeper-quote').textContent=lines[(creeperTaps-1)%lines.length];if(creeperTaps===3)award('creeper','Тише крипера!');});
      $('#mf-achievement-close').addEventListener('click',()=>{$('#mf-achievement').hidden=true;});
      $('#mf-secret-close').addEventListener('click',()=>{$('#mf-diamond-secret').hidden=true;$('#mf-achievement').hidden=true;});
      $('#mf-start-diamond').addEventListener('click',()=>chooseSource('diamond'));
      drawDiamondBlock();
      new MutationObserver(()=>{if(state.screen==='result')drawResult();if(state.screen==='works')renderWorks();}).observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
      
      root.inert=true;
      try{
        const [saved,records]=await Promise.all([MosaicStore.readState(),MosaicStore.images()]);
        revision=saved.revision;
        for(const r of records){try{uploads.set(r.id,{name:r.name,image:await imageFromBlob(r.blob)});}catch{}}
        if(saved.data)restored=restore(saved.data);storeReady=true;savedLabel(restored?'Твой сундук открыт на этом устройстве':'Добавь свои цвета — они сохранятся на устройстве');if(migrationNeeded)await saveState();
      }catch(error){saveError=error;savedLabel('Не удалось открыть память браузера. '+error.message,true);}
      finally{root.inert=false;go(state.screen,false);}
      
      
      $('#mc-download-image').addEventListener('click',()=>{
        const w=current();if(!w)return;$('#mf-export-canvas').toBlob(blob=>{if(blob)download(blob,safeName(w.name)+(exportMode==='pattern'?' — схема':'')+'.png');else message('Не удалось скачать картинку.');},'image/png');
      });
      $('#mc-work-settings-toggle').addEventListener('click',()=>toggle('#mc-work-settings-toggle','#mc-work-settings'));
      $('#mc-rename-work').addEventListener('click',()=>{const w=current(),name=$('#mc-work-name').value.trim();if(!w||!name)return;w.name=name.slice(0,48);drawResult();saveState();});
      $('#mc-delete-work').addEventListener('click',()=>{const w=current();if(!w||!confirm('Удалить схему «'+w.name+'»? Она останется только в ранее скачанной запасной копии.'))return;state.works=state.works.filter(x=>x.id!==w.id);workCache.delete(w.id);redoCache.delete(w.id);state.currentWork=null;go('works');});
      $('#mc-persist').addEventListener('click',async()=>{
        try{const persisted=await navigator.storage?.persist?.();$('#mf-backup-status').textContent=persisted?'Браузер защитил сундук от автоматической очистки. Ручная очистка браузера всё равно удалит данные — сохраняй запасную копию.':'Браузер не включил дополнительную защиту. Данные сохраняются, но запасная копия особенно пригодится.';}catch{$('#mf-backup-status').textContent='Дополнительная защита недоступна. Скачай запасную копию.';}
      });
      let installPrompt=null;
      window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#mc-install').hidden=false;});
      window.addEventListener('appinstalled',()=>{$('#mc-install').hidden=true;installPrompt=null;});
      $('#mc-install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#mc-install').hidden=true;});
      window.addEventListener('beforeunload',e=>{if(saving||saveError){e.preventDefault();e.returnValue='';}});
      MosaicUpdates.start({save:saveState,hasDraft:()=>!!state.draft&&['color','quantity'].includes(state.screen)});

      })();
  