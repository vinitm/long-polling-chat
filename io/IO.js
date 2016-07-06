var ID = require("./ID");
var Socket = require("./socket");
var URLs=require("../URLs");

var connectURL = URLs.connectURL;


var IO = function(app) {
    this.app = app;
    this._waitForConnections();
};

IO.prototype.onConnection = function(socket) {};


IO.prototype._waitForConnections = function() {
    var self = this;
    self.app.get(connectURL, function(req, res) {
        var id = ID.generateID();
        console.log(JSON.stringify({ id: id }));
        res.end(JSON.stringify({ id: id }));

        var socket = new Socket({ id: id, app: self.app });
        self.onConnection(socket);
    });

};


module.exports = IO;
