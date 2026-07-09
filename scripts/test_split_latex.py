"""Test the LaTeX-splitting logic for fill_blank exercises."""
import re

def _split_latex_around_blanks(match):
    content = match.group(1)
    if '{{blank_' not in content:
        return match.group(0)
    parts = re.split(r'(\{\{blank_\w+\}\})', content)
    result = ''
    for part in parts:
        if part.startswith('{{blank_'):
            result += '$ ' + part + ' $'
        elif part:
            result += part
    result = '$' + result + '$'
    result = re.sub(r'\$\s*\$', '', result)
    return result

def process(text):
    return re.sub(
        r'\$([^$]*\{\{blank_\w+\}\}[^$]*)\$',
        _split_latex_around_blanks, text,
    )

# Test cases (representative of seed_mecanique_course.py content)
tests = [
    # Case 1: blank at end of formula
    ("Travail d'une force : $W = \\vec{F} \\cdot {{blank_0}}$.",
     "Travail d'une force : $W = \\vec{F} \\cdot $ {{blank_0}}."),
    
    # Case 2: blank in middle of formula
    ("$v = \\omega \\times {{blank_0}} + 5$",
     "$v = \\omega \\times $ {{blank_0}} $ + 5$"),
    
    # Case 3: multiple blanks in one formula
    ("$\\sum {{blank_1}} = m \\times {{blank_2}}$",
     "$\\sum $ {{blank_1}} $ = m \\times $ {{blank_2}}"),
    
    # Case 4: blank outside LaTeX (no change)
    ("La période vaut $T = 2\\pi$ et la fréquence est {{blank_3}}.",
     "La période vaut $T = 2\\pi$ et la fréquence est {{blank_3}}."),
    
    # Case 5: formula without blank (no change)
    ("La vitesse est $v = d/t$ en m/s.",
     "La vitesse est $v = d/t$ en m/s."),
    
    # Case 6: blank at start of formula
    ("$\\times {{blank_0}} = 10$",
     "$\\times $ {{blank_0}} $ = 10$"),
]

print("=== TESTS ===")
all_pass = True
for i, (input_text, expected) in enumerate(tests):
    result = process(input_text)
    status = "✓" if result == expected else "✗"
    if result != expected:
        all_pass = False
    print(f"\nTest {i+1} {status}:")
    print(f"  Input:    {input_text}")
    print(f"  Expected: {expected}")
    print(f"  Got:      {result}")

print(f"\n{'✓ All tests passed' if all_pass else '✗ Some tests failed'}")
