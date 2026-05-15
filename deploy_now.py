import base64, json, shutil, os, sys, re, time
from urllib.request import Request, urlopen
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = 'jediii88/X-SAJU'
TOKEN_FILE = os.path.join(ROOT, '.github_token')

# 정본: report/index.html, report/view.html, report/saju.html
# 배포물 sajux_deploy/report/* 및 루트 X-SAJU_MASTER.html(구 스크립트·file://용)은 여기서만 생성한다.


def bump_build_version():
    """정본 HTML의 캐시 버전값을 배포 시점으로 갱신한다(화면 변화 없음)."""
    build_v = str(int(time.time()))
    targets = [
        os.path.join(ROOT, 'report', 'index.html'),
        os.path.join(ROOT, 'report', 'view.html'),
        os.path.join(ROOT, 'report', 'saju.html'),
    ]

    for path in targets:
        if not os.path.isfile(path):
            continue
        with open(path, 'r', encoding='utf-8') as f:
            src = f.read()

        out = src
        # <meta name="version" content="...">
        out = re.sub(r'(<meta\s+name="version"\s+content=")\d+(">)', rf'\g<1>{build_v}\2', out)
        # <meta name="sajux-build" content="...">
        out = re.sub(r'(<meta\s+name="sajux-build"\s+content=")\d+(">)', rf'\g<1>{build_v}\2', out)
        # var v='...';  (cache-buster 스크립트)
        out = re.sub(r"(var\s+v=')\d+(')", rf"\g<1>{build_v}\2", out)
        # report-core.js (tools/sync_report_core.py)
        out = re.sub(
            r'(<script\s+src="report-core\.js\?v=)\d+(")',
            rf"\g<1>{build_v}\2",
            out,
        )

        if out != src:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(out)
            print(f'  [version] {os.path.relpath(path, ROOT)} -> {build_v}')


def sync_report_bundle():
    """report/ 만세력 HTML → sajux_deploy/report/ (Pages 업로드 직전 복사본)."""
    report_dir = os.path.join(ROOT, 'report')
    out_dir = os.path.join(ROOT, 'sajux_deploy', 'report')
    os.makedirs(out_dir, exist_ok=True)

    for name in ('index.html', 'view.html', 'saju.html', 'report-core.js', 'report-print.css'):
        src = os.path.join(report_dir, name)
        dst = os.path.join(out_dir, name)
        if not os.path.isfile(src):
            raise SystemExit(f'report/{name} 이 없습니다.')
        shutil.copy(src, dst)
        print(f'  [sync] report/{name} -> sajux_deploy/report/{name}')

    comp_src = os.path.join(report_dir, 'compatibility')
    comp_dst = os.path.join(out_dir, 'compatibility')
    if os.path.isdir(comp_src):
        if os.path.exists(comp_dst):
            shutil.rmtree(comp_dst)
        shutil.copytree(comp_src, comp_dst)
        print('  [sync] report/compatibility/ -> sajux_deploy/report/compatibility/')

    assets_src = os.path.join(report_dir, 'assets')
    assets_dst = os.path.join(out_dir, 'assets')
    if os.path.isdir(assets_src):
        os.makedirs(assets_dst, exist_ok=True)
        for fn in os.listdir(assets_src):
            if fn.startswith('.'):
                continue
            s = os.path.join(assets_src, fn)
            if os.path.isfile(s):
                shutil.copy2(s, os.path.join(assets_dst, fn))
        print('  [sync] report/assets/ -> sajux_deploy/report/assets/')

    idx_path = os.path.join(out_dir, 'index.html')
    with open(idx_path, 'r', encoding='utf-8') as f:
        rc = f.read()
    if "'zodiac_en/" in rc:
        rc = rc.replace("'zodiac_en/", "'../zodiac_en/")
    if '"zodiac_en/' in rc:
        rc = rc.replace('"zodiac_en/', '"../zodiac_en/')
    with open(idx_path, 'w', encoding='utf-8') as f:
        f.write(rc)


def refresh_root_master_html():
    """report/index.html → X-SAJU_MASTER.html (루트 상대경로 zodiac_en/). 레거시 도구·로컬 열람용."""
    src = os.path.join(ROOT, 'report', 'index.html')
    dst = os.path.join(ROOT, 'X-SAJU_MASTER.html')
    with open(src, 'r', encoding='utf-8') as f:
        rc = f.read()
    rc = rc.replace("'../zodiac_en/", "'zodiac_en/")
    rc = rc.replace('"../zodiac_en/', '"zodiac_en/')
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(rc)
    print('  [sync] report/index.html -> X-SAJU_MASTER.html')


def get_sha(path, token):
    req = Request(
        f'https://api.github.com/repos/{REPO}/contents/{quote(path)}',
        headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'})
    try:
        with urlopen(req) as r:
            return json.loads(r.read()).get('sha')
    except Exception:
        return None


def upload(local_path, gh_path, token, msg='deploy'):
    with open(local_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode()
    sha = get_sha(gh_path, token)
    payload = {'message': msg, 'content': content, 'branch': 'main'}
    if sha:
        payload['sha'] = sha
    req = Request(
        f'https://api.github.com/repos/{REPO}/contents/{quote(gh_path)}',
        data=json.dumps(payload).encode(), method='PUT',
        headers={'Authorization': f'token {token}', 'Content-Type': 'application/json'})
    with urlopen(req) as r:
        json.loads(r.read())
    print(f'  ✅ {gh_path}')


def read_cached_token():
    if not os.path.isfile(TOKEN_FILE):
        return ''
    try:
        with open(TOKEN_FILE, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception:
        return ''


def cache_token(token):
    if not token:
        return
    try:
        with open(TOKEN_FILE, 'w', encoding='utf-8') as f:
            f.write(token.strip() + '\n')
        try:
            os.chmod(TOKEN_FILE, 0o600)
        except Exception:
            # Windows 등 chmod 미지원 환경은 무시
            pass
    except Exception:
        pass


def main():
    bump_build_version()
    sync_report_bundle()
    refresh_root_master_html()

    if '--sync-only' in sys.argv:
        print('로컬 동기화만 완료 (토큰 불필요). 커밋 후 푸시하거나 다시 실행해 업로드하세요.')
        return

    token = os.environ.get('GITHUB_TOKEN', '').strip()
    if token:
        cache_token(token)
    else:
        token = read_cached_token()

    if not token:
        raise SystemExit(
            'GitHub 토큰이 없습니다.\n'
            '한 번만 설정하면 이후 자동 재사용됩니다:\n'
            '  export GITHUB_TOKEN=ghp_xxxxxxxx && python3 deploy_now.py\n'
            f'  (자동 저장 위치: {TOKEN_FILE})\n'
            '로컬만 맞출 때: python3 deploy_now.py --sync-only'
        )

    deploy_dir = os.path.join(ROOT, 'sajux_deploy')
    files = [
        (f'{deploy_dir}/index.html', 'index.html'),
        (f'{deploy_dir}/report/index.html', 'report/index.html'),
        (f'{deploy_dir}/report/view.html', 'report/view.html'),
        (f'{deploy_dir}/report/saju.html', 'report/saju.html'),
        (f'{deploy_dir}/report/report-core.js', 'report/report-core.js'),
        (f'{deploy_dir}/report/report-print.css', 'report/report-print.css'),
        (f'{deploy_dir}/report/compatibility/index.html', 'report/compatibility/index.html'),
        (f'{deploy_dir}/admin/index.html', 'admin/index.html'),
        (f'{deploy_dir}/couple/index.html', 'couple/index.html'),
    ]

    for js in ['app.js', 'klc.min.js', 'lunar.js']:
        src = f'{deploy_dir}/{js}'
        if os.path.exists(src):
            shutil.copy(src, f'{deploy_dir}/report/{js}')
            files.append((f'{deploy_dir}/report/{js}', f'report/{js}'))

    assets_dir = os.path.join(deploy_dir, 'report', 'assets')
    if os.path.isdir(assets_dir):
        for fn in sorted(os.listdir(assets_dir)):
            if fn.startswith('.'):
                continue
            local = os.path.join(assets_dir, fn)
            if os.path.isfile(local):
                files.append((local, f'report/assets/{fn}'))

    print('배포 시작...')
    for local, gh in files:
        if os.path.exists(local):
            upload(local, gh, token)
        else:
            print(f'  ⚠ 파일 없음: {local}')
    print('배포 완료')


if __name__ == '__main__':
    main()
