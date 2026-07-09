"""Full integration test simulating render_content() on a fill_blank exercise."""
import re
import markdown

# Simulate the relevant parts of content_filters.py render_content()

ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3',
                'ul', 'ol', 'li', 'blockquote', 'a', 'sup', 'sub', 'details', 'summary',
                'span', 'div', 'input']
ALLOWED_ATTRS = {
    '*': ['class'],
    'input': ['type', 'data-blank', 'class'],
    'a': ['href'],
}

_BLANK = re.compile(r'\{\{(blank_\w+)\}\}')

def render_content(value):
    if not value:
        return ''
    text = str(value)
    placeholders = {}
    counter = [0]

    def protect(match):
        key = f'ZQZPROT{counter[0]}ZQZ'
        placeholders[key] = match.group(0)
        counter[0] += 1
        return key

    def protect_latex(match):
        key = f'ZQZLATEX{counter[0]}ZQZ'
        placeholders[key] = match.group(0)
        counter[0] += 1
        return key

    text = _BLANK.sub(protect, text)
    text = re.sub(r'\$\$[\s\S]*?\$\$', protect_latex, text)
    text = re.sub(r'\\\[[\s\S]*?\\\]', protect_latex, text)
    text = re.sub(r'(?<!\$)\$(?!\$)[^\n$]+?\$', protect_latex, text)

    # markdown processing (simplified — no md_in_html for this test)
    html = markdown.markdown(text, extensions=['fenced_code', 'tables', 'nl2br'])

    # Restore placeholders (multi-pass)
    for _ in range(5):
        changed = False
        for key, val in placeholders.items():
            if key in html:
                html = html.replace(key, val)
                changed = True
        if not changed:
            break

    # Split LaTeX around {{blank_X}}
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
    html = re.sub(
        r'\$([^$]*\{\{blank_\w+\}\}[^$]*)\$',
        _split_latex_around_blanks, html,
    )

    return html

# Test with the actual content from lesson 140 (Travail d'une force)
content = (
    "Pour un MRUA : $x(t) = x_0 + v_0 t + \\frac{1}{2} {{blank_0}} t^2$ ; "
    "l'équation sans temps : $v^2 - v_0^2 = 2 {{blank_1}} (x - x_0)$. "
    "L'accélération est la dérivée de la {{blank_2}}."
)

result = render_content(content)
print("=== INPUT ===")
print(content)
print("\n=== OUTPUT (rendered HTML) ===")
print(result)

# Simulate what the FB widget JS does: replace {{blank_X}} with <input>
def js_replace(html):
    return re.sub(
        r'\{\{blank_(\w+)\}\}',
        lambda m: f'<input data-blank="blank_{m.group(1)}" type="text">',
        html,
    )

final = js_replace(result)
print("\n=== FINAL (after JS replacement) ===")
print(final)

# Verify: count {{blank_X}} inside $...$
def count_blanks_inside_latex(html):
    matches = re.findall(r'\$[^$]*\{\{blank_\w+\}\}[^$]*\$', html)
    return len(matches)

print(f"\n=== CHECKS ===")
print(f"Blanks inside $...$ in output: {count_blanks_inside_latex(result)} (should be 0)")
print(f"Blanks replaced by <input>: {final.count('<input')} (should be 3)")
