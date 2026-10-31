"""Reconstruct the project's bundled PNG icons without extra dependencies."""
import base64
import json
from pathlib import Path

root=Path(__file__).resolve().parent.parent
assets=json.loads((root/'tools'/'icon-assets.json').read_text(encoding='utf-8'))
target=root/'dist'/'icons'
target.mkdir(parents=True,exist_ok=True)
for name in ('icon-192.png','icon-512.png','maskable-512.png'):
    data=base64.b64decode(assets[name],validate=True)
    if not data.startswith(b'\x89PNG\r\n\x1a\n'):
        raise ValueError('Invalid bundled icon')
    (target/name).write_bytes(data)
print('Three local PNG icons ready.')
