var fs = require('fs');
const path = require('path');

function getFunctions() {
    const functions = {};
    const modulesPath = path.join(__dirname, '..', 'api');

    const moduleDirectories = fs.readdirSync(modulesPath);

    moduleDirectories.forEach(moduleDir => {
        const modulePath = path.join(modulesPath, moduleDir);

        const functionsPath = path.join(modulePath, 'functions');
        try {
            if (fs.existsSync(functionsPath)) {
                const functionsFiles = fs.readdirSync(functionsPath);

                functionsFiles.forEach(file => {
                    if (file.startsWith('module')) {
                        const functionName = path.basename(file, '.js');
                        const functionModule = require(path.join(functionsPath, file));
                        functions[functionName] = functionModule
                    }
                });
            }
        } catch (err) {
            console.warn(err);
        }
    });

    return functions;
}

module.exports = {
    getFunctions: getFunctions
};