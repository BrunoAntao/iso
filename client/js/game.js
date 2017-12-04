gameState = {

    preload: function () {

        game.load.spritesheet('tile', 'client/assets/tiles.png', 64, 64);
        game.load.spritesheet('cube', 'client/assets/cubes.png', 64, 64);

    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        global.active = 1;
        global.point = {x:0, y:0};

        global.map = new Map(10, 10, 10);

        let size = game.cache._cache.image.tile.base.width / game.cache._cache.image.tile.frameWidth;

        let list = [];

        for (let i = 0; i < size; i++) {

            list[i] = i;

        }

        new Slider(list);

        global.map.add_player(new Player(0, 0, 0));

    },

    update: function () {

        if (game.input.activePointer.isDown) {

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