// Tatters
let margin, grid_gap, w, h, ww, wh, pt, packer, paddingBetween = 0, nst, ar;
random = fxrand

function setup() {
    /***************************************************************************
     * Aspect ratio, pixel density, seed, etc.
     **************************************************************************/
    ar = 1;
    let mult = 0.97; pixelDensity(3);
    if (windowWidth >= ar * windowHeight) {
        h = mult * windowHeight, w = ar * mult * windowHeight;
    } else {
        h = mult * windowWidth / ar, w = mult * windowWidth;
    }
    createCanvas(w, h); colorMode(HSL); // noLoop();
    pt = w / 1000;
    margin = w / 15; // minimum margin around all edges
    wh = h - 2 * margin, ww = w - 2 * margin; // working height, width

    let seed = int(fxrand() * 100000000);
    randomSeed(seed);
    noiseSeed(seed);
    console.log(seed, fxhash);
    /**************************************************************************/

    /***************************************************************************
     * Color palettes
     **************************************************************************/

    let bg_clrs = [ // [foreground color, background color, grid color]
        [349, 100, 35], // dark red
        [2.61, 78.08, 60], // light red
        [237.82, 36.42, 29.61], // violet
        [44.88, 100, 75.1], // yellow
        [198, 100, 40], // blue
        [0, 0, 95], // white
        [0, 0, 15], // black
    ];
    bg_clr = random(bg_clrs);

    // mapping from a single background color to multiple foreground colors.
    palettes = {};
    palettes[[349, 100, 35]] = [[0, 0, 100], [44.71, 100, 50]];
    palettes[[2.61, 78.08, 60]] = [[0, 0, 15], [0, 0, 100]];
    palettes[[237.82, 36.42, 29.61]] = [[0, 0, 95], [2.61, 78.08, 60], [173, 100, 40], [44.71, 100, 50]];
    palettes[[44.88, 100, 75.1]] = [[0, 0, 15], [5.61, 78.08, 57.06], [237.82, 36.42, 29.61]];
    palettes[[198, 100, 40]] = [[0, 0, 0], [0, 0, 100], [48.05, 88.98, 50.2]];
    palettes[[0, 0, 95]] = [[0, 0, 15], [237.82, 36.42, 29.61], [44.71, 100, 47], [5.61, 78.08, 57.06], [98, 100, 27]];
    palettes[[0, 0, 15]] = [[0, 0, 95], [48.05, 88.98, 50.2], [2.61, 78.08, 60], [198, 100, 50]]

    /**************************************************************************/

    /***************************************************************************
     * "Layout"
     **************************************************************************/
    layout = random([1, 1, 2]); // 1 = default, 2 = tiled
    num_blocks = (layout == 1) ? 1 + random() * (palettes[bg_clr].length - 1) | 0 : pow(random([2, 3, 4, 5, 6]), 2);
    blocks = [];
    for (let i = 0; i < num_blocks; i++) {
        let _C = build_config(i, prev=(i == 0) ? false : blocks[blocks.length-1]);
        blocks.push(new TatteredBlock(_C));
    }
    console.log(layout, num_blocks);
    console.log(blocks);
    /**************************************************************************/

    /***************************************************************************
     * Graph paper grid
     **************************************************************************/
    grid_gap = w / random([50, 100, 150]);
    draw_paper_grid = (random() < 1.) ? true : false;

    tstart = Date.now();
    background(bg_clr);

    // paper grid.
    if (draw_paper_grid == true) {
        noStroke();
        let clr = blocks[0].c.fg_clr;
        fill(clr[0], clr[1], clr[2], 0.125);
        for (let i = grid_gap; i < w; i += grid_gap) {
            let y_offset = random([-1, 1]) * h / 50 * random();
            for (let y_start = 0; y_start < h; y_start += 1) {
                if (random() < 0.5) { // vertical lines
                    ellipse(i, y_offset + y_start, pt + random());
                }
            }
        }
        for (let i = grid_gap; i < h; i += grid_gap) {
            let x_offset = random([-1, 1]) * w / 50 * random();
            for (let x_start = 0; x_start < w; x_start += 1) {
                if (random() < 0.5) // horizontal lines
                    ellipse(x_offset + x_start, i, pt + random());
            }
        }
    }
    /**************************************************************************/

    packer = new CirclePacker(w, h, 20, paddingBetween);

    frameRate(100);
    strokes_per_frame = 100000;
}

function draw() {
    let done = true;
    for (i = 0; i < strokes_per_frame; i++) {
        for (let i = 0; i < blocks.length; i++) {
            if (!blocks[i].isDone()) {
                blocks[i].addStroke();
                blocks[i].step();
                done = false;
            }
        }
    }

    if (done) {
        noLoop();
        console.log("Load time: " + str(Date.now()-tstart) + " milliseconds");
    }
}

// Borrowed from https://openprocessing.org/sketch/1490081
// written by @tarwin
class CirclePacker {
    constructor(width, height, numGrid = 15, padding = 1) {

        this.width = width
        this.height = height
        this.numGrid = numGrid
        this.padding = padding
        this.gridSizeX = this.width / this.numGrid
        this.gridSizeY = this.height / this.numGrid

        this.generateGrid()
        this.items = []
    }

    generateGrid() {
        const grid = []
        for (let x=0; x<this.numGrid; x++) {
            grid[x] = []
            for (let y=0; y<this.numGrid; y++) {
                grid[x][y] = {x, y, c: []}
            }
        }
        this.grid = grid
    }

    getGridTilesAround(x, y, r) {
        const tl = [
            Math.floor((x-r-this.padding)/this.gridSizeX),
            Math.floor((y-r-this.padding)/this.gridSizeY),
        ]

        const br = [
            Math.floor((x+r+this.padding)/this.gridSizeX),
            Math.floor((y+r+this.padding)/this.gridSizeY),
        ]

        const tiles = []
        for (let i=tl[0]; i<=br[0]; i++) {
            for (let j=tl[1]; j<=br[1]; j++) {
                if (i < 0 || j < 0 || i >= this.numGrid || j >= this.numGrid) continue
                tiles.push(this.grid[i][j])
            }
        }
        return tiles
    }

    getTile(x, y) {
        return this.grid
        [Math.floor(x/this.gridSizeX)]
        [Math.floor(y/this.gridSizeY)]
    }

    getCircles(x, y) {
        const tile = this.getTile(x, y)
        const circles = []
        tile.c.forEach(c => {
            if (this.distCirc(c, {x, y, r:0}) < 0) circles.push(c)
        })
        return circles
    }

    distCirc(c1, c2) {
        return Math.sqrt(Math.pow((c1.x-c2.x), 2) + Math.pow((c1.y-c2.y), 2)) - (c1.r + c2.r);
    }

    addCircle(c) {
        // break early if out of grid
        if (c.x-c.r < 0 || c.x+c.r > this.width || c.y-c.r < 0 || c.y+c.r > this.height) {
            return null
        }

        // get grid items it could intersect
        const gridTiles = this.getGridTilesAround(c.x, c.y, c.r)

        // add to tiles, and tiles to circles
        gridTiles.forEach(t => {
            this.grid[t.x][t.y].c.push(c)
            if (!c.t) c.t = []
            c.t.push(`${t.x},${t.y}`)
        })
        this.items.push(c)
        return c
    }

    tryToAddCircle(x, y, minRadius = 0, maxRadius = 900, actuallyAdd = true) {
        let c1 = { x, y, r: minRadius, t: [] }

        while (true) {

            // break early if out of grid
            if (c1.x-c1.r < 0 || c1.x+c1.r > this.width || c1.y-c1.r < 0 || c1.y+c1.r > this.height) {
                return null
            }

            // get grid items it could intersect
            const gridTiles = this.getGridTilesAround(x, y, c1.r)

            // check against all circles
            for (let tile of gridTiles) {
                for (let c2 of tile.c) {
                    const d = this.distCirc(c1, c2)
                    if (d - this.padding < 0) {
                        if (c1.r === minRadius) {
                            return null
                        } else {
                            // add to tiles, and tiles to circles
                            gridTiles.forEach(t => {
                                this.grid[t.x][t.y].c.push(c1)
                                c1.t.push(`${t.x},${t.y}`)
                            })
                            this.items.push(c1)
                            return c1
                        }
                    }
                }
            }

            c1.r += 1
            if (c1.r > maxRadius) {
                if (actuallyAdd) {
                    // add to tiles, and tiles to circles
                    gridTiles.forEach(t => {
                        this.grid[t.x][t.y].c.push(c1)
                        c1.t.push(`${t.x},${t.y}`)
                    })
                    this.items.push(c1)
                }
                return c1
            }
        }
    }

    removeCircles(x, y, radius) {
        const gridTiles = this.getGridTilesAround(x, y, radius)
        const c1 = { x, y, r: radius }

        const tilesLookedAt = []
        const tilesNotLookedAt = []

        let hasRemoved = false

        // check against all circles
        for (let tile of gridTiles) {
            tilesLookedAt.push(`${tile.x},${tile.y}`)
            const toKeep = []
            for (let i=0; i<tile.c.length; i++) {
                const d = this.distCirc(c1, tile.c[i])
                if ((d - this.padding) > 0) {
                    toKeep.push(this.grid[tile.x][tile.y].c[i])
                } else {
                    hasRemoved = true
                    // to remove
                    tile.c[i].t.forEach(xy => {
                        if (!tilesLookedAt.includes(xy) && !tilesNotLookedAt.includes(xy)) {
                            tilesNotLookedAt.push(xy)
                        }
                    })
                }
            }
            this.grid[tile.x][tile.y].c = toKeep
        }

        // check against all circles, other tiles
        for (let xy of tilesNotLookedAt) {
            const xya = xy.split(',')
            const tile = this.grid[xya[0]][xya[1]]
            const toKeep = []
            for (let i=0; i<tile.c.length; i++) {
                const d = this.distCirc(c1, tile.c[i])
                if ((d - this.padding) > 0) {
                    toKeep.push(this.grid[tile.x][tile.y].c[i])
                }
            }
            this.grid[tile.x][tile.y].c = toKeep
        }

        // check current items
        const toKeep = []
        for (let i=0; i<this.items.length; i++) {
            const d = this.distCirc(c1, this.items[i])
            if ((d - this.padding) > 0) {
                toKeep.push(this.items[i])
            }
        }
        this.items = toKeep

        return hasRemoved
    }
}

function build_config(idx = 0, prev=false) {
    let c = {};

    /***************************************************************************
     * Sample colors
     **************************************************************************/
    c.fg_clr = random(palettes[bg_clr]);
    if (prev !== false && c.fg_clr == prev.c.fg_clr) c.fg_clr = random(palettes[bg_clr]);

    c.rainbow = false;
    if (bg_clr.toString() == [0, 0, 15].toString() && c.fg_clr.toString() == [0, 0, 95].toString() && random() < 0.1) c.rainbow = true;
    /**************************************************************************/

    /***************************************************************************
     * Flow field config
     **************************************************************************/
    c.nst = (prev == false) ? 5 : (50 - prev.c.nst) * random(); // noise multiplier
    /**************************************************************************/

    /***************************************************************************
     * Stroke config
     **************************************************************************/
    c.style = random(["constant", "tothick", "tothin"]);
    let style2cfg = {
        "tothick" : [[1/3, 2.5], [1/2, 2.5], [1/2, 5], [1/1.3, 2.5], [1/1.3, 5]],
        "tothin" : [[1/3, 2.5], [1/2, 2.5], [1/2, 5], [1/1.3, 2.5], [1/1.3, 5]],
        "constant": [[1/5, 1.5], [1/1.3, 2.5], [1/1.3, 5]],
    }[c.style];
    let cfg = random(style2cfg);
    if (prev !== false && prev.c.pdng == cfg[0] && prev.c.sw_base == cfg[1])
        cfg = random(style2cfg);
    c.pdng = cfg[0]; // padding between strokes
    c.sw_base = cfg[1]; // base stroke width
    c.jitter = random(); // how grid-aligned do we want to be?

    c.step_mult = (c.style == "constant") ? 2 * pt : pt / 2;
    c.numStrokes = (c.style == "constant") ? 50000 : (c.style == "tothin") ? 20000 : 30000;
    if (layout == 2) c.numStrokes = int(c.numStrokes * min(1, (wh / Math.sqrt(num_blocks)) / (0.5 * wh)));

    console.log(c.numStrokes);

    noFill();
    /**************************************************************************/

    if (layout == 1) {
        c.sq_width = random([0.65, 0.75, 0.85]) * wh;
        if (prev !== false && prev.c.sq_width == c.sq_width) c.sq_width = random([0.65, 0.75, 0.85]) * wh;
        c.x_start = margin;
        c.x_end = c.x_start + min(c.sq_width, ww);
        c.y_start = margin;
        c.y_end = c.y_start + min(c.sq_width, wh);
        c.nn_start = 0; c.nn_end = c.numStrokes;
        c.nn = 0; c.nn_step = 1;

        c.stroke_dir = random([-1, 1]); // left-to-right or right-to-left
        if (c.stroke_dir == 1) {
            // c.x_start += random() * (ww - min(c.sq_width, ww));
            c.x_start += (ww - min(c.sq_width, ww));
            c.x_end += c.x_start;
        }

        c.draw_dir = random([-1, 1]); // bottom-to-top or top-to-bottom
        if (c.draw_dir == -1) {
            c.nn_start = c.numStrokes; c.nn_end = 0;
            c.nn = c.numStrokes; c.nn_step = -1;
            // c.y_start += random() * (wh - min(c.sq_width, wh));
            c.y_start += (wh - min(c.sq_width, wh));
            c.y_end += c.y_start;
        }
    }
    else if (layout == 2) {
        let num_cols = Math.sqrt(num_blocks);
        c.sq_width = wh * 1 / num_cols;
        c.x_start = margin + (idx % num_cols) * c.sq_width;
        c.y_start = margin + (Math.floor(idx / num_cols)) * c.sq_width;

        if (c.x_start < margin + ww/2) c.x_start += (random()) * c.sq_width / 10;
        else c.x_start -= (random()) * c.sq_width / 10;

        if (c.y_start < margin + wh/2) c.y_start += (random()) * c.sq_width / 10;
        else c.y_start -= (random()) * c.sq_width / 10;

        c.x_end = c.x_start + min(c.sq_width, ww);
        c.y_end = c.y_start + min(c.sq_width, wh);

        c.nn_start = 0; c.nn_end = c.numStrokes;
        c.nn = 0; c.nn_step = 1;

        stroke(c.fg_clr);

        c.stroke_dir = random([-1, 1]); // left-to-right or right-to-left
        c.draw_dir = random([-1, 1]); // bottom-to-top or top-to-bottom
        if (c.draw_dir == -1) {
            c.nn_start = c.numStrokes; c.nn_end = 0;
            c.nn = c.numStrokes; c.nn_step = -1;
        }
    }

    return c;
}

class TatteredBlock {
    constructor(cfg) {
        this.c = cfg;
    }

    isDone() {
        return this.c.nn == this.c.nn_end;
    }

    addStroke() {
        stroke(this.c.fg_clr);
        (this.c.rainbow == true && random() < 0.5) ? stroke([random() * 360, 100, 60]) : stroke(this.c.fg_clr);

        // sample x, y
        let dx = Math.sqrt((min(this.c.sq_width, ww) * min(this.c.sq_width, wh) * ar) / this.c.numStrokes),
            dy = Math.sqrt((min(this.c.sq_width, ww) * min(this.c.sq_width, wh)) / (this.c.numStrokes * ar)),
            x = (this.c.nn % (min(ww, this.c.sq_width) / dx)) * dx,
            y = (Math.floor(this.c.nn / (min(ww, this.c.sq_width) / dx))) * dy;

        // some jitter
        x += this.c.jitter * (random() - 0.5) * dx;
        y += this.c.jitter * (random() - 0.5) * dy;

        // add margin to x, y; can move this to later
        x += this.c.x_start;
        y += this.c.y_start;

        // numSteps increases lower down the square
        let numSteps = 5 * (1 + random());
        if (random() < 0.3) {
            let y_frac = min(max(0, (y - this.c.y_start) / (this.c.y_end - this.c.y_start)), 1);
            if (this.c.draw_dir == -1) numSteps = Math.exp(10 * (1.0 - y_frac));
            else numSteps = Math.exp(10 * y_frac);
        }

        // stroke weight, cap, fill
        let sw = (1 + random() * this.c.sw_base | 0) * pt;
        strokeWeight(sw); strokeCap(SQUARE); noFill();

        if (this.c.style == "constant") beginShape();

        let addedCircles = [];
        for (let j = 0; j < numSteps; j++) {
            let n = noise(x / w * this.c.nst, y / w * this.c.nst),
                angle = n * 2 * PI;

            dx = this.c.step_mult * this.c.stroke_dir * cos(angle);
            dy = this.c.step_mult * this.c.stroke_dir * sin(angle);

            x += dx;
            y += dy;

            let sww = (this.c.style == "constant") ? sw : (this.c.style == "tothick") ? (min(1.5, j / min(numSteps, this.c.sq_width/2.5))) * sw : (1. - min(1., j / min(numSteps, this.c.sq_width/0.4))) * sw;

            let c = packer.tryToAddCircle(x, y, sww * this.c.pdng / 2, sww * this.c.pdng / 2, false);
            if (!c) {
                break;
            }
            addedCircles.push(c);

            if (this.c.style == "constant") vertex(x, y);
            else {
                if (random() < 0.7) {
                    let clr = [this.c.fg_clr[0], this.c.fg_clr[1], this.c.fg_clr[2], random(0.25, 1)];
                    fill(clr); noStroke();
                    if (sww > 0) {
                        circle(x, y, sww, sww);
                    }
                }
            }
        }
        if (this.c.style == "constant") endShape();

        addedCircles.forEach(c => packer.addCircle(c))
    }

    step() {
        this.c.nn += this.c.nn_step;
    }
}