gameState = {

    preload: function () {
    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        global.point = { x: 0, y: 0 };

        global.map = new PolyEdit();

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