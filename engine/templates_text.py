# Counselor-style text templates for user-facing outputs.
# Each template receives these named placeholders:
#  - subject: e.g. "당신은 부모님과의 관계에서"
#  - feeling_examples: short examples of how it may feel
#  - reassure: comforting sentence
#  - action: one concrete small action recommendation
#  - extra: optional extra note (e.g., about long-term approach)

TEMPLATES = {
    "parent": {
        "counselor": "{subject} 가끔 허전함을 느끼실 수 있습니다. {feeling_examples} {reassure} 권장 행동: {action} {extra}"
    },
    "spouse": {
        "counselor": "{subject} 관계에서 거리감을 느낄 때가 있습니다. {feeling_examples} {reassure} 권장 행동: {action} {extra}"
    },
    "finance": {
        "counselor": "{subject} 금전이나 소유에서 불안이 느껴질 수 있습니다. {feeling_examples} {reassure} 권장 행동: {action} {extra}"
    }
}

