# -*- coding: utf-8 -*-
from .saju_tables import UNSUNG_12, SIPSEONG, METAPHORS, UNSUNG_MASTER_TEXTS, SIPSEONG_ADVICE, SHINSAL, DAEUN_TEXTS, RELATIONSHIPS, YONGSIN_GUIDE, CAREER_WEALTH, HEALTH_VITALITY, LIFE_STAGES, GAEWUN_STRATEGIES, FINAL_ADVICE

class Interpreter:
    def __init__(self, won_guk):
        self.won_guk = won_guk
        self.day_stem = won_guk['day'][0]
        self.day_branch = won_guk['day'][1]
        self.pillars = won_guk # {'year': [stem, branch], ...}
        # Human-friendly location labels for pillars
        self.location_labels = {
            "year": "초년기·가족·사회적 배경",
            "month": "청년기·부모·직업 환경",
            "day": "중년기·배우자·내면",
            "time": "말년기·자녀·최종 결과물"
        }
        # Map common sipseong roles to practical life domains (for "void" checks)
        self.role_domain = {
            "정재": "money", "편재": "money",
            "정관": "career", "편관": "career",
            "정인": "learning", "편인": "learning",
            "식신": "expression", "상관": "expression",
            "비견": "self", "겁재": "self"
        }
        # Domain → representative element (simple heuristic)
        self.domain_element = {
            "money": "金",
            "career": "土",
            "learning": "水",
            "expression": "火",
            "self": "木"
        }

    def analyze_pillars(self):
        analysis = {}
        for p_name, p_data in self.pillars.items():
            stem, branch = p_data
            sipseong = SIPSEONG.get(self.day_stem, {}).get(stem, "비견") if p_name != 'day' else "본인"
            unsung = UNSUNG_12.get(self.day_stem, {}).get(branch, "장생")
            analysis[p_name] = {
                "stem": stem,
                "branch": branch,
                "sipseong": sipseong,
                "unsung": unsung,
                "metaphor": METAPHORS.get(stem, ""),
                "unsung_text": UNSUNG_MASTER_TEXTS.get(unsung, ""),
                "sipseong_advice": SIPSEONG_ADVICE.get(sipseong, "")
            }
        # Add location-aware, user-facing labels and detect domain "voids"
        counts, percentages = self.get_element_balance()
        for p_name in analysis.keys():
            role = analysis[p_name]['sipseong']
            # location label
            analysis[p_name]['location_label'] = self.location_labels.get(p_name, p_name)
            # domain mapping
            domain = self.role_domain.get(role, None)
            analysis[p_name]['domain'] = domain
            # simple "void" (functional emptiness) detection:
            void_flag = False
            void_reason = ''
            if domain:
                elem = self.domain_element.get(domain)
                if elem:
                    # if element count is very low, treat as functional void for that domain
                    if counts.get(elem, 0) <= 1 or percentages.get(elem, 0) < 10:
                        void_flag = True
                        void_reason = f"{analysis[p_name]['location_label']}에서 기대되는 에너지원({elem})이 약해, 즉각적인 성과보다 긴 호흡과 시스템 설계가 유리합니다."
            # Traditional 空亡 (공망) detection using table from saju_tables.EMPTY_MAP
            try:
                from .saju_tables import EMPTY_MAP
            except Exception:
                EMPTY_MAP = {}
            traditional_void = False
            # day_stem determines which branches are traditionally void
            ds = self.day_stem
            for stems, branches in EMPTY_MAP.items():
                if ds in stems:
                    if analysis[p_name]['branch'] in branches:
                        traditional_void = True
                        break
            analysis[p_name]['traditional_void'] = traditional_void
            analysis[p_name]['functional_void'] = void_flag
            analysis[p_name]['void_reason'] = void_reason
            # user-friendly, location-aware sipseong interpretation (no technical terms)
            base_advice = analysis[p_name]['sipseong_advice'] or ''
            # Translate role into practical phrasing depending on pillar location
            loc = analysis[p_name]['location_label']
            # Empathetic, user-facing phrasing. If functional void exists, use gentle comforting tone.
            # Build kid-friendly, engaging phrasings.
            # Short playful intro + clear concrete feeling + gentle reassurance + one small suggested action.
            if void_flag:
                # Empathetic fragment examples (do NOT mention internal labels here)
                feeling_examples = "'사랑을 못 받은 것 같아요' 또는 '거리감이 있어요'처럼 느껴질 수 있습니다."
                reassure = "그런 감정이 있어도 당신의 가치는 변하지 않습니다."
                suggestion = "오늘은 아주 작은 행동 하나를 시도해보세요: 짧은 문자 한 통이나 사진 한 장을 보내보세요."
            else:
                feeling_examples = ""
                reassure = ""
                suggestion = ""

            # Simple domain-aware phrasing (avoid technical nouns entirely)
            if role in ("정재","편재"):
                if p_name == 'month':
                    loc_phrase = "직장이나 밖에서 벌어들이는 돈"
                    action = "월 단위 자동 저축이나 작은 정기 수입을 하나 만들어 보세요."
                elif p_name == 'day':
                    loc_phrase = "집안에서의 돈 문제나 배우자 관련 재정"
                    action = "가벼운 가계 점검(한 장의 메모로 수입·지출 정리)을 권합니다."
                else:
                    loc_phrase = loc
                    action = "당장 큰 결정보다는 작은 루틴을 만들어 보세요."
                main = f"{loc_phrase}에 관해선, {base_advice} {action}"
            else:
                # Generic friendly phrasing
                main = f"{loc}에선 이렇게 읽힙니다: {base_advice}"

            # Create natural-language location phrase (avoid technical tokens)
            loc_label = analysis[p_name]['location_label']
            if '부모' in loc_label:
                human_loc = '부모님과의 관계'
            elif '배우자' in loc_label:
                human_loc = '배우자와의 관계'
            elif '자녀' in loc_label or '말년' in loc_label:
                human_loc = '자녀와의 관계'
            elif '가족' in loc_label:
                human_loc = '가족과의 관계'
            else:
                human_loc = loc_label

            # Compose final friendly paragraph using counselor templates when available.
            # Build normalized components
            feeling_examples = ""
            # feeling_examples already prepared above (no internal labels)
            feeling_examples = feeling_examples.strip()
            reassure_txt = reassure or "그 감정은 당신의 잘못이 아닙니다."
            suggestion_txt = suggestion or suggestion
            extra = ""
            # pick domain template key
            domain_key = None
            if '부모' in human_loc:
                domain_key = 'parent'
            elif '배우자' in human_loc:
                domain_key = 'spouse'
            elif domain == 'money':
                domain_key = 'finance'

            rendered = None
            try:
                if domain_key:
                    from engine.templates_text import TEMPLATES
                    tpl = TEMPLATES.get(domain_key, {}).get('counselor')
                    if tpl:
                        subject = f"당신은 {human_loc}에서"
                        action = ""
                        # decide small concrete action based on domain
                        if domain_key == 'parent':
                            action = "짧은 안부 문자 한 통이나 사진 한 장을 보내 보세요."
                        elif domain_key == 'spouse':
                            action = "이번 주에 짧은 대화 시간을 한 번 마련해 보세요."
                        elif domain_key == 'finance':
                            action = "먼저 자동 저축이나 소액 정기 투자를 하나 시작해 보세요."
                        rendered = tpl.format(subject=subject,
                                              feeling_examples=feeling_examples,
                                              reassure=reassure_txt,
                                              action=action,
                                              extra=extra)
            except Exception:
                rendered = None

            if rendered:
                analysis[p_name]['user_facing_advice'] = ' '.join(rendered.split())
            else:
                # Fallback: plain composed sentence
                parts = []
                if feeling_examples: parts.append(feeling_examples)
                parts.append(main)
                if reassure_txt: parts.append(reassure_txt)
                if suggestion_txt: parts.append(suggestion_txt)
                body = " ".join([p for p in parts if p]).strip()
                if not body.startswith('당신'):
                    analysis[p_name]['user_facing_advice'] = f"당신은 {human_loc}에서 {body}"
                else:
                    analysis[p_name]['user_facing_advice'] = body
        return analysis

    def get_element_balance(self):
        counts = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
        mapping = {
            "甲": "木", "乙": "木", "寅": "木", "卯": "木",
            "丙": "火", "丁": "火", "巳": "火", "午": "火",
            "戊": "土", "己": "土", "辰": "土", "戌": "土", "丑": "土", "未": "土",
            "庚": "金", "辛": "金", "申": "金", "酉": "金",
            "壬": "水", "癸": "水", "亥": "水", "子": "水"
        }
        for p in self.pillars.values():
            counts[mapping.get(p[0], "")] += 1
            counts[mapping.get(p[1], "")] += 1
        
        total = sum(counts.values())
        percentages = {k: round((v / total) * 100, 1) for k, v in counts.items()}
        return counts, percentages

    def generate_page_content(self, page_num):
        balance, percentages = self.get_element_balance()
        pillar_info = self.analyze_pillars()
        
        if page_num == 1:
            return {
                "category": "Master Intro",
                "title": "운명의 시스템, 그 거대한 지도의 시작",
                "content": f"{self.day_stem}{self.day_branch} 일주를 타고난 당신의 운명은 {pillar_info['day']['unsung']}의 강력한 기운을 엔진으로 삼고 있습니다. 이는 {pillar_info['day']['unsung_text']}"
            }
        
        # Pillar Analysis (Pages 2-5)
        if 2 <= page_num <= 5:
            p_names = ["연주 (뿌리)", "월주 (환경)", "일주 (본체)", "시주 (열매)"]
            p_key = ["year", "month", "day", "time"][page_num-2]
            info = pillar_info[p_key]
            # Use user-facing, location-aware advice and avoid technical terms in output
            advice = info.get('user_facing_advice', info.get('sipseong_advice', ''))
            # If functional void detected, add premium framing
            if info.get('functional_void'):
                void_note = ("이 부분은 즉각적인 결과보다 시스템 설계와 긴 호흡이 유리합니다. "
                             "단기적 소유보다 장기적 구조를 갖추는 전략을 권합니다.")
            else:
                void_note = ""
            # Short noun-style title (e.g., "연주") and full explanatory paragraph as content
            short_title = p_names[page_num-2].split()[0]  # e.g., "연주"
            content_paragraph = f"{self.location_labels.get(p_key, p_key)} 관점에서 보자면, {advice} {void_note} {info.get('unsung_text','')}"
            return {
                "category": f"Pillar Depth / {short_title}",
                "title": short_title,
                "content": content_paragraph
            }
            
        # Element Balance (Pages 6-10)
        if 6 <= page_num <= 10:
            elements = ["木", "火", "土", "金", "水"]
            e = elements[page_num-6]
            pct = percentages[e]
            desc = {
                "木": "성장과 추진력, 그리고 새로운 시작의 에너지입니다.",
                "火": "열정과 확산, 그리고 세상을 밝히는 명예의 에너지입니다.",
                "土": "중재와 포용, 그리고 모든 기운의 기반이 되는 에너지입니다.",
                "金": "결단과 정제, 그리고 결실을 맺는 수확의 에너지입니다.",
                "水": "지혜와 유연함, 그리고 깊은 사유의 에너지입니다."
            }
            return {
                "category": "Element Analysis",
                "title": f"오행의 균형: {e} ({pct}%)",
                "content": f"당신의 운명 시스템에서 {e}의 기운은 {pct}%의 비중을 차지하고 있습니다. 이는 {desc[e]} 이 기운의 강약에 따라 당신의 성격적 특성과 건강의 리스크가 결정됩니다."
            }

        # 12 Unsung Deep Dive (Pages 11-22)
        if 11 <= page_num <= 22:
            unsung_list = list(UNSUNG_MASTER_TEXTS.keys())
            u = unsung_list[page_num-11]
            return {
                "category": "12 Stages of Life",
                "title": f"운명의 순환: {u}({u})",
                "content": f"사주학에서 {u}은 {UNSUNG_MASTER_TEXTS[u]} 당신의 원국이나 대운에서 이 기운이 들어올 때, 해당 시기의 전략을 수정해야 할 필요가 있습니다."
            }

        # Shinsal Analysis (Pages 23-35)
        if 23 <= page_num <= 35:
            shinsal_list = list(SHINSAL.keys())
            s_idx = (page_num - 23) % len(shinsal_list)
            s_name = shinsal_list[s_idx]
            return {
                "category": "Shinsal (Special Energy)",
                "title": f"특별한 기운: {s_name}",
                "content": f"당신의 운명에 작용하는 {s_name}의 에너지는 {SHINSAL[s_name]} 이 에너지를 어떻게 통제하고 활용하느냐에 따라 인생의 파급력이 달라집니다."
            }

        # Dae-un Strategy (Pages 36-45)
        if 36 <= page_num <= 45:
            daeun_list = list(DAEUN_TEXTS.keys())
            d_idx = (page_num - 36) % len(daeun_list)
            d_name = daeun_list[d_idx]
            return {
                "category": "Dae-un Strategy",
                "title": f"10년 주기의 변화: {d_name}의 시기",
                "content": f"대운에서 {d_name}의 흐름을 만날 때, 당신의 삶은 {DAEUN_TEXTS[d_name]} 이 시기에는 환경의 변화에 순응하기보다 주도적으로 흐름을 타는 것이 중요합니다."
            }

        # Relationship Dynamics (Pages 46-55)
        if 46 <= page_num <= 55:
            rel_list = list(RELATIONSHIPS.keys())
            r_idx = (page_num - 46) % len(rel_list)
            r_name = rel_list[r_idx]
            return {
                "category": "Interpersonal Dynamics",
                "title": f"관계의 역동성: {r_name}",
                "content": f"사주 원국 내의 {r_name} 기운은 당신의 인간관계와 사회적 처세에 있어 {RELATIONSHIPS[r_name]} 이러한 역동성을 이해하고 활용하는 것이 마스터급 처세의 시작입니다."
            }

        # Yong-sin & Strategy (Pages 56-65)
        if 56 <= page_num <= 65:
            elements = ["木", "火", "土", "金", "水"]
            e = elements[(page_num - 56) % 5]
            return {
                "category": "Strategic Success Factor",
                "title": f"성공의 열쇠(Yong-sin): {e}의 기운",
                "content": f"당신의 삶을 성공으로 이끄는 핵심 에너지인 {e}은 {YONGSIN_GUIDE[e]} 일상에서 이 기운을 어떻게 보충하고 강화하느냐에 따라 인생의 격이 달라집니다."
            }

        # Career & Wealth (Pages 66-85)
        if 66 <= page_num <= 85:
            cw_list = list(CAREER_WEALTH.keys())
            idx = (page_num - 66) % len(cw_list)
            key = cw_list[idx]
            return {
                "category": f"Wealth & Career Success / {key}",
                "title": f"성공의 경제학: {key} 분석",
                "content": f"귀하의 사주 원국에서 나타나는 {key}의 양상은 {CAREER_WEALTH[key]} 마스터급 경제 활동을 위해 이 데이터를 전략적으로 활용하십시오."
            }

        # Health & Vitality (Pages 86-105)
        if 86 <= page_num <= 105:
            hv_list = list(HEALTH_VITALITY.keys())
            idx = (page_num - 86) % len(hv_list)
            key = hv_list[idx]
            return {
                "category": f"Holistic Health / {key}",
                "title": f"활력의 근원: {key} 정밀 진단",
                "content": f"신체와 정신의 균형을 위한 {key}의 분석 결과는 {HEALTH_VITALITY[key]} 지속 가능한 성취를 위해 건강의 기초를 단단히 다져야 합니다."
            }

        # Life Stages Analysis (Pages 106-135)
        if 106 <= page_num <= 135:
            ls_list = list(LIFE_STAGES.keys())
            idx = (page_num - 106) % len(ls_list)
            key = ls_list[idx]
            return {
                "category": f"Life Cycle Roadmap / {key}",
                "title": f"생애 주기 분석: {key}의 흐름",
                "content": f"당신의 인생 여정에서 {key}은 {LIFE_STAGES[key]} 각 시기마다 주어지는 운명의 과제를 슬기롭게 해결해 나가는 지혜가 필요합니다."
            }

        # Luck Improvement (Pages 136-155)
        if 136 <= page_num <= 155:
            g_list = list(GAEWUN_STRATEGIES.keys())
            idx = (page_num - 136) % len(g_list)
            key = g_list[idx]
            return {
                "category": f"Luck Mastery / {key}",
                "title": f"개운(開運)의 기술: {key} 활용법",
                "content": f"운을 바꾸는 실질적인 습관인 {key} 전략은 {GAEWUN_STRATEGIES[key]} 작은 변화가 당신의 운명에 커다란 파동을 일으킵니다."
            }

        # Master's Final Advice (Pages 156-183)
        if 156 <= page_num <= 183:
            fa_list = list(FINAL_ADVICE.keys())
            idx = (page_num - 156) % len(fa_list)
            key = fa_list[idx]
            return {
                "category": f"Master's Epilogue / {key}",
                "title": f"마스터의 제언: {key}에 대하여",
                "content": f"리포트를 마무리하며 전하는 {key}의 지혜는 {FINAL_ADVICE[key]} 당신의 삶은 스스로 선택한 빛으로 가득 찰 것입니다."
            }

        # Default master knowledge pages (Should not be reachable)
        return {
            "category": f"Destiny Insights / Sector {page_num}",
            "title": f"운명 알고리즘 정밀 제언 제 {page_num}장",
            "content": "이 섹션은 당신의 고유한 사주 데이터를 '사주 대가'의 통계적 지혜와 'Axe'의 정밀 엔진으로 교차 분석한 결과입니다. 당신의 일간인 " + self.day_stem + "의 특성을 고려할 때, 현재의 환경에서 " + pillar_info['month']['sipseong'] + "의 에너지를 어떻게 활용하느냐가 성공의 핵심 키가 될 것입니다."
        }

    def get_full_report_data(self):
        report = []
        for i in range(1, 184):
            report.append(self.generate_page_content(i))
        return report
