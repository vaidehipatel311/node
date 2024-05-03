function signup(req, res) {
    res.end('Admin signed up successfully');
}

function login(req, res) {
    res.end('Admin Logged In successfully');
}

function home(req, res) {
    res.end('Home Page');
}

module.exports = {
    signup, login, home
};