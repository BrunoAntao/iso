class Slider extends Phaser.Graphics {

    constructor(items) {

        super(game, 0, 0);

        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);
        this.endFill();

        this.fixedToCamera = true;
        this.items = game.add.group();

        items.forEach(function (item, i) {

            this.items.add(new Item(i, item));

        }, this)

        game.add.existing(this);
    }

    update() {

        this.clear();
        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);
        this.endFill();

        game.world.bringToTop(this.items);

        let items = this.items;

        game.input.mouse.mouseWheelCallback = function (e) {

            if (e.deltaY < 0 && items.children[0].y > -(items.length - 1) * 32) {

                items.forEach(function (item) {

                    item.y -= 50;

                })

            } else if (e.deltaY > 0 && items.children[0].y < 64) {

                items.forEach(function (item) {

                    item.y += 50;

                })

            }

        }

    }

}
class Item extends Phaser.Sprite {

    constructor(id, tile) {

        let g = new Block([], 1, 1);

        switch (tile.type) {

            case 'cube':

                tile.faces.forEach(function (face, i) {

                    let sum = { x: 0, y: 0, z: 0 };

                    face.forEach(function (point) {

                        sum.x += point.x / face.length;
                        sum.y += point.y / face.length;
                        sum.z += point.z / face.length;

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

            case 'slope':

                tile.faces.forEach(function (face, i) {

                    let sum = { x: 0, y: 0, z: 0 };

                    face.forEach(function (point) {

                        sum.x += point.x / face.length;
                        sum.y += point.y / face.length;
                        sum.z += point.z / face.length;

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

        tile.type = tile.type.charAt(0).toUpperCase() + tile.type.slice(1);

        g['draw' + tile.type](tile.faces, tile.color);

        super(game, 0, 0, g.generateTexture());

        this.anchor.setTo(0.5, 0.5);

        this.x = game.width * 3 / 4 + game.width / 8;
        this.y = 64 + id * 64;
        this.frame = id;
        this.tileType = tile.type;
        this.tileAngle = tile.angle;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (item) {

            global.active = { type: item.tileType, angle: item.tileAngle };
            console.log(global.active);

        }, this)

        game.add.existing(this);
    }

    update() {

        this.x = game.width * 3 / 4 + game.width / 8;

    }

}