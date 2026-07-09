#!/usr/bin/env python3
"""Fix broken LaTeX in matplotlib labels: \\\\X → \\X (where X is a LaTeX command)."""
import re
from pathlib import Path

src = Path("/home/z/my-project/repos/numeria-institute/cours/management/commands/seed_mecanique_course.py")
text = src.read_text(encoding="utf-8")

# LaTeX commands that should be preceded by single backslash in matplotlib labels
latex_cmds = ['vec', 'frac', 'sqrt', 'sin', 'cos', 'tan', 'theta', 'alpha', 'beta',
              'gamma', 'omega', 'pi', 'cdot', 'times', 'div', 'sum', 'int', 'partial',
              'nabla', 'infty', 'propto', 'approx', 'neq', 'leq', 'geq', 'pm', 'mp',
              'rightarrow', 'leftarrow', 'Rightarrow', 'Leftarrow', 'to', 'mapsto',
              'mathbb', 'mathcal', 'mathbf', 'mathrm', 'hat', 'bar', 'tilde', 'dot', 'ddot',
              'left', 'right', 'boxed', 'text', 'displaystyle', 'ell', 'circ',
              'Delta', 'Sigma', 'Omega', 'Theta', 'Alpha', 'mu', 'nu', 'rho', 'phi',
              'lambda', 'epsilon', 'varepsilon', 'tau', 'Psi', 'psi', 'xi', 'zeta']

# Replace \\\\X with \\X (where X is a known LaTeX command), but NOT \\\\n (newline) etc.
# Pattern: 4 backslashes followed by a known LaTeX command name
pattern = re.compile(r'\\\\(' + '|'.join(latex_cmds) + r')(?![a-zA-Z])')

new_text, n = pattern.subn(r'\\\1', text)
print(f"Replaced {n} occurrences of \\\\X → \\X (LaTeX commands in matplotlib labels)")

src.write_text(new_text, encoding="utf-8")
print(f"✓ File updated: {src}")

# Verify
import ast
ast.parse(new_text)
print("✓ Python syntax still valid")
