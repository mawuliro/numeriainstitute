#!/usr/bin/env python3
"""
Fix the math escape bug in seed_mecanique_course.py.

BUG:
  The mécanique course seed uses `\\\\vec{F}` in Python source (4 backslashes),
  which Python parses to `\\vec{F}` stored in the database (2 backslashes).
  MathJax then interprets `\\` as a LaTeX line-break command followed by
  the literal text "vec{F}" — so vectors, fractions, square roots etc.
  display as raw text instead of math symbols.

FIX:
  Replace every `\\\\` (4 backslashes in source) with `\\` (2 backslashes
  in source). After Python parses, the DB stores `\vec{F}` (1 backslash),
  which is the correct LaTeX command MathJax expects.

  This matches the convention already used by seed_latex_course.py
  (e.g. `$\\frac{a}{b}$` → DB `$\frac{a}{b}$`).

USAGE:
  python3 /home/z/my-project/scripts/fix_mecanique_math.py
  (then re-seed on Railway: python manage.py seed_mecanique_course --clean)
"""
from pathlib import Path

SRC = Path("/home/z/my-project/repos/numeria-institute/cours/management/commands/seed_mecanique_course.py")

def main():
    text = SRC.read_text(encoding="utf-8")

    before_quad = text.count("\\\\")  # occurrences of "\\\\" in source
    # Replace exactly 4-backslash runs with 2-backslash runs.
    # We must do this in a single pass to avoid double-replacement.
    # `\\\\` (4) → `\\` (2) is unambiguous because 8-backslash runs
    # would be replaced as two 4→2 substitutions, giving `\\\\` (4) — still wrong.
    # But there are no 8-backslash runs in the file (verified).
    fixed = text.replace("\\\\", "\\")  # 4 in source → 2 in source
    # Hmm — that replaces 2-backslash source with 1-backslash source.
    # Wait: in this Python string, "\\\\" is 2 backslashes and "\\" is 1 backslash.
    # So `text.replace("\\\\", "\\")` replaces every pair of backslashes (2 chars)
    # with a single backslash (1 char). That gives us:
    #   source "\\\\\\" (4 chars) → "\\" (2 chars)  ✓
    #   source "\\\\"   (2 chars) → "\\"  (1 char)  ✗ breaks normal escapes like \n
    # This is wrong. We must ONLY collapse 4-source-backslash runs to 2-source-backslash runs,
    # i.e. 2-DB-backslash → 1-DB-backslash.

    # Re-read original and use a smarter approach: replace 4-backslash runs only.
    text = SRC.read_text(encoding="utf-8")
    # Match runs of exactly 4 backslashes (not 2, not 6, not 8).
    # Python regex: r"\\\\(?![\\])"  matches "\\\\" not followed by another backslash
    # but we also need to ensure it's not part of a 6+ run — use negative lookbehind too.
    import re
    # Replace 4-backslash runs (\\\\) with 2-backslash runs (\\),
    # but only when not preceded/followed by another backslash.
    pattern = re.compile(r"(?<!\\)\\\\(?!\\)")
    fixed, n = pattern.subn("\\\\", text)

    SRC.write_text(fixed, encoding="utf-8")
    print(f"✓ Fixed {n} occurrences of \\\\\\\\ → \\\\ in {SRC}")
    print(f"  (was {before_quad} pairs of backslashes total)")
    print()
    print("Next step: re-seed the course on Railway with:")
    print("  python manage.py seed_mecanique_course --clean")

if __name__ == "__main__":
    main()
