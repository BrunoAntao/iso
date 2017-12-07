gameState = {

    preload: function () {
    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        global.active = {type: 'Tile', angle:0};
        global.point = { x: 0, y: 0 };

        let width = 10;
        let length = 10;
        let height = 10;

        global.map = new Block(width, length, height);

        let items = new Tiles(global.map);
        items.addTile(0, 0, 0);
        items.addCube(0, 0, -2);
        items.addSlope(0, 0, -4);
        items.addSlope(0, 0, -6, Math.PI);
        items.addSlope(0, 0, -8, -Math.PI/2);
        items.addSlope(0, 0, -10, Math.PI/2);

        new Slider(items);

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