import base64, json, shutil, os
from urllib.request import Request, urlopen
from urllib.parse import quote

TOKEN = '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'
REPO = 'jediii88/X-SAJU'

# 배포 구조:
#   index.html        → sajux_deploy/index.html  (랜딩 페이지)
#   report/index.html → X-SAJU_MASTER.html 복사본
#   admin/index.html  → 관리자 페이지

# 1. X-SAJU_MASTER.html → report/index.html 동기화
os.makedirs('/home/node/.openclaw/workspace/sajux_deploy/report', exist_ok=True)
shutil.copy('/home/node/.openclaw/workspace/X-SAJU_MASTER.html',
            '/home/node/.openclaw/workspace/sajux_deploy/report/index.html')

# zodiac_en 경로 수정 (루트 기준 → report/ 기준 상대경로)
with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'r', encoding='utf-8') as f:
    rc = f.read()
# zodiac_en/ → ../zodiac_en/ (이미 된 게 아닐 때만)
if "'zodiac_en/" in rc:
    rc = rc.replace("'zodiac_en/", "'../zodiac_en/")
if '"zodiac_en/' in rc:
    rc = rc.replace('"zodiac_en/', '"../zodiac_en/')
with open('/home/node/.openclaw/workspace/sajux_deploy/report/index.html', 'w', encoding='utf-8') as f:
    f.write(rc)

def get_sha(path):
    req = Request(f'https://api.github.com/repos/{REPO}/contents/{quote(path)}',
        headers={'Authorization':f'token {TOKEN}','Accept':'application/vnd.github.v3+json'})
    try:
        with urlopen(req) as r: return json.loads(r.read()).get('sha')
    except: return None

def upload(local_path, gh_path, msg='deploy'):
    with open(local_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode()
    sha = get_sha(gh_path)
    payload = {'message': msg, 'content': content, 'branch': 'main'}
    if sha: payload['sha'] = sha
    req = Request(
        f'https://api.github.com/repos/{REPO}/contents/{quote(gh_path)}',
        data=json.dumps(payload).encode(), method='PUT',
        headers={'Authorization': f'token {TOKEN}', 'Content-Type': 'application/json'})
    with urlopen(req) as r:
        json.loads(r.read())
    print(f'  ✅ {gh_path}')

print('배포 시작...')
deploy_dir = '/home/node/.openclaw/workspace/sajux_deploy'

# 업로드할 파일 목록 (로컬경로, GitHub경로)
files = [
    (f'{deploy_dir}/index.html',         'index.html'),
    (f'{deploy_dir}/report/index.html',  'report/index.html'),
    (f'{deploy_dir}/report/view.html',   'report/view.html'),
    (f'{deploy_dir}/admin/index.html',   'admin/index.html'),
    (f'{deploy_dir}/couple/index.html',  'couple/index.html'),
]

# JS 파일도 report/ 에 동기화
for js in ['app.js', 'klc.min.js', 'lunar.js']:
    src = f'{deploy_dir}/{js}'
    if os.path.exists(src):
        shutil.copy(src, f'{deploy_dir}/report/{js}')
        files.append((f'{deploy_dir}/report/{js}', f'report/{js}'))

for local, gh in files:
    if os.path.exists(local):
        upload(local, gh)
    else:
        print(f'  ⚠ 파일 없음: {local}')

print('배포 완료')
