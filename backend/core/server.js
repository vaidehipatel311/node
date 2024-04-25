var http = require('http');
var colors = require('colors');
var fs = require('fs');
const path = require('path');
const { signup, login, home } = require('../api/module1/controllers/authController');
// const module1Services = require('../api/module1/services/module1Services');
// const demo = require('../app');

colors.enable()

function loadServices() {
    const services = {};
    const modulesPath = path.join(__dirname, '..', 'api');



    // Read the contents of the modules directory
    const moduleDirectories = fs.readdirSync(modulesPath);



    // Iterate over each module directory
    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const moduleStat = fs.statSync(modulePath);


        // Check if it's a directory
        if (moduleStat.isDirectory()) {
            const servicesPath = path.join(modulePath, 'services');
            console.log(servicesPath);

            // const servicesFiles = fs.readdirSync(servicesPath);

            // Iterate over each file in the services directory
            // servicesFiles.forEach(file => {
            //     // Assuming services file starts with 'module'
            //     if (file.startsWith('module')) {
            //         const serviceName = path.basename(file, '.js');
            //         const serviceModule = require(path.join(servicesPath, file));
            //         services[moduleDir] = serviceModule;
            //     }
            // });

            if (fs.existsSync(servicesPath)) {
                const serviceFile = path.join(servicesPath, 'service.js');

                // Check if the service file exists
                if (fs.existsSync(serviceFile)) {
                    const serviceModule = require(serviceFile);
                    services[moduleDir] = serviceModule;
                }
            }
        }
    });

    return services;
}


global.framework = {
    // services: {
    //     module1: {
    //         module1Services: module1Services,
    //     }
    // }

    services: loadServices()
};

// global.framework.services.module1.module1Services = require('../api/module1/services/module1Services');

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
        fs.readFile('./api/module1/routes.json', (err, data) => {
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
            // framework.services.module1.module1Services.myService();
        }
    }).catch(error => {
        console.error("Error reading or validating routes:", error);
    });



