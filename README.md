# Genesis Engineered Interpretations — Day 1 Word Lab

An interactive, no-scroll, single-screen learning app for **Genesis 1:1–5 (KJV)** with
**four play modes**:

- 📖 **Read** — every word & punctuation mark clickable; hover-peek + full dossier
  (Hebrew + Strong’s #, literal sense, roots & origin, synonyms, antonyms,
  homophones/homographs, figurative language, linked words, fun fact, deep-dive pop-out).
- 🗺 **Word Map** — a pannable/zoomable constellation of all 43 tokens with relationship
  lines (shared roots, contrast pairs, command chains) and glowing theme zones.
- 🧱 **Build-a-Verse** — reconstruct Genesis 1:3 chip by chip; slot-by-slot checking,
  hints, confetti on a perfect build.
- 🕹 **Quiz** — 8 randomized questions from the dossiers, best-score record.

Plus: figurative-language radar (merism / anthropomorphism / simile / idiom / contrast),
Day–Night themes, sound FX, Hebrew alef-bet pop-out, progress ring & discovery meter.

Built by **yallToo** · 100% static HTML/CSS/JS · zero dependencies · GitHub Pages ready.

## Files

```
index.html          Day 1 lab — fully self-contained (styles + data + engine inline)
about.html          Mission, features, roadmap
day2.html…day6.html “Coming soon” placeholder chambers
assets/app.css      Shared styling for the sub-pages (placeholders & about)
assets/logo.png     yallToo logo
```

Each future Day gets its own self-contained page: copy `index.html`, swap the
`W = {...}` word data, the `VERSES` token list, and (for the map) the `POS`/`ZONES`
layout. Everything else — tooltips, radar, quiz, builder, progress — adapts automatically.

## Run locally

Double-click `index.html`, or:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Publish on GitHub Pages

1. Create a repo (e.g. `genesis-engineered-interpretations`).
2. Upload this folder (drag & drop in the web UI, or
   `git init && git add . && git commit -m "Day 1 lab" && git push`).
3. **Settings → Pages → Deploy from a branch** → branch `main`, folder `/ (root)`.
4. Live in ~1 minute at `https://<username>.github.io/<repo>/`.

No build step and no Jekyll config needed.

## Word-entry cheat sheet (inside index.html’s `<script>`)

```js
firmament:{ t:"firmament", cat:"earth",            // cat → map color
  heb:"רָקִיעַ", tr:"raqia", say:"rah-KEE-ah", st:"H7549",
  lit:"hammered-out expanse", m:"meaning…", org:"Hebrew root…", en:"English origin…",
  syn:["…"], ant:["…"], hp:["homophones"], hg:["homographs"],
  fig:["merism"], fn:"figurative note", rel:["divided","waters"], fun:"fun fact…",
  pop:"optional deep-dive text", glow:true /* optional light-burst */ }
```

Punctuation entries add `k:"p"` and `name:"Colon ( : )"`.
Add the token to `VERSES` as `["id","display text"]` and a `[x,y]` to `POS` for the map.

## Notes

- Progress, theme, sound, best score and builder status persist via `localStorage`
  (wrapped in try/catch so sandboxed previews degrade gracefully).
- Sound FX off by default; toggle in **Explorer Tools**.
- KJV text is public domain; Strong’s numbers are reference identifiers.
