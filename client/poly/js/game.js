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
    },

    render: function () {
    },

}