var http = require('http');
var colors = require('colors');
var fs = require('fs');
const { signup, login, home } = require('../api/auth/controllers/authController');
colors.enable()

function createServer() {
    http.createServer(function (req, res) {
        if (req.url == '/signup') {
            signup(req, res);
        } else if (req.url == '/login') {
            login(req, res);
        } else if (req.url == '/') {
            home(req, res);
        }
    }).listen(8083, () => {
        console.log('Server is running on port 8083');
    });
}


function readRoutesFile() {

    return new Promise((resolve, reject) => {
        fs.readFile('./api/auth/routes.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));

            }
        });
    });

}

readRoutesFile()
    .then(routes => {
        let validationErrors = [];
        routes.forEach((obj, index) => {
            const requiredKeys = ["path", "method", "action", "public", "globalMiddlewares", "middlewares", "pathFromRoot", "enabled"];
            const missingKeys = requiredKeys.filter(key => !(key in obj));
            const emptyKeys = requiredKeys.filter(key => key in obj && (!obj[key] && obj[key] !== false));
            const validMethods = ['get', 'post', 'delete', 'put', 'patch'];
            const validBooleanValues = [true, false];

            if (missingKeys.length > 0) {
                validationErrors.push(`[Warning]: Missing the following keys: ${missingKeys.join(', ')} in [Module] : [API] :`.underline.yellow);
            } else if (emptyKeys.length > 0) {
                validationErrors.push(`[Warning]: Empty values for the following keys: ${emptyKeys.join(', ')} in [Module] : [API] :`.underline.yellow);
            } else if (!validMethods.includes(obj.method.toLowerCase())) {
                validationErrors.push(`[Error]: Invalid method value "${obj.method}" for [API] :"${obj.path}"`.red);
            } else if (!validBooleanValues.includes(obj.public)) {
                validationErrors.push(`[Error]: Invalid public value "${obj.public}"for [API] : "${obj.path}"`.red);
            } else if (!validBooleanValues.includes(obj.pathFromRoot)) {
                validationErrors.push(`[Error]: Invalid pathFromRoot value "${obj.pathFromRoot}" for [API] : "${obj.path}"`.red);
            } else if (!validBooleanValues.includes(obj.enabled)) {
                validationErrors.push(`[Error]: Invalid enabled value "${obj.enabled}"for [API] : "${obj.path}"`.red);
            }
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => console.error(error));
        } else {
            createServer();
        }
    }).catch(error => {
        console.error("Error reading or validating routes:", error);
    });



