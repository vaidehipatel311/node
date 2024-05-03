function one(req, res) {
    res.end('One');
}

function two(req, res) {
    res.end('Two');
}

function three(req, res) {
    res.end('Three');
}

module.exports = {
    one, two, three
};