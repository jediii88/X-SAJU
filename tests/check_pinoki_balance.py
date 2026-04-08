# -*- coding: utf-8 -*-
from x_saju.engine.interpreter import Interpreter

# Pinoki's Pillars
pillars = {
    "year": ["戊", "辰"],
    "month": ["乙", "卯"],
    "day": ["丙", "寅"],
    "time": ["戊", "子"]
}

interp = Interpreter(pillars)
counts, percentages = interp.get_element_balance()

print(f"Pillars: {pillars}")
print(f"Counts: {counts}")
print(f"Percentages: {percentages}")
