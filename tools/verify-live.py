"""Verify the published HTTPS app and every offline asset from the runner."""
from pathlib import Path
import hashlib
import time
from urllib.request import Request, urlopen

root=Path(__file__).resolve().parent.parent/'dist'
origin='https://ruslan-igray.github.io/mosaic-craft/'
names=['index.html','app.js','storage.js','updates.js','version.js','version.json','app.css','sw.js','manifest.webmanifest',
       'icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png']
last=None
for attempt in range(12):
    try:
        for name in names:
            request=Request(origin+('' if name=='index.html' else name),headers={'User-Agent':'MosaicCraft-release-check'})
            with urlopen(request,timeout=15) as response:
                data=response.read()
                assert response.status==200,(name,response.status)
            assert hashlib.sha256(data).digest()==hashlib.sha256((root/name).read_bytes()).digest(),name+' differs from the tested release'
        print('HTTPS 200: app and all offline/update assets match the tested release.')
        break
    except Exception as error:
        last=error
        print('Waiting for Pages CDN:',type(error).__name__,str(error),flush=True)
        time.sleep(5)
else:
    raise RuntimeError('Published release verification failed') from last
