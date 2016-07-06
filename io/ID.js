var id = 1;
var generateID = function() {
    return id++;
};

module.exports = { generateID: generateID }
