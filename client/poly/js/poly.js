class PolyEdit extends Phaser.Graphics {

    constructor() {

        super(game, 0, 0);

        this.selected = [];

        this.center = {

            x: 0.5,
            y: 0.5,
            z: 0.5

        }

        this.iso = {

            angle: 0,
            worldAngle: 0,
            scale: 4,
            pre: 1,
            worldPre: 0,

        }

        this.faces = new Faces(this);
        this.faces.addPoints([

            new Point(0, 0, 0),
            new Point(1, 0, 0),
            new Point(1, 1, 0),
            new Point(0, 1, 0),

            new Point(0, 0, 1),
            new Point(1, 0, 1),
            new Point(1, 1, 1),
            new Point(0, 1, 1),

            new Point(0.5, 0.5, 0),
            new Point(0.5, 0.5, 1),

            new Point(0.5, 0, 0.5),
            new Point(0.5, 1, 0.5),
            new Point(0, 0.5, 0.5),
            new Point(1, 0.5, 0.5),

            new Point(0.5, 0.5, 0.5)

        ]);

        this.faces.addGuide([

            new Point(0, 0, 0),
            new Point(0, 0, 1)

        ], 0x0000ff)
        this.faces.addGuide([

            new Point(0, 0, 0),
            new Point(0, 1, 0)

        ], 0x00ff00)
        this.faces.addGuide([

            new Point(0, 0, 0),
            new Point(1, 0, 0)

        ], 0xff0000)

        this.faces.addGuide([

            new Point(1, 0, 0),
            new Point(1, 1, 0)

        ])
        this.faces.addGuide([

            new Point(1, 1, 0),
            new Point(0, 1, 0)

        ])
        this.faces.addGuide([

            new Point(0, 0, 1),
            new Point(1, 0, 1),
            new Point(1, 1, 1),
            new Point(0, 1, 1)

        ])
        this.faces.addGuide([

            new Point(1, 0, 0),
            new Point(1, 0, 1),

        ])
        this.faces.addGuide([

            new Point(1, 1, 0),
            new Point(1, 1, 1),

        ])
        this.faces.addGuide([

            new Point(0, 1, 0),
            new Point(0, 1, 1),

        ])

        let map = this;

        global.inputs = function (e) {

            switch (e.key) {

                case 'f': map.selected = []; break;
                case 'Enter': if (map.selected.length > 1) {
                    map.faces.addFace(Object.assign([], map.selected)); map.selected = [];

                    map.faces.forEach(function (face) {

                        if (face instanceof Points) {

                            face.points.forEach(function (point) {

                                point.color = 0x000000;
                                point.selected = false;

                            })

                        }

                    })

                } break;
                case 's':

                    let data = [];

                    map.faces.forEach(function (face) {

                        if (face instanceof Face) {

                            let facep = [];

                            face.points.forEach(function (point) {

                                let pointp = {};

                                pointp.x = point.pos.x;
                                pointp.y = point.pos.y;
                                pointp.z = point.pos.z;

                                facep.push(pointp);


                            })

                            data.push(facep);

                        }

                    })

                    if (data.length > 0) {

                        global.open = true;

                        let panel = new Panel(128, 64);
                        panel.add(new TextBox(panel.w, panel.h,

                            function (elem) {

                                socket.emit('save poly', { faces: data, name: elem.text.value });
                                global.open = false;
                                game.input.keyboard.onDownCallback = global.inputs;

                            },

                            'Enter'

                        ));

                    }
                    break;

            }

        }

        game.input.keyboard.onDownCallback = global.inputs;

        let x = new InputField('x', 0, Number);
        let y = new InputField('y', 1, Number);
        let z = new InputField('z', 2, Number);
        new Button('New Point', 3, [x, y, z], function (button) {

            let pos = {x:parseFloat(x.value), y:parseFloat(y.value), z:parseFloat(z.value)};

            pos.x = pos.x < 1 ? pos.x : 1 % pos.x;
            pos.y = pos.y < 1 ? pos.y : 1 % pos.y;
            pos.z = pos.z < 1 ? pos.z : 1 % pos.z;

            map.faces.addPoints([new Point(pos.x, pos.y, pos.z)]);
            button.fields.forEach(function (field) {

                field.value = 0;

            })

        });

        game.add.existing(this);
    }

    isoTo2d(pos) {

        return {

            x: 300 / 4 + pos.x * 32 * this.iso.scale + pos.y * 32 * this.iso.scale + global.point.x,
            y: 1200 / 4 - pos.y * 16 * this.iso.pre * this.iso.scale + pos.x * 16 * this.iso.pre * this.iso.scale - pos.z * 32 * this.iso.scale + global.point.y

        }

    }

    worldAngle(angle) {

        this.rotateWorld(this.iso.angle - angle);
        this.iso.worldAngle += this.iso.angle - angle;
        this.iso.angle = angle;

    }

    rotateWorld(angle) {

        this.faces.forEach(function (tile) {

            this.rotate(tile, angle);

        }, this)

    }

    rotate(face, angle) {

        if (!(face instanceof Face)) {

            face.points.forEach(function (point) {

                let dx = point.iso.x - this.center.x;
                let dy = point.iso.y - this.center.y;

                let r = Math.sqrt(dx * dx + dy * dy);
                let a = Math.atan2(dy, dx) - angle;

                point.iso.x = this.center.x + r * Math.cos(a);
                point.iso.y = this.center.y + r * Math.sin(a);

            }, this)

        }

    }

    update() {

        if (game.input.activePointer.leftButton.isDown) {

            if (game.origDragPoint) {

                global.point.x -= game.origDragPoint.x - game.input.activePointer.position.x;
                global.point.y -= game.origDragPoint.y - game.input.activePointer.position.y;

            }

            game.origDragPoint = game.input.activePointer.position.clone();

        } else {

            game.origDragPoint = null;

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

        this.faces.customSort(function (a, b) {

            return b.iso.y - a.iso.y + a.iso.x - b.iso.x + a.iso.z - b.iso.z;

        })

        this.faces.forEach(function (face) {

            face.draw();

        })

    }

}
class Faces extends Phaser.Group {

    constructor(parent) {

        super(game);
        this.map = parent;

        game.add.existing(this);
    }

    rotate(points, angle) {

        points.points.forEach(function (point) {

            let dx = point.iso.x - this.map.center.x;
            let dy = point.iso.y - this.map.center.y;

            let r = Math.sqrt(dx * dx + dy * dy);
            let a = Math.atan2(dy, dx) - angle;

            point.iso.x = this.map.center.x + r * Math.cos(a);
            point.iso.y = this.map.center.y + r * Math.sin(a);

        }, this)

    }

    addPoints(points) {

        let point = new Points(this, points);

        this.rotate(point, this.map.iso.worldAngle);

        this.add(point);
        return point;

    }

    addFace(points, color) {

        let face = new Face(this, points, color);
        this.add(face);
        return face;

    }

    addGuide(points, color) {

        let guide = new Guide(this, points, color);
        this.add(guide);
        return guide;

    }

}
class Points extends Phaser.Graphics {

    constructor(parent, points) {

        super(game, 0, 0);

        this.faces = parent;
        this.iso = { x: 0, y: 0, z: 0 };

        this.points = points;

        this.inputEnabled = true;
        this.events.onInputOver.add(function () {

        }, this);
        this.events.onInputOut.add(function () {

        }, this);

        game.add.existing(this);
    }

    draw() {

        this.clear();

        this.points.forEach(function (point) {

            point.draw();

        }, this)


    }

    update() {

        let x = 0;
        let y = 0;
        let z = 0;
        this.points.forEach(function (point) {

            x += point.iso.x / this.points.length;
            y += point.iso.y / this.points.length;
            z += point.iso.z / this.points.length;

        }, this)

        this.iso.x = x;
        this.iso.y = y;
        this.iso.z = z;

    }

}
class Face extends Phaser.Graphics {

    constructor(parent, points, color) {

        super(game, 0, 0);

        this.faces = parent;
        this.iso = { x: 0, y: 0, z: 0 };

        this.points = points;
        this.color = color;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (face) {

            if (game.input.activePointer.leftButton.isDown) {



            } else {

                face.destroy();

            }

        }, this);
        this.events.onInputOver.add(function (face) {

            face.color = 0xffffff;

        }, this);
        this.events.onInputOut.add(function (face) {

            face.color = 0x000000;

        }, this);

        game.add.existing(this);
    }

    draw() {

        this.clear();

        this.beginFill(this.color);
        this.lineStyle(1, 0xffffff, 1);

        let pos = global.map.isoTo2d(this.points[0].iso);

        this.moveTo(pos.x, pos.y);

        this.points.forEach(function (point) {

            pos = global.map.isoTo2d(point.iso);

            this.lineTo(pos.x, pos.y);

        }, this)


        pos = global.map.isoTo2d(this.points[0].iso);

        this.lineTo(pos.x, pos.y);

        this.endFill();


    }

    update() {

        let x = 0;
        let y = 0;
        let z = 0;
        this.points.forEach(function (point) {

            x += point.iso.x / this.points.length;
            y += point.iso.y / this.points.length;
            z += point.iso.z / this.points.length;

        }, this)

        this.iso.x = x;
        this.iso.y = y;
        this.iso.z = z;

    }

}
class Guide extends Phaser.Graphics {

    constructor(parent, points, color = 0xffffff) {

        super(game, 0, 0);

        this.faces = parent;
        this.iso = { x: 0, y: 0, z: 0 };

        this.points = points;
        this.color = color;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (face) {

            if (game.input.activePointer.leftButton.isDown) {



            } else {

                face.destroy();

            }

        }, this);
        this.events.onInputOver.add(function (face) {

            face.color = 0xffffff;

        }, this);
        this.events.onInputOut.add(function (face) {

            face.color = 0x000000;

        }, this);

        game.add.existing(this);
    }

    draw() {

        this.clear();

        this.lineStyle(1, this.color, 1);

        let pos = global.map.isoTo2d(this.points[0].iso);

        this.moveTo(pos.x, pos.y);

        this.points.forEach(function (point) {

            pos = global.map.isoTo2d(point.iso);

            this.lineTo(pos.x, pos.y);

        }, this)


        pos = global.map.isoTo2d(this.points[0].iso);

        this.lineTo(pos.x, pos.y);

    }

    update() {

        let x = 0;
        let y = 0;
        let z = 0;
        this.points.forEach(function (point) {

            x += point.iso.x / this.points.length;
            y += point.iso.y / this.points.length;
            z += point.iso.z / this.points.length;

        }, this)

        this.iso.x = x;
        this.iso.y = y;
        this.iso.z = z;

    }

}
class Point extends Phaser.Graphics {

    constructor(x, y, z, color = 0x000000) {

        super(game, 0, 0);

        this.iso = { x: x, y: y, z: z, scale: 1 };
        this.pos = { x: x, y: y, z: z };
        this.color = color;
        this.rcolor = color;
        this.selected = false;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (point) {

            if (!point.selected) {

                global.map.selected.push(point);
                point.selected = true;
                point.color = 0xffffff;

            } else {

                global.map.selected.splice(global.map.selected.indexOf(point), 1);
                point.selected = false;
                point.color = this.rcolor;

            }


        }, this);
        this.events.onInputOver.add(function () {

            this.iso.scale = 2;

        }, this);
        this.events.onInputOut.add(function () {

            this.iso.scale = 1;

        }, this);

        game.add.existing(this);
    }

    draw() {

        this.clear();

        this.beginFill(this.color, 1);
        this.lineStyle(1, 0xffffff, 1);

        let pos = global.map.isoTo2d(this.iso);

        this.drawCircle(pos.x,
            pos.y,
            4 * global.map.iso.scale * this.iso.scale);

        this.endFill();

    }

}