class Block extends Phaser.Graphics {

    constructor(tiles, width, length, draw = true) {

        super(game, 0, 0);

        this.tiles = tiles;
        this.draw = draw;

        this.center = {

            x: width / 2,
            y: length / 2

        }

        this.iso = {

            angle: 0

        }

        game.add.existing(this);
    }

    worldAngle(angle) {

        this.rotateWorld(this.iso.angle - angle);
        this.iso.angle = angle;

    }

    rotateWorld(angle) {

        this.tiles.forEach(function (tile) {

            this.rotate(tile, angle);

        }, this)

    }

    rotate(tile, angle) {

        if (tile instanceof Tile) {

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

            this.tiles.sort(function (a, b) {

                return b.pos.y - a.pos.y + a.pos.x - b.pos.x + a.pos.z - b.pos.z;

            });

            console.log(this.tiles);

            this.clear();

            this.tiles.forEach(function (tile) {

                tile.draw(this);

            }, this)

        }

    }

}

class Tiles {

    constructor() {

        this.tiles = [];

    }

    rotate(center, point, angle) {

        let dx = point.x - center.x;
        let dy = point.y - center.y;

        let r = Math.sqrt(dx * dx + dy * dy);
        let a = Math.atan2(dy, dx) - angle;

        point.x = center.x + r * Math.cos(a);
        point.y = center.y + r * Math.sin(a);

    }

    addTile(x, y, z, color = 0x000000) {

        this.tiles.push(new Tile(x, y, z, color));

    }

    addCube(x, y, z, color = 0x000000) {

        this.tiles.push(new Cube(x, y, z, color));

    }

    addSlope(x, y, z, angle = 0, color = 0x000000, ) {

        let slope = new Slope(x, y, z, angle, color);

        slope.faces.forEach(function (face) {

            face.forEach(function (point) {

                this.rotate({ x: slope.pos.x + 0.5, y: slope.pos.y + 0.5 }, point, angle);

            }, this)

        }, this)

        this.tiles.push(slope);

    }

}
class Tile {

    constructor(x, y, z, color) {

        this.color = color;
        this.pos = { x: x, y: y, z: z };
        this.iso = { x: x, y: y, z: z };
        this.face = [

            { x: x + 0, y: y + 0, z: z },
            { x: x + 1, y: y + 0, z: z },
            { x: x + 1, y: y + 1, z: z },
            { x: x + 0, y: y + 1, z: z }

        ]

    }

    draw(canvas) {

        canvas.beginFill(this.color);

        canvas.lineStyle(1, 0xffffff, 1);

        canvas.moveTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 + this.face[0].x * 16 - this.face[0].z * 32 + global.point.y);

        this.face.forEach(function (point) {

            canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                1200 / 4 - point.y * 16 + point.x * 16 - point.z * 32 + global.point.y);

        })

        canvas.lineTo(300 / 4 + this.face[0].x * 32 + this.face[0].y * 32 + global.point.x,
            1200 / 4 - this.face[0].y * 16 + this.face[0].x * 16 - this.face[0].z * 32 + global.point.y);

        canvas.endFill();

    }

}
class Cube {

    constructor(x, y, z, color) {

        this.color = color;
        this.pos = { x: x, y: y, z: z };
        this.iso = { x: x, y: y, z: z };
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

    draw(canvas) {

        this.faces.forEach(function (face) {

            canvas.beginFill(this.color);

            canvas.lineStyle(1, 0xffffff, 1);

            canvas.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            face.forEach(function (point) {

                canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                    1200 / 4 - point.y * 16 + point.x * 16 - point.z * 32 + global.point.y);

            })

            canvas.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            canvas.endFill();

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
class Slope {

    constructor(x, y, z, angle, color) {

        this.color = color;
        this.pos = { x: x, y: y, z: z };
        this.iso = { x: x, y: y, z: z };
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

    draw(canvas) {

        this.faces.forEach(function (face) {

            canvas.beginFill(this.color);

            canvas.lineStyle(1, 0xffffff, 1);

            canvas.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            face.forEach(function (point) {

                canvas.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                    1200 / 4 - point.y * 16 + point.x * 16 - point.z * 32 + global.point.y);

            })

            canvas.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            canvas.endFill();

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