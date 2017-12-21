class Slider extends Phaser.Graphics {

    constructor(list) {

        super(game, 0, 0);

        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);
        this.endFill();

        this.cover = game.add.graphics(0, 0);

        this.iso = {

            angle: 0,
            worldAngle: 0

        }

        this.fixedToCamera = true;
        this.items = game.add.group();

        for (let i = 0; i < list.children.length; i++) {

            this.items.add(new Item(i, list.children[i]));

        }

        this.cHex = function (c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        this.rgb = function (r, g, b) {
            return "0x" + this.cHex(r) + this.cHex(g) + this.cHex(b);
        }

        this.hexToRgb = function (hex) {

            var arrBuff = new ArrayBuffer(4);
            var vw = new DataView(arrBuff);
            vw.setUint32(0, parseInt(hex, 16), false);
            var arrByte = new Uint8Array(arrBuff);

            return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
        }

        this.pallete = new Pallete(12);

        this.pre = new Range(this, 'game', 'pre', 16, 0, 1, 0.1, 1);
        this.zoom = new Range(this, 'game', 'zoom', 17, 0.1, 2.1, 0.1, 1.1);

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

        } else {

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

            if (e.deltaY < 0 && items.children[0].y > -((items.length - game.height / 2 / 64) * 64) - 252)  {

                items.forEach(function (item) {

                    item.y -= 64;

                })

            } else if (e.deltaY > 0 && items.children[0].y < -252) {

                items.forEach(function (item) {

                    item.y += 64;

                })

            }

        }

        if (game.input.activePointer.rightButton.isDown) {

            if (game.origDragPointsr) {

                this.worldAngle(-(game.input.activePointer.x - game.origDragPointsr.x) / 100);

            } else {

                game.origDragPointsr = game.input.activePointer.position.clone();
                this.iso.angle = 0;

            }

        } else {

            game.origDragPointsr = null;

        }

        this.items.forEach(function (item) {

            if (item.tile.sort) {

                item.tile.sort();

            }

            item.tile.color = this.pallete.selected;
            global.active.color = item.tile.color;
            item.tile.export(item);

        }, this)

        this.cover.clear();
        this.cover.beginFill(0x000000);
        this.cover.lineStyle(2, 0xffffff, 1);
        this.cover.drawRect(game.width * 3 / 4, game.height / 2, game.width / 4, game.height / 2);
        this.cover.endFill();

        game.world.bringToTop(this.cover);
        game.world.bringToTop(this.pallete);
        game.world.bringToTop(this.pallete.cDisplays);
        game.world.bringToTop(this.pallete.cSDisplays);

    }

}
class Item extends Phaser.Graphics {

    constructor(id, tile) {

        super(game, 0, 0);

        if (tile.sort) {

            tile.sort();

        }

        tile.export(this);

        this.anchor.setTo(0.5, 0.5);

        this.x = game.width * 3 / 4 + game.width / 32;
        this.y = -252;

        this.tile = tile;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (item) {

            global.active = { type: tile.block, angle: tile.fangle };

        }, this)

        game.add.existing(this);
    }

    update() {

        this.x = game.width * 3 / 4 + game.width / 8 - 300 / 4 - 32;

    }

}