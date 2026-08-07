#!/usr/bin/env python3
"""Import the three policy documents from the WordPress site.

    python3 scripts/import-policies.py

Writes `src/content/policies.json`. Section headings arrive from WordPress as
`<h5>`/`<h6>`; they are promoted to `<h2>` (the page's own title is the `<h1>`)
and given stable ids so the sticky table of contents can link into them.

Like the blog importer, the output is committed — this runs once at migration
time, not on every build.
"""
import html
import json
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'content', 'policies.json')

PAGES = {
    'privacy-policy': ('/privacy-policy/', 'Privacy Policy'),
    'terms-conditions': ('/terms-conditions/', 'Terms & Conditions'),
    'delivery-refund-policy': ('/delivery-refund-policy/', 'Delivery & Refund Policy'),
}

ALLOWED = {
    'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br',
}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read().decode('utf-8', errors='ignore')


def keep_tag(match):
    closing, tag, attrs = match.group(1), match.group(2).lower(), match.group(3)
    if tag not in ALLOWED:
        return ''
    if closing:
        return f'</{tag}>'
    if tag == 'a':
        href = re.search(r'href="([^"]*)"', attrs)
        if not href:
            return ''
        url = re.sub(r'^https?://(www\.)?vanzoo\.in', '', href.group(1)) or '/'
        rel = ' target="_blank" rel="noopener noreferrer"' if url.startswith('http') else ''
        return f'<a href="{url}"{rel}>'
    return f'<{tag}>'


def slugify(text):
    text = html.unescape(re.sub(r'<[^>]+>', '', text)).strip().lower()
    text = re.sub(r'^\d+\.\s*', '', text)
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')[:60]


def main():
    docs = {}
    for slug, (route, heading) in PAGES.items():
        print(f'Fetching /{slug}/ …')
        page = fetch(f'https://vanzoo.in/{slug}/')

        title = re.search(r'<title>(.*?)</title>', page, re.S)
        description = re.search(r'<meta name="description" content="([^"]*)"', page)

        body = re.search(r'(?is)<main[^>]*>(.*?)</main>', page)
        body = body.group(1) if body else page
        body = re.sub(r'(?is)<(script|style|noscript|svg|nav|header|footer|form|iframe)[^>]*>.*?</\1>', '', body)
        body = re.sub(r'(?is)<!--.*?-->', '', body)
        body = re.sub(r'(?i)<h1([^>]*)>', r'<h2\1>', body)
        body = re.sub(r'(?i)</h1>', '</h2>', body)
        body = re.sub(r'(?i)<h[56]([^>]*)>', r'<h4\1>', body)
        body = re.sub(r'(?i)</h[56]>', '</h4>', body)
        body = re.sub(r'<(/?)([a-zA-Z0-9]+)((?:\s[^>]*)?)/?>', keep_tag, body)
        body = re.sub(r'(?i)<p>\s*(&nbsp;)?\s*</p>', '', body)

        # Everything before the page's own title is header chrome.
        body = re.sub(r'(?is)^.*?<h2>[^<]*</h2>', '', body, count=1).strip()

        toc = []

        def promote(match):
            text = match.group(1).strip()
            section_id = slugify(text)
            toc.append({'id': section_id, 'label': html.unescape(re.sub(r'<[^>]+>', '', text)).strip()})
            return f'<h2 id="{section_id}">{text}</h2>'

        body = re.sub(r'(?is)<h4>(.*?)</h4>', promote, body)
        body = re.sub(r'\n{3,}', '\n\n', body).strip()

        docs[slug] = {
            'title': html.unescape(title.group(1)).strip() if title else heading,
            'description': html.unescape(description.group(1)) if description else '',
            'heading': heading,
            'route': route,
            'toc': toc,
            'body': body,
        }
        print(f'  {len(toc)} sections')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as out:
        json.dump(docs, out, indent=2, ensure_ascii=False)
    print(f'Wrote {os.path.relpath(OUT, ROOT)}')


if __name__ == '__main__':
    main()
