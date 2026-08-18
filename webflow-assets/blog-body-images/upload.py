#!/usr/bin/env python3
"""Complete Webflow presigned S3 uploads from a TSV of short fields.

The presigned POST policy Webflow returns is byte-exactly reconstructible from
(siteId, assetId, fileName, xAmzDate, contentType), so only the signature has to
be carried across verbatim.  TSV columns:
    fileName  assetId  xAmzDate  signature  contentType
"""
import base64, datetime, subprocess, sys, os

SITE = "6a69cb89a361f85b63b37d60"
HERE = os.path.dirname(os.path.abspath(__file__))

def policy(asset_id, fname, date, ct):
    exp = (datetime.datetime.strptime(date, "%Y%m%dT%H%M%SZ")
           + datetime.timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
    cred = f"AKIAQLLHWD6MEJGETLST/{date[:8]}/us-east-1/s3/aws4_request"
    p = ('{"expiration":"%s","conditions":[["starts-with","$key","%s/"],{"cache-control":"max-age=31536000"},'
         '{"Content-Type":"%s"},{"success_action_status":"201"},["starts-with","$Content-Type","%s"],'
         '["content-length-range",0,31457280],{"acl":"public-read"},{"bucket":"webflow-prod-assets"},'
         '{"X-Amz-Algorithm":"AWS4-HMAC-SHA256"},{"X-Amz-Credential":"%s"},{"X-Amz-Date":"%s"},{"key":"%s"}]}'
        ) % (exp, SITE, ct, ct, cred, date, f"{SITE}/{asset_id}_{fname}")
    return base64.b64encode(p.encode()).decode()

ok = fail = 0
for line in open(sys.argv[1]):
    line = line.rstrip("\n")
    if not line.strip():
        continue
    fname, asset_id, date, sig, ct = line.split("\t")
    src = f"{HERE}/files/{fname}"
    r = subprocess.run([
        "curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}",
        "-X", "POST", "https://webflow-prod-assets.s3.amazonaws.com/",
        "-F", "acl=public-read",
        "-F", "bucket=webflow-prod-assets",
        "-F", "X-Amz-Algorithm=AWS4-HMAC-SHA256",
        "-F", f"X-Amz-Credential=AKIAQLLHWD6MEJGETLST/{date[:8]}/us-east-1/s3/aws4_request",
        "-F", f"X-Amz-Date={date}",
        "-F", f"key={SITE}/{asset_id}_{fname}",
        "-F", f"Policy={policy(asset_id, fname, date, ct)}",
        "-F", f"X-Amz-Signature={sig}",
        "-F", "success_action_status=201",
        "-F", f"Content-Type={ct}",
        "-F", "Cache-Control=max-age=31536000",
        "-F", f"file=@{src};type={ct}",
    ], capture_output=True, text=True)
    if r.stdout.strip() == "201":
        ok += 1
        print(f"  ok   {fname}")
    else:
        fail += 1
        print(f"  FAIL {fname} (http {r.stdout.strip()})")
print(f"\nuploaded={ok} failed={fail}")
sys.exit(1 if fail else 0)
