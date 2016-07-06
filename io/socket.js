var URLs = require("../URLs");
var Logger = require("./TimeLogger");
var logger = new Logger();

var sendURL = URLs.sendURL;
var receiveURL = URLs.receiveURL;

var mSocket = function(options) {
    this.id = options.id;
    this.app = options.app;
    this._messages = [];
    this._isSendConnectionOpen = false;
    this._listenToSendConnection();
    this._listenToReceiveConnection();
    this._checkTimeWithoutConnection();
}

mSocket.prototype._removeMessages = function(countFromBeginning) {
    this._messages.splice(0, countFromBeginning);
};

mSocket.prototype.onMessage = function(message) {};

mSocket.prototype.onClose = function() {};

mSocket.prototype.send = function(message) {
    this._messages.push(message);
};

mSocket.prototype._sendMessage = function(res) {
	var count = this._messages.length;
    var messages = JSON.stringify({ messages: this._messages });
    this._removeMessages(count);
    res.end(messages);
};

mSocket.prototype.keepConnectionOpen = function(res) {
    var self = this;
    var interval = setInterval(function() {
        if (self._messages.length > 0){
            self._sendMessage(res);
            clearInterval(interval);
        }
    }, 100);
};

mSocket.prototype._listenToSendConnection = function() {
    var self = this;
    logger.start();
    self.app.get(receiveURL + '/' + this.id, function(req, res) {
        logger.start();
        var count = self._messages.length;
        if (count === 0)
            self.keepConnectionOpen(res);
        else
            self._sendMessage(res);
    });
};


mSocket.prototype._listenToReceiveConnection = function() {
    var self = this;
    self.app.post(sendURL + '/' + this.id, function(req, res) {
        logger.start();
        var message = req.body.message;
        self.onMessage(message);
        res.end();
    });
};

mSocket.prototype._checkTimeWithoutConnection = function() {
    var self = this;
    setInterval(function() {
        if (logger.elapsed >= 20)
            self._onClose();
    }, 1000);
};


mSocket.prototype._removeAppRoutes = function(method, route) {
    var self = this;
    var methodRoutes = self.app.routes[method];
    for (k in methodRoutes) {
        if (methodRoutes[k].path + "" === route + "") {
            methodRoutes.splice(k, 1);
            break;
        }
    }
};

mSocket.prototype._removePostRoutes = function() {
    this._removeAppRoutes('post', sendURL + '/' + this.id);
};

mSocket.prototype._removeGetRoutes = function() {
    this._removeAppRoutes('get', receiveURL + '/' + this.id);
};

mSocket.prototype._onClose = function() {
    this._removePostRoutes();
    this._removeGetRoutes();
    this.app = undefined;
    this.onClose();
};

module.exports = mSocket;
