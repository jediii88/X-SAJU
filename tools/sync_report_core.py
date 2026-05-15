#!/usr/bin/env python3
"""
report/view.html 기준 대형 인라인 스크립트 3구간 → report/report-core.js
report/view.html, report/saju.html, report/index.html 에서 제거 후
lunar.js·klc.min.js 직후에 <script src="report-core.js?v=<meta version>"> 삽입.

python3 tools/sync_report_core.py
python3 tools/sync_report_core.py --dry-run
"""
from __future__ import annotations

import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORT = os.path.join(ROOT, "report")
CORE = os.path.join(REPORT, "report-core.js")
BANNER = (
    "/* report-core.js — 리포트·만세력 공통 엔진 (tools/sync_report_core.py, view.html 기준 추출) */\n"
    "/* 로드 순서: lunar.js → klc.min.js → 본 파일 */\n"
)


def read_meta_version(html: str) -> str:
    m = re.search(r'<meta\s+name="version"\s+content="(\d+)"', html)
    if m:
        return m.group(1)
    m2 = re.search(r"var\s+v='(\d+)'", html)
    if m2:
        return m2.group(1)
    return "1"


def find_view_indices(lines: list[str]) -> tuple[int, int, int, int, int, int]:
    """
    반환 (모두 0-based):
    s0  첫 대형 블록 <script> (신살 DB)
    e0  둘째 블록 <script> 줄 (= 첫 블록 제거 후 이어 붙일 경계)
    s1  둘째 블록 <script> (리포트 엔진) — 보통 e0와 동일
    e1  둘째 블록 닫은 직후 (head 엔진 끝 </script> 다음 줄)
    s2  세 번째 대형 블록 <script> (HELP_DATA ~ runAnalysis 등, klc 이후)
    e2  세 번째 블록 닫은 직후 (자동 실행 스크립트 앞)
    """
    s0 = None
    for i, ln in enumerate(lines):
        if ln.strip() == "<script>" and i + 3 < len(lines) and "신살 상세 설명 DB" in lines[i + 3]:
            s0 = i
            break
    if s0 is None:
        raise RuntimeError("첫 대형 script(신살 DB) 없음")

    e0 = None
    for j in range(s0 + 1, len(lines)):
        if lines[j].strip() == "</script>":
            if j + 1 < len(lines) and lines[j + 1].strip() == "<script>":
                if j + 3 < len(lines) and "X-SAJU DEEP REPORT GENERATOR" in lines[j + 3]:
                    e0 = j + 1
                    break
    if e0 is None:
        raise RuntimeError("리포트 엔진 블록 시작 위치 없음")

    s1 = e0
    e1 = None
    for k in range(s1, len(lines)):
        if lines[k].strip() != "</script>":
            continue
        tail = "".join(lines[k + 1 : min(k + 16, len(lines))])
        if (
            "URL 파라미터 자동 파싱" in tail
            or "</head>" in tail
            or re.search(r"<body[\s>]", tail)
        ):
            e1 = k + 1
            break
    if e1 is None:
        raise RuntimeError("리포트 엔진 블록 끝(</head> 또는 URL 파싱 앞) 없음")

    s2 = None
    for m in range(e1, len(lines)):
        if lines[m].strip() == "<script>":
            chunk = "".join(lines[m : min(m + 8, len(lines))])
            if "HELP_DATA" in chunk:
                s2 = m
                break
    if s2 is None:
        raise RuntimeError("HELP_DATA 포함 대형 script 없음")

    e2 = None
    for n in range(s2 + 1, len(lines)):
        if lines[n].strip() == "</script>":
            tail = "".join(lines[n + 1 : min(n + 12, len(lines))])
            if ("자동 실행" in tail) or ("runAnalysis" in tail and "window.load" in tail):
                e2 = n + 1
                break
    if e2 is None:
        raise RuntimeError("세 번째 블록 끝(자동 실행 스크립트 앞) 없음")

    return s0, e0, s1, e1, s2, e2


def build_core_js(lines: list[str], s0: int, e0: int, s1: int, e1: int, s2: int, e2: int) -> str:
    """태그 안쪽만 추출 (닫는 </script> 제외)."""
    inner1 = lines[s0 + 1 : e0 - 1]
    inner2 = lines[s1 + 1 : e1 - 1]
    inner3 = lines[s2 + 1 : e2 - 1]
    body = "".join(inner1 + inner2 + inner3)
    if "function generateDeepReport" not in body and "generateDeepReport" not in body:
        raise RuntimeError("추출 실패: generateDeepReport 없음")
    if "runAnalysis" not in body:
        raise RuntimeError("추출 실패: runAnalysis 없음")
    return BANNER + body


def strip_and_inject_v2(lines: list[str], s0: int, e0: int, s1: int, e1: int, s2: int, e2: int, v: str) -> str:
    """블록1 [s0,e0), 블록2 [e0,e1), 블록3 [s2,e2) 제거. 유지 구간 [e1,s2) 안의 klc 줄 직후에 report-core.js."""
    script_line = f'    <script src="report-core.js?v={v}"></script>\n'

    middle = list(lines[e1:s2])
    middle = [ln for ln in middle if "report-core.js" not in ln]
    klc_i = None
    for i, ln in enumerate(middle):
        if "klc.min.js" in ln and "</script>" in ln:
            klc_i = i
            break
    if klc_i is None:
        raise RuntimeError("[e1:s2) 구간에 klc.min.js 없음")

    new_middle = middle[: klc_i + 1] + [script_line] + middle[klc_i + 1 :]
    # [s0,e0) 블록1·[e0,e1) 블록2·[s2,e2) 블록3 제거 → [0:s0] + [e1:s2) 변형 + [e2:]
    out_lines = lines[0:s0] + new_middle + lines[e2:]
    return "".join(out_lines)


def process_file(path: str, dry: bool) -> None:
    text = open(path, encoding="utf-8").read()
    lines = text.splitlines(keepends=True)
    s0, e0, s1, e1, s2, e2 = find_view_indices(lines)
    if dry:
        print(f"  {os.path.basename(path)} indices s0={s0} e0={e0} e1={e1} s2={s2} e2={e2}")
        return


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    view_path = os.path.join(REPORT, "view.html")
    view_text = open(view_path, encoding="utf-8").read()
    lines = view_text.splitlines(keepends=True)
    v = read_meta_version(view_text)
    s0, e0, s1, e1, s2, e2 = find_view_indices(lines)
    core_js = build_core_js(lines, s0, e0, s1, e1, s2, e2)

    if args.dry_run:
        print(f"version={v}, core_js chars={len(core_js)}")
        for name in ("view.html", "saju.html", "index.html"):
            process_file(os.path.join(REPORT, name), True)
        return 0

    os.makedirs(REPORT, exist_ok=True)
    with open(CORE, "w", encoding="utf-8") as f:
        f.write(core_js)
    print(f"  [write] report/report-core.js ({len(core_js)} chars) v={v}")

    for name in ("view.html", "saju.html", "index.html"):
        p = os.path.join(REPORT, name)
        lt = open(p, encoding="utf-8").read().splitlines(keepends=True)
        s0p, e0p, s1p, e1p, s2p, e2p = find_view_indices(lt)
        out = strip_and_inject_v2(lt, s0p, e0p, s1p, e1p, s2p, e2p, v)
        if "report-core.js" not in out:
            raise RuntimeError(f"{p}: report-core 삽입 결과 없음")
        with open(p, "w", encoding="utf-8") as f:
            f.write(out)
        print(f"  [patch] report/{name}")

    print("다음: python3 deploy_now.py (또는 refresh_root_master_html) 로 sajux_deploy 및 X-SAJU_MASTER 동기화")
    return 0


if __name__ == "__main__":
    sys.exit(main())
