var fs = require('fs');
const path = require('path');

function getServices() {
    const services = {};
    const modulesPath = path.join(__dirname, '..', 'api');

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

module.exports = {
    getServices: getServices
};