#!/bin/sh
# Lumos reminder, injected on every prompt (see CLAUDE.md and LUMOS.md)
cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"Adfin build check (LUMOS.md): Figma layers and Webflow classes use Lumos names from the nav class map ([component]_[type]_[element], max 3 underscores, _wrap roots, is-* combos, u-* utilities). Hover via data-trigger and --_trigger---on, never :hover. Theme variables only, solid lines only. Existing component or class first; new classes go into LUMOS.md before use. Publishing needs Ben's OK every time."}}
EOF
