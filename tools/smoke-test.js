const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const FILE = process.argv[2] || "index.html";
const BUILD_LEN = parseInt(process.argv[3] || "14", 10);
const URLQ = process.argv[4] || "";

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message));
vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

const html = fs.readFileSync(path.join(__dirname, "..", FILE), "utf8");
const noop = () => {};
const fakeCtx = () => ({ clearRect: noop, beginPath: noop, arc: noop, fill: noop, save: noop, restore: noop, translate: noop, rotate: noop, fillRect: noop, setTransform: noop, fillStyle: "", globalAlpha: 1 });

const dom = new JSDOM(html, {
  runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
  url: "http://localhost:8000/" + FILE + URLQ,
  beforeParse(window) {
    window.Element.prototype.scrollTo = function () {};
    window.Element.prototype.scrollIntoView = function () {};
    window.scrollTo = function () {};
    window.HTMLCanvasElement.prototype.getContext = function () { return fakeCtx(); };
    window.addEventListener("error", (e) => errors.push("window.onerror: " + e.message));
  }
});

const w = dom.window, d = w.document;
const click = (sel) => { const el = d.querySelector(sel); if (!el) { errors.push("MISSING ELEMENT: " + sel); return null; } el.click(); return el; };

setTimeout(() => {
  try {
    if (URLQ) {
      const want = URLQ.replace("?w=", "");
      const dw = d.querySelector("#dWord");
      if (!dw || !dw.textContent.toLowerCase().includes(want.toLowerCase().slice(0, 4))) errors.push("?w= param did not select " + want + " (got " + (dw && dw.textContent) + ")");
    }
    if (!d.querySelectorAll(".tok").length) errors.push("no tokens rendered");
    if (!d.querySelectorAll(".mtok").length) errors.push("no map nodes rendered");
    if (!d.querySelector("#dWord")) errors.push("dossier not initialized");
    const toks = d.querySelectorAll(".tok");
    toks[3].click(); toks[7].click(); toks[10].click();
    const accBtns = d.querySelectorAll("#dossBody .acc>button");
    if (accBtns[3]) accBtns[3].click();
    const rel = d.querySelector("#dossBody .chip.rel"); if (rel) rel.click();
    // cross-day tag present?
    const x = d.querySelector('#dossHead a.tag[href^="index.html?w="]');
    if (FILE === "day2.html") { // pick a shared word to verify the ↩ tag
      click('.tok[data-id="waters"]');
      if (!d.querySelector('#dossHead a.tag[href="index.html?w=waters"]')) errors.push("cross-day tag missing on shared word");
    }
    // radar: first device
    const dev = d.querySelector(".devbtn"); if (dev) { dev.click(); if (!d.querySelectorAll(".tok.hl,.mtok.hl").length) errors.push("radar highlighted nothing"); dev.click(); }
    click("#popBtn"); if (!d.querySelector("#modalWrap.show")) errors.push("popout did not open");
    click("#modalWrap .x");
    click("#alphaBtn"); click("#modalWrap .x");
    click("#themeBtn"); click("#themeBtn");
    click('[data-view="map"]');
    const mn = d.querySelectorAll(".mtok"); if (mn[5]) mn[5].click();
    click(".lchip"); click("#zIn"); click("#zOut"); click("#zRe");
    click('[data-view="build"]');
    for (let i = 0; i < BUILD_LEN; i++) click("#bHint");
    click("#bCheck");
    if (!/PERFECT BUILD/.test(d.querySelector("#buildMsg").textContent)) errors.push("build check failed: " + d.querySelector("#buildMsg").textContent);
    click("#bClear");
    click('[data-view="quiz"]');
    click("#qStart");
    const opt = d.querySelector(".qopt"); if (opt) opt.click();
    setTimeout(() => {
      click("#resetBtn");
      console.log(FILE, "→ progress after reset:", d.querySelector("#progTxt b").textContent);
      console.log(errors.length ? "❌ ERRORS:\n" + errors.join("\n") : "✅ " + FILE + " CLEAN");
      process.exit(errors.length ? 1 : 0);
    }, 1200);
  } catch (e) { console.log("❌ EXCEPTION: " + e.stack); process.exit(1); }
}, URLQ ? 1800 : 900);
