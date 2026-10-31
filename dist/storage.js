/* All personal data lives in this browser. There are no server requests here. */
'use strict';
globalThis.MosaicStore = (() => {
  let opening;
  function open() {
    if (!opening) opening = new Promise((resolve, reject) => {
      if (!globalThis.indexedDB) return reject(new Error('Память браузера недоступна.'));
      const request = indexedDB.open('mosaic-craft', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('settings');
        request.result.createObjectStore('images', {keyPath: 'id'});
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Закрой другие вкладки приложения и обнови страницу.'));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };
    });
    return opening;
  }
  async function readState() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readonly');
      const request = tx.objectStore('settings').get('state');
      tx.oncomplete = () => resolve(request.result || {revision: 0, data: null});
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Чтение прервано.'));
    });
  }
  async function images() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readonly');
      const request = tx.objectStore('images').getAll();
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Чтение картинок прервано.'));
    });
  }
  async function putImage(record) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('images', 'readwrite');
      tx.objectStore('images').put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Картинка не сохранена.'));
    });
  }
  async function write(data, expectedRevision, replaceImages) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const names = replaceImages ? ['settings', 'images'] : ['settings'];
      const tx = db.transaction(names, 'readwrite');
      const settings = tx.objectStore('settings');
      let conflict = false;
      const nextRevision = expectedRevision + 1;
      const request = settings.get('state');
      request.onsuccess = () => {
        if ((request.result?.revision || 0) !== expectedRevision) {
          conflict = true;
          tx.abort();
          return;
        }
        settings.put({revision: nextRevision, data}, 'state');
        if (replaceImages) {
          const store = tx.objectStore('images');
          store.clear();
          for (const image of replaceImages) store.put(image);
        }
      };
      tx.oncomplete = () => resolve(nextRevision);
      tx.onerror = () => reject(tx.error || new Error('Не удалось сохранить.'));
      tx.onabort = () => {
        const error = conflict
          ? new Error('Запасы изменились в другой вкладке. Скачай копию и обнови страницу.')
          : tx.error || new Error('Сохранение прервано.');
        if (conflict) error.name = 'ConflictError';
        reject(error);
      };
    });
  }
  return {open, readState, images, putImage, write};
})();
