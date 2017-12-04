class Block extends Phaser.Graphics {

    constructor(list, width, length) {

        super(game, 0, 0);

        this.tiles = list;

        this.center = {

            x: width / 2,
            y: length / 2

        }

        game.add.existing(this);
    }

    rotate(point, angle) {

        let dx = point.x - this.center.x;
        let dy = point.y - this.center.y;

        let r = Math.sqrt(dx * dx + dy * dy);
        let a = Math.atan2(dy, dx) - angle;

        point.x = this.center.x + r * Math.cos(a);
        point.y = this.center.y + r * Math.sin(a);

    }

    drawTile(face) {

        this.beginFill(0x000000);

        this.lineStyle(1, 0xffffff, 1);

        this.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
            1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

        face.forEach(function (point) {

            this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                1200 / 4 - point.y * 16 + point.x * 16 - point.z * 32 + global.point.y);

        }, this)

        this.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
            1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

        this.endFill();

    };

    drawCube(faces) {

        faces.forEach(function (face) {

            this.beginFill(0x000000);

            this.lineStyle(1, 0xffffff, 1);

            this.moveTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            face.forEach(function (point) {

                this.lineTo(300 / 4 + point.x * 32 + point.y * 32 + global.point.x,
                    1200 / 4 - point.y * 16 + point.x * 16 - point.z * 32 + global.point.y);

            }, this)

            this.lineTo(300 / 4 + face[0].x * 32 + face[0].y * 32 + global.point.x,
                1200 / 4 - face[0].y * 16 + face[0].x * 16 - face[0].z * 32 + global.point.y);

            this.endFill();

        }, this)

    }

    update() {


        this.tiles.forEach(function (tile) {

            switch (tile.type) {

                case 'tile': tile.faces.forEach(function (point) {

                    this.rotate(point, 0.01);

                }, this)

                    break;

                case 'cube': tile.faces.forEach(function (face) {

                    face.forEach(function (point) {

                        this.rotate(point, 0.01);

                    }, this)

                }, this)

                    break;

            }


        }, this)

        this.tiles.forEach(function (tile) {

            switch (tile.type) {

                case 'cube':

                    tile.faces.forEach(function (face, i) {

                        let sum = { x: 0, y: 0, z: 0 };

                        face.forEach(function (point) {

                            sum.x += point.x;
                            sum.y += point.y;
                            sum.z += point.z;

                        })

                        face.sum = sum;

                    })

                    tile.faces.sort(function (a, b) {

                        return b.sum.y - a.sum.y + a.sum.x - b.sum.x + a.sum.z - b.sum.z;

                    })

                    tile.faces.forEach(function (face, i) {

                        face.sum = undefined;

                    })

                    break;

            }


        }, this)

        this.tiles.sort(function (a, b) {

            switch (a.type) {

                case 'tile':

                    a = a.faces[0];

                    break;

                case 'cube':

                    a = a.faces[0][0];

                    break;

            }

            switch (b.type) {

                case 'tile':

                    b = b.faces[0];

                    break;

                case 'cube':

                    b = b.faces[0][0];

                    break;

            }

            return b.y - a.y + a.x - b.x + a.z - b.z;

        });

        this.clear();

        this.tiles.forEach(function (tile) {

            switch (tile.type) {

                case 'tile': this.drawTile(tile.faces); break;
                case 'cube': this.drawCube(tile.faces); break;

            }

        }, this)

    }

}

class Tiles {

    constructor() {

        this.tiles = [];

    }

    addTile(x, y, z) {

        this.tiles.push(

            {

                type: 'tile',
                faces: [

                    { x: x + 0, y: y + 0, z: z },
                    { x: x + 1, y: y + 0, z: z },
                    { x: x + 1, y: y + 1, z: z },
                    { x: x + 0, y: y + 1, z: z }

                ]

            }

        );

    }

    addCube(x, y, z) {

        this.tiles.push(

            {

                type: 'cube',
                faces: [

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

        );

    }

}