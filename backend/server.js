var http = require('http');
var colors = require('colors');
var fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
colors.enable()

function getServices() {
    const services = {};
    const modulesPath = path.join(__dirname, '.', 'api');

    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);

        const servicesPath = path.join(modulePath, 'services');

        const servicesFiles = fs.readdirSync(servicesPath);

        servicesFiles.forEach(file => {
            if (file.startsWith('module')) {
                const serviceName = path.basename(file, '.js');
                const serviceModule = require(path.join(servicesPath, file));
                services[moduleDir] = { [serviceName]: serviceModule }
            }
        });

    });

    return services;
}

function getFunctions() {
    const functions = {};
    const modulesPath = path.join(__dirname, '.', 'core', 'functions');
    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(file => {
        const serviceName = path.basename(file, '.js');
        const serviceModule = require(path.join(modulesPath, file));
        functions[serviceName] = serviceModule
    });
    return functions;
}

function getCrons() {
    const crons = {};
    const modulesPath = path.join(__dirname, '.', 'core', 'crons');
    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(file => {
        const serviceName = path.basename(file, '.js');
        const serviceModule = require(path.join(modulesPath, file));
        crons[serviceName] = serviceModule
    });
    return crons;
}

function getControllers() {
    const controllers = {};
    const modulesPath = path.join(__dirname, '.', 'api');

    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);

        const controllersPath = path.join(modulePath, 'controllers');

        const controllerFiles = fs.readdirSync(controllersPath);

        controllerFiles.forEach(file => {
            const controllerName = path.basename(file, '.js');
            const controllerModule = require(path.join(controllersPath, file));
            controllers[moduleDir] = { [controllerName]: controllerModule }
        });
    });
    return controllers;
}

// function getServices() {
//     const services = {};
//     const modulesPath = path.join(__dirname, '.', 'core', 'services');

//     const moduleDirectories = fs.readdirSync(modulesPath);

//     moduleDirectories.forEach(file => {
//         // const modulePath = path.join(modulesPath, moduleDir);

//         // const servicesPath = path.join(modulePath, 'services');

//         // const servicesFiles = fs.readdirSync(servicesPath);

//         // servicesFiles.forEach(file => {
//         // if (file.startsWith('module')) {
//         const serviceName = path.basename(file, '.js');
//         const moduleName = serviceName.split('S')[0];

//         const serviceModule = require(path.join(modulesPath, file));
//         console.log(serviceModule);
//         services[moduleName] = { [serviceName]: serviceModule }
//     }
//         // });

//         // }
//     );

//     return services;
// }

global.framework = {
    services: getServices(),
    functions: getFunctions(),
    crons: getCrons(),
    controllers: getControllers(),
};

module.exports = global.framework;


function createServer() {
    http.createServer(function (req, res) {
        if (req.url == '/signup') {
            framework.controllers.module1.module1Controller.signup(req, res);
        } else if (req.url == '/login') {
            framework.controllers.module1.module1Controller.login(req, res);
        } else if (req.url == '/') {
            framework.controllers.module1.module1Controller.home(req, res);
        }
    }).listen(8083, () => {
        console.log('Server is running on port 8083');
    });
}


function readRoutesFile() {

    return new Promise((resolve, reject) => {
        fs.readFile('./core/routes.json', (err, data) => {
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
        var token = jwt.sign({ routes }, process.env.SECRET_KEY, { expiresIn: '1d' });

        routes.forEach((obj, index) => {
            console.log(obj.action, obj.path);

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
            else if (obj.public === false) {
                if (!token) {
                    validationErrors.push(`\n[Error]: No token provided[API]: ${obj.path}`)
                }
                else {
                    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                        if (err) {
                            validationErrors.push(`\n[Error]: Invalid token[API]: ${obj.path}`);
                        }
                        console.log(obj.path, '---> Token Verified');
                    });
                    return
                }
            }
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => console.error(error));
        } else {
            createServer();
            framework.services.module1.module1Services.myService();
            framework.functions.fileUtils.readJSONFile('./core/functions/function1.js');
            framework.functions.function1.myFunction1();
            // framework.crons.cron1.myCron1();

        }
    }).catch(error => {
        console.error("Error reading or validating routes:", error);
    });
