/* Header art — a miniature Tatters (see /art/tatters/), regenerated on every
   visit. Vanilla-JS adaptation of js/tatters/main.js: same palettes, paper
   grid, and flow-field strokes with circle packing, scaled to a small strip.
   Paints the background and paper grid synchronously, fades in right away via
   .is-ready, and draws the strokes live in requestAnimationFrame chunks. */
(function () {
    'use strict';

    var wrap = document.getElementById('header-art');
    if (!wrap) return;
    var canvas = wrap.querySelector('canvas');
    var ctx = canvas && canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    /* ---------- PRNG: fresh seed per visit, kept for re-render on resize ---------- */
    var seed = new Uint32Array(4);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(seed);
    } else {
        for (var s = 0; s < 4; s++) seed[s] = (Math.random() * 4294967296) >>> 0;
    }

    function sfc32(a, b, c, d) {
        return function () {
            a |= 0; b |= 0; c |= 0; d |= 0;
            var t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = c << 21 | c >>> 11;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        };
    }

    var rand;

    function choice(arr) { return arr[(rand() * arr.length) | 0]; }

    /* ---------- Perlin noise (single octave, ~[0,1]) ---------- */
    var perm = new Uint8Array(512);

    function buildPerm() {
        var p = new Uint8Array(256), i, j, t;
        for (i = 0; i < 256; i++) p[i] = i;
        for (i = 255; i > 0; i--) {
            j = (rand() * (i + 1)) | 0;
            t = p[i]; p[i] = p[j]; p[j] = t;
        }
        for (i = 0; i < 512; i++) perm[i] = p[i & 255];
    }

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(h, x, y) {
        switch (h & 3) {
            case 0: return x + y;
            case 1: return -x + y;
            case 2: return x - y;
            default: return -x - y;
        }
    }

    function noise(x, y) {
        var fx = Math.floor(x), fy = Math.floor(y);
        var X = fx & 255, Y = fy & 255;
        x -= fx; y -= fy;
        var u = fade(x), v = fade(y);
        var a = perm[X] + Y, b = perm[X + 1] + Y;
        var n = lerp(v,
            lerp(u, grad(perm[a], x, y), grad(perm[b], x - 1, y)),
            lerp(u, grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1)));
        return 0.5 + n * 0.36;
    }

    /* ---------- Palettes: [background, [foreground options]], same as tatters ---------- */
    var PALETTES = [
        [[349, 100, 35], [[0, 0, 100], [44.71, 100, 50]]],
        [[2.61, 78.08, 60], [[0, 0, 15], [0, 0, 100]]],
        [[237.82, 36.42, 29.61], [[0, 0, 95], [2.61, 78.08, 60], [173, 100, 40], [44.71, 100, 50]]],
        [[44.88, 100, 75.1], [[0, 0, 15], [5.61, 78.08, 57.06], [237.82, 36.42, 29.61]]],
        [[198, 100, 40], [[0, 0, 0], [0, 0, 100], [48.05, 88.98, 50.2]]],
        [[0, 0, 95], [[0, 0, 15], [237.82, 36.42, 29.61], [44.71, 100, 47], [5.61, 78.08, 57.06], [98, 100, 27]]],
        [[0, 0, 15], [[0, 0, 95], [48.05, 88.98, 50.2], [2.61, 78.08, 60], [198, 100, 50]]]
    ];

    function hsl(c, a) {
        return 'hsla(' + c[0] + ',' + c[1] + '%,' + c[2] + '%,' + (a === undefined ? 1 : a) + ')';
    }

    /* ---------- Circle packer (spatial hash; strokes stop where others live) ----------
       Hot path: integer Map keys and inlined cell loops — no string keys or
       per-call closures. Bounds checks keep i/j non-negative and j < 4096. */
    function Packer(w, h, cell) {
        this.w = w; this.h = h; this.cell = cell; this.map = new Map();
    }
    Packer.prototype.tryAdd = function (x, y, r) {
        if (x - r < 0 || x + r > this.w || y - r < 0 || y + r > this.h) return null;
        var cs = this.cell, map = this.map;
        var x0 = ((x - r) / cs) | 0, x1 = ((x + r) / cs) | 0;
        var y0 = ((y - r) / cs) | 0, y1 = ((y + r) / cs) | 0;
        for (var i = x0; i <= x1; i++) {
            for (var j = y0; j <= y1; j++) {
                var cell = map.get(i * 4096 + j);
                if (!cell) continue;
                for (var k = 0; k < cell.length; k++) {
                    var c = cell[k], dx = c.x - x, dy = c.y - y, rr = c.r + r;
                    if (dx * dx + dy * dy < rr * rr) return null;
                }
            }
        }
        return { x: x, y: y, r: r };
    };
    Packer.prototype.add = function (c) {
        var cs = this.cell, map = this.map;
        var x0 = ((c.x - c.r) / cs) | 0, x1 = ((c.x + c.r) / cs) | 0;
        var y0 = ((c.y - c.r) / cs) | 0, y1 = ((c.y + c.r) / cs) | 0;
        for (var i = x0; i <= x1; i++) {
            for (var j = y0; j <= y1; j++) {
                var key = i * 4096 + j, cell = map.get(key);
                if (cell) cell.push(c); else map.set(key, [c]);
            }
        }
    };

    /* ---------- Generation ---------- */
    var TWO_PI = Math.PI * 2;
    var raf = 0, cssW = 0;
    var w, h, pt, packer, blocks;

    function buildBlock(idx, prev, fgs, bx0, bx1, by0, by1) {
        var b = {};

        b.fg = choice(fgs);
        if (prev && b.fg === prev.fg) b.fg = choice(fgs);

        // black bg + white fg occasionally goes rainbow, like the original
        b.rainbow = false;
        var bg = blocksBg;
        if (bg[0] === 0 && bg[2] === 15 && b.fg[2] === 95 && rand() < 0.1) b.rainbow = true;

        b.nst = !prev ? 5 : (50 - prev.nst) * rand(); // noise multiplier

        b.style = choice(['constant', 'tothick', 'tothin']);
        var style2cfg = {
            tothick: [[1 / 3, 2.5], [1 / 2, 2.5], [1 / 2, 5], [1 / 1.3, 2.5], [1 / 1.3, 5]],
            tothin: [[1 / 3, 2.5], [1 / 2, 2.5], [1 / 2, 5], [1 / 1.3, 2.5], [1 / 1.3, 5]],
            constant: [[1 / 5, 1.5], [1 / 1.3, 2.5], [1 / 1.3, 5]]
        }[b.style];
        var cfg = choice(style2cfg);
        if (prev && prev.pdng === cfg[0] && prev.sw_base === cfg[1]) cfg = choice(style2cfg);
        b.pdng = cfg[0];      // padding between strokes
        b.sw_base = cfg[1];   // base stroke width
        b.jitter = rand();    // how grid-aligned do we want to be?

        b.step_mult = (b.style === 'constant') ? 2 * pt : pt / 2;

        // block is a horizontal slice of the banner, centered with a little
        // jitter so the overall composition stays balanced
        var ww = bx1 - bx0;
        b.sqw = choice([0.5, 0.65, 0.8, 1]) * ww;
        b.stroke_dir = choice([-1, 1]);
        b.x0 = bx0 + (ww - b.sqw) / 2 + (rand() - 0.5) * 0.15 * ww;
        b.x0 = Math.max(bx0, Math.min(bx1 - b.sqw, b.x0));
        b.x1 = b.x0 + b.sqw;
        b.y0 = by0; b.y1 = by1;

        b.draw_dir = choice([-1, 1]); // bottom-to-top or top-to-bottom

        // stroke grid density, matching the original's spacing per style
        b.sp = { constant: 3.9, tothick: 5.0, tothin: 6.2 }[b.style] * pt;
        b.cols = b.sqw / b.sp;
        b.numStrokes = Math.max(1, Math.round(b.sqw * (b.y1 - b.y0) / (b.sp * b.sp)));
        b.k = 0;

        return b;
    }

    var blocksBg;

    function drawStroke(b) {
        var nn = (b.draw_dir === -1) ? b.numStrokes - 1 - b.k : b.k;
        b.k++;

        var strokeClr = b.fg;
        if (b.rainbow && rand() < 0.5) strokeClr = [rand() * 360, 100, 60];

        var x = (nn % b.cols) * b.sp + b.jitter * (rand() - 0.5) * b.sp + b.x0;
        var y = Math.floor(nn / b.cols) * b.sp + b.jitter * (rand() - 0.5) * b.sp + b.y0;

        // occasional long runners, longer toward the trailing edge
        var numSteps = 5 * (1 + rand());
        if (rand() < 0.3) {
            var yf = Math.min(Math.max(0, (y - b.y0) / (b.y1 - b.y0)), 1);
            numSteps = Math.exp(10 * (b.draw_dir === -1 ? 1 - yf : yf));
        }
        numSteps = Math.min(numSteps, 4000);

        var sw = ((1 + rand() * b.sw_base) | 0) * pt;
        var pts = [], added = [];

        // one fillStyle parse per stroke; per-dot opacity rides on globalAlpha
        if (b.style !== 'constant') ctx.fillStyle = hsl(b.fg);

        for (var j = 0; j < numSteps; j++) {
            var angle = noise(x / w * b.nst, y / w * b.nst) * TWO_PI;
            x += b.step_mult * b.stroke_dir * Math.cos(angle);
            y += b.step_mult * b.stroke_dir * Math.sin(angle);

            var sww = (b.style === 'constant') ? sw
                : (b.style === 'tothick')
                    ? Math.min(1.5, j / Math.min(numSteps, b.sqw / 2.5)) * sw
                    : (1 - Math.min(1, j / Math.min(numSteps, b.sqw / 0.4))) * sw;

            var c = packer.tryAdd(x, y, sww * b.pdng / 2);
            if (!c) break;
            added.push(c);

            if (b.style === 'constant') {
                pts.push(x, y);
            } else if (rand() < 0.7 && sww > 0) {
                ctx.globalAlpha = 0.25 + rand() * 0.75;
                ctx.beginPath();
                ctx.arc(x, y, sww / 2, 0, TWO_PI);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;

        if (b.style === 'constant' && pts.length > 3) {
            ctx.strokeStyle = hsl(strokeClr);
            ctx.lineWidth = sw;
            ctx.lineCap = 'butt';
            ctx.beginPath();
            ctx.moveTo(pts[0], pts[1]);
            for (var q = 2; q < pts.length; q += 2) ctx.lineTo(pts[q], pts[q + 1]);
            ctx.stroke();
        }

        for (var a = 0; a < added.length; a++) packer.add(added[a]);
    }

    function generate() {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }

        rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
        buildPerm();

        w = canvas.clientWidth || wrap.clientWidth;
        h = canvas.clientHeight || wrap.clientHeight;
        if (w < 20 || h < 20) return;
        cssW = w;

        var dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        pt = Math.max(0.75, h / 110);
        var margin = 8;

        var palette = choice(PALETTES);
        blocksBg = palette[0];
        var fgs = palette[1];

        ctx.fillStyle = hsl(blocksBg);
        ctx.fillRect(0, 0, w, h);

        blocks = [];
        var nb = 1 + (rand() * Math.min(3, fgs.length - 1)) | 0;
        for (var i = 0; i < nb; i++) {
            blocks.push(buildBlock(i, i ? blocks[i - 1] : null, fgs, margin, w - margin, margin, h - margin));
        }

        // graph-paper grid of jittered dots, in the first block's color.
        // fillRect stands in for arc: at ~2px the shape is invisible and it
        // keeps the per-dot alpha stacking, at a fraction of the cost
        var grid_gap = choice([12, 16, 22]) * pt;
        var gclr = hsl(blocks[0].fg, 0.125);
        ctx.fillStyle = gclr;
        var gx, gy, off, gr;
        for (gx = grid_gap; gx < w; gx += grid_gap) {
            off = choice([-1, 1]) * h / 50 * rand();
            for (gy = 0; gy < h; gy += 1) {
                if (rand() < 0.5) {
                    gr = (pt + rand()) / 2;
                    ctx.fillRect(gx - gr, off + gy - gr, gr * 2, gr * 2);
                }
            }
        }
        for (gy = grid_gap; gy < h; gy += grid_gap) {
            off = choice([-1, 1]) * w / 50 * rand();
            for (gx = 0; gx < w; gx += 1) {
                if (rand() < 0.5) {
                    gr = (pt + rand()) / 2;
                    ctx.fillRect(off + gx - gr, gy - gr, gr * 2, gr * 2);
                }
            }
        }

        packer = new Packer(w, h, 8);

        // background and grid are in — fade in now and let the strokes draw
        // live, so the banner never sits blank while the piece generates
        wrap.classList.add('is-ready');

        // round-robin the blocks a stroke at a time, in rAF-sized chunks
        function frame() {
            var t0 = performance.now(), busy = true;
            while (busy && performance.now() - t0 < 10) {
                busy = false;
                for (var i = 0; i < blocks.length; i++) {
                    if (blocks[i].k < blocks[i].numStrokes) {
                        drawStroke(blocks[i]);
                        busy = true;
                    }
                }
            }
            if (busy) raf = requestAnimationFrame(frame);
            else raf = 0;
        }
        raf = requestAnimationFrame(frame);
    }

    generate();

    // re-render the same piece if the strip's width changes (e.g. rotation)
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var now = canvas.clientWidth || wrap.clientWidth;
            if (Math.abs(now - cssW) > 8) generate();
        }, 200);
    });
})();
