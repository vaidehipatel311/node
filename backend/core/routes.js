var fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
var colors = require('colors');
const { verifyToken } = require('../middleware/jwtAuthMiddleware');
colors.enable()

function initializeServer(createServer) {
    readRoutesFile()
        .then(routes => {

            const isValid = validateRoutes(routes);
            if (isValid) {

                createServer();
                router.use((req, res, next) => {
                    loadControllerRoutes(req, res, next);
                    next();
                });


            }
        }).catch(error => {
            console.error("Error reading or validating routes:", error);
        });
}

function readRoutesFile() {
    const routes = {}
    var routePath;
    const modulesPath = path.join(__dirname, '..', 'api');
    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);
        const routesFilePath = path.join(modulePath, 'routes.json');
        routePath = path.join(modulePath, 'routes.json');

        if (fs.existsSync(routesFilePath)) {
            try {
                const routesFileContent = fs.readFileSync(routesFilePath, 'utf8');
                const moduleRoutes = JSON.parse(routesFileContent);
                routes[moduleDir] = moduleRoutes;
                return routes;
            } catch (err) {
                console.error(`Error reading or parsing routes.json for module ${moduleDir}:`, err);
            }
        } else {
            console.warn(`[Warning]: No routes.json file found in module ${moduleDir}`);
        }
    });
    return Promise.resolve(routes);
}

function validateRoutes(routes) {
    let validationErrors = [];
    const validMethods = ['get', 'post', 'delete', 'put', 'patch'];
    const requiredKeys = ["path", "method", "action", "public", "globalMiddlewares", "middlewares", "pathFromRoot", "enabled"];
    const validBooleanValues = [true, false];

    Object.keys(routes).forEach(moduleName => {
        const moduleRoutes = routes[moduleName];

        moduleRoutes.forEach((obj, index) => {

            const missingKeys = requiredKeys.filter(key => !(key in obj));
            const emptyKeys = requiredKeys.filter(key => key in obj && (!obj[key] && obj[key] !== false));

            if (missingKeys.length > 0) {
                validationErrors.push(`[Warning]: Missing the following [keys]: ${missingKeys.join(', ')} in [API] ${obj.path}:`.underline.yellow);
            } else if (emptyKeys.length > 0) {
                validationErrors.push(`[Warning]: Empty values for the following [keys]: ${emptyKeys.join(', ')} [API] : ${obj.path} `.underline.yellow);
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

    });

    if (validationErrors.length > 0) {
        validationErrors.forEach(error => console.error(error));
        return true;
    }
    else { return true; }
}

function loadRoutes() {
    const routes = [];
    const modulesPath = path.join(__dirname, '..', 'api');

    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(moduleDir => {
        const routesFilePath = path.join(modulesPath, moduleDir, 'routes.json');
        if (fs.existsSync(routesFilePath)) {
            try {
                const routesData = fs.readFileSync(routesFilePath, 'utf8');
                const moduleRoutes = JSON.parse(routesData);
                routes.push(...moduleRoutes.map(route => ({ ...route, module: moduleDir })));
            } catch (err) {
                console.error(`Error loading routes from module ${moduleDir}:`, err);
            }
        } else { console.error(`routes.json file not found in module ${moduleDir}`) }
    });

    return routes;
}

function loadControllerRoutes(req, res, next) {
    const routes = loadRoutes();

    for (const route of routes) {
        if (req.url === route.path) {
            const [moduleName, functionName] = route.action.split('.');
            const controllerFolder = path.join(__dirname, '..', 'api', moduleName, 'controllers');
            const controllerFiles = fs.readdirSync(controllerFolder).filter(file => file.endsWith('.js'));

            for (const file of controllerFiles) {
                const controllerPath = path.join(controllerFolder, file);
                const controller = require(controllerPath);
                if (controller && typeof controller[functionName] === 'function') {
                    if (route.public) {
                        controller[functionName](req, res);
                    } else {
                        verifyToken(req, res, next)
                    }
                    return;
                }
            }
        }
    }
}

module.exports = { initializeServer, router };
