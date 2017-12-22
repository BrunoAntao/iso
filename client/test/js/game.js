gameState = {

    preload: function () {
    },

    create: function () {

        game.stage.backgroundColor = "#212121";
        game.stage.smoothed = false;
        game.stage.disableVisibilityChange = true;
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        global.active = { type: 'Cube', angle: 0, color: 0xffffff };
        global.over = { x: 0, y: 0, z: 0 };
        global.point = { x: 0, y: 0 };
        global.open = false;
        global.hiddingX = false;
        global.hiddingY = false;
        global.poly = [];

        let width = 10;
        let length = 10;
        let height = 10;

        global.map = new Map(width, length, height);

        socket.emit('fetch poly');

        socket.on('poly', function (polyList) {

            polyList.forEach(function (poly) {

                global.poly[poly.name] = poly;

            })

            load = function () {

                global.open = true;

                socket.emit('fetch maplist');

            }

            clear = function () {

                global.map.tiles.forEach(function (tile) {

                    tile.kill();

                });

                for (let x = 0; x < global.map.data.width; x++) {

                    global.map.data.points[x] = new Array(global.map.data.length);

                    for (let y = 0; y < global.map.data.length; y++) {

                        global.map.data.points[x][y] = new Array(global.map.data.height);

                    }

                }

            }

            socket.on('maplist', function (maplist) {

                let panel = new Panel(128, 64)
                panel.add(new SelectList(panel.w, panel.h, maplist,

                    function (elem) {

                        socket.emit('fetch map', elem.text.options[elem.text.selectedIndex].value);
                        global.open = false;
                        game.input.keyboard.onDownCallback = global.inputs;

                    },

                    'Enter'

                ));

            })

            socket.on('map', function (map) {

                clear();

                for (let x = 0; x < map.width; x++) {

                    for (let y = 0; y < map.length; y++) {

                        for (let z = 0; z < map.height; z++) {

                            if (map.points[x][y][z]) {

                                if (global.map.tiles['add' + map.points[x][y][z].type]) {

                                    global.map.tiles['add' + map.points[x][y][z].type](x, y, z, map.points[x][y][z].color, map.points[x][y][z].angle);

                                } else if (global.poly[map.points[x][y][z].type]) {

                                    global.map.tiles['addPolygon'](x, y, z, map.points[x][y][z].type, global.poly[map.points[x][y][z].type].faces, map.points[x][y][z].color, map.points[x][y][z].angle);

                                } else {

                                    console.log('invalid poly');

                                }

                                global.map.data.points[x][y][z] = map.points[x][y][z];

                            }

                        }

                    }

                }

            })

            load();

        })

    },

    update: function () {
    },

    render: function () {
    },

}