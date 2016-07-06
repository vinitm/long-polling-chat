var logger = function() {};
logger.prototype.start = function() {
    this._startTime = new Date().getTime();
};
logger.prototype.elapsed = function() {
    if (!this._startTime)
        return 0;
    var time = new Date().getTime();
    return (time - this._startTime) / 1000;
};
module.exports = logger;
