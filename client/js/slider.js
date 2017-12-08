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

        let div = document.getElementById('game');

        this.slider = document.createElement("INPUT");
        this.slider.setAttribute('type', 'range');
        this.slider.setAttribute('id', 'range');
        this.slider.setAttribute('min', 0);
        this.slider.setAttribute('max', 1);
        this.slider.setAttribute('step', 0.1);
        this.slider.setAttribute('value', 1);
        this.slider.style.position = 'absolute';

        document.getElementById("game").appendChild(this.slider);

        this.zoom = document.createElement("INPUT");
        this.zoom.setAttribute('type', 'range');
        this.zoom.setAttribute('id', 'zoom');
        this.zoom.setAttribute('min', 0);
        this.zoom.setAttribute('max', 2);
        this.zoom.setAttribute('step', 0.1);
        this.zoom.setAttribute('value', 1);
        this.zoom.style.position = 'absolute';

        document.getElementById("game").appendChild(this.zoom);

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

        this.slider.style.width = game.width / 8 + 'px';
        this.slider.style.top = game.height * 3 / 4 + game.height / 8 + 'px';
        this.slider.style.left = game.width * 3 / 4 + game.width / 16 + 'px';

        this.zoom.style.width = game.width / 8 + 'px';
        this.zoom.style.top = game.height * 3 / 4 + game.height / 6 + 'px';
        this.zoom.style.left = game.width * 3 / 4 + game.width / 16 + 'px';


        let items = this.items;

        game.input.mouse.mouseWheelCallback = function (e) {

            if (e.deltaY < 0 && items.children[0].y > -(items.length - 1) * 32 - 202) {

                items.forEach(function (item) {

                    item.y -= 50;

                })

            } else if (e.deltaY > 0 && items.children[0].y < - 252) {

                items.forEach(function (item) {

                    item.y += 50;

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

            item.tile.export(item);

        })

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