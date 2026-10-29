#!/usr/bin/env python3
"""Lumos naming guard for Adfin (see LUMOS.md).

PreToolUse hook. Blocks Figma writes to the Adfin file that name layers
outside the Lumos convention, and Webflow writes to the Adfin site that
create non-Lumos classes or raw hex values. Other files and sites pass.
"""
import json
import os
import re
import sys

ADFIN_FILE = 'XTzsrBUInVH9Rk4UbqvwJd'
ADFIN_SITE = '6a69cb89a361f85b63b37d60'
DOC = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'LUMOS.md'))

PART = r'[a-z0-9]+(?:-[a-z0-9]+)*'
CLASS = re.compile(rf'^{PART}(?:_{PART}){{1,3}}$')
COMBO = re.compile(rf'^(?:u|is|w)-{PART}$')
HEX = re.compile(r'#[0-9a-fA-F]{3,8}\b')
NAME_SET = [
    re.compile(r'\.name\s*=\s*([\'"`])((?:\\.|(?!\1).)*)\1'),
    # object keys only: not `x.name : y` in a ternary
    re.compile(r'(?<![.\w])name\s*:\s*([\'"`])((?:\\.|(?!\1).)*)\1'),
]
CLASS_KEYS = {'style_name', 'styleName', 'styles', 'classes', 'class', 'class_name', 'className'}


def allowlist():
    try:
        text = open(DOC).read()
    except OSError:
        return []
    m = re.search(r'```lumos-allow\n(.*?)```', text, re.S)
    return [l.strip() for l in m.group(1).splitlines() if l.strip()] if m else []


def allowed(name, allow):
    for a in allow:
        if a.endswith('*') and name.startswith(a[:-1]):
            return True
        if name == a:
            return True
    return False


def lumos_name(name):
    tokens = name.split()
    return bool(tokens) and CLASS.match(tokens[0]) and all(COMBO.match(t) or CLASS.match(t) for t in tokens[1:])


def figma_names(code):
    for rx in NAME_SET:
        for m in rx.finditer(code):
            # template literal parts stand in as a valid lowercase part
            yield re.sub(r'\$\{[^}]*\}', 'x', m.group(2))


def walk(node, key=None):
    if isinstance(node, dict):
        for k, v in node.items():
            yield from walk(v, k)
    elif isinstance(node, list):
        for v in node:
            yield from walk(v, key)
    elif isinstance(node, str):
        yield key, node


def deny(reason):
    print(json.dumps({'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': 'deny',
        'permissionDecisionReason': reason,
    }}))
    sys.exit(0)


def main():
    data = json.load(sys.stdin)
    tool = data.get('tool_name', '')
    inp = data.get('tool_input', {}) or {}
    raw = json.dumps(inp)
    allow = allowlist()

    if tool.endswith('use_figma'):
        if inp.get('fileKey') != ADFIN_FILE:
            return
        bad = sorted({n for n in figma_names(inp.get('code', ''))
                      if '=' not in n and not allowed(n, allow) and not lumos_name(n)})
        if bad:
            deny(f'Adfin Figma layers must use Lumos class names (see {DOC}). '
                 f'Rename: {", ".join(bad[:12])}. Variant names (Prop=Value), allowlisted '
                 f'component names and "Doc / " frames are exempt.')
        return

    if ADFIN_SITE not in raw:
        return
    bad, hexes = set(), set()
    for key, val in walk(inp):
        if key in CLASS_KEYS:
            for tok in val.split():
                if not (CLASS.match(tok) or COMBO.match(tok)):
                    bad.add(tok)
        for cls in re.findall(r'class="([^"]*)"', val):
            for tok in cls.split():
                if not (CLASS.match(tok) or COMBO.match(tok)):
                    bad.add(tok)
        if key in ('property_value', 'value', 'css') and HEX.search(val):
            hexes.add(val)
    if bad or hexes:
        parts = []
        if bad:
            parts.append(f'non-Lumos classes: {", ".join(sorted(bad)[:12])}')
        if hexes:
            parts.append(f'raw hex values (use --_theme---* variables): {", ".join(sorted(hexes)[:6])}')
        deny(f'Adfin Webflow writes must follow Lumos ({DOC}): ' + '; '.join(parts) + '.')


if __name__ == '__main__':
    main()
