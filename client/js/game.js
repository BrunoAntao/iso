gameState = {

    preload: function () {

        game.load.spritesheet('tile', 'client/assets/tiles.png', 64, 32);
        game.load.spritesheet('cube', 'client/assets/cubes.png', 64, 64);

    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        game.world.setBounds(0, 0, 1000, 1000);

        global.map = new Map(10, 10, 10);

    },

    update: function () {

        if (game.input.activePointer.isDown) {
            if (game.origDragPoint) {

                game.camera.x += game.origDragPoint.x - game.input.activePointer.position.x;
                game.camera.y += game.origDragPoint.y - game.input.activePointer.position.y;

            }

            game.origDragPoint = game.input.activePointer.position.clone();

        } else {

            game.origDragPoint = null;

        }

    },

    render: function () {
    },

}