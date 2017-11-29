class Map extends Phaser.Group {

    constructor(width, length, height) {

        super(game, game, 'map', true, false);

        let tiles = [];

        for (let x = 0; x < width; x++) {

            for (let y = 0; y < length; y++) {

                tiles.push({ x: x, y: y, z: 0, frame: 0 });

            }

        }

        this.grid = game.add.group(this, 'grid');
        this.tiles = game.add.group(this, 'tiles');

        tiles.forEach(function (tile) {

            new Grid(tile.x, tile.y, tile.z, tile.frame, this.grid);

        }, this)

        this.data = {

            width: width,
            length: length,
            height: height,

            points: []

        }

        for (let x = 0; x < width; x++) {

            this.data.points[x] = new Array(length);

            for (let y = 0; y < length; y++) {

                this.data.points[x][y] = new Array(height);

            }

        }

        this.over = null;
        this.open = false;

        this.hiddingX = false;
        this.hiddingY = false;
        this.hideAlpha = 0.2;

        let m = this;

        this.inputs = function (e) {

            switch (e.key) {

                case 'r': m.clear(); break;
                case 's': if (!this.open) { m.save(); } break;
                case 'l': if (!this.open) { m.load(); } break;

            }

            if (m.over) {

                switch (e.key) {

                    case 'q': m.hideX(m.over.isoX); break;
                    case 'e': m.hideY(m.over.isoY); break;

                }

            }

        }

        game.input.keyboard.onDownCallback = this.inputs;

        socket.on('maplist', function (maplist) {

            let panel = new Panel(128, 64)
            panel.add(new SelectList(panel.w, panel.h, maplist,

                function (elem) {

                    socket.emit('fetch map', elem.text.options[elem.text.selectedIndex].value);
                    m.open = false;
                    game.input.keyboard.onDownCallback = m.inputs;

                },

                'Enter'

            ));

        })

        socket.on('map', function (map) {

            m.clear();

            for (let x = 0; x < map.width; x++) {

                for (let y = 0; y < map.length; y++) {

                    for (let z = 0; z < map.height; z++) {

                        if (map.points[x][y][z]) {

                            new Cube(x, y, z + 1, map.points[x][y][z], m.tiles);
                            m.data.points[x][y][z] = map.points[x][y][z];

                        }

                    }

                }

            }

        })

        game.add.existing(this);

    }

    hideX(x) {

        if (!this.hiddingY) {

            if (this.hiddingX) {

                this.hiddingX = false;

                this.grid.forEach(function (tile) {

                    if (tile.isoX != x) {

                        tile.alpha = 1;
                        tile.inputEnabled = true;

                    }

                })

                this.tiles.forEach(function (tile) {

                    if (tile.isoX != x) {

                        tile.alpha = 1;
                        tile.inputEnabled = true;

                    }

                })

            } else {

                this.hiddingX = true;

                this.grid.forEach(function (tile) {

                    if (tile.isoX != x) {

                        tile.alpha = this.hideAlpha;
                        tile.inputEnabled = false;

                    }

                }, this)

                this.tiles.forEach(function (tile) {

                    if (tile.isoX != x) {

                        tile.alpha = this.hideAlpha;
                        tile.inputEnabled = false;

                    }

                }, this)

            }

        }

    }

    hideY(y) {

        if (!this.hiddingX) {

            if (this.hiddingY) {

                this.hiddingY = false;

                this.grid.forEach(function (tile) {

                    if (tile.isoY != y) {

                        tile.alpha = 1;
                        tile.inputEnabled = true;

                    }

                })

                this.tiles.forEach(function (tile) {

                    if (tile.isoY != y) {

                        tile.alpha = 1;
                        tile.inputEnabled = true;

                    }

                })

            } else {

                this.hiddingY = true;

                this.grid.forEach(function (tile) {

                    if (tile.isoY != y) {

                        tile.alpha = this.hideAlpha;
                        tile.inputEnabled = false;

                    }

                }, this)

                this.tiles.forEach(function (tile) {

                    if (tile.isoY != y) {

                        tile.alpha = this.hideAlpha;
                        tile.inputEnabled = false;

                    }

                }, this)

            }

        }

    }

    clear() {

        this.tiles.killAll();
        this.grid.forEach(function (tile) {

            tile.tint = 0xffffff;

        })

        for (let x = 0; x < this.data.width; x++) {

            this.data.points[x] = new Array(this.data.length);

            for (let y = 0; y < this.data.length; y++) {

                this.data.points[x][y] = new Array(this.data.height);

            }

        }

    }

    save() {

        this.open = true;

        let m = this;

        let panel = new Panel(128, 64);
        panel.add(new TextBox(panel.w, panel.h,

            function (elem) {

                socket.emit('save map', { map: m.data, name: elem.text.value });
                m.open = false;
                game.input.keyboard.onDownCallback = m.inputs;

            },

            'Enter'

        ));

    }

    load() {

        this.open = true;

        socket.emit('fetch maplist', this.data);

    }

    update() {

        this.grid.update();
        this.tiles.update();

        this.tiles.customSort(function (a, b) {

            return b.isoY - a.isoY + a.isoX - b.isoX + a.isoZ - b.isoZ;

        });

    }

}