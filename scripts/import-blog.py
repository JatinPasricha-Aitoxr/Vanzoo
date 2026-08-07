#!/usr/bin/env python3
"""Import the WordPress blog into the static content layer.

    python3 scripts/import-blog.py

Fetches every published post from the old WordPress REST API, sanitises the
body HTML down to a fixed tag whitelist, downloads the images alongside, and
writes `src/content/posts.json`.

The output is committed, so the build never depends on the old CMS being
reachable. Re-run this only when migrating content across — day-to-day, new
posts are added by editing posts.json directly (see README).

Publish dates are carried over untouched: they feed `datePublished` in the
BlogPosting schema, and re-stamping them would tell Google that seventy-three
old articles were all published today.
"""
import hashlib
import html
import json
import os
import re
import urllib.parse
import urllib.request

SOURCE = 'https://vanzoo.in/wp-json/wp/v2/posts'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, 'public', 'images', 'blog')
OUT = os.path.join(ROOT, 'src', 'content', 'posts.json')

WORDS_PER_MIN = 225
MAX_IMAGE_WIDTH = 1600

ALLOWED = {
    'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
    'a', 'blockquote', 'figure', 'figcaption', 'img', 'br', 'table',
    'thead', 'tbody', 'tr', 'th', 'td',
}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'vanzoo-import/1.0'})
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read())


def fetch_all_posts():
    posts, page = [], 1
    while True:
        batch = fetch(
            f'{SOURCE}?per_page=25&page={page}'
            '&_embed=wp:featuredmedia,wp:term'
            '&_fields=id,slug,date,modified,title,excerpt,content,_links,_embedded'
        )
        if not batch:
            break
        posts += batch
        if len(batch) < 25:
            break
        page += 1
    return posts


downloads = {}


def local_image(url, slug):
    """Map a remote upload to a stable local path, queuing it for download."""
    if not url:
        return None
    ext = os.path.splitext(url.split('?')[0])[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'):
        ext = '.jpg'
    digest = hashlib.sha1(url.encode()).hexdigest()[:8]
    name = f'{slug[:60]}-{digest}{ext}'
    downloads[url] = os.path.join(IMG_DIR, name)
    return f'/images/blog/{name}'


def strip_tags(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def clean_html(raw, slug):
    """Reduce WordPress markup to the semantic subset `.prose-vanzoo` styles.

    Tags are whitelisted rather than blacklisted, so a stray inline style or
    block-editor wrapper from the old theme can never leak into the rebuild —
    and, since the result is injected with dangerouslySetInnerHTML, so that no
    script or event-handler attribute can survive the import either.
    """
    s = re.sub(r'(?is)<(script|style|iframe)[^>]*>.*?</\1>', '', raw)
    s = re.sub(r'(?is)<!--.*?-->', '', s)
    # An h1 in the body would compete with the page's own h1.
    s = re.sub(r'(?i)<h1([^>]*)>', r'<h2\1>', s)
    s = re.sub(r'(?i)</h1>', '</h2>', s)
    s = re.sub(r'(?i)<h[56]([^>]*)>', r'<h4\1>', s)
    s = re.sub(r'(?i)</h[56]>', '</h4>', s)

    def keep(match):
        closing, tag, attrs = match.group(1), match.group(2).lower(), match.group(3)
        if tag not in ALLOWED:
            return ''
        if closing:
            return f'</{tag}>'
        if tag == 'a':
            href = re.search(r'href="([^"]*)"', attrs)
            if not href:
                return ''
            # Absolute self-links become relative so they survive a domain move.
            url = re.sub(r'^https?://(www\.)?vanzoo\.in', '', href.group(1)) or '/'
            rel = ' target="_blank" rel="noopener noreferrer"' if url.startswith('http') else ''
            return f'<a href="{url}"{rel}>'
        if tag == 'img':
            src = re.search(r'src="([^"]*)"', attrs)
            if not src:
                return ''
            alt = re.search(r'alt="([^"]*)"', attrs)
            local = local_image(src.group(1), slug)
            return f'<img src="{local}" alt="{alt.group(1) if alt else ""}" loading="lazy" decoding="async" />'
        return f'<{tag}>'

    s = re.sub(r'<(/?)([a-zA-Z0-9]+)((?:\s[^>]*)?)/?>', keep, s)
    s = re.sub(r'(?i)<p>\s*(&nbsp;)?\s*</p>', '', s)
    return re.sub(r'\n{3,}', '\n\n', s).strip()


def download_images():
    """Fetch each queued image, then downscale and re-encode it.

    Article images are served into a 720px prose column and a ~1200px hero, so
    anything wider than MAX_IMAGE_WIDTH is dead weight in the repo.
    """
    try:
        from PIL import Image
    except ImportError:
        Image = None
        print('  Pillow not installed — images will be saved at original size')

    ok = failed = 0
    for url, path in downloads.items():
        if os.path.exists(path) and os.path.getsize(path) > 0:
            ok += 1
            continue
        parts = urllib.parse.urlsplit(url)
        # Percent-encode the path: several uploads have non-ASCII filenames.
        encoded = urllib.parse.urlunsplit(
            (parts.scheme, parts.netloc, urllib.parse.quote(parts.path), parts.query, '')
        )
        for attempt in range(3):
            try:
                req = urllib.request.Request(encoded, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=60) as response, open(path, 'wb') as out:
                    out.write(response.read())
                ok += 1
                break
            except Exception as error:  # noqa: BLE001 - report and continue
                if attempt == 2:
                    failed += 1
                    print(f'  FAILED {url}: {error}')

        if Image and os.path.exists(path):
            try:
                image = Image.open(path)
                if image.width > MAX_IMAGE_WIDTH:
                    height = round(image.height * MAX_IMAGE_WIDTH / image.width)
                    image = image.resize((MAX_IMAGE_WIDTH, height), Image.LANCZOS)
                if path.lower().endswith(('.jpg', '.jpeg')):
                    image.convert('RGB').save(path, 'JPEG', quality=80, optimize=True, progressive=True)
                else:
                    image.save(path, optimize=True)
            except Exception:  # noqa: BLE001 - a non-optimisable image is still usable
                pass
    print(f'  images: {ok} ok, {failed} failed')


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    print(f'Fetching posts from {SOURCE} …')
    raw_posts = fetch_all_posts()
    print(f'  {len(raw_posts)} posts')

    posts = []
    for raw in raw_posts:
        slug = raw['slug']
        embedded = raw.get('_embedded', {})
        media = (embedded.get('wp:featuredmedia') or [{}])[0]
        terms = embedded.get('wp:term') or []
        categories = [t['name'] for t in (terms[0] if terms else []) if t.get('name')]
        tags = [t['name'] for t in (terms[1] if len(terms) > 1 else []) if t.get('name')]

        body = clean_html(raw['content']['rendered'], slug)
        words = len(strip_tags(body).split())
        excerpt = strip_tags(raw['excerpt']['rendered']).replace('[…]', '…').replace(' …', '…')

        posts.append({
            'slug': slug,
            'title': strip_tags(raw['title']['rendered']),
            'excerpt': excerpt,
            'publishedAt': raw['date'],
            'updatedAt': raw['modified'],
            'categories': categories or ['Fabric Care'],
            'tags': tags,
            'image': local_image(media.get('source_url'), slug),
            'imageAlt': media.get('alt_text') or strip_tags(raw['title']['rendered']),
            'readingMinutes': max(1, round(words / WORDS_PER_MIN)),
            'body': body,
        })

    posts.sort(key=lambda p: p['publishedAt'], reverse=True)

    print(f'Downloading {len(downloads)} images …')
    download_images()

    # Point at whatever extension the optimiser actually produced.
    available = set(os.listdir(IMG_DIR))

    def resolve(path):
        if not path:
            return None
        name = os.path.basename(path)
        if name in available:
            return path
        alternative = os.path.splitext(name)[0] + '.jpg'
        return f'/images/blog/{alternative}' if alternative in available else None

    for post in posts:
        post['image'] = resolve(post['image'])
        post['body'] = re.sub(
            r'src="(/images/blog/[^"]+)"',
            lambda m: f'src="{resolve(m.group(1)) or ""}"',
            post['body'],
        )
        # Drop any image that failed rather than shipping a broken <img>.
        post['body'] = re.sub(r'<img src=""[^>]*>', '', post['body'])

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as out:
        json.dump(posts, out, indent=2, ensure_ascii=False)
    print(f'Wrote {len(posts)} posts to {os.path.relpath(OUT, ROOT)}')


if __name__ == '__main__':
    main()
