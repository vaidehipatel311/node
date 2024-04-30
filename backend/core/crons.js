var fs = require('fs');
const path = require('path');

function getCrons() {
    const crons = {};
    const modulesPath = path.join(__dirname, '..', 'crons');
    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(file => {
        const serviceName = path.basename(file, '.js');
        const serviceModule = require(path.join(modulesPath, file));
        crons[serviceName] = serviceModule
    });
    return crons;
}

module.exports = {
    getCrons: getCrons
};