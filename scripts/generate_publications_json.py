#!/usr/bin/env python3
"""Regenerate api/publications.json from the publication markup in index.md.

Run from the repo root after adding or editing publications:

    python3 scripts/generate_publications_json.py
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://abhishekdas.com"

PUB_RE = re.compile(
    r'<h2 class="pubt">((?:(?!</h2>).)*)</h2>\s*<p class="pubd"[^>]*>(.*?)</p>',
    re.DOTALL,
)
AUTHORS_RE = re.compile(r'<span class="authors">(.*?)</span>', re.DOTALL)
CONF_RE = re.compile(r'<span class="conf">(.*?)</span>', re.DOTALL)
LINK_RE = re.compile(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', re.DOTALL)
TAG_RE = re.compile(r"<[^>]+>")


def clean(html: str) -> str:
    return re.sub(r"\s+", " ", TAG_RE.sub("", html)).strip()


def main() -> None:
    text = (ROOT / "index.md").read_text(encoding="utf-8")
    # Anchors precede the pub block, separated by the block wrapper; capture
    # them by scanning for the nearest preceding <a name> before each title.
    anchors = {m.end(): m.group(1) for m in re.finditer(r'<a name="([^"]+)"></a>', text)}

    publications = []
    for m in PUB_RE.finditer(text):
        title_html, body = m.group(1), m.group(2)
        preceding = [pos for pos in anchors if pos < m.start()]
        anchor = anchors[max(preceding)] if preceding else None

        authors_m = AUTHORS_RE.search(body)
        conf_m = CONF_RE.search(body)
        venue = clean(conf_m.group(1)) if conf_m else None
        year_m = re.search(r"(19|20)\d{2}", venue or "")

        links = {}
        links_html = body.split('class="links"', 1)
        if len(links_html) == 2:
            for url, label in LINK_RE.findall(links_html[1]):
                links[clean(label).lower()] = url

        publications.append(
            {
                "title": clean(title_html),
                "authors": [a.strip() for a in clean(authors_m.group(1)).split(",")] if authors_m else [],
                "venue": venue,
                "year": int(year_m.group(0)) if year_m else None,
                "url": f"{SITE_URL}/#{anchor}" if anchor else f"{SITE_URL}/#publications",
                "links": links,
            }
        )

    out = {
        "$schema": f"{SITE_URL}/openapi.json",
        "source": f"{SITE_URL}/",
        "author": "Abhishek Das",
        "note": "Author lists preserve the site's markup; an asterisk (*) marks equal contribution. See Google Scholar for an exhaustive, up-to-date list.",
        "google_scholar": "https://scholar.google.com/citations?user=t6exkOAAAAAJ",
        "count": len(publications),
        "publications": publications,
    }
    dest = ROOT / "api" / "publications.json"
    dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {dest} ({len(publications)} publications)")


if __name__ == "__main__":
    main()
