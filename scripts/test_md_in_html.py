"""Test that md_in_html + markdown='1' fixes the <details> rendering."""
import markdown
import re

content = """## 🎯 Exercice d'application — Test

**Énoncé.** Un exercice avec des données $R_T = 6371$ km et $g_0 = 9{,}81$ m/s².

<details>
<summary><b>📌 Voir la correction (clique pour déplier)</b></summary>

**Correction.** Données : $R_T = 6371$ km, $g_0 = 9{,}81$ m/s².

**Rayon orbital** : $r = R_T + h = 6771$ km $= 6{,}771 \\times 10^6$ m.

**Vitesse orbitale** : $v = \\sqrt{g r} \\approx 7668$ m/s.

</details>"""

# Step 1: protect LaTeX
placeholders = {}
counter = [0]
def protect_latex(m):
    key = f'ZQZLATEX{counter[0]}ZQZ'
    placeholders[key] = m.group(0)
    counter[0] += 1
    return key

text = re.sub(r'\$\$[\s\S]*?\$\$', protect_latex, content)
text = re.sub(r'(?<!\$)\$(?!\$)[^\n$]+?\$', protect_latex, text)

# Step 2: extract <summary> blocks, add markdown="1" to <details>
summary_placeholders = {}
def _stash_summary(m):
    key = f'ZQZSUMMARY{len(summary_placeholders)}ZQZ'
    inner = m.group(2).replace('<b>', '<strong>').replace('</b>', '</strong>')
    summary_placeholders[key] = '<summary' + m.group(1) + '>' + inner + '</summary>'
    return key
text = re.sub(
    r'<summary([^>]*)>(.*?)</summary>',
    _stash_summary, text, flags=re.DOTALL,
)
text = re.sub(r'<details(?![^>]*markdown=)', '<details markdown="1">', text)

# Step 3: run markdown with md_in_html
html = markdown.markdown(text, extensions=[
    'fenced_code', 'tables', 'nl2br', 'attr_list',
    'def_list', 'footnotes', 'toc', 'md_in_html',
])

# Step 3b: remove empty blockquote artifacts
import re as _re
html = _re.sub(r'<blockquote>\s*</blockquote>', '', html)

# Step 3c: restore <summary> blocks, stripping wrappers
for key, val in summary_placeholders.items():
    html = re.sub(r'<blockquote>\s*<p>\s*' + re.escape(key) + r'\s*</p>\s*</blockquote>', val, html)
    html = re.sub(r'<blockquote>\s*' + re.escape(key) + r'\s*</blockquote>', val, html)
    html = re.sub(r'<p>\s*' + re.escape(key) + r'\s*</p>', val, html)
    html = html.replace(key, val)

# Step 4: restore placeholders
for key, val in placeholders.items():
    html = html.replace(key, val)

print("=== RENDERED HTML (first 2000 chars) ===")
print(html[:2000])

print("\n=== CHECKS ===")
print(f"  Has **Correction.** (literal asterisks)? {'**Correction.**' in html}")
print(f"  Has <strong>Correction.</strong>? {'<strong>Correction.</strong>' in html}")
print(f"  Has &lt;b&gt; (escaped HTML in summary)? {'&lt;b&gt;' in html}")
print(f"  Has <b>📌 (unescaped HTML in summary)? {'<b>📌' in html}")
print(f"  Has markdown=\"1\" (attribute leaked)? {'markdown=\"1\"' in html}")
print(f"  Has $R_T (unrendered LaTeX)? {'$R_T' in html}")
print(f"  Has empty <blockquote></blockquote>? {'<blockquote></blockquote>' in html or '<blockquote>\\n</blockquote>' in html}")
