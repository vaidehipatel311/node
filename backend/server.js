var http = require('http');
var colors = require('colors');
const { getServices } = require('./core/services.js');
const { getFunctions } = require('./core/functions.js');
const { getCrons } = require('./core/crons.js');
const { readRoutesFile, validateRoutes, getRoutes } = require('./core/routes.js')

require('dotenv').config();
colors.enable()

const framework = {
    services: getServices(),
    functions: getFunctions(),
    crons: getCrons(),
    routes: getRoutes(),
};

global.framework = framework;


function createServer() {
    http.createServer(function (req, res) {
        // if (req.url == '/signup') {
        framework.routes.module1.module1Controller.signup();
        // } else if (req.url == '/login') {
        framework.routes.module1.module1Controller.login();
        // } else if (req.url == '/') {
        framework.routes.module1.module1Controller.home();
        // }
    }).listen(8083, () => {
        console.log('Server is running on port 8083');
    });
}

readRoutesFile()
    .then(routes => {

        const isValid = validateRoutes(routes);
        if (isValid) {
            createServer();
            framework.services.module1.module1Services.myService();
        }

    }).catch(error => {
        console.error("Error reading or validating routes:", error);
    });


