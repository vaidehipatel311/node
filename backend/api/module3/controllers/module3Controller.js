function route1(req, res) {
    res.end('route1');
}

function route2(req, res) {
    res.end('route2');
}

function route3(req, res) {
    res.end('route3');
}

module.exports = {
    route1, route2, route3
};