// Tatters
let margin, gap, w, h, ww, wh, pt, packer, paddingBetween = 0, nst;
random = fxrand

function setup() {
    let ar = 1, mult = 0.97;
    if (windowWidth >= ar * windowHeight) {
        h = mult * windowHeight, w = ar * mult * windowHeight;
    } else {
        h = mult * windowWidth / ar, w = mult * windowWidth;
    }
    createCanvas(w, h); colorMode(HSL); noLoop();
    pt = w / 1000;

    packer = new CirclePacker(w, h, 20, paddingBetween)

    palettes = [
        [[random() * 360, 100, 35], [0, 0, 100]],
        [[349, 100, 35], [0, 0, 100]],
        [[0, 0, 95], [0, 0, 15]],
    ];

    margin = 50; // minimum margin around all edges
    wh = h - 2 * margin, ww = w - 2 * margin; // working height, width
    nst = 50 * random(); // noise multiplier
}

function draw() {
    let tstart = Date.now();

    // sample colors
    let plt_idx = random() * palettes.length | 0,
        bg_clr = palettes[plt_idx][0],
        fg_clr = palettes[plt_idx][1];

    background(bg_clr);

    // make a square
    let sq_width = 0.65 * wh;
    stroke(fg_clr); noFill();
    // square(margin + ww - sq_width, margin, sq_width);

    let numStrokes = 20000, jitter = random();
    for (let nn = 0; nn < numStrokes; nn++) {

        // sample x, y
        let x = (nn % Math.sqrt(numStrokes)) * sq_width / Math.sqrt(numStrokes),
            y = (Math.floor(nn / Math.sqrt(numStrokes))) * sq_width / Math.sqrt(numStrokes);

        // some jitter
        x += jitter * (random() - 0.5) * sq_width / Math.sqrt(numStrokes);
        y += jitter * (random() - 0.5) * sq_width / Math.sqrt(numStrokes);

        // numSteps increases lower down the square
        let numSteps = random() < 0.2 ? Math.exp(10 * y / sq_width) : 5 * (1 + random());

        // add margin to x, y; can move this to later
        x += margin + ww - sq_width; y += margin;

        // stroke weight, cap, fill
        sw = (1 + random() * 2.5 | 0) * pt;
        strokeWeight(sw);
        strokeCap(SQUARE);
        noFill();

        beginShape();
        let addedCircles = [], dir = 1.;
        for (let j = 0; j < numSteps; j++) {
            let n = noise(x / w * nst, y / w * nst),
                angle = n * 2 * PI;

            dx = 2 * dir * cos(angle);
            dy = 2 * dir * sin(angle);

            x += dx;
            y += dy;

            let c = packer.tryToAddCircle(x, y, sw/3, sw/3, false);
            if (!c) break;
            addedCircles.push(c);

            vertex(x, y);
        }
        endShape();

        addedCircles.forEach(c => packer.addCircle(c))
    }

    // Add some noise.
    // let d = pixelDensity(), n = 4 * (w * d) * (h * d);
    // loadPixels();
    // for (let i = 0; i < n; i++) {
    //     pixels[i] = pixels[i] + (fxrand() * 50) - 25;
    // }
    // updatePixels();

    console.log("Load time: " + str(Date.now()-tstart) + " milliseconds");
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

function isWithinCanvas(x, y) {
    return (x > margin && x < margin + ww && y > margin && y < margin + wh);
}
