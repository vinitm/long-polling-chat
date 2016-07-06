var express = require('express');
var morgan = require('morgan');
var bodyParser = require("body-parser");
var IO = require("./io/IO");
var app = express();

//app.use(morgan(':url'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname));
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css/dist'));


var sockets = [];
var io = new IO(app);
io.onConnection = function(socket) {
    sockets.push(socket);
    socket.onMessage = function(message) {
        sockets.forEach(function(s) {
            if (s !== socket) {
                s.send(message);
            }
        });
    };
    socket.onClose = function() {
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
    };
};

app.listen(8001);
console.log('listening on port 8001');
