// Tatters
let margin, grid_gap, w, h, ww, wh, pt, packer, paddingBetween = 0, nst, ar;
random = fxrand

function setup() {
    ar = 1.;
    let mult = 0.97; pixelDensity(2);
    if (windowWidth >= ar * windowHeight) {
        h = mult * windowHeight, w = ar * mult * windowHeight;
    } else {
        h = mult * windowWidth / ar, w = mult * windowWidth;
    }
    createCanvas(w, h); colorMode(HSL); // noLoop();
    pt = w / 1000; grid_gap = w / random([20, 50, 200]);

    // Set seed.
    let seed = int(fxrand() * 100000000);
    randomSeed(seed);
    noiseSeed(seed);

    packer = new CirclePacker(w, h, 20, paddingBetween)

    palettes = [ // [foreground color, background color, grid color]
        // [[random() * 360, 100, 40], [0, 0, random([15, 95])]],
        [[349, 100, 35], [0, 0, 100]], // white on red
        [[237.82, 36.42, 29.61], [0, 0, 95]], // white on violet
        [[44.88, 100, 75.1], [0, 0, 15]], // black on yellow
        [[98, 100, 17], [0, 0, 95]], // white on green
        [[198, 100, 40], [0, 0, 95]], // white on blue
        [[173, 100, 40], [0, 0, 15]], // black on turqoise
        [[198, 100, 70], [0, 0, 15]], // black on blue

        [[0, 0, 95], [0, 0, 15]], // black on white
        [[0, 0, 95], [237.82, 36.42, 29.61]], // violet on white
        [[0, 0, 95], [44.71, 100, 50]], // yellow on white
        [[0, 0, 95], [5.61, 78.08, 57.06]], // bright red on white
        [[0, 0, 95], [98, 100, 27]], // green on white

        [[0, 0, 0], [0, 0, 95]], // white on black
        [[0, 0, 0], [48.05, 88.98, 50.2]], // yellow on black
        [[0, 0, 0], [2.61, 78.08, 60]], // bright red on black
        [[0, 0, 0], [198, 100, 50]], // blue on black
    ];

    margin = w / 25; // minimum margin around all edges
    wh = h - 2 * margin, ww = w - 2 * margin; // working height, width
    nst = 50 * random(); // noise multiplier

    let cfg = random([[1/3, 2.5], [1/3, 2.5], [1/3, 2.5], [1/2, 2.5], [1/2, 2.5], [1/2, 2.5], [1/2, 5], [1/1.3, 2.5], [1/1.3, 2.5], [1/1.3, 2.5], [1/1.3, 5]]);
    pdng = cfg[0]; // padding between strokes
    sw_base = cfg[1]; // base stroke width

    // sample colors
    let plt_idx = random() * palettes.length | 0;
    bg_clr = palettes[plt_idx][0];
    fg_clr = palettes[plt_idx][1];
    grid_clr = fg_clr;

    rainbow = false;
    if (bg_clr.toString() == [0, 0, 0].toString() && fg_clr.toString() == [0, 0, 95].toString() && random() < 0.1) rainbow = true;

    jitter = random(); // how grid-aligned to be want to be?

    (random() < 0.2) ? draw_paper_grid = true : draw_paper_grid = false;
    style = random(["constant", "tothick", "tothin"]);
    numStrokes = (style == "constant") ? 50000 : (style == "tothin") ? 20000 : 30000;
    step_mult = (style == "constant") ? 2 * pt : pt / 2;


    tstart = Date.now();
    background(bg_clr);

    // paper grid.
    if (draw_paper_grid == true) {
        noStroke();
        fill([grid_clr[0], grid_clr[1], grid_clr[2], (grid_gap == w / 200) ? 0.05 : 0.1]);
        for (let i = margin + grid_gap; i < margin + ww; i += grid_gap) {
            let y_offset = random([-1, 1]) * h / 50 * random();
            for (let y_start = margin; y_start < margin + wh; y_start += 1) {
                if (random() < 0.5) { // vertical lines
                    ellipse(i, y_offset + y_start, pt + random());
                }
            }
        }
        for (let i = margin + grid_gap; i < margin + wh; i += grid_gap) {
            let x_offset = random([-1, 1]) * w / 50 * random();
            for (let x_start = margin; x_start < margin + ww; x_start += 1) {
                if (random() < 0.5) // horizontal lines
                    ellipse(x_offset + x_start, i, pt + random());
            }
        }
    }

    // make a square
    sq_width = 0.65 * wh;
    noFill(); stroke(fg_clr);
    // square(margin + ww - sq_width, margin, sq_width);

    nn = 0;
    frameRate(100);

    strokes_per_frame = 250;
}

function draw() {
    if (nn == numStrokes) {
        noLoop();
        console.log("Load time: " + str(Date.now()-tstart) + " milliseconds");
    }

    for (i = 0; i < strokes_per_frame; i++) {
        (rainbow == true && random() < 0.5) ? stroke([random() * 360, 100, 60]) : stroke(fg_clr);

        // sample x, y
        let dx = Math.sqrt((min(sq_width, ww) * min(sq_width, wh) * ar) / numStrokes),
            dy = Math.sqrt((min(sq_width, ww) * min(sq_width, wh)) / (numStrokes * ar)),
            x = (nn % (min(ww, sq_width) / dx)) * dx,
            y = (Math.floor(nn / (min(ww, sq_width) / dx))) * dy;

        // some jitter
        x += jitter * (random() - 0.5) * dx;
        y += jitter * (random() - 0.5) * dy;

        // numSteps increases lower down the square
        let numSteps = random() < 0.3 ? Math.exp(10 * y / min(sq_width, wh)) : 5 * (1 + random());

        // add margin to x, y; can move this to later
        x += margin + ww - min(ww, sq_width);
        y += margin;

        // stroke weight, cap, fill
        sw = (1 + random() * sw_base | 0) * pt;
        strokeWeight(sw); strokeCap(SQUARE); noFill();

        if (style == "constant") beginShape();

        let addedCircles = [], dir = 1.;
        for (let j = 0; j < numSteps; j++) {
            let n = noise(x / w * nst, y / w * nst),
                angle = n * 2 * PI;

            dx = step_mult * dir * cos(angle);
            dy = step_mult * dir * sin(angle);

            x += dx;
            y += dy;

            let sww = (style == "constant") ? sw : (style == "tothick") ? (min(1.5, j / min(numSteps, sq_width/2.5))) * sw : (1. - min(1., j / min(numSteps, sq_width/0.4))) * sw;

            let c = packer.tryToAddCircle(x, y, sww * pdng, sww * pdng, false);
            if (!c) break;
            addedCircles.push(c);

            if (style == "constant") vertex(x, y);
            else {
                if (random() < 0.7) {
                    let clr = [fg_clr[0], fg_clr[1], fg_clr[2], random(0.25, 1)];
                    fill(clr); noStroke();
                    if (sww > 0) {
                        circle(x, y, sww, sww);
                    }
                }
            }
        }

        if (style == "constant") endShape();

        addedCircles.forEach(c => packer.addCircle(c))
        nn += 1;
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
