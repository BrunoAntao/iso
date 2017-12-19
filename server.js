let compression = require('compression');
let express = require('express');
let app = express();
let http = require('http').Server(app);
var io = require('socket.io')(http);
let fs = require('fs');
let port = 80;

app.set('view engine', 'ejs');
app.use(compression());
app.use('/client', express.static('client'));

require('./server/routes.js')(app);

http.listen(port, function () {

    console.log('listening on: ' + port);


    io.on('connection', function (socket) {

        console.log('User ' + socket.id + ': connected');

        socket.on('save map', function (data) {

            console.log('User ' + socket.id + ': saved map');

            fs.writeFileSync('./server/maps/' + data.name + '.json', JSON.stringify(data.map));

        });

        socket.on('save poly', function (data) {

            console.log('User ' + socket.id + ': saved poly');

            fs.writeFileSync('./server/poly/' + data.name + '.json', JSON.stringify(data.faces));

        });

        socket.on('fetch maplist', function () {

            console.log('User ' + socket.id + ': fetched maplist');

            let maplist = fs.readdirSync('./server/maps');

            socket.emit('maplist', maplist);

        });

        socket.on('fetch map', function (name) {

            console.log('User ' + socket.id + ': fetched map');

            let map = JSON.parse(fs.readFileSync('./server/maps/' + name));

            socket.emit('map', map);

        });

        socket.on('fetch poly', function () {

            console.log('User ' + socket.id + ': fetched poly');

            let polyList = fs.readdirSync('./server/poly');

            let pols = [];

            polyList.forEach(function (poly) {

                let p = JSON.parse(fs.readFileSync('./server/poly/' + poly));
                pols.push({name:poly.substr(0, poly.length-5), faces:p});

            })

            socket.emit('poly', pols);

        });

        socket.on('disconnect', function () {

            console.log('User ' + socket.id + ': disconected');

        });

    });

});