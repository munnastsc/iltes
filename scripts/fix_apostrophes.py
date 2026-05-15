"""Fix unescaped apostrophes inside single-quoted TypeScript string literals."""
import re

with open('E:/antigravity/ILTES/src/lib/mockTests23Data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def escape_inner_apostrophes(inner):
    """Escape unescaped apostrophes in the content of a single-quoted TS string."""
    result = []
    i = 0
    while i < len(inner):
        ch = inner[i]
        if ch == '\\' and i + 1 < len(inner):
            # Already escaped — keep both chars
            result.append(ch)
            result.append(inner[i + 1])
            i += 2
        elif ch == "'":
            # Unescaped apostrophe — escape it
            result.append("\\'")
            i += 1
        else:
            result.append(ch)
            i += 1
    return ''.join(result)


lines = content.split('\n')
fixed_count = 0
new_lines = []

for line in lines:
    stripped = line.strip()
    leading_ws = line[:len(line) - len(line.lstrip())]

    # Target: lines that are a TS value — start with ' and end with ', or ','
    # These are the single-quoted string literals
    if len(stripped) > 2 and stripped[0] == "'" and (
        stripped.endswith("',") or stripped.endswith("'") or stripped.endswith("'.")
    ):
        # Determine suffix
        if stripped.endswith("',"):
            suffix = "',"
            inner = stripped[1:-2]
        elif stripped.endswith("'."):
            suffix = "'."
            inner = stripped[1:-2]
        else:
            suffix = "'"
            inner = stripped[1:-1]

        # Check for unescaped apostrophe inside
        has_unescaped = False
        i = 0
        while i < len(inner):
            if inner[i] == '\\' and i + 1 < len(inner):
                i += 2
            elif inner[i] == "'":
                has_unescaped = True
                break
            else:
                i += 1

        if has_unescaped:
            new_inner = escape_inner_apostrophes(inner)
            new_line = f"{leading_ws}'{new_inner}{suffix}"
            new_lines.append(new_line)
            fixed_count += 1
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)

print(f"Lines fixed: {fixed_count}")

new_content = '\n'.join(new_lines)
with open('E:/antigravity/ILTES/src/lib/mockTests23Data.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

# Verify
with open('E:/antigravity/ILTES/src/lib/mockTests23Data.ts', 'r', encoding='utf-8') as f:
    verify = f.read()

for i, vline in enumerate(verify.split('\n')):
    if 'electric vehicle' in vline.lower() and 'market has grown' in vline:
        idx = vline.find("grid")
        if idx >= 0:
            print(f"EV passage line {i+1}, grid context: {repr(vline[idx:idx+25])}")
        break

print("Done.")
