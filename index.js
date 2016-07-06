var response = $('#response');
var input = $('input');

(function() {

    var connectURL = '/commet/connect';
    var sendURL = '/comet/send';
    var receiveURL = '/comet/receive';


    var mSocket = function() {
        this.connect();
    };

    mSocket.prototype._getId = function() {
        var self = this;
        return $.get(connectURL).then(function(response) {
            var parsedRequest = self.parse(response);
            return parsedRequest.id;
        });
    };

    mSocket.prototype._setUpReceiveConnection = function() {
        var self = this;
        return $.get(receiveURL + '/' + self.id).then(function(response) {
            var messages = self.parse(response).messages;
            messages.forEach(function(message) {
                self.onMessage(message);
            });
            self._setUpReceiveConnection();
        });
    };

    mSocket.prototype.connect = function() {
        var self = this;
        return self._getId().then(function(id) {
            self.id = id
            self._setUpReceiveConnection();
        });
    };


    mSocket.prototype.send = function(message) {
        var body = {
            message: message
        };
        return $.post(sendURL + '/' + this.id, body);
    };

    mSocket.prototype.onMessage = function() {};

    mSocket.prototype.parse = function(request) {
        var requestObj = JSON.parse(request);
        return requestObj;
    };

    window.mSocket = mSocket;
})();

var socket = new mSocket();
socket.onMessage = function(message) {
    response.html(response.html() + '<br>' + '<div class="chip right">' + message + '</div>');
};


var onClick = function(event) {
    event.preventDefault();
    var message = input.val();
    socket.send(message);
}

$('button').click(onClick);
