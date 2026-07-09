"""Render the Numeria Institute logo SVG to high-resolution PNGs."""
import cairosvg
from pathlib import Path

# The exact SVG from the website header, scaled up to 1024x1024
# Original viewBox is 44x44, so we scale by 1024/44 ≈ 23.27
# Using width/height attributes for the output size
SVG_LOGO = '''<svg width="1024" height="1024" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="19" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" fill="none"/>
    <line x1="13" y1="10" x2="13" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="13" y1="10" x2="31" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="31" y1="10" x2="31" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="13" cy="10" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="13" cy="34" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="31" cy="10" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="31" cy="34" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="18.5" cy="18" r="3" fill="#2DD4BF"/>
    <circle cx="25.5" cy="26" r="3" fill="#2DD4BF"/>
</svg>'''

output_dir = Path("/home/z/my-project/download/logos")
output_dir.mkdir(parents=True, exist_ok=True)

# Version 1: On navy background (like the website header)
svg_navy = SVG_LOGO.replace(
    '<svg width="1024" height="1024" viewBox="0 0 44 44" fill="none"',
    '<svg width="1024" height="1024" viewBox="0 0 44 44" fill="none" style="background-color:#1B2A4E"'
)
# Actually, better to add a background rect
svg_navy = '''<svg width="1024" height="1024" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="#1B2A4E"/>
    <circle cx="22" cy="22" r="19" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" fill="none"/>
    <line x1="13" y1="10" x2="13" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="13" y1="10" x2="31" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="31" y1="10" x2="31" y2="34" stroke="white" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="13" cy="10" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="13" cy="34" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="31" cy="10" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="31" cy="34" r="3.2" fill="#1A3C6E" stroke="white" stroke-width="2"/>
    <circle cx="18.5" cy="18" r="3" fill="#2DD4BF"/>
    <circle cx="25.5" cy="26" r="3" fill="#2DD4BF"/>
</svg>'''

# Version 2: On transparent background (for use on any color)
svg_transparent = SVG_LOGO

# Version 3: On white background (for documents/printing)
svg_white = '''<svg width="1024" height="1024" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <circle cx="22" cy="22" r="19" stroke="rgba(26,60,110,0.22)" stroke-width="1.2" fill="none"/>
    <line x1="13" y1="10" x2="13" y2="34" stroke="#1B2A4E" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="13" y1="10" x2="31" y2="34" stroke="#1B2A4E" stroke-width="2.8" stroke-linecap="round"/>
    <line x1="31" y1="10" x2="31" y2="34" stroke="#1B2A4E" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="13" cy="10" r="3.2" fill="white" stroke="#1B2A4E" stroke-width="2"/>
    <circle cx="13" cy="34" r="3.2" fill="white" stroke="#1B2A4E" stroke-width="2"/>
    <circle cx="31" cy="10" r="3.2" fill="white" stroke="#1B2A4E" stroke-width="2"/>
    <circle cx="31" cy="34" r="3.2" fill="white" stroke="#1B2A4E" stroke-width="2"/>
    <circle cx="18.5" cy="18" r="3" fill="#2DD4BF"/>
    <circle cx="25.5" cy="26" r="3" fill="#2DD4BF"/>
</svg>'''

# Generate all three versions at 1024x1024
cairosvg.svg2png(bytestring=svg_navy.encode('utf-8'),
                 write_to=str(output_dir / 'numeria_logo_navy_bg.png'),
                 output_width=1024, output_height=1024)
print("✓ numeria_logo_navy_bg.png (navy background, matches website header)")

cairosvg.svg2png(bytestring=svg_transparent.encode('utf-8'),
                 write_to=str(output_dir / 'numeria_logo_transparent.png'),
                 output_width=1024, output_height=1024)
print("✓ numeria_logo_transparent.png (transparent background)")

cairosvg.svg2png(bytestring=svg_white.encode('utf-8'),
                 write_to=str(output_dir / 'numeria_logo_white_bg.png'),
                 output_width=1024, output_height=1024)
print("✓ numeria_logo_white_bg.png (white background, navy lines)")

# Also generate a favicon-size version (64x64) on navy background
cairosvg.svg2png(bytestring=svg_navy.encode('utf-8'),
                 write_to=str(output_dir / 'numeria_favicon.png'),
                 output_width=64, output_height=64)
print("✓ numeria_favicon.png (64x64 favicon)")

print(f"\nAll logos saved to: {output_dir}")
