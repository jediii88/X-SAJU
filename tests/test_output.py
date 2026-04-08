from x_saju.engine.calendar import SajuEngine
from x_saju.engine.interpreter import Interpreter

def test_engine():
    engine = SajuEngine()
    # Sample date: 1987-12-24 06:30 (Solar)
    # This was a sample from Shim Na-young's report
    pillars = engine.get_saju_pillars(1987, 12, 24, 6, 30)
    
    print("--- [테스트 사주 원국] ---")
    print(f"년주: {pillars['year'][0]}{pillars['year'][1]}")
    print(f"월주: {pillars['month'][0]}{pillars['month'][1]}")
    print(f"일주: {pillars['day'][0]}{pillars['day'][1]}")
    print(f"시주: {pillars['time'][0]}{pillars['time'][1]}")
    
    print("\n--- [물상론 해석 미리보기] ---")
    interpreter = Interpreter(pillars)
    print(interpreter.generate_full_report())

if __name__ == "__main__":
    test_engine()
