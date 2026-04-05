from datetime import datetime, timedelta, timezone
import math

STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# Solar Term (Jeolgi) Target Longitudes (0: Ipchun, 30: Gyeong-chip, ...)
# Actually, Ipchun is around Feb 4, Gyeong-chip around Mar 5.
# Simplified Jeolgi calculation without external libraries
def get_approx_jeolgi_dates(year):
    # Approximated dates for Jeolgi (Starts on Feb 4)
    # This formula is accurate within 1-2 days.
    base_dates = [
        (2, 4),  # Ipchun
        (3, 5),  # Gyeong-chip
        (4, 4),  # Cheong-myeong
        (5, 5),  # Ip-ha
        (6, 5),  # Mang-jong
        (7, 7),  # So-seo
        (8, 7),  # Ip-chu
        (9, 7),  # Baek-ro
        (10, 8), # Han-ro
        (11, 7), # Ip-dong
        (12, 7), # Dae-seol
        (1, 5)   # So-han (Next Year)
    ]
    
    # Actually, a more precise formula for Jeolgi (K-Jeolgi):
    # Year * 365.2422 + offset ...
    # But for a "Program demonstration", let's use a logic that calculates them.
    return base_dates

ELEMENTS = {
    "甲": "wood", "乙": "wood", "寅": "wood", "卯": "wood",
    "丙": "fire", "丁": "fire", "巳": "fire", "午": "fire",
    "戊": "earth", "己": "earth", "辰": "earth", "戌": "earth", "丑": "earth", "未": "earth",
    "庚": "metal", "辛": "metal", "申": "metal", "酉": "metal",
    "壬": "water", "癸": "water", "亥": "water", "子": "water"
}

YIN_YANG = {
    "甲": "+", "丙": "+", "戊": "+", "庚": "+", "壬": "+",
    "乙": "-", "丁": "-", "己": "-", "辛": "-", "癸": "-",
    "子": "-", "丑": "-", "寅": "+", "卯": "-", "辰": "+", "巳": "-",
    "午": "+", "未": "-", "申": "+", "酉": "-", "戌": "+", "亥": "-"
}

class SajuEngine:
    def __init__(self):
        self.ks_tz = timezone(timedelta(hours=9))

    def get_saju_pillars(self, year, month, day, hour, minute):
        # 1. Year Pillar
        # Ipchun usually Feb 4.
        s_year = year
        if month < 2 or (month == 2 and day < 4):
            s_year -= 1
        
        y_stem_idx = (s_year - 4) % 10
        y_branch_idx = (s_year - 4) % 12
        year_pillar = (STEMS[y_stem_idx], BRANCHES[y_branch_idx])

        # 2. Month Pillar
        # Using approximate Jeolgi dates (accuracy ~1 day)
        jeolgi_dates = [
            (2, 4), (3, 6), (4, 5), (5, 6), (6, 6), (7, 7),
            (8, 8), (9, 8), (10, 8), (11, 7), (12, 7), (1, 6)
        ]
        
        m_idx = 0
        for i, (m, d) in enumerate(jeolgi_dates):
            if month > m or (month == m and day >= d):
                m_idx = i
            else:
                if i == 0 and (month == 1 or (month == 2 and day < 4)):
                    m_idx = 11 # Last month of prev year
                break
        
        # Month Branch: Ipchun starts with In (Tiger, Index 2)
        m_branch_index = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]
        m_branch_idx = m_branch_index[m_idx]
        
        # Month Stem Start rule
        m_stem_start = ((y_stem_idx % 5) * 2 + 2) % 10
        m_stem_idx = (m_stem_start + m_idx) % 10
        month_pillar = (STEMS[m_stem_idx], BRANCHES[m_branch_idx])

        # 3. Day Pillar
        # Base: 2000-01-01 is 戊午 (Stem 4, Branch 6)
        dt_kst = datetime(year, month, day, hour, minute, tzinfo=self.ks_tz)
        saju_date = dt_kst
        # Jasi starts at 23:30
        if (hour == 23 and minute >= 30) or (hour == 0 and minute < 30):
             if hour == 23:
                 saju_date += timedelta(days=1)
        
        base_date = datetime(2000, 1, 1).date()
        target_date = saju_date.date()
        days_diff = (target_date - base_date).days
        
        d_stem_idx = (days_diff + 4) % 10
        d_branch_idx = (days_diff + 6) % 12
        day_pillar = (STEMS[d_stem_idx], BRANCHES[d_branch_idx])

        # 4. Time Pillar
        total_min = dt_kst.hour * 60 + dt_kst.minute
        if total_min >= 23*60+30 or total_min < 1*60+30:
            t_branch_idx = 0 # 子
        else:
            t_branch_idx = ((total_min - 90) // 120 + 1) % 12
        
        t_stem_start = ((d_stem_idx % 5) * 2) % 10
        t_stem_idx = (t_stem_start + t_branch_idx) % 10
        time_pillar = (STEMS[t_stem_idx], BRANCHES[t_branch_idx])

        return {
            "year": year_pillar,
            "month": month_pillar,
            "day": day_pillar,
            "time": time_pillar
        }

    def get_sipseong(self, day_stem, target):
        # Programmatic logic for Sip-seong
        ds_element = ELEMENTS[day_stem]
        ds_yin_yang = YIN_YANG[day_stem]
        t_element = ELEMENTS[target]
        t_yin_yang = YIN_YANG[target]
        
        elements_order = ["wood", "fire", "earth", "metal", "water"]
        ds_idx = elements_order.index(ds_element)
        t_idx = elements_order.index(t_element)
        
        diff = (t_idx - ds_idx) % 5
        if diff == 0: return "Bie-gyeon" if ds_yin_yang == t_yin_yang else "Geop-jae"
        elif diff == 1: return "Sik-sin" if ds_yin_yang == t_yin_yang else "Sang-gwan"
        elif diff == 2: return "Pyeon-jae" if ds_yin_yang == t_yin_yang else "Jeong-jae"
        elif diff == 3: return "Pyeon-gwan" if ds_yin_yang == t_yin_yang else "Jeong-gwan"
        elif diff == 4: return "Pyeon-in" if ds_yin_yang == t_yin_yang else "Jeong-in"
        return "Unknown"
