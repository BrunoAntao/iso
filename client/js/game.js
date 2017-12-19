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

        global.map = new Block(width, length, height);

        let items = new Tiles(global.map);
        items.addTile(0, 0, 0);
        items.addCube(0, 0, -2);
        items.addSlope(0, 0, -4);
        items.addSlope(0, 0, -6, 0x000000, Math.PI);
        items.addSlope(0, 0, -8, 0x000000, -Math.PI / 2);
        items.addSlope(0, 0, -10, 0x000000, Math.PI / 2);

        let i = -12;

        socket.emit('fetch poly');

        socket.on('poly', function (polyList) {

            polyList.forEach(function (poly) {

                items.addPolygon(0, 0, i, poly.name, poly.faces);
                global.poly[poly.name] = poly;
                i -= 2;

            })

            let slider = new Slider(items);

            hideX = function (x) {

                if (!global.hiddingY) {

                    if (global.hiddingX) {

                        global.hiddingX = false;

                        global.map.tiles.forEach(function (tile) {

                            if (tile.iso.x != x) {

                                tile.alpha = 1;
                                tile.inputEnabled = true;

                            }

                        })

                    } else {

                        global.hiddingX = true;

                        global.map.tiles.forEach(function (tile) {

                            if (tile.iso.x != x) {

                                tile.alpha = 0.2;
                                tile.inputEnabled = false;

                            }

                        }, this)

                    }

                }

            }

            hideY = function (y) {

                if (!global.hiddingX) {

                    if (global.hiddingY) {

                        global.hiddingY = false;

                        global.map.tiles.forEach(function (tile) {

                            if (tile.iso.y != y) {

                                tile.alpha = 1;
                                tile.inputEnabled = true;

                            }

                        })

                    } else {

                        global.hiddingY = true;

                        global.map.tiles.forEach(function (tile) {

                            if (tile.iso.y != y) {

                                tile.alpha = 0.2;
                                tile.inputEnabled = false;

                            }

                        }, this)

                    }

                }

            }

            clear = function () {

                global.map.tiles.forEach(function (tile) {

                    if (!(tile instanceof Grid)) {

                        tile.kill();

                    } else {

                        tile.tint = 0xffffff;

                    }

                });

                for (let x = 0; x < global.map.data.width; x++) {

                    global.map.data.points[x] = new Array(global.map.data.length);

                    for (let y = 0; y < global.map.data.length; y++) {

                        global.map.data.points[x][y] = new Array(global.map.data.height);

                    }

                }

            }

            save = function () {

                global.open = true;

                let panel = new Panel(128, 64);
                panel.add(new TextBox(panel.w, panel.h,

                    function (elem) {

                        socket.emit('save map', { map: global.map.data, name: elem.text.value });
                        global.open = false;
                        game.input.keyboard.onDownCallback = global.inputs;

                    },

                    'Enter'

                ));

            }

            load = function () {

                global.open = true;

                socket.emit('fetch maplist', global.map.data);

            }

            copyColor = function () {

                let color = slider.hexToRgb(global.over.color);
                slider.red.value = color.r;
                slider.green.value = color.g;
                slider.blue.value = color.b;

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

                                } else if(global.poly[map.points[x][y][z].type]) {

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

            global.inputs = function (e) {

                if (!game.focus) {

                    switch (e.key) {

                        case 'r': clear(); break;
                        case 's': if (!global.open) { save(); } break;
                        case 'l': if (!global.open) { load(); } break;

                    }

                    if (global.over) {

                        switch (e.key) {

                            case 'q': hideX(global.over.iso.x); break;
                            case 'e': hideY(global.over.iso.y); break;
                            case 'c': copyColor(); break;

                        }

                    }

                }

            }

            game.input.keyboard.onDownCallback = global.inputs;

        })

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