#!/bin/bash
#
# Re-capture every screenshot the case studies use.
#
#   ./scripts/capture-shots.sh site      the live Zane Atlas site, in Chrome
#   ./scripts/capture-shots.sh app       the Monsoon UI build, in the simulator
#
# Both write straight into public/shots/. Nothing here is a mockup: if the site
# or the app changes, run this and the case study is current again.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
APP_SRC="${MONSOON_SRC:-$HOME/Desktop/Workspace/experiments/monsoon-ios}"
TMP=$(mktemp -d)

capture_site() {
  local out=public/shots/zane-atlas
  mkdir -p "$out"

  # One tall viewport, so lazy sections have all rendered, then crop by offset.
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --window-size=1440,9200 --virtual-time-budget=15000 \
    --screenshot="$TMP/tall.png" https://www.zaneatlas.com

  # section top (CSS px) × 2, plus a little breathing room
  crop() { sips -c 1800 2880 --cropOffset "$2" 0 "$TMP/tall.png" --out "$out/$1.png" >/dev/null; sips -Z 2160 "$out/$1.png" >/dev/null; }
  crop hero 0
  crop services 3008
  crop demos 5480
  crop process 7334
  crop pricing 9550
  echo "captured $out"
}

capture_app() {
  local out=public/shots/monsoon
  mkdir -p "$out"
  export DEVELOPER_DIR=${DEVELOPER_DIR:-/Applications/Xcode.app/Contents/Developer}

  "$APP_SRC/build.sh"
  xcrun simctl boot "iPhone 17 Pro" 2>/dev/null || true
  sleep 8
  xcrun simctl install booted "$APP_SRC/build/Monsoon.app"
  xcrun simctl status_bar booted override --time "9:41" \
    --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3

  shoot() { # screen scheme name
    SIMCTL_CHILD_SCREEN=$1 SIMCTL_CHILD_SCHEME=$2 xcrun simctl launch booted design.isha.monsoon >/dev/null
    sleep 4
    xcrun simctl io booted screenshot --type=png "$TMP/$3.png" >/dev/null
    xcrun simctl terminate booted design.isha.monsoon >/dev/null
    sips -Z 1400 "$TMP/$3.png" --out "$out/$3.png" >/dev/null
  }
  shoot runway light runway-light
  shoot log light log-light
  shoot plan light plan-light
  shoot runway dark runway-dark
  shoot plan dark plan-dark
  shoot tight light tight-light
  echo "captured $out — rebuild the deck cover with scripts/cover.html if the screens changed"
}

case "${1:-}" in
  site) capture_site ;;
  app) capture_app ;;
  *) echo "usage: $0 site|app" && exit 1 ;;
esac
