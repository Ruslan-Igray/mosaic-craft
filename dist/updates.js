/* A server check and a downloaded update are different states. Offline is never "latest". */
'use strict';
globalThis.MosaicUpdates = (() => {
  async function start({save,hasDraft}) {
    const release=globalThis.MOSAIC_RELEASE;
    const label=document.getElementById('mc-app-version');
    const status=document.getElementById('mc-update-status');
    const checkButton=document.getElementById('mc-check-updates');
    const panel=document.getElementById('mc-update-panel');
    const applyButton=document.getElementById('mc-apply-update');
    const updateMessage=document.getElementById('mc-update-message');
    const notice=document.getElementById('mc-update-notice');
    label.textContent='Версия '+release.version;
    let registration=null,latest=null,checking=false,applying=false,reloading=false,lastCheck=0;
    let manualCheck=false;
    const text=(value,force=false)=>{status.textContent=value;if(manualCheck||force)notice.hidden=false;};
    const newer=meta=>meta.version!==release.version;
    function offer() {
      if(latest&&!newer(latest)){panel.hidden=true;return;}
      if(!registration?.waiting&&!latest)return;
      if(!registration?.waiting&&!newer(latest))return;
      panel.hidden=false;
      updateMessage.textContent='Доступно обновление мастерской'+(latest?' '+latest.version:'')+'. Твой сундук сохранится.';
      applyButton.textContent='Обновить мастерскую';
      applyButton.disabled=false;
    }
    function watch(worker) {
      if(!worker)return;
      const changed=()=>{
        if(worker.state==='installed'&&registration.waiting){if(latest&&!newer(latest)){panel.hidden=true;return;}text('Обновление готово. Нажми «Обновить мастерскую».');offer();}
        if(worker.state==='redundant'&&!registration.waiting)text('Не удалось скачать обновление. Попробуй проверить ещё раз.');
      };
      worker.addEventListener('statechange',changed);changed();
    }
    function settled() {
      if(!registration?.installing)return Promise.resolve();
      return new Promise(resolve=>{
        const worker=registration.installing;
        const done=()=>{if(['installed','redundant','activated'].includes(worker.state)){clearTimeout(timer);worker.removeEventListener('statechange',done);resolve();}};
        const timer=setTimeout(()=>{worker.removeEventListener('statechange',done);resolve();},18000);
        worker.addEventListener('statechange',done);done();
      });
    }
    async function check(manual=false) {
      if(checking)return;
      manualCheck=manual;
      checking=true;checkButton.disabled=true;checkButton.textContent='Проверяю…';text('Проверяю обновления…');lastCheck=Date.now();
      try {
        if(!navigator.onLine)throw Error('offline');
        const url=new URL('./version.json',location.href);url.searchParams.set('check',String(Date.now()));
        const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)});
        if(!response.ok)throw Error('server');
        const meta=await response.json();
        if(!meta||!/^\d+\.\d+\.\d+$/.test(meta.version)||!/^[a-f0-9]{10}$/.test(meta.build))throw Error('version');
        latest=meta;
        if(registration){await registration.update();watch(registration.installing);await settled();}
        if(!newer(meta)){panel.hidden=true;text('Установлена последняя версия');}
        else if(registration?.waiting){offer();text('Обновление '+meta.version+' готово к установке.');}
        else if(newer(meta)){offer();text(registration?.installing?'Загружаю обновление '+meta.version+'…':'Доступна версия '+meta.version+'. Нажми «Обновить мастерскую».');}
        else if(registration?.installing){text('Завершаю подготовку версии '+release.version+'…');}
        else {panel.hidden=true;text('Установлена последняя версия');}
      } catch(error) {
        text(!navigator.onLine?'Сейчас без интернета. Проверить последнюю версию не удалось.':'Не удалось проверить обновления. Попробуй ещё раз с интернетом.');
        if(registration?.waiting)offer();
      } finally {checking=false;checkButton.disabled=false;checkButton.textContent='Проверить обновления';manualCheck=false;}
    }
    applyButton.addEventListener('click',async()=>{
      if(applying)return;
      if(hasDraft()){text('Сначала сохрани выбранный цвет или вернись к своим цветам. Затем обнови мастерскую.',true);return;}
      applying=true;applyButton.disabled=true;applyButton.textContent='Сохраняю сундук…';
      if(!await save()){text('Обновление отложено: сначала сохрани сундук или скачай запасную копию.',true);applying=false;applyButton.disabled=false;applyButton.textContent='Обновить мастерскую';return;}
      applyButton.textContent='Обновляю…';
      if(registration?.waiting){
        registration.waiting.postMessage({type:'ACTIVATE'});
        setTimeout(()=>{if(!reloading){applying=false;applyButton.disabled=false;applyButton.textContent='Обновить мастерскую';text('Обновление ещё готовится. Попробуй нажать ещё раз.');}},15000);
      }else {reloading=true;location.reload();}
    });
    checkButton.addEventListener('click',()=>check(true));
    document.getElementById('mc-dismiss-update-notice').addEventListener('click',()=>{notice.hidden=true;});
    document.getElementById('mc-postpone-update').addEventListener('click',()=>{panel.hidden=true;});
    if('serviceWorker'in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        if(applying&&!reloading){reloading=true;location.reload();}
      });
      try{
        registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
        registration.addEventListener('updatefound',()=>watch(registration.installing));
        watch(registration.installing);
        if(registration.waiting)offer();
      }catch{text('Автоматическое обновление пока недоступно. Проверить новую версию можно кнопкой ниже.');}
    }
    await check();
    window.addEventListener('online',()=>check(false));
    window.addEventListener('offline',()=>{text('Сейчас без интернета. Проверить последнюю версию не удалось.');});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-lastCheck>300000)check();});
  }
  return {start};
})();
