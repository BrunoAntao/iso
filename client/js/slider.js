class Slider extends Phaser.Graphics {

    constructor(list) {

        super(game, 0, 0);

        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);
        this.endFill();

        this.iso = {

            angle: 0,
            worldAngle: 0

        }

        this.fixedToCamera = true;
        this.items = game.add.group();

        for (let i = 0; i < list.children.length; i++) {

            this.items.add(new Item(i, list.children[i]));

        }

        game.add.existing(this);
    }

    worldAngle(angle) {

        this.rotateWorld(this.iso.angle - angle);
        this.iso.worldAngle += this.iso.angle - angle;
        this.iso.angle = angle;

    }

    rotateWorld(angle) {

        this.items.forEach(function (item) {

            this.rotate(item.tile, angle);
            if (item.tile.sort) {

                item.tile.sort();

            }
            item.tile.draw();
            item.loadTexture(item.tile.generateTexture());
            item.tile.clear();

        }, this)

    }

    rotate(tile, angle) {

        if (tile instanceof Tile || tile instanceof Grid) {

            tile.face.forEach(function (point) {

                let dx = point.x - 0.5;
                let dy = point.y - 0.5;

                let r = Math.sqrt(dx * dx + dy * dy);
                let a = Math.atan2(dy, dx) - angle;

                point.x = 0.5 + r * Math.cos(a);
                point.y = 0.5 + r * Math.sin(a);

            }, this)

        }

        if (tile instanceof Cube) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - 0.5;
                    let dy = point.y - 0.5;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = 0.5 + r * Math.cos(a);
                    point.y = 0.5 + r * Math.sin(a);

                }, this)

            }, this)

        }

        if (tile instanceof Slope) {

            tile.faces.forEach(function (face) {

                face.forEach(function (point) {

                    let dx = point.x - 0.5;
                    let dy = point.y - 0.5;

                    let r = Math.sqrt(dx * dx + dy * dy);
                    let a = Math.atan2(dy, dx) - angle;

                    point.x = 0.5 + r * Math.cos(a);
                    point.y = 0.5 + r * Math.sin(a);

                }, this)

            }, this)

        }

        let dx = tile.pos.x - 0.5;
        let dy = tile.pos.y - 0.5;

        let r = Math.sqrt(dx * dx + dy * dy);
        let a = Math.atan2(dy, dx) - angle;

        tile.pos.x = 0.5 + r * Math.cos(a);
        tile.pos.y = 0.5 + r * Math.sin(a);

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

    }

}
class Item extends Phaser.Sprite {

    constructor(id, tile) {

        if (tile.sort) {

            tile.sort();

        }

        tile.draw();

        super(game, 0, 0, tile.generateTexture());

        tile.clear();

        this.anchor.setTo(0.5, 0.5);

        this.x = game.width * 3 / 4 + game.width / 8;
        this.y = 64 + id * 64;

        this.tile = tile;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (item) {

            global.active = { type: tile.block, angle: tile.fangle };
            console.log(global.active);

        }, this)

        game.add.existing(this);
    }

    update() {

        this.x = game.width * 3 / 4 + game.width / 8;

    }

}