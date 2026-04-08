from x_saju.engine.calendar import SajuEngine
from datetime import datetime

engine = SajuEngine()
# Test for 2026-04-04 15:30 KST (Red Moon Date)
pillars = engine.get_saju_pillars(2026, 4, 4, 15, 30)

print(f"2026-04-04 15:30 KST Pillars:")
for key, value in pillars.items():
    print(f"{key}: {''.join(value)}")

# Check Sipseong for DayStem (丙)
day_stem = pillars['day'][0]
for key, value in pillars.items():
    if key == 'day': continue
    sipseong = engine.get_sipseong(day_stem, value[0]) # Stem sipseong
    print(f"{key} Stem Sipseong: {sipseong}")
