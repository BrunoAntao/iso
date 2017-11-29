class Tile extends Phaser.Sprite {

    constructor(x, y, z, frame, group) {

        super(game, 1000 / 4 + x * 32 + y * 32 + global.point.x, 1000 / 4 - y * 16 + x * 16 - z * 32 + global.point.y, 'tile');

        this.anchor.setTo(0.5, 0.5);

        this.isoX = x;
        this.isoY = y;
        this.isoZ = z;

        this.frame = frame;
        this.group = group;

        this.inputEnabled = true;
        this.input.pixelPerfectOver = true;
        this.input.pixelPerfectClick = true;

        this.events.onInputOver.add(function (tile) {

            tile.tint = 0xaaaaaa;
            tile.group.parent.over = tile;

        }, this)

        this.events.onInputOut.add(function (tile) {

            tile.tint = 0xffffff;

        }, this)

        this.events.onInputDown.add(function (tile) {

            if (game.input.activePointer.leftButton.isDown && !tile.group.parent.data.points[tile.isoX][tile.isoY][tile.isoZ] && tile.isoZ < group.parent.data.height) {

                let cube = new Cube(tile.isoX, tile.isoY, tile.isoZ + 1, global.active, group.parent.children[1]);
                tile.group.parent.data.points[tile.isoX][tile.isoY][tile.isoZ] = global.active;

            } else if (game.input.activePointer.rightButton.isDown && tile.group.name != 'grid') {

                tile.destroy();
                tile.group.parent.data.points[tile.isoX][tile.isoY][tile.isoZ - 1] = null;

            }

        }, this)

        game.add.existing(this);
        this.group.add(this);
    }

}
class Grid extends Tile {

    constructor(x, y, z, frame, group) {

        super(x, y, z, frame, group);

        this.anchor.setTo(0.5, 0.25);

        this.loadTexture('cube');

        this.isoX = x;
        this.isoY = y;
        this.isoZ = z;

        this.frame = frame;
        this.group = group;
    }

}
class Cube extends Tile {

    constructor(x, y, z, frame, group) {

        super(x, y, z, frame, group);

        this.anchor.setTo(0.5, 0.25);

        this.isoX = x;
        this.isoY = y;
        this.isoZ = z;

        this.frame = frame;
        this.group = group;
    }

}