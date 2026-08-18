#!/usr/bin/env python3
"""Flatten a Webflow data_element_tool get_all_elements dump into a readable outline.

usage: parse_tree.py <dump.txt> [--json]
Emits one line per content-bearing element: indent, type, styles, and text/asset/link.
"""
import json, sys, re

def load(path):
    raw = open(path, encoding='utf-8').read()
    d = json.loads(raw)
    if isinstance(d, list):                      # persisted [{type,text}] wrapper
        d = json.loads(d[0]["text"])
    res = d["result"]
    res = res[0] if isinstance(res, list) else res
    return res["data"] if "data" in res else res

SKIP_TEXT = {"Read story"}

def walk(node, depth=0, out=None):
    out = [] if out is None else out
    t = node.get("type")
    styles = node.get("styleNames") or []
    kids = node.get("children") or []
    # direct string children make up this element's own text
    text = "".join(k.get("textContent","") for k in kids if k.get("type") == "String").strip()
    settings = node.get("settings") or {}
    asset = settings.get("assetId")
    link = (settings.get("link") or {}).get("href")
    vis = settings.get("visibility")
    inst = node.get("instanceDetails") or {}

    entry = None
    if t == "ComponentInstance":
        entry = {"depth":depth,"type":"Component","styles":[],"text":inst.get("name",""),"asset":None,"link":None,"visible":vis}
    elif asset:
        entry = {"depth":depth,"type":t,"styles":styles,"text":text,"asset":asset,"link":None,"visible":vis}
    elif link:
        entry = {"depth":depth,"type":t,"styles":styles,"text":text,"asset":None,"link":link,"visible":vis}
    elif text and text not in SKIP_TEXT:
        entry = {"depth":depth,"type":t,"styles":styles,"text":text,"asset":None,"link":None,"visible":vis}
    if entry: out.append(entry)

    for k in kids:
        if k.get("type") != "String":
            walk(k, depth+1, out)
    return out

if __name__ == "__main__":
    items = walk(load(sys.argv[1]))
    if "--json" in sys.argv:
        print(json.dumps(items, ensure_ascii=False, indent=1)); sys.exit()
    for e in items:
        pad = "  " * min(e["depth"], 12)
        tag = e["type"]
        st = ("." + ".".join(e["styles"])) if e["styles"] else ""
        hid = "  [HIDDEN]" if e["visible"] is False else ""
        val = e["text"]
        if e["asset"]: val = f"<asset {e['asset']}>"
        if e["link"]:  val = f"{e['text']}  -> {e['link']}"
        print(f"{pad}{tag}{st}{hid}: {val[:300]}")
