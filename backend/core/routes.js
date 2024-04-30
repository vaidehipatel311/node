var fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

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
    var token = jwt.sign({ routes }, process.env.SECRET_KEY, { expiresIn: '1d' });

    Object.keys(routes).forEach(moduleName => {
        const moduleRoutes = routes[moduleName];

        moduleRoutes.forEach(obj => {

            const missingKeys = requiredKeys.filter(key => !(key in obj));
            const emptyKeys = requiredKeys.filter(key => key in obj && (!obj[key] && obj[key] !== false));

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

    });

    if (validationErrors.length > 0) {
        validationErrors.forEach(error => console.error(error));
        return false;
    } else {
        return true;
        // createServer();

    }

}

function getRoutes() {
    const controllers = {};
    const modulesPath = path.join(__dirname, '..', 'api');

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

module.exports = { readRoutesFile, validateRoutes, getRoutes };
