# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 사주X (sajux) 배포

- **명령:** `python3 deploy_now.py` (워크스페이스 루트)
- **대상:** `report/*` → GitHub Pages (`jediii88/X-SAJU`)
- **규칙:** 리포트·`report-core.js` 등 고객 노출 파일 수정 후 **자동 실행** (별도 요청 없이). 커밋은 사용자 요청 시만.

Add whatever helps you do your job. This is your cheat sheet.
