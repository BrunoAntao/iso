module.exports = function(app, map) {

    app.get('/', function(req, res) {

        res.render('index.ejs');

    });

    app.get('/poly', function(req, res) {

        res.render('poly.ejs');

    });

    app.get('/test', function(req, res) {

        res.render('test.ejs');

    });

};
