gameState = {

    preload: function () {

        game.load.spritesheet('tile', 'client/assets/tiles.png', 64, 64);
        game.load.spritesheet('grid', 'client/assets/grid.png', 64, 64);

    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        global.active = 1;
        global.point = { x: 0, y: 0 };

        let tiles = new Tiles();
        let width = 10;
        let length = 10;

        for (let x = 0; x < width; x++) {

            for (let y = 0; y < length; y++) {

                tiles.addTile(x, y, 0);

            }

        }

        tiles.addCube(0, 0, 1, 0xff0000);
        tiles.addCube(0, 9, 1, 0xff0000);
        tiles.addCube(9, 0, 1, 0xff0000);
        tiles.addCube(9, 9, 1, 0xff0000);
        tiles.addSlope(0, 1, 1, 0, 0xff0000);

        new Block(tiles.tiles, width, length);

        // let items = new Tiles();

        // items.addTile(0, 0, 0);
        // items.addCube(1, 0, 0);
        // items.addSlope(2, 0, 0);
        // items.addSlope(3, 0, 0, Math.PI);
        // items.addSlope(4, 0, 0, Math.PI/2);
        // items.addSlope(5, 0, 0, -Math.PI/2);

        // new Slider(items.tiles);

    },

    update: function () {

        if (game.input.activePointer.leftButton.isDown) {

            if (game.origDragPoint) {

                global.point.x -= game.origDragPoint.x - game.input.activePointer.position.x;
                global.point.y -= game.origDragPoint.y - game.input.activePointer.position.y;

            }

            game.origDragPoint = game.input.activePointer.position.clone();

        } else {

            game.origDragPoint = null;

        }

    },

    render: function () {
    },

}