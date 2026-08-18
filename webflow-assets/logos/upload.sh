#!/bin/bash
# Completes a Webflow presigned S3 asset upload.
# usage: upload.sh <file> <key> <policy> <signature> <credential> <amzdate>
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
file="$1"; key="$2"; policy="$3"; sig="$4"; cred="$5"; amzdate="$6"

code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "https://webflow-prod-assets.s3.amazonaws.com/" \
  -F "acl=public-read" \
  -F "bucket=webflow-prod-assets" \
  -F "X-Amz-Algorithm=AWS4-HMAC-SHA256" \
  -F "X-Amz-Credential=$cred" \
  -F "X-Amz-Date=$amzdate" \
  -F "key=$key" \
  -F "Policy=$policy" \
  -F "X-Amz-Signature=$sig" \
  -F "success_action_status=201" \
  -F "Content-Type=image/png" \
  -F "Cache-Control=max-age=31536000" \
  -F "file=@$DIR/files/$file;type=image/png")

if [ "$code" = "201" ]; then
  printf 'ok    %s\n' "$file"
else
  printf 'FAIL  %s (http %s)\n' "$file" "$code"
  exit 1
fi
