import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html') and not f.startswith('original_') and f not in ('index.html', 'contact.html')]

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    modified = False
    
    # 1. We will find CSS classes that end in -banner, like .wedding-banner, .mass-banner, .gallery-banner, .page-banner
    # and replace their height, border-radius, width/max-width, margin properties to match the pill shape.
    
    # Let's find all CSS blocks for banners:
    def replace_banner_css(match):
        css_body = match.group(2)
        
        # Remove existing height, border-radius, max-width, width, margin, margin-bottom
        css_body = re.sub(r'height:\s*[^;]+;', '', css_body)
        css_body = re.sub(r'border-radius:\s*[^;]+;', '', css_body)
        css_body = re.sub(r'max-width:\s*[^;]+;', '', css_body)
        css_body = re.sub(r'width:\s*[^;]+;', '', css_body)
        css_body = re.sub(r'margin-bottom:\s*[^;]+;', '', css_body)
        css_body = re.sub(r'margin:\s*[^;]+;', '', css_body)
        
        # Add the new properties
        new_props = "\n      height: 250px;\n      border-radius: 40px;\n      max-width: 1200px;\n      width: 100%;\n      margin: 40px auto 50px auto;\n"
        
        return match.group(1) + new_props + css_body + match.group(3)

    # Regex to match .something-banner { ... }
    new_content = re.sub(r'(\.[a-zA-Z0-9_-]+banner\s*\{)([^}]*)(\})', replace_banner_css, content)
    
    # Also fix responsive queries for banners (like .wedding-banner { height: 250px; ... })
    def replace_responsive_css(match):
        css_body = match.group(2)
        css_body = re.sub(r'height:\s*[^;]+;', 'height: 200px;', css_body)
        css_body = re.sub(r'border-radius:\s*[^;]+;', 'border-radius: 40px;', css_body)
        css_body = re.sub(r'margin-bottom:\s*[^;]+;', 'margin: 30px auto 40px auto;', css_body)
        return match.group(1) + css_body + match.group(3)
        
    new_content = re.sub(r'(@media.*?\{.*?)(\.[a-zA-Z0-9_-]+banner\s*\{)([^}]*)(\})', 
                         lambda m: m.group(1) + replace_responsive_css(re.match(r'(\.[a-zA-Z0-9_-]+banner\s*\{)([^}]*)(\})', m.group(2)+m.group(3)+m.group(4))), 
                         new_content, flags=re.DOTALL)
                         
    if new_content != content:
        with open(f, 'w') as file:
            file.write(new_content)
        print(f"Updated {f}")
