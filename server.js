let express = require('express');
let app = express();
let http = require('http').Server(app);
var io = require('socket.io')(http);
let fs = require('fs');
let port = 80;

app.set('view engine', 'ejs');
app.use('/client', express.static('client'));

require('./server/routes.js')(app);

http.listen(port, function () {

    console.log('listening on: ' + port);


    io.on('connection', function (socket) {

        console.log('User ' + socket.id + ': connected');

        socket.on('save map', function (map) {

            console.log('User ' + socket.id + ': saved map');

            fs.writeFileSync('./server/map.json', JSON.stringify(map));

        });

        socket.on('fetch map', function () {

            console.log('User ' + socket.id + ': fetched map');

            let map = JSON.parse(fs.readFileSync('./server/map.json'));

            socket.emit('map', map);

        });

        socket.on('disconnect', function () {

            console.log('User ' + socket.id + ': disconected');

        });

    });

});