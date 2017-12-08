class Block extends Phaser.Graphics {

    constructor(width, length, height, draw = true) {

        super(game, 0, 0);

        this.draw = draw;

        this.center = {

            x: width / 2,
            y: length / 2,
            z: height / 2

        }

        this.iso = {

            angle: 0,
            worldAngle: 0,
            scale: 1,
            pre: 1,

        }

        this.tiles = new Tiles(this);

        for (let x = 0; x < width; x++) {

            for (let y = 0; y < length; y++) {

                this.tiles.addGrid(x, y, 0, 0x212121);

            }

        }

        this.tiles.addCube(0, 0, 0, 0xff0000);
        this.tiles.addCube(0, 9, 0, 0xff0000);
        this.tiles.addCube(9, 0, 0, 0xff0000);
        this.tiles.addCube(9, 9, 0, 0xff0000);
        this.tiles.addSlope(0, 1, 0, -Math.PI / 2, 0xff0000);
        this.tiles.addSlope(1, 0, 0, 0, 0xff0000);

        this.tiles.addSlope(9, 1, 0, -Math.PI / 2, 0xff0000);
        this.tiles.addSlope(8, 0, 0, Math.PI, 0xff0000);

        this.tiles.addSlope(0, 8, 0, Math.PI / 2, 0xff0000);
        this.tiles.addSlope(1, 9, 0, 0, 0xff0000);

        this.tiles.addSlope(9, 8, 0, Math.PI / 2, 0xff0000);
        this.tiles.addSlope(8, 9, 0, Math.PI, 0xff0000);

        let map = this;

        game.add.existing(this);
    }

    worldAngle(angle) {

        this.rotateWorld(this.iso.angle - angle);
        this.iso.worldAngle += this.iso.angle - angle;
        this.iso.angle = angle;

    }

    rotateWorld(angle) {

        this.tiles.forEach(function (tile) {

            this.rotate(tile, angle);

        }, this)

    }

    rotate(tile, angle) {

        if (tile instanceof Tile || tile instanceof Grid) {

            tile.face.forEach(function (point) {

                let dx = point.x - this.center.x;
                let dy = point.y - this.center.y;

                let r = Math.sqrt(dx * dx + dy * dy);
                let a = Math.atan2(dy, dx) - angle;

                point.x = this.center.x + r * Math.cos(a);
                point.y = this.center.y + r * Math.sin(a);

            }, this)

        }

        if (tile instanceof Cube) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - this.center.x;
                    let dy = point.y - this.center.y;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = this.center.x + r * Math.cos(a);
                    point.y = this.center.y + r * Math.sin(a);

                }, this)

            }, this)

        }

        if (tile instanceof Slope) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - this.center.x;
                    let dy = point.y - this.center.y;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = this.center.x + r * Math.cos(a);
                    point.y = this.center.y + r * Math.sin(a);

                }, this)

            }, this)

        }

        let dx = tile.pos.x - this.center.x;
        let dy = tile.pos.y - this.center.y;

        let r = Math.sqrt(dx * dx + dy * dy);
        let a = Math.atan2(dy, dx) - angle;

        tile.pos.x = this.center.x + r * Math.cos(a);
        tile.pos.y = this.center.y + r * Math.sin(a);

    }

    update() {

        if (this.draw) {

            if (document.getElementById('range')) {

                this.iso.pre = document.getElementById('range').value;

            }

            if (document.getElementById('zoom')) {

                this.iso.scale = document.getElementById('zoom').value;

            }

            if (game.input.activePointer.rightButton.isDown) {

                if (game.origDragPointr) {

                    this.worldAngle(-(game.input.activePointer.x - game.origDragPointr.x) / 100);

                } else {

                    game.origDragPointr = game.input.activePointer.position.clone();
                    this.iso.angle = 0;

                }

            } else {

                game.origDragPointr = null;

            }

            this.tiles.forEach(function (tile) {

                if (tile.sort) {

                    tile.sort();

                }

            })

            this.tiles.customSort(function (a, b) {

                return b.pos.y - a.pos.y + a.pos.x - b.pos.x + a.pos.z - b.pos.z;

            });

            this.tiles.forEach(function (tile) {

                tile.draw();

            }, this)

            this.tiles.forEach(function (tile) {

                tile.x = 300 / 4 * (1 - this.iso.scale) + this.center.x * 64 * (1 - this.iso.scale) + global.point.x * (1 - this.iso.scale);
                tile.y = 1200 / 4 * (1 - this.iso.scale) - 16 * this.iso.pre * (1 - this.iso.scale) + 16 * this.iso.pre * (1 - this.iso.scale) - 32 * (1 - this.iso.scale) + global.point.y * (1 - this.iso.scale);

            }, this)

        }

    }

}
class Tiles extends Phaser.Group {

    constructor(parent) {

        super(game);
        this.map = parent;

    }

    rotate(center, tile, angle) {

        if (tile instanceof Tile || tile instanceof Grid) {

            tile.face.forEach(function (point) {

                let dx = point.x - center.x;
                let dy = point.y - center.y;

                let r = Math.sqrt(dx * dx + dy * dy);
                let a = Math.atan2(dy, dx) - angle;

                point.x = center.x + r * Math.cos(a);
                point.y = center.y + r * Math.sin(a);

            }, this)

        }

        if (tile instanceof Cube) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - center.x;
                    let dy = point.y - center.y;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = center.x + r * Math.cos(a);
                    point.y = center.y + r * Math.sin(a);

                }, this)

            }, this)

        }

        if (tile instanceof Slope) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - center.x;
                    let dy = point.y - center.y;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = center.x + r * Math.cos(a);
                    point.y = center.y + r * Math.sin(a);

                }, this)

            }, this)

        }

        let dx = tile.pos.x - center.x;
        let dy = tile.pos.y - center.y;

        let r = Math.sqrt(dx * dx + dy * dy);
        let a = Math.atan2(dy, dx) - angle;

        tile.pos.x = center.x + r * Math.cos(a);
        tile.pos.y = center.y + r * Math.sin(a);

    }

    slopeRotate(tile, angle) {

        tile.faces.forEach(function (face) {

            face.forEach(function (point) {

                let dx = point.x - (tile.pos.x + 0.5);
                let dy = point.y - (tile.pos.y + 0.5);

                let r = Math.sqrt(dx * dx + dy * dy);
                let a = Math.atan2(dy, dx) - angle;

                point.x = tile.pos.x + 0.5 + r * Math.cos(a);
                point.y = tile.pos.y + 0.5 + r * Math.sin(a);

            }, this)

        }, this)

    }

    addGrid(x, y, z, color = 0x000000) {

        this.forEach(function (tile) {

            if (tile.iso.x == x && tile.iso.y == y && tile.iso.z == z) {

                this.remove(tile);

            }

        }, this)

        let grid = new Grid(x, y, z, color, this);

        if (this.map) {

            this.rotate({ x: this.map.center.x, y: this.map.center.y }, grid, this.map.iso.worldAngle);

        }

        this.add(grid);
    }

    addTile(x, y, z, color = 0x000000) {

        this.forEach(function (tile) {

            if (tile.iso.x == x && tile.iso.y == y && tile.iso.z == z) {

                this.remove(tile);

            }

        }, this)

        let tile = new Tile(x, y, z, color, this);

        if (this.map) {

            this.rotate({ x: this.map.center.x, y: this.map.center.y }, tile, this.map.iso.worldAngle);

        }

        this.add(tile);
    }

    addCube(x, y, z, color = 0x000000) {

        this.forEach(function (tile) {

            if (tile.iso.x == x && tile.iso.y == y && tile.iso.z == z) {

                this.remove(tile);

            }

        }, this)

        let cube = new Cube(x, y, z, color, this);

        if (this.map) {

            this.rotate({ x: this.map.center.x, y: this.map.center.y }, cube, this.map.iso.worldAngle);

        }

        this.add(cube);

    }

    addSlope(x, y, z, angle = 0, color = 0x000000) {

        this.forEach(function (tile) {

            if (tile.iso.x == x && tile.iso.y == y && tile.iso.z == z) {

                this.remove(tile);

            }

        }, this)

        let slope = new Slope(x, y, z, angle, color, this);

        this.slopeRotate(slope, angle);

        if (this.map) {

            this.rotate({ x: this.map.center.x, y: this.map.center.y }, slope, this.map.iso.worldAngle);

        }

        this.add(slope);

    }

}
class Iso extends Phaser.Graphics {

    constructor(x, y, z, parent) {

        super(game, 0, 0);

        this.pos = { x: x, y: y, z: z };
        this.iso = { x: x, y: y, z: z };
        this.tiles = parent;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (tile) {

            if (game.input.activePointer.leftButton.isDown) {

                if (!(tile instanceof Grid)) {

                    if (global.active.type != 'Slope') {

                        tile.tiles['add' + global.active.type](tile.iso.x, tile.iso.y, tile.iso.z + 1);

                    } else {

                        tile.tiles['add' + global.active.type](tile.iso.x, tile.iso.y, tile.iso.z + 1, global.active.angle);

                    }

                } else {

                    if (global.active.type != 'Slope') {

                        tile.tiles['add' + global.active.type](tile.iso.x, tile.iso.y, tile.iso.z);

                    } else {

                        tile.tiles['add' + global.active.type](tile.iso.x, tile.iso.y, tile.iso.z, global.active.angle);

                    }

                }

            } else {

                if (!(tile instanceof Grid)) {

                    if (tile.iso.z == 0) {

                        tile.tiles.addGrid(tile.iso.x, tile.iso.y, tile.iso.z, 0x212121);

                    } else {

                        tile.tiles.remove(tile);

                    }

                }

            }

        })
        this.events.onInputOver.add(function (tile) {

            tile.tint = 0xaaaaaa;

        })
        this.events.onInputOut.add(function (tile) {

            tile.tint = 0xffffff;

        })

        game.add.existing(this);
    }

    update() {

        this.scale.setTo(this.tiles.map.iso.scale, this.tiles.map.iso.scale);

    }

}
class Grid extends Iso {

    constructor(x, y, z, color, parent) {

        super(x, y, z, parent);

        this.color = color;
        this.block = 'Grid';
        this.face = [

            { x: x + 0, y: y + 0, z: z },
            { x: x + 1, y: y + 0, z: z },
            { x: x + 1, y: y + 1, z: z },
            { x: x + 0, y: y + 1, z: z }

        ]

    }

    export(canvas) {

        canvas.clear();

        canvas.beginFill(this.color);

        canvas.lineStyle(1, 0xffffff, 1);

        canvas.moveTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32);

        this.face.forEach(function (point) {

            canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32,
                1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32);

        }, this)

        canvas.lineTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32);

        canvas.endFill();

    }

    draw() {

        this.clear();

        this.beginFill(this.color);

        this.lineStyle(1, 0xffffff, 1);

        this.moveTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32 + global.point.y);

        this.face.forEach(function (point) {

            this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32 + global.point.y);

        }, this)

        this.lineTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32 + global.point.y);

        this.endFill();

    }

}
class Tile extends Iso {

    constructor(x, y, z, color, parent) {

        super(x, y, z, parent);

        this.color = color;
        this.block = 'Tile';
        this.face = [

            { x: x + 0, y: y + 0, z: z },
            { x: x + 1, y: y + 0, z: z },
            { x: x + 1, y: y + 1, z: z },
            { x: x + 0, y: y + 1, z: z }

        ]

    }

    export(canvas) {

        canvas.clear();

        canvas.beginFill(this.color);

        canvas.lineStyle(1, 0xffffff, 1);

        canvas.moveTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32);

        this.face.forEach(function (point) {

            canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32,
                1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32);

        }, this)

        canvas.lineTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32);

        canvas.endFill();

    }

    draw() {

        this.clear();

        this.beginFill(this.color);

        this.lineStyle(1, 0xffffff, 1);

        this.moveTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32 + global.point.y);

        this.face.forEach(function (point) {

            this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32 + global.point.y);

        }, this)

        this.lineTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 * this.tiles.map.iso.pre + this.face[0].x * 16 * this.tiles.map.iso.pre - this.face[0].z * 32 + global.point.y);

        this.endFill();

    }

}
class Cube extends Iso {

    constructor(x, y, z, color, parent) {

        super(x, y, z, parent);

        this.color = color;
        this.block = 'Cube';
        this.faces = [

            [
                { x: x + 0, y: y + 0, z: z },
                { x: x + 1, y: y + 0, z: z },
                { x: x + 1, y: y + 1, z: z },
                { x: x + 0, y: y + 1, z: z },

            ],
            [

                { x: x + 0, y: y + 0, z: z + 1 },
                { x: x + 0, y: y + 0, z: z + 0 },
                { x: x + 0, y: y + 1, z: z + 0 },
                { x: x + 0, y: y + 1, z: z + 1 },

            ],
            [

                { x: x + 1, y: y + 0, z: z + 0 },
                { x: x + 1, y: y + 0, z: z + 1 },
                { x: x + 1, y: y + 1, z: z + 1 },
                { x: x + 1, y: y + 1, z: z + 0 },

            ],
            [

                { x: x + 0, y: y + 1, z: z + 1 },
                { x: x + 0, y: y + 1, z: z + 0 },
                { x: x + 1, y: y + 1, z: z + 0 },
                { x: x + 1, y: y + 1, z: z + 1 },

            ],
            [

                { x: x + 0, y: y + 0, z: z + 0 },
                { x: x + 0, y: y + 0, z: z + 1 },
                { x: x + 1, y: y + 0, z: z + 1 },
                { x: x + 1, y: y + 0, z: z + 0 },

            ],
            [

                { x: x + 0, y: y + 0, z: z + 1 },
                { x: x + 1, y: y + 0, z: z + 1 },
                { x: x + 1, y: y + 1, z: z + 1 },
                { x: x + 0, y: y + 1, z: z + 1 },

            ],

        ]

    }

    export(canvas) {

        canvas.clear();

        this.faces.forEach(function (face) {

            canvas.beginFill(this.color);

            canvas.lineStyle(1, 0xffffff, 1);

            canvas.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32);

            face.forEach(function (point) {

                canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32,
                    1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32);

            }, this)

            canvas.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32);

            canvas.endFill();

        }, this)

    }

    draw() {

        this.clear();

        this.faces.forEach(function (face) {

            this.beginFill(this.color);

            this.lineStyle(1, 0xffffff, 1);

            this.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32 + global.point.y);

            face.forEach(function (point) {

                this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                    1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32 + global.point.y);

            }, this)

            this.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32 + global.point.y);

            this.endFill();

        }, this)

    }

    sort() {

        this.faces.forEach(function (face, i) {

            let sum = { x: 0, y: 0, z: 0 };

            face.forEach(function (point) {

                sum.x += point.x / face.length;
                sum.y += point.y / face.length;
                sum.z += point.z / face.length;

            })

            face.sum = sum;

        })

        this.faces.sort(function (a, b) {

            return b.sum.y - a.sum.y + a.sum.x - b.sum.x + a.sum.z - b.sum.z;

        })

    }

}
class Slope extends Iso {

    constructor(x, y, z, angle, color, parent) {

        super(x, y, z, parent);

        this.color = color;
        this.block = 'Slope';
        this.fangle = angle;
        this.faces = [

            [
                { x: x + 0, y: y + 0, z: z },
                { x: x + 1, y: y + 0, z: z },
                { x: x + 1, y: y + 1, z: z },
                { x: x + 0, y: y + 1, z: z },

            ],
            [

                { x: x + 0, y: y + 0, z: z },
                { x: x + 1, y: y + 0, z: z },
                { x: x + 0, y: y + 0, z: z + 1 },

            ],
            [

                { x: x + 0, y: y + 1, z: z },
                { x: x + 1, y: y + 1, z: z },
                { x: x + 0, y: y + 1, z: z + 1 },

            ],
            [

                { x: x + 0, y: y + 0, z: z + 1 },
                { x: x + 0, y: y + 0, z: z + 0 },
                { x: x + 0, y: y + 1, z: z + 0 },
                { x: x + 0, y: y + 1, z: z + 1 },

            ],
            [

                { x: x + 0, y: y + 1, z: z + 1 },
                { x: x + 1, y: y + 1, z: z + 0 },
                { x: x + 1, y: y + 0, z: z + 0 },
                { x: x + 0, y: y + 0, z: z + 1 },

            ]

        ]

    }

    export(canvas) {

        canvas.clear();

        this.faces.forEach(function (face) {

            canvas.beginFill(this.color);

            canvas.lineStyle(1, 0xffffff, 1);

            canvas.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32);

            face.forEach(function (point) {

                canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32,
                    1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32);

            }, this)

            canvas.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32);

            canvas.endFill();

        }, this)

    }

    draw() {

        this.clear();

        this.faces.forEach(function (face) {

            this.beginFill(this.color);

            this.lineStyle(1, 0xffffff, 1);

            this.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32 + global.point.y);

            face.forEach(function (point) {

                this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                    1200 / 4 - point.y * 16 * this.tiles.map.iso.pre + point.x * 16 * this.tiles.map.iso.pre - point.z * 32 + global.point.y);

            }, this)

            this.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 * this.tiles.map.iso.pre + face[0].x * 16 * this.tiles.map.iso.pre - face[0].z * 32 + global.point.y);

            this.endFill();

        }, this)

    }

    sort() {

        this.faces.forEach(function (face, i) {

            let sum = { x: 0, y: 0, z: 0 };

            face.forEach(function (point) {

                sum.x += point.x / face.length;
                sum.y += point.y / face.length;
                sum.z += point.z / face.length;

            })

            face.sum = sum;

        })

        this.faces.sort(function (a, b) {

            return b.sum.y - a.sum.y + a.sum.x - b.sum.x + a.sum.z - b.sum.z;

        })

    }

}