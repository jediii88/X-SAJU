from x_saju.engine.calendar import SajuEngine

def test_brother():
    engine = SajuEngine()
    # 1987-12-24 06:30 (Solar)
    pillars = engine.get_saju_pillars(1987, 12, 24, 6, 30)
    print(f"1987-12-24 06:30 Pillars: {pillars}")

if __name__ == "__main__":
    test_brother()
