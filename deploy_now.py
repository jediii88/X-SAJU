import base64, json, shutil
from urllib.request import Request, urlopen
from urllib.parse import quote

shutil.copy('/home/node/.openclaw/workspace/X-SAJU_MASTER.html',
            '/home/node/.openclaw/workspace/sajux_deploy/index.html')

TOKEN = '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'
REPO = 'jediii88/X-SAJU'

def get_sha(path):
    req = Request(f'https://api.github.com/repos/{REPO}/contents/{quote(path)}',
        headers={'Authorization':f'token {TOKEN}','Accept':'application/vnd.github.v3+json'})
    try:
        with urlopen(req) as r: return json.loads(r.read()).get('sha')
    except: return None

with open('/home/node/.openclaw/workspace/sajux_deploy/index.html','rb') as f:
    content = base64.b64encode(f.read()).decode()
sha = get_sha('index.html')
payload = {'message':'feat: 대운그래프, 인생시기별풀이, 카테고리분석(건강/재물/직업/애정)','content':content,'branch':'main'}
if sha: payload['sha'] = sha
req = Request(f'https://api.github.com/repos/{REPO}/contents/index.html',
    data=json.dumps(payload).encode(), method='PUT',
    headers={'Authorization':f'token {TOKEN}','Content-Type':'application/json'})
with urlopen(req) as r: json.loads(r.read())
print('배포 완료')
