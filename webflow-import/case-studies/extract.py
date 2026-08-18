#!/usr/bin/env python3
"""Extract structured case study content from Webflow element-tree dumps.

The five case study pages on Adfin production share one hand-built layout. This walks
each dump and pulls out the parts that map onto CMS fields:

  - hero      : eyebrow, headline, intro, up to 3 stats, optional video caption
  - quote     : the big pull quote plus attribution
  - facts     : the sidebar key/value panel, including product chips
  - sections  : At a glance / Challenge / Solution / Results, each rendered to HTML
  - beforeafter: the Before Adfin / After Adfin comparison rows

usage: extract.py <dump.txt> [<dump.txt> ...]   -> writes case-studies JSON to stdout
"""
import json, sys, html, re

# ---------------------------------------------------------------- loading

def load(path):
    raw = open(path, encoding="utf-8").read()
    d = json.loads(raw)
    if isinstance(d, list):                     # persisted [{type,text}] envelope
        d = json.loads(d[0]["text"])
    res = d["result"]
    if isinstance(res, list):                   # one entry per action; first is the tree
        res = res[0]
    return res.get("data", res)

# ---------------------------------------------------------------- helpers

def styles(n):
    return set(n.get("styleNames") or [])

def inline_text(n):
    """Concatenate every descendant String, preserving document order."""
    out = []
    def rec(x):
        for k in x.get("children") or []:
            if k.get("type") == "String":
                out.append(k.get("textContent", ""))
            else:
                rec(k)
    rec(n)
    return "".join(out).strip()

def flatten(root):
    """Depth-first list of (node, styleset) so we can read the page in visual order."""
    seq = []
    def rec(n):
        seq.append(n)
        for k in n.get("children") or []:
            if k.get("type") != "String":
                rec(k)
    rec(root)
    return seq

def esc(s):
    return html.escape(s, quote=False)

# ---------------------------------------------------------------- extraction

SECTION_ALIASES = {
    "AT A GLANCE": "at_a_glance", "SUMMARY": "at_a_glance",
    "CHALLENGE": "challenge", "SOLUTION": "solution",
    "RESULTS": "results", "LOOKING AHEAD": "results",
}

def extract(root):
    seq = flatten(root)
    doc = {
        "eyebrow": "", "headline": "", "intro": "", "video_caption": "",
        "stats": [], "quote": "", "quote_name": "", "quote_role": "",
        "facts": {}, "products": [], "website": "", "images": [],
        "result_stats": [], "before_after": [], "sections": {},
    }
    cur = None          # current section key
    body = []           # accumulating (kind, payload) for the current section
    pend_k = None       # pending fact key
    pend_stat = None    # pending stat number
    pend_res = None     # pending result number
    ba_before = None    # pending before card
    quote_p = None      # pending quote paragraph

    def flush_section():
        nonlocal body
        if cur and body:
            doc["sections"].setdefault(cur, []).extend(body)
        body = []

    for n in seq:
        st = styles(n)
        typ = n.get("type")
        txt = inline_text(n)
        settings = n.get("settings") or {}

        if typ == "Image" and settings.get("assetId"):
            doc["images"].append(settings["assetId"]); continue

        # --- hero -------------------------------------------------------
        if "cs-eyebrow" in st and "hero-padding" in st:
            doc["eyebrow"] = txt; continue
        if "heading-style-h1" in st:
            doc["headline"] = txt; continue
        if "text-size-medium" in st and not doc["intro"]:
            doc["intro"] = txt; continue
        if "cs-video-cap-1" in st:
            doc["video_caption"] = txt; continue
        if "cs-stat-num" in st:
            pend_stat = txt; continue
        if "cs-stat-label" in st and pend_stat is not None:
            doc["stats"].append({"value": pend_stat, "label": txt}); pend_stat = None; continue

        # --- big quote --------------------------------------------------
        if "cs-bigquote" in st:
            doc["quote"] = txt; continue
        if "cs-attrib-name" in st:
            doc["quote_name"] = txt; continue
        if "cs-attrib-role" in st:
            doc["quote_role"] = txt; continue

        # --- fact panel -------------------------------------------------
        if "cs-fact-k" in st:
            pend_k = txt; continue
        if "cs-fact-v" in st and pend_k:
            doc["facts"][pend_k] = txt; pend_k = None; continue
        if "cs-fact-link" in st:
            doc["website"] = (settings.get("link") or {}).get("href") or ""
            doc["facts"][pend_k or "Website"] = txt; pend_k = None; continue
        if "cs-chip" in st:
            doc["products"].append(txt); continue

        # --- section markers --------------------------------------------
        if "cs-eyebrow" in st:
            # eyebrows are typed with non-breaking spaces, so normalise before matching
            key = SECTION_ALIASES.get(txt.replace(" ", " ").strip().upper())
            if key:
                flush_section()
                globals()["__cur"] = key
                cur = key
            continue

        # --- before / after ---------------------------------------------
        if "cs-card-title" in st:
            if "cs-card-title-cream" in st: ba_after_title = txt; doc.setdefault("_at", txt)
            else: doc["_bt"] = txt
            continue
        if "cs-card-text" in st:
            if "cs-card-text-cream" in st:
                doc["before_after"].append({
                    "before_title": doc.pop("_bt", ""), "before_text": doc.pop("_bx", ""),
                    "after_title": doc.pop("_at", ""),  "after_text": txt})
            else:
                doc["_bx"] = txt
            continue

        # --- result stat -------------------------------------------------
        if "cs-result-num" in st:
            pend_res = txt; continue
        if "cs-result-label" in st and pend_res is not None:
            doc["result_stats"].append({"value": pend_res, "label": txt}); pend_res = None; continue

        # --- section body ------------------------------------------------
        if not cur:
            continue
        if "cs-quote-cite" in st:
            body.append(("cite", txt)); continue
        if "cs-quote-p" in st:
            body.append(("quote", txt)); continue
        if typ == "ListItem":
            body.append(("li", txt)); continue
        if "heading-style-h3" in st:
            body.append(("h3", txt)); continue
        if "heading-style-h6" in st:
            body.append(("h4", txt)); continue
        if "cs-body" in st and txt:
            body.append(("p", txt)); continue
        if typ == "Strong" and txt and not body:
            body.append(("h3", txt)); continue

    flush_section()
    for k in ("_bt", "_bx", "_at"): doc.pop(k, None)
    doc["sections"] = {k: render(v) for k, v in doc["sections"].items()}
    return doc

def render(items):
    """Turn (kind, text) pairs into HTML, folding cites into their quote."""
    out, i = [], 0
    while i < len(items):
        kind, txt = items[i]
        if kind == "li":
            lis = []
            while i < len(items) and items[i][0] == "li":
                lis.append(f"<li>{esc(items[i][1])}</li>"); i += 1
            out.append("<ul>" + "".join(lis) + "</ul>"); continue
        if kind == "quote":
            cite = ""
            if i + 1 < len(items) and items[i + 1][0] == "cite":
                cite = items[i + 1][1]; i += 1
            block = f"<blockquote><p>{esc(txt)}</p>"
            if cite: block += f"<cite>{esc(cite)}</cite>"
            out.append(block + "</blockquote>"); i += 1; continue
        if kind == "cite":
            i += 1; continue
        tag = {"h3": "h3", "h4": "h4", "p": "p"}[kind]
        out.append(f"<{tag}>{esc(txt)}</{tag}>"); i += 1
    return "".join(out)

if __name__ == "__main__":
    print(json.dumps([extract(load(p)) for p in sys.argv[1:]], ensure_ascii=False, indent=1))
