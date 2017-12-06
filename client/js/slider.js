class Slider extends Phaser.Graphics {

    constructor(list) {

        super(game, 0, 0);

        this.beginFill(0x000000);
        this.lineStyle(2, 0xffffff, 1);
        this.drawRect(game.width * 3 / 4, 0, game.width / 4, game.height);
        this.endFill();

        this.fixedToCamera = true;
        this.items = game.add.group();

        for(let i = 0; i < list.children.length; i++) {

            this.items.add(new Item(i, list.children[i]));

        }

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

        if(tile.sort) {

            tile.sort();

        }

        tile.draw();

        super(game, 0, 0, tile.generateTexture());

        tile.clear();

        this.anchor.setTo(0.5, 0.5);

        this.x = game.width * 3 / 4 + game.width / 8;
        this.y = 64 + id * 64;

        this.inputEnabled = true;
        this.events.onInputDown.add(function (item) {

            global.active = {type:tile.block, angle:tile.fangle};
            console.log(global.active);

        }, this)

        game.add.existing(this);
    }

    update() {

        this.x = game.width * 3 / 4 + game.width / 8;

    }

}