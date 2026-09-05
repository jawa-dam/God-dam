#!/usr/bin/env python3
"""Genesis Engineered Interpretations — day page generator.

Usage:  python3 tools/make_day.py <dayNumber> <dataFile>

Splices a per-day DATA block (assets/data-dayN.js) into the engine template
(index.html) and rewrites the page-specific HTML strings, emitting dayN.html.
Days 3-6 (and 7!) only need a new data file + a config entry below.
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "index.html"

CONFIG = {
    2: dict(
        title="Day 2 — The Vault of the Sky · Genesis Engineered Interpretations",
        desc="Read it, map it, build it, beat it: four ways to play with every word of Genesis Day 2 (KJV) — the firmament, the divided waters, and the naming of Heaven.",
        subtitle="DAY 2 · read it · map it · build it · beat it",
        h2="Genesis 1:6–8 (KJV) · the playground",
        aria="Genesis 1 verses 6 to 8, clickable words",
        goal=('<div id="buildGoal"> <b>Build-a-Verse challenge:</b> reconstruct <b>Genesis 1:6</b> — '
              '“And God said, Let there be a firmament in the midst of the waters, and let it divide the waters '
              'from the waters.” — word for word, mark for mark. Click chips to lay them; click a laid chip to remove it.</div>'),
    ),
    # 3: dict(title=..., desc=..., subtitle=..., h2=..., aria=..., goal=...),
}

def pills(day: int) -> str:
    out = ['      <a class="pill%s" href="index.html">Day 1</a>' % (" active" if day == 1 else "")]
    for i in range(2, 7):
        cls = " active" if i == day else (" soon" if i > day or i not in CONFIG and i != day else "")
        if i == day:
            cls = " active"
        elif i in CONFIG or i == 1:
            cls = ""
        else:
            cls = " soon"
        out.append('      <a class="pill%s" href="day%d.html">Day %d</a>' % (cls, i, i))
    out.append('      <a class="pill" href="about.html">About</a>')
    return "\n".join(out)

def main():
    day = int(sys.argv[1]); data = pathlib.Path(sys.argv[2]).read_text(encoding="utf-8")
    cfg = CONFIG[day]
    src = TEMPLATE.read_text(encoding="utf-8")

    m_start = src.index("/* ================= DATA")
    m_end = src.index("/* ================= ENGINE")
    src = src[:m_start] + data.rstrip() + "\n\n" + src[m_end:]

    pill_block = re.search(r'      <a class="pill active" href="index\.html">Day 1</a>.*?      <a class="pill" href="about\.html">About</a>', src, re.S)
    assert pill_block, "pill block not found"
    src = src[:pill_block.start()] + pills(day) + src[pill_block.end():]

    src = re.sub(r"<title>.*?</title>", "<title>%s</title>" % cfg["title"], src, count=1)
    src = re.sub(r'<meta name="description" content=".*?">', '<meta name="description" content="%s">' % cfg["desc"], src, count=1)
    src = re.sub(r"<p>DAY \d · read it · map it · build it · beat it</p>", "<p>%s</p>" % cfg["subtitle"], src, count=1)
    src = re.sub(r'<h2><span class="dot"></span>Genesis 1:\d+–\d+ \(KJV\) · the playground</h2>',
                 '<h2><span class="dot"></span>%s</h2>' % cfg["h2"], src, count=1)
    src = re.sub(r'aria-label="Genesis 1 verses \d+ to \d+, clickable words"', 'aria-label="%s"' % cfg["aria"], src, count=1)
    src = re.sub(r'<div id="buildGoal">.*?</div>', cfg["goal"], src, count=1, flags=re.S)

    out = ROOT / ("day%d.html" % day)
    out.write_text(src, encoding="utf-8")
    print("wrote", out.name, len(src), "bytes")

if __name__ == "__main__":
    main()
