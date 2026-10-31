/* Fit complete controls into screen-sized pages; never shrink the whole interface. */
'use strict';
globalThis.MosaicLayout=(()=>{
  function mount(root,{stockChanged}){
    const app=root.querySelector('.mf-app'),screens=[...root.querySelectorAll('[data-mf-screen]')];
    const main=document.createElement('main');main.className='mc-main';main.setAttribute('aria-label','Мастерская');
    app.insertBefore(main,screens[0]);screens.forEach(s=>main.append(s));
    const footer=document.createElement('footer');footer.className='mc-app-footer';
    footer.append(root.querySelector('.mc-version-row'),root.querySelector('#mc-save-status'));app.append(footer);
    const more=document.createElement('section');more.dataset.mfScreen='more';more.hidden=true;
    const title=document.createElement('h2');title.textContent='Меню мастерской';
    const back=document.createElement('button');back.type='button';back.className='mf-plain';back.dataset.mfGo='home';back.textContent='К верстаку';
    more.append(back,title,root.querySelector('.mc-footer'));main.append(more);screens.push(more);
    const flatIds=new Set(['mf-image-options','mc-color-options','mf-settings','mf-edit-tools','mf-paints','mc-work-settings','mf-materials-list','mf-replace-candidates','mf-works-grid','mf-shade-options','mf-quantity-number','mf-search-results','mf-backup-status']);
    const pages=new Map();let active='home',queued=false,preferred=null,lastStockSize=0;
    const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
    const hide=(n,value)=>{if(n.hidden!==value)n.hidden=value;};
    function groupLabels(container){
      for(const child of [...container.children]){
        if(flatIds.has(child.id))groupLabels(child);
        if(((child.tagName==='LABEL'&&!child.classList.contains('mf-check'))||child.tagName==='H3')&&child.nextElementSibling&&!child.closest('.mc-unit')){
          const next=child.nextElementSibling,unit=el('div','mc-unit');container.insertBefore(unit,child);unit.append(child,next);
          if(next.id==='mf-boards'&&unit.nextElementSibling?.id==='mf-board-description')unit.append(unit.nextElementSibling);
        }
      }
    }
    for(const screen of screens){
      if(['stock','color','draw'].includes(screen.dataset.mfScreen))continue;
      const heading=el('header','mc-screen-heading'),h2=screen.querySelector(':scope>h2');
      const backButton=[...screen.children].find(n=>n.tagName==='BUTTON'&&n.dataset.mfGo&&n.classList.contains('mf-plain'));
      if(backButton){const label=backButton.textContent;backButton.setAttribute('aria-label',label);backButton.textContent='‹';backButton.classList.add('mc-back');heading.append(backButton);}
      if(h2)heading.append(h2);
      const body=el('div','mc-screen-body');
      [...screen.childNodes].forEach(n=>body.append(n));
      const pager=el('nav','mc-screen-pager');pager.dataset.mcPager='';pager.setAttribute('aria-label','Страницы экрана');
      const previous=el('button','','‹ Назад'),counter=el('span','',''),next=el('button','','Дальше ›');
      previous.type=next.type='button';previous.dataset.mcPrevious='';next.dataset.mcNext='';
      previous.setAttribute('aria-label','Предыдущая страница');next.setAttribute('aria-label','Следующая страница');counter.setAttribute('aria-live','polite');
      pager.append(previous,counter,next);screen.replaceChildren(heading,body,pager);
      groupLabels(body);
      pages.set(screen.dataset.mfScreen,{screen,body,pager,previous,counter,next,index:0,chunks:[]});
      previous.addEventListener('click',()=>select(screen.dataset.mfScreen,-1));
      next.addEventListener('click',()=>select(screen.dataset.mfScreen,1));
    }
    function makeRows(container,selector,columns,cls){
      const items=[...container.children].filter(n=>n.matches(selector));if(!items.length)return;
      for(let i=0;i<items.length;i+=columns){const row=el('div',cls);container.insertBefore(row,items[i]);items.slice(i,i+columns).forEach(n=>row.append(n));}
    }
    function units(body){
      makeRows(root.querySelector('#mf-works-grid'),'button',2,'mc-work-row');
      makeRows(root.querySelector('#mf-paints'),'button',Math.max(3,Math.floor(body.clientWidth/50)),'mc-paint-row');
      const result=[];
      function walk(container){
        for(const child of container.children){
          if(child.hidden)continue;
          const flat=flatIds.has(child.id)&&child.children.length>0;
          child.classList.toggle('mc-flat',flat);
          if(flat)walk(child);else result.push(child);
        }
      }
      walk(body);return result;
    }
    function select(name,direction){const p=pages.get(name);if(!p)return;p.index=Math.max(0,Math.min(p.chunks.length-1,p.index+direction));paint(p);}
    function paint(p){
      const visible=new Set(p.chunks[p.index]||[]);
      p.chunks.flat().forEach(n=>n.classList.toggle('mc-off-page',!visible.has(n)));
      hide(p.pager,p.chunks.length<=1);
      p.previous.disabled=p.index===0;p.next.disabled=p.index>=p.chunks.length-1;
      const text=(p.index+1)+' / '+Math.max(1,p.chunks.length);if(p.counter.textContent!==text)p.counter.textContent=text;
      p.screen.dataset.page=String(p.index+1);p.screen.dataset.pages=String(Math.max(1,p.chunks.length));
    }
    function stockSize(){
      const screen=root.querySelector('[data-mf-screen="stock"]'),height=screen.clientHeight||main.clientHeight;
      const columns=Math.max(4,Math.min(8,Math.floor((screen.clientWidth||main.clientWidth)/74)));
      root.style.setProperty('--mc-stock-columns',String(columns));
      let fixed=44+36;
      for(const selector of ['.mf-stock-heading','#mf-stock-summary','.mf-filters']){
        const n=screen.querySelector(selector);if(!n.hidden)fixed+=n.getBoundingClientRect().height;
      }
      return columns*Math.max(1,Math.min(6,Math.floor((height-fixed)/58)));
    }
    function measure(){
      queued=false;
      const height=Math.round(window.visualViewport?.height||innerHeight);
      root.style.setProperty('--mc-viewport-height',height+'px');
      root.classList.toggle('mc-keyboard',document.activeElement?.matches('input[type="text"],input[type="number"],textarea')&&(height<500||height<innerHeight*.8));
      if(active==='stock'){
        const size=stockSize();if(size!==lastStockSize){lastStockSize=size;stockChanged();}
        return;
      }
      if(active==='draw'){
        const board=root.querySelector('.mc-draw-board'),canvas=root.querySelector('#mc-draw-canvas'),side=Math.floor(Math.min(board.clientWidth,board.clientHeight));
        canvas.style.width=side+'px';canvas.style.height=side+'px';
        return;
      }
      const p=pages.get(active);if(!p)return;
      const anchor=preferred||(p.chunks[p.index]||[])[0];preferred=null;
      hide(p.pager,false);
      p.body.querySelectorAll('.mc-off-page').forEach(n=>n.classList.remove('mc-off-page'));
      const capacity=p.body.clientHeight,width=p.body.clientWidth;
      root.style.setProperty('--mc-body-height',capacity+'px');
      root.style.setProperty('--mc-art-size',Math.max(44,Math.min(width-8,capacity*.64,400))+'px');
      root.style.setProperty('--mc-thumb-size',Math.max(18,Math.min(84,capacity-86))+'px');
      let list=units(p.body);
      for(const n of list)if(n.classList.contains('mc-unit')&&!n.classList.contains('mc-color-picker')&&n.getBoundingClientRect().height>capacity&&n.children.length>1){n.replaceWith(...n.childNodes);}
      list=units(p.body).filter(n=>n.getBoundingClientRect().height>0);
      const chunks=[];let chunk=[],used=0,oversized=[];
      for(const n of list){
        const height=Math.ceil(n.getBoundingClientRect().height);
        if(height>capacity+1)oversized.push(n.id||n.className||n.tagName);
        if(chunk.length&&used+8+height>capacity){chunks.push(chunk);chunk=[];used=0;}
        chunk.push(n);used+=height+(chunk.length>1?8:0);
      }
      if(chunk.length)chunks.push(chunk);p.chunks=chunks.length?chunks:[[]];
      const found=anchor?p.chunks.findIndex(a=>a.some(n=>n===anchor||n.contains(anchor)||anchor.contains?.(n))):-1;
      p.index=found>=0?found:Math.min(p.index,p.chunks.length-1);p.screen.dataset.overflow=oversized.join('|');paint(p);
    }
    function refresh(target){if(target)preferred=target;if(!queued){queued=true;requestAnimationFrame(measure);}}
    function show(name){if(active!==name){active=name;const p=pages.get(name);if(p)p.index=0;preferred=null;}refresh();}
    new MutationObserver(records=>{
      if(records.every(r=>r.target.closest?.('[data-mc-pager],.mc-version-row,.mc-app-footer')))return;
      refresh();
    }).observe(main,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
    window.addEventListener('resize',()=>refresh());
    window.visualViewport?.addEventListener('resize',()=>refresh());
    document.addEventListener('focusin',()=>refresh());document.addEventListener('focusout',()=>refresh());
    refresh();
    return {show,refresh,stockSize};
  }
  return {mount};
})();
